// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "../utils/Validator.sol";
import "../interface/IPrivateERC20.sol";
import "../private_contract/PrivateToken.sol";
import "../axiompay/AxiomPay.sol";

contract TwinTokenPool is Ownable {
    event Register(
        address originalERC20,
        address privateERC20,
        address axiomPay,
        uint256 paillierNN
    );

    struct AxiomAddress {
        IERC20Metadata originalToken;
        IPrivateERC20 privateToken;
    }

    struct PoolInfo {
        address axiomPay;
        string originalERC20Name;
        string privateERC20Name;
    }

    IAddressBook public addressBook;

    Validator public _validator;

    // map the axiomPay address to twin token addresses
    mapping(AxiomPay => AxiomAddress) private _pool;
    AxiomPay[] private _lists;

    constructor(address owner, Validator validator) Ownable(owner) {
        _validator = validator;
        addressBook = new AddressBook(address(this));
    }

    /**
     * @dev register an existing ERC20 contract to the pool
     * @param originalERC20 - the original ERC20 contract address you want to register
     * @param paillierNN - the paillier modular number
     * @return - the axiomPay contract address
     */
    function register(
        IERC20Metadata originalERC20,
        uint256 paillierNN
    ) external onlyOwner returns (address) {
        bytes32 _salt = keccak256(abi.encodePacked(address(originalERC20)));
        IPrivateERC20 privateToken = new PrivateToken{salt: _salt}(
            originalERC20,
            address(this),
            paillierNN,
            addressBook
        );
        AxiomPay axiomPay = new AxiomPay{salt: _salt}(
            originalERC20,
            privateToken,
            _validator,
            addressBook
        );
        privateToken.registerAxiomPayAddress(address(axiomPay));
        _pool[axiomPay] = AxiomAddress({
            originalToken: originalERC20,
            privateToken: privateToken
        });
        _lists.push(axiomPay);
        emit Register(
            address(originalERC20),
            address(privateToken),
            address(axiomPay),
            paillierNN
        );
        return address(axiomPay);
    }

    /**
     * @dev show all registered ERC20 contracts
     * @return - the list of registered ERC20 contracts, return a list of OriginalERC20Detail struct
     */
    function showLists() external view returns (PoolInfo[] memory) {
        PoolInfo[] memory infos = new PoolInfo[](_lists.length);
        for (uint i = 0; i < _lists.length; i++) {
            infos[i] = PoolInfo({
                axiomPay: address(_lists[i]),
                originalERC20Name: _pool[_lists[i]].originalToken.name(),
                privateERC20Name: _pool[_lists[i]].privateToken.name()
            });
        }
        return infos;
    }

    /**
     * register a private account
     * @param owner - the address you want to register
     */
    function registerAccount(
        address owner,
        string calldata publicKey
    ) external {
        addressBook.registerAccount(owner, publicKey);
    }

    /**
     * check an address is private or not
     * @param owner - the address you want to query
     * @return - true -> private, false -> public
     */
    function isPrivate(address owner) external view returns (bool) {
        return addressBook.isPrivate(owner);
    }

    /**
     * @dev get a given user's public key
     * @param owner - the user you want to query
     * @return publicKey - the given user's public key
     */
    function getPublicKey(address owner) external view returns (string memory) {
        return addressBook.getUserPublicKey(owner);
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../interface/IPrivateERC20.sol";
import "../interface/IAddressBook.sol";
import {CurveBabyJubJub} from "../library/Curve.sol";
import "../errors/errors.sol";

contract PrivateToken is IPrivateERC20, Ownable {
    string public name;
    string public symbol;
    uint8 public decimals = 2;
    uint256 public totalSupply;
    uint256 private paillierNN;
    IAddressBook private addressBook;
    address private axiomPay;

    mapping(address => balance) private balances;

    mapping(address => mapping(address => balance)) private allowances;

    modifier accountExist(address account) {
        if (!addressBook.isPrivate(account)) {
            revert ErrAddressNotExist(account);
        }
        _;
    }

    modifier onlyFromAxiomPay() {
        if (msg.sender != axiomPay) {
            revert ErrOnlyAcceptAxiomPayTx(msg.sender, axiomPay);
        }
        _;
    }

    constructor(
        IERC20Metadata _token,
        address _owner,
        uint256 _paillierNN,
        IAddressBook _addressBook
    ) Ownable(_owner) {
        name = string.concat("pr", _token.name());
        symbol = string.concat("pr", _token.symbol());
        totalSupply =
            _token.totalSupply() /
            10 ** (_token.decimals() - decimals);
        paillierNN = _paillierNN;
        addressBook = _addressBook;
    }

    function registerAxiomPayAddress(address _axiomPay) external onlyOwner {
        axiomPay = _axiomPay;
    }

    /**
     * private transfer from a private account to another private account
     * @param from - address from
     * @param to - receiver address
     * @param fromC1 - the sender encrypted C1 of the amount
     * @param fromC2 - the sender encrypted C2 of the amount
     * @param toC1 - the receiver encrypted C1 of the amount
     * @param toC2 - the receiver encrypted C2 of the amount
     * @return bool - if the transfer success
     */
    function privateTransfer(
        address from,
        address to,
        uint[2] calldata fromC1,
        uint[2] calldata fromC2,
        uint[2] calldata toC1,
        uint[2] calldata toC2,
        uint256 fromViewKey,
        uint256 toViewKey
    )
        external
        override
        accountExist(from)
        accountExist(to)
        onlyFromAxiomPay
        returns (bool)
    {
        balance storage fromBalance = balances[from];
        balance storage toBalance = balances[to];
        (fromBalance.c1[0], fromBalance.c1[1]) = CurveBabyJubJub.pointSub(
            fromBalance.c1[0],
            fromBalance.c1[1],
            fromC1[0],
            fromC1[1]
        );
        (fromBalance.c2[0], fromBalance.c2[1]) = CurveBabyJubJub.pointSub(
            fromBalance.c2[0],
            fromBalance.c2[1],
            fromC2[0],
            fromC2[1]
        );
        (toBalance.c1[0], toBalance.c1[1]) = CurveBabyJubJub.pointAdd(
            toBalance.c1[0],
            toBalance.c1[1],
            toC1[0],
            toC1[1]
        );
        (toBalance.c2[0], toBalance.c2[1]) = CurveBabyJubJub.pointAdd(
            toBalance.c2[0],
            toBalance.c2[1],
            toC2[0],
            toC2[1]
        );
        emit PrivateTransfer(
            from,
            to,
            fromC1,
            fromC2,
            toC1,
            toC2,
            fromViewKey,
            toViewKey
        );
        return true;
    }

    /**
     * private transfer from a public account to a private account. In priavate contract, only add
     * sepecific amount to receiver, in other words, private token is not a zero sum contract
     * @param to - receiver address
     * @param toC1 - the receiver encrypted C1 of the amount
     * @param toC2 - the receiver encrypted C2 of the amount
     * @return bool - if the transfer success
     */
    function privateTransferTo(
        address to,
        uint[2] calldata toC1,
        uint[2] calldata toC2,
        uint256 viewKey
    ) external accountExist(to) onlyFromAxiomPay returns (bool) {
        balance storage toBalance = balances[to];
        (toBalance.c1[0], toBalance.c1[1]) = CurveBabyJubJub.pointAdd(
            toBalance.c1[0],
            toBalance.c1[1],
            toC1[0],
            toC1[1]
        );
        (toBalance.c2[0], toBalance.c2[1]) = CurveBabyJubJub.pointAdd(
            toBalance.c2[0],
            toBalance.c2[1],
            toC2[0],
            toC2[1]
        );
        emit PrivateTransferTo(to, toC1, toC2, viewKey);
        return true;
    }

    /**
     * private transfer from a private account to a public account. In priavate contract, only subtract
     * sepecific amount from sender, in other words, private token is not a zero sum contract
     * @param from - sender address
     * @param fromC1 - the sender encrypted C1 of the amount
     * @param fromC2 - the sender encrypted C2 of the amount
     * @return bool - if the transfer success
     */
    function privateTransferFrom(
        address from,
        uint[2] calldata fromC1,
        uint[2] calldata fromC2,
        uint256 viewKey
    ) external accountExist(from) onlyFromAxiomPay returns (bool) {
        balance storage fromBalance = balances[from];
        (fromBalance.c1[0], fromBalance.c1[1]) = CurveBabyJubJub.pointSub(
            fromBalance.c1[0],
            fromBalance.c1[1],
            fromC1[0],
            fromC1[1]
        );
        (fromBalance.c2[0], fromBalance.c2[1]) = CurveBabyJubJub.pointSub(
            fromBalance.c2[0],
            fromBalance.c2[1],
            fromC2[0],
            fromC2[1]
        );
        emit PrivateTransferFrom(from, fromC1, fromC2, viewKey);
        return true;
    }

    /**
     * return the balance of a private account
     * @param owner - the address you want to query
     * @return - balance(bool isExist, uint[2] c1, uint[2] c2)
     */
    function privateBalanceOf(
        address owner
    ) external view override returns (balance memory) {
        return balances[owner];
    }

    /**
     * @dev transfer interface, to implement a standard ERC20 contract
     * @param to - receiver address
     * @param value - the total transfer value
     * @return - always revert!
     */
    function transfer(
        address to,
        uint256 value
    ) external pure override returns (bool) {
        bytes memory param = abi.encodePacked(to, value);
        revert ErrNotImplemented(param);
    }

    /**
     * allowance interface, to implement a standard ERC20 contract
     * @param owner - the allownace owner
     * @param spender - the allownace spender
     * @return - always revert!
     */
    function allowance(
        address owner,
        address spender
    ) external pure override returns (uint256) {
        bytes memory param = abi.encodePacked(owner, spender);
        revert ErrNotImplemented(param);
    }

    /**
     * approve interface, to implement a standard ERC20 contract
     * @param spender - the spender of the approve
     * @param value - the total value of the approve
     * @return - always revert!
     */
    function approve(
        address spender,
        uint256 value
    ) external pure override returns (bool) {
        bytes memory param = abi.encodePacked(spender, value);
        revert ErrNotImplemented(param);
    }

    /**
     * transferFrom interface, to implement a standard ERC20 contract
     * @param from - the transfer sender
     * @param to - the transfer receiver
     * @param value - the total value of the transfer
     * @return - always revert!
     */
    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external pure override returns (bool) {
        bytes memory param = abi.encodePacked(from, to, value);
        revert ErrNotImplemented(param);
    }

    /**
     * balanceOf interface, to implement a standard ERC20 contract
     * @param owner - the account owner you want to query
     * @return - always revert!
     */
    function balanceOf(address owner) external view override returns (uint256) {
        return balances[owner].c1[0];
    }
}

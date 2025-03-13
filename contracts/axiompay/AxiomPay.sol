// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../private_contract/PrivateToken.sol";
import "../utils/AddressBook.sol";
import "../interface/IAddressBook.sol";
import "../interface/IPrivateERC20.sol";
import "../utils/Validator.sol";
import "../errors/errors.sol";

/**
 * @title AxiomPay
 * the core contract of AxiomPay
 * @author Axiomesh
 */
contract AxiomPay is IERC20Metadata {
    IERC20Metadata private orignalToken;
    IPrivateERC20 private privateToken;
    IAddressBook private addressBook;
    Validator private validator;
    string public description;
    string public name;
    string public symbol;
    uint256 private MAXVALUE = 4294967295;

    enum TransactionType {
        plainToPlain,
        plainToPrivate,
        privateToPlain,
        privateToPrivate
    }

    modifier onlyPlainToPlain(address from, address to) {
        TransactionType txType = getTransactionType(from, to);
        if (txType != TransactionType.plainToPlain) {
            revert ErrTxTypeNotSupported(uint8(txType));
        }
        _;
    }

    modifier validatePriv2Priv(
        PrivatePrivate memory data,
        IPrivateERC20.balance memory balance,
        bytes memory proof
    ) {
        if (
            !validator.validatePriv2Priv(
                data.fromC1,
                data.fromC2,
                data.toC1,
                data.toC2,
                balance.c1,
                balance.c2,
                proof
            )
        ) {
            revert ErrValidateFailed();
        }
        _;
    }

    modifier validatePriv2Pub(
        PrivatePublic memory data,
        IPrivateERC20.balance memory balance,
        bytes memory proof
    ) {
        if (
            !validator.validatePriv2Pub(
                data.C1,
                data.C2,
                balance.c1,
                balance.c2,
                proof
            )
        ) {
            revert ErrValidateFailed();
        }
        _;
    }

    modifier validatePub2Priv(PrivatePublic memory data, bytes memory proof) {
        if (!validator.validatePub2Priv(data.C1, data.C2, proof)) {
            revert ErrValidateFailed();
        }
        _;
    }

    constructor(
        IERC20Metadata _orignalToken,
        IPrivateERC20 _privateToken,
        Validator _validator,
        IAddressBook _addressBook
    ) {
        privateToken = _privateToken;
        orignalToken = _orignalToken;
        validator = _validator;
        addressBook = _addressBook;
        description = string.concat(orignalToken.name(), " AxiomPay Service");
        name = string.concat("ap", orignalToken.name());
        symbol = string.concat("ap", orignalToken.symbol());
    }

    /**
     * return the transaction type, one of plainToPlain, plainToPrivate, privateToPlain and privateToPrivate
     * @param from - the transaction from
     * @param to - the transaction to
     * @return - the enum TransactionType
     */
    function getTransactionType(
        address from,
        address to
    ) private view returns (TransactionType) {
        bool fromType = addressBook.isPrivate(from);
        bool toType = addressBook.isPrivate(to);
        uint8 _from;
        uint8 _to;
        assembly {
            _from := fromType
            _to := toType
        }
        return TransactionType(2 * _from + _to);
    }

    /**
     * the total supply of the token, will return the original token directly
     * @return - the total supply
     */
    function totalSupply() external view override returns (uint256) {
        return orignalToken.totalSupply();
    }

    /**
     * the balance of an account
     * @param account - the account you want to query
     * @return - the balance of the given account, it will return the orignal ERC20 result,
     * if you want to get the balance of private token, use privateBalanceOf instead
     */
    function balanceOf(
        address account
    ) external view override returns (uint256) {
        return orignalToken.balanceOf(account);
    }

    /**
     *
     * @param account - the account you want to query
     * @return - the balance of the given account, it will return private ERC20,
     * if you want to get the balance of private token, use privateBalanceOf instead
     */
    function privateBalanceOf(
        address account
    ) public view returns (IPrivateERC20.balance memory) {
        return privateToken.privateBalanceOf(account);
    }

    /**
     * transfer some token to another account, only works in plain account to plain account
     * @param to - the receiver address
     * @param value - the total transfer value
     * @return - return if the transfer success
     */
    function transfer(
        address to,
        uint256 value
    ) external override onlyPlainToPlain(msg.sender, to) returns (bool) {
        return orignalToken.transferFrom(msg.sender, to, value);
    }

    function allowance(
        address owner,
        address spender
    )
        external
        view
        override
        onlyPlainToPlain(owner, spender)
        returns (uint256)
    {
        return orignalToken.allowance(owner, spender);
    }

    function approve(
        address spender,
        uint256 value
    ) external override returns (bool) {
        return orignalToken.approve(spender, value);
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) external override onlyPlainToPlain(from, to) returns (bool) {
        return orignalToken.transferFrom(from, to, value);
    }

    function decimals() external view override returns (uint8) {
        return orignalToken.decimals();
    }

    struct PrivatePublic {
        uint[2] C1;
        uint[2] C2;
        uint256 viewKey;
        bytes proof;
    }

    struct PrivatePrivate {
        uint[2] fromC1;
        uint[2] fromC2;
        uint[2] toC1;
        uint[2] toC2;
        uint256 fromViewKey;
        uint256 toViewKey;
        bytes proof;
    }

    /**
     * @dev the entrance of private transfer, user should pack encrypted data and proof in data,
     * the function will automatically check the tx type and routes to certain transfer logic
     * @param to - the private transfer receiver
     * @param value - the private transfer value
     * @param data - all encrypted data and proof
     */
    function privateTransfer(
        address from,
        address to,
        uint256 value,
        bytes calldata data
    ) external returns (bool) {
        // todo: support EIP-712 to validate the relationship btw msg.sender and address from
        IPrivateERC20.balance memory balance = privateBalanceOf(from);
        uint8 originDecimal = orignalToken.decimals();
        uint8 privateDecimal = privateToken.decimals();
        uint256 converted = value % (10 ** (originDecimal - privateDecimal));
        if (converted > MAXVALUE) {
            revert ErrValueOverflow(value, MAXVALUE);
        }
        TransactionType txType = getTransactionType(from, to);
        if (txType == TransactionType.plainToPlain) {
            revert ErrTxTypeNotSupported(uint8(txType));
        }
        if (txType == TransactionType.plainToPrivate) {
            if (converted != 0) {
                revert ErrDecimalTruncate(value);
            }
            if (from != msg.sender) {
                revert ErrPermissionDenied();
            }
            PrivatePublic memory plainToPrivateData;
            (plainToPrivateData) = abi.decode(data, (PrivatePublic));
            return transferFromPlainToPrivate(to, value, plainToPrivateData);
        }
        if (txType == TransactionType.privateToPlain) {
            if (converted != 0) {
                revert ErrDecimalTruncate(value);
            }
            PrivatePublic memory privateToPlainData;
            (privateToPlainData) = abi.decode(data, (PrivatePublic));
            return
                transferFromPrivateToPublic(
                    from,
                    to,
                    value,
                    balance,
                    privateToPlainData
                );
        }
        PrivatePrivate memory _data;
        (_data) = abi.decode(data, (PrivatePrivate));
        return transferFromPrivateToPrivate(from, to, balance, _data);
    }

    function transferFromPlainToPrivate(
        address to,
        uint256 amount,
        PrivatePublic memory data
    ) private validatePub2Priv(data, data.proof) returns (bool) {
        bool success = orignalToken.transferFrom(
            msg.sender,
            address(this),
            amount
        );
        if (!success) {
            revert ErrPlainTransferFailed();
        }
        return
            privateToken.privateTransferTo(to, data.C1, data.C2, data.viewKey);
    }

    function transferFromPrivateToPublic(
        address from,
        address to,
        uint256 amount,
        IPrivateERC20.balance memory balance,
        PrivatePublic memory data
    ) private validatePriv2Pub(data, balance, data.proof) returns (bool) {
        bool success = privateToken.privateTransferFrom(
            from,
            data.C1,
            data.C2,
            data.viewKey
        );
        if (!success) {
            revert ErrPrivateTransferFailed();
        }
        return orignalToken.transfer(to, amount);
    }

    function transferFromPrivateToPrivate(
        address from,
        address to,
        IPrivateERC20.balance memory balance,
        PrivatePrivate memory data
    ) private validatePriv2Priv(data, balance, data.proof) returns (bool) {
        return
            privateToken.privateTransfer(
                from,
                to,
                data.fromC1,
                data.fromC2,
                data.toC1,
                data.toC2,
                data.fromViewKey,
                data.toViewKey
            );
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interface/IAddressBook.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../errors/errors.sol";
import {CurveBabyJubJub} from "../library/Curve.sol";

contract AddressBook is IAddressBook, Ownable {
    // map axiompay contract address to user address to is Private
    mapping(address => UserInfo) private _addressBook;

    constructor(address owner) Ownable(owner) {}

    /**
     * @dev check the property of a user
     * @param user - the user address you want to check
     * @return bool - return the property of a user, true -> Private, false -> Public
     */
    function isPrivate(address user) external view override returns (bool) {
        return _addressBook[user].isPrivate;
    }

    /**
     * @dev register an account to axiompay
     * @param user - the user address
     * @param publicKey - the given user's public key
     */
    function registerAccount(
        address user,
        string memory publicKey
    ) external override onlyOwner {
        if (!_addressBook[user].isPrivate) {
            _addressBook[user] = UserInfo(true, publicKey);
        }
    }

    /**
     * @dev get the given user's public key
     * @param user - the user address you want to query
     * @return publicKey - the given user's public key
     */
    function getUserPublicKey(
        address user
    ) external view override returns (string memory) {
        return _addressBook[user].publicKey;
    }
}

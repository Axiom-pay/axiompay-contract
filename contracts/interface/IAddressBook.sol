// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAddressBook {
    struct UserInfo {
        bool isPrivate;
        string publicKey;
    }

    /**
     * @dev check the property of a user
     * @param user - the user address you want to check
     * @return bool - return the property of a user, true -> Private, false -> Public
     */
    function isPrivate(address user) external view returns (bool);

    /**
     * @dev register an account to axiompay
     * @param user - the user address
     * @param publicKey - the given user's public key
     */
    function registerAccount(address user, string memory publicKey) external;

    /**
     * @dev get the given user's public key
     * @param user - the user address you want to query
     * @return publicKey - the given user's public key
     */
    function getUserPublicKey(
        address user
    ) external view returns (string memory);
}

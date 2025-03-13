// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library Address {
    function isValidAddress(string memory _address) public pure returns (bool) {
        // Check if the string length is 42 characters (including the '0x' prefix)
        if (bytes(_address).length != 42) {
            return false;
        }

        // Check if the string starts with '0x'
        if (bytes(_address)[0] != 0x30 || bytes(_address)[1] != 0x78) {
            return false;
        }

        // Check if all characters after '0x' are hexadecimal
        for (uint i = 2; i < bytes(_address).length; i++) {
            if (
                !(bytes(_address)[i] >= 0x30 && bytes(_address)[i] <= 0x39) &&
                !(bytes(_address)[i] >= 0x61 && bytes(_address)[i] <= 0x66) &&
                !(bytes(_address)[i] >= 0x41 && bytes(_address)[i] <= 0x46)
            ) {
                return false;
            }
        }

        return true;
    }
}

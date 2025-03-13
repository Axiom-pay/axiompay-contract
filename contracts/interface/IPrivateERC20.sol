// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

interface IPrivateERC20 is IERC20Metadata {
    struct balance {
        uint[2] c1;
        uint[2] c2;
    }

    event PrivateTransfer(
        address indexed from,
        address indexed to,
        uint[2] fromC1,
        uint[2] fromC2,
        uint[2] toC1,
        uint[2] toC2,
        uint256 fromViewKey,
        uint256 toViewKey
    );

    event PrivateTransferFrom(
        address indexed from,
        uint[2] fromC1,
        uint[2] fromC2,
        uint256 fromViewKey
    );

    event PrivateTransferTo(
        address indexed to,
        uint[2] toC1,
        uint[2] toC2,
        uint256 toViewKey
    );

    function registerAxiomPayAddress(address _axiomPay) external;

    function privateTransfer(
        address from,
        address to,
        uint[2] calldata fromC1,
        uint[2] calldata fromC2,
        uint[2] calldata toC1,
        uint[2] calldata toC2,
        uint256 fromViewKey,
        uint256 toViewKey
    ) external returns (bool);

    function privateTransferTo(
        address to,
        uint[2] calldata toC1,
        uint[2] calldata toC2,
        uint256 viewKey
    ) external returns (bool);

    function privateTransferFrom(
        address from,
        uint[2] calldata fromC1,
        uint[2] calldata fromC2,
        uint256 viewKey
    ) external returns (bool);

    function privateBalanceOf(
        address owner
    ) external view returns (balance memory);
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @dev the Tx type is not authorized to do some operation,
/// like transfer can only happens in plain account to plain account
error ErrTxTypeNotSupported(uint8 actual);

/// @dev zero knowledge proof validate failed
error ErrValidateFailed();

/// @dev invoke original plain ERC20 failed
error ErrPlainTransferFailed();

/// @dev invoke private ERC20 failed
error ErrPrivateTransferFailed();

/// @dev an address is not a private address and call a private contract
error ErrAddressNotExist(address owner);

/// @dev permission denied
error ErrPermissionDenied();

/// @dev invoke some not yet implemented function
error ErrNotImplemented(bytes param);

/// @dev only accept transaction from AxiomPay contract
error ErrOnlyAcceptAxiomPayTx(address sender, address axiomPay);

/// @dev the value is not divided by 10^16 which leads to truncate
error ErrDecimalTruncate(uint256 value);

/// @dev the value is too large
error ErrValueOverflow(uint256 value, uint256 maxAccepted);

/// @dev the address is not derived from the given public key
error ErrPublicKeyValidateFailed(
    address decodeRes,
    bytes publicKey,
    address user
);

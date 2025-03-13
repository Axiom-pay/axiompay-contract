# Solidity API

## ErrTxTypeNotSupported

```solidity
error ErrTxTypeNotSupported(uint8 actual)
```

_the Tx type is not authorized to do some operation,
like transfer can only happens in plain account to plain account_

## ErrValidateFailed

```solidity
error ErrValidateFailed()
```

_zero knowledge proof validate failed_

## ErrPlainTransferFailed

```solidity
error ErrPlainTransferFailed()
```

_invoke original plain ERC20 failed_

## ErrPrivateTransferFailed

```solidity
error ErrPrivateTransferFailed()
```

_invoke private ERC20 failed_

## ErrAddressNotExist

```solidity
error ErrAddressNotExist(address owner)
```

_an address is not a private address and call a private contract_

## ErrPermissionDenied

```solidity
error ErrPermissionDenied()
```

_permission denied_

## ErrNotImplemented

```solidity
error ErrNotImplemented(bytes param)
```

_invoke some not yet implemented function_

## ErrOnlyAcceptAxiomPayTx

```solidity
error ErrOnlyAcceptAxiomPayTx(address sender, address axiomPay)
```

_only accept transaction from AxiomPay contract_

## ErrDecimalTruncate

```solidity
error ErrDecimalTruncate(uint256 value)
```

_the value is not divided by 10^16 which leads to truncate_

## ErrValueOverflow

```solidity
error ErrValueOverflow(uint256 value, uint256 maxAccepted)
```

_the value is too large_

## ErrPublicKeyValidateFailed

```solidity
error ErrPublicKeyValidateFailed(address decodeRes, bytes publicKey, address user)
```

_the address is not derived from the given public key_


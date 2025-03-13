# Solidity API

## Secp256k1

### GX

```solidity
uint256 GX
```

### GY

```solidity
uint256 GY
```

### AA

```solidity
uint256 AA
```

### BB

```solidity
uint256 BB
```

### PP

```solidity
uint256 PP
```

### add

```solidity
function add(uint256[2] P, uint256[2] Q) internal pure returns (uint256[2])
```

### sub

```solidity
function sub(uint256[2] P, uint256[2] Q) internal pure returns (uint256[2])
```

### compress

```solidity
function compress(uint256[2] P) internal pure returns (uint8 yBit, uint256 x)
```

_See Curve.compress_

### decompress

```solidity
function decompress(uint8 yBit, uint256 x) internal pure returns (uint256[2] P)
```

_See Curve.decompress_


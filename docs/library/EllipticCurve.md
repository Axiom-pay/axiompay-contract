# Solidity API

## EllipticCurve

* @title Elliptic Curve Library
* @dev Library providing arithmetic operations over elliptic curves.
* This library does not check whether the inserted points belong to the curve
* `isOnCurve` function should be used by the library user to check the aforementioned statement.
* @author Witnet Foundation

### invMod

```solidity
function invMod(uint256 _x, uint256 _pp) internal pure returns (uint256)
```

_Modular euclidean inverse of a number (mod p)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _x | uint256 | The number |
| _pp | uint256 | The modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | q such that x*q = 1 (mod _pp) |

### expMod

```solidity
function expMod(uint256 _base, uint256 _exp, uint256 _pp) internal pure returns (uint256)
```

_Modular exponentiation, b^e % _pp.
Source: https://github.com/androlo/standard-contracts/blob/master/contracts/src/crypto/ECCMath.sol_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _base | uint256 | base |
| _exp | uint256 | exponent |
| _pp | uint256 | modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | r such that r = b**e (mod _pp) |

### toAffine

```solidity
function toAffine(uint256 _x, uint256 _y, uint256 _z, uint256 _pp) internal pure returns (uint256, uint256)
```

_Converts a point (x, y, z) expressed in Jacobian coordinates to affine coordinates (x', y', 1)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _x | uint256 | coordinate x |
| _y | uint256 | coordinate y |
| _z | uint256 | coordinate z |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (x', y') affine coordinates |
| [1] | uint256 |  |

### deriveY

```solidity
function deriveY(uint8 _prefix, uint256 _x, uint256 _aa, uint256 _bb, uint256 _pp) internal pure returns (uint256)
```

_Derives the y coordinate from a compressed-format point x [[SEC-1]](https://www.secg.org/SEC1-Ver-1.0.pdf)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _prefix | uint8 | parity byte (0x02 even, 0x03 odd) |
| _x | uint256 | coordinate x |
| _aa | uint256 | constant of curve |
| _bb | uint256 | constant of curve |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | y coordinate y |

### isOnCurve

```solidity
function isOnCurve(uint256 _x, uint256 _y, uint256 _aa, uint256 _bb, uint256 _pp) internal pure returns (bool)
```

_Check whether point (x,y) is on curve defined by a, b, and _pp._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _x | uint256 | coordinate x of P1 |
| _y | uint256 | coordinate y of P1 |
| _aa | uint256 | constant of curve |
| _bb | uint256 | constant of curve |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | true if x,y in the curve, false else |

### ecInv

```solidity
function ecInv(uint256 _x, uint256 _y, uint256 _pp) internal pure returns (uint256, uint256)
```

_Calculate inverse (x, -y) of point (x, y)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _x | uint256 | coordinate x of P1 |
| _y | uint256 | coordinate y of P1 |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (x, -y) |
| [1] | uint256 |  |

### ecAdd

```solidity
function ecAdd(uint256 _x1, uint256 _y1, uint256 _x2, uint256 _y2, uint256 _aa, uint256 _pp) internal pure returns (uint256, uint256)
```

_Add two points (x1, y1) and (x2, y2) in affine coordinates._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _x1 | uint256 | coordinate x of P1 |
| _y1 | uint256 | coordinate y of P1 |
| _x2 | uint256 | coordinate x of P2 |
| _y2 | uint256 | coordinate y of P2 |
| _aa | uint256 | constant of the curve |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (qx, qy) = P1+P2 in affine coordinates |
| [1] | uint256 |  |

### ecSub

```solidity
function ecSub(uint256 _x1, uint256 _y1, uint256 _x2, uint256 _y2, uint256 _aa, uint256 _pp) internal pure returns (uint256, uint256)
```

_Substract two points (x1, y1) and (x2, y2) in affine coordinates._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _x1 | uint256 | coordinate x of P1 |
| _y1 | uint256 | coordinate y of P1 |
| _x2 | uint256 | coordinate x of P2 |
| _y2 | uint256 | coordinate y of P2 |
| _aa | uint256 | constant of the curve |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (qx, qy) = P1-P2 in affine coordinates |
| [1] | uint256 |  |

### ecMul

```solidity
function ecMul(uint256 _k, uint256 _x, uint256 _y, uint256 _aa, uint256 _pp) internal pure returns (uint256, uint256)
```

_Multiply point (x1, y1, z1) times d in affine coordinates._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _k | uint256 | scalar to multiply |
| _x | uint256 | coordinate x of P1 |
| _y | uint256 | coordinate y of P1 |
| _aa | uint256 | constant of the curve |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (qx, qy) = d*P in affine coordinates |
| [1] | uint256 |  |

### jacAdd

```solidity
function jacAdd(uint256 _x1, uint256 _y1, uint256 _z1, uint256 _x2, uint256 _y2, uint256 _z2, uint256 _pp) internal pure returns (uint256, uint256, uint256)
```

_Adds two points (x1, y1, z1) and (x2 y2, z2)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _x1 | uint256 | coordinate x of P1 |
| _y1 | uint256 | coordinate y of P1 |
| _z1 | uint256 | coordinate z of P1 |
| _x2 | uint256 | coordinate x of square |
| _y2 | uint256 | coordinate y of square |
| _z2 | uint256 | coordinate z of square |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (qx, qy, qz) P1+square in Jacobian |
| [1] | uint256 |  |
| [2] | uint256 |  |

### jacDouble

```solidity
function jacDouble(uint256 _x, uint256 _y, uint256 _z, uint256 _aa, uint256 _pp) internal pure returns (uint256, uint256, uint256)
```

_Doubles a points (x, y, z)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _x | uint256 | coordinate x of P1 |
| _y | uint256 | coordinate y of P1 |
| _z | uint256 | coordinate z of P1 |
| _aa | uint256 | the a scalar in the curve equation |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (qx, qy, qz) 2P in Jacobian |
| [1] | uint256 |  |
| [2] | uint256 |  |

### jacMul

```solidity
function jacMul(uint256 _d, uint256 _x, uint256 _y, uint256 _z, uint256 _aa, uint256 _pp) internal pure returns (uint256, uint256, uint256)
```

_Multiply point (x, y, z) times d._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _d | uint256 | scalar to multiply |
| _x | uint256 | coordinate x of P1 |
| _y | uint256 | coordinate y of P1 |
| _z | uint256 | coordinate z of P1 |
| _aa | uint256 | constant of curve |
| _pp | uint256 | the modulus |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | (qx, qy, qz) d*P1 in Jacobian |
| [1] | uint256 |  |
| [2] | uint256 |  |


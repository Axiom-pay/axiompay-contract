# Solidity API

## CurveBabyJubJub

### A

```solidity
uint256 A
```

### D

```solidity
uint256 D
```

### Q

```solidity
uint256 Q
```

### GeneratorX

```solidity
uint256 GeneratorX
```

### GeneratorY

```solidity
uint256 GeneratorY
```

### pointAdd

```solidity
function pointAdd(uint256 _x1, uint256 _y1, uint256 _x2, uint256 _y2) internal view returns (uint256 x3, uint256 y3)
```

_Add 2 points on baby jubjub curve
Formulae for adding 2 points on a twisted Edwards curve:
x3 = (x1y2 + y1x2) / (1 + dx1x2y1y2)
y3 = (y1y2 - ax1x2) / (1 - dx1x2y1y2)_

### pointSub

```solidity
function pointSub(uint256 _x1, uint256 _y1, uint256 _x2, uint256 _y2) internal view returns (uint256 x3, uint256 y3)
```

### pointDouble

```solidity
function pointDouble(uint256 _x1, uint256 _y1) internal view returns (uint256 x2, uint256 y2)
```

_Double a point on baby jubjub curve
Doubling can be performed with the same formula as addition_

### pointMul

```solidity
function pointMul(uint256 _x1, uint256 _y1, uint256 _d) internal view returns (uint256 x2, uint256 y2)
```

_Multiply a point on baby jubjub curve by a scalar
Use the double and add algorithm_

### privateToPublic

```solidity
function privateToPublic(uint256 privateKey) internal view returns (uint256 x, uint256 y)
```

### isOnCurve

```solidity
function isOnCurve(uint256 _x, uint256 _y) internal pure returns (bool)
```

_Check if a given point is on the curve
(168700x^2 + y^2) - (1 + 168696x^2y^2) == 0_

### submod

```solidity
function submod(uint256 _a, uint256 _b, uint256 _mod) internal pure returns (uint256)
```

_Perform modular subtraction_

### inverse

```solidity
function inverse(uint256 _a) internal view returns (uint256)
```

_Compute modular inverse of a number_

### expmod

```solidity
function expmod(uint256 _b, uint256 _e, uint256 _m) internal view returns (uint256 o)
```

_Helper function to call the bigModExp precompile_


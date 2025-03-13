# Solidity API

## AxiomPay

### description

```solidity
string description
```

### name

```solidity
string name
```

_Returns the name of the token._

### symbol

```solidity
string symbol
```

_Returns the symbol of the token._

### TransactionType

```solidity
enum TransactionType {
  plainToPlain,
  plainToPrivate,
  privateToPlain,
  privateToPrivate
}
```

### onlyPlainToPlain

```solidity
modifier onlyPlainToPlain(address from, address to)
```

### onlyValidated

```solidity
modifier onlyValidated(bytes proof)
```

### constructor

```solidity
constructor(contract IERC20Metadata _orignalToken, contract IPrivateERC20 _privateToken, contract IValidator _validator, contract IAddressBook _addressBook) public
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

the total supply of the token, will return the original token directly

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | - the total supply |

### balanceOf

```solidity
function balanceOf(address account) external view returns (uint256)
```

the balance of an account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | - the account you want to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | - the balance of the given account, it will return the orignal ERC20 result, if you want to get the balance of private token, use privateBalanceOf instead |

### privateBalanceOf

```solidity
function privateBalanceOf(address account) external view returns (struct IPrivateERC20.balance)
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | - the account you want to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IPrivateERC20.balance | - the balance of the given account, it will return private ERC20, if you want to get the balance of private token, use privateBalanceOf instead |

### transfer

```solidity
function transfer(address to, uint256 value) external returns (bool)
```

transfer some token to another account, only works in plain account to plain account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | - the receiver address |
| value | uint256 | - the total transfer value |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | - return if the transfer success |

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

_Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called._

### approve

```solidity
function approve(address spender, uint256 value) external returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the
caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the
allowance mechanism. `value` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

### decimals

```solidity
function decimals() external view returns (uint8)
```

_Returns the decimals places of the token._

### PrivatePublic

```solidity
struct PrivatePublic {
  uint256[2] C1;
  uint256[2] C2;
  uint256 viewKey;
  bytes proof;
}
```

### PrivatePrivate

```solidity
struct PrivatePrivate {
  uint256[2] fromC1;
  uint256[2] fromC2;
  uint256[2] toC1;
  uint256[2] toC2;
  uint256 fromViewKey;
  uint256 toViewKey;
  bytes proof;
}
```

### privateTransfer

```solidity
function privateTransfer(address to, uint256 value, bytes data) external returns (bool)
```

### registerAccount

```solidity
function registerAccount(address owner) external
```

## ErrTxTypeNotSupported

```solidity
error ErrTxTypeNotSupported(uint8 actual)
```

## ErrValidateFailed

```solidity
error ErrValidateFailed()
```

## ErrPlainTransferFailed

```solidity
error ErrPlainTransferFailed()
```

## ErrPrivateTransferFailed

```solidity
error ErrPrivateTransferFailed()
```

## ErrAddressNotExist

```solidity
error ErrAddressNotExist(address owner)
```

## ErrPermissionDenied

```solidity
error ErrPermissionDenied()
```

## ErrNotImplemented

```solidity
error ErrNotImplemented(bytes param)
```

## ErrConsumeValueMismatch

```solidity
error ErrConsumeValueMismatch()
```

## ErrOnlyAcceptAxiomPayTx

```solidity
error ErrOnlyAcceptAxiomPayTx(address sender, address axiomPay)
```

## ErrDecimalTruncate

```solidity
error ErrDecimalTruncate(uint256 value)
```

## ErrValueOverflow

```solidity
error ErrValueOverflow(uint256 value, uint256 maxAccepted)
```

## IAddressBook

### isPrivate

```solidity
function isPrivate(address user) external view returns (bool)
```

_check the property of a user_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | - the user address you want to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool - return the property of a user, true -> Private, false -> Public |

### swapAccountProperty

```solidity
function swapAccountProperty(address user) external
```

_swap the account property_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | - the user address |

### addOwners

```solidity
function addOwners(address[] _owners) external
```

register some address as owner role

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _owners | address[] | - the user address |

## IPrivateERC20

### balance

```solidity
struct balance {
  uint256[2] c1;
  uint256[2] c2;
  uint256 viewKey;
}
```

### PrivateTransfer

```solidity
event PrivateTransfer(address from, address to, uint256[2] fromC1, uint256[2] fromC2, uint256[2] toC1, uint256[2] toC2, uint256 fromViewKey, uint256 toViewKey)
```

### PrivateTransferFrom

```solidity
event PrivateTransferFrom(address from, uint256[2] fromC1, uint256[2] fromC2, uint256 fromViewKey)
```

### PrivateTransferTo

```solidity
event PrivateTransferTo(address to, uint256[2] toC1, uint256[2] toC2, uint256 toViewKey)
```

### registerAxiomPayAddress

```solidity
function registerAxiomPayAddress(address _axiomPay) external
```

### privateTransfer

```solidity
function privateTransfer(address from, address to, uint256[2] fromC1, uint256[2] fromC2, uint256[2] toC1, uint256[2] toC2, uint256 fromViewKey, uint256 toViewKey) external returns (bool)
```

### privateTransferTo

```solidity
function privateTransferTo(address to, uint256[2] toC1, uint256[2] toC2, uint256 viewKey) external returns (bool)
```

### privateTransferFrom

```solidity
function privateTransferFrom(address from, uint256[2] fromC1, uint256[2] fromC2, uint256 viewKey) external returns (bool)
```

### registerAccount

```solidity
function registerAccount(address owner) external
```

### privateBalanceOf

```solidity
function privateBalanceOf(address owner) external view returns (struct IPrivateERC20.balance)
```

## IValidator

### validate

```solidity
function validate(bytes data) external pure returns (bool)
```

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

## Paillier

### addCipher

```solidity
function addCipher(uint256 a, uint256 b, uint256 n) internal pure returns (uint256)
```

### subCipher

```solidity
function subCipher(uint256 a, uint256 b, uint256 n) internal pure returns (uint256)
```

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

## TwinTokenPool

### Register

```solidity
event Register(address originalERC20, address privateERC20, address axiomPay, uint256 paillierNN)
```

### AxiomAddress

```solidity
struct AxiomAddress {
  contract IERC20Metadata originalToken;
  contract IPrivateERC20 privateToken;
}
```

### OriginalERC20Detail

```solidity
struct OriginalERC20Detail {
  address ERC20Token;
  string name;
}
```

### _validator

```solidity
contract IValidator _validator
```

### constructor

```solidity
constructor(address owner, contract IValidator validator) public
```

### register

```solidity
function register(contract IERC20Metadata originalERC20, uint256 paillierNN) external returns (address)
```

_register an existing ERC20 contract to the pool_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| originalERC20 | contract IERC20Metadata | - the original ERC20 contract address you want to register |
| paillierNN | uint256 | - the paillier modular number |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address | - the axiomPay contract address |

### create

```solidity
function create() external returns (address)
```

### showLists

```solidity
function showLists() external view returns (struct TwinTokenPool.OriginalERC20Detail[])
```

## PrivateToken

### name

```solidity
string name
```

_Returns the name of the token._

### symbol

```solidity
string symbol
```

_Returns the symbol of the token._

### decimals

```solidity
uint8 decimals
```

_Returns the decimals places of the token._

### totalSupply

```solidity
uint256 totalSupply
```

_Returns the value of tokens in existence._

### accountExist

```solidity
modifier accountExist(address account)
```

### onlyFromAxiomPay

```solidity
modifier onlyFromAxiomPay()
```

### constructor

```solidity
constructor(contract IERC20Metadata _token, address _owner, uint256 _paillierNN, contract IAddressBook _addressBook) public
```

### registerAxiomPayAddress

```solidity
function registerAxiomPayAddress(address _axiomPay) external
```

### privateTransfer

```solidity
function privateTransfer(address from, address to, uint256[2] fromC1, uint256[2] fromC2, uint256[2] toC1, uint256[2] toC2, uint256 fromViewKey, uint256 toViewKey) external returns (bool)
```

private transfer from a private account to another private account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | - address from |
| to | address | - receiver address |
| fromC1 | uint256[2] | - the sender encrypted C1 of the amount |
| fromC2 | uint256[2] | - the sender encrypted C2 of the amount |
| toC1 | uint256[2] | - the receiver encrypted C1 of the amount |
| toC2 | uint256[2] | - the receiver encrypted C2 of the amount |
| fromViewKey | uint256 | - the sender view key |
| toViewKey | uint256 | - the receiver view key |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool - if the transfer success |

### privateTransferTo

```solidity
function privateTransferTo(address to, uint256[2] toC1, uint256[2] toC2, uint256 viewKey) external returns (bool)
```

private transfer from a public account to a private account. In priavate contract, only add
sepecific amount to receiver, in other words, private token is not a zero sum contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | - receiver address |
| toC1 | uint256[2] | - the receiver encrypted C1 of the amount |
| toC2 | uint256[2] | - the receiver encrypted C2 of the amount |
| viewKey | uint256 | - the receiver view key |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool - if the transfer success |

### privateTransferFrom

```solidity
function privateTransferFrom(address from, uint256[2] fromC1, uint256[2] fromC2, uint256 viewKey) external returns (bool)
```

private transfer from a private account to a public account. In priavate contract, only subtract
sepecific amount from sender, in other words, private token is not a zero sum contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | - sender address |
| fromC1 | uint256[2] | - the sender encrypted C1 of the amount |
| fromC2 | uint256[2] | - the sender encrypted C2 of the amount |
| viewKey | uint256 | - the sender view key |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool - if the transfer success |

### privateBalanceOf

```solidity
function privateBalanceOf(address owner) external view returns (struct IPrivateERC20.balance)
```

return the balance of a private account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | - the address you want to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IPrivateERC20.balance | - balance(bool isExist, uint[2] c1, uint[2] c2, uint256 viewKey) |

### registerAccount

```solidity
function registerAccount(address owner) external
```

register a private account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | - the address you want to register |

### transfer

```solidity
function transfer(address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to`.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

### allowance

```solidity
function allowance(address owner, address spender) external view returns (uint256)
```

_Returns the remaining number of tokens that `spender` will be
allowed to spend on behalf of `owner` through {transferFrom}. This is
zero by default.

This value changes when {approve} or {transferFrom} are called._

### approve

```solidity
function approve(address spender, uint256 value) external returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the
caller's tokens.

Returns a boolean value indicating whether the operation succeeded.

IMPORTANT: Beware that changing an allowance with this method brings the risk
that someone may use both the old and the new allowance by unfortunate
transaction ordering. One possible solution to mitigate this race
condition is to first reduce the spender's allowance to 0 and set the
desired value afterwards:
https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729

Emits an {Approval} event._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the
allowance mechanism. `value` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```

## AddressBook

### constructor

```solidity
constructor(address owner) public
```

### isPrivate

```solidity
function isPrivate(address user) external view returns (bool)
```

_check the property of a user_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | - the user address you want to check |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool - return the property of a user, true -> Private, false -> Public |

### swapAccountProperty

```solidity
function swapAccountProperty(address user) external
```

_swap the account property_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | - the user address |

### addOwners

```solidity
function addOwners(address[] _owners) external
```

register some address as owner role

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _owners | address[] | - the user address |

## Validator

### validate

```solidity
function validate(bytes data) external pure returns (bool)
```

validate the proof

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| data | bytes | - the proof |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | - true if the proof is valid |

## ERC20Factory

## MockERC20

### constructor

```solidity
constructor(string name, string symbol, uint256 initialValue) public
```


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

### validatePriv2Priv

```solidity
modifier validatePriv2Priv(struct AxiomPay.PrivatePrivate data, struct IPrivateERC20.balance balance, bytes proof)
```

### validatePriv2Pub

```solidity
modifier validatePriv2Pub(struct AxiomPay.PrivatePublic data, struct IPrivateERC20.balance balance, bytes proof)
```

### validatePub2Priv

```solidity
modifier validatePub2Priv(struct AxiomPay.PrivatePublic data, bytes proof)
```

### constructor

```solidity
constructor(contract IERC20Metadata _orignalToken, contract IPrivateERC20 _privateToken, contract Validator _validator, contract IAddressBook _addressBook) public
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
function privateBalanceOf(address account) public view returns (struct IPrivateERC20.balance)
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
function privateTransfer(address from, address to, uint256 value, bytes data) external returns (bool)
```

_the entrance of private transfer, user should pack encrypted data and proof in data,
the function will automatically check the tx type and routes to certain transfer logic_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address |  |
| to | address | - the private transfer receiver |
| value | uint256 | - the private transfer value |
| data | bytes | - all encrypted data and proof |


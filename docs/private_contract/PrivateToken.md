# Solidity API

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
| fromViewKey | uint256 |  |
| toViewKey | uint256 |  |

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
| viewKey | uint256 |  |

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
| viewKey | uint256 |  |

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
| [0] | struct IPrivateERC20.balance | - balance(bool isExist, uint[2] c1, uint[2] c2) |

### transfer

```solidity
function transfer(address to, uint256 value) external pure returns (bool)
```

_transfer interface, to implement a standard ERC20 contract_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | - receiver address |
| value | uint256 | - the total transfer value |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | - always revert! |

### allowance

```solidity
function allowance(address owner, address spender) external pure returns (uint256)
```

allowance interface, to implement a standard ERC20 contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | - the allownace owner |
| spender | address | - the allownace spender |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | - always revert! |

### approve

```solidity
function approve(address spender, uint256 value) external pure returns (bool)
```

approve interface, to implement a standard ERC20 contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | - the spender of the approve |
| value | uint256 | - the total value of the approve |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | - always revert! |

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 value) external pure returns (bool)
```

transferFrom interface, to implement a standard ERC20 contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | - the transfer sender |
| to | address | - the transfer receiver |
| value | uint256 | - the total value of the transfer |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | - always revert! |

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```

balanceOf interface, to implement a standard ERC20 contract

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | - the account owner you want to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | - always revert! |


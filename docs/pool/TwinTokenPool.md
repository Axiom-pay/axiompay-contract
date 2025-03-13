# Solidity API

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

### PoolInfo

```solidity
struct PoolInfo {
  address axiomPay;
  string originalERC20Name;
  string privateERC20Name;
}
```

### addressBook

```solidity
contract IAddressBook addressBook
```

### _validator

```solidity
contract Validator _validator
```

### constructor

```solidity
constructor(address owner, contract Validator validator) public
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

### showLists

```solidity
function showLists() external view returns (struct TwinTokenPool.PoolInfo[])
```

_show all registered ERC20 contracts_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct TwinTokenPool.PoolInfo[] | - the list of registered ERC20 contracts, return a list of OriginalERC20Detail struct |

### registerAccount

```solidity
function registerAccount(address owner, string publicKey) external
```

register a private account

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | - the address you want to register |
| publicKey | string |  |

### isPrivate

```solidity
function isPrivate(address owner) external view returns (bool)
```

check an address is private or not

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | - the address you want to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | - true -> private, false -> public |

### getPublicKey

```solidity
function getPublicKey(address owner) external view returns (string)
```

_get a given user's public key_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | - the user you want to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | publicKey - the given user's public key |


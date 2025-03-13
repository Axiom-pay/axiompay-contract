# Solidity API

## IAddressBook

### UserInfo

```solidity
struct UserInfo {
  bool isPrivate;
  string publicKey;
}
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

### registerAccount

```solidity
function registerAccount(address user, string publicKey) external
```

_register an account to axiompay_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | - the user address |
| publicKey | string | - the given user's public key |

### getUserPublicKey

```solidity
function getUserPublicKey(address user) external view returns (string)
```

_get the given user's public key_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| user | address | - the user address you want to query |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string | publicKey - the given user's public key |


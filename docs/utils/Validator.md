# Solidity API

## Validator

### Priv2PrivProof

```solidity
struct Priv2PrivProof {
  uint256[2] pA;
  uint256[2][2] pB;
  uint256[2] pC;
  uint256[1] pubSignals;
}
```

### Priv2PubProof

```solidity
struct Priv2PubProof {
  uint256[2] pA;
  uint256[2][2] pB;
  uint256[2] pC;
  uint256[1] pubSignals;
}
```

### Pub2PrivProof

```solidity
struct Pub2PrivProof {
  uint256[2] pA;
  uint256[2][2] pB;
  uint256[2] pC;
  uint256[1] pubSignals;
}
```

### constructor

```solidity
constructor(contract Priv2PrivVerifier _priv2PrivVerifier, contract Priv2PubVerifier _priv2PubVerifier, contract Pub2PrivVerifier _pub2PrivVerifier) public
```

### validatePriv2Priv

```solidity
function validatePriv2Priv(uint256[2] fromC1, uint256[2] fromC2, uint256[2] toC1, uint256[2] toC2, uint256[2] balanceC1, uint256[2] balanceC2, bytes proof) external view returns (bool)
```

validate the proof

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| fromC1 | uint256[2] |  |
| fromC2 | uint256[2] |  |
| toC1 | uint256[2] |  |
| toC2 | uint256[2] |  |
| balanceC1 | uint256[2] |  |
| balanceC2 | uint256[2] |  |
| proof | bytes | - the proof |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | - true if the proof is valid |

### validatePriv2Pub

```solidity
function validatePriv2Pub(uint256[2] fromC1, uint256[2] fromC2, uint256[2] balanceC1, uint256[2] balanceC2, bytes proof) external view returns (bool)
```

### validatePub2Priv

```solidity
function validatePub2Priv(uint256[2] toC1, uint256[2] toC2, bytes proof) external view returns (bool)
```


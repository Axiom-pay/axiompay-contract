# Solidity API

## IPrivateERC20

### balance

```solidity
struct balance {
  uint256[2] c1;
  uint256[2] c2;
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

### privateBalanceOf

```solidity
function privateBalanceOf(address owner) external view returns (struct IPrivateERC20.balance)
```


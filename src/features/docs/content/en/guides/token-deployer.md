---
title: Token Deployer
description: Step-by-step guide to deploying ERC20 tokens using biubiu.tools Token Deployer.
order: 1
lastUpdated: 2025-01-01
---

## Overview

The Token Deployer allows you to create and deploy ERC20 tokens on any supported EVM chain without writing code.

## Prerequisites

Before deploying a token:

1. **Connect your wallet** - See [Wallet Connection](/docs/getting-started/wallet-connection)
2. **Have native tokens for gas** - ETH, MATIC, BNB, etc.
3. **Plan your token parameters**

## Token Configuration

### Basic Parameters

| Parameter    | Description                 | Example    |
| ------------ | --------------------------- | ---------- |
| Name         | Full token name             | "My Token" |
| Symbol       | Token ticker                | "MTK"      |
| Decimals     | Decimal places (usually 18) | 18         |
| Total Supply | Initial token amount        | 1000000    |

### Advanced Features

- **Mintable**: Allow creating more tokens later
- **Burnable**: Allow destroying tokens
- **Pausable**: Emergency pause functionality
- **Access Control**: Role-based permissions

## Deployment Steps

### Step 1: Configure Token

Fill in your token details:

```solidity
// Your token will use this standard interface
interface IERC20 {
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function decimals() external view returns (uint8);
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
}
```

### Step 2: Review and Deploy

1. Review all parameters
2. Estimate gas costs
3. Click "Deploy"
4. Confirm in your wallet

### Step 3: Verify Contract

After deployment, you'll receive:

- **Contract Address**: Your token's address
- **Transaction Hash**: Deployment transaction
- **Verification Link**: Etherscan verification

## Example: Creating a Governance Token

Here's how to create a governance token with 1 million supply:

```typescript
const tokenConfig = {
	name: 'Governance Token',
	symbol: 'GOV',
	decimals: 18,
	totalSupply: '1000000', // 1 million tokens
	features: {
		mintable: false, // Fixed supply
		burnable: true, // Can burn tokens
		pausable: true, // Emergency pause
		snapshot: true // For voting snapshots
	}
};
```

## Gas Estimation

Deployment costs vary by network:

| Network  | Estimated Cost |
| -------- | -------------- |
| Ethereum | $50 - $200     |
| Polygon  | $0.01 - $0.10  |
| Base     | $0.10 - $0.50  |
| BSC      | $0.50 - $2.00  |

> **Tip**: Deploy on testnets first to verify everything works correctly.

## After Deployment

Once deployed, you can:

1. **Add to wallet** - Import token to MetaMask
2. **Verify on explorer** - Publish source code
3. **Add liquidity** - Create trading pairs
4. **Distribute tokens** - Use [One-to-Many Transfer](/apps/one-to-many-transfer)

## Common Issues

### Insufficient Gas

Increase gas limit or wait for lower network activity.

### Transaction Failed

Check:

- Sufficient native token balance
- Correct network selected
- Valid token parameters

## Related Tools

- [NFT Deployer](/apps/nft-deployer) - Deploy NFT collections
- [Contract Deployer](/apps/contract-deployer) - Deploy any contract
- [Token Balance Scanner](/apps/token-balance-scanner) - Check token balances

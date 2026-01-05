---
title: Smart Contracts
description: Technical reference for biubiu.tools smart contracts and integration guides.
order: 1
lastUpdated: 2025-01-01
---

## Overview

biubiu.tools uses a set of audited smart contracts deployed across multiple chains. This document provides technical details for developers who want to integrate with our contracts.

## Contract Addresses

### Factory Contracts

| Contract         | Ethereum | Polygon | Base    |
| ---------------- | -------- | ------- | ------- |
| TokenFactory     | `0x...`  | `0x...` | `0x...` |
| NFTFactory       | `0x...`  | `0x...` | `0x...` |
| CREATE2 Deployer | `0x...`  | `0x...` | `0x...` |

## TokenFactory Interface

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITokenFactory {
    /// @notice Deploy a new ERC20 token
    /// @param name Token name
    /// @param symbol Token symbol
    /// @param decimals Token decimals
    /// @param totalSupply Initial total supply
    /// @param features Bitmap of enabled features
    /// @return token Address of deployed token
    function deployToken(
        string calldata name,
        string calldata symbol,
        uint8 decimals,
        uint256 totalSupply,
        uint256 features
    ) external payable returns (address token);

    /// @notice Get deployment fee
    function deploymentFee() external view returns (uint256);

    /// @notice Check if address is a deployed token
    function isDeployedToken(address token) external view returns (bool);

    /// @notice Emitted when a token is deployed
    event TokenDeployed(
        address indexed token,
        address indexed deployer,
        string name,
        string symbol
    );
}
```

## Feature Flags

Token features are encoded as a bitmap:

```solidity
uint256 constant FEATURE_MINTABLE = 1 << 0;   // 0x01
uint256 constant FEATURE_BURNABLE = 1 << 1;   // 0x02
uint256 constant FEATURE_PAUSABLE = 1 << 2;   // 0x04
uint256 constant FEATURE_SNAPSHOT = 1 << 3;   // 0x08
uint256 constant FEATURE_VOTES = 1 << 4;      // 0x10
uint256 constant FEATURE_PERMIT = 1 << 5;     // 0x20
```

### Example Usage

```typescript
import { encodeFunctionData } from 'viem';

// Deploy a mintable, burnable token with permit
const features = 0x01 | 0x02 | 0x20; // MINTABLE | BURNABLE | PERMIT

const data = encodeFunctionData({
	abi: tokenFactoryAbi,
	functionName: 'deployToken',
	args: ['My Token', 'MTK', 18, parseEther('1000000'), BigInt(features)]
});
```

## CREATE2 Deployment

For deterministic addresses, use the CREATE2 deployer:

```solidity
interface ICREATE2Deployer {
    /// @notice Deploy contract with CREATE2
    /// @param salt Unique salt for address derivation
    /// @param bytecode Contract creation bytecode
    /// @return deployed Address of deployed contract
    function deploy(
        bytes32 salt,
        bytes calldata bytecode
    ) external returns (address deployed);

    /// @notice Compute deployment address
    function computeAddress(
        bytes32 salt,
        bytes32 bytecodeHash
    ) external view returns (address);
}
```

### Predicting Addresses

```typescript
import { keccak256, encodeAbiParameters } from 'viem';

function predictAddress(deployer: Address, salt: Hex, bytecodeHash: Hex): Address {
	return getContractAddress({
		from: deployer,
		salt,
		bytecodeHash,
		opcode: 'CREATE2'
	});
}
```

## Events

### Monitoring Deployments

```typescript
import { createPublicClient, http, parseAbiItem } from 'viem';

const client = createPublicClient({
	chain: mainnet,
	transport: http()
});

// Watch for new token deployments
const unwatch = client.watchEvent({
	address: FACTORY_ADDRESS,
	event: parseAbiItem(
		'event TokenDeployed(address indexed token, address indexed deployer, string name, string symbol)'
	),
	onLogs: (logs) => {
		for (const log of logs) {
			console.log('New token deployed:', log.args);
		}
	}
});
```

## Gas Optimization

Our contracts use several gas optimization techniques:

1. **Minimal proxies (EIP-1167)** for token deployments
2. **Batch operations** for multi-transfers
3. **Bitmap packing** for feature flags

### Estimated Gas Costs

| Operation                | Gas Units         |
| ------------------------ | ----------------- |
| Deploy standard token    | ~150,000          |
| Deploy with all features | ~250,000          |
| Transfer (batch of 10)   | ~80,000           |
| Sweep tokens             | ~60,000 per token |

## Security

All contracts are:

- **Audited** by [Auditor Name]
- **Verified** on block explorers
- **Immutable** with no admin keys
- **Non-upgradeable** for maximum security

## Integration Examples

### React Hook

```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { tokenFactoryAbi, FACTORY_ADDRESS } from './contracts';

function useDeployToken() {
	const { writeContract, data: hash } = useWriteContract();
	const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

	const deploy = async (config: TokenConfig) => {
		await writeContract({
			address: FACTORY_ADDRESS,
			abi: tokenFactoryAbi,
			functionName: 'deployToken',
			args: [config.name, config.symbol, config.decimals, config.supply, config.features],
			value: parseEther('0.01') // Deployment fee
		});
	};

	return { deploy, isLoading, isSuccess };
}
```

## Support

For technical support:

- **GitHub Issues**: [Report bugs](https://github.com/atshelchin/biubiu.tools/issues)
- **Discord**: [Developer channel](https://discord.gg/GWXXQ7fXaZ)

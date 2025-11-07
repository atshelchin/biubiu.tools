import type { Address, PublicClient, WalletClient } from 'viem';
import type { NFTConfig, DeploymentResult } from '../types/nft';
import { getERC721Bytecode, getERC721ABytecode, getERC1155Bytecode } from '../contracts/bytecode';

/**
 * Estimate gas for NFT contract deployment
 */
export async function estimateDeploymentGas(
	config: NFTConfig,
	publicClient: PublicClient
): Promise<bigint> {
	try {
		// Get bytecode based on standard
		let bytecode: `0x${string}`;

		switch (config.standard) {
			case 'erc721':
				bytecode = getERC721Bytecode({
					name: config.basic.name,
					symbol: config.basic.symbol,
					maxSupply: config.advanced.maxSupply,
					mintPrice: config.advanced.mintPrice,
					burnable: config.advanced.burnable,
					pausable: config.advanced.pausable
				});
				break;
			case 'erc721a':
				bytecode = getERC721ABytecode({
					name: config.basic.name,
					symbol: config.basic.symbol,
					maxSupply: config.advanced.maxSupply,
					mintPrice: config.advanced.mintPrice,
					burnable: config.advanced.burnable,
					pausable: config.advanced.pausable
				});
				break;
			case 'erc1155':
				bytecode = getERC1155Bytecode({
					baseUri: config.basic.baseUri || '',
					mintPrice: config.advanced.mintPrice,
					pausable: config.advanced.pausable,
					burnable: config.advanced.burnable
				});
				break;
		}

		// Estimate gas for contract deployment
		const gasEstimate = await publicClient.estimateGas({
			account: config.deployer,
			data: bytecode
		});

		return gasEstimate;
	} catch (error) {
		console.error('Gas estimation failed:', error);
		// Return a reasonable default estimate
		return BigInt(3000000); // 3M gas as fallback
	}
}

/**
 * Calculate deployment cost
 */
export async function calculateDeploymentCost(
	gasEstimate: bigint,
	publicClient: PublicClient
): Promise<{
	gasPrice: bigint;
	totalCost: bigint;
	totalCostInEth: string;
}> {
	try {
		// Get current gas price
		const gasPrice = await publicClient.getGasPrice();

		// Calculate total cost
		const totalCost = gasEstimate * gasPrice;

		// Convert to ETH (wei to ether)
		const totalCostInEth = (Number(totalCost) / 1e18).toFixed(6);

		return {
			gasPrice,
			totalCost,
			totalCostInEth
		};
	} catch (error) {
		console.error('Cost calculation failed:', error);
		throw new Error('Failed to calculate deployment cost');
	}
}

/**
 * Deploy NFT contract
 */
export async function deployNFTContract(
	config: NFTConfig,
	walletClient: WalletClient,
	publicClient: PublicClient,
	onProgress?: (progress: number, message: string) => void
): Promise<DeploymentResult> {
	try {
		onProgress?.(10, 'Preparing contract deployment...');

		// Get bytecode based on standard
		let bytecode: `0x${string}`;

		switch (config.standard) {
			case 'erc721':
				bytecode = getERC721Bytecode({
					name: config.basic.name,
					symbol: config.basic.symbol,
					maxSupply: config.advanced.maxSupply,
					mintPrice: config.advanced.mintPrice,
					burnable: config.advanced.burnable,
					pausable: config.advanced.pausable
				});
				break;
			case 'erc721a':
				bytecode = getERC721ABytecode({
					name: config.basic.name,
					symbol: config.basic.symbol,
					maxSupply: config.advanced.maxSupply,
					mintPrice: config.advanced.mintPrice,
					burnable: config.advanced.burnable,
					pausable: config.advanced.pausable
				});
				break;
			case 'erc1155':
				bytecode = getERC1155Bytecode({
					baseUri: config.basic.baseUri || '',
					mintPrice: config.advanced.mintPrice,
					pausable: config.advanced.pausable,
					burnable: config.advanced.burnable
				});
				break;
		}

		onProgress?.(30, 'Estimating gas...');

		// Estimate gas
		const gasEstimate = await estimateDeploymentGas(config, publicClient);

		onProgress?.(40, 'Sending deployment transaction...');

		// Deploy contract
		const hash = await walletClient.deployContract({
			abi: [], // ABI not needed for deployment
			bytecode,
			account: config.deployer,
			gas: gasEstimate
		});

		onProgress?.(60, 'Waiting for transaction confirmation...');

		// Wait for transaction receipt
		const receipt = await publicClient.waitForTransactionReceipt({
			hash
		});

		onProgress?.(90, 'Deployment completed!');

		// Check if deployment was successful
		if (receipt.status === 'success' && receipt.contractAddress) {
			const cost = await calculateDeploymentCost(receipt.gasUsed, publicClient);

			return {
				success: true,
				contractAddress: receipt.contractAddress,
				transactionHash: hash,
				deploymentCost: cost.totalCostInEth,
				gasUsed: receipt.gasUsed,
				timestamp: Date.now()
			};
		} else {
			return {
				success: false,
				error: 'Contract deployment failed',
				timestamp: Date.now()
			};
		}
	} catch (error) {
		console.error('Deployment error:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown deployment error',
			timestamp: Date.now()
		};
	}
}

/**
 * Verify contract on block explorer (optional)
 */
export async function verifyContract(
	contractAddress: Address,
	constructorArgs: unknown[],
	chainId: number
): Promise<{ success: boolean; error?: string }> {
	try {
		// In production, integrate with Etherscan/Blockscout API
		console.log('Verifying contract:', {
			contractAddress,
			constructorArgs,
			chainId
		});

		// Placeholder - implement actual verification logic
		return {
			success: true
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Verification failed'
		};
	}
}

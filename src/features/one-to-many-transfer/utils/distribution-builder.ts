import { parseUnits, encodeFunctionData } from 'viem';
import type { Address } from 'viem';
import type { DistributionConfig, DistributionTransaction } from '../types/distribution';

// ERC20 transfer ABI
const ERC20_ABI = [
	{
		inputs: [
			{ name: 'to', type: 'address' },
			{ name: 'amount', type: 'uint256' }
		],
		name: 'transfer',
		outputs: [{ name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function'
	}
] as const;

// ERC721 safeTransferFrom ABI
const ERC721_ABI = [
	{
		inputs: [
			{ name: 'from', type: 'address' },
			{ name: 'to', type: 'address' },
			{ name: 'tokenId', type: 'uint256' }
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
] as const;

// ERC1155 safeTransferFrom ABI
const ERC1155_ABI = [
	{
		inputs: [
			{ name: 'from', type: 'address' },
			{ name: 'to', type: 'address' },
			{ name: 'id', type: 'uint256' },
			{ name: 'amount', type: 'uint256' },
			{ name: 'data', type: 'bytes' }
		],
		name: 'safeTransferFrom',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function'
	}
] as const;

// Gas limits for different token types
const GAS_LIMITS = {
	native: BigInt(21000),
	erc20: BigInt(65000),
	erc721: BigInt(100000),
	erc1155: BigInt(100000)
} as const;

/**
 * Build distribution transactions for all recipients
 * Supports Native, ERC20, ERC721, and ERC1155 token types
 */
export function buildDistributionTransactions(
	config: DistributionConfig
): DistributionTransaction[] {
	const transactions: DistributionTransaction[] = [];

	for (const recipient of config.recipients) {
		const tx = buildSingleTransaction(config, recipient);
		if (tx) {
			transactions.push(tx);
		}
	}

	return transactions;
}

/**
 * Build a single transaction for a recipient
 */
function buildSingleTransaction(
	config: DistributionConfig,
	recipient: DistributionConfig['recipients'][0]
): DistributionTransaction | null {
	switch (config.token.type) {
		case 'native':
			return buildNativeTransfer(config, recipient);
		case 'erc20':
			return buildERC20Transfer(config, recipient);
		case 'erc721':
			return buildERC721Transfer(config, recipient);
		case 'erc1155':
			return buildERC1155Transfer(config, recipient);
		default:
			return null;
	}
}

/**
 * Build native token transfer
 */
function buildNativeTransfer(
	config: DistributionConfig,
	recipient: DistributionConfig['recipients'][0]
): DistributionTransaction | null {
	const amount = getRecipientAmount(config, recipient);
	if (!amount) return null;

	const amountBigInt = parseUnits(amount, config.token.decimals);
	const gasLimit = config.gasLimit || GAS_LIMITS.native;

	return {
		to: recipient.address,
		value: amountBigInt,
		gasLimit,
		recipient,
		estimatedCost: gasLimit
	};
}

/**
 * Build ERC20 token transfer
 */
function buildERC20Transfer(
	config: DistributionConfig,
	recipient: DistributionConfig['recipients'][0]
): DistributionTransaction | null {
	const amount = getRecipientAmount(config, recipient);
	if (!amount) return null;

	const amountBigInt = parseUnits(amount, config.token.decimals);
	const gasLimit = config.gasLimit || GAS_LIMITS.erc20;

	// ERC20 tokens have an address property
	const tokenAddress = 'address' in config.token ? config.token.address : null;
	if (!tokenAddress) return null;

	const data = encodeFunctionData({
		abi: ERC20_ABI,
		functionName: 'transfer',
		args: [recipient.address, amountBigInt]
	});

	return {
		to: tokenAddress as Address,
		data,
		gasLimit,
		recipient,
		estimatedCost: gasLimit
	};
}

/**
 * Build ERC721 safeTransferFrom
 */
function buildERC721Transfer(
	config: DistributionConfig,
	recipient: DistributionConfig['recipients'][0]
): DistributionTransaction | null {
	if (recipient.tokenId === undefined) return null;

	const gasLimit = config.gasLimit || GAS_LIMITS.erc721;

	// ERC721 tokens have an address property
	const tokenAddress = 'address' in config.token ? config.token.address : null;
	if (!tokenAddress) return null;

	const data = encodeFunctionData({
		abi: ERC721_ABI,
		functionName: 'safeTransferFrom',
		args: [config.sourceWallet, recipient.address, recipient.tokenId]
	});

	return {
		to: tokenAddress as Address,
		data,
		gasLimit,
		recipient,
		estimatedCost: gasLimit
	};
}

/**
 * Build ERC1155 safeTransferFrom
 */
function buildERC1155Transfer(
	config: DistributionConfig,
	recipient: DistributionConfig['recipients'][0]
): DistributionTransaction | null {
	if (recipient.tokenId === undefined) return null;

	const gasLimit = config.gasLimit || GAS_LIMITS.erc1155;

	// ERC1155 tokens have an address property
	const tokenAddress = 'address' in config.token ? config.token.address : null;
	if (!tokenAddress) return null;

	// Amount defaults to 1 for ERC1155
	const amount = recipient.tokenAmount ? BigInt(recipient.tokenAmount) : BigInt(1);

	const data = encodeFunctionData({
		abi: ERC1155_ABI,
		functionName: 'safeTransferFrom',
		args: [config.sourceWallet, recipient.address, recipient.tokenId, amount, '0x']
	});

	return {
		to: tokenAddress as Address,
		data,
		gasLimit,
		recipient,
		estimatedCost: gasLimit
	};
}

/**
 * Get the amount for a recipient based on distribution mode
 */
function getRecipientAmount(
	config: DistributionConfig,
	recipient: DistributionConfig['recipients'][0]
): string | null {
	// For custom mode, use recipient's own amount
	if (config.amountMode === 'custom' && recipient.amount) {
		return recipient.amount;
	}

	// For random mode, amounts should already be set on recipient
	if (config.amountMode === 'random' && recipient.amount) {
		return recipient.amount;
	}

	// For equal mode, use the configured amount per recipient
	if (config.amountMode === 'equal' && config.amountPerRecipient) {
		return config.amountPerRecipient;
	}

	return null;
}

/**
 * Calculate total amount to be distributed
 * Works for fungible tokens (Native, ERC20)
 */
export function calculateTotalAmount(config: DistributionConfig): string {
	// For NFTs, return count instead of amount
	if (config.token.type === 'erc721' || config.token.type === 'erc1155') {
		return config.recipients.length.toString();
	}

	if (config.amountMode === 'equal' && config.amountPerRecipient) {
		const amount = parseFloat(config.amountPerRecipient);
		const total = amount * config.recipients.length;
		return total.toFixed(config.token.decimals > 6 ? 6 : config.token.decimals);
	}

	// For custom and random modes, sum up individual amounts
	if (config.amountMode === 'custom' || config.amountMode === 'random') {
		const total = config.recipients.reduce((sum, recipient) => {
			const amount = parseFloat(recipient.amount || '0');
			return sum + amount;
		}, 0);
		return total.toFixed(config.token.decimals > 6 ? 6 : config.token.decimals);
	}

	return '0';
}

/**
 * Estimate total gas cost for all transactions
 */
export function estimateTotalGas(
	transactions: DistributionTransaction[],
	gasPrice: bigint
): bigint {
	const totalGasUnits = transactions.reduce((sum, tx) => sum + tx.gasLimit, BigInt(0));
	return totalGasUnits * gasPrice;
}

/**
 * Get gas limit for a token type
 */
export function getGasLimitForTokenType(tokenType: keyof typeof GAS_LIMITS): bigint {
	return GAS_LIMITS[tokenType];
}

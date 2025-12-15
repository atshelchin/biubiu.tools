/**
 * Transaction building utilities for token sweep
 */
import type { Address, PublicClient, WalletClient, Hash } from 'viem';
import { encodeFunctionData } from 'viem';
import type { ImportedWallet } from '../types/wallet';
import type { ERC20Token } from '$lib/types/token';

// ERC20 transfer ABI
const ERC20_TRANSFER_ABI = [
	{
		name: 'transfer',
		type: 'function',
		stateMutability: 'nonpayable',
		inputs: [
			{ name: 'to', type: 'address' },
			{ name: 'amount', type: 'uint256' }
		],
		outputs: [{ name: '', type: 'bool' }]
	}
] as const;

// ERC20 balanceOf ABI
const ERC20_BALANCE_ABI = [
	{
		name: 'balanceOf',
		type: 'function',
		stateMutability: 'view',
		inputs: [{ name: 'account', type: 'address' }],
		outputs: [{ name: 'balance', type: 'uint256' }]
	}
] as const;

export interface SweepTransaction {
	from: Address;
	to: Address;
	value?: bigint;
	data?: `0x${string}`;
	chainId: number;
	nonce: number;
	tokenAddress?: Address;
	tokenSymbol?: string;
	amount?: bigint;
}

export interface SweepResult {
	wallet: Address;
	success: boolean;
	txHash?: Hash;
	error?: string;
	tokenSymbol?: string;
}

export interface BatchSweepProgress {
	current: number;
	total: number;
	percentage: number;
	currentWallet?: Address;
	currentToken?: string;
}

/**
 * Build native token transfer transaction
 */
export async function buildNativeTransfer(
	publicClient: PublicClient,
	from: Address,
	to: Address,
	chainId: number
): Promise<SweepTransaction | null> {
	// Get balance
	const balance = await publicClient.getBalance({ address: from });

	if (balance === 0n) {
		return null; // No balance to sweep
	}

	// Estimate gas for transfer
	const gasLimit = 21000n; // Standard ETH transfer
	const gasPrice = await publicClient.getGasPrice();
	const gasCost = gasLimit * gasPrice;

	// Check if balance covers gas
	if (balance <= gasCost) {
		return null; // Balance too low to cover gas
	}

	// Amount to send = balance - gas cost
	const amount = balance - gasCost;

	// Get nonce
	const nonce = await publicClient.getTransactionCount({ address: from });

	return {
		from,
		to,
		value: amount,
		chainId,
		nonce,
		amount,
		tokenSymbol: 'Native'
	};
}

/**
 * Build ERC20 token transfer transaction
 */
export async function buildERC20Transfer(
	publicClient: PublicClient,
	from: Address,
	to: Address,
	token: ERC20Token,
	chainId: number
): Promise<SweepTransaction | null> {
	// Get token balance
	const balance = (await publicClient.readContract({
		address: token.address,
		abi: ERC20_BALANCE_ABI,
		functionName: 'balanceOf',
		args: [from]
	})) as bigint;

	if (balance === 0n) {
		return null; // No balance to sweep
	}

	// Encode transfer function call
	const data = encodeFunctionData({
		abi: ERC20_TRANSFER_ABI,
		functionName: 'transfer',
		args: [to, balance]
	});

	// Get nonce
	const nonce = await publicClient.getTransactionCount({ address: from });

	return {
		from,
		to: token.address,
		data,
		chainId,
		nonce,
		tokenAddress: token.address,
		tokenSymbol: token.symbol,
		amount: balance
	};
}

/**
 * Execute a single sweep transaction
 */
export async function executeSweepTransaction(
	walletClient: WalletClient,
	transaction: SweepTransaction
): Promise<Hash> {
	// Send transaction
	const hash = await walletClient.sendTransaction({
		account: transaction.from,
		to: transaction.to,
		value: transaction.value,
		data: transaction.data,
		chain: walletClient.chain,
		nonce: transaction.nonce
	});

	return hash;
}

/**
 * Wait for transaction confirmation
 */
export async function waitForTransaction(
	publicClient: PublicClient,
	hash: Hash,
	confirmations = 1
): Promise<boolean> {
	try {
		const receipt = await publicClient.waitForTransactionReceipt({
			hash,
			confirmations
		});

		return receipt.status === 'success';
	} catch (error) {
		console.error('Transaction wait error:', error);
		return false;
	}
}

/**
 * Estimate gas for multiple transactions
 */
export async function estimateBatchGas(
	publicClient: PublicClient,
	transactions: SweepTransaction[]
): Promise<{ totalGas: bigint; totalCost: bigint }> {
	const gasPrice = await publicClient.getGasPrice();

	let totalGas = 0n;

	for (const tx of transactions) {
		if (tx.data) {
			// ERC20 transfer - estimate gas
			try {
				const gas = await publicClient.estimateGas({
					account: tx.from,
					to: tx.to,
					data: tx.data
				});
				totalGas += gas;
			} catch {
				// Use default ERC20 transfer gas
				totalGas += 65000n;
			}
		} else {
			// Native transfer - fixed gas
			totalGas += 21000n;
		}
	}

	const totalCost = totalGas * gasPrice;

	return { totalGas, totalCost };
}

/**
 * Build all sweep transactions for a wallet
 */
export async function buildWalletSweepTransactions(
	publicClient: PublicClient,
	wallet: ImportedWallet,
	targetAddress: Address,
	tokens: ERC20Token[],
	chainId: number,
	includeNative: boolean
): Promise<SweepTransaction[]> {
	const transactions: SweepTransaction[] = [];

	// Build ERC20 transfers first (they need gas)
	for (const token of tokens) {
		const tx = await buildERC20Transfer(
			publicClient,
			wallet.address,
			targetAddress,
			token,
			chainId
		);
		if (tx) {
			transactions.push(tx);
		}
	}

	// Build native transfer last (sends remaining balance)
	if (includeNative) {
		const tx = await buildNativeTransfer(publicClient, wallet.address, targetAddress, chainId);
		if (tx) {
			transactions.push(tx);
		}
	}

	return transactions;
}

/**
 * Format amount for display
 */
export function formatAmount(amount: bigint, decimals: number): string {
	const divisor = BigInt(10 ** decimals);
	const integerPart = amount / divisor;
	const fractionalPart = amount % divisor;

	const fractionalStr = fractionalPart.toString().padStart(decimals, '0');
	const trimmed = fractionalStr.replace(/0+$/, '');

	if (trimmed.length === 0) {
		return integerPart.toString();
	}

	return `${integerPart}.${trimmed}`;
}

import { parseUnits, encodeFunctionData } from 'viem';
import type { DistributionConfig, DistributionTransaction } from '../types/distribution';

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

/**
 * Build distribution transactions for all recipients
 */
export function buildDistributionTransactions(
	config: DistributionConfig
): DistributionTransaction[] {
	const transactions: DistributionTransaction[] = [];

	for (const recipient of config.recipients) {
		// Determine amount for this recipient
		let amount: string;
		if (config.amountMode === 'custom' && recipient.amount) {
			amount = recipient.amount;
		} else if (config.amountMode === 'equal' && config.amountPerRecipient) {
			amount = config.amountPerRecipient;
		} else {
			continue; // Skip if no amount
		}

		const amountBigInt = parseUnits(amount, config.token.decimals);

		if (config.token.type === 'native') {
			// Native token transfer
			transactions.push({
				to: recipient.address,
				value: amountBigInt,
				gasLimit: config.gasLimit || BigInt(21000),
				recipient,
				estimatedCost: config.gasLimit || BigInt(21000)
			});
		} else {
			// ERC20 transfer
			const data = encodeFunctionData({
				abi: ERC20_ABI,
				functionName: 'transfer',
				args: [recipient.address, amountBigInt]
			});

			transactions.push({
				to: config.token.address,
				data,
				gasLimit: config.gasLimit || BigInt(65000),
				recipient,
				estimatedCost: config.gasLimit || BigInt(65000)
			});
		}
	}

	return transactions;
}

/**
 * Calculate total amount to be distributed
 */
export function calculateTotalAmount(config: DistributionConfig): string {
	if (config.amountMode === 'equal' && config.amountPerRecipient) {
		const amount = parseFloat(config.amountPerRecipient);
		const total = amount * config.recipients.length;
		return total.toString();
	} else if (config.amountMode === 'custom') {
		const total = config.recipients.reduce((sum, recipient) => {
			const amount = parseFloat(recipient.amount || '0');
			return sum + amount;
		}, 0);
		return total.toString();
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

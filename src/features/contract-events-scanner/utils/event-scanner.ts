import type { PublicClient, Hex } from 'viem';
import { decodeEventLog } from 'viem';
import type { ScanConfig, ScannedEventLog, ScanProgress, ContractEvent } from '../types/scanner';

/**
 * Scan contract events in block range
 */
export async function scanContractEvents(
	client: PublicClient,
	config: ScanConfig,
	onProgress: (progress: ScanProgress) => void
): Promise<ScannedEventLog[]> {
	const allEvents: ScannedEventLog[] = [];
	const totalBlocks = config.toBlock - config.fromBlock + 1n;
	const BATCH_SIZE = 1000n; // Scan 1000 blocks at a time

	let currentFromBlock = config.fromBlock;

	onProgress({
		status: 'scanning',
		currentBlock: currentFromBlock,
		totalBlocks,
		scannedEvents: 0,
		percentage: 0,
		message: 'Starting event scan...'
	});

	try {
		while (currentFromBlock <= config.toBlock) {
			const currentToBlock =
				currentFromBlock + BATCH_SIZE - 1n < config.toBlock
					? currentFromBlock + BATCH_SIZE - 1n
					: config.toBlock;

			// Fetch logs for this batch
			const logs = await client.getLogs({
				address: config.contractAddress,
				event: config.eventAbi,
				fromBlock: currentFromBlock,
				toBlock: currentToBlock
			});

			// Process and decode logs
			for (const log of logs) {
				try {
					// Get block timestamp
					const block = await client.getBlock({
						blockNumber: log.blockNumber
					});

					// Decode event log
					const decoded = decodeEventLog({
						abi: [config.eventAbi],
						data: log.data,
						topics: log.topics
					});

					// Create scanned event
					const scannedEvent: ScannedEventLog = {
						id: `${log.transactionHash}-${log.logIndex}`,
						contractAddress: config.contractAddress,
						eventName: config.eventName,
						eventSignature: log.topics[0] || '0x',
						blockNumber: log.blockNumber,
						blockTimestamp: Number(block.timestamp),
						transactionHash: log.transactionHash as Hex,
						transactionIndex: log.transactionIndex || 0,
						logIndex: Number(log.logIndex),
						args: decoded.args as Record<string, unknown>,
						raw: {
							topics: log.topics as Hex[],
							data: log.data
						}
					};

					allEvents.push(scannedEvent);
				} catch (error) {
					console.warn('Failed to decode log:', log, error);
				}
			}

			// Update progress
			const scannedBlocks = currentToBlock - config.fromBlock + 1n;
			const percentage = Number((scannedBlocks * 100n) / totalBlocks);

			onProgress({
				status: 'scanning',
				currentBlock: currentToBlock,
				totalBlocks,
				scannedEvents: allEvents.length,
				percentage,
				message: `Scanned blocks ${currentFromBlock} to ${currentToBlock} (${allEvents.length} events found)`
			});

			currentFromBlock = currentToBlock + 1n;

			// Small delay to avoid rate limiting
			await new Promise((resolve) => setTimeout(resolve, 100));
		}

		onProgress({
			status: 'completed',
			currentBlock: config.toBlock,
			totalBlocks,
			scannedEvents: allEvents.length,
			percentage: 100,
			message: `Scan completed! Found ${allEvents.length} events`
		});

		return allEvents;
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error during scan';
		onProgress({
			status: 'error',
			currentBlock: currentFromBlock,
			totalBlocks,
			scannedEvents: allEvents.length,
			percentage: 0,
			message: 'Scan failed',
			error: errorMessage
		});
		throw error;
	}
}

/**
 * Convert date to approximate block number
 * Note: This is an estimation based on average block time
 */
export async function dateToBlockNumber(
	client: PublicClient,
	date: Date,
	averageBlockTime = 12 // seconds
): Promise<bigint> {
	const targetTimestamp = BigInt(Math.floor(date.getTime() / 1000));
	const latestBlock = await client.getBlock();
	const latestBlockNumber = latestBlock.number;
	const latestTimestamp = latestBlock.timestamp;

	if (targetTimestamp >= latestTimestamp) {
		return latestBlockNumber;
	}

	// Estimate block number based on average block time
	const timeDiff = latestTimestamp - targetTimestamp;
	const blockDiff = timeDiff / BigInt(averageBlockTime);
	const estimatedBlock = latestBlockNumber - blockDiff;

	return estimatedBlock > 0n ? estimatedBlock : 0n;
}

/**
 * Get event signature from ABI
 */
export function getEventSignature(event: ContractEvent): string {
	const inputs = event.inputs.map((input) => input.type).join(',');
	return `${event.name}(${inputs})`;
}

/**
 * Validate scan configuration
 */
export function validateScanConfig(config: Partial<ScanConfig>): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!config.chainId) {
		errors.push('Chain ID is required');
	}

	if (!config.contractAddress) {
		errors.push('Contract address is required');
	}

	if (!config.eventName) {
		errors.push('Event name is required');
	}

	if (!config.eventAbi) {
		errors.push('Event ABI is required');
	}

	if (config.fromBlock === undefined || config.toBlock === undefined) {
		errors.push('Block range is required');
	} else if (config.fromBlock > config.toBlock) {
		errors.push('From block must be less than or equal to to block');
	}

	return {
		valid: errors.length === 0,
		errors
	};
}

/**
 * Estimate scan duration
 */
export function estimateScanDuration(
	fromBlock: bigint,
	toBlock: bigint,
	batchSize = 1000n,
	batchDelay = 100 // ms
): number {
	const totalBlocks = toBlock - fromBlock + 1n;
	const batches = (totalBlocks + batchSize - 1n) / batchSize;
	const totalDelay = Number(batches) * batchDelay;
	const estimatedSeconds = totalDelay / 1000;
	return Math.ceil(estimatedSeconds);
}

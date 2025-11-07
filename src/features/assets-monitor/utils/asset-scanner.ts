import { createPublicClient, http, formatUnits, type Address } from 'viem';
import type {
	AssetMovement,
	ScanConfig,
	ScanProgress,
	TransactionDirection
} from '../types/assets';
import { generateMovementId } from '../db/assets-db';

// ERC20 Transfer event signature
const ERC20_TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';

// ERC721 Transfer event signature (same as ERC20)
const ERC721_TRANSFER_TOPIC = ERC20_TRANSFER_TOPIC;

// ERC20 ABI for getting token info
const ERC20_ABI = [
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'name',
		outputs: [{ name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function'
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function'
	}
] as const;

/**
 * Scan native ETH transfers
 */
async function scanNativeTransfers(
	client: ReturnType<typeof createPublicClient>,
	address: Address,
	startBlock: bigint,
	endBlock: bigint,
	onProgress?: (progress: Partial<ScanProgress>) => void
): Promise<AssetMovement[]> {
	const movements: AssetMovement[] = [];
	const BATCH_SIZE = 1000;

	for (let fromBlock = startBlock; fromBlock <= endBlock; fromBlock += BigInt(BATCH_SIZE)) {
		const toBlock =
			fromBlock + BigInt(BATCH_SIZE) - 1n > endBlock
				? endBlock
				: fromBlock + BigInt(BATCH_SIZE) - 1n;

		// Get blocks in range
		const blockNumbers: bigint[] = [];
		for (let i = fromBlock; i <= toBlock; i++) {
			blockNumbers.push(i);
		}

		// Check each block for transactions
		for (const blockNum of blockNumbers) {
			try {
				const block = await client.getBlock({ blockNumber: blockNum, includeTransactions: true });

				for (const tx of block.transactions) {
					if (typeof tx === 'string') continue;

					// Check if this transaction involves our address
					const isFrom = tx.from.toLowerCase() === address.toLowerCase();
					const isTo = tx.to?.toLowerCase() === address.toLowerCase();

					if (!isFrom && !isTo) continue;
					if (!tx.value || tx.value === 0n) continue;

					const movement: AssetMovement = {
						id: generateMovementId(tx.hash),
						txHash: tx.hash,
						blockNumber: Number(block.number),
						timestamp: Number(block.timestamp) * 1000,
						from: tx.from,
						to: tx.to || '0x0000000000000000000000000000000000000000',
						direction: isFrom ? 'out' : 'in',
						assetType: 'native',
						value: tx.value.toString(),
						formattedValue: formatUnits(tx.value, 18),
						gasUsed: tx.gas?.toString(),
						gasPrice: tx.gasPrice?.toString()
					};

					movements.push(movement);
				}

				if (onProgress) {
					onProgress({
						currentBlock: Number(blockNum),
						foundMovements: movements.length
					});
				}
			} catch (error) {
				console.error(`Error scanning block ${blockNum}:`, error);
			}
		}
	}

	return movements;
}

/**
 * Scan ERC20 transfers
 */
async function scanERC20Transfers(
	client: ReturnType<typeof createPublicClient>,
	address: Address,
	startBlock: bigint,
	endBlock: bigint,
	onProgress?: (progress: Partial<ScanProgress>) => void
): Promise<AssetMovement[]> {
	const movements: AssetMovement[] = [];

	// Get incoming transfers (where address is the recipient)
	const incomingLogs = await client.getLogs({
		fromBlock: startBlock,
		toBlock: endBlock,
		topics: [
			ERC20_TRANSFER_TOPIC,
			null,
			`0x000000000000000000000000${address.slice(2).toLowerCase()}`
		]
	});

	// Get outgoing transfers (where address is the sender)
	const outgoingLogs = await client.getLogs({
		fromBlock: startBlock,
		toBlock: endBlock,
		topics: [ERC20_TRANSFER_TOPIC, `0x000000000000000000000000${address.slice(2).toLowerCase()}`]
	});

	const allLogs = [...incomingLogs, ...outgoingLogs];

	for (const log of allLogs) {
		try {
			const from = `0x${log.topics[1]?.slice(26)}` as Address;
			const to = `0x${log.topics[2]?.slice(26)}` as Address;
			const value = BigInt(log.data);

			// Determine direction
			const isFrom = from.toLowerCase() === address.toLowerCase();
			const direction: TransactionDirection = isFrom ? 'out' : 'in';

			// Get token info
			let tokenSymbol: string | undefined;
			let tokenName: string | undefined;
			let tokenDecimals = 18;

			try {
				[tokenSymbol, tokenName, tokenDecimals] = await Promise.all([
					client.readContract({
						address: log.address,
						abi: ERC20_ABI,
						functionName: 'symbol'
					}),
					client.readContract({
						address: log.address,
						abi: ERC20_ABI,
						functionName: 'name'
					}),
					client.readContract({
						address: log.address,
						abi: ERC20_ABI,
						functionName: 'decimals'
					})
				]);
			} catch {
				// Token might not implement all methods
				console.warn(`Could not fetch token info for ${log.address}`);
			}

			const block = await client.getBlock({ blockNumber: log.blockNumber! });

			const movement: AssetMovement = {
				id: generateMovementId(log.transactionHash!, log.logIndex || 0),
				txHash: log.transactionHash!,
				blockNumber: Number(log.blockNumber),
				timestamp: Number(block.timestamp) * 1000,
				from,
				to,
				direction,
				assetType: 'erc20',
				value: value.toString(),
				formattedValue: formatUnits(value, tokenDecimals),
				tokenAddress: log.address,
				tokenSymbol,
				tokenName,
				tokenDecimals,
				contractAddress: log.address,
				logIndex: log.logIndex || 0
			};

			movements.push(movement);

			if (onProgress) {
				onProgress({
					foundMovements: movements.length
				});
			}
		} catch (error) {
			console.error(`Error processing ERC20 transfer:`, error);
		}
	}

	return movements;
}

/**
 * Scan ERC721 transfers
 */
async function scanERC721Transfers(
	client: ReturnType<typeof createPublicClient>,
	address: Address,
	startBlock: bigint,
	endBlock: bigint,
	onProgress?: (progress: Partial<ScanProgress>) => void
): Promise<AssetMovement[]> {
	const movements: AssetMovement[] = [];

	// Get incoming transfers
	const incomingLogs = await client.getLogs({
		fromBlock: startBlock,
		toBlock: endBlock,
		topics: [
			ERC721_TRANSFER_TOPIC,
			null,
			`0x000000000000000000000000${address.slice(2).toLowerCase()}`
		]
	});

	// Get outgoing transfers
	const outgoingLogs = await client.getLogs({
		fromBlock: startBlock,
		toBlock: endBlock,
		topics: [ERC721_TRANSFER_TOPIC, `0x000000000000000000000000${address.slice(2).toLowerCase()}`]
	});

	const allLogs = [...incomingLogs, ...outgoingLogs];

	for (const log of allLogs) {
		try {
			// Skip ERC20 transfers (they don't have tokenId in data)
			if (!log.data || log.data === '0x') continue;

			const from = `0x${log.topics[1]?.slice(26)}` as Address;
			const to = `0x${log.topics[2]?.slice(26)}` as Address;
			const tokenId = BigInt(log.topics[3] || '0x0');

			const isFrom = from.toLowerCase() === address.toLowerCase();
			const direction: TransactionDirection = isFrom ? 'out' : 'in';

			const block = await client.getBlock({ blockNumber: log.blockNumber! });

			const movement: AssetMovement = {
				id: generateMovementId(log.transactionHash!, log.logIndex || 0),
				txHash: log.transactionHash!,
				blockNumber: Number(log.blockNumber),
				timestamp: Number(block.timestamp) * 1000,
				from,
				to,
				direction,
				assetType: 'erc721',
				tokenId: tokenId.toString(),
				contractAddress: log.address,
				logIndex: log.logIndex || 0
			};

			movements.push(movement);

			if (onProgress) {
				onProgress({
					foundMovements: movements.length
				});
			}
		} catch (error) {
			console.error(`Error processing ERC721 transfer:`, error);
		}
	}

	return movements;
}

/**
 * Main scan function
 */
export async function scanAssetMovements(
	config: ScanConfig,
	rpcUrl: string,
	onProgress?: (progress: ScanProgress) => void
): Promise<AssetMovement[]> {
	const client = createPublicClient({
		transport: http(rpcUrl)
	});

	const latestBlock = await client.getBlockNumber();
	const startBlock = BigInt(config.startBlock || Number(latestBlock) - 1000);
	const endBlock = BigInt(config.endBlock || latestBlock);

	const totalBlocks = Number(endBlock - startBlock);
	let allMovements: AssetMovement[] = [];

	// Progress tracking
	const updateProgress = (partial: Partial<ScanProgress>) => {
		if (onProgress) {
			const progress: ScanProgress = {
				currentBlock: partial.currentBlock || Number(startBlock),
				totalBlocks,
				percentage: Math.round(((partial.currentBlock || Number(startBlock)) / totalBlocks) * 100),
				foundMovements: partial.foundMovements || allMovements.length,
				processedTransactions: partial.processedTransactions || 0
			};
			onProgress(progress);
		}
	};

	// Scan each asset type
	for (const assetType of config.assetTypes) {
		try {
			let movements: AssetMovement[] = [];

			switch (assetType) {
				case 'native':
					if (config.includeIncoming || config.includeOutgoing) {
						movements = await scanNativeTransfers(
							client,
							config.walletAddress,
							startBlock,
							endBlock,
							updateProgress
						);
					}
					break;

				case 'erc20':
					movements = await scanERC20Transfers(
						client,
						config.walletAddress,
						startBlock,
						endBlock,
						updateProgress
					);
					break;

				case 'erc721':
					movements = await scanERC721Transfers(
						client,
						config.walletAddress,
						startBlock,
						endBlock,
						updateProgress
					);
					break;

				case 'erc1155':
					// TODO: Implement ERC1155 scanning
					break;
			}

			// Filter by direction if needed
			if (!config.includeIncoming) {
				movements = movements.filter((m) => m.direction !== 'in');
			}
			if (!config.includeOutgoing) {
				movements = movements.filter((m) => m.direction !== 'out');
			}

			allMovements = [...allMovements, ...movements];
			updateProgress({ foundMovements: allMovements.length });
		} catch (error) {
			console.error(`Error scanning ${assetType}:`, error);
		}
	}

	// Sort by timestamp
	allMovements.sort((a, b) => a.timestamp - b.timestamp);

	return allMovements;
}

/**
 * Calculate balances from movements
 */
export function calculateBalances(movements: AssetMovement[]): Map<
	string,
	{
		assetType: string;
		tokenAddress?: string;
		tokenSymbol: string;
		tokenName: string;
		tokenDecimals: number;
		incoming: AssetMovement[];
		outgoing: AssetMovement[];
		totalIn: bigint;
		totalOut: bigint;
	}
> {
	const balances = new Map();

	// Group movements by asset
	for (const movement of movements) {
		const key =
			movement.assetType === 'native'
				? 'ETH'
				: movement.tokenAddress || movement.contractAddress || 'unknown';

		if (!balances.has(key)) {
			balances.set(key, {
				assetType: movement.assetType,
				tokenAddress: movement.tokenAddress,
				tokenSymbol: movement.tokenSymbol || 'ETH',
				tokenName: movement.tokenName || 'Ethereum',
				tokenDecimals: movement.tokenDecimals || 18,
				incoming: [],
				outgoing: [],
				totalIn: 0n,
				totalOut: 0n
			});
		}

		const balance = balances.get(key);

		if (movement.direction === 'in') {
			balance.incoming.push(movement);
			if (movement.value) {
				balance.totalIn += BigInt(movement.value);
			}
		} else {
			balance.outgoing.push(movement);
			if (movement.value) {
				balance.totalOut += BigInt(movement.value);
			}
		}
	}

	return balances;
}

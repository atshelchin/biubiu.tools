import type { Address } from 'viem';

/**
 * Asset types supported
 */
export type AssetType = 'native' | 'erc20' | 'erc721' | 'erc1155';

/**
 * Transaction direction
 */
export type TransactionDirection = 'in' | 'out';

/**
 * Asset movement record - represents a single transfer
 */
export interface AssetMovement {
	id: string; // Unique ID: txHash + logIndex
	txHash: string;
	blockNumber: number;
	timestamp: number;
	from: Address;
	to: Address;
	direction: TransactionDirection; // Relative to monitored address
	assetType: AssetType;

	// For native and ERC20
	value?: string; // Raw value in wei/smallest unit
	formattedValue?: string; // Formatted for display

	// For ERC20
	tokenAddress?: Address;
	tokenSymbol?: string;
	tokenName?: string;
	tokenDecimals?: number;

	// For ERC721
	tokenId?: string;

	// For ERC1155
	tokenIds?: string[];
	amounts?: string[];

	// Common
	contractAddress?: Address; // For token transfers
	logIndex?: number;
	gasUsed?: string;
	gasPrice?: string;
}

/**
 * Asset balance snapshot
 */
export interface AssetBalance {
	assetType: AssetType;

	// For native and ERC20
	balance?: string;
	formattedBalance?: string;

	// For ERC20
	tokenAddress?: Address;
	tokenSymbol?: string;
	tokenName?: string;
	tokenDecimals?: number;

	// For ERC721 and ERC1155
	nftBalances?: NFTBalance[];

	// Change during period
	totalIn?: string;
	totalOut?: string;
	netChange?: string;
	transactionCount?: number;
}

/**
 * NFT balance details
 */
export interface NFTBalance {
	tokenId: string;
	contractAddress: Address;
	amount?: string; // For ERC1155
	metadata?: NFTMetadata;
}

/**
 * NFT metadata
 */
export interface NFTMetadata {
	name?: string;
	description?: string;
	image?: string;
	attributes?: Array<{
		trait_type: string;
		value: string | number;
	}>;
}

/**
 * Scan configuration
 */
export interface ScanConfig {
	walletAddress: Address;
	chainId: number;
	startBlock?: number;
	endBlock?: number;
	startTime?: number; // Timestamp
	endTime?: number; // Timestamp
	assetTypes: AssetType[];
	includeIncoming: boolean;
	includeOutgoing: boolean;
}

/**
 * Scan status
 */
export type ScanStatus = 'idle' | 'scanning' | 'completed' | 'error' | 'paused';

/**
 * Scan progress
 */
export interface ScanProgress {
	currentBlock: number;
	totalBlocks: number;
	percentage: number;
	foundMovements: number;
	processedTransactions: number;
	estimatedTimeRemaining?: number; // In seconds
}

/**
 * Scan summary
 */
export interface ScanSummary {
	totalMovements: number;
	incomingCount: number;
	outgoingCount: number;
	uniqueAssets: number;
	timeRange: {
		start: number;
		end: number;
	};
	blockRange: {
		start: number;
		end: number;
	};
	assetBreakdown: {
		native: number;
		erc20: number;
		erc721: number;
		erc1155: number;
	};
}

/**
 * Filter options for movements
 */
export interface MovementFilter {
	assetTypes?: AssetType[];
	direction?: TransactionDirection;
	minValue?: string;
	maxValue?: string;
	tokenAddress?: Address;
	dateRange?: {
		start?: number;
		end?: number;
	};
	searchQuery?: string; // Search in symbol, name, address
}

/**
 * Sort options
 */
export interface SortOptions {
	field: 'timestamp' | 'value' | 'assetType' | 'direction';
	order: 'asc' | 'desc';
}

/**
 * Analysis period
 */
export type AnalysisPeriod = 'day' | 'week' | 'month' | 'custom';

/**
 * Asset statistics
 */
export interface AssetStatistics {
	totalValue?: string; // In USD if price available
	topAssets: Array<{
		asset: AssetBalance;
		valueUsd?: string;
		percentage?: number;
	}>;
	activityByDay: Array<{
		date: string;
		inCount: number;
		outCount: number;
		netValue?: string;
	}>;
	mostActiveAsset?: AssetBalance;
	largestIncoming?: AssetMovement;
	largestOutgoing?: AssetMovement;
}

/**
 * Export format
 */
export type ExportFormat = 'csv' | 'json' | 'excel';

/**
 * Saved scan session
 */
export interface ScanSession {
	id: string;
	name?: string;
	config: ScanConfig;
	summary: ScanSummary;
	createdAt: number;
	updatedAt: number;
	status: ScanStatus;
}

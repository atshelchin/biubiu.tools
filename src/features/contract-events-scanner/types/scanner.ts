import type { Address, Hex } from 'viem';

/**
 * Contract ABI Event definition
 */
export interface ContractEvent {
	type: 'event';
	name: string;
	inputs: Array<{
		name: string;
		type: string;
		indexed: boolean;
		internalType?: string;
	}>;
}

/**
 * Scanned event log from blockchain
 */
export interface ScannedEventLog {
	id: string; // Unique ID: txHash + logIndex
	contractAddress: Address;
	eventName: string;
	eventSignature: string; // Event signature hash
	blockNumber: bigint;
	blockTimestamp: number; // Unix timestamp
	transactionHash: Hex;
	transactionIndex: number;
	logIndex: number;
	args: Record<string, unknown>; // Decoded event arguments
	raw: {
		topics: Hex[];
		data: Hex;
	};
}

/**
 * Scan configuration
 */
export interface ScanConfig {
	chainId: number;
	contractAddress: Address;
	eventName: string;
	eventAbi: ContractEvent;
	fromBlock: bigint;
	toBlock: bigint;
	fromDate?: Date;
	toDate?: Date;
}

/**
 * Scan progress tracking
 */
export interface ScanProgress {
	status: 'idle' | 'scanning' | 'completed' | 'error';
	currentBlock: bigint;
	totalBlocks: bigint;
	scannedEvents: number;
	percentage: number;
	message: string;
	error?: string;
}

/**
 * Scan result metadata
 */
export interface ScanResult {
	id: string; // UUID
	chainId: number;
	contractAddress: Address;
	eventName: string;
	fromBlock: bigint;
	toBlock: bigint;
	fromDate: Date;
	toDate: Date;
	totalEvents: number;
	scannedAt: Date;
	scanDuration: number; // milliseconds
}

/**
 * Event analytics
 */
export interface EventAnalytics {
	totalEvents: number;
	uniqueAddresses: number;
	eventsPerBlock: number;
	eventsPerDay: number;
	timeRange: {
		from: Date;
		to: Date;
	};
	topAddresses: Array<{
		address: Address;
		count: number;
	}>;
	eventsByDate: Array<{
		date: string; // YYYY-MM-DD
		count: number;
	}>;
}

/**
 * Filter criteria for events
 */
export interface EventFilter {
	addresses?: Address[];
	dateRange?: {
		from: Date;
		to: Date;
	};
	blockRange?: {
		from: bigint;
		to: bigint;
	};
	searchText?: string;
}

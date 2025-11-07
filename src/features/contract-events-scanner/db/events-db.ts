import Dexie, { type Table } from 'dexie';
import type { ScannedEventLog, ScanResult } from '../types/scanner';

/**
 * IndexedDB schema for contract events
 */
export class EventsDatabase extends Dexie {
	// Tables
	events!: Table<ScannedEventLog, string>;
	scans!: Table<ScanResult, string>;

	constructor() {
		super('ContractEventsDB');

		// Define schema
		this.version(1).stores({
			// Events table
			events: 'id, contractAddress, eventName, blockNumber, blockTimestamp, transactionHash',
			// Scan results metadata
			scans: 'id, chainId, contractAddress, eventName, scannedAt'
		});
	}

	/**
	 * Add events in bulk
	 */
	async addEvents(events: ScannedEventLog[]): Promise<void> {
		await this.events.bulkAdd(events);
	}

	/**
	 * Get events for a contract and event name
	 */
	async getEvents(
		contractAddress: string,
		eventName: string,
		options?: {
			limit?: number;
			offset?: number;
			orderBy?: 'blockNumber' | 'blockTimestamp';
			order?: 'asc' | 'desc';
		}
	): Promise<ScannedEventLog[]> {
		let query = this.events
			.where('[contractAddress+eventName]')
			.equals([contractAddress.toLowerCase(), eventName]);

		// Apply ordering
		if (options?.orderBy) {
			query = query.reverse();
		}

		// Apply pagination
		if (options?.offset) {
			query = query.offset(options.offset);
		}
		if (options?.limit) {
			query = query.limit(options.limit);
		}

		return await query.toArray();
	}

	/**
	 * Count events for a contract and event name
	 */
	async countEvents(contractAddress: string, eventName: string): Promise<number> {
		return await this.events
			.where('[contractAddress+eventName]')
			.equals([contractAddress.toLowerCase(), eventName])
			.count();
	}

	/**
	 * Get events by date range
	 */
	async getEventsByDateRange(
		contractAddress: string,
		eventName: string,
		from: number,
		to: number
	): Promise<ScannedEventLog[]> {
		return await this.events
			.where('blockTimestamp')
			.between(from, to, true, true)
			.and(
				(event) =>
					event.contractAddress.toLowerCase() === contractAddress.toLowerCase() &&
					event.eventName === eventName
			)
			.toArray();
	}

	/**
	 * Search events by text in args
	 */
	async searchEvents(
		contractAddress: string,
		eventName: string,
		searchText: string
	): Promise<ScannedEventLog[]> {
		const allEvents = await this.getEvents(contractAddress, eventName);
		const lowerSearch = searchText.toLowerCase();

		return allEvents.filter((event) => {
			const argsString = JSON.stringify(event.args).toLowerCase();
			return argsString.includes(lowerSearch);
		});
	}

	/**
	 * Delete all events for a scan
	 */
	async deleteEventsForScan(contractAddress: string, eventName: string): Promise<void> {
		await this.events
			.where('[contractAddress+eventName]')
			.equals([contractAddress.toLowerCase(), eventName])
			.delete();
	}

	/**
	 * Add scan result
	 */
	async addScanResult(result: ScanResult): Promise<void> {
		await this.scans.add(result);
	}

	/**
	 * Get all scans
	 */
	async getAllScans(): Promise<ScanResult[]> {
		return await this.scans.orderBy('scannedAt').reverse().toArray();
	}

	/**
	 * Delete scan and its events
	 */
	async deleteScan(scanId: string): Promise<void> {
		const scan = await this.scans.get(scanId);
		if (scan) {
			await this.deleteEventsForScan(scan.contractAddress, scan.eventName);
			await this.scans.delete(scanId);
		}
	}

	/**
	 * Clear all data
	 */
	async clearAll(): Promise<void> {
		await this.events.clear();
		await this.scans.clear();
	}

	/**
	 * Export events to JSON
	 */
	async exportToJSON(contractAddress: string, eventName: string): Promise<string> {
		const events = await this.getEvents(contractAddress, eventName);
		return JSON.stringify(
			events,
			(key, value) => {
				// Convert bigint to string for JSON serialization
				return typeof value === 'bigint' ? value.toString() : value;
			},
			2
		);
	}

	/**
	 * Export events to CSV
	 */
	async exportToCSV(contractAddress: string, eventName: string): Promise<string> {
		const events = await this.getEvents(contractAddress, eventName);
		if (events.length === 0) return '';

		// Get all unique arg keys
		const argKeys = new Set<string>();
		events.forEach((event) => {
			Object.keys(event.args).forEach((key) => argKeys.add(key));
		});

		// Build CSV header
		const headers = [
			'Block Number',
			'Timestamp',
			'Transaction Hash',
			'Log Index',
			...Array.from(argKeys)
		];

		// Build CSV rows
		const rows = events.map((event) => {
			const row = [
				event.blockNumber.toString(),
				new Date(event.blockTimestamp * 1000).toISOString(),
				event.transactionHash,
				event.logIndex.toString(),
				...Array.from(argKeys).map((key) => {
					const value = event.args[key];
					if (typeof value === 'bigint') return value.toString();
					if (typeof value === 'object') return JSON.stringify(value);
					return String(value ?? '');
				})
			];
			return row.map((cell) => `"${cell}"`).join(',');
		});

		return [headers.join(','), ...rows].join('\n');
	}
}

// Singleton instance
export const eventsDB = new EventsDatabase();

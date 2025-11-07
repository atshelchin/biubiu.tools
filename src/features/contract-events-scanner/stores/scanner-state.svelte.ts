import type { Address } from 'viem';
import type { ContractEvent, ScanConfig, ScanProgress, ScannedEventLog } from '../types/scanner';

/**
 * Step 2: Contract Configuration State
 */
class ContractConfigState {
	contractAddress = $state<Address | ''>('');
	contractABI = $state<string>(''); // JSON string
	parsedEvents = $state<ContractEvent[]>([]);
	selectedEvent = $state<ContractEvent | null>(null);
	isValidContract = $state(false);
	error = $state<string>('');

	setContractAddress(address: Address | '') {
		this.contractAddress = address;
		this.error = '';
	}

	setContractABI(abi: string) {
		this.contractABI = abi;
		this.error = '';
		this.parseEvents();
	}

	parseEvents() {
		try {
			const abi = JSON.parse(this.contractABI);
			if (!Array.isArray(abi)) {
				this.error = 'ABI must be an array';
				this.parsedEvents = [];
				return;
			}

			// Filter only event types
			const events = abi.filter((item) => item.type === 'event') as ContractEvent[];
			this.parsedEvents = events;
			this.isValidContract = events.length > 0;

			if (events.length === 0) {
				this.error = 'No events found in ABI';
			}
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Invalid JSON';
			this.parsedEvents = [];
			this.isValidContract = false;
		}
	}

	selectEvent(event: ContractEvent | null) {
		this.selectedEvent = event;
	}

	reset() {
		this.contractAddress = '';
		this.contractABI = '';
		this.parsedEvents = [];
		this.selectedEvent = null;
		this.isValidContract = false;
		this.error = '';
	}

	getScanConfig(): Partial<ScanConfig> | null {
		if (!this.contractAddress || !this.selectedEvent) return null;
		return {
			contractAddress: this.contractAddress,
			eventName: this.selectedEvent.name,
			eventAbi: this.selectedEvent
		};
	}
}

/**
 * Step 3: Time Range State
 */
class TimeRangeState {
	fromDate = $state<Date | null>(null);
	toDate = $state<Date | null>(null);
	fromBlock = $state<bigint | null>(null);
	toBlock = $state<bigint | null>(null);
	useBlockRange = $state(false); // false = date range, true = block range

	setDateRange(from: Date | null, to: Date | null) {
		this.fromDate = from;
		this.toDate = to;
		this.useBlockRange = false;
	}

	setBlockRange(from: bigint | null, to: bigint | null) {
		this.fromBlock = from;
		this.toBlock = to;
		this.useBlockRange = true;
	}

	isValid(): boolean {
		if (this.useBlockRange) {
			return this.fromBlock !== null && this.toBlock !== null && this.fromBlock <= this.toBlock;
		} else {
			return this.fromDate !== null && this.toDate !== null && this.fromDate <= this.toDate;
		}
	}

	reset() {
		this.fromDate = null;
		this.toDate = null;
		this.fromBlock = null;
		this.toBlock = null;
		this.useBlockRange = false;
	}
}

/**
 * Step 4: Scan State
 */
class ScanState {
	isScanning = $state(false);
	progress = $state<ScanProgress>({
		status: 'idle',
		currentBlock: 0n,
		totalBlocks: 0n,
		scannedEvents: 0,
		percentage: 0,
		message: 'Ready to scan'
	});
	scannedEvents = $state<ScannedEventLog[]>([]);

	startScan() {
		this.isScanning = true;
		this.progress = {
			status: 'scanning',
			currentBlock: 0n,
			totalBlocks: 0n,
			scannedEvents: 0,
			percentage: 0,
			message: 'Starting scan...'
		};
		this.scannedEvents = [];
	}

	updateProgress(progress: Partial<ScanProgress>) {
		this.progress = { ...this.progress, ...progress };
	}

	addEvents(events: ScannedEventLog[]) {
		this.scannedEvents = [...this.scannedEvents, ...events];
		this.progress.scannedEvents = this.scannedEvents.length;
	}

	completeScan() {
		this.isScanning = false;
		this.progress.status = 'completed';
		this.progress.message = `Scan completed! Found ${this.scannedEvents.length} events`;
		this.progress.percentage = 100;
	}

	failScan(error: string) {
		this.isScanning = false;
		this.progress.status = 'error';
		this.progress.error = error;
		this.progress.message = 'Scan failed';
	}

	reset() {
		this.isScanning = false;
		this.progress = {
			status: 'idle',
			currentBlock: 0n,
			totalBlocks: 0n,
			scannedEvents: 0,
			percentage: 0,
			message: 'Ready to scan'
		};
		this.scannedEvents = [];
	}
}

/**
 * Step 5: Results State
 */
class ResultsState {
	selectedEvents = $state<ScannedEventLog[]>([]);
	filterText = $state('');
	sortBy = $state<'blockNumber' | 'timestamp'>('blockNumber');
	sortOrder = $state<'asc' | 'desc'>('desc');
	currentPage = $state(1);
	pageSize = $state(50);

	setEvents(events: ScannedEventLog[]) {
		this.selectedEvents = events;
	}

	setFilter(text: string) {
		this.filterText = text;
		this.currentPage = 1; // Reset to first page
	}

	setSorting(sortBy: 'blockNumber' | 'timestamp', sortOrder: 'asc' | 'desc') {
		this.sortBy = sortBy;
		this.sortOrder = sortOrder;
	}

	setPage(page: number) {
		this.currentPage = page;
	}

	getFilteredEvents(): ScannedEventLog[] {
		let filtered = this.selectedEvents;

		// Apply text filter
		if (this.filterText) {
			const searchLower = this.filterText.toLowerCase();
			filtered = filtered.filter((event) => {
				const argsString = JSON.stringify(event.args).toLowerCase();
				const txHash = event.transactionHash.toLowerCase();
				return argsString.includes(searchLower) || txHash.includes(searchLower);
			});
		}

		// Apply sorting
		filtered.sort((a, b) => {
			const aVal = this.sortBy === 'blockNumber' ? a.blockNumber : BigInt(a.blockTimestamp);
			const bVal = this.sortBy === 'blockNumber' ? b.blockNumber : BigInt(b.blockTimestamp);

			if (this.sortOrder === 'asc') {
				return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
			} else {
				return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
			}
		});

		return filtered;
	}

	getPaginatedEvents(): ScannedEventLog[] {
		const filtered = this.getFilteredEvents();
		const start = (this.currentPage - 1) * this.pageSize;
		const end = start + this.pageSize;
		return filtered.slice(start, end);
	}

	getTotalPages(): number {
		const filtered = this.getFilteredEvents();
		return Math.ceil(filtered.length / this.pageSize);
	}

	reset() {
		this.selectedEvents = [];
		this.filterText = '';
		this.sortBy = 'blockNumber';
		this.sortOrder = 'desc';
		this.currentPage = 1;
		this.pageSize = 50;
	}
}

// Export singleton instances
export const contractConfigState = new ContractConfigState();
export const timeRangeState = new TimeRangeState();
export const scanState = new ScanState();
export const resultsState = new ResultsState();

// Global reset
export function resetAllStates() {
	contractConfigState.reset();
	timeRangeState.reset();
	scanState.reset();
	resultsState.reset();
}

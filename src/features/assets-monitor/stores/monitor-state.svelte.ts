import type {
	ScanConfig,
	ScanStatus,
	ScanProgress,
	ScanSummary,
	AssetMovement,
	AssetBalance,
	MovementFilter,
	SortOptions,
	ScanSession
} from '../types/assets';
import { assetsDB } from '../db/assets-db';

/**
 * Module-level state for Assets Monitor
 */
class MonitorState {
	// Current scan session
	currentSessionId = $state<string | null>(null);
	scanConfig = $state<ScanConfig | null>(null);

	// Scan status and progress
	scanStatus = $state<ScanStatus>('idle');
	scanProgress = $state<ScanProgress>({
		currentBlock: 0,
		totalBlocks: 0,
		percentage: 0,
		foundMovements: 0,
		processedTransactions: 0
	});
	error = $state<string | null>(null);

	// Data
	movements = $state<AssetMovement[]>([]);
	balances = $state<AssetBalance[]>([]);
	summary = $state<ScanSummary | null>(null);

	// Filters and sorting
	movementFilter = $state<MovementFilter>({});
	sortOptions = $state<SortOptions>({
		field: 'timestamp',
		order: 'desc'
	});

	// Sessions
	sessions = $state<ScanSession[]>([]);
	selectedSession = $state<ScanSession | null>(null);

	// UI state
	activeTab = $state<'movements' | 'balances' | 'analytics'>('movements');

	// Computed: Filtered and sorted movements
	get filteredMovements(): AssetMovement[] {
		let filtered = [...this.movements];

		// Apply asset type filter
		if (this.movementFilter.assetTypes && this.movementFilter.assetTypes.length > 0) {
			filtered = filtered.filter((m) => this.movementFilter.assetTypes!.includes(m.assetType));
		}

		// Apply direction filter
		if (this.movementFilter.direction) {
			filtered = filtered.filter((m) => m.direction === this.movementFilter.direction);
		}

		// Apply date range filter
		if (this.movementFilter.dateRange) {
			const { start, end } = this.movementFilter.dateRange;
			if (start) {
				filtered = filtered.filter((m) => m.timestamp >= start);
			}
			if (end) {
				filtered = filtered.filter((m) => m.timestamp <= end);
			}
		}

		// Apply search query
		if (this.movementFilter.searchQuery) {
			const query = this.movementFilter.searchQuery.toLowerCase();
			filtered = filtered.filter(
				(m) =>
					m.tokenSymbol?.toLowerCase().includes(query) ||
					m.tokenName?.toLowerCase().includes(query) ||
					m.tokenAddress?.toLowerCase().includes(query) ||
					m.contractAddress?.toLowerCase().includes(query) ||
					m.txHash.toLowerCase().includes(query)
			);
		}

		// Apply sorting
		const { field, order } = this.sortOptions;
		filtered.sort((a, b) => {
			let comparison = 0;

			switch (field) {
				case 'timestamp':
					comparison = a.timestamp - b.timestamp;
					break;
				case 'value':
					comparison = BigInt(a.value || '0') > BigInt(b.value || '0') ? 1 : -1;
					break;
				case 'assetType':
					comparison = a.assetType.localeCompare(b.assetType);
					break;
				case 'direction':
					comparison = a.direction.localeCompare(b.direction);
					break;
			}

			return order === 'asc' ? comparison : -comparison;
		});

		return filtered;
	}

	// Reset state
	reset() {
		this.currentSessionId = null;
		this.scanConfig = null;
		this.scanStatus = 'idle';
		this.scanProgress = {
			currentBlock: 0,
			totalBlocks: 0,
			percentage: 0,
			foundMovements: 0,
			processedTransactions: 0
		};
		this.error = null;
		this.movements = [];
		this.balances = [];
		this.summary = null;
		this.movementFilter = {};
		this.sortOptions = {
			field: 'timestamp',
			order: 'desc'
		};
		this.activeTab = 'movements';
	}

	// Set scan config
	setScanConfig(config: ScanConfig) {
		this.scanConfig = config;
	}

	// Set scan status
	setScanStatus(status: ScanStatus) {
		this.scanStatus = status;
	}

	// Set error
	setError(error: string | null) {
		this.error = error;
	}

	// Set progress
	setProgress(progress: Partial<ScanProgress>) {
		this.scanProgress = { ...this.scanProgress, ...progress };
	}

	// Set movements
	setMovements(movements: AssetMovement[]) {
		this.movements = movements;
	}

	// Add movements
	addMovements(movements: AssetMovement[]) {
		this.movements = [...this.movements, ...movements];
	}

	// Set balances
	setBalances(balances: AssetBalance[]) {
		this.balances = balances;
	}

	// Set summary
	setSummary(summary: ScanSummary) {
		this.summary = summary;
	}

	// Set filter
	setFilter(filter: MovementFilter) {
		this.movementFilter = { ...this.movementFilter, ...filter };
	}

	// Clear filter
	clearFilter() {
		this.movementFilter = {};
	}

	// Set sort
	setSort(options: SortOptions) {
		this.sortOptions = options;
	}

	// Set active tab
	setActiveTab(tab: 'movements' | 'balances' | 'analytics') {
		this.activeTab = tab;
	}

	// Load session from DB
	async loadSession(sessionId: string) {
		try {
			const session = await assetsDB.sessions.get(sessionId);
			if (!session) {
				throw new Error('Session not found');
			}

			const movements = await assetsDB.getSessionMovements(sessionId);
			const balances = await assetsDB.getSessionBalances(sessionId);

			this.currentSessionId = sessionId;
			this.selectedSession = session;
			this.scanConfig = session.config;
			this.movements = movements;
			this.balances = balances;
			this.summary = session.summary;
			this.scanStatus = session.status;

			return session;
		} catch (error) {
			console.error('Failed to load session:', error);
			this.setError(error instanceof Error ? error.message : 'Failed to load session');
			return null;
		}
	}

	// Load all sessions
	async loadAllSessions() {
		try {
			const sessions = await assetsDB.getAllSessions();
			this.sessions = sessions;
			return sessions;
		} catch (error) {
			console.error('Failed to load sessions:', error);
			return [];
		}
	}

	// Delete session
	async deleteSession(sessionId: string) {
		try {
			await assetsDB.clearSession(sessionId);
			await this.loadAllSessions();

			if (this.currentSessionId === sessionId) {
				this.reset();
			}
		} catch (error) {
			console.error('Failed to delete session:', error);
			this.setError(error instanceof Error ? error.message : 'Failed to delete session');
		}
	}

	// Save current session
	async saveSession(name?: string) {
		if (!this.currentSessionId || !this.scanConfig || !this.summary) {
			throw new Error('No active session to save');
		}

		try {
			const session: ScanSession = {
				id: this.currentSessionId,
				name,
				config: this.scanConfig,
				summary: this.summary,
				createdAt: Date.now(),
				updatedAt: Date.now(),
				status: this.scanStatus
			};

			await assetsDB.sessions.put(session);
			await this.loadAllSessions();

			return session;
		} catch (error) {
			console.error('Failed to save session:', error);
			this.setError(error instanceof Error ? error.message : 'Failed to save session');
			return null;
		}
	}
}

export const monitorState = new MonitorState();

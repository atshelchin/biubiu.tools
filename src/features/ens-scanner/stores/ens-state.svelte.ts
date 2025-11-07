import type {
	ENSNameInfo,
	NameGenerationConfig,
	ScanStatus,
	ScanProgress,
	FilterOptions,
	ScanSummary
} from '../types/ens';

/**
 * Module-level state for ENS Scanner
 * Shared across all components
 */
class ENSState {
	// Step 2: Name generation & import
	generationConfig = $state<NameGenerationConfig | null>(null);
	customNames = $state<string[]>([]);
	generatedNames = $state<string[]>([]);

	// Step 3 & 4: Scan results
	scanStatus = $state<ScanStatus>('idle');
	scanProgress = $state<ScanProgress>({
		current: 0,
		total: 0,
		percentage: 0
	});
	ensNames = $state<ENSNameInfo[]>([]);
	error = $state<string | null>(null);

	// Step 4: Filtering
	filterOptions = $state<FilterOptions>({
		sortBy: 'name',
		sortOrder: 'asc'
	});

	// Computed summary
	get summary(): ScanSummary {
		const summary: ScanSummary = {
			total: this.ensNames.length,
			available: 0,
			registered: 0,
			expired: 0,
			gracePeriod: 0,
			errors: 0
		};

		for (const name of this.ensNames) {
			switch (name.status) {
				case 'available':
					summary.available++;
					break;
				case 'registered':
					summary.registered++;
					break;
				case 'expired':
					summary.expired++;
					break;
				case 'grace-period':
					summary.gracePeriod++;
					break;
				case 'error':
					summary.errors++;
					break;
			}
		}

		return summary;
	}

	// Get filtered and sorted names
	get filteredNames(): ENSNameInfo[] {
		let filtered = [...this.ensNames];

		// Apply status filter
		if (this.filterOptions.status && this.filterOptions.status.length > 0) {
			filtered = filtered.filter((name) => this.filterOptions.status!.includes(name.status));
		}

		// Apply expiry filter
		if (this.filterOptions.expiryDays) {
			const { min, max } = this.filterOptions.expiryDays;
			filtered = filtered.filter((name) => {
				if (name.daysUntilExpiry === undefined) return false;
				if (min !== undefined && name.daysUntilExpiry < min) return false;
				if (max !== undefined && name.daysUntilExpiry > max) return false;
				return true;
			});
		}

		// Apply sorting
		const { sortBy, sortOrder } = this.filterOptions;
		filtered.sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'expiryDate':
					comparison = (a.expiryDate || 0) - (b.expiryDate || 0);
					break;
				case 'status':
					comparison = a.status.localeCompare(b.status);
					break;
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		return filtered;
	}

	// Get all names (generated + custom)
	get allNames(): string[] {
		return [...new Set([...this.generatedNames, ...this.customNames])];
	}

	// Reset all state
	reset() {
		this.generationConfig = null;
		this.customNames = [];
		this.generatedNames = [];
		this.scanStatus = 'idle';
		this.scanProgress = { current: 0, total: 0, percentage: 0 };
		this.ensNames = [];
		this.error = null;
		this.filterOptions = {
			sortBy: 'name',
			sortOrder: 'asc'
		};
	}

	// Set generation config
	setGenerationConfig(config: NameGenerationConfig | null) {
		this.generationConfig = config;
	}

	// Add custom name
	addCustomName(name: string) {
		const cleanName = name.toLowerCase().trim().replace('.eth', '');
		if (cleanName && !this.customNames.includes(cleanName)) {
			this.customNames = [...this.customNames, cleanName];
		}
	}

	// Remove custom name
	removeCustomName(name: string) {
		this.customNames = this.customNames.filter((n) => n !== name);
	}

	// Set custom names
	setCustomNames(names: string[]) {
		this.customNames = names.map((n) => n.toLowerCase().trim().replace('.eth', ''));
	}

	// Clear custom names
	clearCustomNames() {
		this.customNames = [];
	}

	// Set generated names
	setGeneratedNames(names: string[]) {
		this.generatedNames = names.map((n) => n.toLowerCase().trim().replace('.eth', ''));
	}

	// Clear generated names
	clearGeneratedNames() {
		this.generatedNames = [];
	}

	// Clear all names
	clearAllNames() {
		this.customNames = [];
		this.generatedNames = [];
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
	setProgress(progress: ScanProgress) {
		this.scanProgress = progress;
	}

	// Get progress
	get progress() {
		return this.scanProgress;
	}

	// Set ENS names
	setENSNames(names: ENSNameInfo[]) {
		this.ensNames = names;
	}

	// Set filter options
	setFilterOptions(options: FilterOptions) {
		this.filterOptions = { ...this.filterOptions, ...options };
	}

	// Clear filters
	clearFilters() {
		this.filterOptions = {
			sortBy: 'name',
			sortOrder: 'asc'
		};
	}
}

export const ensState = new ENSState();

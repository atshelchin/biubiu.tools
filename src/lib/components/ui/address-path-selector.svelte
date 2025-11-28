<script lang="ts">
	import { slide } from 'svelte/transition';
	import { Calendar, Hash } from '@lucide/svelte';

	interface Props {
		/** Path generation type */
		pathType?: 'sequential' | 'date';
		/** On path type change */
		onPathTypeChange?: (type: 'sequential' | 'date') => void;
		/** Sequential mode: start index */
		startIndex?: number;
		/** Sequential mode: end index */
		endIndex?: number;
		/** Date mode: start year */
		startYear?: number;
		/** Date mode: end year */
		endYear?: number;
		/** Date mode: include month */
		includeMonth?: boolean;
		/** Date mode: include day */
		includeDay?: boolean;
		/** Date mode: use leading zeros */
		useLeadingZeros?: boolean;
		/** Maximum addresses per batch */
		maxAddresses?: number;
		/** On values change */
		onChange?: (values: {
			startIndex?: number;
			endIndex?: number;
			startYear?: number;
			endYear?: number;
			includeMonth?: boolean;
			includeDay?: boolean;
			useLeadingZeros?: boolean;
		}) => void;
	}

	let {
		pathType = $bindable('sequential'),
		onPathTypeChange,
		startIndex = $bindable(0),
		endIndex = $bindable(999),
		startYear = $bindable(new Date().getFullYear() - 10),
		endYear = $bindable(new Date().getFullYear()),
		includeMonth = $bindable(false),
		includeDay = $bindable(false),
		useLeadingZeros = $bindable(true),
		maxAddresses = 100_000,
		onChange
	}: Props = $props();

	// Path type options
	const pathOptions = [
		{
			type: 'sequential',
			icon: Hash,
			label: 'Sequential',
			description: '0, 1, 2, 3...'
		},
		{
			type: 'date',
			icon: Calendar,
			label: 'Date-based',
			description: '20240101, 20240102...'
		}
	] as const;

	// Quick range presets for sequential mode
	const sequentialPresets = [
		{ label: '1,000', value: 1_000 },
		{ label: '10,000', value: 10_000 },
		{ label: '100,000', value: 100_000 }
	];

	// Quick range presets for date mode (backwards from current year)
	const datePresets = [
		{ label: 'Past 1 Year', years: 1 },
		{ label: 'Past 10 Years', years: 10 },
		{ label: 'Past 100 Years', years: 100 }
	];

	// Computed values
	const addressCount = $derived(() => {
		if (pathType === 'sequential') {
			const count = Math.max(0, endIndex - startIndex + 1);
			return Math.min(count, maxAddresses);
		} else {
			const years = Math.max(0, endYear - startYear + 1);
			let count: number;

			if (!includeMonth && !includeDay) {
				// Year only: just count the years
				count = years;
			} else if (includeMonth && !includeDay) {
				// Year + Month: 12 months per year
				count = years * 12;
			} else {
				// Full date: approximate days
				// More accurate: account for leap years
				const startDate = new Date(startYear, 0, 1);
				const endDate = new Date(endYear, 11, 31);
				const diffTime = endDate.getTime() - startDate.getTime();
				count = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
			}

			return Math.min(count, maxAddresses);
		}
	});

	const isOverLimit = $derived(
		pathType === 'sequential' ? endIndex - startIndex + 1 > maxAddresses : false
	);

	const dateFormat = $derived(() => {
		// Always use full date format with leading zeros
		return 'YYYYMMDD';
	});

	// Handlers
	function handlePathTypeChange(type: 'sequential' | 'date') {
		pathType = type;
		onPathTypeChange?.(type);
		notifyChange();
	}

	function handleSequentialPreset(count: number) {
		endIndex = startIndex + count - 1;
		notifyChange();
	}

	function handleDatePreset(years: number) {
		const currentYear = new Date().getFullYear();
		// "Past 1 Year" means current year only: 2025-2025
		// "Past 10 Years" means 10 years back including current: 2016-2025
		// "Past 100 Years" means 100 years back including current: 1926-2025
		startYear = currentYear - years + 1;
		endYear = currentYear;
		notifyChange();
	}

	function notifyChange() {
		onChange?.({
			startIndex,
			endIndex,
			startYear,
			endYear,
			includeMonth,
			includeDay,
			useLeadingZeros
		});
	}

	// Watch for changes
	$effect(() => {
		// Enforce max limit for sequential mode
		if (pathType === 'sequential' && endIndex - startIndex + 1 > maxAddresses) {
			endIndex = startIndex + maxAddresses - 1;
		}
		// Force full date format with leading zeros for date mode
		if (pathType === 'date') {
			includeMonth = true;
			includeDay = true;
			useLeadingZeros = true;
		}
		notifyChange();
	});
</script>

<div class="address-path-selector">
	<!-- Path Type Selection -->
	<div class="path-type-grid">
		{#each pathOptions as option (option.type)}
			{@const Icon = option.icon}
			<button
				class="path-type-card"
				class:selected={pathType === option.type}
				onclick={() => handlePathTypeChange(option.type)}
			>
				<div class="path-icon">
					<Icon size={24} />
				</div>
				<div class="path-label">{option.label}</div>
				<div class="path-desc">{option.description}</div>
			</button>
		{/each}
	</div>

	<!-- Sequential Mode Controls -->
	{#if pathType === 'sequential'}
		<div class="controls-section" transition:slide={{ duration: 300 }}>
			<!-- Quick Presets -->
			<div class="presets-row">
				<span class="presets-label">Quick Select:</span>
				<div class="presets-buttons">
					{#each sequentialPresets as preset (preset.value)}
						<button class="preset-btn" onclick={() => handleSequentialPreset(preset.value)}>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Range Inputs -->
			<div class="range-inputs">
				<div class="input-group">
					<label for="start-index">Start</label>
					<input
						id="start-index"
						type="number"
						bind:value={startIndex}
						min="0"
						max={maxAddresses - 1}
						class="range-input"
					/>
				</div>

				<span class="range-separator">to</span>

				<div class="input-group">
					<label for="end-index">End</label>
					<input
						id="end-index"
						type="number"
						bind:value={endIndex}
						min={startIndex}
						max={startIndex + maxAddresses - 1}
						class="range-input"
						class:error={isOverLimit}
					/>
				</div>
			</div>

			<!-- Address Count Display -->
			<div class="count-display" class:warning={isOverLimit}>
				<span class="count-label">Will generate:</span>
				<span class="count-value">{addressCount()}</span>
				<span class="count-unit">addresses</span>
				{#if isOverLimit}
					<span class="count-warning">(Limited to {maxAddresses} max)</span>
				{/if}
			</div>
		</div>
	{/if}

	<!-- Date Mode Controls -->
	{#if pathType === 'date'}
		<div class="controls-section" transition:slide={{ duration: 300 }}>
			<!-- Quick Presets -->
			<div class="presets-row">
				<span class="presets-label">Quick Select:</span>
				<div class="presets-buttons">
					{#each datePresets as preset (preset.years)}
						<button class="preset-btn" onclick={() => handleDatePreset(preset.years)}>
							{preset.label}
						</button>
					{/each}
				</div>
			</div>

			<!-- Year Range Inputs -->
			<div class="range-inputs">
				<div class="input-group">
					<label for="start-year">From Year</label>
					<input
						id="start-year"
						type="number"
						bind:value={startYear}
						min={new Date().getFullYear() - 100}
						max={endYear}
						class="range-input"
					/>
				</div>

				<span class="range-separator">to</span>

				<div class="input-group">
					<label for="end-year">To Year</label>
					<input
						id="end-year"
						type="number"
						bind:value={endYear}
						min={startYear}
						max={new Date().getFullYear()}
						class="range-input"
					/>
				</div>
			</div>

			<!-- Format Preview -->
			<div class="format-preview">
				<span class="preview-label">Format:</span>
				<code class="preview-format">{dateFormat()}</code>
				<span class="preview-example">
					Example: {startYear}0101 to {endYear}1231
				</span>
			</div>

			<!-- Estimated Count -->
			<div class="count-display">
				<span class="count-label">Estimated addresses:</span>
				<span class="count-value">{addressCount()}</span>
			</div>
		</div>
	{/if}
</div>

<style>
	.address-path-selector {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* Path Type Selection */
	.path-type-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: var(--space-3);
	}

	.path-type-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.path-type-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.path-type-card.selected {
		border-color: var(--color-primary);
		background: rgba(59, 130, 246, 0.05);
		box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
	}

	.path-icon {
		color: var(--gray-600);
		transition: color 0.2s;
	}

	.path-type-card.selected .path-icon {
		color: var(--color-primary);
	}

	:global([data-theme='dark']) .path-icon {
		color: var(--gray-400);
	}

	.path-label {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .path-label {
		color: var(--gray-100);
	}

	.path-desc {
		font-size: var(--text-xs);
		color: var(--gray-500);
		font-family: monospace;
	}

	/* Controls Section */
	.controls-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	/* Presets Row */
	.presets-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.presets-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .presets-label {
		color: var(--gray-400);
	}

	.presets-buttons {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.preset-btn {
		padding: var(--space-1) var(--space-3);
		background: var(--white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .preset-btn {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	.preset-btn:hover {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
		transform: translateY(-1px);
	}

	/* Range Inputs */
	.range-inputs {
		display: flex;
		align-items: flex-end;
		gap: var(--space-3);
	}

	.input-group {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.input-group label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .input-group label {
		color: var(--gray-400);
	}

	.range-input {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		background: var(--white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-base);
		font-family: monospace;
		color: var(--gray-900);
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .range-input {
		background: var(--gray-700);
		color: var(--gray-100);
	}

	.range-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.range-input.error {
		border-color: hsl(0, 70%, 50%);
	}

	.range-separator {
		padding: 0 var(--space-1);
		color: var(--gray-500);
		font-size: var(--text-sm);
		align-self: center;
		margin-bottom: var(--space-2);
	}

	/* Count Display */
	.count-display {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: rgba(59, 130, 246, 0.05);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}

	.count-display.warning {
		background: rgba(245, 158, 11, 0.05);
		border-color: rgba(245, 158, 11, 0.3);
	}

	.count-label {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .count-label {
		color: var(--gray-400);
	}

	.count-value {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-primary);
	}

	.count-unit {
		color: var(--gray-500);
	}

	.count-warning {
		margin-left: auto;
		color: hsl(38, 92%, 50%);
		font-weight: var(--font-medium);
	}

	/* Format Preview */
	.format-preview {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .format-preview {
		background: var(--gray-800);
	}

	.preview-label {
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .preview-label {
		color: var(--gray-400);
	}

	.preview-format {
		padding: var(--space-1) var(--space-2);
		background: rgba(59, 130, 246, 0.1);
		border-radius: var(--radius-sm);
		font-family: monospace;
		font-weight: var(--font-bold);
		color: var(--color-primary);
	}

	.preview-example {
		margin-left: auto;
		color: var(--gray-500);
		font-family: monospace;
	}

	/* Mobile Responsive */
	@media (max-width: 640px) {
		.path-type-grid {
			grid-template-columns: 1fr;
		}

		.range-inputs {
			flex-direction: column;
			align-items: stretch;
		}

		.range-separator {
			align-self: center;
			margin: var(--space-1) 0;
		}

		.presets-row {
			flex-direction: column;
			align-items: flex-start;
		}

		.format-preview {
			flex-direction: column;
			align-items: flex-start;
		}

		.preview-example {
			margin-left: 0;
		}
	}
</style>

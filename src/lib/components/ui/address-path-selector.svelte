<script lang="ts">
	import { slide } from 'svelte/transition';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Settings2 } from '@lucide/svelte';
	import SegmentedControl from '$lib/components/ui/segmented-control.svelte';
	import AddressCountHint from '$lib/components/ui/address-count-hint.svelte';

	const i18n = useI18n();

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

	// Helper to get current year without triggering Date reactivity warning
	const getCurrentYear = () => {
		const date = new Date();
		return date.getFullYear();
	};

	let {
		pathType = $bindable('sequential'),
		onPathTypeChange,
		startIndex = $bindable(0),
		endIndex = $bindable(999),
		startYear = $bindable(getCurrentYear() - 10),
		endYear = $bindable(getCurrentYear()),
		includeMonth = $bindable(false),
		includeDay = $bindable(false),
		useLeadingZeros = $bindable(true),
		maxAddresses = 100_000,
		onChange
	}: Props = $props();

	// Settings mode: 'quick' or 'advanced'
	type SettingsMode = 'quick' | 'advanced';
	let settingsMode = $state<SettingsMode>('quick');

	// Path type options for SegmentedControl
	type PathType = 'sequential' | 'date';
	const pathTypeOptions = $derived([
		{
			value: 'sequential' as PathType,
			label: i18n.t('components.address_path_selector.sequential.label')
		},
		{
			value: 'date' as PathType,
			label: i18n.t('components.address_path_selector.date.label')
		}
	]);

	// Quick range presets for sequential mode
	const sequentialPresets = [
		{ label: '1,000', value: 1_000 },
		{ label: '10,000', value: 10_000 },
		{ label: '100,000', value: 100_000 }
	];

	// Quick range presets for date mode (backwards from current year)
	const datePresets = $derived([
		{ label: i18n.t('components.address_path_selector.date.presets.1_year'), years: 1 },
		{ label: i18n.t('components.address_path_selector.date.presets.10_years'), years: 10 },
		{ label: i18n.t('components.address_path_selector.date.presets.100_years'), years: 100 }
	]);

	// Computed values - calculate actual count without limiting
	const addressCount = $derived.by(() => {
		if (pathType === 'sequential') {
			return Math.max(0, endIndex - startIndex + 1);
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
				// Full date: calculate exact days including leap years
				const startDate = new Date(startYear, 0, 1);
				const endDate = new Date(endYear, 11, 31);
				const diffTime = endDate.getTime() - startDate.getTime();
				count = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
			}

			return count;
		}
	});

	const isOverLimit = $derived.by(() => {
		return addressCount > maxAddresses;
	});

	const dateFormat = $derived.by(() => {
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
		const currentYear = getCurrentYear();
		// "Past 1 Year" means current year only: 2025-2025
		// "Past 10 Years" means 10 years back including current: 2016-2025
		// "Past 100 Years" means 100 years back including current: 1926-2025
		startYear = currentYear - years + 1;
		endYear = currentYear;
		notifyChange();
	}

	function toggleSettingsMode() {
		settingsMode = settingsMode === 'quick' ? 'advanced' : 'quick';
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
	<SegmentedControl
		options={pathTypeOptions}
		bind:value={pathType}
		onValueChange={handlePathTypeChange}
	/>

	<!-- Sequential Mode Controls -->
	{#if pathType === 'sequential'}
		<div class="controls-section" transition:slide={{ duration: 300 }}>
			<!-- Header with Settings Toggle -->
			<div class="section-header">
				<span class="section-title">
					{settingsMode === 'quick'
						? i18n.t('components.address_path_selector.quick_select')
						: i18n.t('components.address_path_selector.advanced_settings')}
				</span>
				<button
					class="settings-toggle"
					class:active={settingsMode === 'advanced'}
					onclick={toggleSettingsMode}
					title={settingsMode === 'quick'
						? i18n.t('components.address_path_selector.switch_to_advanced')
						: i18n.t('components.address_path_selector.switch_to_quick')}
				>
					<Settings2 size={16} />
				</button>
			</div>

			<!-- Quick Presets -->
			{#if settingsMode === 'quick'}
				<div class="presets-buttons" transition:slide={{ duration: 200 }}>
					{#each sequentialPresets as preset (preset.value)}
						<button class="preset-btn" onclick={() => handleSequentialPreset(preset.value)}>
							{preset.label}
						</button>
					{/each}
				</div>
			{/if}

			<!-- Advanced Settings -->
			{#if settingsMode === 'advanced'}
				<div class="advanced-section" transition:slide={{ duration: 200 }}>
					<!-- Range Inputs -->
					<div class="range-inputs">
						<div class="input-group">
							<label for="start-index">{i18n.t('components.address_path_selector.start')}</label>
							<input
								id="start-index"
								type="number"
								bind:value={startIndex}
								min="0"
								max={maxAddresses - 1}
								class="range-input"
							/>
						</div>

						<span class="range-separator">{i18n.t('components.address_path_selector.to')}</span>

						<div class="input-group">
							<label for="end-index">{i18n.t('components.address_path_selector.end')}</label>
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
				</div>
			{/if}

			<!-- Address Count Display -->
			<AddressCountHint count={addressCount} maxLimit={maxAddresses} />
		</div>
	{/if}

	<!-- Date Mode Controls -->
	{#if pathType === 'date'}
		<div class="controls-section" transition:slide={{ duration: 300 }}>
			<!-- Header with Settings Toggle -->
			<div class="section-header">
				<span class="section-title">
					{settingsMode === 'quick'
						? i18n.t('components.address_path_selector.quick_select')
						: i18n.t('components.address_path_selector.advanced_settings')}
				</span>
				<button
					class="settings-toggle"
					class:active={settingsMode === 'advanced'}
					onclick={toggleSettingsMode}
					title={settingsMode === 'quick'
						? i18n.t('components.address_path_selector.switch_to_advanced')
						: i18n.t('components.address_path_selector.switch_to_quick')}
				>
					<Settings2 size={16} />
				</button>
			</div>

			<!-- Quick Presets -->
			{#if settingsMode === 'quick'}
				<div class="presets-buttons" transition:slide={{ duration: 200 }}>
					{#each datePresets as preset (preset.years)}
						<button class="preset-btn" onclick={() => handleDatePreset(preset.years)}>
							{preset.label}
						</button>
					{/each}
				</div>
			{/if}

			<!-- Advanced Settings -->
			{#if settingsMode === 'advanced'}
				<div class="advanced-section" transition:slide={{ duration: 200 }}>
					<!-- Year Range Inputs -->
					<div class="range-inputs">
						<div class="input-group">
							<label for="start-year">{i18n.t('components.address_path_selector.from_year')}</label>
							<input
								id="start-year"
								type="number"
								bind:value={startYear}
								min={getCurrentYear() - 100}
								max={endYear}
								class="range-input"
							/>
						</div>

						<span class="range-separator">{i18n.t('components.address_path_selector.to')}</span>

						<div class="input-group">
							<label for="end-year">{i18n.t('components.address_path_selector.to_year')}</label>
							<input
								id="end-year"
								type="number"
								bind:value={endYear}
								min={startYear}
								max={getCurrentYear()}
								class="range-input"
							/>
						</div>
					</div>

					<!-- Format Preview -->
					<div class="format-preview">
						<span class="preview-label">{i18n.t('components.address_path_selector.format')}:</span>
						<code class="preview-format">{dateFormat}</code>
						<span class="preview-example">
							{i18n.t('components.address_path_selector.example')}: {startYear}0101 {i18n.t(
								'components.address_path_selector.to'
							)}
							{endYear}1231
						</span>
					</div>
				</div>
			{/if}

			<!-- Estimated Count -->
			<AddressCountHint count={addressCount} maxLimit={maxAddresses} />
		</div>
	{/if}
</div>

<style>
	.address-path-selector {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* Controls Section */
	.controls-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	/* Section Header */
	.section-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.section-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-400);
	}

	/* Settings Toggle Button */
	.settings-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: var(--white);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--gray-500);
		cursor: pointer;
		transition: all 0.2s;
	}

	.settings-toggle:hover {
		color: var(--color-primary);
		border-color: var(--color-primary);
	}

	.settings-toggle.active {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	:global([data-theme='dark']) .settings-toggle {
		background: var(--gray-700);
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .settings-toggle:hover {
		color: var(--color-primary);
	}

	:global([data-theme='dark']) .settings-toggle.active {
		background: var(--color-primary);
		color: white;
	}

	/* Presets Buttons */
	.presets-buttons {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.preset-btn {
		padding: var(--space-2) var(--space-4);
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

	/* Advanced Section */
	.advanced-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
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
		.range-inputs {
			flex-direction: column;
			align-items: stretch;
		}

		.range-separator {
			align-self: center;
			margin: var(--space-1) 0;
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

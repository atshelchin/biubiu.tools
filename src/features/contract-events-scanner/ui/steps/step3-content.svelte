<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { timeRangeState } from '../../stores/scanner-state.svelte';
	import { Calendar, Layers } from 'lucide-svelte';
	import { SvelteDate } from 'svelte/reactivity';

	// Toggle mode
	let mode = $state<'date' | 'block'>(timeRangeState.useBlockRange ? 'block' : 'date');

	// Date inputs
	let fromDateStr = $state('');
	let toDateStr = $state('');

	// Block inputs
	let fromBlockStr = $state('');
	let toBlockStr = $state('');

	// Initialize from state
	$effect(() => {
		if (timeRangeState.fromDate) {
			fromDateStr = timeRangeState.fromDate.toISOString().split('T')[0];
		}
		if (timeRangeState.toDate) {
			toDateStr = timeRangeState.toDate.toISOString().split('T')[0];
		}
		if (timeRangeState.fromBlock !== null) {
			fromBlockStr = timeRangeState.fromBlock.toString();
		}
		if (timeRangeState.toBlock !== null) {
			toBlockStr = timeRangeState.toBlock.toString();
		}
	});

	// Handle mode toggle
	function setMode(newMode: 'date' | 'block') {
		mode = newMode;
		if (newMode === 'date') {
			timeRangeState.useBlockRange = false;
		} else {
			timeRangeState.useBlockRange = true;
		}
	}

	// Handle date inputs
	function handleFromDateChange(e: Event) {
		const input = e.target as HTMLInputElement;
		fromDateStr = input.value;
		if (input.value) {
			const date = new SvelteDate(input.value);
			timeRangeState.setDateRange(date, timeRangeState.toDate);
		}
	}

	function handleToDateChange(e: Event) {
		const input = e.target as HTMLInputElement;
		toDateStr = input.value;
		if (input.value) {
			const date = new SvelteDate(input.value);
			date.setHours(23, 59, 59, 999); // End of day
			timeRangeState.setDateRange(timeRangeState.fromDate, date);
		}
	}

	// Handle block inputs
	function handleFromBlockChange(e: Event) {
		const input = e.target as HTMLInputElement;
		fromBlockStr = input.value;
		if (input.value) {
			try {
				const block = BigInt(input.value);
				timeRangeState.setBlockRange(block, timeRangeState.toBlock);
			} catch {
				// Invalid input
			}
		}
	}

	function handleToBlockChange(e: Event) {
		const input = e.target as HTMLInputElement;
		toBlockStr = input.value;
		if (input.value) {
			try {
				const block = BigInt(input.value);
				timeRangeState.setBlockRange(timeRangeState.fromBlock, block);
			} catch {
				// Invalid input
			}
		}
	}

	// Quick presets for date range
	function setLastDays(days: number) {
		const to = new SvelteDate();
		const from = new SvelteDate();
		from.setDate(from.getDate() - days);
		timeRangeState.setDateRange(from, to);
		fromDateStr = from.toISOString().split('T')[0];
		toDateStr = to.toISOString().split('T')[0];
	}

	// Validation
	const isValid = $derived(timeRangeState.isValid());
	const dateRangeError = $derived(() => {
		if (mode === 'date' && timeRangeState.fromDate && timeRangeState.toDate) {
			if (timeRangeState.fromDate > timeRangeState.toDate) {
				return 'Start date must be before end date';
			}
		}
		return '';
	});

	const blockRangeError = $derived(() => {
		if (mode === 'block' && timeRangeState.fromBlock !== null && timeRangeState.toBlock !== null) {
			if (timeRangeState.fromBlock > timeRangeState.toBlock) {
				return 'From block must be less than or equal to to block';
			}
		}
		return '';
	});
</script>

<div class="step-content">
	<StepContentHeader title="Set Time Range" description="Define the range of events to scan" />

	<!-- Mode Toggle -->
	<div class="mode-toggle">
		<button class="mode-button" class:active={mode === 'date'} onclick={() => setMode('date')}>
			<Calendar size={20} />
			<span>Date Range</span>
		</button>
		<button class="mode-button" class:active={mode === 'block'} onclick={() => setMode('block')}>
			<Layers size={20} />
			<span>Block Range</span>
		</button>
	</div>

	{#if mode === 'date'}
		<!-- Date Range -->
		<div class="range-section">
			<!-- Quick Presets -->
			<div class="presets">
				<span class="presets-label">Quick Select:</span>
				<button class="preset-button" onclick={() => setLastDays(7)}>Last 7 Days</button>
				<button class="preset-button" onclick={() => setLastDays(30)}>Last 30 Days</button>
				<button class="preset-button" onclick={() => setLastDays(90)}>Last 90 Days</button>
			</div>

			<!-- Date Inputs -->
			<div class="date-inputs">
				<div class="input-group">
					<label for="from-date">Start Date</label>
					<input
						id="from-date"
						type="date"
						class="date-input"
						value={fromDateStr}
						oninput={handleFromDateChange}
					/>
				</div>

				<div class="input-group">
					<label for="to-date">End Date</label>
					<input
						id="to-date"
						type="date"
						class="date-input"
						value={toDateStr}
						oninput={handleToDateChange}
					/>
				</div>
			</div>

			{#if dateRangeError()}
				<p class="error-message">{dateRangeError()}</p>
			{/if}

			<div class="info-note">
				<p>
					<strong>Note:</strong> Date ranges are converted to approximate block numbers based on average
					block times. For precise scans, use block ranges.
				</p>
			</div>
		</div>
	{:else}
		<!-- Block Range -->
		<div class="range-section">
			<div class="block-inputs">
				<div class="input-group">
					<label for="from-block">From Block</label>
					<input
						id="from-block"
						type="number"
						class="block-input"
						placeholder="0"
						min="0"
						step="1"
						value={fromBlockStr}
						oninput={handleFromBlockChange}
					/>
				</div>

				<div class="input-group">
					<label for="to-block">To Block</label>
					<input
						id="to-block"
						type="number"
						class="block-input"
						placeholder="Latest block"
						min="0"
						step="1"
						value={toBlockStr}
						oninput={handleToBlockChange}
					/>
				</div>
			</div>

			{#if blockRangeError()}
				<p class="error-message">{blockRangeError()}</p>
			{/if}

			<div class="info-note">
				<p>
					<strong>Tip:</strong> You can find block numbers on block explorers like Etherscan. Block ranges
					provide the most accurate event scans.
				</p>
			</div>
		</div>
	{/if}

	<!-- Range Summary -->
	{#if isValid}
		<div class="range-summary">
			<h4>Range Summary</h4>
			{#if mode === 'date'}
				<div class="summary-row">
					<span class="summary-label">Start Date:</span>
					<span class="summary-value">{timeRangeState.fromDate?.toLocaleDateString()}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">End Date:</span>
					<span class="summary-value">{timeRangeState.toDate?.toLocaleDateString()}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">Duration:</span>
					<span class="summary-value">
						{Math.ceil(
							((timeRangeState.toDate?.getTime() || 0) -
								(timeRangeState.fromDate?.getTime() || 0)) /
								(1000 * 60 * 60 * 24)
						)} days
					</span>
				</div>
			{:else}
				<div class="summary-row">
					<span class="summary-label">From Block:</span>
					<span class="summary-value">{timeRangeState.fromBlock?.toString()}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">To Block:</span>
					<span class="summary-value">{timeRangeState.toBlock?.toString()}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">Total Blocks:</span>
					<span class="summary-value">
						{((timeRangeState.toBlock || 0n) - (timeRangeState.fromBlock || 0n) + 1n).toString()}
					</span>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Mode Toggle */
	.mode-toggle {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-6);
		padding: var(--space-2);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.mode-button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: 2px solid transparent;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .mode-button {
		color: var(--gray-400);
	}

	.mode-button:hover {
		background: var(--color-panel-0);
	}

	.mode-button.active {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	/* Range Section */
	.range-section {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	/* Presets */
	.presets {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		flex-wrap: wrap;
	}

	.presets-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .presets-label {
		color: var(--gray-300);
	}

	.preset-button {
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .preset-button {
		color: var(--gray-300);
	}

	.preset-button:hover {
		background: var(--color-primary);
		color: white;
		border-color: var(--color-primary);
	}

	/* Input Groups */
	.date-inputs,
	.block-inputs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.input-group label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .input-group label {
		color: var(--gray-300);
	}

	.date-input,
	.block-input {
		padding: var(--space-3);
		font-size: var(--text-base);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-0);
		color: var(--gray-900);
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .date-input,
	:global([data-theme='dark']) .block-input {
		color: var(--gray-100);
	}

	.date-input:focus,
	.block-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.block-input {
		font-family: monospace;
	}

	/* Messages */
	.error-message {
		margin: var(--space-3) 0 0 0;
		padding: var(--space-2);
		background: hsla(0, 80%, 98%, 1);
		border: 1px solid hsla(0, 80%, 80%, 1);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: hsla(0, 80%, 40%, 1);
	}

	:global([data-theme='dark']) .error-message {
		background: hsla(0, 80%, 15%, 0.3);
		border-color: hsla(0, 80%, 30%, 1);
		color: hsla(0, 80%, 60%, 1);
	}

	.info-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(210, 100%, 98%, 1);
		border: 1px solid hsla(210, 100%, 85%, 1);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .info-note {
		background: hsla(210, 100%, 15%, 0.3);
		border-color: hsla(210, 100%, 25%, 1);
	}

	.info-note p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .info-note p {
		color: var(--gray-300);
	}

	/* Range Summary */
	.range-summary {
		margin-top: var(--space-6);
		padding: var(--space-4);
		background: linear-gradient(135deg, hsla(210, 100%, 98%, 1), hsla(210, 100%, 95%, 1));
		border: 2px solid hsla(210, 100%, 85%, 1);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .range-summary {
		background: linear-gradient(135deg, hsla(210, 100%, 15%, 0.3), hsla(210, 100%, 10%, 0.3));
		border-color: hsla(210, 100%, 25%, 1);
	}

	.range-summary h4 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .range-summary h4 {
		color: var(--gray-100);
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.summary-row:last-child {
		border-bottom: none;
	}

	.summary-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .summary-label {
		color: var(--gray-400);
	}

	.summary-value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		font-family: monospace;
	}

	:global([data-theme='dark']) .summary-value {
		color: var(--gray-100);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.date-inputs,
		.block-inputs {
			grid-template-columns: 1fr;
		}

		.presets {
			flex-direction: column;
			align-items: flex-start;
		}

		.preset-button {
			width: 100%;
		}
	}
</style>

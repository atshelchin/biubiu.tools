<script lang="ts">
	import { createGeneratorState } from '@/features/wallet-generator/stores/generator-state.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';

	const generatorState = createGeneratorState();
	const stepManager = useStepManager();

	let count = $state(generatorState.count);
	let startIndex = $state(generatorState.startIndex);
	let useWorker = $state(generatorState.useWorker);

	// Update state when values change
	$effect(() => {
		generatorState.setCount(count);
	});

	$effect(() => {
		generatorState.setStartIndex(startIndex);
	});

	$effect(() => {
		generatorState.setUseWorker(useWorker);
	});

	function handleGenerate() {
		if (generatorState.isStep3Valid) {
			stepManager.next();
		}
	}

	// Preset buttons
	const presetCounts = [10, 25, 50, 100, 500];
</script>

<div class="step-content">
	<StepContentHeader
		title="Generation Configuration"
		description="Configure how many wallets to generate and optimization options"
	/>

	<!-- Generation Count -->
	<div class="section">
		<h3 class="section-title">Number of Wallets</h3>

		<div class="count-presets">
			{#each presetCounts as preset (preset)}
				<button class="preset-btn" class:active={count === preset} onclick={() => (count = preset)}>
					{preset}
				</button>
			{/each}
		</div>

		<div class="input-group">
			<label for="count-input">
				<span class="label-text">Custom Count</span>
				<span class="label-hint">Enter a value between 1 and 1000</span>
			</label>
			<input
				id="count-input"
				type="number"
				bind:value={count}
				min="1"
				max="1000"
				class="number-input"
			/>
		</div>
	</div>

	<!-- Start Index -->
	<div class="section">
		<h3 class="section-title">Starting Index</h3>
		<div class="input-group">
			<label for="start-index">
				<span class="label-text">Index</span>
				<span class="label-hint">The first address index to generate (usually 0)</span>
			</label>
			<input id="start-index" type="number" bind:value={startIndex} min="0" class="number-input" />
		</div>

		<div class="path-preview">
			<span class="preview-label">Addresses will be generated from:</span>
			<code class="preview-path">{generatorState.hdPath}/{startIndex}</code>
			<span class="preview-to">to</span>
			<code class="preview-path">{generatorState.hdPath}/{startIndex + count - 1}</code>
		</div>
	</div>

	<!-- Performance Options -->
	<div class="section">
		<h3 class="section-title">Performance Options</h3>
		<div class="option-card">
			<label class="option-toggle">
				<input type="checkbox" bind:checked={useWorker} />
				<div class="option-info">
					<span class="option-name">Use Web Worker</span>
					<span class="option-description"
						>Enable multi-threaded generation for better performance</span
					>
				</div>
			</label>
		</div>
	</div>

	<!-- Summary Card -->
	<div class="summary-card">
		<h4 class="summary-title">Generation Summary</h4>
		<div class="summary-grid">
			<div class="summary-item">
				<span class="summary-label">Input Type:</span>
				<span class="summary-value">{generatorState.inputSource.type}</span>
			</div>
			<div class="summary-item">
				<span class="summary-label">Blockchain:</span>
				<span class="summary-value">{generatorState.blockchain}</span>
			</div>
			<div class="summary-item">
				<span class="summary-label">HD Path:</span>
				<span class="summary-value">{generatorState.hdPath}</span>
			</div>
			<div class="summary-item">
				<span class="summary-label">Count:</span>
				<span class="summary-value">{count} wallets</span>
			</div>
			<div class="summary-item">
				<span class="summary-label">Index Range:</span>
				<span class="summary-value">{startIndex} - {startIndex + count - 1}</span>
			</div>
			<div class="summary-item">
				<span class="summary-label">Acceleration:</span>
				<span class="summary-value">{useWorker ? 'Web Worker' : 'Standard'}</span>
			</div>
		</div>
	</div>

	<!-- Generate Button -->
	<div class="action-section">
		<button
			class="generate-button"
			onclick={handleGenerate}
			disabled={!generatorState.isStep3Valid}
		>
			<span class="button-icon">⚡</span>
			<span>Generate {count} Wallet{count > 1 ? 's' : ''}</span>
		</button>
		{#if !generatorState.isStep3Valid}
			<p class="action-hint error">Please enter a valid count (1-1000)</p>
		{:else}
			<p class="action-hint">Ready to generate wallets</p>
		{/if}
	</div>
</div>

<style>
	.step-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.section {
		margin: var(--space-6) 0;
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-4);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	/* Count Presets */
	.count-presets {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
		margin-bottom: var(--space-4);
	}

	.preset-btn {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.preset-btn:hover {
		border-color: var(--color-primary);
	}

	.preset-btn.active {
		border-color: var(--color-primary);
		background: hsla(210, 100%, 50%, 0.1);
		color: var(--color-primary);
	}

	/* Input Group */
	.input-group {
		margin-top: var(--space-4);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		margin-bottom: var(--space-2);
	}

	.label-text {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	.label-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .label-text {
		color: var(--gray-100);
	}

	:global([data-theme='dark']) .label-hint {
		color: var(--gray-400);
	}

	.number-input {
		width: 100%;
		max-width: 200px;
		padding: var(--space-3);
		font-size: var(--text-base);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--gray-900);
	}

	.number-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	:global([data-theme='dark']) .number-input {
		color: var(--gray-100);
	}

	/* Path Preview */
	.path-preview {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.preview-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	.preview-path {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: var(--text-sm);
		color: var(--color-primary);
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-1);
		border-radius: var(--radius-sm);
	}

	.preview-to {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .preview-label,
	:global([data-theme='dark']) .preview-to {
		color: var(--gray-400);
	}

	/* Options */
	.option-card {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.option-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		cursor: pointer;
	}

	.option-toggle input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
	}

	.option-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.option-name {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	.option-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .option-name {
		color: var(--gray-100);
	}

	:global([data-theme='dark']) .option-description {
		color: var(--gray-400);
	}

	/* Summary Card */
	.summary-card {
		margin: var(--space-6) 0;
		padding: var(--space-5);
		background: linear-gradient(135deg, hsla(210, 100%, 97%, 1), hsla(210, 100%, 95%, 1));
		border: 2px solid hsla(210, 100%, 85%, 1);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .summary-card {
		background: linear-gradient(135deg, hsla(210, 100%, 10%, 0.5), hsla(210, 100%, 8%, 0.5));
		border-color: hsla(210, 100%, 20%, 1);
	}

	.summary-title {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin: 0 0 var(--space-4);
	}

	:global([data-theme='dark']) .summary-title {
		color: var(--gray-100);
	}

	.summary-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.summary-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.summary-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	.summary-value {
		font-size: var(--text-base);
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .summary-label {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .summary-value {
		color: var(--gray-100);
	}

	/* Action Section */
	.action-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		margin-top: var(--space-8);
	}

	.generate-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		width: 100%;
		max-width: 400px;
		min-height: 56px;
		padding: var(--space-4) var(--space-6);
		background: linear-gradient(135deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	.generate-button:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px hsla(210, 100%, 50%, 0.4);
	}

	.generate-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.generate-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.button-icon {
		font-size: var(--text-2xl);
	}

	.action-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: center;
		margin: 0;
	}

	.action-hint.error {
		color: hsl(0, 70%, 50%);
	}

	:global([data-theme='dark']) .action-hint {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .action-hint.error {
		color: hsl(0, 70%, 60%);
	}
</style>

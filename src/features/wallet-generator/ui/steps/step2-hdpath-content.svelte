<script lang="ts">
	import { createGeneratorState } from '@/features/wallet-generator/stores/generator-state.svelte';
	import { HD_PATH_PRESETS } from '@/features/wallet-generator/types/wallet';
	import { validateHDPath } from '@/features/wallet-generator/utils/validators';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';

	const generatorState = createGeneratorState();

	let selectedBlockchain = $state(generatorState.blockchain);
	let selectedPreset = $state(generatorState.hdPath);
	let customPath = $state('');
	let useCustomPath = $state(false);
	let customPathValid = $state(true);

	// Get presets for selected blockchain
	const currentPresets = $derived(HD_PATH_PRESETS[selectedBlockchain]);

	// Update state when blockchain changes
	$effect(() => {
		generatorState.setBlockchain(selectedBlockchain);
		// Set default path for selected blockchain
		if (!useCustomPath && currentPresets.length > 0) {
			const defaultPath = currentPresets[0].path;
			selectedPreset = defaultPath;
			generatorState.setHDPath(defaultPath);
		}
	});

	// Update state when path changes
	$effect(() => {
		if (useCustomPath) {
			customPathValid = validateHDPath(customPath);
			if (customPathValid) {
				generatorState.setHDPath(customPath);
			}
		} else {
			generatorState.setHDPath(selectedPreset);
		}
	});

	function handlePresetChange(path: string) {
		selectedPreset = path;
		useCustomPath = false;
		generatorState.setHDPath(path);
	}

	function handleCustomPathToggle() {
		useCustomPath = !useCustomPath;
		if (useCustomPath && customPath) {
			customPathValid = validateHDPath(customPath);
		}
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Blockchain and HD Path"
		description="Select blockchain and configure hierarchical deterministic path"
	/>

	<!-- Blockchain Selection -->
	<div class="section">
		<h3 class="section-title">Select Blockchain</h3>
		<div class="blockchain-selector">
			<button
				class="blockchain-button"
				class:active={selectedBlockchain === 'ethereum'}
				onclick={() => (selectedBlockchain = 'ethereum')}
			>
				<span class="blockchain-icon">Ξ</span>
				<div class="blockchain-info">
					<h4>Ethereum</h4>
					<p>EVM-compatible chains</p>
				</div>
			</button>

			<button
				class="blockchain-button"
				class:active={selectedBlockchain === 'bitcoin'}
				onclick={() => (selectedBlockchain = 'bitcoin')}
			>
				<span class="blockchain-icon">₿</span>
				<div class="blockchain-info">
					<h4>Bitcoin</h4>
					<p>Bitcoin and forks</p>
				</div>
			</button>
		</div>
	</div>

	<!-- HD Path Selection -->
	<div class="section">
		<h3 class="section-title">HD Derivation Path</h3>

		<!-- Preset Paths -->
		{#if !useCustomPath}
			<div class="path-presets">
				{#each currentPresets as preset (preset.path)}
					<button
						class="preset-button"
						class:active={selectedPreset === preset.path}
						onclick={() => handlePresetChange(preset.path)}
					>
						<div class="preset-header">
							<span class="preset-name">{preset.name}</span>
							{#if selectedPreset === preset.path}
								<span class="preset-check">✓</span>
							{/if}
						</div>
						<div class="preset-path">{preset.path}</div>
						<div class="preset-description">{preset.description}</div>
					</button>
				{/each}
			</div>
		{/if}

		<!-- Custom Path -->
		<div class="custom-path-section">
			<label class="custom-toggle">
				<input type="checkbox" bind:checked={useCustomPath} onchange={handleCustomPathToggle} />
				<span>Use Custom HD Path</span>
			</label>

			{#if useCustomPath}
				<div class="custom-input-group">
					<input
						type="text"
						bind:value={customPath}
						placeholder="m/44'/60'/0'/0"
						class="custom-input"
						class:error={!customPathValid && customPath}
					/>
					{#if !customPathValid && customPath}
						<div class="error-message">
							<span class="error-icon">⚠️</span>
							<span>Invalid HD path format. Use format like: m/44'/60'/0'/0</span>
						</div>
					{:else if customPathValid && customPath}
						<div class="success-message">
							<span class="success-icon">✓</span>
							<span>Valid HD path</span>
						</div>
					{/if}
				</div>
			{/if}
		</div>

		<!-- Current Path Display -->
		<div class="current-path">
			<span class="current-path-label">Current Path:</span>
			<code class="current-path-value">{useCustomPath ? customPath : selectedPreset}</code>
		</div>
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

	/* Blockchain Selector */
	.blockchain-selector {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
	}

	.blockchain-button {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.blockchain-button:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.15);
	}

	.blockchain-button.active {
		border-color: var(--color-primary);
		background: hsla(210, 100%, 50%, 0.1);
	}

	.blockchain-icon {
		font-size: 2rem;
		font-weight: bold;
		color: var(--color-primary);
	}

	.blockchain-info h4 {
		margin: 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		text-align: left;
	}

	.blockchain-info p {
		margin: var(--space-1) 0 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: left;
	}

	:global([data-theme='dark']) .blockchain-info h4 {
		color: var(--gray-100);
	}

	:global([data-theme='dark']) .blockchain-info p {
		color: var(--gray-400);
	}

	/* Path Presets */
	.path-presets {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.preset-button {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.preset-button:hover {
		border-color: var(--color-primary);
		box-shadow: 0 2px 8px hsla(210, 100%, 50%, 0.1);
	}

	.preset-button.active {
		border-color: var(--color-primary);
		background: hsla(210, 100%, 50%, 0.05);
	}

	.preset-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.preset-name {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	.preset-check {
		color: var(--color-primary);
		font-size: var(--text-lg);
	}

	.preset-path {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: var(--text-sm);
		color: var(--color-primary);
	}

	.preset-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .preset-name {
		color: var(--gray-100);
	}

	:global([data-theme='dark']) .preset-description {
		color: var(--gray-400);
	}

	/* Custom Path */
	.custom-path-section {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.custom-toggle {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		cursor: pointer;
		font-weight: var(--font-medium);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .custom-toggle {
		color: var(--gray-100);
	}

	.custom-toggle input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	.custom-input-group {
		margin-top: var(--space-3);
	}

	.custom-input {
		width: 100%;
		padding: var(--space-3);
		font-size: var(--text-base);
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		background: var(--color-panel-2);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--gray-900);
	}

	.custom-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.custom-input.error {
		border-color: hsl(0, 70%, 50%);
	}

	:global([data-theme='dark']) .custom-input {
		color: var(--gray-100);
	}

	/* Validation Messages */
	.error-message,
	.success-message {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
	}

	.error-message {
		background: hsla(0, 70%, 95%, 1);
		color: hsl(0, 70%, 40%);
		border: 1px solid hsla(0, 70%, 80%, 1);
	}

	.success-message {
		background: hsla(120, 60%, 95%, 1);
		color: hsl(120, 60%, 30%);
		border: 1px solid hsla(120, 60%, 80%, 1);
	}

	:global([data-theme='dark']) .error-message {
		background: hsla(0, 70%, 15%, 0.3);
		color: hsl(0, 70%, 70%);
		border-color: hsla(0, 70%, 30%, 1);
	}

	:global([data-theme='dark']) .success-message {
		background: hsla(120, 60%, 15%, 0.3);
		color: hsl(120, 60%, 70%);
		border-color: hsla(120, 60%, 30%, 1);
	}

	.error-icon,
	.success-icon {
		font-size: var(--text-lg);
	}

	/* Current Path Display */
	.current-path {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.current-path-label {
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	.current-path-value {
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		font-size: var(--text-base);
		color: var(--color-primary);
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-1);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .current-path-label {
		color: var(--gray-300);
	}

	@media (max-width: 640px) {
		.blockchain-selector {
			grid-template-columns: 1fr;
		}
	}
</style>

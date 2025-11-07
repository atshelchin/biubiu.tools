<script lang="ts">
	import { createGeneratorState } from '@/features/wallet-generator/stores/generator-state.svelte';
	import { validateInput, getValidationError } from '@/features/wallet-generator/utils/validators';
	import type { InputSourceType } from '@/features/wallet-generator/types/wallet';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';

	const generatorState = createGeneratorState();

	let selectedType = $state('mnemonic' as InputSourceType);
	let inputValue = $state('');
	let validationError = $state('');

	// Update validation when input changes
	$effect(() => {
		const isValid = validateInput(selectedType, inputValue);
		const error = isValid ? '' : getValidationError(selectedType, inputValue);
		validationError = error;

		generatorState.setInputSource({
			type: selectedType,
			value: inputValue,
			isValid
		});
	});

	function handleTypeChange(type: InputSourceType) {
		selectedType = type;
		inputValue = '';
		validationError = '';
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Configure Input Source"
		description="Choose your input method and provide the necessary information"
	/>

	<!-- Input Type Selection -->
	<div class="input-type-selector">
		<button
			class="type-button"
			class:active={selectedType === 'mnemonic'}
			onclick={() => handleTypeChange('mnemonic')}
		>
			<span class="type-icon">🔑</span>
			<div class="type-info">
				<h4>Mnemonic Phrase</h4>
				<p>12 or 24 word seed phrase (BIP39)</p>
			</div>
		</button>

		<button
			class="type-button"
			class:active={selectedType === 'xpub'}
			onclick={() => handleTypeChange('xpub')}
		>
			<span class="type-icon">📊</span>
			<div class="type-info">
				<h4>Extended Public Key</h4>
				<p>xpub/ypub/zpub for address generation</p>
			</div>
		</button>

		<button
			class="type-button"
			class:active={selectedType === 'secret'}
			onclick={() => handleTypeChange('secret')}
		>
			<span class="type-icon">🔐</span>
			<div class="type-info">
				<h4>Secret Text</h4>
				<p>Generate seed from secret text (SHA256)</p>
			</div>
		</button>
	</div>

	<!-- Input Field -->
	<div class="input-section">
		{#if selectedType === 'mnemonic'}
			<label for="mnemonic-input">
				<span class="label-text">Mnemonic Phrase</span>
				<span class="label-hint">Enter 12 or 24 words separated by spaces</span>
			</label>
			<textarea
				id="mnemonic-input"
				bind:value={inputValue}
				placeholder="word1 word2 word3 ..."
				rows="4"
				class="input-field"
				class:error={validationError && inputValue}
			></textarea>
		{:else if selectedType === 'xpub'}
			<label for="xpub-input">
				<span class="label-text">Extended Public Key (xpub)</span>
				<span class="label-hint">Enter xpub, ypub, or zpub key</span>
			</label>
			<input
				id="xpub-input"
				type="text"
				bind:value={inputValue}
				placeholder="xpub..."
				class="input-field"
				class:error={validationError && inputValue}
			/>
		{:else if selectedType === 'secret'}
			<label for="secret-input">
				<span class="label-text">Secret Text</span>
				<span class="label-hint">Enter at least 8 characters (will be hashed)</span>
			</label>
			<textarea
				id="secret-input"
				bind:value={inputValue}
				placeholder="Enter your secret text..."
				rows="4"
				class="input-field"
				class:error={validationError && inputValue}
			></textarea>
		{/if}

		{#if validationError && inputValue}
			<div class="error-message">
				<span class="error-icon">⚠️</span>
				<span>{validationError}</span>
			</div>
		{:else if generatorState.inputSource.isValid}
			<div class="success-message">
				<span class="success-icon">✓</span>
				<span>Input validated successfully</span>
			</div>
		{/if}
	</div>
</div>

<style>
	.step-content {
		max-width: 800px;
		margin: 0 auto;
	}

	/* Input Type Selector */
	.input-type-selector {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
		margin: var(--space-6) 0;
	}

	.type-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
	}

	.type-button:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.15);
	}

	.type-button.active {
		border-color: var(--color-primary);
		background: hsla(210, 100%, 50%, 0.1);
	}

	.type-icon {
		font-size: 2rem;
	}

	.type-info h4 {
		margin: 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	.type-info p {
		margin: var(--space-1) 0 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .type-info h4 {
		color: var(--gray-100);
	}

	:global([data-theme='dark']) .type-info p {
		color: var(--gray-400);
	}

	/* Input Section */
	.input-section {
		margin-top: var(--space-6);
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

	.input-field {
		width: 100%;
		padding: var(--space-3);
		font-size: var(--text-base);
		font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--gray-900);
		transition: border-color 0.2s ease;
	}

	.input-field:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.input-field.error {
		border-color: hsl(0, 70%, 50%);
	}

	:global([data-theme='dark']) .input-field {
		color: var(--gray-100);
	}

	textarea.input-field {
		resize: vertical;
		min-height: 100px;
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

	@media (max-width: 640px) {
		.input-type-selector {
			grid-template-columns: 1fr;
		}
	}
</style>

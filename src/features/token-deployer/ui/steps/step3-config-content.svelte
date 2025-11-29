<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step3State } from '@/features/token-deployer/stores/step3-state.svelte';

	// Common decimals options
	const decimalsOptions = [6, 8, 9, 18];

	function handleSupplyInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		// Only allow numbers and decimal point
		if (value && !/^\d*\.?\d*$/.test(value)) {
			target.value = step3State.initialSupply;
			return;
		}
		step3State.initialSupply = value;
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Configure Basic Token Information"
		description="Enter the fundamental properties of your ERC20 token"
	/>

	<div class="form-container">
		<!-- Token Name -->
		<div class="form-group">
			<label for="token-name" class="form-label">
				Token Name <span class="required">*</span>
			</label>
			<input
				id="token-name"
				type="text"
				class="form-input"
				placeholder="e.g., My Awesome Token"
				bind:value={step3State.name}
				maxlength="50"
			/>
			<p class="form-hint">The full name of your token (e.g., "Bitcoin", "Ethereum")</p>
		</div>

		<!-- Token Symbol -->
		<div class="form-group">
			<label for="token-symbol" class="form-label">
				Token Symbol <span class="required">*</span>
			</label>
			<input
				id="token-symbol"
				type="text"
				class="form-input"
				placeholder="e.g., MAT"
				bind:value={step3State.symbol}
				maxlength="10"
				style="text-transform: uppercase;"
			/>
			<p class="form-hint">The trading symbol for your token (e.g., "BTC", "ETH")</p>
		</div>

		<!-- Decimals -->
		<div class="form-group">
			<label for="token-decimals" class="form-label">
				Decimals <span class="required">*</span>
			</label>
			<div class="decimals-selector">
				{#each decimalsOptions as decimalValue (decimalValue)}
					<button
						type="button"
						class="decimal-option"
						class:selected={step3State.decimals === decimalValue}
						onclick={() => (step3State.decimals = decimalValue)}
					>
						{decimalValue}
					</button>
				{/each}
				<input
					id="token-decimals"
					type="number"
					class="form-input decimals-input"
					bind:value={step3State.decimals}
					min="0"
					max="18"
				/>
			</div>
			<p class="form-hint">
				Number of decimal places (18 is standard, like ETH). Lower values save gas.
			</p>
		</div>

		<!-- Initial Supply -->
		<div class="form-group">
			<label for="initial-supply" class="form-label">
				Initial Supply <span class="required">*</span>
			</label>
			<div class="supply-input-wrapper">
				<input
					id="initial-supply"
					type="text"
					class="form-input"
					placeholder="e.g., 1000000"
					value={step3State.initialSupply}
					oninput={handleSupplyInput}
				/>
				<span class="supply-suffix">{step3State.symbol || 'TOKENS'}</span>
			</div>
			<p class="form-hint">Total tokens created at deployment. This will be sent to your wallet.</p>
		</div>

		<!-- Mintable Option -->
		<div class="form-group">
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={step3State.mintable} />
				<span class="checkbox-text">
					<strong>Mintable</strong>
					<span class="checkbox-description">
						Allow minting new tokens after deployment. Only the contract owner can mint.
					</span>
				</span>
			</label>
		</div>

		<!-- Example Preview -->
		{#if step3State.name && step3State.symbol && step3State.initialSupply}
			<div class="preview-box">
				<h4>Preview</h4>
				<div class="preview-content">
					<p>
						<strong>{step3State.name} ({step3State.symbol})</strong>
					</p>
					<p>
						Initial Supply: {parseFloat(step3State.initialSupply).toLocaleString()}
						{step3State.symbol}
					</p>
					<p>Decimals: {step3State.decimals}</p>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.form-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		max-width: 600px;
	}

	/* Form Groups */
	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .form-label {
		color: var(--gray-100);
	}

	.required {
		color: hsl(0, 70%, 50%);
	}

	.form-input {
		padding: var(--space-3) var(--space-4);
		font-size: var(--text-base);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
		color: var(--gray-900);
		transition: border-color 0.2s ease;
	}

	:global([data-theme='dark']) .form-input {
		color: var(--gray-100);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.form-hint {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.4;
	}

	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}

	/* Decimals Selector */
	.decimals-selector {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.decimal-option {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .decimal-option {
		color: var(--gray-300);
	}

	.decimal-option:hover {
		border-color: var(--color-primary);
	}

	.decimal-option.selected {
		background: hsl(210, 100%, 50%);
		border-color: hsl(210, 100%, 50%);
		color: white;
	}

	.decimals-input {
		max-width: 120px;
	}

	/* Supply Input */
	.supply-input-wrapper {
		position: relative;
		display: flex;
		align-items: center;
	}

	.supply-suffix {
		position: absolute;
		right: var(--space-4);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-600);
		pointer-events: none;
	}

	:global([data-theme='dark']) .supply-suffix {
		color: var(--gray-400);
	}

	/* Preview Box */
	.preview-box {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: hsla(210, 100%, 95%, 1);
		border: 1px solid hsla(210, 100%, 80%, 1);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .preview-box {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsla(210, 100%, 30%, 1);
	}

	.preview-box h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .preview-box h4 {
		color: var(--gray-100);
	}

	.preview-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.preview-content p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .preview-content p {
		color: var(--gray-300);
	}

	/* Checkbox Label */
	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.checkbox-label:hover {
		border-color: var(--color-primary);
		background: var(--color-panel-2);
	}

	.checkbox-label input[type='checkbox'] {
		margin-top: 2px;
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: var(--color-primary);
	}

	.checkbox-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
	}

	.checkbox-text strong {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .checkbox-text strong {
		color: var(--gray-100);
	}

	.checkbox-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.4;
	}

	:global([data-theme='dark']) .checkbox-description {
		color: var(--gray-400);
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.decimals-selector {
			flex-direction: column;
		}

		.decimals-input {
			max-width: 100%;
		}
	}
</style>

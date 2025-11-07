<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step3State } from '@/features/token-deployer/stores/step3-state.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';

	const connectStore = useConnectStore();
</script>

<div class="step-content">
	<StepContentHeader
		title="Configure Advanced Parameters"
		description="Add optional features to your token (all are optional)"
	/>

	<div class="form-container">
		<!-- Supply Management -->
		<div class="section">
			<h3 class="section-title">Supply Management</h3>

			<div class="toggle-group">
				<label class="toggle-item">
					<input type="checkbox" bind:checked={step3State.mintable} />
					<div class="toggle-info">
						<strong>Mintable</strong>
						<span>Allow minting new tokens after deployment</span>
					</div>
				</label>

				<label class="toggle-item">
					<input type="checkbox" bind:checked={step3State.burnable} />
					<div class="toggle-info">
						<strong>Burnable</strong>
						<span>Token holders can destroy their tokens</span>
					</div>
				</label>
			</div>

			<div class="form-group">
				<label for="max-supply" class="form-label"> Max Supply (Optional) </label>
				<input
					id="max-supply"
					type="text"
					class="form-input"
					placeholder="Leave empty for unlimited"
					bind:value={step3State.maxSupply}
				/>
				<p class="form-hint">Maximum total supply (only relevant if mintable is enabled)</p>
			</div>
		</div>

		<!-- Access Control -->
		<div class="section">
			<h3 class="section-title">Access Control</h3>

			<div class="toggle-group">
				<label class="toggle-item">
					<input type="checkbox" bind:checked={step3State.pausable} />
					<div class="toggle-info">
						<strong>Pausable</strong>
						<span>Owner can pause all token transfers</span>
					</div>
				</label>

				<label class="toggle-item">
					<input type="checkbox" bind:checked={step3State.blacklistable} />
					<div class="toggle-info">
						<strong>Blacklistable</strong>
						<span>Owner can block specific addresses from transfers</span>
					</div>
				</label>
			</div>
		</div>

		<!-- Tax/Fee System -->
		<div class="section">
			<h3 class="section-title">Tax & Fee System</h3>

			<label class="toggle-item primary">
				<input type="checkbox" bind:checked={step3State.taxEnabled} />
				<div class="toggle-info">
					<strong>Enable Tax System</strong>
					<span>Collect fees on buy/sell transactions</span>
				</div>
			</label>

			{#if step3State.taxEnabled}
				<div class="tax-config">
					<div class="form-group">
						<label for="buy-tax" class="form-label">
							Buy Tax (%) <span class="required">*</span>
						</label>
						<input
							id="buy-tax"
							type="number"
							class="form-input"
							placeholder="0-100"
							bind:value={step3State.buyTax}
							min="0"
							max="100"
							step="0.1"
						/>
					</div>

					<div class="form-group">
						<label for="sell-tax" class="form-label">
							Sell Tax (%) <span class="required">*</span>
						</label>
						<input
							id="sell-tax"
							type="number"
							class="form-input"
							placeholder="0-100"
							bind:value={step3State.sellTax}
							min="0"
							max="100"
							step="0.1"
						/>
					</div>

					<div class="form-group">
						<label for="tax-receiver" class="form-label">
							Tax Receiver Address <span class="required">*</span>
						</label>
						<input
							id="tax-receiver"
							type="text"
							class="form-input mono"
							placeholder="0x..."
							bind:value={step3State.taxReceiver}
						/>
						<button
							class="use-my-address-btn"
							onclick={() => (step3State.taxReceiver = connectStore.address)}
						>
							Use My Address
						</button>
					</div>
				</div>
			{/if}
		</div>

		<!-- Anti-Bot Protection -->
		<div class="section">
			<h3 class="section-title">Anti-Bot Protection</h3>

			<div class="form-group">
				<label for="max-tx" class="form-label"> Max Transaction Amount (Optional) </label>
				<input
					id="max-tx"
					type="text"
					class="form-input"
					placeholder="Max tokens per transaction"
					bind:value={step3State.maxTransactionAmount}
				/>
			</div>

			<div class="form-group">
				<label for="max-wallet" class="form-label"> Max Wallet Amount (Optional) </label>
				<input
					id="max-wallet"
					type="text"
					class="form-input"
					placeholder="Max tokens per wallet"
					bind:value={step3State.maxWalletAmount}
				/>
			</div>

			<div class="form-group">
				<label for="trading-delay" class="form-label"> Trading Delay (seconds) </label>
				<input
					id="trading-delay"
					type="number"
					class="form-input"
					placeholder="0"
					bind:value={step3State.tradingDelay}
					min="0"
					max="3600"
				/>
				<p class="form-hint">Minimum seconds between trades for same address</p>
			</div>
		</div>
	</div>
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.form-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		max-width: 700px;
	}

	/* Section */
	.section {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.section-title {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		padding-bottom: var(--space-2);
		border-bottom: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	/* Toggle Group */
	.toggle-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.toggle-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-item:hover {
		border-color: var(--color-primary);
	}

	.toggle-item.primary {
		background: hsla(210, 100%, 98%, 1);
		border-color: hsl(210, 100%, 80%);
	}

	:global([data-theme='dark']) .toggle-item.primary {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsl(210, 100%, 30%);
	}

	.toggle-item input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
		flex-shrink: 0;
		margin-top: 2px;
	}

	.toggle-info {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
	}

	.toggle-info strong {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .toggle-info strong {
		color: var(--gray-100);
	}

	.toggle-info span {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .toggle-info span {
		color: var(--gray-400);
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

	.form-input.mono {
		font-family: monospace;
		font-size: var(--text-sm);
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

	/* Tax Config */
	.tax-config {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-3);
		background: hsla(210, 100%, 96%, 1);
		border-radius: var(--radius-md);
		margin-top: var(--space-2);
	}

	:global([data-theme='dark']) .tax-config {
		background: hsla(210, 100%, 8%, 0.5);
	}

	.use-my-address-btn {
		align-self: flex-start;
		padding: var(--space-2) var(--space-3);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: opacity 0.2s ease;
	}

	.use-my-address-btn:hover {
		opacity: 0.9;
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}
	}
</style>

<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useStepManager } from '$lib/components/ui/step-context.svelte';
	import { monitorState } from '../../stores/monitor-state.svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { isAddress } from 'viem';
	import { SvelteSet } from 'svelte/reactivity';
	import type { AssetType } from '../../types/assets';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();

	// Form state
	let walletAddress = $state('');
	let startBlock = $state('');
	let endBlock = $state('');
	let selectedAssetTypes = new SvelteSet<AssetType>(['native', 'erc20']);
	let includeIncoming = $state(true);
	let includeOutgoing = $state(true);

	// Validation
	const isValidAddress = $derived(walletAddress.length === 0 || isAddress(walletAddress));
	const isValidStartBlock = $derived(
		startBlock === '' || (!isNaN(Number(startBlock)) && Number(startBlock) >= 0)
	);
	const isValidEndBlock = $derived(
		endBlock === '' || (!isNaN(Number(endBlock)) && Number(endBlock) >= 0)
	);
	const hasAssetTypeSelected = $derived(selectedAssetTypes.size > 0);
	const hasDirection = $derived(includeIncoming || includeOutgoing);

	const isFormValid = $derived(
		walletAddress.length > 0 &&
			isValidAddress &&
			isValidStartBlock &&
			isValidEndBlock &&
			hasAssetTypeSelected &&
			hasDirection
	);

	// Asset type definitions
	const assetTypes: { type: AssetType; label: string; description: string }[] = [
		{ type: 'native', label: 'Native (ETH)', description: 'Native blockchain currency transfers' },
		{ type: 'erc20', label: 'ERC-20 Tokens', description: 'Fungible token transfers' },
		{ type: 'erc721', label: 'ERC-721 NFTs', description: 'Non-fungible token transfers' },
		{ type: 'erc1155', label: 'ERC-1155', description: 'Multi-token standard (Coming Soon)' }
	];

	function toggleAssetType(type: AssetType) {
		if (type === 'erc1155') return; // Not implemented yet

		if (selectedAssetTypes.has(type)) {
			selectedAssetTypes.delete(type);
		} else {
			selectedAssetTypes.add(type);
		}
	}

	// Update step validity whenever form changes
	$effect(() => {
		stepManager?.setStepValid(isFormValid);

		// Save to state when valid
		if (isFormValid && connectStore.currentChainId) {
			monitorState.setScanConfig({
				walletAddress: walletAddress as `0x${string}`,
				chainId: connectStore.currentChainId,
				startBlock: startBlock ? Number(startBlock) : undefined,
				endBlock: endBlock ? Number(endBlock) : undefined,
				assetTypes: Array.from(selectedAssetTypes),
				includeIncoming,
				includeOutgoing
			});
		}
	});

	// Quick fill buttons
	function useConnectedWallet() {
		if (connectStore.address) {
			walletAddress = connectStore.address;
		}
	}

	function setRecentBlocks(count: number) {
		// We'll calculate from latest block in Step 3
		startBlock = '';
		endBlock = '';
		// Store the "recent" preference
		interface MonitorStateWithRecentBlock {
			recentBlockCount?: number;
		}
		(monitorState as MonitorStateWithRecentBlock).recentBlockCount = count;
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Configure Scan Parameters"
		description="Set the wallet address, block range, and asset types to scan"
	/>

	<!-- Wallet Address -->
	<div class="form-section">
		<label for="wallet-address" class="form-label">
			Wallet Address
			<span class="required">*</span>
		</label>
		<div class="input-group">
			<input
				id="wallet-address"
				type="text"
				class="address-input"
				class:valid={walletAddress.length > 0 && isValidAddress}
				class:invalid={walletAddress.length > 0 && !isValidAddress}
				placeholder="0x..."
				bind:value={walletAddress}
			/>
			{#if connectStore.address}
				<button class="quick-btn" onclick={useConnectedWallet}>Use Connected Wallet</button>
			{/if}
		</div>
		{#if walletAddress.length > 0 && !isValidAddress}
			<p class="error-message">Invalid Ethereum address format</p>
		{/if}
	</div>

	<!-- Block Range -->
	<div class="form-section">
		<label class="form-label">Block Range (Optional)</label>
		<p class="form-hint">Leave empty to scan recent 1000 blocks</p>
		<div class="block-range-grid">
			<div class="input-wrapper">
				<label for="start-block" class="input-label">Start Block</label>
				<input
					id="start-block"
					type="text"
					class="block-input"
					class:invalid={!isValidStartBlock}
					placeholder="e.g., 18000000"
					bind:value={startBlock}
				/>
			</div>
			<div class="input-wrapper">
				<label for="end-block" class="input-label">End Block</label>
				<input
					id="end-block"
					type="text"
					class="block-input"
					class:invalid={!isValidEndBlock}
					placeholder="Latest"
					bind:value={endBlock}
				/>
			</div>
		</div>
		<div class="quick-buttons">
			<button class="quick-btn small" onclick={() => setRecentBlocks(1000)}>Last 1K Blocks</button>
			<button class="quick-btn small" onclick={() => setRecentBlocks(5000)}>Last 5K Blocks</button>
			<button class="quick-btn small" onclick={() => setRecentBlocks(10000)}>Last 10K Blocks</button
			>
		</div>
	</div>

	<!-- Asset Types -->
	<div class="form-section">
		<label class="form-label">
			Asset Types to Scan
			<span class="required">*</span>
		</label>
		<div class="asset-types-grid">
			{#each assetTypes as { type, label, description } (type)}
				{@const selected = selectedAssetTypes.has(type)}
				{@const disabled = type === 'erc1155'}
				<button
					class="asset-type-card"
					class:selected
					class:disabled
					onclick={() => toggleAssetType(type)}
					{disabled}
				>
					<div class="checkbox" class:checked={selected}>
						{#if selected}
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
								<path d="M5 12l5 5L20 7" stroke-width="3" stroke-linecap="round" />
							</svg>
						{/if}
					</div>
					<div class="asset-type-info">
						<div class="asset-type-label">{label}</div>
						<div class="asset-type-description">{description}</div>
					</div>
				</button>
			{/each}
		</div>
		{#if !hasAssetTypeSelected}
			<p class="error-message">Select at least one asset type</p>
		{/if}
	</div>

	<!-- Transfer Direction -->
	<div class="form-section">
		<label class="form-label">
			Transfer Direction
			<span class="required">*</span>
		</label>
		<div class="direction-options">
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={includeIncoming} />
				<span>Incoming Transfers</span>
			</label>
			<label class="checkbox-label">
				<input type="checkbox" bind:checked={includeOutgoing} />
				<span>Outgoing Transfers</span>
			</label>
		</div>
		{#if !hasDirection}
			<p class="error-message">Select at least one direction</p>
		{/if}
	</div>

	<!-- Summary -->
	{#if isFormValid}
		<div class="config-summary">
			<h3 class="summary-title">Scan Configuration</h3>
			<div class="summary-grid">
				<div class="summary-item">
					<span class="summary-label">Wallet:</span>
					<span class="summary-value">{walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}</span
					>
				</div>
				<div class="summary-item">
					<span class="summary-label">Asset Types:</span>
					<span class="summary-value">{selectedAssetTypes.size} selected</span>
				</div>
				<div class="summary-item">
					<span class="summary-label">Direction:</span>
					<span class="summary-value">
						{includeIncoming && includeOutgoing
							? 'Both'
							: includeIncoming
								? 'Incoming'
								: 'Outgoing'}
					</span>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
		max-width: 800px;
	}

	/* Form Section */
	.form-section {
		margin-top: var(--space-8);
	}

	.form-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-2);
	}

	.required {
		color: var(--color-error);
	}

	.form-hint {
		font-size: var(--text-xs);
		color: var(--color-description-3);
		margin-top: var(--space-1);
		margin-bottom: var(--space-3);
	}

	/* Input Group */
	.input-group {
		display: flex;
		gap: var(--space-2);
		align-items: center;
	}

	.address-input,
	.block-input {
		flex: 1;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-family: 'Monaco', 'Menlo', monospace;
		transition: all 0.2s ease;
	}

	.address-input:focus,
	.block-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.address-input.valid {
		border-color: var(--color-success);
	}

	.address-input.invalid,
	.block-input.invalid {
		border-color: var(--color-error);
	}

	/* Block Range */
	.block-range-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
	}

	.input-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.input-label {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
	}

	/* Quick Buttons */
	.quick-buttons {
		display: flex;
		gap: var(--space-2);
		margin-top: var(--space-3);
		flex-wrap: wrap;
	}

	.quick-btn {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-primary);
		cursor: pointer;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.quick-btn:hover {
		background: var(--color-panel-3);
		border-color: var(--color-primary);
	}

	.quick-btn.small {
		padding: var(--space-1-5) var(--space-3);
		font-size: var(--text-xs);
	}

	/* Asset Types Grid */
	.asset-types-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.asset-type-card {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: left;
	}

	.asset-type-card:hover:not(.disabled) {
		border-color: var(--color-primary);
		transform: translateY(-1px);
	}

	.asset-type-card.selected {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 5%, var(--color-panel-1));
	}

	.asset-type-card.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.asset-type-info {
		flex: 1;
	}

	.asset-type-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
		margin-bottom: var(--space-1);
	}

	.asset-type-description {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	/* Checkbox */
	.checkbox {
		width: 20px;
		height: 20px;
		border: 2px solid var(--color-border);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
		transition: all 0.2s ease;
	}

	.checkbox.checked {
		background: var(--color-primary);
		border-color: var(--color-primary);
		color: white;
	}

	/* Direction Options */
	.direction-options {
		display: flex;
		gap: var(--space-6);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-heading-3);
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		width: 18px;
		height: 18px;
		cursor: pointer;
	}

	/* Error Message */
	.error-message {
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-error);
	}

	/* Config Summary */
	.config-summary {
		margin-top: var(--space-8);
		padding: var(--space-6);
		background: color-mix(in srgb, var(--color-success) 5%, var(--color-panel-1));
		border: 2px solid color-mix(in srgb, var(--color-success) 20%, transparent);
		border-radius: var(--radius-lg);
	}

	.summary-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-1);
		margin-bottom: var(--space-4);
	}

	.summary-grid {
		display: grid;
		gap: var(--space-3);
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
	}

	.summary-label {
		color: var(--color-description-2);
		font-weight: var(--font-medium);
	}

	.summary-value {
		color: var(--color-heading-2);
		font-weight: var(--font-semibold);
		font-family: 'Monaco', 'Menlo', monospace;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-4);
		}

		.block-range-grid {
			grid-template-columns: 1fr;
		}

		.asset-types-grid {
			grid-template-columns: 1fr;
		}

		.direction-options {
			flex-direction: column;
			gap: var(--space-3);
		}
	}
</style>

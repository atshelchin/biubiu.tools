<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { scannerState } from '../../stores/scanner-state.svelte';
	import { isAddress, type Address } from 'viem';
	import { Trash2, Upload } from 'lucide-svelte';

	let textareaValue = $state('');
	let fileInput: HTMLInputElement;

	// Parse addresses from text (line by line)
	function parseAddresses(text: string): Address[] {
		return text
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && isAddress(line)) as Address[];
	}

	// Handle paste
	function handlePaste() {
		const addresses = parseAddresses(textareaValue);
		addresses.forEach((addr) => scannerState.addWallet(addr));
		textareaValue = '';
	}

	// Handle file upload
	async function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const text = await file.text();
		const addresses = parseAddresses(text);
		addresses.forEach((addr) => scannerState.addWallet(addr));

		// Reset input
		input.value = '';
	}

	// Trigger file input
	function triggerFileInput() {
		fileInput?.click();
	}

	// Remove wallet
	function removeWallet(address: Address) {
		scannerState.removeWallet(address);
	}

	// Clear all wallets
	function clearAll() {
		scannerState.clearWallets();
	}

	const hasWallets = $derived(scannerState.wallets.length > 0);
	const canPaste = $derived(textareaValue.trim().length > 0);
</script>

<div class="step-content">
	<StepContentHeader
		title="Import Wallet Addresses"
		description="Add wallets to scan for balances"
	/>

	<!-- Input Methods -->
	<div class="input-section">
		<div class="input-method">
			<label for="addresses-textarea">Paste Addresses</label>
			<textarea
				id="addresses-textarea"
				bind:value={textareaValue}
				placeholder="Paste wallet addresses here (one per line)&#10;0x1234...&#10;0x5678...&#10;0xabcd..."
				rows="8"
			></textarea>
			<button class="action-btn primary" onclick={handlePaste} disabled={!canPaste}>
				Add Addresses ({parseAddresses(textareaValue).length})
			</button>
		</div>

		<div class="divider">
			<span>OR</span>
		</div>

		<div class="input-method">
			<label>Upload File</label>
			<input
				type="file"
				accept=".txt,.csv"
				bind:this={fileInput}
				onchange={handleFileUpload}
				style="display: none;"
			/>
			<button class="action-btn secondary" onclick={triggerFileInput}>
				<Upload size={20} />
				<span>Upload CSV/TXT File</span>
			</button>
			<p class="help-text">Upload a file with one address per line</p>
		</div>
	</div>

	<!-- Wallet List -->
	{#if hasWallets}
		<div class="wallet-list-section">
			<div class="list-header">
				<h3>Wallets to Scan ({scannerState.wallets.length})</h3>
				<button class="clear-btn" onclick={clearAll}>Clear All</button>
			</div>

			<div class="wallet-list">
				{#each scannerState.wallets as wallet (wallet)}
					<div class="wallet-item">
						<span class="wallet-address">{wallet}</span>
						<button class="remove-btn" onclick={() => removeWallet(wallet)} title="Remove wallet">
							<Trash2 size={16} />
						</button>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="empty-state">
			<p>👆 Add wallet addresses using one of the methods above</p>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	/* Input Section */
	.input-section {
		margin-top: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.input-method {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.input-method label {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .input-method label {
		color: var(--gray-100);
	}

	textarea {
		width: 100%;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		resize: vertical;
		min-height: 120px;
	}

	:global([data-theme='dark']) textarea {
		color: var(--gray-100);
	}

	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.action-btn {
		padding: var(--space-3) var(--space-6);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
	}

	.action-btn.primary {
		background: var(--color-primary);
		color: white;
	}

	.action-btn.primary:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}

	.action-btn.primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.action-btn.secondary {
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .action-btn.secondary {
		color: var(--gray-100);
	}

	.action-btn.secondary:hover {
		border-color: var(--color-primary);
		background: var(--color-panel-2);
	}

	.help-text {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .help-text {
		color: var(--gray-400);
	}

	/* Divider */
	.divider {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		color: var(--gray-500);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		height: 1px;
		background: var(--color-border);
	}

	/* Wallet List */
	.wallet-list-section {
		margin-top: var(--space-8);
	}

	.list-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.list-header h3 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .list-header h3 {
		color: var(--gray-100);
	}

	.clear-btn {
		padding: var(--space-2) var(--space-4);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .clear-btn {
		color: var(--gray-300);
	}

	.clear-btn:hover {
		background: var(--color-panel-2);
		border-color: hsl(0, 70%, 50%);
		color: hsl(0, 70%, 50%);
	}

	.wallet-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		max-height: 400px;
		overflow-y: auto;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.wallet-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		gap: var(--space-3);
	}

	.wallet-address {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-700);
		word-break: break-all;
		flex: 1;
	}

	:global([data-theme='dark']) .wallet-address {
		color: var(--gray-300);
	}

	.remove-btn {
		padding: var(--space-1);
		background: transparent;
		border: none;
		color: var(--gray-500);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
	}

	.remove-btn:hover {
		background: hsla(0, 70%, 95%, 1);
		color: hsl(0, 70%, 50%);
	}

	:global([data-theme='dark']) .remove-btn:hover {
		background: hsla(0, 70%, 20%, 0.3);
		color: hsl(0, 70%, 60%);
	}

	/* Empty State */
	.empty-state {
		margin-top: var(--space-8);
		padding: var(--space-6);
		text-align: center;
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px dashed var(--color-border);
	}

	.empty-state p {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .empty-state p {
		color: var(--gray-400);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}
	}
</style>

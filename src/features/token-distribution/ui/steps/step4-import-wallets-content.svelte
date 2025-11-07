<script lang="ts">
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step4State } from '@/features/token-distribution/stores/step4-state.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';
	import type { Recipient } from '@/features/token-distribution/types/recipient';
	import { isAddress } from 'viem';
	import type { Address } from 'viem';
	import { Trash2 } from 'lucide-svelte';

	let manualAddress = $state('');
	let manualLabel = $state('');
	let manualAmount = $state('');
	let pasteText = $state('');
	let showPasteArea = $state(false);

	const isCustomMode = $derived(step3State.amountMode === 'custom');

	function addManualRecipient() {
		if (!manualAddress || !isAddress(manualAddress)) {
			alert('Please enter a valid Ethereum address');
			return;
		}

		const recipient: Recipient = {
			id: crypto.randomUUID(),
			address: manualAddress as Address,
			label: manualLabel || undefined,
			amount: isCustomMode && manualAmount ? manualAmount : undefined
		};

		step4State.addRecipient(recipient);
		manualAddress = '';
		manualLabel = '';
		manualAmount = '';
	}

	function parseAndAddPastedAddresses() {
		const lines = pasteText.split('\n').filter((line) => line.trim());
		const newRecipients: Recipient[] = [];

		for (const line of lines) {
			const parts = line.split(',').map((p) => p.trim());
			const address = parts[0];

			if (isAddress(address)) {
				newRecipients.push({
					id: crypto.randomUUID(),
					address: address as Address,
					label: parts[1] || undefined,
					amount: isCustomMode && parts[2] ? parts[2] : undefined
				});
			}
		}

		if (newRecipients.length > 0) {
			step4State.addRecipients(newRecipients);
			pasteText = '';
			showPasteArea = false;
		} else {
			alert('No valid addresses found');
		}
	}

	function removeRecipient(id: string) {
		step4State.removeRecipient(id);
	}

	function updateRecipientAmount(id: string, amount: string) {
		step4State.updateRecipient(id, { amount });
	}
</script>

<div class="step-content">
	<StepContentHeader
		title="Add Recipient Addresses"
		description="Import wallet addresses that will receive tokens"
	/>

	<!-- Manual Add -->
	<div class="section">
		<h3 class="section-title">Add Manually</h3>
		<div class="manual-form">
			<div class="form-row">
				<div class="form-field flex-2">
					<label for="manual-address">Wallet Address *</label>
					<input
						id="manual-address"
						type="text"
						placeholder="0x..."
						bind:value={manualAddress}
						class="form-input"
					/>
				</div>
				<div class="form-field flex-1">
					<label for="manual-label">Label (optional)</label>
					<input
						id="manual-label"
						type="text"
						placeholder="Recipient name"
						bind:value={manualLabel}
						class="form-input"
					/>
				</div>
				{#if isCustomMode}
					<div class="form-field flex-1">
						<label for="manual-amount">Amount</label>
						<input
							id="manual-amount"
							type="number"
							placeholder="0.0"
							bind:value={manualAmount}
							class="form-input"
							step="0.000001"
							min="0"
						/>
					</div>
				{/if}
			</div>
			<button class="add-button" onclick={addManualRecipient}>Add Recipient</button>
		</div>
	</div>

	<!-- Paste Multiple -->
	<div class="section">
		<h3 class="section-title">Paste Multiple Addresses</h3>
		<button class="toggle-button" onclick={() => (showPasteArea = !showPasteArea)}>
			{showPasteArea ? 'Hide' : 'Show'} Paste Area
		</button>
		{#if showPasteArea}
			<div class="paste-area">
				<p class="paste-hint">
					Paste addresses, one per line. Format: address{isCustomMode
						? ', label (optional), amount'
						: ', label (optional)'}
				</p>
				<textarea
					bind:value={pasteText}
					placeholder="0x123..., Alice{isCustomMode ? ', 1.5' : ''}&#10;0x456..., Bob{isCustomMode
						? ', 2.0'
						: ''}"
					rows="8"
					class="paste-textarea"
				></textarea>
				<button class="add-button" onclick={parseAndAddPastedAddresses}> Add All Addresses </button>
			</div>
		{/if}
	</div>

	<!-- Recipients List -->
	{#if step4State.recipients.length > 0}
		<div class="section">
			<div class="section-header">
				<h3 class="section-title">Recipients ({step4State.recipients.length})</h3>
				{#if step4State.recipients.length > 0}
					<button class="clear-button" onclick={() => step4State.reset()}>Clear All</button>
				{/if}
			</div>
			<div class="recipients-list">
				{#each step4State.recipients as recipient (recipient.id)}
					<div class="recipient-card">
						<div class="recipient-info">
							<div class="recipient-address">{recipient.address}</div>
							{#if recipient.label}
								<div class="recipient-label">{recipient.label}</div>
							{/if}
						</div>
						{#if isCustomMode}
							<input
								type="number"
								placeholder="Amount"
								value={recipient.amount || ''}
								oninput={(e) =>
									updateRecipientAmount(recipient.id, (e.target as HTMLInputElement).value)}
								class="amount-input-small"
								step="0.000001"
								min="0"
							/>
						{/if}
						<button class="delete-button" onclick={() => removeRecipient(recipient.id)}>
							<Trash2 size={16} />
						</button>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.section {
		margin-bottom: var(--space-8);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.section-title {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	/* Manual Form */
	.manual-form {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.form-row {
		display: flex;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
		flex-wrap: wrap;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		min-width: 200px;
	}

	.form-field.flex-1 {
		flex: 1;
	}

	.form-field.flex-2 {
		flex: 2;
	}

	.form-field label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .form-field label {
		color: var(--gray-300);
	}

	.form-input {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-panel-1);
		color: var(--gray-900);
		font-size: var(--text-base);
	}

	:global([data-theme='dark']) .form-input {
		color: var(--gray-100);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.add-button {
		padding: var(--space-2) var(--space-4);
		background: hsl(210, 100%, 50%);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.add-button:hover {
		background: hsl(210, 100%, 45%);
		transform: translateY(-1px);
	}

	.toggle-button {
		padding: var(--space-2) var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.toggle-button:hover {
		border-color: var(--color-primary);
	}

	/* Paste Area */
	.paste-area {
		margin-top: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.paste-hint {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .paste-hint {
		color: var(--gray-400);
	}

	.paste-textarea {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-panel-1);
		color: var(--gray-900);
		font-family: monospace;
		font-size: var(--text-sm);
		resize: vertical;
		margin-bottom: var(--space-3);
	}

	:global([data-theme='dark']) .paste-textarea {
		color: var(--gray-100);
	}

	.paste-textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	/* Recipients List */
	.recipients-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.recipient-card {
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.recipient-info {
		flex: 1;
		min-width: 0;
	}

	.recipient-address {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		word-break: break-all;
	}

	:global([data-theme='dark']) .recipient-address {
		color: var(--gray-100);
	}

	.recipient-label {
		font-size: var(--text-xs);
		color: var(--gray-600);
		margin-top: var(--space-1);
	}

	:global([data-theme='dark']) .recipient-label {
		color: var(--gray-400);
	}

	.amount-input-small {
		width: 120px;
		padding: var(--space-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-panel-1);
		color: var(--gray-900);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .amount-input-small {
		color: var(--gray-100);
	}

	.delete-button {
		padding: var(--space-2);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--gray-600);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.delete-button:hover {
		background: hsla(0, 80%, 95%, 1);
		border-color: hsla(0, 80%, 60%, 1);
		color: hsla(0, 80%, 50%, 1);
	}

	:global([data-theme='dark']) .delete-button:hover {
		background: hsla(0, 80%, 20%, 0.3);
		border-color: hsla(0, 80%, 40%, 1);
	}

	.clear-button {
		padding: var(--space-2) var(--space-3);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.clear-button:hover {
		background: hsla(0, 80%, 95%, 1);
		border-color: hsla(0, 80%, 60%, 1);
		color: hsla(0, 80%, 50%, 1);
	}

	:global([data-theme='dark']) .clear-button:hover {
		background: hsla(0, 80%, 20%, 0.3);
		color: hsla(0, 80%, 50%, 1);
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.form-row {
			flex-direction: column;
		}

		.form-field {
			min-width: 100%;
		}
	}
</style>

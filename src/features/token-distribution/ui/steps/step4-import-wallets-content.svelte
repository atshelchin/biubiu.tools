<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import { step4State } from '@/features/token-distribution/stores/step4-state.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';
	import type { Recipient } from '@/features/token-distribution/types/recipient';
	import { isAddress } from 'viem';
	import type { Address } from 'viem';
	import { Trash2, Upload, Plus, AlertCircle, FileText, RefreshCw } from '@lucide/svelte';

	const i18n = useI18n();

	// Import method state
	let importMethod = $state<'manual' | 'paste' | 'csv'>('manual');

	// Manual input state
	let manualAddress = $state('');
	let manualLabel = $state('');
	let manualAmount = $state('');
	let manualTokenId = $state('');
	let manualTokenAmount = $state('1');

	// Paste area state
	let pasteText = $state('');
	let parseErrors = $state<string[]>([]);

	// Derived states
	const tokenType = $derived(step3State.tokenType);
	const amountMode = $derived(step3State.amountMode);
	const isFungible = $derived(step3State.isFungible);
	const isNFT = $derived(step3State.isNFT);
	const selectedToken = $derived(step3State.selectedToken);
	const randomMinAmount = $derived(step3State.randomMinAmount);
	const randomMaxAmount = $derived(step3State.randomMaxAmount);

	// Determine what columns are needed based on token type and mode
	const needsAmount = $derived(isFungible && (amountMode === 'custom' || amountMode === 'random'));
	const needsTokenId = $derived(isNFT);
	const needsTokenAmount = $derived(tokenType === 'erc1155');
	const isRandomMode = $derived(amountMode === 'random');

	/**
	 * Generate a random amount between min and max with consistent decimal places
	 */
	function generateRandomAmount(): string {
		const min = parseFloat(randomMinAmount);
		const max = parseFloat(randomMaxAmount);
		if (isNaN(min) || isNaN(max) || min >= max) return '';

		// Generate random value
		const random = Math.random() * (max - min) + min;

		// Determine decimal places based on input precision
		const minDecimals = (randomMinAmount.split('.')[1] || '').length;
		const maxDecimals = (randomMaxAmount.split('.')[1] || '').length;
		const decimals = Math.max(minDecimals, maxDecimals, 6);

		return random.toFixed(decimals);
	}

	// Get paste format hint
	const pasteFormatHint = $derived(() => {
		if (isFungible) {
			if (amountMode === 'custom') {
				return i18n.t('tools.one_to_many_transfer.step4.content.paste_hint.fungible_custom');
			}
			return i18n.t('tools.one_to_many_transfer.step4.content.paste_hint.fungible_equal');
		}
		if (tokenType === 'erc721') {
			return i18n.t('tools.one_to_many_transfer.step4.content.paste_hint.erc721');
		}
		return i18n.t('tools.one_to_many_transfer.step4.content.paste_hint.erc1155');
	});

	// Get paste placeholder example
	const pastePlaceholder = $derived(() => {
		if (isFungible) {
			if (amountMode === 'custom') {
				return '0x123..., Alice, 1.5\n0x456..., Bob, 2.0';
			}
			return '0x123..., Alice\n0x456..., Bob';
		}
		if (tokenType === 'erc721') {
			return '0x123..., 1, Alice\n0x456..., 2, Bob';
		}
		return '0x123..., 1, 10, Alice\n0x456..., 2, 5, Bob';
	});

	function clearManualInputs() {
		manualAddress = '';
		manualLabel = '';
		manualAmount = '';
		manualTokenId = '';
		manualTokenAmount = '1';
	}

	function addManualRecipient() {
		if (!manualAddress || !isAddress(manualAddress)) {
			alert(i18n.t('tools.one_to_many_transfer.step4.content.error.invalid_address'));
			return;
		}

		// Validate token ID for NFTs
		if (isNFT && !manualTokenId) {
			alert(i18n.t('tools.one_to_many_transfer.step4.content.error.token_id_required'));
			return;
		}

		// Determine amount based on mode
		let amount: string | undefined;
		if (isFungible) {
			if (isRandomMode) {
				amount = generateRandomAmount();
			} else if (amountMode === 'custom' && manualAmount) {
				amount = manualAmount;
			}
		}

		const recipient: Recipient = {
			id: crypto.randomUUID(),
			address: manualAddress as Address,
			label: manualLabel || undefined,
			amount,
			tokenId: isNFT && manualTokenId ? BigInt(manualTokenId) : undefined,
			tokenAmount: needsTokenAmount && manualTokenAmount ? manualTokenAmount : undefined
		};

		step4State.addRecipient(recipient);
		clearManualInputs();
	}

	function parseAndAddPastedData() {
		const lines = pasteText.split('\n').filter((line) => line.trim());
		const newRecipients: Recipient[] = [];
		const errors: string[] = [];

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const parts = line.split(',').map((p) => p.trim());
			const address = parts[0];

			if (!isAddress(address)) {
				errors.push(
					i18n.t('tools.one_to_many_transfer.step4.content.error.invalid_address_line', {
						line: i + 1
					})
				);
				continue;
			}

			if (isFungible) {
				// Fungible: address, label, amount (optional based on mode)
				// For random mode, generate random amount; for custom mode, use provided amount
				let amount: string | undefined;
				if (isRandomMode) {
					amount = generateRandomAmount();
				} else if (amountMode === 'custom' && parts[2]) {
					amount = parts[2];
				}

				newRecipients.push({
					id: crypto.randomUUID(),
					address: address as Address,
					label: parts[1] || undefined,
					amount
				});
			} else if (tokenType === 'erc721') {
				// ERC721: address, tokenId, label
				const tokenId = parts[1];
				if (!tokenId || isNaN(Number(tokenId))) {
					errors.push(
						i18n.t('tools.one_to_many_transfer.step4.content.error.invalid_token_id_line', {
							line: i + 1
						})
					);
					continue;
				}
				newRecipients.push({
					id: crypto.randomUUID(),
					address: address as Address,
					tokenId: BigInt(tokenId),
					label: parts[2] || undefined
				});
			} else {
				// ERC1155: address, tokenId, amount, label
				const tokenId = parts[1];
				const tokenAmount = parts[2] || '1';
				if (!tokenId || isNaN(Number(tokenId))) {
					errors.push(
						i18n.t('tools.one_to_many_transfer.step4.content.error.invalid_token_id_line', {
							line: i + 1
						})
					);
					continue;
				}
				newRecipients.push({
					id: crypto.randomUUID(),
					address: address as Address,
					tokenId: BigInt(tokenId),
					tokenAmount,
					label: parts[3] || undefined
				});
			}
		}

		parseErrors = errors;

		if (newRecipients.length > 0) {
			step4State.addRecipients(newRecipients);
			pasteText = '';
		}
	}

	function removeRecipient(id: string) {
		step4State.removeRecipient(id);
	}

	function updateRecipientAmount(id: string, amount: string) {
		step4State.updateRecipient(id, { amount });
	}

	function updateRecipientTokenId(id: string, tokenIdStr: string) {
		try {
			const tokenId = tokenIdStr ? BigInt(tokenIdStr) : undefined;
			step4State.updateRecipient(id, { tokenId });
		} catch {
			// Invalid bigint, ignore
		}
	}

	function updateRecipientTokenAmount(id: string, tokenAmount: string) {
		step4State.updateRecipient(id, { tokenAmount });
	}

	function clearAllRecipients() {
		step4State.reset();
		parseErrors = [];
	}

	/**
	 * Regenerate random amounts for all recipients
	 */
	function regenerateAllRandomAmounts() {
		if (!isRandomMode || !isFungible) return;

		const updatedRecipients = step4State.recipients.map((r) => ({
			...r,
			amount: generateRandomAmount()
		}));

		// Clear and re-add to trigger reactivity
		step4State.reset();
		step4State.addRecipients(updatedRecipients);
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.one_to_many_transfer.step4.content.title')}
		description={i18n.t('tools.one_to_many_transfer.step4.content.description')}
	/>

	<!-- Token Type Indicator -->
	{#if selectedToken}
		<div class="token-indicator">
			<span class="token-label"
				>{i18n.t('tools.one_to_many_transfer.step4.content.distributing')}:</span
			>
			<span class="token-value">{selectedToken.symbol}</span>
			<span class="token-type-badge">{tokenType.toUpperCase()}</span>
			{#if isFungible && amountMode !== 'custom'}
				<span class="amount-mode-badge">
					{amountMode === 'equal'
						? i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.equal')
						: i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.random')}
				</span>
			{/if}
		</div>
	{/if}

	<!-- Import Method Selector -->
	<div class="section">
		<div class="import-method-selector">
			<button
				class="method-button"
				class:active={importMethod === 'manual'}
				onclick={() => (importMethod = 'manual')}
			>
				<Plus size={18} />
				{i18n.t('tools.one_to_many_transfer.step4.content.method.manual')}
			</button>
			<button
				class="method-button"
				class:active={importMethod === 'paste'}
				onclick={() => (importMethod = 'paste')}
			>
				<FileText size={18} />
				{i18n.t('tools.one_to_many_transfer.step4.content.method.paste')}
			</button>
			<button
				class="method-button"
				class:active={importMethod === 'csv'}
				onclick={() => (importMethod = 'csv')}
			>
				<Upload size={18} />
				{i18n.t('tools.one_to_many_transfer.step4.content.method.csv')}
			</button>
		</div>
	</div>

	<!-- Manual Add Section -->
	{#if importMethod === 'manual'}
		<div class="section">
			<h3 class="section-title">
				{i18n.t('tools.one_to_many_transfer.step4.content.manual.title')}
			</h3>
			<div class="manual-form">
				<div class="form-row">
					<div class="form-field" class:flex-2={!isNFT}>
						<label for="manual-address">
							{i18n.t('tools.one_to_many_transfer.step4.content.manual.address')} *
						</label>
						<input
							id="manual-address"
							type="text"
							placeholder="0x..."
							bind:value={manualAddress}
							class="form-input"
						/>
					</div>

					{#if needsTokenId}
						<div class="form-field">
							<label for="manual-token-id">
								{i18n.t('tools.one_to_many_transfer.step4.content.manual.token_id')} *
							</label>
							<input
								id="manual-token-id"
								type="number"
								placeholder="1"
								bind:value={manualTokenId}
								class="form-input"
								min="0"
							/>
						</div>
					{/if}

					{#if needsTokenAmount}
						<div class="form-field">
							<label for="manual-token-amount">
								{i18n.t('tools.one_to_many_transfer.step4.content.manual.token_amount')}
							</label>
							<input
								id="manual-token-amount"
								type="number"
								placeholder="1"
								bind:value={manualTokenAmount}
								class="form-input"
								min="1"
							/>
						</div>
					{/if}

					{#if needsAmount}
						<div class="form-field">
							<label for="manual-amount">
								{i18n.t('tools.one_to_many_transfer.step4.content.manual.amount')}
							</label>
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

					<div class="form-field">
						<label for="manual-label">
							{i18n.t('tools.one_to_many_transfer.step4.content.manual.label')}
						</label>
						<input
							id="manual-label"
							type="text"
							placeholder={i18n.t(
								'tools.one_to_many_transfer.step4.content.manual.label_placeholder'
							)}
							bind:value={manualLabel}
							class="form-input"
						/>
					</div>
				</div>
				<button class="add-button" onclick={addManualRecipient}>
					<Plus size={16} />
					{i18n.t('tools.one_to_many_transfer.step4.content.manual.add_button')}
				</button>
			</div>
		</div>
	{/if}

	<!-- Paste Section -->
	{#if importMethod === 'paste'}
		<div class="section">
			<h3 class="section-title">
				{i18n.t('tools.one_to_many_transfer.step4.content.paste.title')}
			</h3>
			<div class="paste-area">
				<p class="paste-hint">{pasteFormatHint()}</p>
				<textarea
					bind:value={pasteText}
					placeholder={pastePlaceholder()}
					rows="10"
					class="paste-textarea"
				></textarea>

				{#if parseErrors.length > 0}
					<div class="error-list">
						<AlertCircle size={16} />
						<ul>
							{#each parseErrors as error, index (index)}
								<li>{error}</li>
							{/each}
						</ul>
					</div>
				{/if}

				<button class="add-button" onclick={parseAndAddPastedData} disabled={!pasteText.trim()}>
					<Plus size={16} />
					{i18n.t('tools.one_to_many_transfer.step4.content.paste.add_button')}
				</button>
			</div>
		</div>
	{/if}

	<!-- CSV Section -->
	{#if importMethod === 'csv'}
		<div class="section">
			<h3 class="section-title">
				{i18n.t('tools.one_to_many_transfer.step4.content.csv.title')}
			</h3>
			<div class="csv-upload-area">
				<Upload size={48} />
				<p>{i18n.t('tools.one_to_many_transfer.step4.content.csv.description')}</p>
				<button class="upload-button">
					{i18n.t('tools.one_to_many_transfer.step4.content.csv.upload_button')}
				</button>
				<p class="csv-hint">{i18n.t('tools.one_to_many_transfer.step4.content.csv.hint')}</p>
			</div>
		</div>
	{/if}

	<!-- Recipients List -->
	{#if step4State.recipients.length > 0}
		<div class="section">
			<div class="section-header">
				<h3 class="section-title">
					{i18n.t('tools.one_to_many_transfer.step4.content.recipients.title')} ({step4State
						.recipients.length})
				</h3>
				<div class="header-actions">
					{#if isRandomMode && isFungible}
						<button class="regenerate-button" onclick={regenerateAllRandomAmounts}>
							<RefreshCw size={14} />
							{i18n.t('tools.one_to_many_transfer.step4.content.recipients.regenerate_random')}
						</button>
					{/if}
					<button class="clear-button" onclick={clearAllRecipients}>
						<Trash2 size={14} />
						{i18n.t('tools.one_to_many_transfer.step4.content.recipients.clear_all')}
					</button>
				</div>
			</div>

			<div class="recipients-table">
				<div class="table-header">
					<div class="col-address">
						{i18n.t('tools.one_to_many_transfer.step4.content.recipients.col_address')}
					</div>
					{#if needsTokenId}
						<div class="col-token-id">
							{i18n.t('tools.one_to_many_transfer.step4.content.recipients.col_token_id')}
						</div>
					{/if}
					{#if needsTokenAmount}
						<div class="col-token-amount">
							{i18n.t('tools.one_to_many_transfer.step4.content.recipients.col_token_amount')}
						</div>
					{/if}
					{#if needsAmount}
						<div class="col-amount">
							{i18n.t('tools.one_to_many_transfer.step4.content.recipients.col_amount')}
						</div>
					{/if}
					<div class="col-label">
						{i18n.t('tools.one_to_many_transfer.step4.content.recipients.col_label')}
					</div>
					<div class="col-actions"></div>
				</div>

				<div class="table-body">
					{#each step4State.recipients as recipient (recipient.id)}
						<div class="table-row">
							<div class="col-address">
								<span class="address-text">{recipient.address}</span>
							</div>

							{#if needsTokenId}
								<div class="col-token-id">
									<input
										type="number"
										value={recipient.tokenId?.toString() || ''}
										oninput={(e) =>
											updateRecipientTokenId(recipient.id, (e.target as HTMLInputElement).value)}
										class="inline-input"
										placeholder="ID"
									/>
								</div>
							{/if}

							{#if needsTokenAmount}
								<div class="col-token-amount">
									<input
										type="number"
										value={recipient.tokenAmount || '1'}
										oninput={(e) =>
											updateRecipientTokenAmount(
												recipient.id,
												(e.target as HTMLInputElement).value
											)}
										class="inline-input"
										placeholder="1"
										min="1"
									/>
								</div>
							{/if}

							{#if needsAmount}
								<div class="col-amount">
									<input
										type="number"
										value={recipient.amount || ''}
										oninput={(e) =>
											updateRecipientAmount(recipient.id, (e.target as HTMLInputElement).value)}
										class="inline-input"
										placeholder="0.0"
										step="0.000001"
									/>
								</div>
							{/if}

							<div class="col-label">
								<span class="label-text">{recipient.label || '-'}</span>
							</div>

							<div class="col-actions">
								<button class="delete-button" onclick={() => removeRecipient(recipient.id)}>
									<Trash2 size={14} />
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Empty State -->
	{#if step4State.recipients.length === 0 && importMethod !== 'paste' && importMethod !== 'csv'}
		<div class="empty-state">
			<p>{i18n.t('tools.one_to_many_transfer.step4.content.empty_state')}</p>
		</div>
	{/if}
</StepContent>

<style>
	/* Token Indicator */
	.token-indicator {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: hsla(210, 100%, 95%, 1);
		border: 1px solid hsla(210, 100%, 80%, 1);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
		flex-wrap: wrap;
	}

	:global([data-theme='dark']) .token-indicator {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsla(210, 100%, 30%, 1);
	}

	.token-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .token-label {
		color: var(--gray-400);
	}

	.token-value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .token-value {
		color: var(--gray-100);
	}

	.token-type-badge,
	.amount-mode-badge {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.token-type-badge {
		background: hsl(210, 100%, 50%);
		color: white;
	}

	.amount-mode-badge {
		background: hsl(160, 70%, 40%);
		color: white;
	}

	/* Section */
	.section {
		margin-bottom: var(--space-6);
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-4);
	}

	.section-title {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	.section-header .section-title {
		margin-bottom: 0;
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
	}

	.regenerate-button {
		padding: var(--space-2) var(--space-3);
		background: hsla(160, 70%, 95%, 1);
		border: 1px solid hsla(160, 70%, 50%, 1);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: hsla(160, 70%, 35%, 1);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--space-1);
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .regenerate-button {
		background: hsla(160, 70%, 15%, 0.3);
		border-color: hsla(160, 70%, 40%, 1);
		color: hsla(160, 70%, 60%, 1);
	}

	.regenerate-button:hover {
		background: hsla(160, 70%, 90%, 1);
	}

	:global([data-theme='dark']) .regenerate-button:hover {
		background: hsla(160, 70%, 20%, 0.4);
	}

	/* Import Method Selector */
	.import-method-selector {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.method-button {
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .method-button {
		color: var(--gray-300);
	}

	.method-button:hover {
		border-color: var(--color-primary);
	}

	.method-button.active {
		border-color: hsl(210, 100%, 50%);
		background: hsla(210, 100%, 95%, 1);
		color: hsl(210, 100%, 40%);
	}

	:global([data-theme='dark']) .method-button.active {
		background: hsla(210, 100%, 15%, 0.4);
		color: hsl(210, 100%, 70%);
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
		margin-bottom: var(--space-4);
		flex-wrap: wrap;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
		min-width: 150px;
	}

	.form-field.flex-2 {
		flex: 2;
		min-width: 300px;
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
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.add-button:hover:not(:disabled) {
		background: hsl(210, 100%, 45%);
	}

	.add-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Paste Area */
	.paste-area {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.paste-hint {
		margin: 0 0 var(--space-3) 0;
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

	.error-list {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(0, 100%, 95%, 1);
		border: 1px solid hsla(0, 100%, 80%, 1);
		border-radius: var(--radius-md);
		color: hsla(0, 70%, 40%, 1);
		font-size: var(--text-sm);
		margin-bottom: var(--space-3);
	}

	:global([data-theme='dark']) .error-list {
		background: hsla(0, 100%, 10%, 0.3);
		border-color: hsla(0, 100%, 30%, 1);
		color: hsla(0, 70%, 70%, 1);
	}

	.error-list ul {
		margin: 0;
		padding-left: var(--space-4);
	}

	/* CSV Upload Area */
	.csv-upload-area {
		padding: var(--space-8);
		background: var(--color-panel-1);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-md);
		text-align: center;
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .csv-upload-area {
		color: var(--gray-400);
	}

	.csv-upload-area p {
		margin: var(--space-3) 0;
	}

	.upload-button {
		padding: var(--space-2) var(--space-4);
		background: hsl(210, 100%, 50%);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
	}

	.upload-button:hover {
		background: hsl(210, 100%, 45%);
	}

	.csv-hint {
		font-size: var(--text-xs);
		color: var(--gray-500);
	}

	/* Recipients Table */
	.recipients-table {
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.table-header {
		display: flex;
		padding: var(--space-3);
		background: var(--gray-100);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		gap: var(--space-2);
	}

	:global([data-theme='dark']) .table-header {
		background: var(--gray-800);
		color: var(--gray-300);
	}

	.table-body {
		max-height: 400px;
		overflow-y: auto;
	}

	.table-row {
		display: flex;
		padding: var(--space-3);
		border-bottom: 1px solid var(--color-border);
		align-items: center;
		gap: var(--space-2);
	}

	.table-row:last-child {
		border-bottom: none;
	}

	.table-row:hover {
		background: var(--gray-50);
	}

	:global([data-theme='dark']) .table-row:hover {
		background: var(--gray-800);
	}

	.col-address {
		flex: 2;
		min-width: 200px;
	}

	.col-token-id,
	.col-token-amount,
	.col-amount {
		width: 100px;
	}

	.col-label {
		flex: 1;
		min-width: 100px;
	}

	.col-actions {
		width: 40px;
	}

	.address-text {
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		word-break: break-all;
	}

	:global([data-theme='dark']) .address-text {
		color: var(--gray-100);
	}

	.label-text {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .label-text {
		color: var(--gray-400);
	}

	.inline-input {
		width: 100%;
		padding: var(--space-1) var(--space-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-panel-1);
		color: var(--gray-900);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .inline-input {
		color: var(--gray-100);
	}

	.inline-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.delete-button {
		padding: var(--space-1);
		background: transparent;
		border: none;
		color: var(--gray-500);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
	}

	.delete-button:hover {
		background: hsla(0, 80%, 95%, 1);
		color: hsla(0, 80%, 50%, 1);
	}

	:global([data-theme='dark']) .delete-button:hover {
		background: hsla(0, 80%, 20%, 0.3);
	}

	.clear-button {
		padding: var(--space-2) var(--space-3);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--gray-600);
		cursor: pointer;
		display: flex;
		align-items: center;
		gap: var(--space-1);
		transition: all 0.2s ease;
	}

	.clear-button:hover {
		background: hsla(0, 80%, 95%, 1);
		border-color: hsla(0, 80%, 60%, 1);
		color: hsla(0, 80%, 50%, 1);
	}

	:global([data-theme='dark']) .clear-button:hover {
		background: hsla(0, 80%, 20%, 0.3);
	}

	/* Empty State */
	.empty-state {
		padding: var(--space-8);
		text-align: center;
		background: var(--gray-50);
		border-radius: var(--radius-md);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .empty-state {
		background: var(--gray-800);
		color: var(--gray-400);
	}

	.empty-state p {
		margin: 0;
	}

	@media (max-width: 768px) {
		.form-row {
			flex-direction: column;
		}

		.form-field {
			min-width: 100%;
		}

		.form-field.flex-2 {
			min-width: 100%;
		}

		.table-header,
		.table-row {
			flex-wrap: wrap;
		}

		.col-address {
			min-width: 100%;
			margin-bottom: var(--space-2);
		}
	}
</style>

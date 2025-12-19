<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import StepContent from '$lib/components/step/step-content.svelte';
	import { step3State } from '@/features/token-distribution/stores/step3-state.svelte';
	import { PREDEFINED_TOKENS } from '$lib/config/tokens';
	import type { NativeToken, AnyToken } from '$lib/types/token';
	import type { DistributionTokenType } from '@/features/token-distribution/types/distribution';
	import { Coins, Image, Layers, Wallet } from '@lucide/svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	// Token type options for the selector
	const tokenTypeOptions: { type: DistributionTokenType; icon: typeof Coins }[] = [
		{ type: 'native', icon: Wallet },
		{ type: 'erc20', icon: Coins },
		{ type: 'erc721', icon: Image },
		{ type: 'erc1155', icon: Layers }
	];

	// Get available tokens for current network based on selected type
	const availableTokens = $derived(() => {
		if (!connectStore.currentChainId) return [];

		const tokens: AnyToken[] = [];
		const currentNetwork = connectStore.networks.find(
			(n) => n.chainId === connectStore.currentChainId
		);

		if (step3State.tokenType === 'native') {
			// Add native token
			if (currentNetwork) {
				const nativeToken: NativeToken = {
					id: `${connectStore.currentChainId}:native`,
					type: 'native',
					symbol: currentNetwork.symbol,
					name: currentNetwork.name,
					decimals: 18,
					chainId: connectStore.currentChainId,
					logoUrl: ''
				};
				tokens.push(nativeToken);
			}
		} else if (step3State.tokenType === 'erc20') {
			// Add ERC20 tokens
			const erc20Tokens = PREDEFINED_TOKENS[connectStore.currentChainId];
			if (erc20Tokens && erc20Tokens.length > 0) {
				tokens.push(...erc20Tokens);
			}
		}
		// For ERC721/ERC1155, user must input contract address manually

		return tokens;
	});

	// Handle token type selection
	function selectTokenType(type: DistributionTokenType) {
		step3State.tokenType = type;
	}

	// Handle token selection
	function selectToken(token: AnyToken) {
		step3State.selectedToken = token;
	}

	// Handle amount mode change
	function setAmountMode(mode: 'equal' | 'custom' | 'random') {
		step3State.amountMode = mode;
	}

	// Get translation key for token type
	function getTokenTypeLabel(type: DistributionTokenType): string {
		return i18n.t(`tools.one_to_many_transfer.step3.content.token_type.${type}`);
	}

	function getTokenTypeDesc(type: DistributionTokenType): string {
		return i18n.t(`tools.one_to_many_transfer.step3.content.token_type.${type}_desc`);
	}
</script>

<StepContent>
	<StepContentHeader
		title={i18n.t('tools.one_to_many_transfer.step3.content.title')}
		description={i18n.t('tools.one_to_many_transfer.step3.content.description')}
	/>

	<!-- Token Type Selector -->
	<div class="section">
		<h3 class="section-title">
			{i18n.t('tools.one_to_many_transfer.step3.content.token_type.title')}
		</h3>
		<div class="token-type-grid">
			{#each tokenTypeOptions as option (option.type)}
				<button
					class="token-type-card"
					class:selected={step3State.tokenType === option.type}
					onclick={() => selectTokenType(option.type)}
				>
					<div class="token-type-icon">
						<option.icon size={24} />
					</div>
					<div class="token-type-info">
						<div class="token-type-label">{getTokenTypeLabel(option.type)}</div>
						<div class="token-type-desc">{getTokenTypeDesc(option.type)}</div>
					</div>
					{#if step3State.tokenType === option.type}
						<div class="check-icon">✓</div>
					{/if}
				</button>
			{/each}
		</div>
	</div>

	<!-- Token Selection (for Native/ERC20) -->
	{#if step3State.tokenType === 'native' || step3State.tokenType === 'erc20'}
		<div class="section">
			<h3 class="section-title">
				{i18n.t('tools.one_to_many_transfer.step3.content.select_token.title')}
			</h3>
			{#if availableTokens().length === 0}
				<div class="empty-state">
					<p>{i18n.t('tools.one_to_many_transfer.step3.content.select_token.no_tokens')}</p>
				</div>
			{:else}
				<div class="token-grid">
					{#each availableTokens() as token (token.id)}
						<button
							class="token-card"
							class:selected={step3State.selectedToken?.id === token.id}
							onclick={() => selectToken(token)}
						>
							<div class="token-info">
								<div class="token-symbol">{token.symbol}</div>
								<div class="token-name">{token.name}</div>
							</div>
							{#if step3State.selectedToken?.id === token.id}
								<div class="check-icon">✓</div>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- NFT Configuration (for ERC721/ERC1155) -->
	{#if step3State.tokenType === 'erc721' || step3State.tokenType === 'erc1155'}
		<div class="section">
			<h3 class="section-title">
				{i18n.t('tools.one_to_many_transfer.step3.content.nft_config.title')}
			</h3>
			<div class="nft-config">
				<div class="input-group">
					<label class="input-label">
						{i18n.t('tools.one_to_many_transfer.step3.content.nft_config.contract_address')}
					</label>
					<input
						type="text"
						class="text-input"
						placeholder={i18n.t(
							'tools.one_to_many_transfer.step3.content.nft_config.contract_placeholder'
						)}
						bind:value={step3State.customNftAddress}
					/>
				</div>

				{#if step3State.tokenType === 'erc1155'}
					<div class="input-group">
						<label class="input-label">
							{i18n.t('tools.one_to_many_transfer.step3.content.nft_config.token_ids')}
						</label>
						<input
							type="text"
							class="text-input"
							placeholder={i18n.t(
								'tools.one_to_many_transfer.step3.content.nft_config.token_ids_placeholder'
							)}
							bind:value={step3State.customNftTokenIds}
						/>
						<p class="input-hint">
							{i18n.t('tools.one_to_many_transfer.step3.content.nft_config.token_ids_hint')}
						</p>
					</div>
				{/if}

				{#if step3State.customNftError}
					<div class="error-message">{step3State.customNftError}</div>
				{/if}

				<!-- TODO: Add NFT info loading and display -->
			</div>
		</div>
	{/if}

	<!-- Distribution Mode (for fungible tokens) -->
	{#if step3State.isFungible && step3State.selectedToken}
		<div class="section">
			<h3 class="section-title">
				{i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.title')}
			</h3>
			<div class="mode-selector">
				<button
					class="mode-button"
					class:active={step3State.amountMode === 'equal'}
					onclick={() => setAmountMode('equal')}
				>
					<div class="mode-icon">⚖️</div>
					<div class="mode-label">
						{i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.equal')}
					</div>
					<div class="mode-desc">
						{i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.equal_desc')}
					</div>
				</button>
				<button
					class="mode-button"
					class:active={step3State.amountMode === 'custom'}
					onclick={() => setAmountMode('custom')}
				>
					<div class="mode-icon">✏️</div>
					<div class="mode-label">
						{i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.custom')}
					</div>
					<div class="mode-desc">
						{i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.custom_desc')}
					</div>
				</button>
				<button
					class="mode-button"
					class:active={step3State.amountMode === 'random'}
					onclick={() => setAmountMode('random')}
				>
					<div class="mode-icon">🎲</div>
					<div class="mode-label">
						{i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.random')}
					</div>
					<div class="mode-desc">
						{i18n.t('tools.one_to_many_transfer.step3.content.amount_mode.random_desc')}
					</div>
				</button>
			</div>
		</div>

		<!-- Amount Input (for equal mode) -->
		{#if step3State.amountMode === 'equal'}
			<div class="section">
				<h3 class="section-title">
					{i18n.t('tools.one_to_many_transfer.step3.content.amount_input.title')}
				</h3>
				<div class="amount-input-group">
					<input
						type="number"
						class="amount-input"
						placeholder={i18n.t(
							'tools.one_to_many_transfer.step3.content.amount_input.placeholder'
						)}
						bind:value={step3State.amountPerRecipient}
						step="0.000001"
						min="0"
					/>
					<div class="token-suffix">{step3State.selectedToken.symbol}</div>
				</div>
				<p class="input-hint">
					{i18n.t('tools.one_to_many_transfer.step3.content.amount_input.hint')}
				</p>
			</div>
		{:else if step3State.amountMode === 'custom'}
			<div class="section">
				<div class="info-message">
					<p>{i18n.t('tools.one_to_many_transfer.step3.content.custom_mode_info')}</p>
				</div>
			</div>
		{:else if step3State.amountMode === 'random'}
			<div class="section">
				<div class="random-config">
					<div class="random-input-group">
						<label class="input-label">
							{i18n.t('tools.one_to_many_transfer.step3.content.random_mode_config.min_amount')}
						</label>
						<div class="amount-input-group">
							<input
								type="number"
								class="amount-input"
								placeholder={i18n.t(
									'tools.one_to_many_transfer.step3.content.random_mode_config.min_placeholder'
								)}
								step="0.000001"
								min="0"
							/>
							<div class="token-suffix">{step3State.selectedToken.symbol}</div>
						</div>
					</div>
					<div class="random-input-group">
						<label class="input-label">
							{i18n.t('tools.one_to_many_transfer.step3.content.random_mode_config.max_amount')}
						</label>
						<div class="amount-input-group">
							<input
								type="number"
								class="amount-input"
								placeholder={i18n.t(
									'tools.one_to_many_transfer.step3.content.random_mode_config.max_placeholder'
								)}
								step="0.000001"
								min="0"
							/>
							<div class="token-suffix">{step3State.selectedToken.symbol}</div>
						</div>
					</div>
				</div>
				<p class="input-hint">
					{i18n.t('tools.one_to_many_transfer.step3.content.random_mode_config.hint')}
				</p>
			</div>
		{/if}
	{/if}
</StepContent>

<style>
	.section {
		margin-bottom: var(--space-8);
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

	/* Token Type Grid */
	.token-type-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-3);
	}

	.token-type-card {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: var(--space-3);
		text-align: left;
	}

	.token-type-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.1);
	}

	.token-type-card.selected {
		border-color: hsl(210, 100%, 50%);
		background: hsla(210, 100%, 98%, 1);
	}

	:global([data-theme='dark']) .token-type-card.selected {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsl(210, 100%, 50%);
	}

	.token-type-icon {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gray-100);
		border-radius: var(--radius-md);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .token-type-icon {
		background: var(--gray-800);
		color: var(--gray-400);
	}

	.token-type-card.selected .token-type-icon {
		background: hsla(210, 100%, 90%, 1);
		color: hsl(210, 100%, 50%);
	}

	:global([data-theme='dark']) .token-type-card.selected .token-type-icon {
		background: hsla(210, 100%, 20%, 0.5);
		color: hsl(210, 100%, 60%);
	}

	.token-type-info {
		flex: 1;
	}

	.token-type-label {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin-bottom: var(--space-1);
	}

	:global([data-theme='dark']) .token-type-label {
		color: var(--gray-100);
	}

	.token-type-desc {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .token-type-desc {
		color: var(--gray-400);
	}

	/* Token Grid */
	.token-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.token-card {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text-align: left;
	}

	.token-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px hsla(0, 0%, 0%, 0.1);
	}

	.token-card.selected {
		border-color: hsl(210, 100%, 50%);
		background: hsla(210, 100%, 98%, 1);
	}

	:global([data-theme='dark']) .token-card.selected {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsl(210, 100%, 50%);
	}

	.token-info {
		flex: 1;
	}

	.token-symbol {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin-bottom: var(--space-1);
	}

	:global([data-theme='dark']) .token-symbol {
		color: var(--gray-100);
	}

	.token-name {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .token-name {
		color: var(--gray-400);
	}

	.check-icon {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: hsl(210, 100%, 50%);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: var(--text-sm);
		flex-shrink: 0;
	}

	/* NFT Config */
	.nft-config {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.input-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .input-label {
		color: var(--gray-300);
	}

	.text-input {
		padding: var(--space-3) var(--space-4);
		font-size: var(--text-base);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
		color: var(--gray-900);
		transition: border-color 0.2s ease;
	}

	:global([data-theme='dark']) .text-input {
		color: var(--gray-100);
	}

	.text-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.error-message {
		padding: var(--space-3);
		background: hsla(0, 100%, 95%, 1);
		border: 1px solid hsla(0, 100%, 80%, 1);
		border-radius: var(--radius-md);
		color: hsla(0, 70%, 40%, 1);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .error-message {
		background: hsla(0, 100%, 10%, 0.3);
		border-color: hsla(0, 100%, 30%, 1);
		color: hsla(0, 70%, 70%, 1);
	}

	/* Mode Selector */
	.mode-selector {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-4);
	}

	.mode-button {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.mode-button:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
	}

	.mode-button.active {
		border-color: hsl(210, 100%, 50%);
		background: hsla(210, 100%, 98%, 1);
	}

	:global([data-theme='dark']) .mode-button.active {
		background: hsla(210, 100%, 10%, 0.3);
	}

	.mode-icon {
		font-size: var(--text-3xl);
	}

	.mode-label {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .mode-label {
		color: var(--gray-100);
	}

	.mode-desc {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .mode-desc {
		color: var(--gray-400);
	}

	/* Amount Input */
	.amount-input-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		max-width: 400px;
	}

	.amount-input {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		font-size: var(--text-lg);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
		color: var(--gray-900);
		transition: border-color 0.2s ease;
	}

	:global([data-theme='dark']) .amount-input {
		color: var(--gray-100);
	}

	.amount-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.token-suffix {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .token-suffix {
		color: var(--gray-300);
	}

	.input-hint {
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .input-hint {
		color: var(--gray-400);
	}

	/* Random Config */
	.random-config {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
		max-width: 600px;
	}

	.random-input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	/* Info Message */
	.info-message {
		padding: var(--space-4);
		background: hsla(210, 100%, 95%, 1);
		border: 1px solid hsla(210, 100%, 80%, 1);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .info-message {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsla(210, 100%, 30%, 1);
	}

	.info-message p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .info-message p {
		color: var(--gray-300);
	}

	/* Empty State */
	.empty-state {
		padding: var(--space-6);
		text-align: center;
		background: var(--gray-50);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .empty-state {
		background: var(--gray-800);
	}

	.empty-state p {
		margin: 0;
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .empty-state p {
		color: var(--gray-400);
	}

	@media (max-width: 768px) {
		.token-type-grid {
			grid-template-columns: 1fr;
		}

		.mode-selector {
			grid-template-columns: 1fr;
		}

		.random-config {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 640px) {
		.token-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step3NFTConfigState } from '../../stores/step3-nft-config-state.svelte';

	const i18n = useI18n();
</script>

<div class="step-content">
	<StepContentHeader
		title={i18n.t('nft-deployer.step3.content.title')}
		description={i18n.t('nft-deployer.step3.content.description')}
	/>

	<div class="form-container">
		<!-- NFT Name -->
		<div class="form-group">
			<label for="nft-name" class="form-label">
				{i18n.t('nft-deployer.step3.content.name_label')}
				<span class="required">*</span>
			</label>
			<input
				id="nft-name"
				type="text"
				class="form-input"
				placeholder={i18n.t('nft-deployer.step3.content.name_placeholder')}
				bind:value={step3NFTConfigState.name}
				maxlength="50"
			/>
			<p class="form-hint">{i18n.t('nft-deployer.step3.content.name_hint')}</p>
		</div>

		<!-- NFT Symbol -->
		<div class="form-group">
			<label for="nft-symbol" class="form-label">
				{i18n.t('nft-deployer.step3.content.symbol_label')}
				<span class="required">*</span>
			</label>
			<input
				id="nft-symbol"
				type="text"
				class="form-input"
				placeholder={i18n.t('nft-deployer.step3.content.symbol_placeholder')}
				bind:value={step3NFTConfigState.symbol}
				maxlength="10"
				style="text-transform: uppercase;"
			/>
			<p class="form-hint">{i18n.t('nft-deployer.step3.content.symbol_hint')}</p>
		</div>

		<!-- Mint Type Selection (Radio buttons - must choose one) -->
		<fieldset class="form-group">
			<legend class="form-label">
				{i18n.t('nft-deployer.step3.content.mint_type_label')}
				<span class="required">*</span>
			</legend>
			<div class="radio-group">
				<label class="radio-label">
					<input
						type="radio"
						name="mint-type"
						checked={step3NFTConfigState.publicMintEnabled &&
							!step3NFTConfigState.stakeToMintEnabled}
						onchange={() => {
							step3NFTConfigState.publicMintEnabled = true;
							step3NFTConfigState.stakeToMintEnabled = false;
						}}
					/>
					<span class="radio-text">
						<strong>{i18n.t('nft-deployer.step3.content.public_mint_enabled')}</strong>
						<span class="radio-description">
							{i18n.t('nft-deployer.step3.content.public_mint_hint')}
						</span>
					</span>
				</label>

				<label class="radio-label">
					<input
						type="radio"
						name="mint-type"
						checked={step3NFTConfigState.stakeToMintEnabled &&
							!step3NFTConfigState.publicMintEnabled}
						onchange={() => {
							step3NFTConfigState.publicMintEnabled = false;
							step3NFTConfigState.stakeToMintEnabled = true;
						}}
					/>
					<span class="radio-text">
						<strong>{i18n.t('nft-deployer.step3.content.enable_stake_to_mint')}</strong>
						<span class="radio-description">
							{i18n.t('nft-deployer.step3.content.stake_to_mint_hint')}
						</span>
					</span>
				</label>
			</div>
		</fieldset>

		<!-- Stake Token Address (conditional) -->
		{#if step3NFTConfigState.stakeToMintEnabled}
			<div class="form-group conditional">
				<label for="stake-token" class="form-label">
					{i18n.t('nft-deployer.step3.content.stake_token_label')}
					<span class="required">*</span>
				</label>
				<input
					id="stake-token"
					type="text"
					class="form-input"
					placeholder="0x..."
					bind:value={step3NFTConfigState.stakeToken}
				/>
				<p class="form-hint">{i18n.t('nft-deployer.step3.content.stake_token_hint')}</p>
			</div>

			<div class="form-group conditional">
				<label for="stake-amount" class="form-label">
					{i18n.t('nft-deployer.step3.content.stake_amount_label')}
					<span class="required">*</span>
				</label>
				<input
					id="stake-amount"
					type="text"
					class="form-input"
					placeholder="1000000000000000000"
					bind:value={step3NFTConfigState.stakeAmount}
				/>
				<p class="form-hint">{i18n.t('nft-deployer.step3.content.stake_amount_hint')}</p>
			</div>
		{/if}

		<!-- Preview Box -->
		{#if step3NFTConfigState.name && step3NFTConfigState.symbol}
			<div class="preview-box">
				<h4>{i18n.t('nft-deployer.step3.content.preview')}</h4>
				<div class="preview-content">
					<p>
						<strong>{step3NFTConfigState.name} ({step3NFTConfigState.symbol})</strong>
					</p>
					<p>
						Minting Type: {step3NFTConfigState.publicMintEnabled ? 'Owner Mint' : 'Stake-to-Mint'}
					</p>
					{#if step3NFTConfigState.stakeToMintEnabled && step3NFTConfigState.stakeToken}
						<p>Stake Token: {step3NFTConfigState.stakeToken}</p>
						<p>Stake Amount: {step3NFTConfigState.stakeAmount || '0'}</p>
					{/if}
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

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	fieldset.form-group {
		border: none;
		padding: 0;
		margin: 0;
	}

	fieldset.form-group legend.form-label {
		padding: 0;
		margin-bottom: var(--space-2);
	}

	.form-group.conditional {
		padding-left: var(--space-6);
		border-left: 3px solid var(--color-primary);
	}

	.form-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .form-label {
		color: var(--gray-300);
	}

	.required {
		color: var(--red-600);
	}

	.form-input {
		width: 100%;
		padding: var(--space-3);
		font-size: var(--text-base);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-background);
		color: var(--gray-900);
		transition: all 0.2s;
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	:global([data-theme='dark']) .form-input {
		background: var(--gray-800);
		color: var(--gray-100);
		border-color: var(--gray-700);
	}

	.form-hint {
		font-size: var(--text-xs);
		color: var(--gray-600);
		margin: 0;
	}

	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}

	/* Radio button styles */
	.radio-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.radio-label {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		cursor: pointer;
		padding: var(--space-3);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: all 0.2s;
	}

	.radio-label:hover {
		border-color: var(--color-primary);
		background: var(--gray-50);
	}

	:global([data-theme='dark']) .radio-label:hover {
		background: var(--gray-800);
	}

	.radio-label input[type='radio'] {
		width: 18px;
		height: 18px;
		margin-top: 2px;
		cursor: pointer;
	}

	.radio-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
	}

	.radio-text strong {
		font-size: var(--text-base);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .radio-text strong {
		color: var(--gray-100);
	}

	.radio-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		font-weight: normal;
	}

	:global([data-theme='dark']) .radio-description {
		color: var(--gray-400);
	}

	.preview-box {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--gray-50);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	:global([data-theme='dark']) .preview-box {
		background: var(--gray-800);
	}

	.preview-box h4 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .preview-box h4 {
		color: var(--gray-300);
	}

	.preview-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.preview-content p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .preview-content p {
		color: var(--gray-300);
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-4);
		}

		.form-container {
			gap: var(--space-4);
		}
	}
</style>

<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step4State } from '../../stores/step4-state.svelte';
	import { step2State } from '../../stores/step2-state.svelte';

	const i18n = useI18n();

	const isERC1155 = $derived(step2State.selectedStandard === 'erc1155');
</script>

<div class="step-content">
	<StepContentHeader
		title={i18n.t('tools.nft_deployer.step4.content.title')}
		description={i18n.t('tools.nft_deployer.step4.content.description')}
	/>

	<div class="form-container">
		<!-- Supply & Pricing Section -->
		<div class="section-card">
			<h3 class="section-title">{i18n.t('tools.nft_deployer.step4.content.supply_pricing')}</h3>

			<div class="form-field">
				<label for="max-supply" class="field-label">
					{i18n.t('tools.nft_deployer.step4.content.max_supply_label')}
				</label>
				<input
					id="max-supply"
					type="number"
					class="field-input"
					placeholder="0 = unlimited"
					bind:value={step4State.maxSupply}
					min="0"
				/>
				<div class="field-hint">{i18n.t('tools.nft_deployer.step4.content.max_supply_hint')}</div>
			</div>

			<div class="form-field">
				<label for="mint-price" class="field-label">
					{i18n.t('tools.nft_deployer.step4.content.mint_price_label')}
				</label>
				<input
					id="mint-price"
					type="text"
					class="field-input"
					placeholder="0.01"
					bind:value={step4State.mintPrice}
				/>
				<div class="field-hint">{i18n.t('tools.nft_deployer.step4.content.mint_price_hint')}</div>
			</div>

			<div class="form-field">
				<label for="max-per-wallet" class="field-label">
					{i18n.t('tools.nft_deployer.step4.content.max_per_wallet_label')}
				</label>
				<input
					id="max-per-wallet"
					type="number"
					class="field-input"
					placeholder="0 = unlimited"
					bind:value={step4State.maxMintPerWallet}
					min="0"
				/>
				<div class="field-hint">
					{i18n.t('tools.nft_deployer.step4.content.max_per_wallet_hint')}
				</div>
			</div>
		</div>

		<!-- Royalties Section -->
		<div class="section-card">
			<h3 class="section-title">{i18n.t('tools.nft_deployer.step4.content.royalties')}</h3>

			<div class="toggle-field">
				<label class="toggle-label">
					<input type="checkbox" bind:checked={step4State.royaltyEnabled} />
					<span class="toggle-text"
						>{i18n.t('tools.nft_deployer.step4.content.enable_royalties')}</span
					>
				</label>
			</div>

			{#if step4State.royaltyEnabled}
				<div class="form-field">
					<label for="royalty-recipient" class="field-label">
						{i18n.t('tools.nft_deployer.step4.content.royalty_recipient_label')}
						<span class="required">*</span>
					</label>
					<input
						id="royalty-recipient"
						type="text"
						class="field-input"
						placeholder="0x..."
						bind:value={step4State.royaltyRecipient}
					/>
					<div class="field-hint">
						{i18n.t('tools.nft_deployer.step4.content.royalty_recipient_hint')}
					</div>
				</div>

				<div class="form-field">
					<label for="royalty-percentage" class="field-label">
						{i18n.t('tools.nft_deployer.step4.content.royalty_percentage_label')}
					</label>
					<input
						id="royalty-percentage"
						type="number"
						class="field-input"
						placeholder="5"
						bind:value={step4State.royaltyPercentage}
						min="0"
						max="100"
						step="0.1"
					/>
					<div class="field-hint">
						{i18n.t('tools.nft_deployer.step4.content.royalty_percentage_hint')}
					</div>
				</div>
			{/if}
		</div>

		<!-- Access Control Section -->
		<div class="section-card">
			<h3 class="section-title">{i18n.t('tools.nft_deployer.step4.content.access_control')}</h3>

			<div class="toggle-field">
				<label class="toggle-label">
					<input type="checkbox" bind:checked={step4State.ownerMintOnly} />
					<span class="toggle-text">{i18n.t('tools.nft_deployer.step4.content.owner_only')}</span>
				</label>
			</div>

			<div class="toggle-field">
				<label class="toggle-label">
					<input type="checkbox" bind:checked={step4State.publicMintEnabled} />
					<span class="toggle-text">{i18n.t('tools.nft_deployer.step4.content.public_mint')}</span>
				</label>
			</div>

			<div class="toggle-field">
				<label class="toggle-label">
					<input type="checkbox" bind:checked={step4State.whitelistEnabled} />
					<span class="toggle-text">{i18n.t('tools.nft_deployer.step4.content.whitelist')}</span>
				</label>
			</div>
		</div>

		<!-- Features Section -->
		<div class="section-card">
			<h3 class="section-title">{i18n.t('tools.nft_deployer.step4.content.features')}</h3>

			<div class="toggle-field">
				<label class="toggle-label">
					<input type="checkbox" bind:checked={step4State.pausable} />
					<span class="toggle-text">{i18n.t('tools.nft_deployer.step4.content.pausable')}</span>
				</label>
				<div class="field-hint">{i18n.t('tools.nft_deployer.step4.content.pausable_hint')}</div>
			</div>

			<div class="toggle-field">
				<label class="toggle-label">
					<input type="checkbox" bind:checked={step4State.burnable} />
					<span class="toggle-text">{i18n.t('tools.nft_deployer.step4.content.burnable')}</span>
				</label>
				<div class="field-hint">{i18n.t('tools.nft_deployer.step4.content.burnable_hint')}</div>
			</div>

			<div class="toggle-field">
				<label class="toggle-label">
					<input type="checkbox" bind:checked={step4State.revealable} />
					<span class="toggle-text">{i18n.t('tools.nft_deployer.step4.content.revealable')}</span>
				</label>
				<div class="field-hint">{i18n.t('tools.nft_deployer.step4.content.revealable_hint')}</div>
			</div>

			{#if isERC1155}
				<div class="toggle-field">
					<label class="toggle-label">
						<input type="checkbox" bind:checked={step4State.fungible} />
						<span class="toggle-text">{i18n.t('tools.nft_deployer.step4.content.fungible')}</span>
					</label>
					<div class="field-hint">{i18n.t('tools.nft_deployer.step4.content.fungible_hint')}</div>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.form-container {
		max-width: 700px;
		margin: var(--space-6) auto 0;
	}

	.section-card {
		margin-bottom: var(--space-8);
		padding: var(--space-6);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.section-title {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0 0 var(--space-5) 0;
		padding-bottom: var(--space-3);
		border-bottom: 2px solid var(--color-border);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	.form-field {
		margin-bottom: var(--space-5);
	}

	.form-field:last-child {
		margin-bottom: 0;
	}

	.field-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .field-label {
		color: var(--gray-300);
	}

	.required {
		color: var(--red-600);
	}

	.field-input {
		width: 100%;
		padding: var(--space-3);
		font-size: var(--text-base);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
		color: var(--gray-900);
		transition: all 0.2s ease;
	}

	.field-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px hsla(210, 100%, 50%, 0.1);
	}

	:global([data-theme='dark']) .field-input {
		background: var(--gray-800);
		color: var(--gray-100);
	}

	.field-hint {
		margin-top: var(--space-2);
		font-size: var(--text-xs);
		color: var(--gray-500);
		line-height: 1.4;
	}

	.toggle-field {
		margin-bottom: var(--space-4);
	}

	.toggle-field:last-child {
		margin-bottom: 0;
	}

	.toggle-label {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		cursor: pointer;
	}

	.toggle-label input[type='checkbox'] {
		width: 20px;
		height: 20px;
		cursor: pointer;
		accent-color: var(--color-primary);
	}

	.toggle-text {
		font-size: var(--text-base);
		color: var(--gray-700);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .toggle-text {
		color: var(--gray-300);
	}

	.toggle-field .field-hint {
		margin-left: calc(20px + var(--space-3));
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.form-container {
			max-width: 100%;
		}

		.section-card {
			padding: var(--space-4);
		}
	}
</style>

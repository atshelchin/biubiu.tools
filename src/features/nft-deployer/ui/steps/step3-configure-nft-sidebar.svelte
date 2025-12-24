<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { step3NFTConfigState } from '../../stores/step3-nft-config-state.svelte';

	const i18n = useI18n();

	const config = $derived(step3NFTConfigState);
	const isValid = $derived(config.isValid());
</script>

<div class="step-sidebar">
	<h3 class="sidebar-title">{i18n.t('nft-deployer.step3.sidebar.title')}</h3>
	<p class="sidebar-description">
		{i18n.t('nft-deployer.step3.sidebar.description')}
	</p>

	{#if config.name || config.symbol}
		<div class="preview-card">
			<h4 class="preview-title">{i18n.t('nft-deployer.step3.sidebar.preview')}</h4>

			{#if config.name}
				<div class="preview-item">
					<span class="preview-label">{i18n.t('nft-deployer.step3.sidebar.collection_name')}:</span>
					<span class="preview-value">{config.name}</span>
				</div>
			{/if}

			{#if config.symbol}
				<div class="preview-item">
					<span class="preview-label">{i18n.t('nft-deployer.step3.sidebar.symbol')}:</span>
					<span class="preview-value">{config.symbol}</span>
				</div>
			{/if}

			{#if config.stakeToMintEnabled}
				<div class="preview-item highlight">
					<span class="preview-label">{i18n.t('nft-deployer.step3.sidebar.stake_enabled')}</span>
					<span class="preview-icon">✓</span>
				</div>
			{/if}

			<div class="status-indicator" class:valid={isValid} class:invalid={!isValid}>
				{#if isValid}
					✓ {i18n.t('nft-deployer.step3.sidebar.ready')}
				{:else}
					⚠ {i18n.t('nft-deployer.step3.sidebar.incomplete')}
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.step-sidebar {
		padding: var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.sidebar-title {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0 0 var(--space-2) 0;
	}

	:global([data-theme='dark']) .sidebar-title {
		color: var(--gray-100);
	}

	.sidebar-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0 0 var(--space-4) 0;
		line-height: 1.5;
	}

	:global([data-theme='dark']) .sidebar-description {
		color: var(--gray-400);
	}

	.preview-card {
		margin-top: var(--space-4);
		padding: var(--space-4);
		background: var(--color-background);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.preview-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin: 0 0 var(--space-3) 0;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	:global([data-theme='dark']) .preview-title {
		color: var(--gray-300);
	}

	.preview-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.preview-item:last-of-type {
		border-bottom: none;
	}

	.preview-item.highlight {
		background: var(--blue-50);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		margin-top: var(--space-2);
	}

	:global([data-theme='dark']) .preview-item.highlight {
		background: rgba(59, 130, 246, 0.1);
	}

	.preview-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .preview-label {
		color: var(--gray-400);
	}

	.preview-value {
		font-size: var(--text-sm);
		color: var(--gray-900);
		font-weight: var(--font-semibold);
		text-align: right;
	}

	:global([data-theme='dark']) .preview-value {
		color: var(--gray-100);
	}

	.preview-icon {
		font-size: var(--text-lg);
		color: var(--blue-600);
	}

	.status-indicator {
		margin-top: var(--space-3);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		text-align: center;
	}

	.status-indicator.valid {
		background: var(--green-50);
		color: var(--green-700);
		border: 1px solid var(--green-200);
	}

	.status-indicator.invalid {
		background: var(--yellow-50);
		color: var(--yellow-700);
		border: 1px solid var(--yellow-200);
	}

	:global([data-theme='dark']) .status-indicator.valid {
		background: rgba(34, 197, 94, 0.1);
		color: var(--green-400);
		border-color: var(--green-900);
	}

	:global([data-theme='dark']) .status-indicator.invalid {
		background: rgba(234, 179, 8, 0.1);
		color: var(--yellow-400);
		border-color: var(--yellow-900);
	}
</style>

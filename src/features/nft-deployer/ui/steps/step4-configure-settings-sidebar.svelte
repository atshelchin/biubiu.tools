<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { step4State } from '../../stores/step4-state.svelte';

	const i18n = useI18n();

	const settings = $derived({
		supply: step4State.maxSupply > 0,
		pricing: Number(step4State.mintPrice) > 0,
		royalty: step4State.royaltyEnabled,
		features: step4State.pausable || step4State.burnable || step4State.revealable
	});
</script>

<div class="step-sidebar">
	<h3 class="sidebar-title">{i18n.t('tools.nft_deployer.step4.sidebar.title')}</h3>
	<p class="sidebar-description">
		{i18n.t('tools.nft_deployer.step4.sidebar.description')}
	</p>

	<div class="settings-summary">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step4.sidebar.configured')}</h4>
		<div class="summary-list">
			<div class="summary-item" class:active={settings.supply}>
				<div class="indicator"></div>
				<span>{i18n.t('tools.nft_deployer.step4.sidebar.supply_limit')}</span>
			</div>
			<div class="summary-item" class:active={settings.pricing}>
				<div class="indicator"></div>
				<span>{i18n.t('tools.nft_deployer.step4.sidebar.mint_price')}</span>
			</div>
			<div class="summary-item" class:active={settings.royalty}>
				<div class="indicator"></div>
				<span>{i18n.t('tools.nft_deployer.step4.sidebar.royalties')}</span>
			</div>
			<div class="summary-item" class:active={settings.features}>
				<div class="indicator"></div>
				<span>{i18n.t('tools.nft_deployer.step4.sidebar.special_features')}</span>
			</div>
		</div>
	</div>

	<div class="info-section">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step4.sidebar.recommendations')}</h4>
		<ul class="info-list">
			<li>{i18n.t('tools.nft_deployer.step4.sidebar.rec1')}</li>
			<li>{i18n.t('tools.nft_deployer.step4.sidebar.rec2')}</li>
			<li>{i18n.t('tools.nft_deployer.step4.sidebar.rec3')}</li>
		</ul>
	</div>
</div>

<style>
	.step-sidebar {
		padding: var(--space-6);
	}

	.sidebar-title {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0 0 var(--space-3) 0;
	}

	:global([data-theme='dark']) .sidebar-title {
		color: var(--gray-100);
	}

	.sidebar-description {
		font-size: var(--text-base);
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0 0 var(--space-6) 0;
	}

	:global([data-theme='dark']) .sidebar-description {
		color: var(--gray-400);
	}

	.settings-summary {
		margin-bottom: var(--space-6);
	}

	.info-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin: 0 0 var(--space-3) 0;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	:global([data-theme='dark']) .info-title {
		color: var(--gray-300);
	}

	.summary-list {
		display: grid;
		gap: var(--space-2);
	}

	.summary-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-500);
		transition: all 0.2s ease;
	}

	.summary-item.active {
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .summary-item {
		color: var(--gray-500);
	}

	:global([data-theme='dark']) .summary-item.active {
		color: var(--gray-100);
	}

	.indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--gray-300);
		flex-shrink: 0;
		transition: all 0.2s ease;
	}

	.summary-item.active .indicator {
		background: var(--green-600);
		box-shadow: 0 0 0 3px hsla(142, 71%, 45%, 0.2);
	}

	.info-section {
		margin-bottom: var(--space-6);
	}

	.info-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.info-list li {
		padding: var(--space-2) 0;
		padding-left: var(--space-5);
		position: relative;
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.5;
	}

	.info-list li::before {
		content: '💡';
		position: absolute;
		left: 0;
	}

	:global([data-theme='dark']) .info-list li {
		color: var(--gray-400);
	}
</style>

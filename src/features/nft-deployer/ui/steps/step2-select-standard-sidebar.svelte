<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { step2State } from '../../stores/step2-state.svelte';
	import { getNFTStandardInfo } from '../../utils/nft-standards';

	const i18n = useI18n();

	const selectedStandard = $derived(
		step2State.selectedStandard ? getNFTStandardInfo(step2State.selectedStandard) : null
	);
</script>

<div class="step-sidebar">
	<h3 class="sidebar-title">{i18n.t('tools.nft_deployer.step2.sidebar.title')}</h3>
	<p class="sidebar-description">
		{i18n.t('tools.nft_deployer.step2.sidebar.description')}
	</p>

	{#if selectedStandard}
		<div class="selected-info">
			<h4 class="info-title">{i18n.t('tools.nft_deployer.step2.sidebar.selected')}</h4>
			<div class="selected-standard">
				<div class="standard-name">{selectedStandard.name}</div>
				<div class="standard-desc">{selectedStandard.description}</div>
			</div>
		</div>
	{/if}

	<div class="info-section">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step2.sidebar.comparison')}</h4>
		<div class="comparison-grid">
			<div class="comparison-item">
				<span class="label">ERC-721:</span>
				<span class="value">Standard</span>
			</div>
			<div class="comparison-item">
				<span class="label">ERC-721A:</span>
				<span class="value">Gas Optimized</span>
			</div>
			<div class="comparison-item">
				<span class="label">ERC-1155:</span>
				<span class="value">Multi-Token</span>
			</div>
		</div>
	</div>

	<div class="info-section">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step2.sidebar.tips')}</h4>
		<ul class="info-list">
			<li>{i18n.t('tools.nft_deployer.step2.sidebar.tip1')}</li>
			<li>{i18n.t('tools.nft_deployer.step2.sidebar.tip2')}</li>
			<li>{i18n.t('tools.nft_deployer.step2.sidebar.tip3')}</li>
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

	.selected-info {
		margin-bottom: var(--space-6);
		padding: var(--space-4);
		background: hsla(210, 100%, 50%, 0.05);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-primary);
	}

	.selected-standard {
		margin-top: var(--space-3);
	}

	.standard-name {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--color-primary);
		margin-bottom: var(--space-1);
	}

	.standard-desc {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .standard-desc {
		color: var(--gray-400);
	}

	.info-section {
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

	.comparison-grid {
		display: grid;
		gap: var(--space-2);
	}

	.comparison-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2);
		background: var(--gray-50);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .comparison-item {
		background: var(--gray-800);
	}

	.comparison-item .label {
		color: var(--gray-700);
		font-weight: var(--font-medium);
	}

	.comparison-item .value {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .comparison-item .label {
		color: var(--gray-300);
	}

	:global([data-theme='dark']) .comparison-item .value {
		color: var(--gray-400);
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

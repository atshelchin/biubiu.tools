<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
</script>

<div class="step-sidebar">
	<h3 class="sidebar-title">{i18n.t('tools.nft_deployer.step1.sidebar.title')}</h3>
	<p class="sidebar-description">
		{i18n.t('tools.nft_deployer.step1.sidebar.description')}
	</p>

	<div class="info-section">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step1.sidebar.requirements')}</h4>
		<ul class="info-list">
			<li>{i18n.t('tools.nft_deployer.step1.sidebar.requirement1')}</li>
			<li>{i18n.t('tools.nft_deployer.step1.sidebar.requirement2')}</li>
			<li>{i18n.t('tools.nft_deployer.step1.sidebar.requirement3')}</li>
		</ul>
	</div>

	<div class="info-section">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step1.sidebar.supported_chains')}</h4>
		<ul class="info-list">
			<li>Ethereum</li>
			<li>Polygon</li>
			<li>Base</li>
			<li>BSC</li>
			<li>Arbitrum</li>
			<li>Optimism</li>
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
		content: '→';
		position: absolute;
		left: 0;
		color: var(--color-primary);
		font-weight: var(--font-bold);
	}

	:global([data-theme='dark']) .info-list li {
		color: var(--gray-400);
	}
</style>

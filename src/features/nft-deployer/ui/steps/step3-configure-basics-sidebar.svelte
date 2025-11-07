<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { step3State } from '../../stores/step3-state.svelte';

	const i18n = useI18n();

	const progress = $derived({
		name: step3State.name.length > 0,
		symbol: step3State.symbol.length > 0,
		description: step3State.description.length > 0,
		baseUri: step3State.baseUri.length > 0
	});

	const requiredComplete = $derived(progress.name && progress.symbol && progress.description);
</script>

<div class="step-sidebar">
	<h3 class="sidebar-title">{i18n.t('tools.nft_deployer.step3.sidebar.title')}</h3>
	<p class="sidebar-description">
		{i18n.t('tools.nft_deployer.step3.sidebar.description')}
	</p>

	<div class="progress-section">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step3.sidebar.progress')}</h4>
		<div class="progress-list">
			<div class="progress-item" class:complete={progress.name}>
				<div class="checkbox">
					{#if progress.name}✓{/if}
				</div>
				<span>{i18n.t('tools.nft_deployer.step3.sidebar.field_name')}</span>
			</div>
			<div class="progress-item" class:complete={progress.symbol}>
				<div class="checkbox">
					{#if progress.symbol}✓{/if}
				</div>
				<span>{i18n.t('tools.nft_deployer.step3.sidebar.field_symbol')}</span>
			</div>
			<div class="progress-item" class:complete={progress.description}>
				<div class="checkbox">
					{#if progress.description}✓{/if}
				</div>
				<span>{i18n.t('tools.nft_deployer.step3.sidebar.field_description')}</span>
			</div>
			<div class="progress-item optional" class:complete={progress.baseUri}>
				<div class="checkbox">
					{#if progress.baseUri}✓{/if}
				</div>
				<span>{i18n.t('tools.nft_deployer.step3.sidebar.field_base_uri')}</span>
			</div>
		</div>
	</div>

	{#if requiredComplete}
		<div class="complete-message">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
				<polyline points="22 4 12 14.01 9 11.01" />
			</svg>
			<span>{i18n.t('tools.nft_deployer.step3.sidebar.all_required_complete')}</span>
		</div>
	{/if}

	<div class="info-section">
		<h4 class="info-title">{i18n.t('tools.nft_deployer.step3.sidebar.tips')}</h4>
		<ul class="info-list">
			<li>{i18n.t('tools.nft_deployer.step3.sidebar.tip1')}</li>
			<li>{i18n.t('tools.nft_deployer.step3.sidebar.tip2')}</li>
			<li>{i18n.t('tools.nft_deployer.step3.sidebar.tip3')}</li>
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

	.progress-section {
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

	.progress-list {
		display: grid;
		gap: var(--space-2);
	}

	.progress-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-600);
		transition: all 0.2s ease;
	}

	.progress-item.optional {
		opacity: 0.7;
	}

	.progress-item.complete {
		color: var(--green-700);
	}

	:global([data-theme='dark']) .progress-item {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .progress-item.complete {
		color: var(--green-400);
	}

	.checkbox {
		width: 20px;
		height: 20px;
		border: 2px solid var(--gray-300);
		border-radius: var(--radius-sm);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		flex-shrink: 0;
	}

	.progress-item.complete .checkbox {
		border-color: var(--green-600);
		background: var(--green-600);
		color: white;
	}

	.complete-message {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(142, 71%, 45%, 0.1);
		border: 1px solid var(--green-500);
		border-radius: var(--radius-md);
		color: var(--green-700);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		margin-bottom: var(--space-6);
	}

	.complete-message svg {
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .complete-message {
		background: hsla(142, 71%, 45%, 0.15);
		color: var(--green-400);
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

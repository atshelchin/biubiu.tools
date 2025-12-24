<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import type { SweepProgress } from '@/features/wallet-sweep/utils/sweep-executor';
	import { CheckCircle2, AlertCircle } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		progress: SweepProgress;
	}

	let { progress }: Props = $props();
	const i18n = useI18n();
</script>

<div class="progress-card" transition:slide>
	<h4>
		{#if progress.phase === 'preparing'}
			{i18n.t('wallet-sweep.step5.content.progress.preparing')}
		{:else if progress.phase === 'building'}
			{i18n.t('wallet-sweep.step5.content.progress.building')}
		{:else if progress.phase === 'executing'}
			{i18n.t('wallet-sweep.step5.content.progress.executing')}
		{:else if progress.phase === 'confirming'}
			{i18n.t('wallet-sweep.step5.content.progress.confirming')}
		{:else if progress.phase === 'completed'}
			{i18n.t('wallet-sweep.step5.content.progress.completed')}
		{:else if progress.phase === 'error'}
			{i18n.t('wallet-sweep.step5.content.progress.error')}
		{/if}
	</h4>

	<p class="progress-message">{progress.message}</p>

	<div class="progress-bar-container">
		<div class="progress-bar" style="width: {progress.percentage}%"></div>
	</div>

	<div class="progress-stats">
		<span
			>{i18n.t('wallet-sweep.step5.content.progress.batch', {
				current: progress.currentBatch,
				total: progress.totalBatches
			})}</span
		>
		<span
			>{i18n.t('wallet-sweep.step5.content.progress.wallet', {
				current: progress.currentWallet,
				total: progress.totalWallets
			})}</span
		>
		<span>{progress.percentage}%</span>
	</div>

	{#if progress.results.length > 0}
		<div class="progress-results">
			<h5>
				{i18n.t('wallet-sweep.step5.content.progress.results', {
					count: progress.results.length
				})}
			</h5>
			<div class="results-list">
				{#each progress.results.slice(-5) as result (result.wallet + result.tokenSymbol)}
					<div class="result-item" class:success={result.success} class:error={!result.success}>
						{#if result.success}
							<CheckCircle2 size={14} />
						{:else}
							<AlertCircle size={14} />
						{/if}
						<span class="result-wallet">{result.wallet.slice(0, 8)}...</span>
						<span class="result-token">{result.tokenSymbol}</span>
						{#if result.error}
							<span class="result-error">{result.error}</span>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.progress-card {
		background: var(--color-panel-1);
		border: 2px solid var(--color-primary);
		border-radius: var(--radius-lg);
		padding: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.progress-card h4 {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-lg);
		color: var(--color-heading-1);
	}

	.progress-message {
		margin: 0 0 var(--space-3) 0;
		color: var(--gray-600);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .progress-message {
		color: var(--gray-400);
	}

	.progress-bar-container {
		width: 100%;
		height: 24px;
		background: var(--gray-200);
		border-radius: var(--radius-sm);
		overflow: hidden;
		margin-bottom: var(--space-3);
	}

	:global([data-theme='dark']) .progress-bar-container {
		background: var(--gray-700);
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--color-primary), #10b981);
		transition: width 0.3s ease;
	}

	.progress-stats {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin-bottom: var(--space-3);
	}

	:global([data-theme='dark']) .progress-stats {
		color: var(--gray-400);
	}

	.progress-results {
		margin-top: var(--space-4);
		padding-top: var(--space-3);
		border-top: 1px solid var(--color-border);
	}

	.progress-results h5 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.results-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.result-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
	}

	.result-item.success {
		background: hsla(120, 60%, 95%, 1);
		color: hsl(120, 60%, 30%);
	}

	:global([data-theme='dark']) .result-item.success {
		background: hsla(120, 60%, 15%, 0.3);
		color: hsl(120, 60%, 70%);
	}

	.result-item.error {
		background: hsla(0, 80%, 95%, 1);
		color: hsl(0, 80%, 40%);
	}

	:global([data-theme='dark']) .result-item.error {
		background: hsla(0, 80%, 15%, 0.3);
		color: hsl(0, 80%, 70%);
	}

	.result-wallet {
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
		font-weight: var(--font-medium);
	}

	.result-token {
		font-weight: var(--font-semibold);
	}

	.result-error {
		margin-left: auto;
		font-size: var(--text-xs);
		opacity: 0.8;
	}
</style>

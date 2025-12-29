<script lang="ts">
	import { AlertCircle } from '@lucide/svelte';

	interface Props {
		walletCount: number;
		batchCount: number;
	}

	let { walletCount, batchCount }: Props = $props();
</script>

<div class="info-card">
	<div class="info-header">
		<AlertCircle size={20} />
		<h4>Batch Processing</h4>
	</div>
	<p>
		Your {walletCount} wallet(s) will be processed in {batchCount} batch(es). Each batch can process up
		to 100 wallets.
	</p>
	<div class="batch-list">
		{#each Array.from({ length: batchCount }, (_, i) => i) as batchIndex (batchIndex)}
			<div class="batch-item">
				<span>Batch {batchIndex + 1}</span>
				<span class="batch-size">
					{Math.min(100, walletCount - batchIndex * 100)} wallet(s)
				</span>
			</div>
		{/each}
	</div>
</div>

<style>
	.info-card {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.info-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.info-header h4 {
		margin: 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.info-card p {
		margin: 0 0 var(--space-3) 0;
		color: var(--gray-600);
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .info-card p {
		color: var(--gray-400);
	}

	.batch-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.batch-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
	}

	.batch-size {
		color: var(--color-primary);
		font-weight: var(--font-medium);
	}
</style>

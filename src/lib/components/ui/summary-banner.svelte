<script lang="ts">
	import { RefreshCw } from '@lucide/svelte';

	interface Props {
		retryText?: string;
		onRetry?: () => void;
	}

	let { retryText, onRetry }: Props = $props();
</script>

<div class="summary-container">
	{#if onRetry && retryText}
		<button class="retry-button" onclick={onRetry}>
			<RefreshCw size={18} />
			{retryText}
		</button>
	{/if}
</div>

<style>
	.summary-container {
		margin-top: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.retry-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--gray-200);
		color: var(--gray-700);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .retry-button {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.retry-button:hover {
		background: var(--gray-300);
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .retry-button:hover {
		background: var(--gray-600);
	}
</style>

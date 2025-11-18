<script lang="ts">
	import { RefreshCw } from '@lucide/svelte';

	interface Props {
		message: string;
		size?: number;
	}

	let { message, size = 48 }: Props = $props();
</script>

<div class="loading-state">
	<div class="loading-spinner">
		<RefreshCw class="spin-icon" {size} />
	</div>
	<p class="loading-text">{message}</p>
</div>

<style>
	.loading-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-12) var(--space-6);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 2px solid var(--color-border);
		min-height: 300px;
	}

	.loading-spinner {
		color: var(--color-primary);
		margin-bottom: var(--space-4);
	}

	:global(.spin-icon) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		margin: 0;
	}

	:global([data-theme='dark']) .loading-text {
		color: var(--gray-300);
	}
</style>

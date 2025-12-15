<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children?: Snippet;
	}

	let { title, children }: Props = $props();
</script>

<div class="summary">
	<h4>{title}</h4>
	{@render children?.()}
</div>

<style>
	.summary {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--gray-50);
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
	}

	:global([data-theme='dark']) .summary {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h4 {
		color: var(--gray-100);
	}

	.summary :global(.summary-item) {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) 0;
	}

	.summary :global(.summary-item span) {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .summary :global(.summary-item span) {
		color: var(--gray-400);
	}

	.summary :global(.summary-item strong) {
		font-size: var(--text-sm);
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .summary :global(.summary-item strong) {
		color: var(--gray-100);
	}

	.summary :global(.balance-count) {
		color: #10b981;
	}
</style>

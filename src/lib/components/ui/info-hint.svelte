<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		icon?: string;
		children: Snippet;
	}

	let { icon = '💡', children }: Props = $props();
</script>

<div class="info-hint">
	{#if icon}
		<span class="hint-icon">{icon}</span>
	{/if}
	<span class="hint-content">
		{@render children()}
	</span>
</div>

<style>
	.info-hint {
		display: flex;
		align-items: flex-start;
		gap: var(--space-1-5);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		padding: var(--space-2);
		background: var(--color-muted);
		border-radius: var(--radius-sm);
		border-left: 2px solid var(--color-primary);
	}

	.hint-icon {
		flex-shrink: 0;
		line-height: 1.4;
	}

	.hint-content {
		line-height: 1.5;
	}

	.hint-content :global(a) {
		color: var(--color-primary);
		font-weight: var(--font-medium);
		text-decoration: none;
		transition: opacity 0.2s ease;
	}

	.hint-content :global(a:hover) {
		opacity: 0.8;
		text-decoration: underline;
	}
</style>

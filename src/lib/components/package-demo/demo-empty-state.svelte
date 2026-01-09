<script lang="ts">
	/**
	 * Demo Empty State
	 * Displays an empty state with an icon and message for demo sections.
	 */
	import type { Component } from 'svelte';

	interface Props {
		icon: Component;
		message: string;
		iconSize?: number;
	}

	let { icon: Icon, message, iconSize = 48 }: Props = $props();
</script>

<div class="empty-state">
	<Icon size={iconSize} />
	<p>{message}</p>
</div>

<style>
	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		min-height: 200px;
		color: var(--color-muted-foreground);
		text-align: center;
	}

	.empty-state :global(svg) {
		opacity: 0.3;
		margin-bottom: var(--space-4);
	}

	.empty-state p {
		font-size: var(--text-sm);
		margin: 0;
	}
</style>

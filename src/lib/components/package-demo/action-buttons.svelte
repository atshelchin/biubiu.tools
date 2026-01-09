<script lang="ts">
	/**
	 * Action Buttons
	 * A wrapper for a group of action buttons.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string;
		children: Snippet;
	}

	let { class: className = '', children }: Props = $props();
</script>

<div class="actions {className}">
	{@render children()}
</div>

<style>
	.actions {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}
</style>

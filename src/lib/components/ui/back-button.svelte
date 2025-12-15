<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		onclick: () => void;
		children: Snippet;
	}

	let { onclick, children }: Props = $props();
</script>

<button class="back-button" {onclick}>
	{@render children()}
</button>

<style>
	.back-button {
		margin-top: var(--space-4);
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.back-button:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}
</style>

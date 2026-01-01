<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="docs-wrapper">
	{@render children()}
</div>

<style>
	.docs-wrapper {
		min-height: 100vh;
		background: var(--color-background);
	}
</style>

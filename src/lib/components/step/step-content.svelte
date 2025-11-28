<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="step-content">
	{@render children()}
</div>

<style>
	.step-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}
</style>

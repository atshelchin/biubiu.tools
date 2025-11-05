<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children } = $props<{ class?: string; children: Snippet }>();
</script>

<div class="card-description {className}">
	{@render children()}
</div>

<style>
	.card-description {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
	}
</style>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children } = $props<{ class?: string; children: Snippet }>();
</script>

<div class="card-title {className}">
	{@render children()}
</div>

<style>
	.card-title {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-2);
	}
</style>

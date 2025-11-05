<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children } = $props<{ class?: string; children: Snippet }>();
</script>

<div class="card-header {className}">
	{@render children()}
</div>

<style>
	.card-header {
		padding-bottom: var(--spacing-4);
	}
</style>

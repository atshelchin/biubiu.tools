<script lang="ts">
	import type { Snippet } from 'svelte';

	let { class: className = '', children } = $props<{ class?: string; children: Snippet }>();
</script>

<div class="card-content {className}">
	{@render children()}
</div>

<style>
	.card-content {
		padding-top: var(--spacing-2);
	}
</style>

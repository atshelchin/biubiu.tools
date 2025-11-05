<script lang="ts">
	import type { Snippet } from 'svelte';
	let { children } = $props<{ children: Snippet }>();
</script>

<div class="apps-container">
	{@render children()}
</div>

<style>
	.apps-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-5);
	}

	@media (max-width: 768px) {
		.apps-container {
			padding: var(--space-3);
		}
	}
</style>

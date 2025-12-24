<script lang="ts">
	import type { Snippet } from 'svelte';
	import { useI18n } from '@shelchin/i18n';
	let { children } = $props<{ children: Snippet }>();

	const i18n = useI18n();

	$effect(() => {
		console.log(890,i18n.getLoadedNamespaces());
	});
</script>

<div class="apps-container">
	{@render children()}
</div>

<style>
	.apps-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: var(--space-5);
	}

	@media (max-width: 768px) {
		.apps-container {
			padding: var(--space-3);
		}
	}
</style>

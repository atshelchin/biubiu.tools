<script lang="ts">
	import AppsHeader from '@/lib/components/ui/apps-header.svelte';
	import type { LayoutData } from './$types.js';

	let { children, data } = $props<{ children: import('svelte').Snippet; data: LayoutData }>();
	console.log({ data });
</script>

<div class="apps-container">
	<AppsHeader />
	{@render children()}
</div>

<style>
	.apps-container {
		max-width: 900px;
		margin: 0 auto;
		padding: 20px;
	}
	@media (max-width: 768px) {
		.apps-container {
			max-width: 100%;
			padding: 10px;
		}
	}
</style>

<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	let { class: className = '', children } = $props<{ class?: string; children: Snippet }>();

	const open = getContext<boolean>('collapsible-open');
</script>

{#if open}
	<div class="collapsible-content {className}" transition:slide={{ duration: 300 }}>
		{@render children()}
	</div>
{/if}

<style>
	.collapsible-content {
		overflow: hidden;
	}
</style>

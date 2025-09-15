<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';

	let { class: className = '' } = $props<{ class?: string }>();

	const open = getContext<boolean>('collapsible-open');
</script>

{#if open}
	<div class="collapsible-content {className}" transition:slide={{ duration: 300 }}>
		<slot />
	</div>
{/if}

<style>
	.collapsible-content {
		overflow: hidden;
	}
</style>

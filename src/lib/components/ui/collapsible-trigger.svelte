<script lang="ts">
	import { getContext } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type $$Props = HTMLButtonAttributes & {
		class?: string;
	};

	let { class: className = '', ...restProps }: $$Props = $props();

	const toggle = getContext<() => void>('collapsible-toggle');
</script>

<button class="collapsible-trigger {className}" onclick={toggle} type="button" {...restProps}>
	<slot />
</button>

<style>
	.collapsible-trigger {
		background: transparent;
		border: none;
		cursor: pointer;
		width: 100%;
		text-align: left;
	}
</style>

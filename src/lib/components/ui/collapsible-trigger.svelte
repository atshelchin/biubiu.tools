<script lang="ts">
	import { getContext } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	type $$Props = HTMLButtonAttributes & {
		class?: string;
		children: Snippet;
	};

	let { class: className = '', children, ...restProps }: $$Props = $props();

	const toggle = getContext<() => void>('collapsible-toggle');
</script>

<button class="collapsible-trigger {className}" onclick={toggle} type="button" {...restProps}>
	{@render children()}
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

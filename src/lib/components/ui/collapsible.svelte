<script lang="ts">
	import { setContext } from 'svelte';
	import type { Snippet } from 'svelte';

	type $$Props = {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		class?: string;
		children: Snippet;
	};

	let {
		open = $bindable(false),
		onOpenChange,
		class: className = '',
		children
	}: $$Props = $props();

	function toggle() {
		open = !open;
		onOpenChange?.(open);
	}

	setContext('collapsible-toggle', toggle);
	setContext('collapsible-open', open);
</script>

<div class="collapsible {className}" data-open={open}>
	{@render children()}
</div>

<style>
	.collapsible {
		position: relative;
	}
</style>

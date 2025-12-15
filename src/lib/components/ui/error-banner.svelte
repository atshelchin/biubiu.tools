<script lang="ts">
	import { slide } from 'svelte/transition';
	import { AlertCircle } from '@lucide/svelte';

	interface Props {
		message: string;
		iconSize?: number;
	}

	let { message, iconSize = 20 }: Props = $props();
</script>

<div class="error-banner" transition:slide>
	<AlertCircle size={iconSize} />
	<span>{message}</span>
</div>

<style>
	.error-banner {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		border-radius: var(--radius-sm);
		color: hsl(0, 80%, 40%);
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) .error-banner {
		background: hsla(0, 60%, 15%, 1);
		border-color: hsl(0, 70%, 45%);
		color: hsl(0, 80%, 70%);
	}
</style>

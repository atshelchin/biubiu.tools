<script lang="ts">
	/**
	 * Input Group
	 * A labeled input field for demo controls.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		label: string;
		id: string;
		children: Snippet;
	}

	let { label, id, children }: Props = $props();
</script>

<div class="input-group">
	<label for={id}>{label}</label>
	{@render children()}
</div>

<style>
	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.input-group label {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.input-group :global(input),
	.input-group :global(select) {
		padding: var(--space-3) var(--space-4);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-base);
		transition: border-color 0.2s;
	}

	.input-group :global(input:focus),
	.input-group :global(select:focus) {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb, 59, 130, 246), 0.1);
	}
</style>

<script lang="ts">
	/**
	 * Demo Content
	 * Two-column layout for demo panel (controls) and result (output).
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		fullWidth?: boolean;
		panel?: Snippet;
		result?: Snippet;
		children?: Snippet;
	}

	let { fullWidth = false, panel, result, children }: Props = $props();
</script>

<div class="demo-content" class:full-width={fullWidth}>
	{#if panel}
		<div class="demo-panel">
			{@render panel()}
		</div>
	{/if}

	{#if result}
		<div class="demo-result">
			{@render result()}
		</div>
	{/if}

	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.demo-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-6);
		margin-bottom: var(--space-6);
	}

	.demo-content.full-width {
		grid-template-columns: 1fr;
	}

	.demo-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.demo-result {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		min-height: 300px;
	}

	@media (max-width: 1024px) {
		.demo-content {
			grid-template-columns: 1fr;
		}
	}
</style>

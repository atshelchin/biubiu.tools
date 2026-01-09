<script lang="ts">
	/**
	 * Demo Section
	 * A section wrapper for individual demos within a package demo page.
	 */
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		class?: string;
		children: Snippet;
	}

	let { title, description, class: className = '', children }: Props = $props();
</script>

<section class="demo-section {className}">
	<div class="demo-header">
		<h2>{title}</h2>
		{#if description}
			<p>{description}</p>
		{/if}
	</div>

	{@render children()}
</section>

<style>
	.demo-section {
		margin-bottom: var(--space-16);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: var(--space-8);
		box-shadow: var(--shadow-lg);
	}

	.demo-header {
		margin-bottom: var(--space-6);
	}

	.demo-header h2 {
		font-size: var(--text-2xl);
		font-weight: 700;
		color: var(--color-foreground);
		margin-bottom: var(--space-2);
	}

	.demo-header p {
		color: var(--color-muted-foreground);
		font-size: var(--text-base);
	}

	@media (max-width: 768px) {
		.demo-section {
			padding: var(--space-4);
		}
	}
</style>

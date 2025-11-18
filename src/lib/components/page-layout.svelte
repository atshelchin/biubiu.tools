<script lang="ts">
	import type { Snippet } from 'svelte';
	import AppsHeader from './ui/apps-header.svelte';

	interface Props {
		toolbar?: Snippet;
		sidebar?: Snippet;
		footer?: Snippet;
		children: Snippet;
	}

	let { toolbar, sidebar, footer, children }: Props = $props();
</script>

<div class="page-layout">
	<AppsHeader />

	{#if toolbar}
		{@render toolbar()}
	{/if}

	<div class="layout-grid" class:full-width={!sidebar}>
		<main class="main-content">
			{@render children()}
			{#if footer}
				<footer class="footer-section">
					{@render footer()}
				</footer>
			{/if}
		</main>

		{#if sidebar}
			<aside class="sidebar-section">
				{@render sidebar()}
			</aside>
		{/if}
	</div>
</div>

<style>
	.page-layout {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		/* padding: var(--space-4); */
		min-height: 100vh;
	}

	.layout-grid {
		display: grid;
		grid-template-columns: 1fr 320px;
		gap: var(--space-5);
		flex: 1;
	}

	.layout-grid.full-width {
		grid-template-columns: 1fr;
	}

	.sidebar-section {
		background: var(--color-card);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		height: fit-content;
		position: sticky;
		top: var(--space-4);
		max-height: calc(100vh - var(--space-8));
		overflow-y: auto;
		z-index: 2;
	}

	.main-content {
		background: var(--color-card);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.footer-section {
		background: var(--color-card);
		/* padding: var(--space-4) var(--space-4); */
		/* border-radius: var(--radius-lg); */
		/* border: 1px solid var(--color-border); */
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 16px;
	}

	@media (max-width: 768px) {
		.layout-grid {
			grid-template-columns: 1fr;
		}

		.footer-section {
			flex-direction: column;
			gap: var(--space-3);
		}
	}
</style>

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
		<div style="margin-bottom:32px;z-index:3">
			{@render toolbar()}
		</div>
	{/if}

	<div class="layout-grid" class:full-width={!sidebar}>
		<main class="content-section">
			<div class="main-content">
				{@render children()}
			</div>
		</main>

		{#if sidebar}
			<aside class="sidebar-section">
				{@render sidebar()}
			</aside>
		{/if}

		<div class="content-section">
			{#if footer}
				<footer class="footer-section">
					{@render footer()}
				</footer>
			{/if}
		</div>
	</div>
</div>

<style>
	.page-layout {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
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
		height: fit-content;
		position: sticky;
		top: var(--space-4);
		max-height: calc(100vh - var(--space-8));
		overflow-y: auto;
		z-index: 2;
	}
	.content-section {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.main-content {
		background: var(--color-card);
		padding: var(--space-4);
		padding-top: var(--space-6);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.footer-section {
		background: transparent;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		margin-top: var(--space-8);
		width: 100%;
	}

	@media (max-width: 768px) {
		.layout-grid {
			grid-template-columns: 1fr;
		}

		.sidebar-section {
			position: static;
			max-height: none;
		}

		.footer-section {
			flex-direction: column;
			gap: var(--space-3);
			margin-top: var(--space-6);
		}
	}
</style>

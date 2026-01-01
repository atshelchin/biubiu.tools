<script lang="ts">
	import type { Snippet } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { page } from '$app/stores';
	import { Book, ChevronDown, ChevronRight, Menu, X } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import type { DocNavigation } from '@/features/docs/types';
	import { docsConfig } from '@/features/docs/config';

	interface Props {
		data: {
			version: string;
			navigation: DocNavigation;
		};
		children: Snippet;
	}

	let { data, children }: Props = $props();
	const i18n = useI18n();

	let sidebarOpen = $state(false);
	let collapsedCategories = new SvelteSet<string>();

	function toggleCategory(slug: string) {
		if (collapsedCategories.has(slug)) {
			collapsedCategories.delete(slug);
		} else {
			collapsedCategories.add(slug);
		}
	}

	function isActiveDoc(path: string): boolean {
		return $page.url.pathname === `/docs${path}`;
	}

	function isActiveCategory(categorySlug: string): boolean {
		return $page.url.pathname.includes(`/${data.version}/${categorySlug}/`);
	}
</script>

<div class="docs-layout">
	<!-- Mobile header -->
	<header class="docs-mobile-header">
		<button
			class="menu-toggle"
			onclick={() => (sidebarOpen = !sidebarOpen)}
			aria-label="Toggle menu"
		>
			{#if sidebarOpen}
				<X size={24} />
			{:else}
				<Menu size={24} />
			{/if}
		</button>
		<span class="mobile-title">
			<Book size={20} />
			{i18n.t('common.docs.title')}
		</span>
	</header>

	<!-- Sidebar -->
	<aside class="docs-sidebar" class:open={sidebarOpen}>
		<div class="sidebar-header">
			<a href="/docs" class="sidebar-brand">
				<Book size={24} />
				<span>{i18n.t('common.docs.title')}</span>
			</a>

			<!-- Version selector -->
			{#if docsConfig.versions.length > 1}
				<select class="version-select" value={data.version}>
					{#each docsConfig.versions as version (version.id)}
						<option value={version.id}>{version.label}</option>
					{/each}
				</select>
			{:else}
				<span class="version-badge">{docsConfig.versions[0]?.label}</span>
			{/if}
		</div>

		<nav class="sidebar-nav">
			{#each data.navigation.categories as category (category.slug)}
				<div class="nav-category" class:active={isActiveCategory(category.slug)}>
					<button
						class="category-header"
						onclick={() => toggleCategory(category.slug)}
						aria-expanded={!collapsedCategories.has(category.slug)}
					>
						<span class="category-label">{category.label}</span>
						{#if collapsedCategories.has(category.slug)}
							<ChevronRight size={16} />
						{:else}
							<ChevronDown size={16} />
						{/if}
					</button>

					{#if !collapsedCategories.has(category.slug)}
						<ul class="nav-items">
							{#each category.items as item (item.slug)}
								<li>
									<a
										href="/docs{item.path}"
										class="nav-link"
										class:active={isActiveDoc(item.path)}
										onclick={() => (sidebarOpen = false)}
									>
										{item.title}
										{#if item.draft}
											<span class="draft-badge">Draft</span>
										{/if}
									</a>
								</li>
							{/each}
						</ul>
					{/if}
				</div>
			{/each}
		</nav>

		<!-- <div class="sidebar-footer">
			<a href="/" class="back-link">← {i18n.t('common.docs.back_to_home')}</a>
		</div> -->
	</aside>

	<!-- Backdrop for mobile -->
	{#if sidebarOpen}
		<button
			class="sidebar-backdrop"
			onclick={() => (sidebarOpen = false)}
			aria-label="Close sidebar"
		></button>
	{/if}

	<!-- Main content -->
	<main class="docs-main">
		{@render children()}
	</main>
</div>

<style>
	.docs-layout {
		display: flex;
		min-height: 100vh;
		border-bottom: 1px solid var(--color-border);
	}

	/* Mobile header */
	.docs-mobile-header {
		display: none;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3.5rem;
		background: var(--color-background);
		border-bottom: 1px solid var(--color-border);
		padding: 0 var(--space-4);
		align-items: center;
		gap: var(--space-3);
		z-index: 40;
	}

	.menu-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		/* width: 2.5rem; */
		/* height: 2.5rem; */
		background: none;
		border: none;
		color: var(--color-foreground);
		cursor: pointer;
		border-radius: var(--radius-md);
	}

	.menu-toggle:hover {
		background: var(--color-muted);
	}

	.mobile-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
	}

	/* Sidebar */
	.docs-sidebar {
		position: sticky;
		top: 0;
		width: 280px;
		min-width: 280px;
		height: 100vh;
		background: var(--color-background);
		border-right: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		z-index: 50;
		overflow-y: auto;
	}

	.sidebar-header {
		padding: var(--space-4) var(--space-5);
		border-bottom: 1px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
	}

	.sidebar-brand {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-weight: var(--font-bold);
		font-size: var(--text-lg);
		color: var(--color-foreground);
		text-decoration: none;
	}

	.sidebar-brand:hover {
		color: var(--color-primary);
	}

	.version-select {
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		background: var(--color-muted);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-foreground);
		cursor: pointer;
	}

	.version-badge {
		padding: var(--space-1) var(--space-2);
		font-size: var(--text-xs);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		color: var(--color-muted-foreground);
	}

	.sidebar-nav {
		flex: 1;
		padding: var(--space-4) 0;
		overflow-y: auto;
	}

	.nav-category {
		margin-bottom: var(--space-2);
	}

	.category-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: var(--space-2) var(--space-5);
		background: none;
		border: none;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		cursor: pointer;
		transition: color 0.2s;
	}

	.category-header:hover {
		color: var(--color-foreground);
	}

	.nav-category.active .category-header {
		color: var(--color-primary);
	}

	.nav-items {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.nav-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-5);
		padding-left: var(--space-7);
		color: var(--color-muted-foreground);
		text-decoration: none;
		font-size: var(--text-sm);
		transition: all 0.2s;
		border-left: 2px solid transparent;
	}

	.nav-link:hover {
		color: var(--color-foreground);
		background: var(--color-muted);
	}

	.nav-link.active {
		color: var(--color-primary);
		background: hsla(var(--brand-hue), 80%, 50%, 0.1);
		border-left-color: var(--color-primary);
		font-weight: var(--font-medium);
	}

	.draft-badge {
		font-size: var(--text-xs);
		padding: 0 var(--space-1);
		background: var(--color-warning);
		color: var(--color-warning-foreground);
		border-radius: var(--radius-sm);
	}

	.sidebar-footer {
		padding: var(--space-4) var(--space-5);
		/* border-top: 1px solid var(--color-border); */
	}

	.back-link {
		color: var(--color-muted-foreground);
		text-decoration: none;
		font-size: var(--text-sm);
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--color-primary);
	}

	.sidebar-backdrop {
		display: none;
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 45;
		border: none;
		cursor: pointer;
	}

	/* Main content */
	.docs-main {
		flex: 1;
		min-width: 0;
	}

	/* Mobile styles */
	@media (max-width: 1024px) {
		.docs-mobile-header {
			display: flex;
		}

		.docs-sidebar {
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			transform: translateX(-100%);
			transition: transform 0.3s ease;
		}

		.docs-sidebar.open {
			transform: translateX(0);
		}

		.sidebar-backdrop {
			display: block;
		}

		.docs-main {
			padding-top: 3.5rem;
		}
	}

	/* Dark mode */
	:global([data-theme='dark']) .docs-sidebar {
		background: var(--color-background);
	}

	:global([data-theme='dark']) .sidebar-backdrop {
		background: rgba(0, 0, 0, 0.7);
	}

	/* Hide global top toolbar on docs pages */
	:global(.top-toolbar) {
		display: none !important;
	}
</style>

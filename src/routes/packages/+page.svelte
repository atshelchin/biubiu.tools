<script lang="ts">
	/**
	 * Packages Index Page
	 * Lists all available package demos
	 */
	import { base } from '$app/paths';
	import {
		Package,
		FileText,
		Table2,
		GripVertical,
		ListTodo,
		CreditCard
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	interface PackageInfo {
		name: string;
		title: string;
		description: string;
		path: string;
		icon: Component;
		tags: string[];
		npmPackage: string;
	}

	const packages: PackageInfo[] = [
		{
			name: 'formstate',
			title: 'FormState',
			description:
				'Type-safe form state management for Svelte 5 with built-in validators, Zod integration, and headless components',
			path: `${base}/packages/formstate`,
			icon: FileText,
			tags: ['Forms', 'Validation', 'TypeScript', 'Zod'],
			npmPackage: '@shelchin/formstate'
		},
		{
			name: 'data-table',
			title: 'Data Table',
			description:
				'Powerful data table component with sorting, pagination, custom cells, and server-side data support',
			path: `${base}/packages/data-table`,
			icon: Table2,
			tags: ['Table', 'Sorting', 'Pagination', 'Server-side'],
			npmPackage: '@shelchin/data-table'
		},
		{
			name: 'drag-sortable',
			title: 'Drag Sortable',
			description:
				'Smooth drag-and-drop sorting with ghost elements, touch support, and auto-scroll',
			path: `${base}/packages/drag-sortable`,
			icon: GripVertical,
			tags: ['Drag & Drop', 'Sorting', 'Touch', 'Animation'],
			npmPackage: '@shelchin/drag-sortable'
		},
		{
			name: 'task-manager',
			title: 'Task Manager',
			description:
				'Tree-structured task management with persistence, pause/resume, Merkle tree validation, and event-driven architecture',
			path: `${base}/packages/task-manager`,
			icon: ListTodo,
			tags: ['Tasks', 'Tree Structure', 'Persistence', 'Events'],
			npmPackage: '@shelchin/task-manager'
		},
		{
			name: 'paywall',
			title: 'Paywall',
			description:
				'Flexible paywall system with membership tiers, usage quotas, caching, and self-hosted support',
			path: `${base}/packages/paywall`,
			icon: CreditCard,
			tags: ['Membership', 'Quota', 'Security', 'Self-hosted'],
			npmPackage: '@shelchin/paywall'
		}
	];
</script>

<svelte:head>
	<title>Packages | BiuBiu.tools</title>
	<meta name="description" content="Explore our collection of Svelte 5 packages and components" />
</svelte:head>

<div class="packages-page">
	<header class="page-header">
		<div class="header-icon">
			<Package size={48} strokeWidth={1.5} />
		</div>
		<h1>Packages</h1>
		<p class="subtitle">
			A collection of high-quality Svelte 5 packages built with TypeScript and modern best
			practices
		</p>
	</header>

	<section class="packages-section">
		<div class="packages-grid">
			{#each packages as pkg (pkg.name)}
				<a href={pkg.path} class="package-card">
					<div class="package-header">
						<div class="package-icon">
							<pkg.icon size={28} strokeWidth={1.5} />
						</div>
						<div class="package-info">
							<h3>{pkg.title}</h3>
							<code class="npm-package">{pkg.npmPackage}</code>
						</div>
					</div>
					<p class="package-description">{pkg.description}</p>
					<div class="package-tags">
						{#each pkg.tags as tag (tag)}
							<span class="tag">{tag}</span>
						{/each}
					</div>
					<div class="package-cta">View Demos &rarr;</div>
				</a>
			{/each}
		</div>
	</section>

	<section class="quick-install">
		<h2>Quick Install</h2>
		<p class="install-intro">All packages are available on npm and can be installed with:</p>
		<div class="code-block">
			<pre><code
					>{`# Install with npm
npm install @shelchin/formstate @shelchin/data-table @shelchin/drag-sortable

# Or with bun
bun add @shelchin/formstate @shelchin/data-table @shelchin/drag-sortable`}</code
				></pre>
		</div>
	</section>
</div>

<style>
	.packages-page {
		max-width: 80rem;
		margin: 0 auto;
		padding: var(--space-12) var(--space-6);
	}

	.page-header {
		text-align: center;
		margin-bottom: var(--space-16);
	}

	.header-icon {
		display: flex;
		justify-content: center;
		margin-bottom: var(--space-6);
		color: var(--color-primary);
	}

	.page-header h1 {
		font-size: var(--text-5xl);
		font-weight: var(--font-extrabold);
		margin-bottom: var(--space-4);
		background: linear-gradient(135deg, var(--brand-500) 0%, var(--brand-700) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.subtitle {
		font-size: var(--text-xl);
		color: var(--color-muted-foreground);
		max-width: 600px;
		margin: 0 auto;
	}

	.packages-section {
		margin-bottom: var(--space-16);
	}

	.packages-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
		gap: var(--space-6);
	}

	.package-card {
		display: flex;
		flex-direction: column;
		padding: var(--space-7);
		background: var(--color-card);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-xl);
		text-decoration: none;
		color: inherit;
		transition: all 0.2s;
	}

	.package-card:hover {
		border-color: var(--color-primary);
		box-shadow: var(--shadow-lg);
		transform: translateY(-3px);
	}

	.package-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-4);
		margin-bottom: var(--space-4);
	}

	.package-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 56px;
		height: 56px;
		background: var(--color-secondary);
		border-radius: var(--radius-lg);
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.package-info {
		flex: 1;
		min-width: 0;
	}

	.package-card h3 {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-1-5) 0;
		color: var(--color-heading-1);
	}

	.npm-package {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		background: var(--color-muted);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		font-family: var(--font-family-mono);
	}

	.package-description {
		color: var(--color-description-1);
		margin-bottom: var(--space-4);
		line-height: 1.6;
		flex: 1;
	}

	.package-tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.tag {
		padding: var(--space-1) var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-full);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		font-weight: var(--font-medium);
	}

	.package-cta {
		color: var(--color-primary);
		font-weight: var(--font-semibold);
		font-size: var(--text-base);
	}

	.quick-install {
		text-align: center;
	}

	.quick-install h2 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-4);
		color: var(--color-heading-1);
	}

	.install-intro {
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-6);
	}

	.code-block {
		background: var(--gray-900);
		border-radius: var(--radius-lg);
		padding: var(--space-6);
		overflow-x: auto;
		text-align: left;
		max-width: 700px;
		margin: 0 auto;
	}

	.code-block pre {
		margin: 0;
	}

	.code-block code {
		color: var(--gray-100);
		font-family: var(--font-family-mono);
		font-size: var(--text-sm);
		line-height: 1.7;
	}

	@media (max-width: 768px) {
		.page-header h1 {
			font-size: var(--text-3xl);
		}

		.subtitle {
			font-size: var(--text-base);
		}

		.packages-grid {
			grid-template-columns: 1fr;
		}

		.package-header {
			flex-direction: column;
			align-items: flex-start;
		}
	}

	/* Dark mode support using data-theme attribute */
	:global([data-theme='dark']) .package-card {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
	}

	:global([data-theme='dark']) .package-card:hover {
		border-color: var(--color-primary);
		box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
	}

	:global([data-theme='dark']) .package-icon {
		background: var(--color-panel-3);
	}

	:global([data-theme='dark']) .npm-package {
		background: var(--color-panel-3);
	}

	:global([data-theme='dark']) .tag {
		background: var(--color-panel-3);
	}

	:global([data-theme='dark']) .code-block {
		background: var(--color-panel-1);
	}
</style>

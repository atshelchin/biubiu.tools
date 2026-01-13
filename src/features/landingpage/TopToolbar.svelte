<script lang="ts">
	import type { I18nInstance } from '@shelchin/i18n';
	import { Layers, CircleHelp } from '@lucide/svelte';
	import GitHubStarButton from '$lib/components/widgets/github-star-button.svelte';
	import { localizeHref } from '$lib/utils/localized-url';

	interface Props {
		i18n: I18nInstance;
	}

	let { i18n }: Props = $props();

	function scrollToSection(e: MouseEvent, sectionId: string) {
		e.preventDefault();
		const section = document.getElementById(sectionId);
		if (section) {
			section.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<div class="top-toolbar">
	<div class="toolbar-container">
		<a href={localizeHref('/')} class="logo-section">
			<img src="/logo.svg" alt="BiuBiu Tools Logo" class="logo" />
			<span class="site-title">BiuBiu Tools</span>
		</a>

		<!-- Right-aligned controls -->
		<div class="toolbar-right">
			<nav class="nav-links" aria-label="Quick navigation">
				<a href="#tools" class="nav-link" onclick={(e) => scrollToSection(e, 'tools')}>
					<Layers class="nav-icon" />
					<span>{i18n.t('common.nav.features')}</span>
				</a>
				<a href="#faqs" class="nav-link" onclick={(e) => scrollToSection(e, 'faqs')}>
					<CircleHelp class="nav-icon" />
					<span>{i18n.t('common.nav.help')}</span>
				</a>
			</nav>
			<GitHubStarButton />
		</div>
	</div>
</div>

<style>
	.top-toolbar {
		/* position: fixed; */
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: var(--color-background);
		border-bottom: 1px solid hsla(var(--brand-hue), 10%, 50%, 0.1);
		transition: all 0.3s ease;
	}

	:global([data-theme='dark']) .top-toolbar {
		background: rgba(0, 0, 0, 0.5);
		border-bottom-color: hsla(var(--brand-hue), 10%, 50%, 0.15);
	}

	:global(.light) .top-toolbar {
		background: rgba(255, 255, 255, 0.8);
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
	}

	.toolbar-container {
		/* max-width: 80rem; */
		margin: 0 auto;
		padding: var(--space-4) var(--space-5);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.logo-section {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		text-decoration: none;
		color: var(--color-text);
		transition: opacity 0.2s ease;
	}

	.logo-section:hover {
		opacity: 0.8;
	}

	.logo {
		width: 2rem;
		height: 2rem;
	}

	.site-title {
		font-size: var(--font-size-lg);
		font-weight: 600;
		color: var(--color-text);
		white-space: nowrap;
	}

	/* Navigation links */
	.nav-links {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.nav-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.nav-link:hover {
		color: var(--color-foreground);
		background: var(--color-panel-2);
	}

	:global(.nav-icon) {
		width: 1rem;
		height: 1rem;
	}

	.toolbar-right {
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	/* Add padding to body when toolbar is fixed */
	:global(body) {
		padding-top: 0;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.toolbar-container {
			padding: var(--space-3) var(--space-4);
		}

		.toolbar-right {
			gap: var(--space-2);
		}

		.logo {
			width: 1.75rem;
			height: 1.75rem;
		}

		/* Hide nav link text on mobile, show only icons */
		.nav-link span {
			display: none;
		}

		.nav-link {
			padding: var(--space-2);
		}
	}

	/* Smooth scroll behavior for the page */
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: 60px; /* Account for fixed toolbar */
	}
</style>

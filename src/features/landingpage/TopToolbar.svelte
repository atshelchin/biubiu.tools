<script lang="ts">
	import LangToggle from '$lib/components/widgets/lang-toggle.svelte';
	import ThemeToggle from '$lib/components/widgets/theme-toggle.svelte';
</script>

<div class="top-toolbar">
	<div class="toolbar-container">
		<a href="/" class="logo-section">
			<img src="/logo.svg" alt="BiuBiu Tools Logo" class="logo" />
			<span class="site-title">BiuBiu Tools</span>
		</a>
		<div class="toolbar-controls">
			<LangToggle />
			<ThemeToggle />
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
		max-width: 80rem;
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

	.toolbar-controls {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: var(--space-3);
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

		.toolbar-controls {
			gap: var(--space-2);
		}

		.logo {
			width: 1.75rem;
			height: 1.75rem;
		}
	}

	/* Smooth scroll behavior for the page */
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: 60px; /* Account for fixed toolbar */
	}
</style>

<script lang="ts">
	import LangToggle from '$lib/components/widgets/lang-toggle.svelte';
	import ThemeToggle from '$lib/components/widgets/theme-toggle.svelte';
</script>

<div class="top-toolbar">
	<div class="toolbar-container">
		<div class="toolbar-controls">
			<LangToggle />
			<ThemeToggle />
		</div>
	</div>
</div>

<style>
	.top-toolbar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: var(--color-background);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
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
		padding: var(--space-4) var(--space-6);
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
	}

	/* Smooth scroll behavior for the page */
	:global(html) {
		scroll-behavior: smooth;
		scroll-padding-top: 60px; /* Account for fixed toolbar */
	}
</style>

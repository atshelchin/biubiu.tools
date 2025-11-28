<script lang="ts">
	import { onMount } from 'svelte';
	import { useTheme } from '$lib/stores/theme.svelte';
	import Socials from '$lib/components/ui/socials.svelte';
	import LangToggle from '$lib/components/widgets/lang-toggle.svelte';
	import ThemeToggle from '$lib/components/widgets/theme-toggle.svelte';

	const currentYear = new Date().getFullYear();
	const theme = useTheme();

	// Listen to system theme changes
	onMount(() => {
		if (typeof window === 'undefined') return;

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			// Only apply system theme if user hasn't manually set preference
			const hasUserPreference = localStorage.getItem('theme-user-preference') === 'true';

			if (!hasUserPreference) {
				const systemTheme = e.matches ? 'dark' : 'light';
				theme.setTheme(systemTheme);
			}
		};

		// Add listener for system theme changes
		mediaQuery.addEventListener('change', handleSystemThemeChange);

		// Cleanup on component destroy
		return () => {
			mediaQuery.removeEventListener('change', handleSystemThemeChange);
		};
	});
</script>

<footer class="footer">
	<div class="footer-container">
		<!-- Top row: Brand and Tagline -->
		<div class="footer-top">
			<div class="brand-section">
				<div class="brand-group">
					<img src="/logo.svg" alt="BiuBiu" class="logo" />
					<span class="brand-name">biubiu.tools</span>
				</div>
				<p class="tagline">Powerful batch operations for Ethereum ecosystem</p>
			</div>

			<!-- Socials -->
			<div class="socials-section">
				<Socials />
			</div>
		</div>

		<!-- Bottom row: Footer info and Controls -->
		<div class="footer-bottom">
			<div class="footer-info">
				<span class="copyright">© {currentYear} biubiu.tools</span>
				<span class="separator">·</span>
				<span class="tech">Built with Svelte</span>
				<span class="separator">·</span>
				<span class="tech">Powered by Ethereum</span>
			</div>

			<div class="controls-group">
				<LangToggle />
				<ThemeToggle />
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--color-background);
		/* border-top: 1px solid hsla(var(--brand-hue), 10%, 50%, 0.1); */
		margin-top: auto;
		/* padding: var(--space-12) 0 var(--space-8); */
		max-width: 1200px;
		margin: 0 auto;
		padding-top: var(--space-12);
		padding-bottom: var(--space-5);
		/* padding: var(--space-5); */
	}

	.footer-container {
		max-width: 80rem;
		margin: 0 auto;
		padding: 0 var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
	}

	/* Top row - horizontal layout */
	.footer-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-8);
	}

	.brand-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.brand-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.logo {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-md);
		transition: transform 0.3s ease;
	}

	.brand-group:hover .logo {
		transform: scale(1.05);
	}

	.brand-name {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
	}

	.tagline {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		opacity: 0.7;
		margin: 0;
	}

	.socials-section {
		display: flex;
	}

	/* Bottom row - horizontal layout */
	.footer-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-6);
		padding-top: var(--space-6);
		border-top: 1px solid hsla(var(--brand-hue), 10%, 50%, 0.1);
	}

	.footer-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		opacity: 0.6;
	}

	.copyright {
		color: var(--color-muted-foreground);
	}

	.separator {
		opacity: 0.3;
	}

	.tech {
		transition: color 0.2s ease;
	}

	.tech:hover {
		color: var(--color-primary);
		cursor: default;
	}

	.controls-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	/* Dark mode */
	:global([data-theme='dark']) .footer {
		background: var(--color-background);
		border-top-color: hsla(var(--brand-hue), 10%, 50%, 0.15);
	}

	:global([data-theme='dark']) .footer-bottom {
		border-top-color: hsla(var(--brand-hue), 10%, 50%, 0.15);
	}

	/* Tablet */
	@media (max-width: 768px) {
		.footer-top {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-6);
		}

		.footer-bottom {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-4);
		}

		.brand-section {
			width: 100%;
		}

		.socials-section {
			width: 100%;
		}
	}

	/* Mobile */
	@media (max-width: 640px) {
		.footer {
			padding: var(--space-10) 0 var(--space-6);
		}

		.footer-container {
			gap: var(--space-6);
		}

		.footer-top {
			gap: var(--space-5);
		}

		.footer-info {
			flex-wrap: wrap;
			line-height: 1.8;
		}

		.separator:last-of-type {
			display: none;
		}
	}
</style>

<script lang="ts">
	import Socials from '$lib/components/ui/socials.svelte';
	import LangToggle from '$lib/components/widgets/lang-toggle.svelte';
	import ThemeToggle from '$lib/components/widgets/theme-toggle.svelte';

	const currentYear = new Date().getFullYear();
</script>

<footer class="footer">
	<div class="footer-container">
		<!-- Single centered column layout -->
		<div class="footer-content">
			<!-- Brand -->
			<div class="brand-group">
				<img src="/logo.svg" alt="BiuBiu" class="logo" />
				<span class="brand-name">biubiu.tools</span>
			</div>

			<!-- Tagline -->
			<p class="tagline">Powerful batch operations for Ethereum ecosystem</p>

			<!-- Socials -->
			<div class="socials-group">
				<Socials />
			</div>

			<!-- Controls -->
			<div class="controls-group">
				<LangToggle />
				<ThemeToggle />
			</div>

			<!-- Footer info -->
			<div class="footer-info">
				<span class="copyright">© {currentYear} biubiu.tools</span>
				<span class="separator">·</span>
				<span class="tech">Built with Svelte</span>
				<span class="separator">·</span>
				<span class="tech">Powered by Ethereum</span>
			</div>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: var(--color-background);
		border-top: 1px solid hsla(var(--brand-hue), 10%, 50%, 0.1);
		margin-top: auto;
		padding: var(--space-12) 0;
	}

	.footer-container {
		max-width: 40rem;
		margin: 0 auto;
		padding: 0 var(--space-6);
	}

	.footer-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
		text-align: center;
	}

	/* Brand */
	.brand-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.logo {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-md);
	}

	.brand-name {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
	}

	/* Tagline */
	.tagline {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		opacity: 0.8;
		margin: 0;
	}

	/* Controls */
	.controls-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	/* Socials */
	.socials-group {
		display: flex;
		justify-content: center;
	}

	/* Footer Info */
	.footer-info {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		opacity: 0.6;
		padding-top: var(--space-6);
		border-top: 1px solid hsla(var(--brand-hue), 10%, 50%, 0.1);
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

	/* Dark mode */
	:global([data-theme='dark']) .footer {
		background: var(--color-background);
		border-top-color: hsla(var(--brand-hue), 10%, 50%, 0.15);
	}

	:global([data-theme='dark']) .footer-info {
		border-top-color: hsla(var(--brand-hue), 10%, 50%, 0.15);
	}

	/* Mobile */
	@media (max-width: 640px) {
		.footer {
			padding: var(--space-10) 0;
		}

		.footer-content {
			gap: var(--space-5);
		}

		.footer-info {
			flex-wrap: wrap;
			justify-content: center;
			line-height: 1.8;
		}

		.separator:nth-of-type(1) {
			display: none;
		}
	}

	/* Hover effects */
	.logo {
		transition: transform 0.3s ease;
	}

	.brand-group:hover .logo {
		transform: scale(1.05);
	}
</style>

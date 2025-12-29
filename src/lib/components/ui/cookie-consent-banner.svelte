<script lang="ts">
	import { Cookie, Shield, BarChart3, ChevronDown, ChevronUp, X } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import { useCookieConsent } from '@shelchin/cookie-consent';
	import { browser } from '$app/environment';

	const i18n = useI18n();
	const consent = useCookieConsent();

	let showDetails = $state(false);
	let analyticsChecked = $state(false);

	// Only show banner after client-side hydration to prevent flash
	// Check localStorage directly to avoid hydration mismatch
	let mounted = $state(false);
	$effect(() => {
		if (browser) {
			mounted = true;
			// Initialize analyticsChecked based on current preferences
			analyticsChecked = consent.preferences.analytics;
		}
	});

	// Determine if banner should show: only after mount AND if user hasn't interacted
	const shouldShow = $derived(mounted && consent.shouldShowBanner);
	const isReminder = $derived(consent.isReminder);
	// Settings mode: user has already interacted but is changing preferences
	const isSettingsMode = $derived(consent.hasInteracted && !isReminder);

	function handleAcceptAll() {
		consent.acceptAll();
	}

	function handleAcceptNecessaryOnly() {
		consent.acceptNecessaryOnly();
	}

	function handleAcceptCustom() {
		consent.acceptCustom({
			analytics: analyticsChecked
		});
	}

	function handleDismiss() {
		consent.dismissReminder();
	}

	function toggleDetails() {
		showDetails = !showDetails;
	}
</script>

{#if shouldShow}
	<div class="cookie-consent-overlay">
		<div class="cookie-consent-banner" role="dialog" aria-labelledby="cookie-title">
			{#if isReminder}
				<!-- Reminder mode: compact banner with dismiss option -->
				<button
					class="dismiss-btn"
					onclick={handleDismiss}
					aria-label={i18n.t('cookie-consent.dismiss')}
				>
					<X size={18} />
				</button>
				<div class="banner-header">
					<Cookie size={24} class="cookie-icon" />
					<h2 id="cookie-title">{i18n.t('cookie-consent.reminder_title')}</h2>
				</div>

				<p class="banner-description">
					{i18n.t('cookie-consent.reminder_description')}
				</p>

				<div class="banner-actions">
					<div class="action-buttons">
						<button class="btn-secondary" onclick={handleDismiss}>
							{i18n.t('cookie-consent.not_now')}
						</button>
						<button class="btn-primary" onclick={handleAcceptAll}>
							{i18n.t('cookie-consent.accept_all')}
						</button>
					</div>
				</div>
			{:else if isSettingsMode}
				<!-- Settings mode: user is changing preferences -->
				<button
					class="dismiss-btn"
					onclick={handleDismiss}
					aria-label={i18n.t('cookie-consent.dismiss')}
				>
					<X size={18} />
				</button>
				<div class="banner-header">
					<Cookie size={24} class="cookie-icon" />
					<h2 id="cookie-title">{i18n.t('cookie-consent.settings_title')}</h2>
				</div>

				<p class="banner-description">
					{i18n.t('cookie-consent.settings_description')}
				</p>

				<div class="cookie-categories">
					<!-- Necessary Cookies - Always enabled -->
					<div class="category">
						<div class="category-header">
							<div class="category-info">
								<Shield size={18} />
								<span class="category-name">{i18n.t('cookie-consent.necessary.title')}</span>
								<span class="required-badge">{i18n.t('cookie-consent.required')}</span>
							</div>
							<input type="checkbox" checked disabled class="category-checkbox" />
						</div>
						<p class="category-description">{i18n.t('cookie-consent.necessary.description')}</p>
					</div>

					<!-- Analytics Cookies -->
					<div class="category">
						<div class="category-header">
							<div class="category-info">
								<BarChart3 size={18} />
								<span class="category-name">{i18n.t('cookie-consent.analytics.title')}</span>
							</div>
							<input type="checkbox" bind:checked={analyticsChecked} class="category-checkbox" />
						</div>
						<p class="category-description">{i18n.t('cookie-consent.analytics.description')}</p>
					</div>
				</div>

				<div class="banner-actions">
					<div class="action-buttons">
						<button class="btn-secondary" onclick={handleDismiss}>
							{i18n.t('cookie-consent.cancel')}
						</button>
						<button class="btn-primary" onclick={handleAcceptCustom}>
							{i18n.t('cookie-consent.save_preferences')}
						</button>
					</div>
				</div>
			{:else}
				<!-- Initial consent mode: full banner -->
				<div class="banner-header">
					<Cookie size={24} class="cookie-icon" />
					<h2 id="cookie-title">{i18n.t('cookie-consent.title')}</h2>
				</div>

				<p class="banner-description">
					{i18n.t('cookie-consent.description')}
				</p>

				{#if showDetails}
					<div class="cookie-categories">
						<!-- Necessary Cookies - Always enabled -->
						<div class="category">
							<div class="category-header">
								<div class="category-info">
									<Shield size={18} />
									<span class="category-name">{i18n.t('cookie-consent.necessary.title')}</span>
									<span class="required-badge">{i18n.t('cookie-consent.required')}</span>
								</div>
								<input type="checkbox" checked disabled class="category-checkbox" />
							</div>
							<p class="category-description">{i18n.t('cookie-consent.necessary.description')}</p>
						</div>

						<!-- Analytics Cookies -->
						<div class="category">
							<div class="category-header">
								<div class="category-info">
									<BarChart3 size={18} />
									<span class="category-name">{i18n.t('cookie-consent.analytics.title')}</span>
								</div>
								<input type="checkbox" bind:checked={analyticsChecked} class="category-checkbox" />
							</div>
							<p class="category-description">{i18n.t('cookie-consent.analytics.description')}</p>
						</div>
					</div>
				{/if}

				<div class="banner-actions">
					<button class="toggle-details" onclick={toggleDetails}>
						{#if showDetails}
							<ChevronUp size={16} />
							{i18n.t('cookie-consent.hide_details')}
						{:else}
							<ChevronDown size={16} />
							{i18n.t('cookie-consent.show_details')}
						{/if}
					</button>

					<div class="action-buttons">
						<button class="btn-secondary" onclick={handleAcceptNecessaryOnly}>
							{i18n.t('cookie-consent.necessary_only')}
						</button>
						{#if showDetails}
							<button class="btn-secondary" onclick={handleAcceptCustom}>
								{i18n.t('cookie-consent.save_preferences')}
							</button>
						{/if}
						<button class="btn-primary" onclick={handleAcceptAll}>
							{i18n.t('cookie-consent.accept_all')}
						</button>
					</div>
				</div>

				<p class="privacy-link">
					{i18n.t('cookie-consent.privacy_notice')}
					<a href="/privacy">{i18n.t('cookie-consent.privacy_policy')}</a>
				</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.cookie-consent-overlay {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		padding: var(--space-4);
		background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
		pointer-events: none;
	}

	.cookie-consent-banner {
		position: relative;
		max-width: 600px;
		margin: 0 auto;
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: var(--space-5);
		box-shadow: var(--shadow-2xl);
		pointer-events: auto;
	}

	.dismiss-btn {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.dismiss-btn:hover {
		background: var(--color-muted);
		color: var(--color-foreground);
	}

	.banner-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		margin-bottom: var(--space-3);
	}

	.banner-header :global(.cookie-icon) {
		color: var(--color-primary);
	}

	.banner-header h2 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
	}

	.banner-description {
		margin: 0 0 var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		line-height: 1.5;
	}

	.cookie-categories {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-bottom: var(--space-4);
		padding: var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-lg);
	}

	.category {
		padding: var(--space-3);
		background: var(--color-card);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.category-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-2);
	}

	.category-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-foreground);
	}

	.category-name {
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
	}

	.required-badge {
		font-size: var(--text-xs);
		padding: 2px 6px;
		background: var(--color-primary);
		color: var(--color-primary-foreground);
		border-radius: var(--radius-sm);
	}

	.category-description {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		line-height: 1.4;
	}

	.category-checkbox {
		width: 18px;
		height: 18px;
		cursor: pointer;
		accent-color: var(--color-primary);
	}

	.category-checkbox:disabled {
		cursor: not-allowed;
		opacity: 0.7;
	}

	.banner-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.toggle-details {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-1);
		padding: var(--space-2);
		background: none;
		border: none;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: color 0.2s;
	}

	.toggle-details:hover {
		color: var(--color-foreground);
	}

	.action-buttons {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.btn-primary,
	.btn-secondary {
		flex: 1;
		min-width: 120px;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--color-primary);
		color: var(--color-primary-foreground);
		border: none;
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

	.btn-secondary {
		background: transparent;
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background: var(--color-muted);
	}

	.privacy-link {
		margin: var(--space-3) 0 0;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		text-align: center;
	}

	.privacy-link a {
		color: var(--color-primary);
		text-decoration: underline;
	}

	.privacy-link a:hover {
		text-decoration: none;
	}

	@media (max-width: 480px) {
		.cookie-consent-overlay {
			padding: var(--space-2);
		}

		.cookie-consent-banner {
			padding: var(--space-4);
		}

		.action-buttons {
			flex-direction: column;
		}

		.btn-primary,
		.btn-secondary {
			width: 100%;
		}
	}
</style>

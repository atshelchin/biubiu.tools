<script lang="ts">
	import { X, AlertTriangle, Wrench, ShieldCheck } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	type EnvironmentType = 'official' | 'localhost' | 'community';

	const OFFICIAL_DISMISS_KEY = 'env-banner-official-dismissed-at';
	const LOCALHOST_DISMISS_KEY = 'env-banner-localhost-dismissed';
	const DISMISS_INTERVAL_DAYS = 30;
	const FIRST_VISIT_DELAY_MS = 3000; // 3 seconds delay for first-time visitors

	// Start with null to indicate "not yet determined"
	let dismissed = $state<boolean | null>(null);
	let mounted = $state(false);
	let delayComplete = $state(false);

	const environmentType: EnvironmentType = $derived.by(() => {
		if (!browser) return 'official';

		const hostname = window.location.hostname;
		const isOfficial = hostname === 'biubiu.tools' || hostname.endsWith('.biubiu.tools');
		const isLocalhost =
			hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.');

		if (isOfficial) return 'official';
		if (isLocalhost) return 'localhost';
		return 'community';
	});

	const canDismiss = $derived(environmentType === 'localhost' || environmentType === 'official');

	// Only show banner after mounted, dismissed state is determined, and delay complete
	const showBanner = $derived.by(() => {
		if (!mounted) return false;
		if (dismissed === null) return false;
		if (!delayComplete) return false;
		if (environmentType === 'community') return true;
		return !dismissed;
	});

	function handleDismiss() {
		if (!canDismiss) return;

		dismissed = true;
		if (!browser) return;

		if (environmentType === 'official') {
			localStorage.setItem(OFFICIAL_DISMISS_KEY, Date.now().toString());
		} else if (environmentType === 'localhost') {
			sessionStorage.setItem(LOCALHOST_DISMISS_KEY, 'true');
		}
	}

	// Check storage on mount - runs once
	$effect(() => {
		if (!browser) return;

		mounted = true;
		let shouldDelay = false;

		if (environmentType === 'official') {
			const dismissedAt = localStorage.getItem(OFFICIAL_DISMISS_KEY);
			if (dismissedAt) {
				const daysSinceDismissed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
				if (daysSinceDismissed < DISMISS_INTERVAL_DAYS) {
					dismissed = true;
				} else {
					// Clear expired dismissal, will show banner after delay
					localStorage.removeItem(OFFICIAL_DISMISS_KEY);
					dismissed = false;
					shouldDelay = true;
				}
			} else {
				// First visit - delay banner
				dismissed = false;
				shouldDelay = true;
			}
		} else if (environmentType === 'localhost') {
			dismissed = sessionStorage.getItem(LOCALHOST_DISMISS_KEY) === 'true';
		} else {
			// Community - never dismissed, show immediately (important warning)
			dismissed = false;
		}

		// Apply delay for first-time or returning visitors (official only)
		if (shouldDelay) {
			setTimeout(() => {
				delayComplete = true;
			}, FIRST_VISIT_DELAY_MS);
		} else {
			delayComplete = true;
		}
	});
</script>

{#if showBanner}
	<div class="environment-banner {environmentType}" role="alert">
		<div class="banner-content">
			{#if environmentType === 'community'}
				<AlertTriangle size={18} />
				<span>{i18n.t('environment_banner.community_warning')}</span>
			{:else if environmentType === 'localhost'}
				<Wrench size={18} />
				<span>{i18n.t('environment_banner.dev_environment')}</span>
			{:else if environmentType === 'official'}
				<ShieldCheck size={18} />
				<span>{i18n.t('environment_banner.official_reminder')}</span>
			{/if}
		</div>
		{#if canDismiss}
			<button class="dismiss-btn" onclick={handleDismiss} aria-label="Dismiss">
				<X size={16} />
			</button>
		{/if}
	</div>
{/if}

<style>
	.environment-banner {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		position: relative;
		z-index: 1000;
	}

	.banner-content {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	/* Official - Brand green (darker for better readability) */
	.environment-banner.official {
		background: hsl(var(--brand-hue), var(--brand-saturation), 35%);
		color: white;
	}

	/* Community deploy - Orange warning */
	.environment-banner.community {
		background: hsl(30, 100%, 50%);
		color: white;
	}

	/* Localhost - Blue info */
	.environment-banner.localhost {
		background: hsl(210, 100%, 50%);
		color: white;
	}

	.dismiss-btn {
		position: absolute;
		right: var(--space-4);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: transparent;
		border: none;
		color: inherit;
		cursor: pointer;
		opacity: 0.8;
		transition: opacity 0.2s;
		border-radius: var(--radius-sm);
	}

	.dismiss-btn:hover {
		opacity: 1;
		background: rgba(255, 255, 255, 0.2);
	}
</style>

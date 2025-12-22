<script lang="ts">
	import { X, AlertTriangle, Wrench } from '@lucide/svelte';
	import { browser } from '$app/environment';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	type EnvironmentType = 'official' | 'localhost' | 'community';

	let dismissed = $state(false);

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

	const canDismiss = $derived(environmentType === 'localhost');
	const showBanner = $derived(environmentType !== 'official' && !dismissed);

	function handleDismiss() {
		if (canDismiss) {
			dismissed = true;
			if (browser) {
				sessionStorage.setItem('env-banner-dismissed', 'true');
			}
		}
	}

	// Check sessionStorage on mount
	$effect(() => {
		if (browser && environmentType === 'localhost') {
			const wasDismissed = sessionStorage.getItem('env-banner-dismissed') === 'true';
			if (wasDismissed) {
				dismissed = true;
			}
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

<script lang="ts">
	import { initI18n, setI18nContext, registerGlobLoaders } from '@shelchin/i18n';
	import { onMount } from 'svelte';
	import { createThemeStore } from '$lib/stores/theme.svelte.js';
	import { createGeoBlockStore } from '$lib/stores/geo-block.svelte.js';
	import { createCookieConsentStore } from '$lib/stores/cookie-consent.svelte.js';
	import { initializeReferral } from '$lib/utils/referral';
	import '../design-tokens.css';
	import '../global.css';
	import type { LayoutData } from './$types.js';
	import Footer from '@/lib/components/ui/Footer.svelte';
	import TopToolbar from '@/features/landingpage/TopToolbar.svelte';
	import EnvironmentBanner from '$lib/components/ui/environment-banner.svelte';
	import GeoBlockOverlay from '$lib/components/ui/geo-block-overlay.svelte';
	import CookieConsentBanner from '$lib/components/ui/cookie-consent-banner.svelte';
	import FloatingHelpButton from '$lib/components/ui/floating-help-button.svelte';
	import { localeMetas } from '../i18n/i18n.svelte';
	let { children, data } = $props<{ children: import('svelte').Snippet; data: LayoutData }>();

	// Initialize i18n with preloaded translations from SSR
	const i18n = initI18n({
		locale: data.locale,
		defaultLocale: 'en',
		devMode: import.meta.env.DEV,
		preloadedTranslations: data.preloadedTranslations,
		localeMetas: data.localeMetas
	});

	// Register all locale files using Vite glob import (for client-side lazy loading)
	const modules = import.meta.glob('../i18n/locales/**/*.json');
	registerGlobLoaders(modules, i18n);

	// Set context for child components
	setI18nContext(i18n);

	// Watch for locale changes from navigation and update i18n
	$effect(() => {
		if (data.locale !== i18n.locale) {
			// Update locale with new translations when navigating to a different locale
			i18n._updateLocale(data.locale, data.preloadedTranslations);
		}
	});

	// Override setLocale to use URL-based navigation
	i18n.setLocale = async (locale: string) => {
		// Navigate to the new locale URL
		const currentPath = page.url.pathname;
		const pathWithoutLocale = currentPath.replace(/^\/[a-z]{2}(?=\/|$)/, '');
		const newPath = `/${locale}${pathWithoutLocale || '/'}`;
		// eslint-disable-next-line svelte/no-navigation-without-resolve -- dynamic locale URL
		await goto(newPath);
	};

	// Initialize cookie consent store (must be before theme store)
	createCookieConsentStore();

	// Setup theme with initial value from server
	createThemeStore(data.theme);

	// Initialize geo-blocking detection (client-side backup)
	createGeoBlockStore();

	// Initialize referral system once for the entire app
	onMount(() => {
		initializeReferral();
	});
</script>

<GeoBlockOverlay />
<EnvironmentBanner />
<TopToolbar />
<div class="app">
	{@render children()}
	<Footer />
</div>
<CookieConsentBanner />
<FloatingHelpButton />

<style>
	:global(:root) {
		--brand-hue: 154; /* 主色调 Primary Hue (0-360) */
		--brand-saturation: 82%; /* 饱和度 Saturation (0-100%) */
		--radius-scale: 1; /* 圆角缩放 Radius Scale */
		--spacing-scale: 1; /* 间距缩放 Spacing Scale */

		/* 无障碍配置 Accessibility Configuration */
		--font-scale: 1; /* 字体缩放 Font Scale */
		--contrast-mode: normal; /* 对比度模式 Contrast Mode */
		--letter-spacing: normal; /* 字间距 Letter Spacing */
		--line-height: 1.6; /* 行高 Line Height */
	}
</style>

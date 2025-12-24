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

	const i18n = initI18n({
		locale: data.locale,
		defaultLocale: 'en',
		preloadedTranslations: data.translations,
		localeMetas,
		devMode: import.meta.env.DEV
	});
	registerGlobLoaders(import.meta.glob('../i18n/locales/**/*.json'), i18n);
	setI18nContext(i18n);

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

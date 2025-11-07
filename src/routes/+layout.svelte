<script lang="ts">
	import { createI18nStore, setI18nContext } from '@shelchin/i18n/svelte';
	import { onMount } from 'svelte';
	import { createThemeStore } from '$lib/stores/theme.svelte.js';
	import { initializeReferral } from '$lib/utils/referral';
	import '../design-tokens.css';
	import '../global.css';
	import type { LayoutData } from './$types.js';
	import Footer from '@/lib/components/ui/Footer.svelte';
	import { PACKAGE_NAME, locales } from '../i18n/i18n.svelte';
	let { children, data } = $props<{ children: import('svelte').Snippet; data: LayoutData }>();

	console.log({ data });
	const i18nStore = createI18nStore({ initialLocale: data.locale });

	i18nStore.register(PACKAGE_NAME, locales);
	setI18nContext(i18nStore);

	// Setup theme with initial value from server
	createThemeStore(data.theme);

	// Initialize referral system once for the entire app
	onMount(() => {
		initializeReferral();
	});
</script>

<div class="app">
	{@render children()}
	<Footer />
</div>

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

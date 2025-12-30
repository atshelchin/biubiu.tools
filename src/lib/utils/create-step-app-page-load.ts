/**
 * Factory function for creating SSR page load handlers for step-based apps.
 *
 * This eliminates ~100 lines of repetitive code in each tool's +page.server.ts
 * by providing a configuration-driven approach.
 *
 * @example
 * ```typescript
 * // Before: ~100 lines of code
 * // After: 5 lines
 * export const load = createStepAppPageLoad({
 *   toolId: 'wallet-sweep',
 *   stepCount: 5
 * });
 * ```
 */
import type { RequestEvent } from '@sveltejs/kit';
import { createWebAppData, createHowToData, type HowToStepData } from './structured-data';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname } from '$utils/common';

/**
 * Configuration for creating a step-based app page load function.
 */
export interface StepAppPageConfig {
	/**
	 * Tool ID used as i18n key prefix.
	 * @example 'wallet-sweep', 'token-balance-scanner'
	 */
	toolId: string;

	/**
	 * Number of steps in the tool.
	 */
	stepCount: number;

	/**
	 * Number of features to include in structured data.
	 * @default 5
	 */
	featureCount?: number;

	/**
	 * Number of tools to include in HowTo structured data.
	 * @default 2
	 */
	howToToolCount?: number;

	/**
	 * Custom OG image filename. Will be prefixed with origin.
	 * @default `og-${toolId}.png`
	 */
	ogImage?: string;

	/**
	 * Custom function to generate additional structured data.
	 */
	customStructuredData?: (params: {
		t: (key: string) => string;
		canonical: string;
		image: string;
	}) => Record<string, unknown>[];
}

/**
 * Return type of the page load function.
 */
export interface StepAppPageData {
	meta: {
		title: string;
		description: string;
		keywords: string;
		canonical: string;
		type: 'website';
		image: string;
		locale: string;
	};
	steps: HowToStepData[];
	structuredData: Record<string, unknown>[];
}

/**
 * Map of locale codes to SEO locale format.
 */
const SEO_LOCALE_MAP: Record<string, string> = {
	en: 'en_US',
	zh: 'zh_CN',
	ja: 'ja_JP',
	fr: 'fr_FR',
	de: 'de_DE',
	ko: 'ko_KR',
	es: 'es_ES'
};

/**
 * Creates a page load function for step-based apps.
 *
 * Generates:
 * - Meta tags for SEO
 * - Step data for UI and structured data
 * - WebApp and HowTo structured data for search engines
 *
 * All text is loaded from i18n using the convention:
 * - `{toolId}.seo.page_title`
 * - `{toolId}.seo.step_{N}_name`
 * - etc.
 *
 * @param config - Configuration options
 * @returns PageServerLoad function
 */
export function createStepAppPageLoad(config: StepAppPageConfig) {
	const {
		toolId,
		stepCount,
		featureCount = 5,
		howToToolCount = 2,
		ogImage = `og-${toolId}.png`
	} = config;

	return (event: RequestEvent): StepAppPageData => {
		const { url } = event;
		const locale = extractLocaleFromPathname(url.pathname) || 'en';
		const serverT = createT(event);

		// Wrapper to handle dynamic keys - the i18n library uses strict types
		// but we need to generate keys dynamically based on toolId and step numbers
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const t = (key: string): string => serverT(key as any);

		// i18n key prefix - translations are now in routes/apps/{toolId}.json
		const i18nPrefix = `routes/apps/${toolId}`;

		const canonical = url.origin + url.pathname;
		const image = `${url.origin}/${ogImage}`;

		// Generate step data from i18n
		const steps: HowToStepData[] = Array.from({ length: stepCount }, (_, i) => ({
			name: t(`${i18nPrefix}.seo.step_${i + 1}_name`),
			text: t(`${i18nPrefix}.seo.step_${i + 1}_text`),
			description: t(`${i18nPrefix}.seo.step_${i + 1}_description`)
		}));

		// Generate features list from i18n
		const features = Array.from({ length: featureCount }, (_, i) =>
			t(`${i18nPrefix}.seo.feature_${i + 1}`)
		);

		// Generate howTo tools list from i18n
		const tools = Array.from({ length: howToToolCount }, (_, i) =>
			t(`${i18nPrefix}.seo.howto_tool_${i + 1}`)
		);

		// Create WebApp structured data
		const webAppData = createWebAppData({
			name: t(`${i18nPrefix}.seo.webapp_name`),
			description: t(`${i18nPrefix}.seo.webapp_description`),
			canonical,
			features
		});

		// Create HowTo structured data
		const howToData = createHowToData({
			name: t(`${i18nPrefix}.seo.howto_name`),
			description: t(`${i18nPrefix}.seo.howto_description`),
			canonical,
			image,
			steps,
			tools
		});

		// Combine structured data
		let structuredData: Record<string, unknown>[] = [webAppData, howToData];

		// Add custom structured data if provided
		if (config.customStructuredData) {
			const customData = config.customStructuredData({ t, canonical, image });
			structuredData = [...structuredData, ...customData];
		}

		return {
			meta: {
				title: t(`${i18nPrefix}.seo.page_title`),
				description: t(`${i18nPrefix}.seo.page_description`),
				keywords: t(`${i18nPrefix}.seo.keywords`),
				canonical,
				type: 'website' as const,
				image,
				locale: SEO_LOCALE_MAP[locale] || 'en_US'
			},
			steps,
			structuredData
		};
	};
}

/**
 * Type helper to extract the return type for use in +page.svelte.
 *
 * @example
 * ```typescript
 * // In +page.svelte
 * import type { StepAppPageData } from '$lib/utils/create-step-app-page-load';
 * let { data }: { data: StepAppPageData } = $props();
 * ```
 */
export type { StepAppPageData as PageData };

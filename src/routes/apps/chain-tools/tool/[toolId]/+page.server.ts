import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getToolById } from '@/features/chain-tools/data/tools';
import { getToolDetail } from '@/features/chain-tools/data/tool-details';
import { getCategoryById } from '@/features/chain-tools/data/categories';
import { extractLocaleFromPathname, buildCanonicalUrl } from '$utils/common';

export const load: PageServerLoad = (event) => {
	const { url, params } = event;
	const toolId = params.toolId;

	// Get tool basic info
	const toolData = getToolById(toolId);
	if (!toolData) {
		throw error(404, 'Tool not found');
	}

	// Exclude icon (Svelte component) which is not serializable - eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { icon, ...tool } = toolData;
	void icon; // Icon is a Svelte component and not serializable

	// Get tool detail
	const detail = getToolDetail(toolId);
	if (!detail) {
		throw error(404, 'Tool detail not available');
	}

	// Get category - exclude icon which is not serializable
	const categoryData = getCategoryById(tool.category);
	if (!categoryData) {
		throw error(500, 'Category not found');
	}
	const { icon: categoryIcon, ...category } = categoryData;
	void categoryIcon; // Icon is a Svelte component and not serializable

	// Get related tools data - exclude icon which is not serializable
	const relatedToolsData = (detail.relatedTools ?? [])
		.map((id) => getToolById(id))
		.filter((t): t is NonNullable<typeof t> => t !== undefined)
		.slice(0, 6)
		.map(({ icon: toolIcon, ...rest }) => {
			void toolIcon; // Icon is a Svelte component and not serializable
			return rest;
		});

	// Extract locale
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Build canonical URL
	const canonical = buildCanonicalUrl(url);
	const image = `${url.origin}/og-chain-tools.png`;

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN',
		ja: 'ja_JP',
		ko: 'ko_KR',
		es: 'es_ES',
		fr: 'fr_FR',
		pt: 'pt_BR',
		ru: 'ru_RU',
		tr: 'tr_TR',
		vi: 'vi_VN',
		it: 'it_IT',
		id: 'id_ID'
	};

	// Generate structured data
	const structuredData = [
		// SoftwareApplication
		{
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: tool.name,
			applicationCategory: 'FinanceApplication',
			operatingSystem: 'Web',
			url: tool.url,
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'USD'
			}
		},
		// BreadcrumbList
		{
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			itemListElement: [
				{
					'@type': 'ListItem',
					position: 1,
					name: 'Home',
					item: url.origin
				},
				{
					'@type': 'ListItem',
					position: 2,
					name: 'Chain Tools',
					item: `${url.origin}/apps/chain-tools`
				},
				{
					'@type': 'ListItem',
					position: 3,
					name: tool.category,
					item: `${url.origin}/apps/chain-tools/${tool.category}`
				},
				{
					'@type': 'ListItem',
					position: 4,
					name: tool.name,
					item: canonical
				}
			]
		}
	];

	return {
		tool,
		detail,
		category,
		relatedToolsData,
		meta: {
			title: '', // Will be set from i18n in page
			description: '', // Will be set from i18n in page
			keywords: '', // Will be set from i18n in page
			canonical,
			type: 'website',
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		structuredData
	};
};

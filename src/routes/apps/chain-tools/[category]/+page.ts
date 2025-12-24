import type { PageLoad } from './$types';
import { createWebAppData } from '$lib/utils/structured-data';
import { categories } from '@/features/chain-tools/data/categories';
import { error } from '@sveltejs/kit';
import type { CategoryId } from '@/features/chain-tools/types';
import { createServerT } from '$i18n/server';
import { extractLocaleFromPathname } from '$utils/common';

export const load: PageLoad = ({ url, params }) => {
	const categoryId = params.category as CategoryId;

	// Validate category exists (exclude 'featured' as it's handled by main page)
	const category = categories.find((c) => c.id === categoryId && c.id !== 'featured');
	if (!category) {
		throw error(404, 'Category not found');
	}

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createServerT(locale);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-chain-tools.png`;

	// Get category-specific SEO data
	const categoryName = t(category.labelKey);
	const categoryKey = categoryId.replace(/-/g, '_');

	// Try to get category-specific SEO, fallback to generic
	const seoTitle =
		t(`chain_tools.category_seo.${categoryKey}.title`, { defaultValue: '' }) ||
		`${categoryName} - ${t('chain-tools.title')} | BiuBiu Tools`;

	const seoDescription =
		t(`chain_tools.category_seo.${categoryKey}.description`, { defaultValue: '' }) ||
		`${t('chain-tools.subtitle')} - ${categoryName}`;

	const seoKeywords =
		t(`chain_tools.category_seo.${categoryKey}.keywords`, { defaultValue: '' }) ||
		`${categoryName}, web3 tools, crypto, blockchain`;

	// Get FAQs for this category - FAQs are not currently supported in namespace structure
	type FaqItem = { question: string; answer: string };
	const faqs: FaqItem[] = [];

	// Generate structured data
	const webAppData = createWebAppData({
		name: `${categoryName} - ${t('chain-tools.seo.webapp_name')}`,
		description: seoDescription,
		canonical,
		features: [
			t('chain-tools.seo.feature_1'),
			t('chain-tools.seo.feature_2'),
			t('chain-tools.seo.feature_3'),
			t('chain-tools.seo.feature_4')
		]
	});

	// FAQPage structured data
	const faqPageData =
		faqs.length > 0
			? {
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faqs.map((faq) => ({
						'@type': 'Question',
						name: faq.question,
						acceptedAnswer: {
							'@type': 'Answer',
							text: faq.answer
						}
					}))
				}
			: null;

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN',
		ja: 'ja_JP',
		fr: 'fr_FR'
	};

	const structuredData: Record<string, unknown>[] = [webAppData];
	if (faqPageData) {
		structuredData.push(faqPageData);
	}

	return {
		categoryId,
		category,
		categoryName,
		faqs,
		meta: {
			title: seoTitle,
			description: seoDescription,
			keywords: seoKeywords,
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		structuredData
	};
};

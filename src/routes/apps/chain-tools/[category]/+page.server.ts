import type { PageServerLoad } from './$types';
import { createWebAppData } from '$lib/utils/structured-data';
import { categories } from '@/features/chain-tools/data/categories';
import { error } from '@sveltejs/kit';
import type { CategoryId } from '@/features/chain-tools/types';
import { createT } from '$i18n/translations';
import { extractLocaleFromPathname, buildCanonicalUrl } from '$utils/common';
import type { TranslationKeys } from '@shelchin/i18n';

export const load: PageServerLoad = (event) => {
	const { url, params } = event;
	const categoryId = params.category as CategoryId;

	// Validate category exists (exclude 'featured' as it's handled by main page)
	const category = categories.find((c) => c.id === categoryId && c.id !== 'featured');
	if (!category) {
		throw error(404, 'Category not found');
	}

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create translation function for this request
	const t = createT(event);

	const canonical = buildCanonicalUrl(url);
	const image = `${url.origin}/og-chain-tools.png`;

	// Get category-specific SEO data
	const categoryName = t(category.labelKey as keyof TranslationKeys);
	const categoryKey = categoryId;

	// Try to get category-specific SEO, fallback to generic
	// Namespace: routes/apps/chain-tools/{category}.json contains category_seo and tools
	const seoTitle =
		t(`routes/apps/chain-tools/${categoryKey}.category_seo.title` as never, {
			defaultValue: ''
		}) || `${categoryName} - ${t('routes/apps/chain-tools.title' as never)} | BiuBiu Tools`;

	const seoDescription =
		t(`routes/apps/chain-tools/${categoryKey}.category_seo.description` as never, {
			defaultValue: ''
		}) || `${t('routes/apps/chain-tools.subtitle' as never)} - ${categoryName}`;

	const seoKeywords =
		t(`routes/apps/chain-tools/${categoryKey}.category_seo.keywords` as never, {
			defaultValue: ''
		}) || `${categoryName}, web3 tools, crypto, blockchain`;

	// Get FAQs for this category from routes/apps/chain-tools/{category}.category_seo.faqs
	type FaqItem = { question: string; answer: string };
	const faqs = (t(`routes/apps/chain-tools/${categoryKey}.category_seo.faqs` as never) ||
		[]) as FaqItem[];

	// Generate structured data
	const webAppData = createWebAppData({
		name: `${categoryName} - ${t('routes/apps/chain-tools.seo.webapp_name' as never)}`,
		description: seoDescription,
		canonical,
		features: [
			t('routes/apps/chain-tools.seo.feature_1' as never),
			t('routes/apps/chain-tools.seo.feature_2' as never),
			t('routes/apps/chain-tools.seo.feature_3' as never),
			t('routes/apps/chain-tools.seo.feature_4' as never)
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

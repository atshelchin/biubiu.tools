import type { PageLoad } from './$types';
import { createWebAppData } from '$lib/utils/structured-data';
import { I18n } from '@shelchin/i18n';
import { extractLocaleFromPathname } from '@shelchin/i18n/utils';
import en from '../../../../i18n/locales/en.json';
import zh from '../../../../i18n/locales/zh.json';
import type { PackageLocales } from '@shelchin/i18n';
import { categories } from '@/features/chain-tools/data/categories';
import { error } from '@sveltejs/kit';
import type { CategoryId } from '@/features/chain-tools/types';

export const load: PageLoad = ({ url, params }) => {
	const categoryId = params.category as CategoryId;

	// Validate category exists (exclude 'featured' as it's handled by main page)
	const category = categories.find((c) => c.id === categoryId && c.id !== 'featured');
	if (!category) {
		throw error(404, 'Category not found');
	}

	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create i18n instance for this request
	const locales = { en, zh } as unknown as PackageLocales;
	const i18n = new I18n(locale);
	i18n.register('__default__', locales);
	const t = i18n.t.bind(i18n);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-chain-tools.png`;

	// Get category-specific SEO data
	const categoryName = t(category.labelKey);
	const categoryKey = categoryId.replace(/-/g, '_');

	// Try to get category-specific SEO, fallback to generic
	const seoTitle =
		t(`chain_tools.category_seo.${categoryKey}.title`, { defaultValue: '' }) ||
		`${categoryName} - ${t('chain_tools.title')} | BiuBiu Tools`;

	const seoDescription =
		t(`chain_tools.category_seo.${categoryKey}.description`, { defaultValue: '' }) ||
		`${t('chain_tools.subtitle')} - ${categoryName}`;

	const seoKeywords =
		t(`chain_tools.category_seo.${categoryKey}.keywords`, { defaultValue: '' }) ||
		`${categoryName}, web3 tools, crypto, blockchain`;

	// Get FAQs for this category
	type FaqItem = { question: string; answer: string };
	type CategorySeoData = {
		title?: string;
		description?: string;
		keywords?: string;
		faqs?: FaqItem[];
	};
	const currentLocale = locale === 'zh' ? zh : en;
	const categorySeo = currentLocale.chain_tools?.category_seo as
		| Record<string, CategorySeoData>
		| undefined;
	const faqs: FaqItem[] = categorySeo?.[categoryKey]?.faqs || [];

	// Generate structured data
	const webAppData = createWebAppData({
		name: `${categoryName} - ${t('chain_tools.seo.webapp_name')}`,
		description: seoDescription,
		canonical,
		features: [
			t('chain_tools.seo.feature_1'),
			t('chain_tools.seo.feature_2'),
			t('chain_tools.seo.feature_3'),
			t('chain_tools.seo.feature_4')
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

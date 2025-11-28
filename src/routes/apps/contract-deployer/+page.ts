import type { PageLoad } from './$types';
import { createWebAppData, createHowToData, type HowToStepData } from '$lib/utils/structured-data';
import { I18n } from '@shelchin/i18n';
import { extractLocaleFromPathname } from '@shelchin/i18n/utils';
import en from '../../../i18n/locales/en.json';
import zh from '../../../i18n/locales/zh.json';
import type { PackageLocales } from '@shelchin/i18n';

export const load: PageLoad = ({ url }) => {
	// Extract locale from URL pathname
	const locale = extractLocaleFromPathname(url.pathname) || 'en';

	// Create i18n instance for this request
	const locales = { en, zh } as unknown as PackageLocales;
	const i18n = new I18n(locale);
	i18n.register('__default__', locales);
	const t = i18n.t.bind(i18n);

	const canonical = url.origin + url.pathname;
	const image = `${url.origin}/og-contract-deployer.png`;

	// Define steps with both SEO text and UI description using i18n
	const steps: HowToStepData[] = [
		{
			name: t('tools.contract_deployer.seo.step_1_name'),
			text: t('tools.contract_deployer.seo.step_1_text'),
			description: t('tools.contract_deployer.seo.step_1_description')
		},
		{
			name: t('tools.contract_deployer.seo.step_2_name'),
			text: t('tools.contract_deployer.seo.step_2_text'),
			description: t('tools.contract_deployer.seo.step_2_description')
		},
		{
			name: t('tools.contract_deployer.seo.step_3_name'),
			text: t('tools.contract_deployer.seo.step_3_text'),
			description: t('tools.contract_deployer.seo.step_3_description')
		}
	];

	// Generate structured data from steps config
	const webAppData = createWebAppData({
		name: t('tools.contract_deployer.seo.webapp_name'),
		description: t('tools.contract_deployer.seo.webapp_description'),
		canonical,
		features: [
			t('tools.contract_deployer.seo.feature_1'),
			t('tools.contract_deployer.seo.feature_2'),
			t('tools.contract_deployer.seo.feature_3')
		]
	});

	const howToData = createHowToData({
		name: t('tools.contract_deployer.seo.howto_name'),
		description: t('tools.contract_deployer.seo.howto_description'),
		canonical,
		image,
		steps,
		tools: [t('tools.contract_deployer.seo.howto_tool_1')]
	});

	// Map locale to SEO locale format
	const seoLocaleMap: Record<string, string> = {
		en: 'en_US',
		zh: 'zh_CN',
		ja: 'ja_JP',
		fr: 'fr_FR'
	};

	return {
		meta: {
			title: t('tools.contract_deployer.seo.page_title'),
			description: t('tools.contract_deployer.seo.page_description'),
			keywords: t('tools.contract_deployer.seo.keywords'),
			canonical,
			type: 'website' as const,
			image,
			locale: seoLocaleMap[locale] || 'en_US'
		},
		steps,
		structuredData: [webAppData, howToData]
	};
};

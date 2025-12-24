import type { LayoutServerLoad } from './$types.js';
import type { LocaleData } from '@shelchin/i18n';
import { createServerLoader } from '@shelchin/i18n';

// Auto-scan all locale files and create server loader
const { load: i18nLoad } = createServerLoader(
	import.meta.glob<{ default: LocaleData }>('../i18n/locales/**/*.json', { eager: true }),
	{
		defaultLocale: 'en',
		baseNamespaces: [
			'common',
			'components',
			'cookie-consent',
			'faqs',
			'pricing',
			'referral',
			'security-scanner',
			'tools',
			'wallet-connection',
			'wallet'
		],
		homeNamespace: 'home'
	}
);

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const data = await i18nLoad({ url, cookies });
	// Read theme from cookie, default to 'light'
	const theme = (cookies.get('theme') || 'light') as 'light' | 'dark';

	return {
		...data,
		theme
	};
};

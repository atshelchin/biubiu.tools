import type { LayoutServerLoad } from './$types.js';
import type { LocaleData } from '@shelchin/i18n';
import { createServerLoader } from '@shelchin/i18n';

// Auto-scan all locale files and create server loader
// Note: namespacePrefix is supported by the library but missing from type definitions
// Chain-tools category namespaces
const chainToolsCategories = [
	'ai_crypto',
	'airdrop_token',
	'analytics',
	'bridge',
	'cex',
	'community',
	'dao',
	'dao_token',
	'defi',
	'dev',
	'explorer',
	'funding',
	'gamefi',
	'gas_burner',
	'identity',
	'influencer',
	'infra',
	'jobs',
	'l2',
	'launchpad',
	'legendary_token',
	'mev',
	'news',
	'nft',
	'non_evm',
	'oracle',
	'payments',
	'privacy',
	'product_hunt',
	'regulation',
	'restaking',
	'rwa',
	'security',
	'social',
	'stablecoin',
	'trends',
	'wallet',
	'web3_teams',
	'whale_address'
].map((cat) => `routes/apps/chain-tools/${cat}`);

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
			'wallet',
			'routes/apps/chain-tools',
			...chainToolsCategories
		],
		homeNamespace: 'home',
		namespacePrefix: 'routes'
	} as Parameters<typeof createServerLoader>[1] & { namespacePrefix?: string }
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

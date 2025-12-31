import type { ToolDetail } from '../../types';

export const coingeckoDetail: ToolDetail = {
	id: 'coingecko',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/coingecko',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2014',
	team: 'CoinGecko',
	funding: 'Bootstrapped',
	socialLinks: {
		twitter: 'https://twitter.com/coingecko',
		discord: 'https://discord.gg/coingecko',
		github: 'https://github.com/coingecko',
		docs: 'https://docs.coingecko.com'
	},
	relatedTools: ['coinmarketcap', 'defillama', 'messari', 'dexscreener'],
	lastUpdated: '2024-12'
};

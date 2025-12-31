import type { ToolDetail } from '../../types';

export const coinmarketcapDetail: ToolDetail = {
	id: 'coinmarketcap',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/coinmarketcap',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2013',
	team: 'Binance',
	funding: 'Acquired by Binance (2020)',
	socialLinks: {
		twitter: 'https://twitter.com/CoinMarketCap',
		discord: 'https://discord.gg/coinmarketcap',
		docs: 'https://coinmarketcap.com/api/documentation'
	},
	relatedTools: ['coingecko', 'defillama', 'messari', 'dexscreener'],
	lastUpdated: '2024-12'
};

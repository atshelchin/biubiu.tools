import type { ToolDetail } from '../../types';

export const messariDetail: ToolDetail = {
	id: 'messari',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/messari',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2018',
	team: 'Messari',
	funding: '$35M Series B',
	socialLinks: {
		twitter: 'https://twitter.com/MessariCrypto',
		github: 'https://github.com/messari',
		docs: 'https://messari.io/api'
	},
	relatedTools: ['coingecko', 'coinmarketcap', 'defillama', 'dune'],
	lastUpdated: '2024-12'
};

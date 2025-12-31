import type { ToolDetail } from '../../types';

export const bnbchainDetail: ToolDetail = {
	id: 'bnbchain',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/bnbchain',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'BNB Chain',
	funding: 'Binance-backed',
	socialLinks: {
		twitter: 'https://twitter.com/BNBChain',
		discord: 'https://discord.gg/bnbchain',
		github: 'https://github.com/bnb-chain',
		docs: 'https://docs.bnbchain.org'
	},
	relatedTools: ['polygon', 'avalanche', 'pancakeswap', 'venus'],
	lastUpdated: '2024-12'
};

import type { ToolDetail } from '../../types';

export const quickswapDetail: ToolDetail = {
	id: 'quickswap',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/quickswap',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'QuickSwap',
	funding: 'Community funded',
	socialLinks: {
		twitter: 'https://twitter.com/QuickswapDEX',
		discord: 'https://discord.gg/quickswap',
		github: 'https://github.com/QuickSwap',
		docs: 'https://docs.quickswap.exchange'
	},
	relatedTools: ['polygon', 'uniswap', 'sushiswap', 'balancer'],
	lastUpdated: '2024-12'
};

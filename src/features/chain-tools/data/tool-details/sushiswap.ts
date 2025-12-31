/**
 * SushiSwap Tool Detail
 *
 * Multi-chain decentralized exchange
 */

import type { ToolDetail } from '../../types';

export const sushiswapDetail: ToolDetail = {
	id: 'sushiswap',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/sushiswap',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2020',
	team: 'Sushi DAO (Originally Chef Nomi)',
	funding: 'Community-funded',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/SushiSwap',
		discord: 'https://discord.gg/NVPXN4e',
		github: 'https://github.com/sushiswap',
		docs: 'https://docs.sushi.com'
	},

	// Related DeFi tools
	relatedTools: ['uniswap', 'pancakeswap', 'curve', 'balancer', '1inch'],

	lastUpdated: '2025-12-31'
};

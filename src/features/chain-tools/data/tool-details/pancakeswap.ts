/**
 * PancakeSwap Tool Detail
 *
 * Leading DEX on BNB Chain and multi-chain
 */

import type { ToolDetail } from '../../types';

export const pancakeswapDetail: ToolDetail = {
	id: 'pancakeswap',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/pancakeswap',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2020',
	team: 'Anonymous (Community-driven)',
	funding: 'Self-funded through token sales',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/pancakeswap',
		discord: 'https://discord.gg/pancakeswap',
		github: 'https://github.com/pancakeswap',
		docs: 'https://docs.pancakeswap.finance'
	},

	// Related DeFi tools
	relatedTools: ['uniswap', 'sushiswap', 'trader-joe', 'camelot', '1inch'],

	lastUpdated: '2025-12-31'
};

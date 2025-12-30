/**
 * Uniswap Tool Detail
 *
 * The world's largest decentralized exchange protocol
 */

import type { ToolDetail } from '../../types';

export const uniswapDetail: ToolDetail = {
	id: 'uniswap',
	i18nKeyPrefix: 'chain-tools-detail.tools.uniswap',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2018',
	team: 'Uniswap Labs (Hayden Adams)',
	funding: '$176M (Paradigm, a16z, etc.)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/Uniswap',
		discord: 'https://discord.com/invite/FCfyBSbCU5',
		github: 'https://github.com/Uniswap',
		docs: 'https://docs.uniswap.org'
	},

	// Related DeFi tools
	relatedTools: ['sushiswap', '1inch', 'curve', 'pancakeswap', 'balancer'],

	lastUpdated: '2024-12-30'
};

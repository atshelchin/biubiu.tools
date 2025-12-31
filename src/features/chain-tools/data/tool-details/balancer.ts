/**
 * Balancer Tool Detail
 *
 * Weighted pool AMM and liquidity protocol
 */

import type { ToolDetail } from '../../types';

export const balancerDetail: ToolDetail = {
	id: 'balancer',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/balancer',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2020',
	team: 'Balancer Labs (Fernando Martinelli)',
	funding: '$25M (Placeholder, Accomplice, CoinFund)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/Balancer',
		discord: 'https://discord.balancer.fi',
		github: 'https://github.com/balancer',
		docs: 'https://docs.balancer.fi'
	},

	// Related DeFi tools
	relatedTools: ['curve', 'uniswap', 'aura', 'gyroscope', 'beethoven-x'],

	lastUpdated: '2024-12-31'
};

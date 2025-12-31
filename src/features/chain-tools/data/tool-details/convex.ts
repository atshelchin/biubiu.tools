/**
 * Convex Finance Tool Detail
 *
 * Curve and Frax yield optimization platform
 */

import type { ToolDetail } from '../../types';

export const convexDetail: ToolDetail = {
	id: 'convex',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/convex',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2021',
	team: 'Anonymous (C2tP and team)',
	funding: 'Self-funded',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/ConvexFinance',
		discord: 'https://discord.gg/TTEVTqY488',
		github: 'https://github.com/convex-eth',
		docs: 'https://docs.convexfinance.com'
	},

	// Related DeFi tools
	relatedTools: ['curve', 'frax', 'yearn', 'aura', 'concentrator'],

	lastUpdated: '2024-12-31'
};

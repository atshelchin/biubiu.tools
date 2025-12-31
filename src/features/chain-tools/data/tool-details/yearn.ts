/**
 * Yearn Finance Tool Detail
 *
 * Yield aggregation and optimization protocol
 */

import type { ToolDetail } from '../../types';

export const yearnDetail: ToolDetail = {
	id: 'yearn',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/yearn',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2020',
	team: 'Yearn DAO (Andre Cronje)',
	funding: 'Self-funded through protocol revenue',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/yearnfi',
		discord: 'https://discord.gg/yearn',
		github: 'https://github.com/yearn',
		docs: 'https://docs.yearn.finance'
	},

	// Related DeFi tools
	relatedTools: ['convex', 'curve', 'aave', 'compound', 'beefy'],

	lastUpdated: '2024-12-31'
};

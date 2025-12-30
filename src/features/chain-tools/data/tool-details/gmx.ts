/**
 * GMX Tool Detail
 *
 * Leading decentralized perpetual exchange
 */

import type { ToolDetail } from '../../types';

export const gmxDetail: ToolDetail = {
	id: 'gmx',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/gmx',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2021',
	team: 'Anonymous Team',
	funding: 'Self-funded',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/GMX_IO',
		discord: 'https://discord.com/invite/cxjZYR4gQK',
		github: 'https://github.com/gmx-io',
		docs: 'https://docs.gmx.io'
	},

	// Related tools
	relatedTools: ['dydx', 'gains', 'vertex', 'hyperliquid', 'level'],

	lastUpdated: '2024-12-30'
};

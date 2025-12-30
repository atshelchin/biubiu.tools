/**
 * Aave Tool Detail
 *
 * Leading decentralized lending protocol
 */

import type { ToolDetail } from '../../types';

export const aaveDetail: ToolDetail = {
	id: 'aave',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/aave',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2017',
	team: 'Aave Companies (Stani Kulechov)',
	funding: '$49M (Blockchain Capital, Standard Crypto, etc.)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/aaborsh',
		discord: 'https://discord.com/invite/aave',
		github: 'https://github.com/aave',
		docs: 'https://docs.aave.com'
	},

	// Related DeFi tools
	relatedTools: ['compound', 'maker', 'morpho', 'spark', 'euler'],

	lastUpdated: '2024-12-30'
};

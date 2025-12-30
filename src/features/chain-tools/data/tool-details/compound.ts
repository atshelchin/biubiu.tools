/**
 * Compound Tool Detail
 *
 * Pioneering algorithmic money market protocol
 */

import type { ToolDetail } from '../../types';

export const compoundDetail: ToolDetail = {
	id: 'compound',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/compound',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2017',
	team: 'Compound Labs (Robert Leshner)',
	funding: '$33M (a16z, Bain Capital Ventures, Polychain)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/compoundfinance',
		discord: 'https://discord.com/invite/compound',
		github: 'https://github.com/compound-finance',
		docs: 'https://docs.compound.finance'
	},

	// Related DeFi tools
	relatedTools: ['aave', 'maker', 'morpho', 'euler', 'venus'],

	lastUpdated: '2024-12-30'
};

/**
 * Base Tool Detail
 *
 * Coinbase's Layer 2 built on OP Stack
 */

import type { ToolDetail } from '../../types';

export const baseDetail: ToolDetail = {
	id: 'base',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/base',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2023',
	team: 'Coinbase',
	funding: 'Coinbase Backed',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/BuildOnBase',
		github: 'https://github.com/base-org',
		docs: 'https://docs.base.org'
	},

	// Related L2 tools
	relatedTools: ['optimism', 'arbitrum-one', 'zksync-era', 'mode'],

	lastUpdated: '2024-12'
};

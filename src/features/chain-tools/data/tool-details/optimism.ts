/**
 * Optimism Tool Detail
 *
 * Ethereum Layer 2 scaling solution using OP Stack
 */

import type { ToolDetail } from '../../types';

export const optimismDetail: ToolDetail = {
	id: 'optimism',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/optimism',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2019',
	team: 'OP Labs',
	funding: '$178M+',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/Optimism',
		github: 'https://github.com/ethereum-optimism',
		docs: 'https://docs.optimism.io'
	},

	// Related L2 tools
	relatedTools: ['base', 'arbitrum-one', 'zksync-era', 'mode'],

	lastUpdated: '2024-12'
};

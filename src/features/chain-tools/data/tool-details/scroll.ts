/**
 * Scroll Tool Detail
 *
 * EVM-equivalent ZK rollup for Ethereum scaling
 */

import type { ToolDetail } from '../../types';

export const scrollDetail: ToolDetail = {
	id: 'scroll',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/scroll',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2021',
	team: 'Scroll',
	funding: '$80M+',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/Scroll_ZKP',
		github: 'https://github.com/scroll-tech',
		docs: 'https://docs.scroll.io'
	},

	// Related ZK L2 tools
	relatedTools: ['zksync-era', 'starknet', 'polygon-zkevm', 'linea'],

	lastUpdated: '2024-12'
};

/**
 * Arbitrum One Tool Detail
 *
 * Leading Ethereum Layer 2 scaling solution using optimistic rollups
 */

import type { ToolDetail } from '../../types';

export const arbitrumDetail: ToolDetail = {
	id: 'arbitrum-one',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/arbitrum',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2021',
	team: 'Offchain Labs',
	funding: '$120M+ (Lightspeed, Pantera)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/arbitrum',
		discord: 'https://discord.gg/arbitrum',
		github: 'https://github.com/OffchainLabs',
		docs: 'https://docs.arbitrum.io'
	},

	// Related L2 tools
	relatedTools: ['optimism', 'base', 'zksync-era', 'polygon-zkevm'],

	lastUpdated: '2024-12'
};

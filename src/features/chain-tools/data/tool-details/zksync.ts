/**
 * zkSync Era Tool Detail
 *
 * Leading Ethereum Layer 2 scaling solution using ZK rollups
 */

import type { ToolDetail } from '../../types';

export const zksyncDetail: ToolDetail = {
	id: 'zksync-era',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/zksync',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2020',
	team: 'Matter Labs',
	funding: '$458M+ (a16z, Dragonfly)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/zksync',
		github: 'https://github.com/matter-labs',
		docs: 'https://docs.zksync.io'
	},

	// Related L2 tools
	relatedTools: ['starknet', 'scroll', 'polygon-zkevm', 'arbitrum-one'],

	lastUpdated: '2024-12'
};

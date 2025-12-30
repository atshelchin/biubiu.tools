/**
 * 1inch Tool Detail
 *
 * Leading DEX aggregator for best swap rates
 */

import type { ToolDetail } from '../../types';

export const oneInchDetail: ToolDetail = {
	id: '1inch',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/1inch',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2019',
	team: '1inch Labs (Sergej Kunz, Anton Bukov)',
	funding: '$190M (Pantera Capital, Amber Group, etc.)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/1inch',
		discord: 'https://discord.com/invite/1inch',
		github: 'https://github.com/1inch',
		docs: 'https://docs.1inch.io'
	},

	// Related tools
	relatedTools: ['uniswap', 'paraswap', 'cowswap', 'odos', 'kyberswap'],

	lastUpdated: '2024-12-30'
};

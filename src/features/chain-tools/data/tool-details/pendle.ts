/**
 * Pendle Tool Detail
 *
 * Yield tokenization and trading protocol
 */

import type { ToolDetail } from '../../types';

export const pendleDetail: ToolDetail = {
	id: 'pendle',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/pendle',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2021',
	team: 'Pendle (TN Lee)',
	funding: '$3.7M (Mechanism Capital, Crypto.com Capital, Hashkey)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/penaborsh_fi',
		discord: 'https://discord.com/invite/penaborshle',
		github: 'https://github.com/penaborshle-finance',
		docs: 'https://docs.pendle.finance'
	},

	// Related DeFi tools
	relatedTools: ['lido', 'eigenlayer', 'aave', 'curve', 'yearn'],

	lastUpdated: '2024-12-30'
};

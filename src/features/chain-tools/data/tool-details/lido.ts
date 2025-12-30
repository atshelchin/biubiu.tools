/**
 * Lido Tool Detail
 *
 * Leading liquid staking protocol
 */

import type { ToolDetail } from '../../types';

export const lidoDetail: ToolDetail = {
	id: 'lido',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/lido',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2020',
	team: 'Lido DAO',
	funding: '$73M (Paradigm, a16z, Coinbase Ventures, etc.)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/LidoFinance',
		discord: 'https://discord.com/invite/lido',
		github: 'https://github.com/lidofinance',
		docs: 'https://docs.lido.fi'
	},

	// Related tools
	relatedTools: ['rocketpool', 'eigenlayer', 'frax-ether', 'stader', 'stakewise'],

	lastUpdated: '2024-12-30'
};

/**
 * dYdX Tool Detail
 *
 * Leading decentralized derivatives exchange
 */

import type { ToolDetail } from '../../types';

export const dydxDetail: ToolDetail = {
	id: 'dydx',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/dydx',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2017',
	team: 'dYdX Trading Inc. (Antonio Juliano)',
	funding: '$87M (a16z, Polychain, Paradigm)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/dYdX',
		discord: 'https://discord.com/invite/dydx',
		github: 'https://github.com/dydxprotocol',
		docs: 'https://docs.dydx.exchange'
	},

	// Related DeFi tools
	relatedTools: ['gmx', 'hyperliquid', 'vertex', 'aevo', 'kwenta'],

	lastUpdated: '2024-12-30'
};

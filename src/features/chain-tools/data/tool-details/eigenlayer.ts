/**
 * EigenLayer Tool Detail
 *
 * Restaking protocol extending Ethereum's security
 */

import type { ToolDetail } from '../../types';

export const eigenlayerDetail: ToolDetail = {
	id: 'eigenlayer',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/eigenlayer',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2021',
	team: 'Eigen Labs (Sreeram Kannan)',
	funding: '$164.5M (a16z, Blockchain Capital, Polychain)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/eigenlayer',
		discord: 'https://discord.com/invite/eigenlayer',
		github: 'https://github.com/Layr-Labs',
		docs: 'https://docs.eigenlayer.xyz'
	},

	// Related DeFi tools
	relatedTools: ['lido', 'renzo', 'etherfi', 'puffer', 'kelp'],

	lastUpdated: '2024-12-30'
};

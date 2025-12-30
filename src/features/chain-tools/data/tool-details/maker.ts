/**
 * MakerDAO Tool Detail
 *
 * Decentralized stablecoin protocol behind DAI
 */

import type { ToolDetail } from '../../types';

export const makerDetail: ToolDetail = {
	id: 'maker',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/maker',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2014',
	team: 'MakerDAO (Rune Christensen)',
	funding: '$27.5M (a16z, Polychain Capital, 1confirmation)',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/MakerDAO',
		discord: 'https://discord.com/invite/RBRumCpEDH',
		github: 'https://github.com/makerdao',
		docs: 'https://docs.makerdao.com'
	},

	// Related DeFi tools
	relatedTools: ['aave', 'compound', 'spark', 'liquity', 'frax'],

	lastUpdated: '2024-12-30'
};

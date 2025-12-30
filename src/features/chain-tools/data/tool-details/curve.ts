/**
 * Curve Tool Detail
 *
 * Leading stablecoin and pegged asset DEX
 */

import type { ToolDetail } from '../../types';

export const curveDetail: ToolDetail = {
	id: 'curve',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/curve',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2020',
	team: 'Curve Finance (Michael Egorov)',
	funding: 'Self-funded / DAO',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/CurveFinance',
		discord: 'https://discord.gg/curve',
		github: 'https://github.com/curvefi',
		docs: 'https://resources.curve.fi'
	},

	// Related tools
	relatedTools: ['convex', 'uniswap', 'balancer', 'frax', 'yearn'],

	lastUpdated: '2024-12-30'
};

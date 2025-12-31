/**
 * CertiK Tool Detail
 *
 * Leading blockchain security firm with real-time monitoring and security audits
 */

import type { ToolDetail } from '../../types';

export const certikDetail: ToolDetail = {
	id: 'certik',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/certik',

	// Content counts for rendering
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,

	// Project info (factual, not translated)
	founded: '2018',
	team: 'CertiK',
	funding: '$230M+',

	// Social links
	socialLinks: {
		twitter: 'https://twitter.com/CertiK',
		github: 'https://github.com/CertiKProject',
		docs: 'https://www.certik.com/resources'
	},

	// Related security tools
	relatedTools: ['openzeppelin', 'immunefi', 'slowmist', 'hacken'],

	lastUpdated: '2024-12'
};

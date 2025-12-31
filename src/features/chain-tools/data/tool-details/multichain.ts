import type { ToolDetail } from '../../types';

export const multichainDetail: ToolDetail = {
	id: 'multichain',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/multichain',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Multichain (formerly Anyswap)',
	funding: '$60M+',
	socialLinks: {
		twitter: 'https://twitter.com/MultichainOrg',
		docs: 'https://docs.multichain.org/'
	},
	relatedTools: ['stargate', 'hop', 'celer', 'synapse'],
	lastUpdated: '2024-12'
};

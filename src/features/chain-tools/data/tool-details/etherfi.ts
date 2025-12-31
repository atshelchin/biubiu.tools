import type { ToolDetail } from '../../types';

export const etherfiDetail: ToolDetail = {
	id: 'etherfi',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/etherfi',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2023',
	team: 'Ether.fi',
	funding: '$32M+',
	socialLinks: {
		twitter: 'https://twitter.com/ether_fi',
		discord: 'https://discord.gg/etherfi',
		github: 'https://github.com/etherfi-protocol',
		docs: 'https://docs.ether.fi'
	},
	relatedTools: ['eigenlayer', 'lido', 'renzo', 'kelp'],
	lastUpdated: '2024-12'
};

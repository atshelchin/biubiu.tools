import type { ToolDetail } from '../../types';

export const synthetixDetail: ToolDetail = {
	id: 'synthetix',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/synthetix',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2017',
	team: 'Synthetix DAO',
	funding: '$32M (OTC rounds)',
	socialLinks: {
		twitter: 'https://twitter.com/synthetix_io',
		discord: 'https://discord.com/invite/KVeCZe6ahW',
		github: 'https://github.com/Synthetixio',
		docs: 'https://docs.synthetix.io'
	},
	relatedTools: ['gmx', 'dydx', 'pendle', 'curve'],
	lastUpdated: '2024-12'
};

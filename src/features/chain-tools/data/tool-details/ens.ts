import type { ToolDetail } from '../../types';

export const ensDetail: ToolDetail = {
	id: 'ens',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/ens',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2017',
	team: 'ENS Labs',
	funding: '$25M+ DAO',
	socialLinks: {
		twitter: 'https://twitter.com/ensdomains',
		discord: 'https://discord.gg/ensdomains',
		github: 'https://github.com/ensdomains',
		docs: 'https://docs.ens.domains'
	},
	relatedTools: ['unstoppabledomains', 'spaceid', 'lens', 'metamask'],
	lastUpdated: '2024-12'
};

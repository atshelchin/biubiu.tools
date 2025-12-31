import type { ToolDetail } from '../../types';

export const harvestDetail: ToolDetail = {
	id: 'harvest',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/harvest',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Harvest Finance',
	funding: 'Community Funded',
	socialLinks: {
		twitter: 'https://twitter.com/harvestfinance',
		discord: 'https://discord.gg/harvest',
		github: 'https://github.com/harvest-finance',
		docs: 'https://docs.harvest.finance'
	},
	relatedTools: ['yearn', 'convex', 'beefy', 'curve'],
	lastUpdated: '2024-12'
};

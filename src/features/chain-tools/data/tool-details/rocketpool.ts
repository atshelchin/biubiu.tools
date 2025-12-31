import type { ToolDetail } from '../../types';

export const rocketpoolDetail: ToolDetail = {
	id: 'rocketpool',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/rocketpool',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2016',
	team: 'Rocket Pool Pty Ltd',
	funding: 'Community funded',
	socialLinks: {
		twitter: 'https://twitter.com/Rocket_Pool',
		discord: 'https://discord.gg/rocketpool',
		github: 'https://github.com/rocket-pool',
		docs: 'https://docs.rocketpool.net'
	},
	relatedTools: ['lido', 'eigenlayer', 'aave', 'curve'],
	lastUpdated: '2024-12'
};

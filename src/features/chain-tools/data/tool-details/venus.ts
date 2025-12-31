import type { ToolDetail } from '../../types';

export const venusDetail: ToolDetail = {
	id: 'venus',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/venus',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Venus Protocol',
	funding: 'Community funded',
	socialLinks: {
		twitter: 'https://twitter.com/VenusProtocol',
		discord: 'https://discord.gg/venus',
		github: 'https://github.com/VenusProtocol',
		docs: 'https://docs.venus.io'
	},
	relatedTools: ['bnbchain', 'aave', 'compound', 'pancakeswap'],
	lastUpdated: '2024-12'
};

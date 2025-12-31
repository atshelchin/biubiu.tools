import type { ToolDetail } from '../../types';

export const worldcoinDetail: ToolDetail = {
	id: 'worldcoin',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/worldcoin',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2019',
	team: 'Tools for Humanity',
	funding: '$250M+',
	socialLinks: {
		twitter: 'https://twitter.com/worldcoin',
		discord: 'https://discord.gg/worldcoin',
		github: 'https://github.com/worldcoin',
		docs: 'https://docs.worldcoin.org'
	},
	relatedTools: ['optimism', 'ens', 'polygon-id', 'safe'],
	lastUpdated: '2024-12'
};

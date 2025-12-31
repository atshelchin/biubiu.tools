import type { ToolDetail } from '../../types';

export const gitcoinDetail: ToolDetail = {
	id: 'gitcoin',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/gitcoin',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2017',
	team: 'Gitcoin',
	funding: '$11M+',
	socialLinks: {
		twitter: 'https://twitter.com/gitcoin',
		discord: 'https://discord.gg/gitcoin',
		github: 'https://github.com/gitcoinco',
		docs: 'https://docs.gitcoin.co'
	},
	relatedTools: ['ens', 'safe', 'ethereum', 'allo'],
	lastUpdated: '2024-12'
};

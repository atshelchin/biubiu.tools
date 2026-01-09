import type { ToolDetail } from '../../types';

export const gitcoinGrantsDetail: ToolDetail = {
	id: 'gitcoin-grants',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/gitcoin-grants',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2019',
	team: 'Gitcoin',
	funding: '$11M+',
	socialLinks: {
		twitter: 'https://twitter.com/gitcoin',
		discord: 'https://discord.gg/gitcoin',
		github: 'https://github.com/gitcoinco/grants-stack',
		docs: 'https://docs.gitcoin.co/gitcoin-grants-protocol'
	},
	relatedTools: ['gitcoin', 'optimism-rpgf', 'arbitrum-grants', 'safe'],
	lastUpdated: '2025-01'
};

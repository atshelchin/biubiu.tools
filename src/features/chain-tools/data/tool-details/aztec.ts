import type { ToolDetail } from '../../types';

export const aztecDetail: ToolDetail = {
	id: 'aztec',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/aztec',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2017',
	team: 'Aztec Network',
	funding: '$119M+',
	socialLinks: {
		twitter: 'https://twitter.com/aztecnetwork',
		discord: 'https://discord.gg/aztec',
		github: 'https://github.com/AztecProtocol',
		docs: 'https://docs.aztec.network'
	},
	relatedTools: ['zksync', 'railgun', 'ethereum', 'noir'],
	lastUpdated: '2024-12'
};

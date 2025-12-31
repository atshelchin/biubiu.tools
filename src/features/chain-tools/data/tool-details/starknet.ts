import type { ToolDetail } from '../../types';

export const starknetDetail: ToolDetail = {
	id: 'starknet',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/starknet',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2018',
	team: 'StarkWare',
	funding: '$273M+',
	socialLinks: {
		twitter: 'https://twitter.com/Starknet',
		discord: 'https://discord.gg/starknet',
		github: 'https://github.com/starkware-libs',
		docs: 'https://docs.starknet.io'
	},
	relatedTools: ['zksync', 'scroll', 'polygon', 'loopring'],
	lastUpdated: '2024-12'
};

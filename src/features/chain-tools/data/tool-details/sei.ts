import type { ToolDetail } from '../../types';

export const seiDetail: ToolDetail = {
	id: 'sei',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/sei',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2022',
	team: 'Sei Labs',
	funding: '$30M+',
	socialLinks: {
		twitter: 'https://twitter.com/SeiNetwork',
		discord: 'https://discord.gg/sei',
		github: 'https://github.com/sei-protocol',
		docs: 'https://docs.sei.io'
	},
	relatedTools: ['solana', 'sui', 'aptos', 'injective'],
	lastUpdated: '2024-12'
};

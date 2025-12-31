import type { ToolDetail } from '../../types';

export const avalancheDetail: ToolDetail = {
	id: 'avalanche',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/avalanche',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Ava Labs',
	funding: '$290M+',
	socialLinks: {
		twitter: 'https://twitter.com/avaborar',
		discord: 'https://discord.gg/avalanche',
		github: 'https://github.com/ava-labs',
		docs: 'https://docs.avax.network'
	},
	relatedTools: ['polygon', 'solana', 'arbitrum', 'fantom'],
	lastUpdated: '2024-12'
};

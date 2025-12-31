import type { ToolDetail } from '../../types';

export const mantleDetail: ToolDetail = {
	id: 'mantle',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/mantle',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2023',
	team: 'Mantle',
	funding: 'BitDAO Treasury',
	socialLinks: {
		twitter: 'https://twitter.com/0xMantle',
		discord: 'https://discord.gg/mantle',
		github: 'https://github.com/mantlenetworkio',
		docs: 'https://docs.mantle.xyz'
	},
	relatedTools: ['arbitrum', 'optimism', 'base', 'linea'],
	lastUpdated: '2024-12'
};

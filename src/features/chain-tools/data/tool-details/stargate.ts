import type { ToolDetail } from '../../types';

export const stargateDetail: ToolDetail = {
	id: 'stargate',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/stargate',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2022',
	team: 'LayerZero Labs',
	funding: 'LayerZero Funded',
	socialLinks: {
		twitter: 'https://twitter.com/StargateFinance',
		github: 'https://github.com/stargate-protocol',
		docs: 'https://stargateprotocol.gitbook.io'
	},
	relatedTools: ['layerzero', 'across', 'hop', 'synapse'],
	lastUpdated: '2024-12'
};

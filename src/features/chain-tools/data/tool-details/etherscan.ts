import type { ToolDetail } from '../../types';

export const etherscanDetail: ToolDetail = {
	id: 'etherscan',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/etherscan',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2015',
	team: 'Etherscan',
	funding: 'Self-funded',
	socialLinks: {
		twitter: 'https://twitter.com/etherscan',
		docs: 'https://docs.etherscan.io'
	},
	relatedTools: ['blockscout', 'polygonscan', 'arbiscan', 'basescan'],
	lastUpdated: '2024-12'
};

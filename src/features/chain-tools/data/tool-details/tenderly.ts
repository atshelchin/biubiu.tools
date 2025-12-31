import type { ToolDetail } from '../../types';

export const tenderlyDetail: ToolDetail = {
	id: 'tenderly',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/tenderly',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2018',
	team: 'Tenderly',
	funding: '$40M+',
	socialLinks: {
		twitter: 'https://twitter.com/TenderlyApp',
		github: 'https://github.com/Tenderly',
		docs: 'https://docs.tenderly.co'
	},
	relatedTools: ['hardhat', 'foundry', 'alchemy', 'etherscan'],
	lastUpdated: '2024-12'
};

import type { ToolDetail } from '../../types';

export const hardhatDetail: ToolDetail = {
	id: 'hardhat',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/hardhat',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2019',
	team: 'Nomic Foundation',
	funding: 'Ethereum Foundation Grant',
	socialLinks: {
		twitter: 'https://twitter.com/HardhatHQ',
		github: 'https://github.com/NomicFoundation/hardhat',
		docs: 'https://hardhat.org/docs'
	},
	relatedTools: ['foundry', 'remix', 'tenderly', 'alchemy'],
	lastUpdated: '2024-12'
};

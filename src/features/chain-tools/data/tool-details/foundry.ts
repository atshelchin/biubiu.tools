import type { ToolDetail } from '../../types';

export const foundryDetail: ToolDetail = {
	id: 'foundry',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/foundry',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2021',
	team: 'Paradigm',
	funding: 'Paradigm Developed',
	socialLinks: {
		twitter: 'https://twitter.com/FoundryBook',
		github: 'https://github.com/foundry-rs',
		docs: 'https://book.getfoundry.sh'
	},
	relatedTools: ['hardhat', 'remix', 'tenderly', 'alchemy'],
	lastUpdated: '2024-12'
};

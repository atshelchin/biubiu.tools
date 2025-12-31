import type { ToolDetail } from '../../types';

export const infuraDetail: ToolDetail = {
	id: 'infura',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/infura',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2016',
	team: 'ConsenSys',
	funding: 'ConsenSys Backed',
	socialLinks: {
		twitter: 'https://twitter.com/Infura_io',
		github: 'https://github.com/INFURA',
		docs: 'https://docs.infura.io'
	},
	relatedTools: ['alchemy', 'quicknode', 'thegraph', 'moralis'],
	lastUpdated: '2024-12'
};

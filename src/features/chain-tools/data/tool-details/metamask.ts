import type { ToolDetail } from '../../types';

export const metamaskDetail: ToolDetail = {
	id: 'metamask',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/metamask',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2016',
	team: 'ConsenSys',
	funding: 'ConsenSys Backed',
	socialLinks: {
		twitter: 'https://twitter.com/MetaMask',
		github: 'https://github.com/MetaMask',
		docs: 'https://docs.metamask.io'
	},
	relatedTools: ['rainbow', 'rabby', 'coinbase-wallet', 'trust-wallet'],
	lastUpdated: '2024-12'
};

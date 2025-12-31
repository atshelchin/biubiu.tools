import type { ToolDetail } from '../../types';

export const moralisDetail: ToolDetail = {
	id: 'moralis',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/moralis',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Moralis',
	funding: '$50M+',
	socialLinks: {
		twitter: 'https://twitter.com/MoralisWeb3',
		discord: 'https://discord.gg/moralis',
		github: 'https://github.com/MoralisWeb3',
		docs: 'https://docs.moralis.io'
	},
	relatedTools: ['alchemy', 'thegraph', 'quicknode', 'infura'],
	lastUpdated: '2024-12'
};

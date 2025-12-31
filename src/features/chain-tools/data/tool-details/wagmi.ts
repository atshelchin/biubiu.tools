import type { ToolDetail } from '../../types';

export const wagmiDetail: ToolDetail = {
	id: 'wagmi',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/wagmi',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2022',
	team: 'wevm',
	funding: 'Community funded',
	socialLinks: {
		twitter: 'https://twitter.com/wagmi_sh',
		github: 'https://github.com/wevm/wagmi',
		docs: 'https://wagmi.sh/'
	},
	relatedTools: ['viem', 'rainbowkit', 'ethers', 'web3js'],
	lastUpdated: '2024-12'
};

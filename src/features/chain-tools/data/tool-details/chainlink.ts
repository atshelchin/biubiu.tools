import type { ToolDetail } from '../../types';

export const chainlinkDetail: ToolDetail = {
	id: 'chainlink',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/chainlink',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2017',
	team: 'Chainlink Labs',
	funding: '$32M (ICO + Rounds)',
	socialLinks: {
		twitter: 'https://twitter.com/chainlink',
		discord: 'https://discord.com/invite/chainlink',
		github: 'https://github.com/smartcontractkit/chainlink',
		docs: 'https://docs.chain.link'
	},
	relatedTools: ['pyth', 'api3', 'band-protocol', 'dia'],
	lastUpdated: '2024-12'
};

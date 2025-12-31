import type { ToolDetail } from '../../types';

export const nearDetail: ToolDetail = {
	id: 'near',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/near',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'NEAR Foundation',
	funding: '$500M+',
	socialLinks: {
		twitter: 'https://twitter.com/NEARProtocol',
		discord: 'https://discord.gg/near',
		github: 'https://github.com/near',
		docs: 'https://docs.near.org'
	},
	relatedTools: ['solana', 'sui', 'aptos', 'aurora'],
	lastUpdated: '2024-12'
};

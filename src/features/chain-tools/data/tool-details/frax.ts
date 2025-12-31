import type { ToolDetail } from '../../types';

export const fraxDetail: ToolDetail = {
	id: 'frax',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/frax',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Frax Finance',
	funding: 'Self-funded',
	socialLinks: {
		twitter: 'https://twitter.com/fraxfinance',
		discord: 'https://discord.com/invite/fraxfinance',
		github: 'https://github.com/FraxFinance',
		docs: 'https://docs.frax.finance'
	},
	relatedTools: ['curve', 'convex', 'maker', 'aave'],
	lastUpdated: '2024-12'
};

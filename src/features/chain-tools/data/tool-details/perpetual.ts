import type { ToolDetail } from '../../types';

export const perpetualDetail: ToolDetail = {
	id: 'perpetual',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/perpetual',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Perpetual Protocol',
	funding: '$9M+',
	socialLinks: {
		twitter: 'https://twitter.com/perpaboratory',
		discord: 'https://discord.gg/perpetualprotocol',
		github: 'https://github.com/perpetual-protocol',
		docs: 'https://docs.perp.com'
	},
	relatedTools: ['gmx', 'dydx', 'synthetix', 'optimism'],
	lastUpdated: '2024-12'
};

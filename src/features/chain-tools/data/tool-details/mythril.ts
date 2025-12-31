import type { ToolDetail } from '../../types';

export const mythrilDetail: ToolDetail = {
	id: 'mythril',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/mythril',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2017',
	team: 'Consensys Diligence',
	funding: 'Open source',
	socialLinks: {
		github: 'https://github.com/Consensys/mythril',
		docs: 'https://mythril-classic.readthedocs.io/'
	},
	relatedTools: ['slither', 'echidna', 'manticore', 'foundry'],
	lastUpdated: '2024-12'
};

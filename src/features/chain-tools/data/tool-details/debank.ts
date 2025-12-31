import type { ToolDetail } from '../../types';

export const debankDetail: ToolDetail = {
	id: 'debank',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/debank',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2019',
	team: 'DeBank',
	funding: '$25M (Sequoia China)',
	socialLinks: {
		twitter: 'https://twitter.com/DeBankDeFi',
		discord: 'https://discord.gg/debank',
		github: 'https://github.com/DeBankDeFi',
		docs: 'https://docs.cloud.debank.com'
	},
	relatedTools: ['zerion', 'zapper', 'nansen', 'rabby'],
	lastUpdated: '2024-12'
};

import type { ToolDetail } from '../../types';

export const aptosDetail: ToolDetail = {
	id: 'aptos',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/aptos',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2021',
	team: 'Aptos Labs',
	funding: '$350M+',
	socialLinks: {
		twitter: 'https://twitter.com/Aptos',
		discord: 'https://discord.gg/aptoslabs',
		github: 'https://github.com/aptos-labs',
		docs: 'https://aptos.dev'
	},
	relatedTools: ['sui', 'solana', 'sei', 'near'],
	lastUpdated: '2024-12'
};

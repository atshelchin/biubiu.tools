import type { ToolDetail } from '../../types';

export const solanaDetail: ToolDetail = {
	id: 'solana',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/solana',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Solana Labs',
	funding: '$335M+',
	socialLinks: {
		twitter: 'https://twitter.com/solana',
		discord: 'https://discord.gg/solana',
		github: 'https://github.com/solana-labs',
		docs: 'https://docs.solana.com'
	},
	relatedTools: ['sui', 'aptos', 'jupiter', 'phantom'],
	lastUpdated: '2024-12'
};

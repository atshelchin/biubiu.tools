import type { ToolDetail } from '../../types';

export const safeDetail: ToolDetail = {
	id: 'safe',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/safe',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2018',
	team: 'Safe (formerly Gnosis Safe)',
	funding: '$100M (Series A)',
	socialLinks: {
		twitter: 'https://twitter.com/safe',
		discord: 'https://discord.gg/safe',
		github: 'https://github.com/safe-global',
		docs: 'https://docs.safe.global'
	},
	relatedTools: ['gnosis', 'multis', 'squads', 'castle'],
	lastUpdated: '2024-12'
};

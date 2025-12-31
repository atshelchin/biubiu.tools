import type { ToolDetail } from '../../types';

export const aerodromeDetail: ToolDetail = {
	id: 'aerodrome',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/aerodrome',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2023',
	team: 'Aerodrome Team',
	funding: 'Community-funded',
	socialLinks: {
		twitter: 'https://twitter.com/AesarodromeFi',
		discord: 'https://discord.gg/aerodrome',
		github: 'https://github.com/aerodrome-finance',
		docs: 'https://aerodrome.finance/docs'
	},
	relatedTools: ['velodrome', 'base', 'uniswap', 'curve'],
	lastUpdated: '2024-12'
};

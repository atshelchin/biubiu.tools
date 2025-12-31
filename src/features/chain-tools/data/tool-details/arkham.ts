import type { ToolDetail } from '../../types';

export const arkhamDetail: ToolDetail = {
	id: 'arkham',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/arkham',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2020',
	team: 'Arkham Intelligence',
	funding: '$12M Series A',
	socialLinks: {
		twitter: 'https://twitter.com/ArkhamIntel',
		discord: 'https://discord.gg/arkham',
		docs: 'https://docs.arkhamintelligence.com'
	},
	relatedTools: ['nansen', 'chainalysis', 'elliptic', 'debank'],
	lastUpdated: '2024-12'
};

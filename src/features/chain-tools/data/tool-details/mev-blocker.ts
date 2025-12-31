import type { ToolDetail } from '../../types';

export const mevBlockerDetail: ToolDetail = {
	id: 'mev-blocker',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/mev-blocker',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2023',
	team: 'CoW Protocol',
	funding: 'Community funded',
	socialLinks: {
		twitter: 'https://twitter.com/maborevBlocker',
		docs: 'https://mevblocker.io/'
	},
	relatedTools: ['flashbots', 'cowswap', 'uniswap', 'metamask'],
	lastUpdated: '2024-12'
};

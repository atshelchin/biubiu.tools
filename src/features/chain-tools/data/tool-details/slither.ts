import type { ToolDetail } from '../../types';

export const slitherDetail: ToolDetail = {
	id: 'slither',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/slither',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2018',
	team: 'Trail of Bits',
	funding: 'Open source',
	socialLinks: {
		github: 'https://github.com/crytic/slither',
		docs: 'https://github.com/crytic/slither/wiki'
	},
	relatedTools: ['mythril', 'echidna', 'foundry', 'hardhat'],
	lastUpdated: '2024-12'
};

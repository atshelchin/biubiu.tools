import type { ToolDetail } from '../../types';

export const sparkDetail: ToolDetail = {
	id: 'spark',
	i18nKeyPrefix: 'routes/apps/chain-tools/tool/spark',
	featureCount: 6,
	useCaseCount: 5,
	faqCount: 5,
	founded: '2023',
	team: 'Phoenix Labs (MakerDAO)',
	funding: 'MakerDAO-backed',
	socialLinks: {
		twitter: 'https://twitter.com/sparkdotfi',
		discord: 'https://discord.gg/sparkprotocol',
		github: 'https://github.com/marsfoundation',
		docs: 'https://docs.spark.fi'
	},
	relatedTools: ['maker', 'aave', 'morpho', 'compound'],
	lastUpdated: '2024-12'
};

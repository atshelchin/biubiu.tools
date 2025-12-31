/**
 * Stablecoin Category Guide Data
 * Comprehensive guide to understanding and using stablecoins
 *
 * Content philosophy:
 * - Focus on practical knowledge and real-world use cases
 * - Explain different stablecoin mechanisms and trade-offs
 * - Highlight earning opportunities and risk management
 * - Emphasize the importance of understanding peg mechanisms
 */
import type { CategoryGuide } from '../../types';

export const stablecoinGuide: CategoryGuide = {
	categoryId: 'stablecoin',
	i18nKeyPrefix: 'routes/apps/chain-tools/stablecoin/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'usdc', context: 'fiat-backed stablecoin' },
				{ toolId: 'makerdao', context: 'crypto-collateralized stablecoin' }
			]
		},

		// Part 2: Stablecoin Types
		{
			id: 'stablecoin-types',
			titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.stablecoin_types.title',
			contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.stablecoin_types.content',
			subsections: [
				{
					id: 'fiat-backed',
					titleKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.stablecoin_types.fiat_backed.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.stablecoin_types.fiat_backed.content',
					toolMentions: [
						{ toolId: 'usdc', context: 'Circle-issued stablecoin' },
						{ toolId: 'usdt', context: 'Tether stablecoin' }
					]
				},
				{
					id: 'crypto-backed',
					titleKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.stablecoin_types.crypto_backed.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.stablecoin_types.crypto_backed.content',
					toolMentions: [
						{ toolId: 'makerdao', context: 'DAI issuer' },
						{ toolId: 'curve', context: 'crvUSD issuer' }
					]
				},
				{
					id: 'algorithmic',
					titleKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.stablecoin_types.algorithmic.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.stablecoin_types.algorithmic.content',
					toolMentions: [{ toolId: 'frax', context: 'fractional algorithmic stablecoin' }]
				}
			]
		},

		// Part 3: Major Stablecoins
		{
			id: 'major-stablecoins',
			titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.title',
			contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.content',
			subsections: [
				{
					id: 'usdt',
					titleKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.usdt.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.usdt.content',
					toolMentions: [{ toolId: 'usdt' }]
				},
				{
					id: 'usdc',
					titleKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.usdc.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.usdc.content',
					toolMentions: [{ toolId: 'usdc' }]
				},
				{
					id: 'dai',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.dai.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.dai.content',
					toolMentions: [{ toolId: 'makerdao' }]
				},
				{
					id: 'others',
					titleKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.others.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.major_stablecoins.others.content',
					toolMentions: [
						{ toolId: 'frax', context: 'FRAX' },
						{ toolId: 'curve', context: 'crvUSD' }
					]
				}
			]
		},

		// Part 4: Use Cases
		{
			id: 'use-cases',
			titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.title',
			contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.content',
			subsections: [
				{
					id: 'trading',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.trading.title',
					contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.trading.content'
				},
				{
					id: 'defi',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.defi.title',
					contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.defi.content',
					toolMentions: [{ toolId: 'aave' }, { toolId: 'curve' }]
				},
				{
					id: 'payments',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.payments.title',
					contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.payments.content'
				},
				{
					id: 'remittance',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.remittance.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.use_cases.remittance.content'
				}
			]
		},

		// Part 5: Earning Opportunities
		{
			id: 'yield-opportunities',
			titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.yield_opportunities.title',
			contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.yield_opportunities.content',
			subsections: [
				{
					id: 'lending',
					titleKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.yield_opportunities.lending.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.yield_opportunities.lending.content',
					toolMentions: [{ toolId: 'aave' }, { toolId: 'compound' }]
				},
				{
					id: 'liquidity-pools',
					titleKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.yield_opportunities.liquidity_pools.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.yield_opportunities.liquidity_pools.content',
					toolMentions: [{ toolId: 'curve' }, { toolId: 'uniswap' }]
				}
			]
		},

		// Part 6: Risks and Safety
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.risks.content',
			subsections: [
				{
					id: 'depeg-risk',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.risks.depeg_risk.title',
					contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.risks.depeg_risk.content'
				},
				{
					id: 'regulatory',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.risks.regulatory.title',
					contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.risks.regulatory.content'
				},
				{
					id: 'centralization',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.risks.centralization.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.risks.centralization.content',
					toolMentions: [{ toolId: 'usdc' }, { toolId: 'usdt' }]
				},
				{
					id: 'smart-contract',
					titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.risks.smart_contract.title',
					contentKey:
						'routes/apps/chain-tools/stablecoin/guide.sections.risks.smart_contract.content'
				}
			]
		},

		// Part 7: Monitoring Tools
		{
			id: 'tracking-tools',
			titleKey: 'routes/apps/chain-tools/stablecoin/guide.sections.tracking_tools.title',
			contentKey: 'routes/apps/chain-tools/stablecoin/guide.sections.tracking_tools.content',
			toolMentions: [
				{ toolId: 'defillama', context: 'TVL and stablecoin data' },
				{ toolId: 'curve', context: 'stablecoin swap analytics' }
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'stablecoin',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.stablecoin.term',
			definitionKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.stablecoin.definition',
			relatedToolIds: ['usdc', 'usdt', 'makerdao']
		},
		{
			id: 'peg',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.peg.term',
			definitionKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.peg.definition'
		},
		{
			id: 'depeg',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.depeg.term',
			definitionKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.depeg.definition'
		},
		{
			id: 'collateral-ratio',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.collateral_ratio.term',
			definitionKey:
				'routes/apps/chain-tools/stablecoin/guide.glossary.collateral_ratio.definition',
			relatedToolIds: ['makerdao', 'curve']
		},
		{
			id: 'overcollateralized',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.overcollateralized.term',
			definitionKey:
				'routes/apps/chain-tools/stablecoin/guide.glossary.overcollateralized.definition',
			relatedToolIds: ['makerdao']
		},
		{
			id: 'algorithmic-stablecoin',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.algorithmic_stablecoin.term',
			definitionKey:
				'routes/apps/chain-tools/stablecoin/guide.glossary.algorithmic_stablecoin.definition',
			relatedToolIds: ['frax']
		},
		{
			id: 'fiat-backed',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.fiat_backed.term',
			definitionKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.fiat_backed.definition',
			relatedToolIds: ['usdc', 'usdt']
		},
		{
			id: 'cdp',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.cdp.term',
			definitionKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.cdp.definition',
			relatedToolIds: ['makerdao']
		},
		{
			id: 'psm',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.psm.term',
			definitionKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.psm.definition',
			relatedToolIds: ['makerdao']
		},
		{
			id: 'stability-fee',
			termKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.stability_fee.term',
			definitionKey: 'routes/apps/chain-tools/stablecoin/guide.glossary.stability_fee.definition',
			relatedToolIds: ['makerdao']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: ['usdc', 'usdt', 'makerdao', 'frax', 'curve', 'aave', 'defillama', 'compound'],

	lastUpdated: '2025-12-31'
};

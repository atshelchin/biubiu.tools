/**
 * DeFi Category Guide Data
 * Long-form educational article with real examples and case studies
 *
 * Content philosophy:
 * - Focus on understanding, not just listing tools
 * - Include real on-chain examples with verifiable sources
 * - Emphasize practical opportunities (earning, arbitrage, etc.)
 * - Progressive learning from basics to advanced strategies
 */
import type { CategoryGuide } from '../../types';

export const defiGuide: CategoryGuide = {
	categoryId: 'defi',
	i18nKeyPrefix: 'routes/apps/chain-tools/defi/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Understanding DeFi
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/defi/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/defi/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'defillama', context: 'tracking TVL' },
				{ toolId: 'etherscan', context: 'viewing transactions' }
			]
		},
		{
			id: 'why-defi',
			titleKey: 'routes/apps/chain-tools/defi/guide.sections.why_defi.title',
			contentKey: 'routes/apps/chain-tools/defi/guide.sections.why_defi.content',
			subsections: [
				{
					id: 'vs-tradfi',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.why_defi.vs_tradfi.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.why_defi.vs_tradfi.content'
				},
				{
					id: 'opportunities',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.why_defi.opportunities.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.why_defi.opportunities.content'
				}
			]
		},

		// Part 2: Core Concepts
		{
			id: 'core-concepts',
			titleKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.title',
			contentKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.content',
			subsections: [
				{
					id: 'liquidity',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.liquidity.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.liquidity.content',
					toolMentions: [
						{ toolId: 'uniswap', context: 'AMM pioneer' },
						{ toolId: 'curve', context: 'stablecoin liquidity' }
					]
				},
				{
					id: 'amm',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.amm.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.amm.content',
					toolMentions: [{ toolId: 'uniswap' }, { toolId: 'balancer' }]
				},
				{
					id: 'lending',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.lending.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.lending.content',
					toolMentions: [
						{ toolId: 'aave', context: 'largest lending protocol' },
						{ toolId: 'compound', context: 'pioneered cTokens' }
					]
				},
				{
					id: 'stablecoins',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.core_concepts.stablecoins.title',
					contentKey:
						'routes/apps/chain-tools/defi/guide.sections.core_concepts.stablecoins.content',
					toolMentions: [
						{ toolId: 'makerdao', context: 'DAI issuer' },
						{ toolId: 'usdc', context: 'centralized stablecoin' }
					]
				}
			]
		},

		// Part 3: Practical Operations
		{
			id: 'getting-started',
			titleKey: 'routes/apps/chain-tools/defi/guide.sections.getting_started.title',
			contentKey: 'routes/apps/chain-tools/defi/guide.sections.getting_started.content',
			subsections: [
				{
					id: 'first-swap',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.getting_started.first_swap.title',
					contentKey:
						'routes/apps/chain-tools/defi/guide.sections.getting_started.first_swap.content',
					toolMentions: [{ toolId: 'uniswap' }, { toolId: '1inch' }]
				},
				{
					id: 'first-deposit',
					titleKey:
						'routes/apps/chain-tools/defi/guide.sections.getting_started.first_deposit.title',
					contentKey:
						'routes/apps/chain-tools/defi/guide.sections.getting_started.first_deposit.content',
					toolMentions: [{ toolId: 'aave' }]
				},
				{
					id: 'gas-optimization',
					titleKey:
						'routes/apps/chain-tools/defi/guide.sections.getting_started.gas_optimization.title',
					contentKey:
						'routes/apps/chain-tools/defi/guide.sections.getting_started.gas_optimization.content'
				}
			]
		},

		// Part 4: Earning Opportunities (Key section!)
		{
			id: 'earning',
			titleKey: 'routes/apps/chain-tools/defi/guide.sections.earning.title',
			contentKey: 'routes/apps/chain-tools/defi/guide.sections.earning.content',
			subsections: [
				{
					id: 'yield-farming',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.earning.yield_farming.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.earning.yield_farming.content',
					toolMentions: [
						{ toolId: 'yearn', context: 'automated yield' },
						{ toolId: 'convex', context: 'Curve yield boost' }
					]
				},
				{
					id: 'liquidity-providing',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.earning.liquidity_providing.title',
					contentKey:
						'routes/apps/chain-tools/defi/guide.sections.earning.liquidity_providing.content',
					toolMentions: [{ toolId: 'uniswap' }, { toolId: 'curve' }]
				},
				{
					id: 'lending-interest',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.earning.lending_interest.title',
					contentKey:
						'routes/apps/chain-tools/defi/guide.sections.earning.lending_interest.content',
					toolMentions: [{ toolId: 'aave' }, { toolId: 'compound' }]
				}
			]
		},

		// Part 5: Advanced Strategies (Flash loans, arbitrage, etc.)
		{
			id: 'advanced',
			titleKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.title',
			contentKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.content',
			subsections: [
				{
					id: 'flash-loans',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.flash_loans.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.flash_loans.content',
					toolMentions: [
						{ toolId: 'aave', context: 'flash loan provider' },
						{ toolId: 'dydx', context: 'flash loan provider' }
					],
					caseStudies: [
						{
							id: 'bzx-flash-loan',
							titleKey:
								'routes/apps/chain-tools/defi/guide.sections.advanced.flash_loans.case_bzx.title',
							descriptionKey:
								'routes/apps/chain-tools/defi/guide.sections.advanced.flash_loans.case_bzx.description',
							txHash: '0xb5c8bd9430b6cc87a0e2fe110ece6bf527fa4f170a4bc8cd032f768fc5219838',
							date: '2020-02-15',
							profit: '~$350,000',
							sourceUrl:
								'https://peckshield.medium.com/bzx-hack-full-disclosure-with-detailed-profit-analysis-e6b1fa9b18fc',
							relatedToolIds: ['aave', 'uniswap', 'compound']
						}
					]
				},
				{
					id: 'arbitrage',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.arbitrage.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.arbitrage.content',
					toolMentions: [{ toolId: '1inch' }, { toolId: 'uniswap' }, { toolId: 'curve' }],
					caseStudies: [
						{
							id: 'dex-arb-example',
							titleKey:
								'routes/apps/chain-tools/defi/guide.sections.advanced.arbitrage.case_dex.title',
							descriptionKey:
								'routes/apps/chain-tools/defi/guide.sections.advanced.arbitrage.case_dex.description',
							duneQuery: 'https://dune.com/queries/1234567',
							relatedToolIds: ['uniswap', 'sushiswap']
						}
					]
				},
				{
					id: 'liquidations',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.liquidations.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.liquidations.content',
					toolMentions: [{ toolId: 'aave' }, { toolId: 'compound' }, { toolId: 'makerdao' }]
				},
				{
					id: 'mev',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.mev.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.advanced.mev.content',
					toolMentions: [{ toolId: 'flashbots' }]
				}
			]
		},

		// Part 6: Risks and Safety
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/defi/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/defi/guide.sections.risks.content',
			subsections: [
				{
					id: 'smart-contract-risk',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.risks.smart_contract.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.risks.smart_contract.content'
				},
				{
					id: 'impermanent-loss',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.risks.impermanent_loss.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.risks.impermanent_loss.content'
				},
				{
					id: 'rug-pulls',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.risks.rug_pulls.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.risks.rug_pulls.content'
				},
				{
					id: 'dyor',
					titleKey: 'routes/apps/chain-tools/defi/guide.sections.risks.dyor.title',
					contentKey: 'routes/apps/chain-tools/defi/guide.sections.risks.dyor.content',
					toolMentions: [
						{ toolId: 'defillama', context: 'check TVL and stats' },
						{ toolId: 'etherscan', context: 'verify contracts' }
					]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'amm',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.amm.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.amm.definition',
			relatedToolIds: ['uniswap', 'curve', 'balancer']
		},
		{
			id: 'tvl',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.tvl.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.tvl.definition',
			relatedToolIds: ['defillama']
		},
		{
			id: 'liquidity-pool',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.liquidity_pool.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.liquidity_pool.definition',
			relatedToolIds: ['uniswap', 'curve']
		},
		{
			id: 'impermanent-loss',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.impermanent_loss.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.impermanent_loss.definition',
			relatedToolIds: ['uniswap']
		},
		{
			id: 'flash-loan',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.flash_loan.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.flash_loan.definition',
			relatedToolIds: ['aave', 'dydx']
		},
		{
			id: 'collateral',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.collateral.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.collateral.definition',
			relatedToolIds: ['aave', 'compound', 'makerdao']
		},
		{
			id: 'liquidation',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.liquidation.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.liquidation.definition',
			relatedToolIds: ['aave', 'compound', 'makerdao']
		},
		{
			id: 'apy',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.apy.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.apy.definition'
		},
		{
			id: 'slippage',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.slippage.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.slippage.definition',
			relatedToolIds: ['uniswap', '1inch']
		},
		{
			id: 'yield-farming',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.yield_farming.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.yield_farming.definition',
			relatedToolIds: ['yearn', 'convex']
		},
		{
			id: 'mev',
			termKey: 'routes/apps/chain-tools/defi/guide.glossary.mev.term',
			definitionKey: 'routes/apps/chain-tools/defi/guide.glossary.mev.definition',
			relatedToolIds: ['flashbots']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'uniswap',
		'aave',
		'curve',
		'makerdao',
		'1inch',
		'yearn',
		'compound',
		'defillama'
	],

	lastUpdated: '2025-12-31'
};

/**
 * Analytics Category Guide Data
 * Comprehensive guide to blockchain analytics and on-chain intelligence
 *
 * Content philosophy:
 * - Cover the full spectrum of blockchain data analysis
 * - Include practical techniques for research and trading
 * - Explain how to use various analytics tools effectively
 * - Progressive learning from basic metrics to advanced analysis
 */
import type { CategoryGuide } from '../../types';

export const analyticsGuide: CategoryGuide = {
	categoryId: 'analytics',
	i18nKeyPrefix: 'routes/apps/chain-tools/analytics/guide',
	estimatedReadTime: '25 min',

	sections: [
		// Part 1: Introduction to Blockchain Analytics
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'dune', context: 'SQL-based analytics' },
				{ toolId: 'defillama', context: 'DeFi metrics' }
			]
		},
		{
			id: 'analytics-basics',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.analytics_basics.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.analytics_basics.content',
			subsections: [
				{
					id: 'why-analytics',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.analytics_basics.why_analytics.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.analytics_basics.why_analytics.content'
				},
				{
					id: 'data-types',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.analytics_basics.data_types.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.analytics_basics.data_types.content'
				},
				{
					id: 'key-metrics',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.analytics_basics.key_metrics.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.analytics_basics.key_metrics.content',
					toolMentions: [
						{ toolId: 'defillama', context: 'TVL tracking' },
						{ toolId: 'token-terminal', context: 'protocol revenue' }
					]
				}
			]
		},

		// Part 2: DeFi Analytics
		{
			id: 'defi-analytics',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.defi_analytics.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.defi_analytics.content',
			subsections: [
				{
					id: 'tvl-analysis',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.defi_analytics.tvl_analysis.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.defi_analytics.tvl_analysis.content',
					toolMentions: [{ toolId: 'defillama', context: 'comprehensive TVL' }]
				},
				{
					id: 'protocol-metrics',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.defi_analytics.protocol_metrics.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.defi_analytics.protocol_metrics.content',
					toolMentions: [
						{ toolId: 'token-terminal', context: 'revenue metrics' },
						{ toolId: 'artemis', context: 'developer activity' }
					]
				},
				{
					id: 'yield-analysis',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.defi_analytics.yield_analysis.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.defi_analytics.yield_analysis.content',
					toolMentions: [{ toolId: 'defillama_yields', context: 'yield comparison' }]
				}
			]
		},

		// Part 3: Wallet & Whale Tracking
		{
			id: 'wallet-tracking',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.wallet_tracking.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.wallet_tracking.content',
			subsections: [
				{
					id: 'smart-money',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.wallet_tracking.smart_money.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.wallet_tracking.smart_money.content',
					toolMentions: [
						{ toolId: 'nansen', context: 'smart money labels' },
						{ toolId: 'arkham', context: 'wallet intelligence' }
					]
				},
				{
					id: 'whale-watching',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.wallet_tracking.whale_watching.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.wallet_tracking.whale_watching.content',
					toolMentions: [
						{ toolId: 'whale-alert', context: 'large transfers' },
						{ toolId: 'cielo', context: 'wallet feeds' }
					]
				},
				{
					id: 'holder-distribution',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.wallet_tracking.holder_distribution.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.wallet_tracking.holder_distribution.content',
					toolMentions: [{ toolId: 'bubblemaps', context: 'token distribution' }]
				}
			]
		},

		// Part 4: DEX & Trading Analytics
		{
			id: 'trading-analytics',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.trading_analytics.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.trading_analytics.content',
			subsections: [
				{
					id: 'dex-analysis',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.trading_analytics.dex_analysis.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.trading_analytics.dex_analysis.content',
					toolMentions: [
						{ toolId: 'dexscreener', context: 'real-time charts' },
						{ toolId: 'defined', context: 'trending tokens' }
					]
				},
				{
					id: 'token-discovery',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.trading_analytics.token_discovery.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.trading_analytics.token_discovery.content',
					toolMentions: [{ toolId: 'dexscreener', context: 'new pairs' }]
				},
				{
					id: 'derivatives',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.trading_analytics.derivatives.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.trading_analytics.derivatives.content',
					toolMentions: [{ toolId: 'laevitas', context: 'options analytics' }]
				}
			]
		},

		// Part 5: On-Chain Analytics
		{
			id: 'onchain-analytics',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.onchain_analytics.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.onchain_analytics.content',
			subsections: [
				{
					id: 'network-metrics',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.onchain_analytics.network_metrics.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.onchain_analytics.network_metrics.content',
					toolMentions: [
						{ toolId: 'glassnode', context: 'Bitcoin/Ethereum metrics' },
						{ toolId: 'santiment', context: 'social + on-chain' }
					]
				},
				{
					id: 'eth-specific',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.onchain_analytics.eth_specific.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.onchain_analytics.eth_specific.content',
					toolMentions: [
						{ toolId: 'ultrasound', context: 'ETH burn tracking' },
						{ toolId: 'ethburned', context: 'EIP-1559 stats' }
					]
				},
				{
					id: 'l2-analytics',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.onchain_analytics.l2_analytics.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.onchain_analytics.l2_analytics.content',
					toolMentions: [
						{ toolId: 'l2beat', context: 'L2 TVL and risk' },
						{ toolId: 'growthepie', context: 'L2 metrics' },
						{ toolId: 'l2fees', context: 'fee comparison' }
					]
				}
			]
		},

		// Part 6: SQL Analytics & Dashboards
		{
			id: 'sql-analytics',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.sql_analytics.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.sql_analytics.content',
			subsections: [
				{
					id: 'dune-intro',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.sql_analytics.dune_intro.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.sql_analytics.dune_intro.content',
					toolMentions: [{ toolId: 'dune', context: 'SQL analytics' }]
				},
				{
					id: 'other-platforms',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.sql_analytics.other_platforms.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.sql_analytics.other_platforms.content',
					toolMentions: [
						{ toolId: 'flipside', context: 'alternative to Dune' },
						{ toolId: 'footprint', context: 'no-code option' }
					]
				},
				{
					id: 'building-dashboards',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.sql_analytics.building_dashboards.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.sql_analytics.building_dashboards.content'
				}
			]
		},

		// Part 7: Data Infrastructure
		{
			id: 'data-infrastructure',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.data_infrastructure.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.data_infrastructure.content',
			subsections: [
				{
					id: 'indexing',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.data_infrastructure.indexing.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.data_infrastructure.indexing.content',
					toolMentions: [{ toolId: 'the_graph', context: 'decentralized indexing' }]
				},
				{
					id: 'data-providers',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.data_infrastructure.data_providers.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.data_infrastructure.data_providers.content',
					toolMentions: [
						{ toolId: 'allium', context: 'real-time data' },
						{ toolId: 'bitquery', context: 'GraphQL APIs' }
					]
				},
				{
					id: 'enterprise',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.data_infrastructure.enterprise.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.data_infrastructure.enterprise.content',
					toolMentions: [
						{ toolId: 'kaiko', context: 'institutional data' },
						{ toolId: 'amberdata', context: 'enterprise APIs' }
					]
				}
			]
		},

		// Part 8: Research & Due Diligence
		{
			id: 'research',
			titleKey: 'routes/apps/chain-tools/analytics/guide.sections.research.title',
			contentKey: 'routes/apps/chain-tools/analytics/guide.sections.research.content',
			subsections: [
				{
					id: 'protocol-research',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.research.protocol_research.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.research.protocol_research.content',
					toolMentions: [{ toolId: 'messari', context: 'research reports' }]
				},
				{
					id: 'token-analysis',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.research.token_analysis.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.research.token_analysis.content',
					toolMentions: [
						{ toolId: 'coingecko', context: 'token data' },
						{ toolId: 'intotheblock', context: 'on-chain signals' }
					]
				},
				{
					id: 'risk-assessment',
					titleKey:
						'routes/apps/chain-tools/analytics/guide.sections.research.risk_assessment.title',
					contentKey:
						'routes/apps/chain-tools/analytics/guide.sections.research.risk_assessment.content',
					toolMentions: [{ toolId: 'l2beat', context: 'L2 risk analysis' }]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'tvl',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.tvl.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.tvl.definition',
			relatedToolIds: ['defillama', 'l2beat']
		},
		{
			id: 'mcap-fdv',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.mcap_fdv.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.mcap_fdv.definition',
			relatedToolIds: ['coingecko', 'coinmarketcap']
		},
		{
			id: 'smart-money',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.smart_money.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.smart_money.definition',
			relatedToolIds: ['nansen', 'arkham']
		},
		{
			id: 'whale',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.whale.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.whale.definition',
			relatedToolIds: ['whale-alert', 'bubblemaps']
		},
		{
			id: 'holder-distribution',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.holder_distribution.term',
			definitionKey:
				'routes/apps/chain-tools/analytics/guide.glossary.holder_distribution.definition',
			relatedToolIds: ['bubblemaps']
		},
		{
			id: 'protocol-revenue',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.protocol_revenue.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.protocol_revenue.definition',
			relatedToolIds: ['token-terminal', 'artemis']
		},
		{
			id: 'apy-apr',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.apy_apr.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.apy_apr.definition',
			relatedToolIds: ['defillama_yields']
		},
		{
			id: 'subgraph',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.subgraph.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.subgraph.definition',
			relatedToolIds: ['the_graph']
		},
		{
			id: 'dau-mau',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.dau_mau.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.dau_mau.definition',
			relatedToolIds: ['dappradar', 'artemis']
		},
		{
			id: 'open-interest',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.open_interest.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.open_interest.definition',
			relatedToolIds: ['laevitas']
		},
		{
			id: 'funding-rate',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.funding_rate.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.funding_rate.definition',
			relatedToolIds: ['laevitas']
		},
		{
			id: 'gas-burn',
			termKey: 'routes/apps/chain-tools/analytics/guide.glossary.gas_burn.term',
			definitionKey: 'routes/apps/chain-tools/analytics/guide.glossary.gas_burn.definition',
			relatedToolIds: ['ultrasound', 'ethburned']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'dune',
		'defillama',
		'nansen',
		'arkham',
		'dexscreener',
		'glassnode',
		'l2beat',
		'the_graph'
	],

	lastUpdated: '2025-12-31'
};

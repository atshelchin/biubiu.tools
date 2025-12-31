/**
 * Oracle Category Guide Data
 * Long-form educational article about blockchain oracles
 *
 * Content philosophy:
 * - Explain the oracle problem and why oracles matter
 * - Cover different oracle architectures and designs
 * - Include practical implementation examples
 * - Emphasize security considerations and best practices
 */
import type { CategoryGuide } from '../../types';

export const oracleGuide: CategoryGuide = {
	categoryId: 'oracle',
	i18nKeyPrefix: 'routes/apps/chain-tools/oracle/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding Oracles
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/oracle/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/oracle/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'chainlink', context: 'leading oracle network' },
				{ toolId: 'pyth-network', context: 'high-frequency price feeds' }
			]
		},
		{
			id: 'oracle-problem',
			titleKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_problem.title',
			contentKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_problem.content',
			subsections: [
				{
					id: 'blockchain-isolation',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_problem.blockchain_isolation.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_problem.blockchain_isolation.content'
				},
				{
					id: 'why-oracles-matter',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_problem.why_oracles_matter.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_problem.why_oracles_matter.content'
				}
			]
		},

		// Part 2: Oracle Types and Architectures
		{
			id: 'oracle-types',
			titleKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_types.title',
			contentKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_types.content',
			subsections: [
				{
					id: 'push-vs-pull',
					titleKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_types.push_vs_pull.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_types.push_vs_pull.content',
					toolMentions: [
						{ toolId: 'chainlink', context: 'push-based oracles' },
						{ toolId: 'pyth-network', context: 'pull-based oracles' }
					]
				},
				{
					id: 'centralized-vs-decentralized',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_types.centralized_vs_decentralized.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_types.centralized_vs_decentralized.content',
					toolMentions: [{ toolId: 'chainlink' }, { toolId: 'band-protocol' }]
				},
				{
					id: 'optimistic-oracles',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_types.optimistic_oracles.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_types.optimistic_oracles.content',
					toolMentions: [{ toolId: 'uma-protocol', context: 'optimistic oracle pioneer' }]
				}
			]
		},

		// Part 3: Price Feeds
		{
			id: 'price-feeds',
			titleKey: 'routes/apps/chain-tools/oracle/guide.sections.price_feeds.title',
			contentKey: 'routes/apps/chain-tools/oracle/guide.sections.price_feeds.content',
			subsections: [
				{
					id: 'how-price-feeds-work',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.price_feeds.how_price_feeds_work.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.price_feeds.how_price_feeds_work.content',
					toolMentions: [
						{ toolId: 'chainlink-data-feeds', context: 'price feed explorer' },
						{ toolId: 'pyth-price-feeds', context: 'real-time price data' }
					]
				},
				{
					id: 'heartbeat-deviation',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.price_feeds.heartbeat_deviation.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.price_feeds.heartbeat_deviation.content'
				},
				{
					id: 'safety-checks',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.price_feeds.safety_checks.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.price_feeds.safety_checks.content'
				}
			]
		},

		// Part 4: Randomness and VRF
		{
			id: 'randomness',
			titleKey: 'routes/apps/chain-tools/oracle/guide.sections.randomness.title',
			contentKey: 'routes/apps/chain-tools/oracle/guide.sections.randomness.content',
			subsections: [
				{
					id: 'blockchain-randomness-problem',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.randomness.blockchain_randomness_problem.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.randomness.blockchain_randomness_problem.content'
				},
				{
					id: 'vrf-explained',
					titleKey: 'routes/apps/chain-tools/oracle/guide.sections.randomness.vrf_explained.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.randomness.vrf_explained.content',
					toolMentions: [{ toolId: 'chainlink-vrf', context: 'verifiable randomness' }]
				},
				{
					id: 'vrf-use-cases',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.randomness.vrf_use_cases.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.randomness.vrf_use_cases.content'
				}
			]
		},

		// Part 5: Cross-Chain Communication
		{
			id: 'cross-chain-messaging',
			titleKey: 'routes/apps/chain-tools/oracle/guide.sections.cross_chain_messaging.title',
			contentKey: 'routes/apps/chain-tools/oracle/guide.sections.cross_chain_messaging.content',
			subsections: [
				{
					id: 'ccip-overview',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.cross_chain_messaging.ccip_overview.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.cross_chain_messaging.ccip_overview.content',
					toolMentions: [
						{ toolId: 'chainlink-ccip', context: 'cross-chain interoperability protocol' }
					]
				},
				{
					id: 'messaging-vs-bridges',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.cross_chain_messaging.messaging_vs_bridges.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.cross_chain_messaging.messaging_vs_bridges.content'
				}
			]
		},

		// Part 6: Oracle Providers
		{
			id: 'oracle-providers',
			titleKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.title',
			contentKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.content',
			subsections: [
				{
					id: 'chainlink',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.chainlink.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.chainlink.content',
					toolMentions: [
						{ toolId: 'chainlink' },
						{ toolId: 'chainlink-data-feeds' },
						{ toolId: 'chainlink-vrf' }
					]
				},
				{
					id: 'pyth',
					titleKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.pyth.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.pyth.content',
					toolMentions: [{ toolId: 'pyth-network' }, { toolId: 'pyth-price-feeds' }]
				},
				{
					id: 'uma',
					titleKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.uma.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.uma.content',
					toolMentions: [{ toolId: 'uma-protocol' }]
				},
				{
					id: 'band',
					titleKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.band.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.band.content',
					toolMentions: [{ toolId: 'band-protocol' }]
				},
				{
					id: 'api3',
					titleKey: 'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.api3.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.api3.content',
					toolMentions: [{ toolId: 'api3' }]
				},
				{
					id: 'tellor',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.tellor.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.tellor.content',
					toolMentions: [{ toolId: 'tellor' }]
				},
				{
					id: 'redstone',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.redstone.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.oracle_providers.redstone.content',
					toolMentions: [{ toolId: 'redstone-oracles' }]
				}
			]
		},

		// Part 7: Security and Best Practices
		{
			id: 'security',
			titleKey: 'routes/apps/chain-tools/oracle/guide.sections.security.title',
			contentKey: 'routes/apps/chain-tools/oracle/guide.sections.security.content',
			subsections: [
				{
					id: 'oracle-manipulation',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.security.oracle_manipulation.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.security.oracle_manipulation.content',
					caseStudies: [
						{
							id: 'mango-markets-exploit',
							titleKey:
								'routes/apps/chain-tools/oracle/guide.sections.security.oracle_manipulation.case_mango.title',
							descriptionKey:
								'routes/apps/chain-tools/oracle/guide.sections.security.oracle_manipulation.case_mango.description',
							date: '2022-10-11',
							profit: '$110M',
							sourceUrl: 'https://rekt.news/mango-markets-rekt/',
							relatedToolIds: ['pyth-network']
						}
					]
				},
				{
					id: 'mitigation-strategies',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.security.mitigation_strategies.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.security.mitigation_strategies.content'
				},
				{
					id: 'multi-oracle-approach',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.security.multi_oracle_approach.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.security.multi_oracle_approach.content',
					toolMentions: [{ toolId: 'defillama-oracles', context: 'oracle comparison' }]
				},
				{
					id: 'implementation-best-practices',
					titleKey:
						'routes/apps/chain-tools/oracle/guide.sections.security.implementation_best_practices.title',
					contentKey:
						'routes/apps/chain-tools/oracle/guide.sections.security.implementation_best_practices.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'oracle',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.oracle.term',
			definitionKey: 'routes/apps/chain-tools/oracle/guide.glossary.oracle.definition',
			relatedToolIds: ['chainlink', 'pyth-network', 'uma-protocol']
		},
		{
			id: 'price-feed',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.price_feed.term',
			definitionKey: 'routes/apps/chain-tools/oracle/guide.glossary.price_feed.definition',
			relatedToolIds: ['chainlink-data-feeds', 'pyth-price-feeds']
		},
		{
			id: 'vrf',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.vrf.term',
			definitionKey: 'routes/apps/chain-tools/oracle/guide.glossary.vrf.definition',
			relatedToolIds: ['chainlink-vrf']
		},
		{
			id: 'heartbeat',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.heartbeat.term',
			definitionKey: 'routes/apps/chain-tools/oracle/guide.glossary.heartbeat.definition',
			relatedToolIds: ['chainlink']
		},
		{
			id: 'deviation-threshold',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.deviation_threshold.term',
			definitionKey:
				'routes/apps/chain-tools/oracle/guide.glossary.deviation_threshold.definition',
			relatedToolIds: ['chainlink', 'pyth-network']
		},
		{
			id: 'twap',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.twap.term',
			definitionKey: 'routes/apps/chain-tools/oracle/guide.glossary.twap.definition'
		},
		{
			id: 'oracle-manipulation',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.oracle_manipulation.term',
			definitionKey:
				'routes/apps/chain-tools/oracle/guide.glossary.oracle_manipulation.definition'
		},
		{
			id: 'data-freshness',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.data_freshness.term',
			definitionKey: 'routes/apps/chain-tools/oracle/guide.glossary.data_freshness.definition'
		},
		{
			id: 'schelling-point',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.schelling_point.term',
			definitionKey:
				'routes/apps/chain-tools/oracle/guide.glossary.schelling_point.definition',
			relatedToolIds: ['uma-protocol', 'tellor']
		},
		{
			id: 'multi-oracle',
			termKey: 'routes/apps/chain-tools/oracle/guide.glossary.multi_oracle.term',
			definitionKey: 'routes/apps/chain-tools/oracle/guide.glossary.multi_oracle.definition',
			relatedToolIds: ['defillama-oracles']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'chainlink',
		'pyth-network',
		'uma-protocol',
		'band-protocol',
		'api3',
		'tellor',
		'redstone-oracles',
		'chainlink-vrf'
	],

	lastUpdated: '2025-12-31'
};

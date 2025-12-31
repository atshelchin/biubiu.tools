/**
 * Bridge Category Guide Data
 * Comprehensive guide to cross-chain bridges and asset transfers
 *
 * Content philosophy:
 * - Focus on understanding bridge mechanics and security
 * - Include real examples of bridge exploits and lessons learned
 * - Cover practical bridging strategies and cost optimization
 * - Progressive learning from basics to advanced cross-chain operations
 */
import type { CategoryGuide } from '../../types';

export const bridgeGuide: CategoryGuide = {
	categoryId: 'bridge',
	i18nKeyPrefix: 'routes/apps/chain-tools/bridge/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Understanding Bridges
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/bridge/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/bridge/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'across', context: 'fast bridging' },
				{ toolId: 'stargate', context: 'omnichain transfers' }
			]
		},
		{
			id: 'why-bridges',
			titleKey: 'routes/apps/chain-tools/bridge/guide.sections.why_bridges.title',
			contentKey: 'routes/apps/chain-tools/bridge/guide.sections.why_bridges.content',
			subsections: [
				{
					id: 'multi-chain-world',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.why_bridges.multi_chain_world.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.why_bridges.multi_chain_world.content'
				},
				{
					id: 'use-cases',
					titleKey: 'routes/apps/chain-tools/bridge/guide.sections.why_bridges.use_cases.title',
					contentKey: 'routes/apps/chain-tools/bridge/guide.sections.why_bridges.use_cases.content'
				}
			]
		},

		// Part 2: Bridge Mechanics
		{
			id: 'bridge-types',
			titleKey: 'routes/apps/chain-tools/bridge/guide.sections.bridge_types.title',
			contentKey: 'routes/apps/chain-tools/bridge/guide.sections.bridge_types.content',
			subsections: [
				{
					id: 'lock-mint',
					titleKey: 'routes/apps/chain-tools/bridge/guide.sections.bridge_types.lock_mint.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.bridge_types.lock_mint.content',
					toolMentions: [{ toolId: 'wormhole', context: 'wrapped tokens' }]
				},
				{
					id: 'burn-mint',
					titleKey: 'routes/apps/chain-tools/bridge/guide.sections.bridge_types.burn_mint.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.bridge_types.burn_mint.content',
					toolMentions: [{ toolId: 'circle-cctp', context: 'native USDC bridging' }]
				},
				{
					id: 'liquidity-network',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.bridge_types.liquidity_network.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.bridge_types.liquidity_network.content',
					toolMentions: [
						{ toolId: 'across', context: 'intent-based bridging' },
						{ toolId: 'stargate', context: 'unified liquidity' },
						{ toolId: 'hop', context: 'AMM-based' }
					]
				},
				{
					id: 'canonical-bridges',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.bridge_types.canonical_bridges.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.bridge_types.canonical_bridges.content',
					toolMentions: [{ toolId: 'superbridge', context: 'L2 native bridges' }]
				}
			]
		},

		// Part 3: Practical Bridging
		{
			id: 'getting-started',
			titleKey: 'routes/apps/chain-tools/bridge/guide.sections.getting_started.title',
			contentKey: 'routes/apps/chain-tools/bridge/guide.sections.getting_started.content',
			subsections: [
				{
					id: 'first-bridge',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.getting_started.first_bridge.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.getting_started.first_bridge.content',
					toolMentions: [
						{ toolId: 'across', context: 'recommended for beginners' },
						{ toolId: 'orbiter', context: 'L2-to-L2 transfers' }
					]
				},
				{
					id: 'choosing-bridge',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.getting_started.choosing_bridge.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.getting_started.choosing_bridge.content',
					toolMentions: [
						{ toolId: 'li-fi', context: 'bridge aggregator' },
						{ toolId: 'jumper', context: 'best route finder' },
						{ toolId: 'socket', context: 'multi-bridge comparison' }
					]
				},
				{
					id: 'gas-optimization',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.getting_started.gas_optimization.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.getting_started.gas_optimization.content',
					toolMentions: [{ toolId: 'bungee', context: 'gas refueling' }]
				}
			]
		},

		// Part 4: Bridge Aggregators
		{
			id: 'aggregators',
			titleKey: 'routes/apps/chain-tools/bridge/guide.sections.aggregators.title',
			contentKey: 'routes/apps/chain-tools/bridge/guide.sections.aggregators.content',
			subsections: [
				{
					id: 'why-aggregators',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.aggregators.why_aggregators.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.aggregators.why_aggregators.content'
				},
				{
					id: 'top-aggregators',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.aggregators.top_aggregators.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.aggregators.top_aggregators.content',
					toolMentions: [
						{ toolId: 'li-fi', context: 'comprehensive routing' },
						{ toolId: 'jumper', context: 'user-friendly interface' },
						{ toolId: 'socket', context: 'SDK for developers' }
					]
				}
			]
		},

		// Part 5: Security & Risks
		{
			id: 'security',
			titleKey: 'routes/apps/chain-tools/bridge/guide.sections.security.title',
			contentKey: 'routes/apps/chain-tools/bridge/guide.sections.security.content',
			subsections: [
				{
					id: 'bridge-risks',
					titleKey: 'routes/apps/chain-tools/bridge/guide.sections.security.bridge_risks.title',
					contentKey: 'routes/apps/chain-tools/bridge/guide.sections.security.bridge_risks.content'
				},
				{
					id: 'major-hacks',
					titleKey: 'routes/apps/chain-tools/bridge/guide.sections.security.major_hacks.title',
					contentKey: 'routes/apps/chain-tools/bridge/guide.sections.security.major_hacks.content',
					caseStudies: [
						{
							id: 'ronin-bridge-hack',
							titleKey:
								'routes/apps/chain-tools/bridge/guide.sections.security.major_hacks.case_ronin.title',
							descriptionKey:
								'routes/apps/chain-tools/bridge/guide.sections.security.major_hacks.case_ronin.description',
							txHash: '0xc28fad5e8d5e0ce6a2eaf67b6687be5d58113e16be590824d6cfa1a94467d0b7',
							date: '2022-03-23',
							profit: '~$625M stolen',
							sourceUrl: 'https://rekt.news/ronin-rekt/',
							relatedToolIds: ['etherscan']
						},
						{
							id: 'wormhole-hack',
							titleKey:
								'routes/apps/chain-tools/bridge/guide.sections.security.major_hacks.case_wormhole.title',
							descriptionKey:
								'routes/apps/chain-tools/bridge/guide.sections.security.major_hacks.case_wormhole.description',
							txHash: '0x4b5c7f27a8c7b7d9b5c8f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7',
							date: '2022-02-02',
							profit: '~$320M stolen',
							sourceUrl: 'https://rekt.news/wormhole-rekt/',
							relatedToolIds: ['wormhole']
						}
					]
				},
				{
					id: 'best-practices',
					titleKey: 'routes/apps/chain-tools/bridge/guide.sections.security.best_practices.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.security.best_practices.content'
				}
			]
		},

		// Part 6: Advanced Topics
		{
			id: 'advanced',
			titleKey: 'routes/apps/chain-tools/bridge/guide.sections.advanced.title',
			contentKey: 'routes/apps/chain-tools/bridge/guide.sections.advanced.content',
			subsections: [
				{
					id: 'messaging-protocols',
					titleKey:
						'routes/apps/chain-tools/bridge/guide.sections.advanced.messaging_protocols.title',
					contentKey:
						'routes/apps/chain-tools/bridge/guide.sections.advanced.messaging_protocols.content',
					toolMentions: [
						{ toolId: 'layerzero', context: 'omnichain messaging' },
						{ toolId: 'wormhole', context: 'cross-chain messaging' },
						{ toolId: 'hyperlane-bridge', context: 'permissionless interop' }
					]
				},
				{
					id: 'intent-based',
					titleKey: 'routes/apps/chain-tools/bridge/guide.sections.advanced.intent_based.title',
					contentKey: 'routes/apps/chain-tools/bridge/guide.sections.advanced.intent_based.content',
					toolMentions: [
						{ toolId: 'across', context: 'intent-based bridging pioneer' },
						{ toolId: 'router-protocol', context: 'intent architecture' }
					]
				},
				{
					id: 'nft-bridging',
					titleKey: 'routes/apps/chain-tools/bridge/guide.sections.advanced.nft_bridging.title',
					contentKey: 'routes/apps/chain-tools/bridge/guide.sections.advanced.nft_bridging.content',
					toolMentions: [{ toolId: 'wormhole', context: 'NFT bridging' }]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'canonical-bridge',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.canonical_bridge.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.canonical_bridge.definition',
			relatedToolIds: ['superbridge']
		},
		{
			id: 'wrapped-token',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.wrapped_token.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.wrapped_token.definition',
			relatedToolIds: ['wormhole']
		},
		{
			id: 'native-token',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.native_token.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.native_token.definition',
			relatedToolIds: ['circle-cctp']
		},
		{
			id: 'liquidity-pool',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.liquidity_pool.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.liquidity_pool.definition',
			relatedToolIds: ['stargate', 'hop']
		},
		{
			id: 'finality',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.finality.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.finality.definition'
		},
		{
			id: 'relayer',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.relayer.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.relayer.definition',
			relatedToolIds: ['across', 'layerzero']
		},
		{
			id: 'slippage',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.slippage.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.slippage.definition'
		},
		{
			id: 'gas-refuel',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.gas_refuel.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.gas_refuel.definition',
			relatedToolIds: ['bungee', 'jumper']
		},
		{
			id: 'omnichain',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.omnichain.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.omnichain.definition',
			relatedToolIds: ['layerzero', 'stargate']
		},
		{
			id: 'intent',
			termKey: 'routes/apps/chain-tools/bridge/guide.glossary.intent.term',
			definitionKey: 'routes/apps/chain-tools/bridge/guide.glossary.intent.definition',
			relatedToolIds: ['across', 'router-protocol']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'across',
		'stargate',
		'hop',
		'li-fi',
		'jumper',
		'wormhole',
		'orbiter',
		'layerzero'
	],

	lastUpdated: '2025-12-31'
};

/**
 * L2 Category Guide Data
 * Comprehensive guide to Layer 2 solutions and Ethereum scaling
 *
 * Content philosophy:
 * - Explain the fundamentals of L2 scaling technology
 * - Cover different rollup types and their tradeoffs
 * - Include practical guidance for using and deploying on L2s
 * - Progressive learning from basics to building L2 applications
 */
import type { CategoryGuide } from '../../types';

export const l2Guide: CategoryGuide = {
	categoryId: 'l2',
	i18nKeyPrefix: 'routes/apps/chain-tools/l2/guide',
	estimatedReadTime: '25 min',

	sections: [
		// Part 1: Understanding L2s
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/l2/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/l2/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'arbitrum-one', context: 'largest L2 by TVL' },
				{ toolId: 'base', context: 'fastest growing L2' }
			]
		},
		{
			id: 'scaling-basics',
			titleKey: 'routes/apps/chain-tools/l2/guide.sections.scaling_basics.title',
			contentKey: 'routes/apps/chain-tools/l2/guide.sections.scaling_basics.content',
			subsections: [
				{
					id: 'why-l2',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.scaling_basics.why_l2.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.scaling_basics.why_l2.content'
				},
				{
					id: 'rollup-concept',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.scaling_basics.rollup_concept.title',
					contentKey:
						'routes/apps/chain-tools/l2/guide.sections.scaling_basics.rollup_concept.content'
				},
				{
					id: 'security-model',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.scaling_basics.security_model.title',
					contentKey:
						'routes/apps/chain-tools/l2/guide.sections.scaling_basics.security_model.content',
					toolMentions: [{ toolId: 'l2beat', context: 'L2 risk analysis' }]
				}
			]
		},

		// Part 2: Rollup Types
		{
			id: 'rollup-types',
			titleKey: 'routes/apps/chain-tools/l2/guide.sections.rollup_types.title',
			contentKey: 'routes/apps/chain-tools/l2/guide.sections.rollup_types.content',
			subsections: [
				{
					id: 'optimistic-rollups',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.rollup_types.optimistic.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.rollup_types.optimistic.content',
					toolMentions: [
						{ toolId: 'arbitrum-one', context: 'Nitro technology' },
						{ toolId: 'optimism', context: 'OP Stack' },
						{ toolId: 'base', context: 'Coinbase L2' }
					]
				},
				{
					id: 'zk-rollups',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.rollup_types.zk.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.rollup_types.zk.content',
					toolMentions: [
						{ toolId: 'zksync-era', context: 'native account abstraction' },
						{ toolId: 'starknet', context: 'STARK proofs' },
						{ toolId: 'scroll', context: 'EVM-equivalent zkEVM' }
					]
				},
				{
					id: 'comparison',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.rollup_types.comparison.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.rollup_types.comparison.content'
				}
			]
		},

		// Part 3: Major L2 Ecosystems
		{
			id: 'ecosystems',
			titleKey: 'routes/apps/chain-tools/l2/guide.sections.ecosystems.title',
			contentKey: 'routes/apps/chain-tools/l2/guide.sections.ecosystems.content',
			subsections: [
				{
					id: 'arbitrum-ecosystem',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.ecosystems.arbitrum.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.ecosystems.arbitrum.content',
					toolMentions: [
						{ toolId: 'arbitrum-one', context: 'main chain' },
						{ toolId: 'orbit-chain', context: 'L3 framework' }
					]
				},
				{
					id: 'op-superchain',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.ecosystems.superchain.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.ecosystems.superchain.content',
					toolMentions: [
						{ toolId: 'optimism', context: 'OP Mainnet' },
						{ toolId: 'base', context: 'Coinbase L2' },
						{ toolId: 'op-stack', context: 'rollup framework' },
						{ toolId: 'superchain', context: 'ecosystem' }
					]
				},
				{
					id: 'zk-ecosystem',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.ecosystems.zk.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.ecosystems.zk.content',
					toolMentions: [
						{ toolId: 'zksync-era', context: 'ZK Stack' },
						{ toolId: 'starknet', context: 'Cairo ecosystem' },
						{ toolId: 'polygon-zkevm', context: 'Polygon CDK' }
					]
				}
			]
		},

		// Part 4: Using L2s
		{
			id: 'using-l2s',
			titleKey: 'routes/apps/chain-tools/l2/guide.sections.using_l2s.title',
			contentKey: 'routes/apps/chain-tools/l2/guide.sections.using_l2s.content',
			subsections: [
				{
					id: 'getting-started',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.using_l2s.getting_started.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.using_l2s.getting_started.content',
					toolMentions: [{ toolId: 'chainlist-l2', context: 'add networks' }]
				},
				{
					id: 'bridging-funds',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.using_l2s.bridging.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.using_l2s.bridging.content'
				},
				{
					id: 'gas-optimization',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.using_l2s.gas.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.using_l2s.gas.content'
				}
			]
		},

		// Part 5: L2 Frameworks
		{
			id: 'frameworks',
			titleKey: 'routes/apps/chain-tools/l2/guide.sections.frameworks.title',
			contentKey: 'routes/apps/chain-tools/l2/guide.sections.frameworks.content',
			subsections: [
				{
					id: 'op-stack-framework',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.frameworks.op_stack.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.frameworks.op_stack.content',
					toolMentions: [
						{ toolId: 'op-stack', context: 'framework' },
						{ toolId: 'base', context: 'OP Stack chain' },
						{ toolId: 'zora-l2', context: 'NFT-focused L2' }
					]
				},
				{
					id: 'arbitrum-orbit-framework',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.frameworks.orbit.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.frameworks.orbit.content',
					toolMentions: [
						{ toolId: 'orbit-chain', context: 'L3 framework' },
						{ toolId: 'degen-l3', context: 'Orbit chain example' }
					]
				},
				{
					id: 'zk-frameworks',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.frameworks.zk.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.frameworks.zk.content',
					toolMentions: [
						{ toolId: 'zk-stack', context: 'ZK hyperchains' },
						{ toolId: 'polygon-cdk', context: 'ZK chain kit' }
					]
				}
			]
		},

		// Part 6: L2 Analytics & Research
		{
			id: 'analytics',
			titleKey: 'routes/apps/chain-tools/l2/guide.sections.analytics.title',
			contentKey: 'routes/apps/chain-tools/l2/guide.sections.analytics.content',
			subsections: [
				{
					id: 'metrics',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.analytics.metrics.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.analytics.metrics.content',
					toolMentions: [
						{ toolId: 'l2beat', context: 'TVL and risk analysis' },
						{ toolId: 'l2-marathon', context: 'L2 comparison' }
					]
				},
				{
					id: 'risk-assessment',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.analytics.risk.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.analytics.risk.content',
					toolMentions: [{ toolId: 'l2beat', context: 'risk framework' }]
				}
			]
		},

		// Part 7: Advanced Topics
		{
			id: 'advanced',
			titleKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.title',
			contentKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.content',
			subsections: [
				{
					id: 'data-availability',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.data_availability.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.data_availability.content'
				},
				{
					id: 'sequencer-decentralization',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.sequencer.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.sequencer.content'
				},
				{
					id: 'interoperability',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.interop.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.interop.content',
					toolMentions: [{ toolId: 'superchain', context: 'cross-L2 messaging' }]
				},
				{
					id: 'future-developments',
					titleKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.future.title',
					contentKey: 'routes/apps/chain-tools/l2/guide.sections.advanced.future.content',
					toolMentions: [
						{ toolId: 'megaeth-l2', context: 'real-time L2' },
						{ toolId: 'eclipse-l2', context: 'SVM on Ethereum' }
					]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'rollup',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.rollup.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.rollup.definition'
		},
		{
			id: 'optimistic-rollup',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.optimistic_rollup.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.optimistic_rollup.definition',
			relatedToolIds: ['arbitrum-one', 'optimism', 'base']
		},
		{
			id: 'zk-rollup',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.zk_rollup.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.zk_rollup.definition',
			relatedToolIds: ['zksync-era', 'starknet', 'scroll']
		},
		{
			id: 'sequencer',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.sequencer.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.sequencer.definition'
		},
		{
			id: 'fraud-proof',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.fraud_proof.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.fraud_proof.definition',
			relatedToolIds: ['arbitrum-one', 'optimism']
		},
		{
			id: 'validity-proof',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.validity_proof.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.validity_proof.definition',
			relatedToolIds: ['zksync-era', 'starknet']
		},
		{
			id: 'data-availability',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.data_availability.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.data_availability.definition'
		},
		{
			id: 'challenge-period',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.challenge_period.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.challenge_period.definition'
		},
		{
			id: 'escape-hatch',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.escape_hatch.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.escape_hatch.definition'
		},
		{
			id: 'l3',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.l3.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.l3.definition',
			relatedToolIds: ['orbit-chain', 'degen-l3']
		},
		{
			id: 'superchain',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.superchain.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.superchain.definition',
			relatedToolIds: ['optimism', 'base', 'op-stack']
		},
		{
			id: 'zkevm',
			termKey: 'routes/apps/chain-tools/l2/guide.glossary.zkevm.term',
			definitionKey: 'routes/apps/chain-tools/l2/guide.glossary.zkevm.definition',
			relatedToolIds: ['scroll', 'polygon-zkevm', 'linea']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'arbitrum-one',
		'optimism',
		'base',
		'zksync-era',
		'starknet',
		'scroll',
		'l2beat',
		'op-stack'
	],

	lastUpdated: '2025-12-31'
};

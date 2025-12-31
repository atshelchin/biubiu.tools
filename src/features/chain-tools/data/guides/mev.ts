/**
 * MEV Category Guide Data
 * Comprehensive guide to Maximal Extractable Value
 *
 * Content philosophy:
 * - Explain MEV from basics to advanced concepts
 * - Cover the MEV supply chain (searchers, builders, validators)
 * - Practical protection strategies for users
 * - Opportunities for becoming a searcher
 * - Post-merge MEV landscape and ethical considerations
 */
import type { CategoryGuide } from '../../types';

export const mevGuide: CategoryGuide = {
	categoryId: 'mev',
	i18nKeyPrefix: 'routes/apps/chain-tools/mev/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding MEV
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/mev/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/mev/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'flashbots-transparency', context: 'MEV data' },
				{ toolId: 'eigenphi-mev', context: 'MEV analytics' }
			]
		},

		// Part 2: Types of MEV
		{
			id: 'mev-types',
			titleKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.title',
			contentKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.content',
			subsections: [
				{
					id: 'frontrunning',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.frontrunning.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_types.frontrunning.content',
					toolMentions: [{ toolId: 'mev-explore', context: 'track frontrunning' }]
				},
				{
					id: 'sandwich-attacks',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.sandwich_attacks.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_types.sandwich_attacks.content',
					toolMentions: [{ toolId: 'eigenphi-mev', context: 'sandwich analytics' }]
				},
				{
					id: 'arbitrage',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.arbitrage.title',
					contentKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.arbitrage.content',
					toolMentions: [{ toolId: 'eigenphi-mev', context: 'arbitrage tracking' }]
				},
				{
					id: 'liquidations',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.liquidations.title',
					contentKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.liquidations.content'
				},
				{
					id: 'backrunning',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.backrunning.title',
					contentKey: 'routes/apps/chain-tools/mev/guide.sections.mev_types.backrunning.content'
				}
			]
		},

		// Part 3: MEV Supply Chain
		{
			id: 'mev-supply-chain',
			titleKey: 'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.title',
			contentKey: 'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.content',
			subsections: [
				{
					id: 'searchers',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.searchers.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.searchers.content',
					toolMentions: [{ toolId: 'flashbots-builder', context: 'submit bundles' }]
				},
				{
					id: 'builders',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.builders.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.builders.content',
					toolMentions: [
						{ toolId: 'flashbots-builder', context: 'Flashbots builder' },
						{ toolId: 'beaverbuild', context: 'Beaverbuild' },
						{ toolId: 'titan-builder', context: 'Titan' }
					]
				},
				{
					id: 'validators',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.validators.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.validators.content',
					toolMentions: [{ toolId: 'mev-boost', context: 'validator middleware' }]
				},
				{
					id: 'block-production',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.block_production.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.mev_supply_chain.block_production.content',
					toolMentions: [{ toolId: 'relayscan', context: 'relay analytics' }]
				}
			]
		},

		// Part 4: MEV Protection
		{
			id: 'protection',
			titleKey: 'routes/apps/chain-tools/mev/guide.sections.protection.title',
			contentKey: 'routes/apps/chain-tools/mev/guide.sections.protection.content',
			subsections: [
				{
					id: 'flashbots-protect',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.protection.flashbots.title',
					contentKey: 'routes/apps/chain-tools/mev/guide.sections.protection.flashbots.content',
					toolMentions: [
						{ toolId: 'flashbots-protect', context: 'RPC protection' },
						{ toolId: 'mev-share', context: 'MEV redistribution' }
					]
				},
				{
					id: 'mev-blocker',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.protection.mev_blocker.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.protection.mev_blocker.content',
					toolMentions: [{ toolId: 'mev-blocker', context: 'CoW Swap protection' }]
				},
				{
					id: 'private-transactions',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.protection.private_transactions.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.protection.private_transactions.content',
					toolMentions: [{ toolId: 'cow-mev-protection', context: 'batch auctions' }]
				}
			]
		},

		// Part 5: Profit Opportunities
		{
			id: 'profit-opportunities',
			titleKey: 'routes/apps/chain-tools/mev/guide.sections.profit_opportunities.title',
			contentKey: 'routes/apps/chain-tools/mev/guide.sections.profit_opportunities.content',
			subsections: [
				{
					id: 'become-searcher',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.profit_opportunities.become_searcher.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.profit_opportunities.become_searcher.content',
					toolMentions: [{ toolId: 'flashbots-builder', context: 'submit bundles' }]
				},
				{
					id: 'tools-needed',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.profit_opportunities.tools_needed.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.profit_opportunities.tools_needed.content',
					toolMentions: [
						{ toolId: 'eigenphi-mev', context: 'research opportunities' },
						{ toolId: 'zeromev', context: 'track extraction' }
					]
				}
			]
		},

		// Part 6: Post-Merge MEV
		{
			id: 'post-merge-mev',
			titleKey: 'routes/apps/chain-tools/mev/guide.sections.post_merge_mev.title',
			contentKey: 'routes/apps/chain-tools/mev/guide.sections.post_merge_mev.content',
			subsections: [
				{
					id: 'pbs',
					titleKey: 'routes/apps/chain-tools/mev/guide.sections.post_merge_mev.pbs.title',
					contentKey: 'routes/apps/chain-tools/mev/guide.sections.post_merge_mev.pbs.content',
					toolMentions: [
						{ toolId: 'mev-boost', context: 'PBS implementation' },
						{ toolId: 'relayscan', context: 'relay monitoring' }
					]
				},
				{
					id: 'mev-boost',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.post_merge_mev.mev_boost.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.post_merge_mev.mev_boost.content',
					toolMentions: [
						{ toolId: 'mev-boost', context: 'validator software' },
						{ toolId: 'mevboost-pics', context: 'performance metrics' }
					]
				}
			]
		},

		// Part 7: Ethical Considerations
		{
			id: 'ethical-considerations',
			titleKey: 'routes/apps/chain-tools/mev/guide.sections.ethical_considerations.title',
			contentKey: 'routes/apps/chain-tools/mev/guide.sections.ethical_considerations.content',
			subsections: [
				{
					id: 'censorship',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.ethical_considerations.censorship.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.ethical_considerations.censorship.content',
					toolMentions: [{ toolId: 'mev-watch', context: 'censorship monitoring' }]
				},
				{
					id: 'fairness',
					titleKey:
						'routes/apps/chain-tools/mev/guide.sections.ethical_considerations.fairness.title',
					contentKey:
						'routes/apps/chain-tools/mev/guide.sections.ethical_considerations.fairness.content',
					toolMentions: [{ toolId: 'suave', context: 'fair ordering' }]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'mev',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.mev.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.mev.definition',
			relatedToolIds: ['flashbots-transparency', 'eigenphi-mev']
		},
		{
			id: 'searcher',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.searcher.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.searcher.definition',
			relatedToolIds: ['flashbots-builder']
		},
		{
			id: 'builder',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.builder.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.builder.definition',
			relatedToolIds: ['flashbots-builder', 'beaverbuild', 'titan-builder']
		},
		{
			id: 'validator',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.validator.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.validator.definition',
			relatedToolIds: ['mev-boost']
		},
		{
			id: 'frontrunning',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.frontrunning.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.frontrunning.definition',
			relatedToolIds: ['flashbots-protect', 'mev-blocker']
		},
		{
			id: 'sandwich-attack',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.sandwich_attack.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.sandwich_attack.definition',
			relatedToolIds: ['flashbots-protect', 'mev-blocker']
		},
		{
			id: 'backrunning',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.backrunning.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.backrunning.definition',
			relatedToolIds: ['eigenphi-mev']
		},
		{
			id: 'pga',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.pga.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.pga.definition',
			relatedToolIds: ['flashbots-builder']
		},
		{
			id: 'bundle',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.bundle.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.bundle.definition',
			relatedToolIds: ['flashbots-builder', 'jito-bundles']
		},
		{
			id: 'slot',
			termKey: 'routes/apps/chain-tools/mev/guide.glossary.slot.term',
			definitionKey: 'routes/apps/chain-tools/mev/guide.glossary.slot.definition',
			relatedToolIds: ['mev-boost']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'flashbots-protect',
		'mev-blocker',
		'flashbots-builder',
		'mev-boost',
		'eigenphi-mev',
		'flashbots-transparency',
		'mev-share',
		'relayscan'
	],

	lastUpdated: '2025-12-31'
};

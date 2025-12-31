/**
 * Restaking Category Guide Data
 * Long-form educational article about restaking and liquid restaking tokens
 *
 * Content philosophy:
 * - Focus on understanding EigenLayer's restaking mechanism
 * - Explain AVS (Actively Validated Services) and their role
 * - Cover liquid restaking tokens (LRTs) and their benefits
 * - Include practical participation methods and risk analysis
 * - Progressive learning from basics to advanced strategies
 */
import type { CategoryGuide } from '../../types';

export const restakingGuide: CategoryGuide = {
	categoryId: 'restaking',
	i18nKeyPrefix: 'routes/apps/chain-tools/restaking/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding Restaking
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/restaking/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/restaking/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'eigenlayer', context: 'restaking protocol' },
				{ toolId: 'ether-fi', context: 'liquid restaking' }
			]
		},
		{
			id: 'why-restaking',
			titleKey: 'routes/apps/chain-tools/restaking/guide.sections.why_restaking.title',
			contentKey: 'routes/apps/chain-tools/restaking/guide.sections.why_restaking.content'
		},

		// Part 2: How Restaking Works
		{
			id: 'how-it-works',
			titleKey: 'routes/apps/chain-tools/restaking/guide.sections.how_it_works.title',
			contentKey: 'routes/apps/chain-tools/restaking/guide.sections.how_it_works.content',
			subsections: [
				{
					id: 'eigenlayer-model',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.how_it_works.eigenlayer_model.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.how_it_works.eigenlayer_model.content',
					toolMentions: [{ toolId: 'eigenlayer' }]
				},
				{
					id: 'avs',
					titleKey: 'routes/apps/chain-tools/restaking/guide.sections.how_it_works.avs.title',
					contentKey: 'routes/apps/chain-tools/restaking/guide.sections.how_it_works.avs.content'
				},
				{
					id: 'roles',
					titleKey: 'routes/apps/chain-tools/restaking/guide.sections.how_it_works.roles.title',
					contentKey: 'routes/apps/chain-tools/restaking/guide.sections.how_it_works.roles.content'
				}
			]
		},

		// Part 3: AVS Ecosystem
		{
			id: 'avs-ecosystem',
			titleKey: 'routes/apps/chain-tools/restaking/guide.sections.avs_ecosystem.title',
			contentKey: 'routes/apps/chain-tools/restaking/guide.sections.avs_ecosystem.content',
			subsections: [
				{
					id: 'types-of-avs',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.avs_ecosystem.types_of_avs.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.avs_ecosystem.types_of_avs.content'
				},
				{
					id: 'examples',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.avs_ecosystem.examples.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.avs_ecosystem.examples.content'
				}
			]
		},

		// Part 4: Participation Methods
		{
			id: 'participation',
			titleKey: 'routes/apps/chain-tools/restaking/guide.sections.participation.title',
			contentKey: 'routes/apps/chain-tools/restaking/guide.sections.participation.content',
			subsections: [
				{
					id: 'native-restaking',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.participation.native_restaking.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.participation.native_restaking.content',
					toolMentions: [{ toolId: 'eigenlayer' }]
				},
				{
					id: 'lrt-restaking',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.participation.lrt_restaking.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.participation.lrt_restaking.content',
					toolMentions: [
						{ toolId: 'ether-fi', context: 'eETH liquid restaking' },
						{ toolId: 'renzo', context: 'ezETH liquid restaking' },
						{ toolId: 'puffer', context: 'pufETH liquid restaking' }
					]
				},
				{
					id: 'delegating',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.participation.delegating.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.participation.delegating.content'
				}
			]
		},

		// Part 5: Liquid Restaking Tokens
		{
			id: 'liquid-restaking-tokens',
			titleKey: 'routes/apps/chain-tools/restaking/guide.sections.liquid_restaking_tokens.title',
			contentKey:
				'routes/apps/chain-tools/restaking/guide.sections.liquid_restaking_tokens.content',
			subsections: [
				{
					id: 'benefits',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.liquid_restaking_tokens.benefits.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.liquid_restaking_tokens.benefits.content'
				},
				{
					id: 'major-lrts',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.liquid_restaking_tokens.major_lrts.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.liquid_restaking_tokens.major_lrts.content',
					toolMentions: [
						{ toolId: 'ether-fi', context: 'eETH' },
						{ toolId: 'renzo', context: 'ezETH' },
						{ toolId: 'puffer', context: 'pufETH' },
						{ toolId: 'kelp-dao', context: 'rsETH' },
						{ toolId: 'swell', context: 'swETH/rswETH' }
					]
				},
				{
					id: 'using-lrts',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.liquid_restaking_tokens.using_lrts.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.liquid_restaking_tokens.using_lrts.content'
				}
			]
		},

		// Part 6: Yield Opportunities
		{
			id: 'yield-opportunities',
			titleKey: 'routes/apps/chain-tools/restaking/guide.sections.yield_opportunities.title',
			contentKey: 'routes/apps/chain-tools/restaking/guide.sections.yield_opportunities.content',
			subsections: [
				{
					id: 'staking-yield',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.yield_opportunities.staking_yield.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.yield_opportunities.staking_yield.content'
				},
				{
					id: 'restaking-rewards',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.yield_opportunities.restaking_rewards.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.yield_opportunities.restaking_rewards.content'
				},
				{
					id: 'defi-strategies',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.yield_opportunities.defi_strategies.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.yield_opportunities.defi_strategies.content',
					toolMentions: [{ toolId: 'ether-fi' }, { toolId: 'renzo' }, { toolId: 'puffer' }]
				}
			]
		},

		// Part 7: Risks and Considerations
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/restaking/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/restaking/guide.sections.risks.content',
			subsections: [
				{
					id: 'slashing-risk',
					titleKey: 'routes/apps/chain-tools/restaking/guide.sections.risks.slashing_risk.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.risks.slashing_risk.content'
				},
				{
					id: 'smart-contract-risk',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.risks.smart_contract_risk.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.risks.smart_contract_risk.content'
				},
				{
					id: 'liquidity-risk',
					titleKey:
						'routes/apps/chain-tools/restaking/guide.sections.risks.liquidity_risk.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.risks.liquidity_risk.content'
				},
				{
					id: 'mitigation',
					titleKey: 'routes/apps/chain-tools/restaking/guide.sections.risks.mitigation.title',
					contentKey:
						'routes/apps/chain-tools/restaking/guide.sections.risks.mitigation.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'restaking',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.restaking.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.restaking.definition',
			relatedToolIds: ['eigenlayer']
		},
		{
			id: 'avs',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.avs.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.avs.definition',
			relatedToolIds: ['eigenlayer']
		},
		{
			id: 'operator',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.operator.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.operator.definition',
			relatedToolIds: ['eigenlayer']
		},
		{
			id: 'delegator',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.delegator.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.delegator.definition',
			relatedToolIds: ['eigenlayer']
		},
		{
			id: 'slashing',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.slashing.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.slashing.definition'
		},
		{
			id: 'lrt',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.lrt.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.lrt.definition',
			relatedToolIds: ['ether-fi', 'renzo', 'puffer', 'kelp-dao', 'swell']
		},
		{
			id: 'eigenpod',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.eigenpod.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.eigenpod.definition',
			relatedToolIds: ['eigenlayer']
		},
		{
			id: 'shared-security',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.shared_security.term',
			definitionKey:
				'routes/apps/chain-tools/restaking/guide.glossary.shared_security.definition',
			relatedToolIds: ['eigenlayer']
		},
		{
			id: 'delegation',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.delegation.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.delegation.definition',
			relatedToolIds: ['eigenlayer']
		},
		{
			id: 'withdrawal',
			termKey: 'routes/apps/chain-tools/restaking/guide.glossary.withdrawal.term',
			definitionKey: 'routes/apps/chain-tools/restaking/guide.glossary.withdrawal.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'eigenlayer',
		'ether-fi',
		'renzo',
		'puffer',
		'kelp-dao',
		'swell',
		'pendle',
		'etherscan'
	],

	lastUpdated: '2025-12-31'
};

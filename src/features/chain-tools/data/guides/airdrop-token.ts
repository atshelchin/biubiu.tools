/**
 * Airdrop Token Category Guide Data
 * Long-form educational article on discovering and maximizing airdrop rewards
 *
 * Content philosophy:
 * - Focus on practical strategies and real examples
 * - Include verifiable case studies with actual airdrop amounts
 * - Emphasize risk management and avoiding scams
 * - Progressive learning from finding opportunities to maximizing rewards
 */
import type { CategoryGuide } from '../../types';

export const airdropTokenGuide: CategoryGuide = {
	categoryId: 'airdrop-token',
	i18nKeyPrefix: 'routes/apps/chain-tools/airdrop-token/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'defillama', context: 'tracking protocols' },
				{ toolId: 'layer3', context: 'quest platform' }
			]
		},

		// Part 2: Types of Airdrops
		{
			id: 'types',
			titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.types.title',
			contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.types.content',
			subsections: [
				{
					id: 'retroactive',
					titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.types.retroactive.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.types.retroactive.content',
					caseStudies: [
						{
							id: 'uniswap-airdrop',
							titleKey:
								'routes/apps/chain-tools/airdrop-token/guide.sections.types.retroactive.case_uniswap.title',
							descriptionKey:
								'routes/apps/chain-tools/airdrop-token/guide.sections.types.retroactive.case_uniswap.description',
							date: '2020-09-17',
							profit: '400 UNI (~$1,200 at launch, $12,000+ at peak)',
							sourceUrl: 'https://uniswap.org/blog/uni'
						},
						{
							id: 'arbitrum-airdrop',
							titleKey:
								'routes/apps/chain-tools/airdrop-token/guide.sections.types.retroactive.case_arbitrum.title',
							descriptionKey:
								'routes/apps/chain-tools/airdrop-token/guide.sections.types.retroactive.case_arbitrum.description',
							date: '2023-03-23',
							profit: '625-10,250 ARB ($1,250-$20,500 at launch)',
							sourceUrl: 'https://arbitrum.foundation/airdrop-eligibility'
						}
					]
				},
				{
					id: 'points-based',
					titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.types.points_based.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.types.points_based.content',
					toolMentions: [{ toolId: 'earndrop' }]
				},
				{
					id: 'testnet',
					titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.types.testnet.title',
					contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.types.testnet.content'
				},
				{
					id: 'social-community',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.types.social_community.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.types.social_community.content',
					toolMentions: [
						{ toolId: 'galxe', context: 'quest platform' },
						{ toolId: 'zealy', context: 'community tasks' }
					]
				},
				{
					id: 'holder-snapshots',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.types.holder_snapshots.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.types.holder_snapshots.content'
				}
			]
		},

		// Part 3: Finding Opportunities
		{
			id: 'finding',
			titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.finding.title',
			contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.finding.content',
			subsections: [
				{
					id: 'identifying-protocols',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.finding.identifying_protocols.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.finding.identifying_protocols.content',
					toolMentions: [{ toolId: 'defillama', context: 'TVL tracking' }]
				},
				{
					id: 'vc-backed',
					titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.finding.vc_backed.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.finding.vc_backed.content'
				},
				{
					id: 'alpha-sources',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.finding.alpha_sources.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.finding.alpha_sources.content',
					toolMentions: [{ toolId: 'airdrops-io', context: 'airdrop tracker' }]
				},
				{
					id: 'activity-indicators',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.finding.activity_indicators.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.finding.activity_indicators.content'
				}
			]
		},

		// Part 4: Qualifying for Airdrops
		{
			id: 'qualifying',
			titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.title',
			contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.content',
			subsections: [
				{
					id: 'eligibility',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.eligibility.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.eligibility.content'
				},
				{
					id: 'volume-frequency',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.volume_frequency.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.volume_frequency.content'
				},
				{
					id: 'time-requirements',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.time_requirements.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.time_requirements.content'
				},
				{
					id: 'multi-chain',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.multi_chain.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.multi_chain.content'
				},
				{
					id: 'sybil-detection',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.sybil_detection.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.qualifying.sybil_detection.content'
				}
			]
		},

		// Part 5: Farming Strategies
		{
			id: 'strategies',
			titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.title',
			contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.content',
			subsections: [
				{
					id: 'portfolio-approach',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.portfolio_approach.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.portfolio_approach.content'
				},
				{
					id: 'capital-efficiency',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.capital_efficiency.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.capital_efficiency.content'
				},
				{
					id: 'gas-management',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.gas_management.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.gas_management.content'
				},
				{
					id: 'time-optimization',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.time_optimization.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.time_optimization.content'
				},
				{
					id: 'diversification',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.diversification.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.strategies.diversification.content'
				}
			]
		},

		// Part 6: Points Systems
		{
			id: 'points-systems',
			titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.title',
			contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.content',
			subsections: [
				{
					id: 'how-work',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.how_work.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.how_work.content',
					toolMentions: [{ toolId: 'earndrop', context: 'points tracker' }]
				},
				{
					id: 'maximizing',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.maximizing.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.maximizing.content'
				},
				{
					id: 'conversion',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.conversion.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.conversion.content'
				},
				{
					id: 'popular-programs',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.popular_programs.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.points_systems.popular_programs.content'
				}
			]
		},

		// Part 7: Post-Airdrop Strategy
		{
			id: 'post-airdrop',
			titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.title',
			contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.content',
			subsections: [
				{
					id: 'claiming',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.claiming.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.claiming.content'
				},
				{
					id: 'hold-vs-sell',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.hold_vs_sell.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.hold_vs_sell.content'
				},
				{
					id: 'tax',
					titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.tax.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.tax.content'
				},
				{
					id: 'governance',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.governance.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.post_airdrop.governance.content'
				}
			]
		},

		// Part 8: Risks & Pitfalls
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.risks.content',
			subsections: [
				{
					id: 'scams',
					titleKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.risks.scams.title',
					contentKey: 'routes/apps/chain-tools/airdrop-token/guide.sections.risks.scams.content'
				},
				{
					id: 'sybil-penalties',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.risks.sybil_penalties.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.risks.sybil_penalties.content'
				},
				{
					id: 'opportunity-cost',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.risks.opportunity_cost.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.risks.opportunity_cost.content'
				},
				{
					id: 'protocol-risks',
					titleKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.risks.protocol_risks.title',
					contentKey:
						'routes/apps/chain-tools/airdrop-token/guide.sections.risks.protocol_risks.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'airdrop',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.airdrop.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.airdrop.definition'
		},
		{
			id: 'retroactive-airdrop',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.retroactive_airdrop.term',
			definitionKey:
				'routes/apps/chain-tools/airdrop-token/guide.glossary.retroactive_airdrop.definition'
		},
		{
			id: 'points-system',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.points_system.term',
			definitionKey:
				'routes/apps/chain-tools/airdrop-token/guide.glossary.points_system.definition',
			relatedToolIds: ['earndrop']
		},
		{
			id: 'sybil',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.sybil.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.sybil.definition'
		},
		{
			id: 'snapshot',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.snapshot.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.snapshot.definition'
		},
		{
			id: 'eligibility',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.eligibility.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.eligibility.definition'
		},
		{
			id: 'claim',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.claim.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.claim.definition'
		},
		{
			id: 'vest',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.vest.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.vest.definition'
		},
		{
			id: 'governance-token',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.governance_token.term',
			definitionKey:
				'routes/apps/chain-tools/airdrop-token/guide.glossary.governance_token.definition'
		},
		{
			id: 'testnet',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.testnet.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.testnet.definition'
		},
		{
			id: 'mainnet',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.mainnet.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.mainnet.definition'
		},
		{
			id: 'farming',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.farming.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.farming.definition'
		},
		{
			id: 'alpha',
			termKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.alpha.term',
			definitionKey: 'routes/apps/chain-tools/airdrop-token/guide.glossary.alpha.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'defillama',
		'dappradar',
		'earndrop',
		'airdrops-io',
		'layer3',
		'galxe',
		'zealy',
		'quest3'
	],

	lastUpdated: '2025-12-31'
};

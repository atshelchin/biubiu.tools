/**
 * Whale Address Category Guide Data
 * Comprehensive guide on tracking whales and analyzing smart money movements
 *
 * Content philosophy:
 * - Focus on practical whale tracking strategies
 * - Include real examples of whale movements and their market impact
 * - Emphasize tool usage and alert setup
 * - Balance opportunity with ethical considerations
 */
import type { CategoryGuide } from '../../types';

export const whaleAddressGuide: CategoryGuide = {
	categoryId: 'whale-address',
	i18nKeyPrefix: 'routes/apps/chain-tools/whale-address/guide',
	estimatedReadTime: '22 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/whale-address/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'nansen', context: 'whale tracking platform' },
				{ toolId: 'arkham', context: 'entity intelligence' }
			]
		},

		// Part 2: Identifying Whales
		{
			id: 'identifying-whales',
			titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.identifying_whales.title',
			contentKey: 'routes/apps/chain-tools/whale-address/guide.sections.identifying_whales.content',
			subsections: [
				{
					id: 'what-defines-whale',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.identifying_whales.what_defines.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.identifying_whales.what_defines.content'
				},
				{
					id: 'types-of-whales',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.identifying_whales.types.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.identifying_whales.types.content'
				},
				{
					id: 'finding-whales',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.identifying_whales.finding.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.identifying_whales.finding.content',
					toolMentions: [
						{ toolId: 'nansen', context: 'smart money labels' },
						{ toolId: 'arkham', context: 'entity database' },
						{ toolId: 'etherscan', context: 'token holder pages' }
					]
				}
			]
		},

		// Part 3: Tracking Tools & Methods
		{
			id: 'tracking-tools',
			titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.title',
			contentKey: 'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.content',
			subsections: [
				{
					id: 'nansen-features',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.nansen.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.nansen.content',
					toolMentions: [{ toolId: 'nansen', context: 'smart money tracking' }]
				},
				{
					id: 'arkham-intelligence',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.arkham.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.arkham.content',
					toolMentions: [{ toolId: 'arkham', context: 'entity tracking' }]
				},
				{
					id: 'portfolio-trackers',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.portfolio.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.portfolio.content',
					toolMentions: [
						{ toolId: 'debank', context: 'portfolio following' },
						{ toolId: 'zerion', context: 'wallet tracking' }
					]
				},
				{
					id: 'custom-alerts',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.alerts.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.alerts.content',
					toolMentions: [
						{ toolId: 'etherscan', context: 'address alerts' },
						{ toolId: 'whale-alert', context: 'large transaction alerts' }
					]
				},
				{
					id: 'custom-dashboard',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.dashboard.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.tracking_tools.dashboard.content'
				}
			]
		},

		// Part 4: Analyzing Whale Behavior
		{
			id: 'analyzing-behavior',
			titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.title',
			contentKey: 'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.content',
			subsections: [
				{
					id: 'accumulation-patterns',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.accumulation.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.accumulation.content'
				},
				{
					id: 'distribution-signals',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.distribution.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.distribution.content'
				},
				{
					id: 'portfolio-composition',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.portfolio.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.portfolio.content',
					toolMentions: [{ toolId: 'debank' }, { toolId: 'zerion' }]
				},
				{
					id: 'cross-chain',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.cross_chain.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.cross_chain.content'
				},
				{
					id: 'defi-positions',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.defi.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.analyzing_behavior.defi.content'
				}
			]
		},

		// Part 5: Smart Money Strategies
		{
			id: 'smart-money-strategies',
			titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.title',
			contentKey:
				'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.content',
			subsections: [
				{
					id: 'copy-trading',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.copy_trading.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.copy_trading.content'
				},
				{
					id: 'ethics-legality',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.ethics.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.ethics.content'
				},
				{
					id: 'timing-entries',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.timing.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.timing.content'
				},
				{
					id: 'understanding-motivations',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.motivations.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.smart_money_strategies.motivations.content'
				}
			]
		},

		// Part 6: Case Studies
		{
			id: 'case-studies',
			titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.case_studies.title',
			contentKey: 'routes/apps/chain-tools/whale-address/guide.sections.case_studies.content',
			subsections: [
				{
					id: 'famous-whales',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.case_studies.famous_whales.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.case_studies.famous_whales.content',
					caseStudies: [
						{
							id: 'jump-trading',
							titleKey:
								'routes/apps/chain-tools/whale-address/guide.sections.case_studies.famous_whales.case_jump.title',
							descriptionKey:
								'routes/apps/chain-tools/whale-address/guide.sections.case_studies.famous_whales.case_jump.description',
							relatedToolIds: ['arkham', 'nansen']
						}
					]
				},
				{
					id: 'whale-movements',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.case_studies.movements.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.case_studies.movements.content',
					caseStudies: [
						{
							id: 'whale-before-events',
							titleKey:
								'routes/apps/chain-tools/whale-address/guide.sections.case_studies.movements.case_events.title',
							descriptionKey:
								'routes/apps/chain-tools/whale-address/guide.sections.case_studies.movements.case_events.description',
							relatedToolIds: ['whale-alert', 'nansen']
						}
					]
				},
				{
					id: 'price-impact',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.case_studies.price_impact.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.case_studies.price_impact.content'
				}
			]
		},

		// Part 7: Building Your System
		{
			id: 'building-system',
			titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.building_system.title',
			contentKey: 'routes/apps/chain-tools/whale-address/guide.sections.building_system.content',
			subsections: [
				{
					id: 'creating-watchlist',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.building_system.watchlist.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.building_system.watchlist.content'
				},
				{
					id: 'setting-alerts',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.building_system.alerts.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.building_system.alerts.content',
					toolMentions: [{ toolId: 'etherscan' }, { toolId: 'whale-alert' }, { toolId: 'nansen' }]
				},
				{
					id: 'filtering-noise',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.building_system.filtering.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.building_system.filtering.content'
				},
				{
					id: 'combining-analysis',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.building_system.combining.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.building_system.combining.content'
				}
			]
		},

		// Part 8: Risks & Limitations
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/whale-address/guide.sections.risks.content',
			subsections: [
				{
					id: 'whales-can-be-wrong',
					titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.risks.whales_wrong.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.risks.whales_wrong.content'
				},
				{
					id: 'manipulation',
					titleKey: 'routes/apps/chain-tools/whale-address/guide.sections.risks.manipulation.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.risks.manipulation.content'
				},
				{
					id: 'privacy-ethics',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.risks.privacy_ethics.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.risks.privacy_ethics.content'
				},
				{
					id: 'over-reliance',
					titleKey:
						'routes/apps/chain-tools/whale-address/guide.sections.risks.over_reliance.title',
					contentKey:
						'routes/apps/chain-tools/whale-address/guide.sections.risks.over_reliance.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'whale',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.whale.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.whale.definition',
			relatedToolIds: ['nansen', 'arkham', 'whale-alert']
		},
		{
			id: 'smart-money',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.smart_money.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.smart_money.definition',
			relatedToolIds: ['nansen', 'arkham']
		},
		{
			id: 'accumulation',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.accumulation.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.accumulation.definition'
		},
		{
			id: 'distribution',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.distribution.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.distribution.definition'
		},
		{
			id: 'otc',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.otc.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.otc.definition'
		},
		{
			id: 'entity',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.entity.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.entity.definition',
			relatedToolIds: ['arkham']
		},
		{
			id: 'label',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.label.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.label.definition',
			relatedToolIds: ['nansen', 'arkham']
		},
		{
			id: 'on-chain-analysis',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.on_chain_analysis.term',
			definitionKey:
				'routes/apps/chain-tools/whale-address/guide.glossary.on_chain_analysis.definition',
			relatedToolIds: ['nansen', 'arkham', 'etherscan']
		},
		{
			id: 'copy-trading',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.copy_trading.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.copy_trading.definition'
		},
		{
			id: 'front-running',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.front_running.term',
			definitionKey: 'routes/apps/chain-tools/whale-address/guide.glossary.front_running.definition'
		},
		{
			id: 'portfolio-tracking',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.portfolio_tracking.term',
			definitionKey:
				'routes/apps/chain-tools/whale-address/guide.glossary.portfolio_tracking.definition',
			relatedToolIds: ['debank', 'zerion']
		},
		{
			id: 'wallet-clustering',
			termKey: 'routes/apps/chain-tools/whale-address/guide.glossary.wallet_clustering.term',
			definitionKey:
				'routes/apps/chain-tools/whale-address/guide.glossary.wallet_clustering.definition',
			relatedToolIds: ['arkham', 'breadcrumbs']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'nansen',
		'arkham',
		'debank',
		'zerion',
		'etherscan',
		'whale-alert',
		'bubblemaps',
		'breadcrumbs'
	],

	lastUpdated: '2025-12-31'
};

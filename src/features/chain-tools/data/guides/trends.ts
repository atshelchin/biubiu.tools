/**
 * Trends Category Guide Data
 * Long-form educational article on discovering alpha and tracking market trends
 *
 * Content philosophy:
 * - Focus on practical alpha discovery strategies
 * - Include real-world examples of successful trend identification
 * - Emphasize combining multiple signal types
 * - Progressive learning from basic tracking to advanced systems
 */
import type { CategoryGuide } from '../../types';

export const trendsGuide: CategoryGuide = {
	categoryId: 'trends',
	i18nKeyPrefix: 'routes/apps/chain-tools/trends/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/trends/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/trends/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'dune', context: 'on-chain analytics' },
				{ toolId: 'nansen', context: 'smart money tracking' }
			]
		},

		// Part 2: On-Chain Signals
		{
			id: 'on-chain-signals',
			titleKey: 'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.title',
			contentKey: 'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.content',
			subsections: [
				{
					id: 'tvl-movements',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.tvl_movements.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.tvl_movements.content',
					toolMentions: [
						{ toolId: 'defillama', context: 'TVL tracking' },
						{ toolId: 'dune', context: 'custom analytics' }
					]
				},
				{
					id: 'gas-patterns',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.gas_patterns.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.gas_patterns.content'
				},
				{
					id: 'contract-deployments',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.contract_deployments.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.contract_deployments.content'
				},
				{
					id: 'unique-addresses',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.unique_addresses.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.on_chain_signals.unique_addresses.content',
					toolMentions: [{ toolId: 'dune' }]
				}
			]
		},

		// Part 3: Social Signals
		{
			id: 'social-signals',
			titleKey: 'routes/apps/chain-tools/trends/guide.sections.social_signals.title',
			contentKey: 'routes/apps/chain-tools/trends/guide.sections.social_signals.content',
			subsections: [
				{
					id: 'twitter-mentions',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.social_signals.twitter_mentions.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.social_signals.twitter_mentions.content',
					toolMentions: [{ toolId: 'lunarcrush', context: 'social analytics' }]
				},
				{
					id: 'discord-activity',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.social_signals.discord_activity.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.social_signals.discord_activity.content'
				},
				{
					id: 'github-commits',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.social_signals.github_commits.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.social_signals.github_commits.content'
				},
				{
					id: 'google-trends',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.social_signals.google_trends.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.social_signals.google_trends.content'
				}
			]
		},

		// Part 4: Market Signals
		{
			id: 'market-signals',
			titleKey: 'routes/apps/chain-tools/trends/guide.sections.market_signals.title',
			contentKey: 'routes/apps/chain-tools/trends/guide.sections.market_signals.content',
			subsections: [
				{
					id: 'volume-spikes',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.market_signals.volume_spikes.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.market_signals.volume_spikes.content'
				},
				{
					id: 'exchange-flows',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.market_signals.exchange_flows.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.market_signals.exchange_flows.content',
					toolMentions: [{ toolId: 'glassnode', context: 'exchange flow data' }]
				},
				{
					id: 'funding-rates',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.market_signals.funding_rates.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.market_signals.funding_rates.content'
				},
				{
					id: 'open-interest',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.market_signals.open_interest.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.market_signals.open_interest.content'
				}
			]
		},

		// Part 5: Whale Watching
		{
			id: 'whale-watching',
			titleKey: 'routes/apps/chain-tools/trends/guide.sections.whale_watching.title',
			contentKey: 'routes/apps/chain-tools/trends/guide.sections.whale_watching.content',
			subsections: [
				{
					id: 'identifying-whales',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.whale_watching.identifying_whales.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.whale_watching.identifying_whales.content',
					toolMentions: [
						{ toolId: 'nansen', context: 'wallet labels' },
						{ toolId: 'arkham', context: 'entity identification' }
					]
				},
				{
					id: 'smart-money',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.whale_watching.smart_money.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.whale_watching.smart_money.content',
					toolMentions: [{ toolId: 'nansen' }]
				},
				{
					id: 'accumulation-patterns',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.whale_watching.accumulation_patterns.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.whale_watching.accumulation_patterns.content'
				}
			]
		},

		// Part 6: Narrative Tracking
		{
			id: 'narrative-tracking',
			titleKey: 'routes/apps/chain-tools/trends/guide.sections.narrative_tracking.title',
			contentKey: 'routes/apps/chain-tools/trends/guide.sections.narrative_tracking.content',
			subsections: [
				{
					id: 'identifying-narratives',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.narrative_tracking.identifying_narratives.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.narrative_tracking.identifying_narratives.content',
					toolMentions: [{ toolId: 'messari', context: 'research and narratives' }]
				},
				{
					id: 'sector-rotation',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.narrative_tracking.sector_rotation.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.narrative_tracking.sector_rotation.content',
					toolMentions: [{ toolId: 'defillama' }]
				},
				{
					id: 'cycle-stages',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.narrative_tracking.cycle_stages.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.narrative_tracking.cycle_stages.content'
				}
			]
		},

		// Part 7: Tools & Dashboards
		{
			id: 'tools-dashboards',
			titleKey: 'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.title',
			contentKey: 'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.content',
			subsections: [
				{
					id: 'dune-analytics',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.dune_analytics.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.dune_analytics.content',
					toolMentions: [{ toolId: 'dune', context: 'custom SQL queries' }]
				},
				{
					id: 'nansen',
					titleKey: 'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.nansen.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.nansen.content',
					toolMentions: [{ toolId: 'nansen' }]
				},
				{
					id: 'defillama',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.defillama.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.defillama.content',
					toolMentions: [{ toolId: 'defillama' }]
				},
				{
					id: 'arkham',
					titleKey: 'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.arkham.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.tools_dashboards.arkham.content',
					toolMentions: [{ toolId: 'arkham' }]
				}
			]
		},

		// Part 8: Building Your Alpha System
		{
			id: 'alpha-system',
			titleKey: 'routes/apps/chain-tools/trends/guide.sections.alpha_system.title',
			contentKey: 'routes/apps/chain-tools/trends/guide.sections.alpha_system.content',
			subsections: [
				{
					id: 'creating-alerts',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.alpha_system.creating_alerts.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.alpha_system.creating_alerts.content'
				},
				{
					id: 'combining-signals',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.alpha_system.combining_signals.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.alpha_system.combining_signals.content'
				},
				{
					id: 'avoiding-fomo',
					titleKey:
						'routes/apps/chain-tools/trends/guide.sections.alpha_system.avoiding_fomo.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.alpha_system.avoiding_fomo.content'
				},
				{
					id: 'backtesting',
					titleKey: 'routes/apps/chain-tools/trends/guide.sections.alpha_system.backtesting.title',
					contentKey:
						'routes/apps/chain-tools/trends/guide.sections.alpha_system.backtesting.content',
					toolMentions: [{ toolId: 'dune' }]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'alpha',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.alpha.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.alpha.definition'
		},
		{
			id: 'tvl',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.tvl.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.tvl.definition',
			relatedToolIds: ['defillama']
		},
		{
			id: 'smart-money',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.smart_money.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.smart_money.definition',
			relatedToolIds: ['nansen']
		},
		{
			id: 'whale',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.whale.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.whale.definition',
			relatedToolIds: ['arkham', 'nansen']
		},
		{
			id: 'accumulation',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.accumulation.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.accumulation.definition'
		},
		{
			id: 'distribution',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.distribution.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.distribution.definition'
		},
		{
			id: 'narrative',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.narrative.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.narrative.definition',
			relatedToolIds: ['messari']
		},
		{
			id: 'sector-rotation',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.sector_rotation.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.sector_rotation.definition'
		},
		{
			id: 'funding-rate',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.funding_rate.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.funding_rate.definition'
		},
		{
			id: 'open-interest',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.open_interest.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.open_interest.definition'
		},
		{
			id: 'on-chain-metrics',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.on_chain_metrics.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.on_chain_metrics.definition',
			relatedToolIds: ['dune', 'nansen']
		},
		{
			id: 'social-signals',
			termKey: 'routes/apps/chain-tools/trends/guide.glossary.social_signals.term',
			definitionKey: 'routes/apps/chain-tools/trends/guide.glossary.social_signals.definition',
			relatedToolIds: ['lunarcrush', 'santiment']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'dune',
		'nansen',
		'defillama',
		'arkham',
		'santiment',
		'messari',
		'glassnode',
		'lunarcrush'
	],

	lastUpdated: '2025-12-31'
};

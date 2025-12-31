/**
 * News Category Guide Data
 * Comprehensive guide on curating Web3 information and finding alpha
 *
 * Content philosophy:
 * - Focus on information quality and verification over quantity
 * - Emphasize practical alpha-hunting strategies
 * - Help users build their own information edge
 * - Teach critical evaluation of sources and signals
 */
import type { CategoryGuide } from '../../types';

export const newsGuide: CategoryGuide = {
	categoryId: 'news',
	i18nKeyPrefix: 'routes/apps/chain-tools/news/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/news/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/news/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'twitter', context: 'primary alpha source' },
				{ toolId: 'telegram', context: 'real-time discussions' }
			]
		},

		// Part 2: News Source Evaluation
		{
			id: 'source-evaluation',
			titleKey: 'routes/apps/chain-tools/news/guide.sections.source_evaluation.title',
			contentKey: 'routes/apps/chain-tools/news/guide.sections.source_evaluation.content',
			subsections: [
				{
					id: 'tier-system',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.source_evaluation.tier_system.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.source_evaluation.tier_system.content'
				},
				{
					id: 'credibility',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.source_evaluation.credibility.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.source_evaluation.credibility.content',
					toolMentions: [
						{ toolId: 'theblock', context: 'reputable crypto news' },
						{ toolId: 'coindesk', context: 'established media' }
					]
				},
				{
					id: 'cross-reference',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.source_evaluation.cross_reference.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.source_evaluation.cross_reference.content'
				}
			]
		},

		// Part 3: Real-Time Information Channels
		{
			id: 'realtime-channels',
			titleKey: 'routes/apps/chain-tools/news/guide.sections.realtime_channels.title',
			contentKey: 'routes/apps/chain-tools/news/guide.sections.realtime_channels.content',
			subsections: [
				{
					id: 'twitter-optimization',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.realtime_channels.twitter_optimization.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.realtime_channels.twitter_optimization.content',
					toolMentions: [{ toolId: 'twitter', context: 'alpha discovery platform' }]
				},
				{
					id: 'telegram-alpha',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.realtime_channels.telegram_alpha.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.realtime_channels.telegram_alpha.content',
					toolMentions: [{ toolId: 'telegram', context: 'community alpha groups' }]
				},
				{
					id: 'discord-servers',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.realtime_channels.discord_servers.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.realtime_channels.discord_servers.content',
					toolMentions: [{ toolId: 'discord', context: 'project communities' }]
				},
				{
					id: 'aggregators',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.realtime_channels.aggregators.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.realtime_channels.aggregators.content',
					toolMentions: [{ toolId: 'blockworks', context: 'news aggregation' }]
				}
			]
		},

		// Part 4: Identifying Misinformation
		{
			id: 'misinformation',
			titleKey: 'routes/apps/chain-tools/news/guide.sections.misinformation.title',
			contentKey: 'routes/apps/chain-tools/news/guide.sections.misinformation.content',
			subsections: [
				{
					id: 'fud-tactics',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.misinformation.fud_tactics.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.misinformation.fud_tactics.content'
				},
				{
					id: 'fake-patterns',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.misinformation.fake_patterns.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.misinformation.fake_patterns.content'
				},
				{
					id: 'fact-checking',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.misinformation.fact_checking.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.misinformation.fact_checking.content'
				}
			]
		},

		// Part 5: On-Chain as News Source
		{
			id: 'onchain-intel',
			titleKey: 'routes/apps/chain-tools/news/guide.sections.onchain_intel.title',
			contentKey: 'routes/apps/chain-tools/news/guide.sections.onchain_intel.content',
			subsections: [
				{
					id: 'smart-money',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.onchain_intel.smart_money.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.onchain_intel.smart_money.content',
					toolMentions: [
						{ toolId: 'nansen', context: 'smart money tracking' },
						{ toolId: 'arkham', context: 'wallet intelligence' }
					]
				},
				{
					id: 'contract-events',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.onchain_intel.contract_events.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.onchain_intel.contract_events.content'
				},
				{
					id: 'whale-activity',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.onchain_intel.whale_activity.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.onchain_intel.whale_activity.content'
				},
				{
					id: 'governance',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.onchain_intel.governance.title',
					contentKey: 'routes/apps/chain-tools/news/guide.sections.onchain_intel.governance.content'
				}
			]
		},

		// Part 6: Building Your Information System
		{
			id: 'info-system',
			titleKey: 'routes/apps/chain-tools/news/guide.sections.info_system.title',
			contentKey: 'routes/apps/chain-tools/news/guide.sections.info_system.content',
			subsections: [
				{
					id: 'curation',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.info_system.curation.title',
					contentKey: 'routes/apps/chain-tools/news/guide.sections.info_system.curation.content'
				},
				{
					id: 'alerts',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.info_system.alerts.title',
					contentKey: 'routes/apps/chain-tools/news/guide.sections.info_system.alerts.content',
					toolMentions: [{ toolId: 'defillama', context: 'protocol tracking' }]
				},
				{
					id: 'newsletters',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.info_system.newsletters.title',
					contentKey: 'routes/apps/chain-tools/news/guide.sections.info_system.newsletters.content'
				},
				{
					id: 'avoiding-overload',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.info_system.avoiding_overload.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.info_system.avoiding_overload.content'
				}
			]
		},

		// Part 7: From Information to Action
		{
			id: 'info-to-action',
			titleKey: 'routes/apps/chain-tools/news/guide.sections.info_to_action.title',
			contentKey: 'routes/apps/chain-tools/news/guide.sections.info_to_action.content',
			subsections: [
				{
					id: 'speed-vs-accuracy',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.info_to_action.speed_vs_accuracy.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.info_to_action.speed_vs_accuracy.content'
				},
				{
					id: 'verification',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.info_to_action.verification.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.info_to_action.verification.content'
				},
				{
					id: 'position-sizing',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.info_to_action.position_sizing.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.info_to_action.position_sizing.content'
				},
				{
					id: 'timing',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.info_to_action.timing.title',
					contentKey: 'routes/apps/chain-tools/news/guide.sections.info_to_action.timing.content'
				}
			]
		},

		// Part 8: Alpha Hunting Strategies
		{
			id: 'alpha-hunting',
			titleKey: 'routes/apps/chain-tools/news/guide.sections.alpha_hunting.title',
			contentKey: 'routes/apps/chain-tools/news/guide.sections.alpha_hunting.content',
			subsections: [
				{
					id: 'following-smart-people',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.alpha_hunting.following_smart_people.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.alpha_hunting.following_smart_people.content'
				},
				{
					id: 'reading-between-lines',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.alpha_hunting.reading_between_lines.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.alpha_hunting.reading_between_lines.content'
				},
				{
					id: 'connecting-dots',
					titleKey:
						'routes/apps/chain-tools/news/guide.sections.alpha_hunting.connecting_dots.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.alpha_hunting.connecting_dots.content'
				},
				{
					id: 'building-edge',
					titleKey: 'routes/apps/chain-tools/news/guide.sections.alpha_hunting.building_edge.title',
					contentKey:
						'routes/apps/chain-tools/news/guide.sections.alpha_hunting.building_edge.content',
					toolMentions: [
						{ toolId: 'nansen', context: 'data edge' },
						{ toolId: 'defillama', context: 'protocol intelligence' }
					]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'alpha',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.alpha.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.alpha.definition'
		},
		{
			id: 'fud',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.fud.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.fud.definition'
		},
		{
			id: 'fomo',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.fomo.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.fomo.definition'
		},
		{
			id: 'breaking-news',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.breaking_news.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.breaking_news.definition'
		},
		{
			id: 'rumor',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.rumor.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.rumor.definition'
		},
		{
			id: 'verification',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.verification.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.verification.definition'
		},
		{
			id: 'onchain-intel',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.onchain_intel.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.onchain_intel.definition',
			relatedToolIds: ['nansen', 'arkham']
		},
		{
			id: 'smart-money',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.smart_money.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.smart_money.definition',
			relatedToolIds: ['nansen', 'arkham']
		},
		{
			id: 'information-edge',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.information_edge.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.information_edge.definition'
		},
		{
			id: 'signal-noise',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.signal_noise.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.signal_noise.definition'
		},
		{
			id: 'aggregator',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.aggregator.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.aggregator.definition',
			relatedToolIds: ['blockworks', 'defillama']
		},
		{
			id: 'primary-source',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.primary_source.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.primary_source.definition'
		},
		{
			id: 'secondary-source',
			termKey: 'routes/apps/chain-tools/news/guide.glossary.secondary_source.term',
			definitionKey: 'routes/apps/chain-tools/news/guide.glossary.secondary_source.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'twitter',
		'telegram',
		'discord',
		'nansen',
		'arkham',
		'defillama',
		'blockworks',
		'theblock',
		'decrypt',
		'coindesk'
	],

	lastUpdated: '2025-12-31'
};

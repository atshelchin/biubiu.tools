/**
 * Community Category Guide Data
 * Web3 Community Analysis & Authentic Engagement Guide
 *
 * Content philosophy:
 * - Focus on detecting fake communities and understanding real engagement
 * - Include specific metrics and benchmarks for health assessment
 * - Emphasize practical due diligence over vanity metrics
 * - Help users distinguish between real communities and paid marketing
 */
import type { CategoryGuide } from '../../types';

export const communityGuide: CategoryGuide = {
	categoryId: 'community',
	i18nKeyPrefix: 'routes/apps/chain-tools/community/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/community/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/community/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'discord', context: 'community platform' },
				{ toolId: 'telegram', context: 'communication tool' }
			]
		},

		// Part 2: Discord Analysis
		{
			id: 'discord-analysis',
			titleKey: 'routes/apps/chain-tools/community/guide.sections.discord_analysis.title',
			contentKey: 'routes/apps/chain-tools/community/guide.sections.discord_analysis.content',
			subsections: [
				{
					id: 'member-metrics',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.discord_analysis.member_metrics.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.discord_analysis.member_metrics.content',
					toolMentions: [{ toolId: 'discord' }]
				},
				{
					id: 'activity-patterns',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.discord_analysis.activity_patterns.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.discord_analysis.activity_patterns.content'
				},
				{
					id: 'bot-detection',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.discord_analysis.bot_detection.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.discord_analysis.bot_detection.content'
				},
				{
					id: 'role-distribution',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.discord_analysis.role_distribution.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.discord_analysis.role_distribution.content'
				}
			]
		},

		// Part 3: Telegram Analysis
		{
			id: 'telegram-analysis',
			titleKey: 'routes/apps/chain-tools/community/guide.sections.telegram_analysis.title',
			contentKey: 'routes/apps/chain-tools/community/guide.sections.telegram_analysis.content',
			subsections: [
				{
					id: 'authenticity-checking',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.telegram_analysis.authenticity_checking.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.telegram_analysis.authenticity_checking.content',
					toolMentions: [{ toolId: 'telegram' }]
				},
				{
					id: 'message-patterns',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.telegram_analysis.message_patterns.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.telegram_analysis.message_patterns.content'
				},
				{
					id: 'admin-responsiveness',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.telegram_analysis.admin_responsiveness.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.telegram_analysis.admin_responsiveness.content'
				},
				{
					id: 'spam-detection',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.telegram_analysis.spam_detection.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.telegram_analysis.spam_detection.content'
				}
			]
		},

		// Part 4: Detecting Fake Communities
		{
			id: 'fake-communities',
			titleKey: 'routes/apps/chain-tools/community/guide.sections.fake_communities.title',
			contentKey: 'routes/apps/chain-tools/community/guide.sections.fake_communities.content',
			subsections: [
				{
					id: 'bought-members',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.fake_communities.bought_members.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.fake_communities.bought_members.content'
				},
				{
					id: 'manipulation-tactics',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.fake_communities.manipulation_tactics.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.fake_communities.manipulation_tactics.content'
				},
				{
					id: 'ghost-town-indicators',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.fake_communities.ghost_town_indicators.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.fake_communities.ghost_town_indicators.content'
				},
				{
					id: 'case-studies',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.fake_communities.case_studies.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.fake_communities.case_studies.content'
				}
			]
		},

		// Part 5: Healthy Community Metrics
		{
			id: 'healthy-metrics',
			titleKey: 'routes/apps/chain-tools/community/guide.sections.healthy_metrics.title',
			contentKey: 'routes/apps/chain-tools/community/guide.sections.healthy_metrics.content',
			subsections: [
				{
					id: 'retention-rates',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.retention_rates.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.retention_rates.content'
				},
				{
					id: 'onboarding-quality',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.onboarding_quality.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.onboarding_quality.content'
				},
				{
					id: 'user-content',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.user_content.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.user_content.content'
				},
				{
					id: 'governance-participation',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.governance_participation.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.governance_participation.content',
					toolMentions: [{ toolId: 'snapshot' }]
				},
				{
					id: 'cross-platform',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.cross_platform.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.healthy_metrics.cross_platform.content'
				}
			]
		},

		// Part 6: Building Authentic Communities
		{
			id: 'building-communities',
			titleKey: 'routes/apps/chain-tools/community/guide.sections.building_communities.title',
			contentKey: 'routes/apps/chain-tools/community/guide.sections.building_communities.content',
			subsections: [
				{
					id: 'community-first',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.building_communities.community_first.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.building_communities.community_first.content'
				},
				{
					id: 'moderation',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.building_communities.moderation.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.building_communities.moderation.content',
					toolMentions: [{ toolId: 'discord' }, { toolId: 'telegram' }]
				},
				{
					id: 'incentive-design',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.building_communities.incentive_design.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.building_communities.incentive_design.content'
				},
				{
					id: 'scaling-culture',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.building_communities.scaling_culture.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.building_communities.scaling_culture.content'
				}
			]
		},

		// Part 7: Community Due Diligence Checklist
		{
			id: 'due-diligence',
			titleKey: 'routes/apps/chain-tools/community/guide.sections.due_diligence.title',
			contentKey: 'routes/apps/chain-tools/community/guide.sections.due_diligence.content',
			subsections: [
				{
					id: 'quick-assessment',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.due_diligence.quick_assessment.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.due_diligence.quick_assessment.content'
				},
				{
					id: 'deep-dive',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.due_diligence.deep_dive.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.due_diligence.deep_dive.content'
				},
				{
					id: 'red-flags',
					titleKey:
						'routes/apps/chain-tools/community/guide.sections.due_diligence.red_flags.title',
					contentKey:
						'routes/apps/chain-tools/community/guide.sections.due_diligence.red_flags.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'dau',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.dau.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.dau.definition'
		},
		{
			id: 'mau',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.mau.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.mau.definition'
		},
		{
			id: 'retention-rate',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.retention_rate.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.retention_rate.definition'
		},
		{
			id: 'churn',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.churn.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.churn.definition'
		},
		{
			id: 'engagement-rate',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.engagement_rate.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.engagement_rate.definition'
		},
		{
			id: 'community-manager',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.community_manager.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.community_manager.definition'
		},
		{
			id: 'moderator',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.moderator.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.moderator.definition'
		},
		{
			id: 'raid',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.raid.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.raid.definition'
		},
		{
			id: 'shill',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.shill.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.shill.definition'
		},
		{
			id: 'fud',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.fud.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.fud.definition'
		},
		{
			id: 'alpha-group',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.alpha_group.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.alpha_group.definition'
		},
		{
			id: 'whale-group',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.whale_group.term',
			definitionKey: 'routes/apps/chain-tools/community/guide.glossary.whale_group.definition'
		},
		{
			id: 'governance-participation',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.governance_participation.term',
			definitionKey:
				'routes/apps/chain-tools/community/guide.glossary.governance_participation.definition',
			relatedToolIds: ['snapshot']
		},
		{
			id: 'community-led-growth',
			termKey: 'routes/apps/chain-tools/community/guide.glossary.community_led_growth.term',
			definitionKey:
				'routes/apps/chain-tools/community/guide.glossary.community_led_growth.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: ['discord', 'telegram', 'snapshot', 'twitter'],

	lastUpdated: '2025-12-31'
};

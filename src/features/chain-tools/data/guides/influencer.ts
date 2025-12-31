/**
 * Influencer Category Guide Data
 * Web3 Influencer Analysis & Fake KOL Detection Guide
 *
 * Content philosophy:
 * - Focus on practical detection methods and red flags
 * - Include specific metrics and benchmarks for evaluation
 * - Emphasize due diligence and authentic influence building
 * - Progressive learning from basic metrics to advanced analysis
 */
import type { CategoryGuide } from '../../types';

export const influencerGuide: CategoryGuide = {
	categoryId: 'influencer',
	i18nKeyPrefix: 'routes/apps/chain-tools/influencer/guide',
	estimatedReadTime: '22 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/influencer/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/influencer/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'sparktoro', context: 'audience analysis' },
				{ toolId: 'nansen', context: 'on-chain verification' }
			]
		},

		// Part 2: Twitter/X Deep Analysis
		{
			id: 'twitter-analysis',
			titleKey: 'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.title',
			contentKey: 'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.content',
			subsections: [
				{
					id: 'real-vs-fake',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.real_vs_fake.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.real_vs_fake.content'
				},
				{
					id: 'engagement-rate',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.engagement_rate.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.engagement_rate.content'
				},
				{
					id: 'follower-growth',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.follower_growth.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.follower_growth.content',
					toolMentions: [{ toolId: 'socialblade', context: 'growth tracking' }]
				},
				{
					id: 'reach-metrics',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.reach_metrics.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.twitter_analysis.reach_metrics.content'
				}
			]
		},

		// Part 3: Identifying Fake Metrics
		{
			id: 'fake-metrics',
			titleKey: 'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.title',
			contentKey: 'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.content',
			subsections: [
				{
					id: 'manipulation-tactics',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.manipulation_tactics.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.manipulation_tactics.content'
				},
				{
					id: 'demographic-red-flags',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.demographic_red_flags.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.demographic_red_flags.content',
					toolMentions: [
						{ toolId: 'sparktoro', context: 'audience demographics' },
						{ toolId: 'hypeauditor', context: 'fake follower detection' }
					]
				},
				{
					id: 'engagement-patterns',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.engagement_patterns.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.engagement_patterns.content',
					toolMentions: [{ toolId: 'botometer', context: 'bot detection' }]
				},
				{
					id: 'detection-tools',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.detection_tools.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.fake_metrics.detection_tools.content',
					toolMentions: [
						{ toolId: 'sparktoro' },
						{ toolId: 'socialblade' },
						{ toolId: 'botometer' },
						{ toolId: 'hypeauditor' }
					]
				}
			]
		},

		// Part 4: Real Influence Indicators
		{
			id: 'real-influence',
			titleKey: 'routes/apps/chain-tools/influencer/guide.sections.real_influence.title',
			contentKey: 'routes/apps/chain-tools/influencer/guide.sections.real_influence.content',
			subsections: [
				{
					id: 'quality-engagement',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.real_influence.quality_engagement.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.real_influence.quality_engagement.content'
				},
				{
					id: 'conversion-rate',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.real_influence.conversion_rate.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.real_influence.conversion_rate.content'
				},
				{
					id: 'cross-platform',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.real_influence.cross_platform.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.real_influence.cross_platform.content'
				},
				{
					id: 'onchain-correlation',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.real_influence.onchain_correlation.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.real_influence.onchain_correlation.content',
					toolMentions: [
						{ toolId: 'nansen', context: 'wallet tracking' },
						{ toolId: 'dune', context: 'on-chain analytics' }
					]
				}
			]
		},

		// Part 5: KOL Due Diligence
		{
			id: 'kol-due-diligence',
			titleKey: 'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.title',
			contentKey: 'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.content',
			subsections: [
				{
					id: 'background-research',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.background_research.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.background_research.content'
				},
				{
					id: 'promotion-history',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.promotion_history.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.promotion_history.content',
					toolMentions: [{ toolId: 'tweetdeck', context: 'timeline analysis' }]
				},
				{
					id: 'paid-vs-organic',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.paid_vs_organic.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.paid_vs_organic.content'
				},
				{
					id: 'disclosure-compliance',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.disclosure_compliance.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.kol_due_diligence.disclosure_compliance.content'
				}
			]
		},

		// Part 6: Working with Influencers
		{
			id: 'working-with-influencers',
			titleKey: 'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.title',
			contentKey:
				'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.content',
			subsections: [
				{
					id: 'evaluating-partners',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.evaluating_partners.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.evaluating_partners.content'
				},
				{
					id: 'pricing-benchmarks',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.pricing_benchmarks.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.pricing_benchmarks.content'
				},
				{
					id: 'performance-tracking',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.performance_tracking.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.performance_tracking.content'
				},
				{
					id: 'negotiation-red-flags',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.negotiation_red_flags.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.working_with_influencers.negotiation_red_flags.content'
				}
			]
		},

		// Part 7: Building Authentic Influence
		{
			id: 'building-influence',
			titleKey: 'routes/apps/chain-tools/influencer/guide.sections.building_influence.title',
			contentKey: 'routes/apps/chain-tools/influencer/guide.sections.building_influence.content',
			subsections: [
				{
					id: 'content-strategy',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.building_influence.content_strategy.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.building_influence.content_strategy.content'
				},
				{
					id: 'engagement-techniques',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.building_influence.engagement_techniques.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.building_influence.engagement_techniques.content'
				},
				{
					id: 'onchain-credibility',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.building_influence.onchain_credibility.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.building_influence.onchain_credibility.content',
					toolMentions: [{ toolId: 'nansen', context: 'wallet reputation' }]
				},
				{
					id: 'avoiding-shortcuts',
					titleKey:
						'routes/apps/chain-tools/influencer/guide.sections.building_influence.avoiding_shortcuts.title',
					contentKey:
						'routes/apps/chain-tools/influencer/guide.sections.building_influence.avoiding_shortcuts.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'kol',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.kol.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.kol.definition'
		},
		{
			id: 'engagement-rate',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.engagement_rate.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.engagement_rate.definition'
		},
		{
			id: 'impressions',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.impressions.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.impressions.definition'
		},
		{
			id: 'reach',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.reach.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.reach.definition'
		},
		{
			id: 'ctr',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.ctr.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.ctr.definition'
		},
		{
			id: 'bot-farm',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.bot_farm.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.bot_farm.definition'
		},
		{
			id: 'engagement-pod',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.engagement_pod.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.engagement_pod.definition'
		},
		{
			id: 'follower-ratio',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.follower_ratio.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.follower_ratio.definition'
		},
		{
			id: 'shill',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.shill.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.shill.definition'
		},
		{
			id: 'paid-promotion',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.paid_promotion.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.paid_promotion.definition'
		},
		{
			id: 'organic-growth',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.organic_growth.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.organic_growth.definition'
		},
		{
			id: 'influencer-marketing',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.influencer_marketing.term',
			definitionKey:
				'routes/apps/chain-tools/influencer/guide.glossary.influencer_marketing.definition'
		},
		{
			id: 'social-proof',
			termKey: 'routes/apps/chain-tools/influencer/guide.glossary.social_proof.term',
			definitionKey: 'routes/apps/chain-tools/influencer/guide.glossary.social_proof.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'sparktoro',
		'socialblade',
		'botometer',
		'hypeauditor',
		'tweetdeck',
		'nansen',
		'dune'
	],

	lastUpdated: '2025-12-31'
};

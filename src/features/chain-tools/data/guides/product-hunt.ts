/**
 * Product Hunt Category Guide Data
 * Web3 Product Cold Start & Opportunity Discovery Guide
 *
 * Content philosophy:
 * - Focus on both discovering opportunities AND launching products
 * - Include practical strategies for early access and airdrop farming
 * - Emphasize risk assessment and due diligence
 * - Help users build systematic discovery processes
 */
import type { CategoryGuide } from '../../types';

export const productHuntGuide: CategoryGuide = {
	categoryId: 'product-hunt',
	i18nKeyPrefix: 'routes/apps/chain-tools/product-hunt/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/product-hunt/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/product-hunt/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'producthunt', context: 'tech product discovery' },
				{ toolId: 'twitter', context: 'Web3 alpha hunting' }
			]
		},

		// Part 2: Discovery Channels
		{
			id: 'discovery-channels',
			titleKey: 'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.title',
			contentKey: 'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.content',
			subsections: [
				{
					id: 'product-hunt',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.product_hunt.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.product_hunt.content',
					toolMentions: [{ toolId: 'producthunt' }]
				},
				{
					id: 'twitter-alpha',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.twitter_alpha.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.twitter_alpha.content',
					toolMentions: [{ toolId: 'twitter' }]
				},
				{
					id: 'communities',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.communities.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.communities.content',
					toolMentions: [{ toolId: 'discord' }, { toolId: 'telegram' }]
				},
				{
					id: 'data-platforms',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.data_platforms.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_channels.data_platforms.content',
					toolMentions: [
						{ toolId: 'defillama', context: 'protocol tracking' },
						{ toolId: 'dappradar', context: 'dApp discovery' }
					]
				}
			]
		},

		// Part 3: Early Access Strategies
		{
			id: 'early-access',
			titleKey: 'routes/apps/chain-tools/product-hunt/guide.sections.early_access.title',
			contentKey: 'routes/apps/chain-tools/product-hunt/guide.sections.early_access.content',
			subsections: [
				{
					id: 'beta-testing',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.early_access.beta_testing.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.early_access.beta_testing.content'
				},
				{
					id: 'testnet-participation',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.early_access.testnet_participation.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.early_access.testnet_participation.content'
				},
				{
					id: 'ambassador-programs',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.early_access.ambassador_programs.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.early_access.ambassador_programs.content'
				}
			]
		},

		// Part 4: Evaluating New Products
		{
			id: 'product-evaluation',
			titleKey: 'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.title',
			contentKey: 'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.content',
			subsections: [
				{
					id: 'team-background',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.team_background.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.team_background.content'
				},
				{
					id: 'funding-investors',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.funding_investors.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.funding_investors.content'
				},
				{
					id: 'tokenomics',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.tokenomics.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.tokenomics.content'
				},
				{
					id: 'roadmap-execution',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.roadmap_execution.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.product_evaluation.roadmap_execution.content'
				}
			]
		},

		// Part 5: Cold Start Guide (For Builders)
		{
			id: 'cold-start',
			titleKey: 'routes/apps/chain-tools/product-hunt/guide.sections.cold_start.title',
			contentKey: 'routes/apps/chain-tools/product-hunt/guide.sections.cold_start.content',
			subsections: [
				{
					id: 'launch-strategies',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.cold_start.launch_strategies.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.cold_start.launch_strategies.content',
					toolMentions: [{ toolId: 'producthunt' }, { toolId: 'twitter' }]
				},
				{
					id: 'community-building',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.cold_start.community_building.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.cold_start.community_building.content',
					toolMentions: [{ toolId: 'discord' }, { toolId: 'telegram' }]
				},
				{
					id: 'growth-hacking',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.cold_start.growth_hacking.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.cold_start.growth_hacking.content'
				}
			]
		},

		// Part 6: Airdrop Farming
		{
			id: 'airdrop-farming',
			titleKey: 'routes/apps/chain-tools/product-hunt/guide.sections.airdrop_farming.title',
			contentKey: 'routes/apps/chain-tools/product-hunt/guide.sections.airdrop_farming.content',
			subsections: [
				{
					id: 'early-user-rewards',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.airdrop_farming.early_user_rewards.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.airdrop_farming.early_user_rewards.content'
				},
				{
					id: 'points-systems',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.airdrop_farming.points_systems.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.airdrop_farming.points_systems.content'
				},
				{
					id: 'optimal-strategies',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.airdrop_farming.optimal_strategies.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.airdrop_farming.optimal_strategies.content'
				}
			]
		},

		// Part 7: Risk Assessment
		{
			id: 'risk-assessment',
			titleKey: 'routes/apps/chain-tools/product-hunt/guide.sections.risk_assessment.title',
			contentKey: 'routes/apps/chain-tools/product-hunt/guide.sections.risk_assessment.content',
			subsections: [
				{
					id: 'rug-pull-signs',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.risk_assessment.rug_pull_signs.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.risk_assessment.rug_pull_signs.content'
				},
				{
					id: 'due-diligence',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.risk_assessment.due_diligence.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.risk_assessment.due_diligence.content'
				},
				{
					id: 'red-flags',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.risk_assessment.red_flags.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.risk_assessment.red_flags.content'
				}
			]
		},

		// Part 8: Building Your Discovery System
		{
			id: 'discovery-system',
			titleKey: 'routes/apps/chain-tools/product-hunt/guide.sections.discovery_system.title',
			contentKey: 'routes/apps/chain-tools/product-hunt/guide.sections.discovery_system.content',
			subsections: [
				{
					id: 'alerts-setup',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_system.alerts_setup.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_system.alerts_setup.content'
				},
				{
					id: 'following-alpha',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_system.following_alpha.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_system.following_alpha.content',
					toolMentions: [{ toolId: 'twitter' }]
				},
				{
					id: 'curating-sources',
					titleKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_system.curating_sources.title',
					contentKey:
						'routes/apps/chain-tools/product-hunt/guide.sections.discovery_system.curating_sources.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'cold-start',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.cold_start.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.cold_start.definition'
		},
		{
			id: 'product-market-fit',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.product_market_fit.term',
			definitionKey:
				'routes/apps/chain-tools/product-hunt/guide.glossary.product_market_fit.definition'
		},
		{
			id: 'testnet',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.testnet.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.testnet.definition'
		},
		{
			id: 'mainnet',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.mainnet.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.mainnet.definition'
		},
		{
			id: 'alpha',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.alpha.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.alpha.definition'
		},
		{
			id: 'beta',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.beta.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.beta.definition'
		},
		{
			id: 'airdrop',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.airdrop.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.airdrop.definition'
		},
		{
			id: 'retroactive-airdrop',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.retroactive_airdrop.term',
			definitionKey:
				'routes/apps/chain-tools/product-hunt/guide.glossary.retroactive_airdrop.definition'
		},
		{
			id: 'points-system',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.points_system.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.points_system.definition'
		},
		{
			id: 'waitlist',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.waitlist.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.waitlist.definition'
		},
		{
			id: 'ambassador',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.ambassador.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.ambassador.definition'
		},
		{
			id: 'growth-hacking',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.growth_hacking.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.growth_hacking.definition'
		},
		{
			id: 'rug-pull',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.rug_pull.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.rug_pull.definition'
		},
		{
			id: 'due-diligence',
			termKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.due_diligence.term',
			definitionKey: 'routes/apps/chain-tools/product-hunt/guide.glossary.due_diligence.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'producthunt',
		'twitter',
		'discord',
		'telegram',
		'defillama',
		'dappradar',
		'coinmarketcap',
		'coingecko'
	],

	lastUpdated: '2025-12-31'
};

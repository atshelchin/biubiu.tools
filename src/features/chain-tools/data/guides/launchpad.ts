/**
 * Launchpad Category Guide Data
 * Comprehensive guide on token launches, IDOs, fair launches, and vesting mechanisms
 *
 * Content philosophy:
 * - Focus on understanding launch mechanisms and participation strategies
 * - Include real examples of successful and failed launches
 * - Emphasize due diligence and risk assessment
 * - Progressive learning from launch types to evaluation criteria
 */
import type { CategoryGuide } from '../../types';

export const launchpadGuide: CategoryGuide = {
	categoryId: 'launchpad',
	i18nKeyPrefix: 'routes/apps/chain-tools/launchpad/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding Token Launches
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'dao-maker', context: 'leading IDO platform' },
				{ toolId: 'fjord-foundry', context: 'fair launch via LBP' }
			]
		},

		// Part 2: Launch Types
		{
			id: 'launch-types',
			titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.launch_types.title',
			contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.launch_types.content',
			subsections: [
				{
					id: 'ico-history',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.launch_types.ico_history.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.launch_types.ico_history.content'
				},
				{
					id: 'ido',
					titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.launch_types.ido.title',
					contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.launch_types.ido.content',
					toolMentions: [
						{ toolId: 'dao-maker', context: 'Strong Holder Offering' },
						{ toolId: 'seedify', context: 'tiered allocation' },
						{ toolId: 'polkastarter', context: 'whitelist-based' }
					]
				},
				{
					id: 'ieo',
					titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.launch_types.ieo.title',
					contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.launch_types.ieo.content'
				},
				{
					id: 'fair-launch',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.launch_types.fair_launch.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.launch_types.fair_launch.content',
					toolMentions: [
						{ toolId: 'pump-fun', context: 'bonding curve launch' },
						{ toolId: 'four_meme', context: 'fair launch on BNB' }
					]
				},
				{
					id: 'lbp',
					titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.launch_types.lbp.title',
					contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.launch_types.lbp.content',
					toolMentions: [{ toolId: 'fjord-foundry', context: 'LBP platform' }]
				}
			]
		},

		// Part 3: Major Launchpad Platforms
		{
			id: 'major-launchpads',
			titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.title',
			contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.content',
			subsections: [
				{
					id: 'dao-maker',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.dao_maker.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.dao_maker.content',
					toolMentions: [{ toolId: 'dao-maker' }]
				},
				{
					id: 'seedify',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.seedify.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.seedify.content',
					toolMentions: [{ toolId: 'seedify' }]
				},
				{
					id: 'polkastarter',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.polkastarter.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.polkastarter.content',
					toolMentions: [{ toolId: 'polkastarter' }]
				},
				{
					id: 'fjord',
					titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.fjord.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.fjord.content',
					toolMentions: [{ toolId: 'fjord-foundry' }]
				},
				{
					id: 'pump-fun',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.pump_fun.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.major_launchpads.pump_fun.content',
					toolMentions: [{ toolId: 'pump-fun' }]
				}
			]
		},

		// Part 4: Participation Guide
		{
			id: 'participation-guide',
			titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.participation_guide.title',
			contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.participation_guide.content',
			subsections: [
				{
					id: 'requirements',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.participation_guide.requirements.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.participation_guide.requirements.content'
				},
				{
					id: 'allocation',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.participation_guide.allocation.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.participation_guide.allocation.content'
				},
				{
					id: 'kyc',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.participation_guide.kyc.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.participation_guide.kyc.content'
				}
			]
		},

		// Part 5: Token Vesting
		{
			id: 'token-vesting',
			titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.token_vesting.title',
			contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.token_vesting.content',
			subsections: [
				{
					id: 'cliff',
					titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.token_vesting.cliff.title',
					contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.token_vesting.cliff.content'
				},
				{
					id: 'linear-vesting',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.token_vesting.linear_vesting.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.token_vesting.linear_vesting.content'
				},
				{
					id: 'unlock-schedules',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.token_vesting.unlock_schedules.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.token_vesting.unlock_schedules.content'
				}
			]
		},

		// Part 6: Evaluation Criteria
		{
			id: 'evaluation-criteria',
			titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.evaluation_criteria.title',
			contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.evaluation_criteria.content',
			subsections: [
				{
					id: 'team',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.evaluation_criteria.team.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.evaluation_criteria.team.content'
				},
				{
					id: 'tokenomics',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.evaluation_criteria.tokenomics.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.evaluation_criteria.tokenomics.content'
				},
				{
					id: 'product',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.evaluation_criteria.product.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.evaluation_criteria.product.content'
				}
			]
		},

		// Part 7: Risks and Scams
		{
			id: 'risks-scams',
			titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.risks_scams.title',
			contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.risks_scams.content',
			subsections: [
				{
					id: 'rug-pulls',
					titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.risks_scams.rug_pulls.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.risks_scams.rug_pulls.content'
				},
				{
					id: 'red-flags',
					titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.risks_scams.red_flags.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.risks_scams.red_flags.content'
				},
				{
					id: 'due-diligence',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.risks_scams.due_diligence.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.risks_scams.due_diligence.content'
				}
			]
		},

		// Part 8: Post-Launch Strategies
		{
			id: 'post-launch-strategies',
			titleKey: 'routes/apps/chain-tools/launchpad/guide.sections.post_launch_strategies.title',
			contentKey: 'routes/apps/chain-tools/launchpad/guide.sections.post_launch_strategies.content',
			subsections: [
				{
					id: 'timing',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.post_launch_strategies.timing.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.post_launch_strategies.timing.content'
				},
				{
					id: 'monitoring',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.post_launch_strategies.monitoring.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.post_launch_strategies.monitoring.content'
				},
				{
					id: 'portfolio-management',
					titleKey:
						'routes/apps/chain-tools/launchpad/guide.sections.post_launch_strategies.portfolio_management.title',
					contentKey:
						'routes/apps/chain-tools/launchpad/guide.sections.post_launch_strategies.portfolio_management.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'ido',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.ido.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.ido.definition',
			relatedToolIds: ['dao-maker', 'seedify', 'polkastarter']
		},
		{
			id: 'ieo',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.ieo.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.ieo.definition'
		},
		{
			id: 'ico',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.ico.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.ico.definition'
		},
		{
			id: 'fair-launch',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.fair_launch.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.fair_launch.definition',
			relatedToolIds: ['pump-fun', 'four_meme']
		},
		{
			id: 'lbp',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.lbp.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.lbp.definition',
			relatedToolIds: ['fjord-foundry']
		},
		{
			id: 'allocation',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.allocation.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.allocation.definition'
		},
		{
			id: 'vesting',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.vesting.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.vesting.definition'
		},
		{
			id: 'cliff',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.cliff.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.cliff.definition'
		},
		{
			id: 'tge',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.tge.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.tge.definition'
		},
		{
			id: 'whitelist',
			termKey: 'routes/apps/chain-tools/launchpad/guide.glossary.whitelist.term',
			definitionKey: 'routes/apps/chain-tools/launchpad/guide.glossary.whitelist.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'dao-maker',
		'seedify',
		'polkastarter',
		'fjord-foundry',
		'pump-fun',
		'pinksale',
		'gempad',
		'camelot-launchpad'
	],

	lastUpdated: '2025-12-31'
};

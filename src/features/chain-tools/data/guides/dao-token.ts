/**
 * DAO Token Category Guide Data
 * Long-form educational article about DAO governance tokens
 *
 * Content philosophy:
 * - Focus on understanding DAO governance mechanisms
 * - Include real DAO examples with metrics
 * - Emphasize participation strategies and investment analysis
 * - Progressive learning from basics to advanced governance
 */
import type { CategoryGuide } from '../../types';

export const daoTokenGuide: CategoryGuide = {
	categoryId: 'dao-token',
	i18nKeyPrefix: 'routes/apps/chain-tools/dao-token/guide',
	estimatedReadTime: '22 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'snapshot', context: 'governance voting platform' },
				{ toolId: 'tally', context: 'on-chain governance tracking' }
			]
		},

		// Part 2: DAO Token Economics
		{
			id: 'tokenomics',
			titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.title',
			contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.content',
			subsections: [
				{
					id: 'distribution',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.distribution.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.distribution.content'
				},
				{
					id: 'emission',
					titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.emission.title',
					contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.emission.content'
				},
				{
					id: 'utility',
					titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.utility.title',
					contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.utility.content',
					toolMentions: [{ toolId: 'uniswap' }, { toolId: 'aave' }, { toolId: 'curve' }]
				},
				{
					id: 'value-accrual',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.value_accrual.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.tokenomics.value_accrual.content'
				}
			]
		},

		// Part 3: Types of DAO Tokens
		{
			id: 'dao-types',
			titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.dao_types.title',
			contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.dao_types.content',
			subsections: [
				{
					id: 'protocol-governance',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.dao_types.protocol_governance.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.dao_types.protocol_governance.content',
					toolMentions: [{ toolId: 'uniswap' }, { toolId: 'aave' }, { toolId: 'compound' }]
				},
				{
					id: 'investment-daos',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.dao_types.investment_daos.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.dao_types.investment_daos.content'
				},
				{
					id: 'service-daos',
					titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.dao_types.service_daos.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.dao_types.service_daos.content'
				},
				{
					id: 'social-collector',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.dao_types.social_collector.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.dao_types.social_collector.content'
				}
			]
		},

		// Part 4: Evaluating DAO Tokens
		{
			id: 'evaluation',
			titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.evaluation.title',
			contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.evaluation.content',
			subsections: [
				{
					id: 'treasury-analysis',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.evaluation.treasury_analysis.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.evaluation.treasury_analysis.content',
					toolMentions: [
						{ toolId: 'deepdao', context: 'DAO metrics and treasury tracking' },
						{ toolId: 'etherscan', context: 'treasury verification' }
					]
				},
				{
					id: 'revenue-metrics',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.evaluation.revenue_metrics.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.evaluation.revenue_metrics.content',
					toolMentions: [
						{ toolId: 'token-terminal', context: 'protocol financial metrics' },
						{ toolId: 'defillama', context: 'TVL and fees tracking' }
					]
				},
				{
					id: 'governance-activity',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.evaluation.governance_activity.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.evaluation.governance_activity.content',
					toolMentions: [{ toolId: 'tally' }, { toolId: 'snapshot' }]
				},
				{
					id: 'distribution-quality',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.evaluation.distribution_quality.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.evaluation.distribution_quality.content'
				}
			]
		},

		// Part 5: Governance Participation
		{
			id: 'participation',
			titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.participation.title',
			contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.participation.content',
			subsections: [
				{
					id: 'voting-mechanisms',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.participation.voting_mechanisms.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.participation.voting_mechanisms.content',
					toolMentions: [{ toolId: 'snapshot' }]
				},
				{
					id: 'delegation',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.participation.delegation.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.participation.delegation.content'
				},
				{
					id: 'proposal-creation',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.participation.proposal_creation.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.participation.proposal_creation.content',
					toolMentions: [{ toolId: 'tally' }, { toolId: 'boardroom' }]
				},
				{
					id: 'governance-mining',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.participation.governance_mining.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.participation.governance_mining.content'
				}
			]
		},

		// Part 6: Investment Strategies
		{
			id: 'investment',
			titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.investment.title',
			contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.investment.content',
			subsections: [
				{
					id: 'fundamental-analysis',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.investment.fundamental_analysis.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.investment.fundamental_analysis.content',
					toolMentions: [
						{ toolId: 'token-terminal' },
						{ toolId: 'messari' },
						{ toolId: 'defillama' }
					]
				},
				{
					id: 'governance-premium',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.investment.governance_premium.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.investment.governance_premium.content'
				},
				{
					id: 'fee-share-models',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.investment.fee_share_models.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.investment.fee_share_models.content'
				},
				{
					id: 'staking-optimization',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.investment.staking_optimization.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.investment.staking_optimization.content'
				}
			]
		},

		// Part 7: Tools for DAO Analysis
		{
			id: 'tools',
			titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.tools.title',
			contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.tools.content',
			subsections: [
				{
					id: 'voting-platforms',
					titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.tools.voting_platforms.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.tools.voting_platforms.content',
					toolMentions: [{ toolId: 'snapshot' }, { toolId: 'tally' }]
				},
				{
					id: 'analytics-platforms',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.tools.analytics_platforms.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.tools.analytics_platforms.content',
					toolMentions: [
						{ toolId: 'deepdao' },
						{ toolId: 'boardroom' },
						{ toolId: 'token-terminal' },
						{ toolId: 'messari' }
					]
				},
				{
					id: 'infrastructure',
					titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.tools.infrastructure.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.tools.infrastructure.content',
					toolMentions: [{ toolId: 'aragon' }, { toolId: 'commonwealth' }]
				}
			]
		},

		// Part 8: Risks & Considerations
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/dao-token/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/dao-token/guide.sections.risks.content',
			subsections: [
				{
					id: 'governance-attacks',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.risks.governance_attacks.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.risks.governance_attacks.content',
					caseStudies: [
						{
							id: 'beanstalk-governance-attack',
							titleKey:
								'routes/apps/chain-tools/dao-token/guide.sections.risks.governance_attacks.case_beanstalk.title',
							descriptionKey:
								'routes/apps/chain-tools/dao-token/guide.sections.risks.governance_attacks.case_beanstalk.description',
							date: '2022-04-17',
							profit: '~$182 million',
							sourceUrl: 'https://rekt.news/beanstalk-rekt/',
							relatedToolIds: ['aave']
						}
					]
				},
				{
					id: 'concentration-risks',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.risks.concentration_risks.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.risks.concentration_risks.content'
				},
				{
					id: 'regulatory-uncertainty',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.risks.regulatory_uncertainty.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.risks.regulatory_uncertainty.content'
				},
				{
					id: 'low-participation',
					titleKey:
						'routes/apps/chain-tools/dao-token/guide.sections.risks.low_participation.title',
					contentKey:
						'routes/apps/chain-tools/dao-token/guide.sections.risks.low_participation.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'governance-token',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.governance_token.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.governance_token.definition',
			relatedToolIds: ['uniswap', 'aave', 'compound']
		},
		{
			id: 'voting-power',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.voting_power.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.voting_power.definition'
		},
		{
			id: 'delegation',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.delegation.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.delegation.definition',
			relatedToolIds: ['snapshot', 'tally']
		},
		{
			id: 'proposal',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.proposal.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.proposal.definition',
			relatedToolIds: ['snapshot', 'tally']
		},
		{
			id: 'quorum',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.quorum.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.quorum.definition'
		},
		{
			id: 'treasury',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.treasury.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.treasury.definition',
			relatedToolIds: ['deepdao', 'etherscan']
		},
		{
			id: 'multisig',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.multisig.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.multisig.definition',
			relatedToolIds: ['gnosis-safe']
		},
		{
			id: 'tokenomics',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.tokenomics.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.tokenomics.definition'
		},
		{
			id: 'emission',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.emission.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.emission.definition'
		},
		{
			id: 'vesting',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.vesting.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.vesting.definition'
		},
		{
			id: 'governance-attack',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.governance_attack.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.governance_attack.definition'
		},
		{
			id: 'quadratic-voting',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.quadratic_voting.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.quadratic_voting.definition'
		},
		{
			id: 'conviction-voting',
			termKey: 'routes/apps/chain-tools/dao-token/guide.glossary.conviction_voting.term',
			definitionKey: 'routes/apps/chain-tools/dao-token/guide.glossary.conviction_voting.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'snapshot',
		'tally',
		'deepdao',
		'boardroom',
		'commonwealth',
		'aragon',
		'token-terminal',
		'messari'
	],

	lastUpdated: '2025-12-31'
};

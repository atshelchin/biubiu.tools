/**
 * DAO (Governance) Category Guide Data
 * Long-form educational article about decentralized governance
 *
 * Content philosophy:
 * - Focus on understanding DAOs and governance mechanisms
 * - Include real examples of governance in action
 * - Emphasize practical participation and voting strategies
 * - Progressive learning from basics to advanced DAO frameworks
 */
import type { CategoryGuide } from '../../types';

export const daoGuide: CategoryGuide = {
	categoryId: 'dao',
	i18nKeyPrefix: 'routes/apps/chain-tools/dao/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding DAOs
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/dao/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/dao/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'snapshot', context: 'off-chain voting' },
				{ toolId: 'tally', context: 'on-chain governance' }
			]
		},
		{
			id: 'governance-basics',
			titleKey: 'routes/apps/chain-tools/dao/guide.sections.governance_basics.title',
			contentKey: 'routes/apps/chain-tools/dao/guide.sections.governance_basics.content',
			subsections: [
				{
					id: 'what-is-dao',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.governance_basics.what_is_dao.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.governance_basics.what_is_dao.content'
				},
				{
					id: 'how-governance-works',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.governance_basics.how_governance_works.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.governance_basics.how_governance_works.content'
				},
				{
					id: 'voting-mechanisms',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.governance_basics.voting_mechanisms.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.governance_basics.voting_mechanisms.content'
				}
			]
		},

		// Part 2: Governance Tools
		{
			id: 'governance-tools',
			titleKey: 'routes/apps/chain-tools/dao/guide.sections.governance_tools.title',
			contentKey: 'routes/apps/chain-tools/dao/guide.sections.governance_tools.content',
			subsections: [
				{
					id: 'snapshot',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.governance_tools.snapshot.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.governance_tools.snapshot.content',
					toolMentions: [{ toolId: 'snapshot', context: 'gasless voting platform' }]
				},
				{
					id: 'tally',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.governance_tools.tally.title',
					contentKey: 'routes/apps/chain-tools/dao/guide.sections.governance_tools.tally.content',
					toolMentions: [{ toolId: 'tally', context: 'on-chain governance interface' }]
				},
				{
					id: 'boardroom',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.governance_tools.boardroom.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.governance_tools.boardroom.content',
					toolMentions: [{ toolId: 'boardroom', context: 'governance aggregator' }]
				}
			]
		},

		// Part 3: Token Governance
		{
			id: 'token-governance',
			titleKey: 'routes/apps/chain-tools/dao/guide.sections.token_governance.title',
			contentKey: 'routes/apps/chain-tools/dao/guide.sections.token_governance.content',
			subsections: [
				{
					id: 'governance-tokens',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.token_governance.governance_tokens.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.token_governance.governance_tokens.content'
				},
				{
					id: 'delegation',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.token_governance.delegation.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.token_governance.delegation.content'
				},
				{
					id: 'vetoken-models',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.token_governance.vetoken_models.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.token_governance.vetoken_models.content',
					toolMentions: [{ toolId: 'curve', context: 'veCRV model pioneer' }]
				}
			]
		},

		// Part 4: Treasury Management
		{
			id: 'treasury-management',
			titleKey: 'routes/apps/chain-tools/dao/guide.sections.treasury_management.title',
			contentKey: 'routes/apps/chain-tools/dao/guide.sections.treasury_management.content',
			subsections: [
				{
					id: 'multisig-wallets',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.treasury_management.multisig_wallets.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.treasury_management.multisig_wallets.content',
					toolMentions: [{ toolId: 'gnosis-safe', context: 'multi-signature wallet' }]
				},
				{
					id: 'token-vesting',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.treasury_management.token_vesting.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.treasury_management.token_vesting.content',
					toolMentions: [{ toolId: 'sablier', context: 'token streaming protocol' }]
				}
			]
		},

		// Part 5: DAO Frameworks
		{
			id: 'dao-frameworks',
			titleKey: 'routes/apps/chain-tools/dao/guide.sections.dao_frameworks.title',
			contentKey: 'routes/apps/chain-tools/dao/guide.sections.dao_frameworks.content',
			subsections: [
				{
					id: 'aragon',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.dao_frameworks.aragon.title',
					contentKey: 'routes/apps/chain-tools/dao/guide.sections.dao_frameworks.aragon.content',
					toolMentions: [{ toolId: 'aragon', context: 'DAO creation platform' }]
				},
				{
					id: 'moloch',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.dao_frameworks.moloch.title',
					contentKey: 'routes/apps/chain-tools/dao/guide.sections.dao_frameworks.moloch.content'
				},
				{
					id: 'compound-governor',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.dao_frameworks.compound_governor.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.dao_frameworks.compound_governor.content',
					toolMentions: [{ toolId: 'compound', context: 'Governor Alpha/Bravo' }]
				}
			]
		},

		// Part 6: Participating in DAOs
		{
			id: 'participating',
			titleKey: 'routes/apps/chain-tools/dao/guide.sections.participating.title',
			contentKey: 'routes/apps/chain-tools/dao/guide.sections.participating.content',
			subsections: [
				{
					id: 'finding-daos',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.participating.finding_daos.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.participating.finding_daos.content',
					toolMentions: [{ toolId: 'snapshot' }, { toolId: 'tally' }, { toolId: 'boardroom' }]
				},
				{
					id: 'voting-strategies',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.participating.voting_strategies.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.participating.voting_strategies.content'
				},
				{
					id: 'proposal-creation',
					titleKey:
						'routes/apps/chain-tools/dao/guide.sections.participating.proposal_creation.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.participating.proposal_creation.content'
				}
			]
		},

		// Part 7: Risks and Challenges
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/dao/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/dao/guide.sections.risks.content',
			subsections: [
				{
					id: 'governance-attacks',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.risks.governance_attacks.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.risks.governance_attacks.content'
				},
				{
					id: 'voter-apathy',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.risks.voter_apathy.title',
					contentKey: 'routes/apps/chain-tools/dao/guide.sections.risks.voter_apathy.content'
				},
				{
					id: 'plutocracy-concerns',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.risks.plutocracy_concerns.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.risks.plutocracy_concerns.content'
				},
				{
					id: 'legal-uncertainty',
					titleKey: 'routes/apps/chain-tools/dao/guide.sections.risks.legal_uncertainty.title',
					contentKey:
						'routes/apps/chain-tools/dao/guide.sections.risks.legal_uncertainty.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'dao',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.dao.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.dao.definition',
			relatedToolIds: ['aragon', 'snapshot', 'tally']
		},
		{
			id: 'governance-token',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.governance_token.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.governance_token.definition',
			relatedToolIds: ['compound', 'uniswap']
		},
		{
			id: 'proposal',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.proposal.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.proposal.definition',
			relatedToolIds: ['snapshot', 'tally']
		},
		{
			id: 'quorum',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.quorum.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.quorum.definition',
			relatedToolIds: ['snapshot', 'tally']
		},
		{
			id: 'delegation',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.delegation.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.delegation.definition',
			relatedToolIds: ['compound', 'uniswap']
		},
		{
			id: 'timelock',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.timelock.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.timelock.definition',
			relatedToolIds: ['compound']
		},
		{
			id: 'multisig',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.multisig.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.multisig.definition',
			relatedToolIds: ['gnosis-safe']
		},
		{
			id: 'rage-quit',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.rage_quit.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.rage_quit.definition'
		},
		{
			id: 'vetoken',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.vetoken.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.vetoken.definition',
			relatedToolIds: ['curve']
		},
		{
			id: 'quadratic-voting',
			termKey: 'routes/apps/chain-tools/dao/guide.glossary.quadratic_voting.term',
			definitionKey: 'routes/apps/chain-tools/dao/guide.glossary.quadratic_voting.definition',
			relatedToolIds: ['snapshot']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'snapshot',
		'tally',
		'aragon',
		'gnosis-safe',
		'compound',
		'boardroom',
		'sablier'
	],

	lastUpdated: '2025-12-31'
};

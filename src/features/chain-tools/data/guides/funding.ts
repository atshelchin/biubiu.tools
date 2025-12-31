/**
 * Funding Category Guide Data
 * Long-form educational article about crypto funding, grants, and venture capital
 *
 * Content philosophy:
 * - Focus on understanding funding landscape in crypto
 * - Include real examples of successful fundraising
 * - Emphasize practical application and relationship building
 * - Progressive learning from grants to VC funding
 */
import type { CategoryGuide } from '../../types';

export const fundingGuide: CategoryGuide = {
	categoryId: 'funding',
	i18nKeyPrefix: 'routes/apps/chain-tools/funding/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Introduction to Crypto Funding
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/funding/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/funding/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'gitcoin-grants', context: 'quadratic funding' },
				{ toolId: 'ethereum-foundation', context: 'grants program' }
			]
		},

		// Part 2: Types of Funding
		{
			id: 'funding-types',
			titleKey: 'routes/apps/chain-tools/funding/guide.sections.funding_types.title',
			contentKey: 'routes/apps/chain-tools/funding/guide.sections.funding_types.content',
			subsections: [
				{
					id: 'grants',
					titleKey: 'routes/apps/chain-tools/funding/guide.sections.funding_types.grants.title',
					contentKey: 'routes/apps/chain-tools/funding/guide.sections.funding_types.grants.content'
				},
				{
					id: 'venture-capital',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.funding_types.venture_capital.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.funding_types.venture_capital.content'
				},
				{
					id: 'crowdfunding',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.funding_types.crowdfunding.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.funding_types.crowdfunding.content'
				},
				{
					id: 'retroactive-funding',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.funding_types.retroactive_funding.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.funding_types.retroactive_funding.content',
					toolMentions: [{ toolId: 'optimism-rpgf', context: 'retroactive public goods funding' }]
				}
			]
		},

		// Part 3: Grant Programs
		{
			id: 'grant-programs',
			titleKey: 'routes/apps/chain-tools/funding/guide.sections.grant_programs.title',
			contentKey: 'routes/apps/chain-tools/funding/guide.sections.grant_programs.content',
			subsections: [
				{
					id: 'ethereum-foundation',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.grant_programs.ethereum_foundation.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.grant_programs.ethereum_foundation.content',
					toolMentions: [{ toolId: 'ethereum-foundation', context: 'ecosystem support program' }]
				},
				{
					id: 'gitcoin',
					titleKey: 'routes/apps/chain-tools/funding/guide.sections.grant_programs.gitcoin.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.grant_programs.gitcoin.content',
					toolMentions: [{ toolId: 'gitcoin-grants', context: 'quadratic funding rounds' }]
				},
				{
					id: 'optimism-retropgf',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.grant_programs.optimism_retropgf.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.grant_programs.optimism_retropgf.content',
					toolMentions: [{ toolId: 'optimism-rpgf', context: 'retroactive funding rounds' }]
				},
				{
					id: 'ecosystem-grants',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.grant_programs.ecosystem_grants.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.grant_programs.ecosystem_grants.content',
					toolMentions: [
						{ toolId: 'arbitrum-grants', context: 'Arbitrum ecosystem' },
						{ toolId: 'polygon-grants', context: 'Polygon ecosystem' },
						{ toolId: 'uniswap-grants', context: 'Uniswap ecosystem' }
					]
				}
			]
		},

		// Part 4: VC Landscape
		{
			id: 'vc-landscape',
			titleKey: 'routes/apps/chain-tools/funding/guide.sections.vc_landscape.title',
			contentKey: 'routes/apps/chain-tools/funding/guide.sections.vc_landscape.content',
			subsections: [
				{
					id: 'crypto-vcs',
					titleKey: 'routes/apps/chain-tools/funding/guide.sections.vc_landscape.crypto_vcs.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.vc_landscape.crypto_vcs.content',
					toolMentions: [
						{ toolId: 'a16z-crypto', context: 'major crypto VC' },
						{ toolId: 'paradigm', context: 'research-driven VC' }
					]
				},
				{
					id: 'deal-terms',
					titleKey: 'routes/apps/chain-tools/funding/guide.sections.vc_landscape.deal_terms.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.vc_landscape.deal_terms.content'
				},
				{
					id: 'valuations',
					titleKey: 'routes/apps/chain-tools/funding/guide.sections.vc_landscape.valuations.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.vc_landscape.valuations.content'
				}
			]
		},

		// Part 5: Crowdfunding & Community Funding
		{
			id: 'crowdfunding',
			titleKey: 'routes/apps/chain-tools/funding/guide.sections.crowdfunding.title',
			contentKey: 'routes/apps/chain-tools/funding/guide.sections.crowdfunding.content',
			subsections: [
				{
					id: 'juicebox',
					titleKey: 'routes/apps/chain-tools/funding/guide.sections.crowdfunding.juicebox.title',
					contentKey: 'routes/apps/chain-tools/funding/guide.sections.crowdfunding.juicebox.content'
				},
				{
					id: 'token-sales',
					titleKey: 'routes/apps/chain-tools/funding/guide.sections.crowdfunding.token_sales.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.crowdfunding.token_sales.content',
					toolMentions: [{ toolId: 'coinlist', context: 'token sale platform' }]
				},
				{
					id: 'investment-daos',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.crowdfunding.investment_daos.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.crowdfunding.investment_daos.content',
					toolMentions: [{ toolId: 'syndicate-dao', context: 'investment DAO platform' }]
				}
			]
		},

		// Part 6: Application Tips
		{
			id: 'application-tips',
			titleKey: 'routes/apps/chain-tools/funding/guide.sections.application_tips.title',
			contentKey: 'routes/apps/chain-tools/funding/guide.sections.application_tips.content',
			subsections: [
				{
					id: 'grant-applications',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.application_tips.grant_applications.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.application_tips.grant_applications.content'
				},
				{
					id: 'pitch-decks',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.application_tips.pitch_decks.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.application_tips.pitch_decks.content'
				},
				{
					id: 'milestones',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.application_tips.milestones.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.application_tips.milestones.content'
				}
			]
		},

		// Part 7: Building Relationships
		{
			id: 'building-relationships',
			titleKey: 'routes/apps/chain-tools/funding/guide.sections.building_relationships.title',
			contentKey: 'routes/apps/chain-tools/funding/guide.sections.building_relationships.content',
			subsections: [
				{
					id: 'networking',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.building_relationships.networking.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.building_relationships.networking.content'
				},
				{
					id: 'community-building',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.building_relationships.community_building.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.building_relationships.community_building.content'
				},
				{
					id: 'public-goods',
					titleKey:
						'routes/apps/chain-tools/funding/guide.sections.building_relationships.public_goods.title',
					contentKey:
						'routes/apps/chain-tools/funding/guide.sections.building_relationships.public_goods.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'grant',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.grant.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.grant.definition',
			relatedToolIds: ['ethereum-foundation', 'gitcoin-grants']
		},
		{
			id: 'retroactive-funding',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.retroactive_funding.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.retroactive_funding.definition',
			relatedToolIds: ['optimism-rpgf']
		},
		{
			id: 'quadratic-funding',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.quadratic_funding.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.quadratic_funding.definition',
			relatedToolIds: ['gitcoin-grants']
		},
		{
			id: 'safe',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.safe.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.safe.definition'
		},
		{
			id: 'valuation',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.valuation.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.valuation.definition'
		},
		{
			id: 'runway',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.runway.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.runway.definition'
		},
		{
			id: 'milestone',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.milestone.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.milestone.definition'
		},
		{
			id: 'treasury',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.treasury.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.treasury.definition'
		},
		{
			id: 'dao-grants',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.dao_grants.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.dao_grants.definition',
			relatedToolIds: ['uniswap-grants', 'aave-grants', 'compound-grants']
		},
		{
			id: 'public-goods',
			termKey: 'routes/apps/chain-tools/funding/guide.glossary.public_goods.term',
			definitionKey: 'routes/apps/chain-tools/funding/guide.glossary.public_goods.definition',
			relatedToolIds: ['gitcoin-grants', 'optimism-rpgf']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'gitcoin-grants',
		'optimism-rpgf',
		'ethereum-foundation',
		'a16z-crypto',
		'paradigm',
		'coinlist',
		'arbitrum-grants',
		'syndicate-dao'
	],

	lastUpdated: '2025-12-31'
};

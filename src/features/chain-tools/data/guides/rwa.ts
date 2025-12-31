/**
 * RWA Category Guide Data
 * Real World Assets tokenization - bringing traditional finance on-chain
 *
 * Content philosophy:
 * - Bridge traditional finance and blockchain
 * - Explain tokenization mechanics and legal structures
 * - Focus on yield opportunities (treasuries, real estate, private credit)
 * - Address regulatory landscape and compliance
 * - Progressive learning from basics to institutional adoption
 */
import type { CategoryGuide } from '../../types';

export const rwaGuide: CategoryGuide = {
	categoryId: 'rwa',
	i18nKeyPrefix: 'routes/apps/chain-tools/rwa/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Understanding RWA
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/rwa/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/rwa/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'ondo-finance', context: 'treasury tokenization leader' },
				{ toolId: 'rwa-xyz', context: 'tracking RWA growth' }
			]
		},

		// Part 2: Asset Types
		{
			id: 'asset-types',
			titleKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.title',
			contentKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.content',
			subsections: [
				{
					id: 'treasuries',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.treasuries.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.treasuries.content',
					toolMentions: [
						{ toolId: 'ondo-finance', context: 'OUSG and USDY' },
						{ toolId: 'blackrock-buidl', context: 'institutional grade' },
						{ toolId: 'franklin-benji', context: 'money market fund' }
					]
				},
				{
					id: 'real-estate',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.real_estate.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.real_estate.content',
					toolMentions: [
						{ toolId: 'realt', context: 'fractional rental properties' },
						{ toolId: 'lofty', context: 'Algorand-based real estate' },
						{ toolId: 'propy', context: 'property NFTs' }
					]
				},
				{
					id: 'commodities',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.commodities.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.commodities.content',
					toolMentions: [
						{ toolId: 'pax-gold', context: 'Paxos gold tokens' },
						{ toolId: 'tether-gold', context: 'Tether gold' },
						{ toolId: 'cache-gold', context: 'redeemable gold' }
					]
				},
				{
					id: 'private-credit',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.asset_types.private_credit.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.asset_types.private_credit.content',
					toolMentions: [
						{ toolId: 'goldfinch', context: 'emerging market lending' },
						{ toolId: 'maple-finance', context: 'institutional credit' },
						{ toolId: 'centrifuge', context: 'credit tokenization' }
					]
				}
			]
		},

		// Part 3: Tokenization Process
		{
			id: 'tokenization-process',
			titleKey: 'routes/apps/chain-tools/rwa/guide.sections.tokenization_process.title',
			contentKey: 'routes/apps/chain-tools/rwa/guide.sections.tokenization_process.content',
			subsections: [
				{
					id: 'legal-structure',
					titleKey:
						'routes/apps/chain-tools/rwa/guide.sections.tokenization_process.legal_structure.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.tokenization_process.legal_structure.content',
					toolMentions: [{ toolId: 'securitize', context: 'compliance platform' }]
				},
				{
					id: 'custody',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.tokenization_process.custody.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.tokenization_process.custody.content'
				},
				{
					id: 'token-standards',
					titleKey:
						'routes/apps/chain-tools/rwa/guide.sections.tokenization_process.token_standards.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.tokenization_process.token_standards.content',
					toolMentions: [{ toolId: 'tokeny', context: 'ERC-3643 standard' }]
				}
			]
		},

		// Part 4: Major Protocols
		{
			id: 'major-protocols',
			titleKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.title',
			contentKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.content',
			subsections: [
				{
					id: 'ondo',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.ondo.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.ondo.content',
					toolMentions: [{ toolId: 'ondo-finance' }]
				},
				{
					id: 'centrifuge',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.centrifuge.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.major_protocols.centrifuge.content',
					toolMentions: [{ toolId: 'centrifuge' }]
				},
				{
					id: 'maple',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.maple.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.maple.content',
					toolMentions: [{ toolId: 'maple-finance' }]
				},
				{
					id: 'goldfinch',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.goldfinch.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.major_protocols.goldfinch.content',
					toolMentions: [{ toolId: 'goldfinch' }]
				},
				{
					id: 'realt',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.realt.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.major_protocols.realt.content',
					toolMentions: [{ toolId: 'realt' }]
				}
			]
		},

		// Part 5: Yield Opportunities
		{
			id: 'yield-opportunities',
			titleKey: 'routes/apps/chain-tools/rwa/guide.sections.yield_opportunities.title',
			contentKey: 'routes/apps/chain-tools/rwa/guide.sections.yield_opportunities.content',
			subsections: [
				{
					id: 'treasury-yields',
					titleKey:
						'routes/apps/chain-tools/rwa/guide.sections.yield_opportunities.treasury_yields.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.yield_opportunities.treasury_yields.content',
					toolMentions: [
						{ toolId: 'ondo-finance' },
						{ toolId: 'blackrock-buidl' },
						{ toolId: 'matrixdock' }
					]
				},
				{
					id: 'private-credit-yields',
					titleKey:
						'routes/apps/chain-tools/rwa/guide.sections.yield_opportunities.private_credit_yields.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.yield_opportunities.private_credit_yields.content',
					toolMentions: [
						{ toolId: 'maple-finance' },
						{ toolId: 'goldfinch' },
						{ toolId: 'clearpool' }
					]
				},
				{
					id: 'real-estate-income',
					titleKey:
						'routes/apps/chain-tools/rwa/guide.sections.yield_opportunities.real_estate_income.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.yield_opportunities.real_estate_income.content',
					toolMentions: [{ toolId: 'realt' }, { toolId: 'lofty' }]
				}
			]
		},

		// Part 6: Risks and Considerations
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.content',
			subsections: [
				{
					id: 'regulatory',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.regulatory.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.regulatory.content'
				},
				{
					id: 'custody-risk',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.custody_risk.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.custody_risk.content'
				},
				{
					id: 'liquidity',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.liquidity.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.liquidity.content'
				},
				{
					id: 'oracle-risk',
					titleKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.oracle_risk.title',
					contentKey: 'routes/apps/chain-tools/rwa/guide.sections.risks.oracle_risk.content'
				}
			]
		},

		// Part 7: Future Outlook
		{
			id: 'future-outlook',
			titleKey: 'routes/apps/chain-tools/rwa/guide.sections.future_outlook.title',
			contentKey: 'routes/apps/chain-tools/rwa/guide.sections.future_outlook.content',
			subsections: [
				{
					id: 'institutional-adoption',
					titleKey:
						'routes/apps/chain-tools/rwa/guide.sections.future_outlook.institutional_adoption.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.future_outlook.institutional_adoption.content',
					toolMentions: [{ toolId: 'blackrock-buidl' }, { toolId: 'franklin-benji' }]
				},
				{
					id: 'market-potential',
					titleKey:
						'routes/apps/chain-tools/rwa/guide.sections.future_outlook.market_potential.title',
					contentKey:
						'routes/apps/chain-tools/rwa/guide.sections.future_outlook.market_potential.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'rwa',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.rwa.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.rwa.definition',
			relatedToolIds: ['ondo-finance', 'centrifuge', 'realt']
		},
		{
			id: 'tokenization',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.tokenization.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.tokenization.definition',
			relatedToolIds: ['securitize', 'tokeny']
		},
		{
			id: 'security-token',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.security_token.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.security_token.definition',
			relatedToolIds: ['polymesh', 'tokeny']
		},
		{
			id: 'spv',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.spv.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.spv.definition'
		},
		{
			id: 'custody',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.custody.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.custody.definition'
		},
		{
			id: 'accredited-investor',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.accredited_investor.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.accredited_investor.definition'
		},
		{
			id: 'treasury-token',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.treasury_token.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.treasury_token.definition',
			relatedToolIds: ['ondo-finance', 'blackrock-buidl', 'matrixdock']
		},
		{
			id: 'private-credit',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.private_credit.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.private_credit.definition',
			relatedToolIds: ['maple-finance', 'goldfinch', 'centrifuge']
		},
		{
			id: 'yield-bearing-token',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.yield_bearing_token.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.yield_bearing_token.definition',
			relatedToolIds: ['ondo-finance', 'matrixdock']
		},
		{
			id: 'compliance',
			termKey: 'routes/apps/chain-tools/rwa/guide.glossary.compliance.term',
			definitionKey: 'routes/apps/chain-tools/rwa/guide.glossary.compliance.definition',
			relatedToolIds: ['securitize', 'tokeny', 'polymesh']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'ondo-finance',
		'centrifuge',
		'maple-finance',
		'goldfinch',
		'realt',
		'blackrock-buidl',
		'pax-gold',
		'rwa-xyz'
	],

	lastUpdated: '2025-12-31'
};

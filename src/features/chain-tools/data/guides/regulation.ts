/**
 * Regulation Category Guide Data
 * Comprehensive education about crypto regulation and compliance
 *
 * Content philosophy:
 * - Focus on practical understanding of global regulatory landscape
 * - Include jurisdiction-specific guidance for major markets
 * - Emphasize compliance strategies for users and builders
 * - Progressive learning from basic concepts to advanced compliance
 */
import type { CategoryGuide } from '../../types';

export const regulationGuide: CategoryGuide = {
	categoryId: 'regulation',
	i18nKeyPrefix: 'routes/apps/chain-tools/regulation/guide',
	estimatedReadTime: '22 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/regulation/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/regulation/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'fatf_crypto', context: 'global AML standards' },
				{ toolId: 'global_crypto_map', context: 'regulation by country' }
			]
		},

		// Part 2: Global Regulatory Overview
		{
			id: 'global-overview',
			titleKey: 'routes/apps/chain-tools/regulation/guide.sections.global_overview.title',
			contentKey: 'routes/apps/chain-tools/regulation/guide.sections.global_overview.content',
			subsections: [
				{
					id: 'united-states',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.global_overview.united_states.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.global_overview.united_states.content',
					toolMentions: [
						{ toolId: 'sec_crypto', context: 'securities regulation' },
						{ toolId: 'cftc_crypto', context: 'commodities regulation' },
						{ toolId: 'fincen_crypto', context: 'AML/KYC requirements' }
					]
				},
				{
					id: 'european-union',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.global_overview.european_union.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.global_overview.european_union.content',
					toolMentions: [
						{ toolId: 'mica_eu', context: 'comprehensive crypto framework' },
						{ toolId: 'esma_crypto', context: 'EU securities oversight' }
					]
				},
				{
					id: 'asia-pacific',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.global_overview.asia_pacific.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.global_overview.asia_pacific.content',
					toolMentions: [
						{ toolId: 'mas_crypto', context: 'Singapore regulation' },
						{ toolId: 'sfc_hk', context: 'Hong Kong VASP licensing' },
						{ toolId: 'jfsa_crypto', context: 'Japan exchange registration' }
					]
				}
			]
		},

		// Part 3: Key Regulatory Concepts
		{
			id: 'key-concepts',
			titleKey: 'routes/apps/chain-tools/regulation/guide.sections.key_concepts.title',
			contentKey: 'routes/apps/chain-tools/regulation/guide.sections.key_concepts.content',
			subsections: [
				{
					id: 'securities-vs-commodities',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.key_concepts.securities_vs_commodities.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.key_concepts.securities_vs_commodities.content'
				},
				{
					id: 'token-classification',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.key_concepts.token_classification.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.key_concepts.token_classification.content'
				},
				{
					id: 'defi-regulation',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.key_concepts.defi_regulation.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.key_concepts.defi_regulation.content'
				}
			]
		},

		// Part 4: Compliance Requirements
		{
			id: 'compliance-requirements',
			titleKey: 'routes/apps/chain-tools/regulation/guide.sections.compliance_requirements.title',
			contentKey:
				'routes/apps/chain-tools/regulation/guide.sections.compliance_requirements.content',
			subsections: [
				{
					id: 'kyc-aml',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.compliance_requirements.kyc_aml.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.compliance_requirements.kyc_aml.content',
					toolMentions: [
						{ toolId: 'chainalysis_compliance', context: 'AML transaction monitoring' },
						{ toolId: 'elliptic_compliance', context: 'compliance screening' },
						{ toolId: 'sumsub_kyc', context: 'identity verification' }
					]
				},
				{
					id: 'travel-rule',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.compliance_requirements.travel_rule.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.compliance_requirements.travel_rule.content',
					toolMentions: [{ toolId: 'notabene_travel', context: 'travel rule compliance' }]
				},
				{
					id: 'reporting-requirements',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.compliance_requirements.reporting_requirements.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.compliance_requirements.reporting_requirements.content'
				}
			]
		},

		// Part 5: Tax Implications
		{
			id: 'tax-implications',
			titleKey: 'routes/apps/chain-tools/regulation/guide.sections.tax_implications.title',
			contentKey: 'routes/apps/chain-tools/regulation/guide.sections.tax_implications.content',
			subsections: [
				{
					id: 'capital-gains',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.tax_implications.capital_gains.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.tax_implications.capital_gains.content'
				},
				{
					id: 'income-tax',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.tax_implications.income_tax.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.tax_implications.income_tax.content'
				},
				{
					id: 'defi-transactions',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.tax_implications.defi_transactions.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.tax_implications.defi_transactions.content'
				}
			]
		},

		// Part 6: Self-Custody vs Custodial
		{
			id: 'custody-implications',
			titleKey: 'routes/apps/chain-tools/regulation/guide.sections.custody_implications.title',
			contentKey: 'routes/apps/chain-tools/regulation/guide.sections.custody_implications.content',
			subsections: [
				{
					id: 'self-custody',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.custody_implications.self_custody.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.custody_implications.self_custody.content'
				},
				{
					id: 'custodial-services',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.custody_implications.custodial_services.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.custody_implications.custodial_services.content'
				}
			]
		},

		// Part 7: Staying Compliant
		{
			id: 'staying-compliant',
			titleKey: 'routes/apps/chain-tools/regulation/guide.sections.staying_compliant.title',
			contentKey: 'routes/apps/chain-tools/regulation/guide.sections.staying_compliant.content',
			subsections: [
				{
					id: 'tracking-tools',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.staying_compliant.tracking_tools.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.staying_compliant.tracking_tools.content'
				},
				{
					id: 'record-keeping',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.staying_compliant.record_keeping.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.staying_compliant.record_keeping.content'
				},
				{
					id: 'legal-resources',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.staying_compliant.legal_resources.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.staying_compliant.legal_resources.content',
					toolMentions: [
						{ toolId: 'coin_center', context: 'policy research' },
						{ toolId: 'blockchain_association', context: 'industry advocacy' }
					]
				}
			]
		},

		// Part 8: Future Outlook
		{
			id: 'future-outlook',
			titleKey: 'routes/apps/chain-tools/regulation/guide.sections.future_outlook.title',
			contentKey: 'routes/apps/chain-tools/regulation/guide.sections.future_outlook.content',
			subsections: [
				{
					id: 'emerging-regulations',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.future_outlook.emerging_regulations.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.future_outlook.emerging_regulations.content'
				},
				{
					id: 'cbdcs',
					titleKey: 'routes/apps/chain-tools/regulation/guide.sections.future_outlook.cbdcs.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.future_outlook.cbdcs.content',
					toolMentions: [
						{ toolId: 'atlanticcouncil_cbdc', context: 'global CBDC tracker' },
						{ toolId: 'bis_crypto', context: 'central bank research' }
					]
				},
				{
					id: 'defi-trends',
					titleKey:
						'routes/apps/chain-tools/regulation/guide.sections.future_outlook.defi_trends.title',
					contentKey:
						'routes/apps/chain-tools/regulation/guide.sections.future_outlook.defi_trends.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'kyc',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.kyc.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.kyc.definition',
			relatedToolIds: ['sumsub_kyc', 'chainalysis_compliance']
		},
		{
			id: 'aml',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.aml.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.aml.definition',
			relatedToolIds: ['elliptic_compliance', 'trm_labs']
		},
		{
			id: 'securities',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.securities.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.securities.definition',
			relatedToolIds: ['sec_crypto']
		},
		{
			id: 'commodities',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.commodities.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.commodities.definition',
			relatedToolIds: ['cftc_crypto']
		},
		{
			id: 'mica',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.mica.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.mica.definition',
			relatedToolIds: ['mica_eu', 'esma_crypto']
		},
		{
			id: 'travel-rule',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.travel_rule.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.travel_rule.definition',
			relatedToolIds: ['notabene_travel', 'fatf_crypto']
		},
		{
			id: 'fatf',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.fatf.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.fatf.definition',
			relatedToolIds: ['fatf_crypto']
		},
		{
			id: 'capital-gains',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.capital_gains.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.capital_gains.definition'
		},
		{
			id: 'cost-basis',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.cost_basis.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.cost_basis.definition'
		},
		{
			id: 'vasp',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.vasp.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.vasp.definition',
			relatedToolIds: ['sfc_hk', 'mas_crypto']
		},
		{
			id: 'stablecoin-regulation',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.stablecoin_regulation.term',
			definitionKey:
				'routes/apps/chain-tools/regulation/guide.glossary.stablecoin_regulation.definition',
			relatedToolIds: ['mica_eu', 'occ_crypto']
		},
		{
			id: 'defi-regulation',
			termKey: 'routes/apps/chain-tools/regulation/guide.glossary.defi_regulation.term',
			definitionKey: 'routes/apps/chain-tools/regulation/guide.glossary.defi_regulation.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'chainalysis_compliance',
		'elliptic_compliance',
		'mica_eu',
		'sec_crypto',
		'fatf_crypto',
		'global_crypto_map'
	],

	lastUpdated: '2025-12-31'
};

/**
 * Privacy Category Guide Data
 * Long-form educational article with real examples and case studies
 *
 * Content philosophy:
 * - Focus on understanding blockchain privacy fundamentals
 * - Include real-world privacy technologies and tools
 * - Explain both benefits and risks of privacy solutions
 * - Progressive learning from basics to advanced concepts
 * - Balance privacy rights with compliance considerations
 */
import type { CategoryGuide } from '../../types';

export const privacyGuide: CategoryGuide = {
	categoryId: 'privacy',
	i18nKeyPrefix: 'routes/apps/chain-tools/privacy/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/privacy/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/privacy/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'railgun', context: 'privacy DeFi protocol' },
				{ toolId: 'aztec-connect', context: 'ZK privacy rollup' }
			]
		},

		// Part 2: Why Privacy Matters
		{
			id: 'why-privacy',
			titleKey: 'routes/apps/chain-tools/privacy/guide.sections.why_privacy.title',
			contentKey: 'routes/apps/chain-tools/privacy/guide.sections.why_privacy.content',
			subsections: [
				{
					id: 'blockchain-transparency',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.why_privacy.blockchain_transparency.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.why_privacy.blockchain_transparency.content'
				},
				{
					id: 'financial-privacy',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.why_privacy.financial_privacy.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.why_privacy.financial_privacy.content'
				},
				{
					id: 'real-world-risks',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.why_privacy.real_world_risks.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.why_privacy.real_world_risks.content'
				}
			]
		},

		// Part 3: Privacy Technologies
		{
			id: 'privacy-technologies',
			titleKey: 'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.title',
			contentKey: 'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.content',
			subsections: [
				{
					id: 'zero-knowledge-proofs',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.zero_knowledge_proofs.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.zero_knowledge_proofs.content',
					toolMentions: [
						{ toolId: 'zcash', context: 'zk-SNARK pioneer' },
						{ toolId: 'aztec-connect', context: 'zk rollup' }
					]
				},
				{
					id: 'mixers',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.mixers.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.mixers.content',
					toolMentions: [{ toolId: 'tornado-cash-classic', context: 'privacy pools' }]
				},
				{
					id: 'stealth-addresses',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.stealth_addresses.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.stealth_addresses.content',
					toolMentions: [
						{ toolId: 'umbra-cash', context: 'stealth payments' },
						{ toolId: 'monero', context: 'native stealth addresses' }
					]
				},
				{
					id: 'encryption',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.encryption.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_technologies.encryption.content',
					toolMentions: [
						{ toolId: 'secret-network', context: 'encrypted smart contracts' },
						{ toolId: 'oasis-network', context: 'confidential computing' }
					]
				}
			]
		},

		// Part 4: Privacy Tools and Protocols
		{
			id: 'privacy-tools',
			titleKey: 'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.title',
			contentKey: 'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.content',
			subsections: [
				{
					id: 'tornado-cash-history',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.tornado_cash_history.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.tornado_cash_history.content',
					caseStudies: [
						{
							id: 'tornado-cash-sanctions',
							titleKey:
								'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.tornado_cash_history.case_sanctions.title',
							descriptionKey:
								'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.tornado_cash_history.case_sanctions.description',
							date: '2022-08-08',
							sourceUrl: 'https://home.treasury.gov/news/press-releases/jy0916',
							relatedToolIds: ['tornado-cash-classic']
						}
					]
				},
				{
					id: 'railgun',
					titleKey: 'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.railgun.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.railgun.content',
					toolMentions: [{ toolId: 'railgun', context: 'private DeFi' }]
				},
				{
					id: 'aztec',
					titleKey: 'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.aztec.title',
					contentKey: 'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.aztec.content',
					toolMentions: [{ toolId: 'aztec-connect', context: 'encrypted rollup' }]
				},
				{
					id: 'privacy-chains',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.privacy_chains.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.privacy_tools.privacy_chains.content',
					toolMentions: [
						{ toolId: 'zcash', context: 'shielded transactions' },
						{ toolId: 'monero', context: 'default privacy' },
						{ toolId: 'iron-fish', context: 'encrypted blockchain' }
					]
				}
			]
		},

		// Part 5: Private Transactions
		{
			id: 'private-transactions',
			titleKey: 'routes/apps/chain-tools/privacy/guide.sections.private_transactions.title',
			contentKey: 'routes/apps/chain-tools/privacy/guide.sections.private_transactions.content',
			subsections: [
				{
					id: 'how-to-send',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.private_transactions.how_to_send.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.private_transactions.how_to_send.content',
					toolMentions: [
						{ toolId: 'railgun', context: 'private transfers' },
						{ toolId: 'umbra-cash', context: 'stealth payments' }
					]
				},
				{
					id: 'private-defi',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.private_transactions.private_defi.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.private_transactions.private_defi.content',
					toolMentions: [
						{ toolId: 'railgun', context: 'shielded DeFi' },
						{ toolId: 'secret-network', context: 'private smart contracts' }
					]
				},
				{
					id: 'best-practices',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.private_transactions.best_practices.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.private_transactions.best_practices.content'
				}
			]
		},

		// Part 6: Compliance and Balance
		{
			id: 'compliance-balance',
			titleKey: 'routes/apps/chain-tools/privacy/guide.sections.compliance_balance.title',
			contentKey: 'routes/apps/chain-tools/privacy/guide.sections.compliance_balance.content',
			subsections: [
				{
					id: 'regulatory-landscape',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.compliance_balance.regulatory_landscape.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.compliance_balance.regulatory_landscape.content'
				},
				{
					id: 'compliant-privacy',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.compliance_balance.compliant_privacy.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.compliance_balance.compliant_privacy.content',
					toolMentions: [
						{ toolId: 'tornado-cash-classic', context: 'privacy pools with compliance' }
					]
				},
				{
					id: 'selective-disclosure',
					titleKey:
						'routes/apps/chain-tools/privacy/guide.sections.compliance_balance.selective_disclosure.title',
					contentKey:
						'routes/apps/chain-tools/privacy/guide.sections.compliance_balance.selective_disclosure.content',
					toolMentions: [{ toolId: 'zcash', context: 'viewing keys' }]
				}
			]
		},

		// Part 7: Risks and Considerations
		{
			id: 'risks',
			titleKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.title',
			contentKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.content',
			subsections: [
				{
					id: 'technical-risks',
					titleKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.technical_risks.title',
					contentKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.technical_risks.content'
				},
				{
					id: 'legal-risks',
					titleKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.legal_risks.title',
					contentKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.legal_risks.content'
				},
				{
					id: 'anonymity-set',
					titleKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.anonymity_set.title',
					contentKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.anonymity_set.content'
				},
				{
					id: 'responsible-use',
					titleKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.responsible_use.title',
					contentKey: 'routes/apps/chain-tools/privacy/guide.sections.risks.responsible_use.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'zero-knowledge-proof',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.zero_knowledge_proof.term',
			definitionKey:
				'routes/apps/chain-tools/privacy/guide.glossary.zero_knowledge_proof.definition',
			relatedToolIds: ['zcash', 'aztec-connect', 'railgun']
		},
		{
			id: 'mixer',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.mixer.term',
			definitionKey: 'routes/apps/chain-tools/privacy/guide.glossary.mixer.definition',
			relatedToolIds: ['tornado-cash-classic']
		},
		{
			id: 'stealth-address',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.stealth_address.term',
			definitionKey: 'routes/apps/chain-tools/privacy/guide.glossary.stealth_address.definition',
			relatedToolIds: ['umbra-cash', 'monero']
		},
		{
			id: 'ring-signature',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.ring_signature.term',
			definitionKey: 'routes/apps/chain-tools/privacy/guide.glossary.ring_signature.definition',
			relatedToolIds: ['monero']
		},
		{
			id: 'nullifier',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.nullifier.term',
			definitionKey: 'routes/apps/chain-tools/privacy/guide.glossary.nullifier.definition',
			relatedToolIds: ['zcash', 'aztec-connect']
		},
		{
			id: 'shielded-transaction',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.shielded_transaction.term',
			definitionKey:
				'routes/apps/chain-tools/privacy/guide.glossary.shielded_transaction.definition',
			relatedToolIds: ['zcash', 'railgun']
		},
		{
			id: 'private-pool',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.private_pool.term',
			definitionKey: 'routes/apps/chain-tools/privacy/guide.glossary.private_pool.definition',
			relatedToolIds: ['railgun', 'tornado-cash-classic']
		},
		{
			id: 'compliance',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.compliance.term',
			definitionKey: 'routes/apps/chain-tools/privacy/guide.glossary.compliance.definition',
			relatedToolIds: ['tornado-cash-classic']
		},
		{
			id: 'anonymity-set',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.anonymity_set.term',
			definitionKey: 'routes/apps/chain-tools/privacy/guide.glossary.anonymity_set.definition',
			relatedToolIds: ['tornado-cash-classic', 'railgun']
		},
		{
			id: 'viewing-key',
			termKey: 'routes/apps/chain-tools/privacy/guide.glossary.viewing_key.term',
			definitionKey: 'routes/apps/chain-tools/privacy/guide.glossary.viewing_key.definition',
			relatedToolIds: ['zcash', 'railgun']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'railgun',
		'aztec-connect',
		'zcash',
		'monero',
		'umbra-cash',
		'secret-network',
		'tornado-cash-classic',
		'iron-fish'
	],

	lastUpdated: '2025-12-31'
};

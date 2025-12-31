/**
 * Security Category Guide Data
 * Comprehensive security education for Web3
 *
 * Content philosophy:
 * - Focus on practical protection first
 * - Include real hack case studies with verifiable sources
 * - Progressive learning from user safety to protocol security
 * - Emphasize both offensive (finding bugs) and defensive (protection)
 */
import type { CategoryGuide } from '../../types';

export const securityGuide: CategoryGuide = {
	categoryId: 'security',
	i18nKeyPrefix: 'routes/apps/chain-tools/security/guide',
	estimatedReadTime: '25 min',

	sections: [
		// Part 1: Understanding Web3 Security
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/security/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/security/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'revoke', context: 'managing approvals' },
				{ toolId: 'etherscan', context: 'verifying contracts' }
			]
		},
		{
			id: 'threat-landscape',
			titleKey: 'routes/apps/chain-tools/security/guide.sections.threat_landscape.title',
			contentKey: 'routes/apps/chain-tools/security/guide.sections.threat_landscape.content',
			subsections: [
				{
					id: 'common-attacks',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.threat_landscape.common_attacks.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.threat_landscape.common_attacks.content'
				},
				{
					id: 'attack-vectors',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.threat_landscape.attack_vectors.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.threat_landscape.attack_vectors.content'
				}
			]
		},

		// Part 2: Personal Security
		{
			id: 'personal-security',
			titleKey: 'routes/apps/chain-tools/security/guide.sections.personal_security.title',
			contentKey: 'routes/apps/chain-tools/security/guide.sections.personal_security.content',
			subsections: [
				{
					id: 'wallet-safety',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.personal_security.wallet_safety.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.personal_security.wallet_safety.content',
					toolMentions: [
						{ toolId: 'metamask', context: 'hardware wallet integration' },
						{ toolId: 'rabby', context: 'transaction preview' }
					]
				},
				{
					id: 'approval-management',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.personal_security.approval_management.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.personal_security.approval_management.content',
					toolMentions: [
						{ toolId: 'revoke', context: 'revoke unlimited approvals' },
						{ toolId: 'de-fi', context: 'approval scanner' }
					]
				},
				{
					id: 'phishing-protection',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.personal_security.phishing_protection.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.personal_security.phishing_protection.content',
					toolMentions: [
						{ toolId: 'pocket-universe', context: 'transaction simulation' },
						{ toolId: 'scamsniffer', context: 'scam detection' }
					]
				}
			]
		},

		// Part 3: Smart Contract Security
		{
			id: 'contract-security',
			titleKey: 'routes/apps/chain-tools/security/guide.sections.contract_security.title',
			contentKey: 'routes/apps/chain-tools/security/guide.sections.contract_security.content',
			subsections: [
				{
					id: 'common-vulnerabilities',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.contract_security.common_vulnerabilities.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.contract_security.common_vulnerabilities.content',
					toolMentions: [
						{ toolId: 'slither', context: 'static analysis' },
						{ toolId: 'mythx', context: 'symbolic execution' }
					]
				},
				{
					id: 'audit-process',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.contract_security.audit_process.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.contract_security.audit_process.content',
					toolMentions: [
						{ toolId: 'certik', context: 'audit leaderboard' },
						{ toolId: 'openzeppelin', context: 'secure contracts library' }
					]
				},
				{
					id: 'formal-verification',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.contract_security.formal_verification.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.contract_security.formal_verification.content'
				}
			]
		},

		// Part 4: Real-World Hacks (Case Studies)
		{
			id: 'case-studies',
			titleKey: 'routes/apps/chain-tools/security/guide.sections.case_studies.title',
			contentKey: 'routes/apps/chain-tools/security/guide.sections.case_studies.content',
			subsections: [
				{
					id: 'reentrancy',
					titleKey: 'routes/apps/chain-tools/security/guide.sections.case_studies.reentrancy.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.case_studies.reentrancy.content',
					caseStudies: [
						{
							id: 'dao-hack',
							titleKey:
								'routes/apps/chain-tools/security/guide.sections.case_studies.reentrancy.case_dao.title',
							descriptionKey:
								'routes/apps/chain-tools/security/guide.sections.case_studies.reentrancy.case_dao.description',
							txHash: '0x0ec3f2488a93839524add10ea229e773f6bc891b4eb4794c3337d4495263790b',
							date: '2016-06-17',
							profit: '~$60M',
							sourceUrl:
								'https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack',
							relatedToolIds: ['etherscan']
						}
					]
				},
				{
					id: 'flash-loan-attacks',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.case_studies.flash_loan_attacks.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.case_studies.flash_loan_attacks.content',
					caseStudies: [
						{
							id: 'euler-hack',
							titleKey:
								'routes/apps/chain-tools/security/guide.sections.case_studies.flash_loan_attacks.case_euler.title',
							descriptionKey:
								'routes/apps/chain-tools/security/guide.sections.case_studies.flash_loan_attacks.case_euler.description',
							txHash: '0xc310a0affe2169d1f6feec1c63dbc7f7c62a887fa48795d327d4d2da2d6b111d',
							date: '2023-03-13',
							profit: '~$197M',
							sourceUrl:
								'https://www.halborn.com/blog/post/explained-the-euler-finance-hack-march-2023',
							relatedToolIds: ['aave', 'phalcon']
						}
					],
					toolMentions: [{ toolId: 'aave', context: 'flash loan provider' }]
				},
				{
					id: 'bridge-hacks',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.case_studies.bridge_hacks.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.case_studies.bridge_hacks.content',
					caseStudies: [
						{
							id: 'ronin-hack',
							titleKey:
								'routes/apps/chain-tools/security/guide.sections.case_studies.bridge_hacks.case_ronin.title',
							descriptionKey:
								'routes/apps/chain-tools/security/guide.sections.case_studies.bridge_hacks.case_ronin.description',
							txHash: '0xc28fad5e8d5e0ce6a2eaf67b6687be5d58113e16be590824d6cfa1a94467d0b7',
							date: '2022-03-23',
							profit: '~$625M',
							sourceUrl: 'https://rekt.news/ronin-rekt/',
							relatedToolIds: ['chainalysis']
						}
					]
				}
			]
		},

		// Part 5: Earning Through Security
		{
			id: 'earning',
			titleKey: 'routes/apps/chain-tools/security/guide.sections.earning.title',
			contentKey: 'routes/apps/chain-tools/security/guide.sections.earning.content',
			subsections: [
				{
					id: 'bug-bounties',
					titleKey: 'routes/apps/chain-tools/security/guide.sections.earning.bug_bounties.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.earning.bug_bounties.content',
					toolMentions: [
						{ toolId: 'immunefi', context: 'largest Web3 bug bounty platform' },
						{ toolId: 'code4rena', context: 'competitive audit contests' }
					]
				},
				{
					id: 'audit-contests',
					titleKey: 'routes/apps/chain-tools/security/guide.sections.earning.audit_contests.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.earning.audit_contests.content',
					toolMentions: [
						{ toolId: 'sherlock', context: 'audit + insurance' },
						{ toolId: 'cyfrin', context: 'CodeHawks contests' }
					]
				},
				{
					id: 'security-career',
					titleKey: 'routes/apps/chain-tools/security/guide.sections.earning.security_career.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.earning.security_career.content'
				}
			]
		},

		// Part 6: Security Tools Deep Dive
		{
			id: 'tools-deep-dive',
			titleKey: 'routes/apps/chain-tools/security/guide.sections.tools_deep_dive.title',
			contentKey: 'routes/apps/chain-tools/security/guide.sections.tools_deep_dive.content',
			subsections: [
				{
					id: 'static-analysis',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.tools_deep_dive.static_analysis.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.tools_deep_dive.static_analysis.content',
					toolMentions: [
						{ toolId: 'slither', context: 'Solidity static analyzer' },
						{ toolId: 'mythx', context: 'automated security analysis' }
					]
				},
				{
					id: 'monitoring',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.tools_deep_dive.monitoring.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.tools_deep_dive.monitoring.content',
					toolMentions: [
						{ toolId: 'forta', context: 'real-time threat detection' },
						{ toolId: 'openzeppelin-defender', context: 'operations automation' }
					]
				},
				{
					id: 'transaction-analysis',
					titleKey:
						'routes/apps/chain-tools/security/guide.sections.tools_deep_dive.transaction_analysis.title',
					contentKey:
						'routes/apps/chain-tools/security/guide.sections.tools_deep_dive.transaction_analysis.content',
					toolMentions: [
						{ toolId: 'phalcon', context: 'transaction tracer' },
						{ toolId: 'tx-tracer', context: 'calldata decoder' }
					]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'reentrancy',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.reentrancy.term',
			definitionKey: 'routes/apps/chain-tools/security/guide.glossary.reentrancy.definition',
			relatedToolIds: ['slither']
		},
		{
			id: 'approval',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.approval.term',
			definitionKey: 'routes/apps/chain-tools/security/guide.glossary.approval.definition',
			relatedToolIds: ['revoke', 'de-fi']
		},
		{
			id: 'front-running',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.front_running.term',
			definitionKey: 'routes/apps/chain-tools/security/guide.glossary.front_running.definition',
			relatedToolIds: ['flashbots']
		},
		{
			id: 'oracle-manipulation',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.oracle_manipulation.term',
			definitionKey:
				'routes/apps/chain-tools/security/guide.glossary.oracle_manipulation.definition',
			relatedToolIds: ['chainlink']
		},
		{
			id: 'private-key',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.private_key.term',
			definitionKey: 'routes/apps/chain-tools/security/guide.glossary.private_key.definition'
		},
		{
			id: 'phishing',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.phishing.term',
			definitionKey: 'routes/apps/chain-tools/security/guide.glossary.phishing.definition',
			relatedToolIds: ['scamsniffer', 'pocket-universe']
		},
		{
			id: 'bug-bounty',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.bug_bounty.term',
			definitionKey: 'routes/apps/chain-tools/security/guide.glossary.bug_bounty.definition',
			relatedToolIds: ['immunefi', 'code4rena']
		},
		{
			id: 'formal-verification',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.formal_verification.term',
			definitionKey:
				'routes/apps/chain-tools/security/guide.glossary.formal_verification.definition'
		},
		{
			id: 'honeypot',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.honeypot.term',
			definitionKey: 'routes/apps/chain-tools/security/guide.glossary.honeypot.definition',
			relatedToolIds: ['honeypot']
		},
		{
			id: 'rugpull',
			termKey: 'routes/apps/chain-tools/security/guide.glossary.rugpull.term',
			definitionKey: 'routes/apps/chain-tools/security/guide.glossary.rugpull.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'revoke',
		'immunefi',
		'slither',
		'certik',
		'openzeppelin',
		'forta',
		'phalcon',
		'code4rena'
	],

	lastUpdated: '2025-12-31'
};

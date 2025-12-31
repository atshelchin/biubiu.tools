/**
 * Wallet Category Guide Data
 * Comprehensive guide to cryptocurrency wallets and portfolio management
 *
 * Content philosophy:
 * - Focus on wallet security fundamentals and best practices
 * - Cover the spectrum from hot wallets to cold storage
 * - Explain Account Abstraction and smart wallets
 * - Include practical guidance for different user needs
 * - Progressive learning from basics to advanced wallet management
 */
import type { CategoryGuide } from '../../types';

export const walletGuide: CategoryGuide = {
	categoryId: 'wallet',
	i18nKeyPrefix: 'routes/apps/chain-tools/wallet/guide',
	estimatedReadTime: '25 min',

	sections: [
		// Part 1: Understanding Wallets
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/wallet/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/wallet/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'metamask', context: 'most popular wallet' },
				{ toolId: 'ledger', context: 'hardware security' }
			]
		},
		{
			id: 'wallet-basics',
			titleKey: 'routes/apps/chain-tools/wallet/guide.sections.wallet_basics.title',
			contentKey: 'routes/apps/chain-tools/wallet/guide.sections.wallet_basics.content',
			subsections: [
				{
					id: 'keys-addresses',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_basics.keys_addresses.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_basics.keys_addresses.content'
				},
				{
					id: 'seed-phrases',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.wallet_basics.seed_phrases.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_basics.seed_phrases.content',
					toolMentions: [{ toolId: 'biubiu-wallet-generator', context: 'generate HD wallets' }]
				},
				{
					id: 'custodial-vs-non',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_basics.custodial_vs_non.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_basics.custodial_vs_non.content'
				}
			]
		},

		// Part 2: Types of Wallets
		{
			id: 'wallet-types',
			titleKey: 'routes/apps/chain-tools/wallet/guide.sections.wallet_types.title',
			contentKey: 'routes/apps/chain-tools/wallet/guide.sections.wallet_types.content',
			subsections: [
				{
					id: 'hot-wallets',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.wallet_types.hot_wallets.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_types.hot_wallets.content',
					toolMentions: [
						{ toolId: 'metamask', context: 'browser extension' },
						{ toolId: 'rabby', context: 'security-focused' },
						{ toolId: 'rainbow', context: 'mobile wallet' }
					]
				},
				{
					id: 'cold-wallets',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.wallet_types.cold_wallets.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_types.cold_wallets.content',
					toolMentions: [
						{ toolId: 'ledger', context: 'industry leader' },
						{ toolId: 'trezor', context: 'open source' },
						{ toolId: 'keystone-wallet', context: 'air-gapped' }
					]
				},
				{
					id: 'smart-wallets',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_types.smart_wallets.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_types.smart_wallets.content',
					toolMentions: [
						{ toolId: 'safe', context: 'multisig standard' },
						{ toolId: 'argent', context: 'social recovery' },
						{ toolId: 'ambire', context: 'gasless transactions' }
					]
				},
				{
					id: 'multichain-wallets',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_types.multichain_wallets.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.wallet_types.multichain_wallets.content',
					toolMentions: [
						{ toolId: 'phantom-wallet', context: 'Solana & Ethereum' },
						{ toolId: 'keplr-wallet', context: 'Cosmos ecosystem' },
						{ toolId: 'okx-wallet', context: 'comprehensive coverage' }
					]
				}
			]
		},

		// Part 3: Getting Started
		{
			id: 'getting-started',
			titleKey: 'routes/apps/chain-tools/wallet/guide.sections.getting_started.title',
			contentKey: 'routes/apps/chain-tools/wallet/guide.sections.getting_started.content',
			subsections: [
				{
					id: 'first-wallet',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.getting_started.first_wallet.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.getting_started.first_wallet.content',
					toolMentions: [
						{ toolId: 'rabby', context: 'recommended for beginners' },
						{ toolId: 'coinbase-wallet', context: 'user-friendly option' }
					]
				},
				{
					id: 'backup-recovery',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.getting_started.backup_recovery.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.getting_started.backup_recovery.content'
				},
				{
					id: 'connecting-dapps',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.getting_started.connecting_dapps.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.getting_started.connecting_dapps.content'
				}
			]
		},

		// Part 4: Portfolio Management
		{
			id: 'portfolio',
			titleKey: 'routes/apps/chain-tools/wallet/guide.sections.portfolio.title',
			contentKey: 'routes/apps/chain-tools/wallet/guide.sections.portfolio.content',
			subsections: [
				{
					id: 'tracking-assets',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.portfolio.tracking_assets.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.portfolio.tracking_assets.content',
					toolMentions: [
						{ toolId: 'debank', context: 'comprehensive DeFi tracking' },
						{ toolId: 'zapper', context: 'portfolio dashboard' },
						{ toolId: 'zerion', context: 'wallet + portfolio' }
					]
				},
				{
					id: 'batch-operations',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.portfolio.batch_operations.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.portfolio.batch_operations.content',
					toolMentions: [
						{ toolId: 'biubiu-wallet-sweep', context: 'consolidate assets' },
						{ toolId: 'biubiu-one-to-many', context: 'distribute tokens' },
						{ toolId: 'biubiu-balance-scanner', context: 'check balances' }
					]
				}
			]
		},

		// Part 5: Wallet Security
		{
			id: 'security',
			titleKey: 'routes/apps/chain-tools/wallet/guide.sections.security.title',
			contentKey: 'routes/apps/chain-tools/wallet/guide.sections.security.content',
			subsections: [
				{
					id: 'common-threats',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.security.common_threats.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.security.common_threats.content'
				},
				{
					id: 'security-practices',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.security.security_practices.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.security.security_practices.content',
					toolMentions: [{ toolId: 'revoke', context: 'manage approvals' }]
				},
				{
					id: 'wallet-drains',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.security.wallet_drains.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.security.wallet_drains.content',
					caseStudies: [
						{
							id: 'ledger-connect-kit',
							titleKey:
								'routes/apps/chain-tools/wallet/guide.sections.security.wallet_drains.case_ledger.title',
							descriptionKey:
								'routes/apps/chain-tools/wallet/guide.sections.security.wallet_drains.case_ledger.description',
							txHash: '0x7ad81bb3bcd8c8b36eb672a0c7b79f85edf7cd3e7ae9f36fe5b3f0f4e5b8c9d2',
							date: '2023-12-14',
							profit: '~$600K drained',
							sourceUrl: 'https://rekt.news/ledger-connect-rekt/',
							relatedToolIds: ['ledger', 'revoke']
						}
					]
				},
				{
					id: 'multisig',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.security.multisig.title',
					contentKey: 'routes/apps/chain-tools/wallet/guide.sections.security.multisig.content',
					toolMentions: [
						{ toolId: 'safe', context: 'most trusted multisig' },
						{ toolId: 'squads', context: 'Solana multisig' }
					]
				}
			]
		},

		// Part 6: Account Abstraction
		{
			id: 'account-abstraction',
			titleKey: 'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.title',
			contentKey: 'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.content',
			subsections: [
				{
					id: 'what-is-aa',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.what_is_aa.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.what_is_aa.content'
				},
				{
					id: 'erc-4337',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.erc_4337.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.erc_4337.content',
					toolMentions: [
						{ toolId: 'pimlico', context: 'bundler infrastructure' },
						{ toolId: 'stackup', context: 'AA SDK' },
						{ toolId: 'biconomy', context: 'gasless SDK' }
					]
				},
				{
					id: 'aa-wallets',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.aa_wallets.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.aa_wallets.content',
					toolMentions: [
						{ toolId: 'zerodev', context: 'modular AA' },
						{ toolId: 'alchemy-aa', context: 'Account Kit' },
						{ toolId: 'soul-wallet', context: 'ERC-4337 wallet' }
					]
				},
				{
					id: 'embedded-wallets',
					titleKey:
						'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.embedded_wallets.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.account_abstraction.embedded_wallets.content',
					toolMentions: [
						{ toolId: 'privy', context: 'social login' },
						{ toolId: 'dynamic', context: 'authentication' },
						{ toolId: 'web3auth-wallet', context: 'MPC wallets' }
					]
				}
			]
		},

		// Part 7: Advanced Topics
		{
			id: 'advanced',
			titleKey: 'routes/apps/chain-tools/wallet/guide.sections.advanced.title',
			contentKey: 'routes/apps/chain-tools/wallet/guide.sections.advanced.content',
			subsections: [
				{
					id: 'hd-wallets',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.advanced.hd_wallets.title',
					contentKey: 'routes/apps/chain-tools/wallet/guide.sections.advanced.hd_wallets.content',
					toolMentions: [{ toolId: 'biubiu-wallet-generator', context: 'generate HD wallets' }]
				},
				{
					id: 'hardware-best',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.advanced.hardware_best.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.advanced.hardware_best.content',
					toolMentions: [
						{ toolId: 'ledger', context: 'Ledger Nano X/S Plus' },
						{ toolId: 'trezor', context: 'Model T/Safe 3' },
						{ toolId: 'keystone-wallet', context: 'air-gapped signing' }
					]
				},
				{
					id: 'institutional',
					titleKey: 'routes/apps/chain-tools/wallet/guide.sections.advanced.institutional.title',
					contentKey:
						'routes/apps/chain-tools/wallet/guide.sections.advanced.institutional.content',
					toolMentions: [
						{ toolId: 'fireblocks-wallet', context: 'MPC custody' },
						{ toolId: 'bitgo-wallet', context: 'enterprise custody' }
					]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'private-key',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.private_key.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.private_key.definition'
		},
		{
			id: 'public-key',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.public_key.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.public_key.definition'
		},
		{
			id: 'seed-phrase',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.seed_phrase.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.seed_phrase.definition',
			relatedToolIds: ['biubiu-wallet-generator']
		},
		{
			id: 'hd-wallet',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.hd_wallet.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.hd_wallet.definition'
		},
		{
			id: 'hot-wallet',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.hot_wallet.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.hot_wallet.definition',
			relatedToolIds: ['metamask', 'rabby']
		},
		{
			id: 'cold-wallet',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.cold_wallet.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.cold_wallet.definition',
			relatedToolIds: ['ledger', 'trezor']
		},
		{
			id: 'multisig',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.multisig.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.multisig.definition',
			relatedToolIds: ['safe', 'squads']
		},
		{
			id: 'smart-wallet',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.smart_wallet.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.smart_wallet.definition',
			relatedToolIds: ['argent', 'ambire', 'soul-wallet']
		},
		{
			id: 'account-abstraction',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.account_abstraction.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.account_abstraction.definition',
			relatedToolIds: ['pimlico', 'zerodev', 'biconomy']
		},
		{
			id: 'eoa',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.eoa.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.eoa.definition'
		},
		{
			id: 'bundler',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.bundler.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.bundler.definition',
			relatedToolIds: ['pimlico', 'stackup']
		},
		{
			id: 'paymaster',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.paymaster.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.paymaster.definition',
			relatedToolIds: ['biconomy', 'pimlico']
		},
		{
			id: 'token-approval',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.token_approval.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.token_approval.definition',
			relatedToolIds: ['revoke']
		},
		{
			id: 'social-recovery',
			termKey: 'routes/apps/chain-tools/wallet/guide.glossary.social_recovery.term',
			definitionKey: 'routes/apps/chain-tools/wallet/guide.glossary.social_recovery.definition',
			relatedToolIds: ['argent']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'metamask',
		'rabby',
		'ledger',
		'safe',
		'debank',
		'biconomy',
		'zerodev',
		'biubiu-wallet-sweep'
	],

	lastUpdated: '2025-12-31'
};

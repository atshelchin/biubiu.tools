/**
 * Explorer Category Guide Data
 * Comprehensive guide to blockchain explorers and on-chain analysis
 *
 * Content philosophy:
 * - Explain how explorers work and why they matter
 * - Cover different explorer types and their use cases
 * - Include practical guidance for analyzing transactions
 * - Progressive learning from basics to advanced debugging
 */
import type { CategoryGuide } from '../../types';

export const explorerGuide: CategoryGuide = {
	categoryId: 'explorer',
	i18nKeyPrefix: 'routes/apps/chain-tools/explorer/guide',
	estimatedReadTime: '20 min',

	sections: [
		// Part 1: Understanding Block Explorers
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/explorer/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/explorer/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'etherscan', context: 'most popular Ethereum explorer' },
				{ toolId: 'blockscout', context: 'open-source alternative' }
			]
		},
		{
			id: 'explorer-basics',
			titleKey: 'routes/apps/chain-tools/explorer/guide.sections.explorer_basics.title',
			contentKey: 'routes/apps/chain-tools/explorer/guide.sections.explorer_basics.content',
			subsections: [
				{
					id: 'what-is-explorer',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.explorer_basics.what_is.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_basics.what_is.content'
				},
				{
					id: 'why-use-explorers',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.explorer_basics.why_use.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_basics.why_use.content'
				},
				{
					id: 'explorer-anatomy',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.explorer_basics.anatomy.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_basics.anatomy.content',
					toolMentions: [{ toolId: 'etherscan', context: 'UI walkthrough' }]
				}
			]
		},

		// Part 2: Transaction Analysis
		{
			id: 'transactions',
			titleKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.title',
			contentKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.content',
			subsections: [
				{
					id: 'reading-transactions',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.reading.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.reading.content'
				},
				{
					id: 'tx-status',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.status.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.status.content'
				},
				{
					id: 'internal-transactions',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.internal.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.transactions.internal.content',
					toolMentions: [{ toolId: 'samczsun-tx', context: 'detailed trace analysis' }]
				},
				{
					id: 'event-logs',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.logs.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.transactions.logs.content'
				}
			]
		},

		// Part 3: Address & Contract Analysis
		{
			id: 'addresses',
			titleKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.title',
			contentKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.content',
			subsections: [
				{
					id: 'eoa-vs-contract',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.eoa_vs.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.eoa_vs.content'
				},
				{
					id: 'contract-verification',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.verification.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.addresses.verification.content',
					toolMentions: [
						{ toolId: 'etherscan', context: 'contract verification' },
						{ toolId: 'sourcify', context: 'decentralized verification' }
					]
				},
				{
					id: 'read-write-contract',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.read_write.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.read_write.content'
				},
				{
					id: 'token-tracking',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.tokens.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.addresses.tokens.content'
				}
			]
		},

		// Part 4: Explorer Types
		{
			id: 'explorer-types',
			titleKey: 'routes/apps/chain-tools/explorer/guide.sections.explorer_types.title',
			contentKey: 'routes/apps/chain-tools/explorer/guide.sections.explorer_types.content',
			subsections: [
				{
					id: 'etherscan-family',
					titleKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_types.etherscan.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_types.etherscan.content',
					toolMentions: [
						{ toolId: 'etherscan', context: 'Ethereum mainnet' },
						{ toolId: 'arbiscan', context: 'Arbitrum' },
						{ toolId: 'op-etherscan', context: 'Optimism' },
						{ toolId: 'basescan', context: 'Base' },
						{ toolId: 'polygonscan', context: 'Polygon' },
						{ toolId: 'bscscan', context: 'BNB Chain' }
					]
				},
				{
					id: 'open-source',
					titleKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_types.open_source.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_types.open_source.content',
					toolMentions: [
						{ toolId: 'blockscout', context: 'most popular open-source' },
						{ toolId: 'routescan', context: 'unified multi-chain' }
					]
				},
				{
					id: 'multi-chain',
					titleKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_types.multi_chain.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_types.multi_chain.content',
					toolMentions: [
						{ toolId: 'blockchair', context: 'privacy-focused multi-chain' },
						{ toolId: 'oklink', context: 'OKX ecosystem' },
						{ toolId: 'evmexplorer', context: 'EVM unified' }
					]
				},
				{
					id: 'non-evm',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.explorer_types.non_evm.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.explorer_types.non_evm.content',
					toolMentions: [
						{ toolId: 'solscan', context: 'Solana' },
						{ toolId: 'mintscan', context: 'Cosmos ecosystem' },
						{ toolId: 'nearblocks', context: 'NEAR Protocol' },
						{ toolId: 'tonscan', context: 'TON' },
						{ toolId: 'tronscan', context: 'Tron' },
						{ toolId: 'suiscan', context: 'Sui' },
						{ toolId: 'cardanoscan', context: 'Cardano' }
					]
				}
			]
		},

		// Part 5: Advanced Tools
		{
			id: 'advanced-tools',
			titleKey: 'routes/apps/chain-tools/explorer/guide.sections.advanced_tools.title',
			contentKey: 'routes/apps/chain-tools/explorer/guide.sections.advanced_tools.content',
			subsections: [
				{
					id: 'tx-tracers',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.advanced_tools.tracers.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.advanced_tools.tracers.content',
					toolMentions: [
						{ toolId: 'samczsun-tx', context: 'security researcher tool' },
						{ toolId: 'tenderly', context: 'debugging platform' }
					]
				},
				{
					id: 'abi-decoders',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.advanced_tools.decoders.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.advanced_tools.decoders.content',
					toolMentions: [{ toolId: 'anyabi', context: 'ABI lookup' }]
				},
				{
					id: 'human-readable',
					titleKey:
						'routes/apps/chain-tools/explorer/guide.sections.advanced_tools.human_readable.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.advanced_tools.human_readable.content',
					toolMentions: [{ toolId: 'onceupon', context: 'social transaction view' }]
				}
			]
		},

		// Part 6: Practical Use Cases
		{
			id: 'use-cases',
			titleKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.title',
			contentKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.content',
			subsections: [
				{
					id: 'tracking-deposits',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.tracking.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.tracking.content'
				},
				{
					id: 'debugging-failed',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.debugging.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.debugging.content'
				},
				{
					id: 'verifying-contracts',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.verifying.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.verifying.content'
				},
				{
					id: 'whale-watching',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.whales.title',
					contentKey: 'routes/apps/chain-tools/explorer/guide.sections.use_cases.whales.content'
				}
			]
		},

		// Part 7: API & Developer Usage
		{
			id: 'api-usage',
			titleKey: 'routes/apps/chain-tools/explorer/guide.sections.api_usage.title',
			contentKey: 'routes/apps/chain-tools/explorer/guide.sections.api_usage.content',
			subsections: [
				{
					id: 'etherscan-api',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.api_usage.etherscan_api.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.api_usage.etherscan_api.content',
					toolMentions: [{ toolId: 'etherscan', context: 'API access' }]
				},
				{
					id: 'rate-limits',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.api_usage.rate_limits.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.api_usage.rate_limits.content'
				},
				{
					id: 'alternatives',
					titleKey: 'routes/apps/chain-tools/explorer/guide.sections.api_usage.alternatives.title',
					contentKey:
						'routes/apps/chain-tools/explorer/guide.sections.api_usage.alternatives.content',
					toolMentions: [
						{ toolId: 'blockscout', context: 'open API' },
						{ toolId: 'the-graph', context: 'subgraph queries' }
					]
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'transaction-hash',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.tx_hash.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.tx_hash.definition'
		},
		{
			id: 'block-number',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.block_number.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.block_number.definition'
		},
		{
			id: 'gas-used',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.gas_used.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.gas_used.definition'
		},
		{
			id: 'nonce',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.nonce.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.nonce.definition'
		},
		{
			id: 'internal-tx',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.internal_tx.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.internal_tx.definition',
			relatedToolIds: ['etherscan', 'samczsun-tx']
		},
		{
			id: 'event-log',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.event_log.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.event_log.definition'
		},
		{
			id: 'abi',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.abi.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.abi.definition',
			relatedToolIds: ['anyabi', 'etherscan']
		},
		{
			id: 'verified-contract',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.verified_contract.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.verified_contract.definition',
			relatedToolIds: ['etherscan', 'sourcify']
		},
		{
			id: 'eoa',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.eoa.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.eoa.definition'
		},
		{
			id: 'contract-address',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.contract_address.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.contract_address.definition'
		},
		{
			id: 'trace',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.trace.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.trace.definition',
			relatedToolIds: ['samczsun-tx', 'tenderly']
		},
		{
			id: 'revert',
			termKey: 'routes/apps/chain-tools/explorer/guide.glossary.revert.term',
			definitionKey: 'routes/apps/chain-tools/explorer/guide.glossary.revert.definition'
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'etherscan',
		'blockscout',
		'arbiscan',
		'solscan',
		'blockchair',
		'samczsun-tx',
		'anyabi',
		'onceupon'
	],

	lastUpdated: '2025-12-31'
};

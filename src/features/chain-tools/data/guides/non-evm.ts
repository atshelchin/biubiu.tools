/**
 * Non-EVM (Alternative Blockchains) Category Guide Data
 * Long-form educational article about non-EVM blockchain ecosystems
 *
 * Content philosophy:
 * - Focus on understanding architectural differences from EVM
 * - Include ecosystem-specific tools and development patterns
 * - Emphasize unique features (parallel execution, IBC, object model, etc.)
 * - Progressive learning from ecosystem overview to chain selection
 */
import type { CategoryGuide } from '../../types';

export const nonEvmGuide: CategoryGuide = {
	categoryId: 'non-evm',
	i18nKeyPrefix: 'routes/apps/chain-tools/non-evm/guide',
	estimatedReadTime: '18 min',

	sections: [
		// Part 1: Introduction
		{
			id: 'intro',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.intro.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.intro.content',
			toolMentions: [
				{ toolId: 'solana-network', context: 'high-performance execution' },
				{ toolId: 'cosmos-network', context: 'interchain communication' },
				{ toolId: 'sui-network', context: 'object-centric model' }
			]
		},

		// Part 2: Solana Ecosystem
		{
			id: 'solana',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.solana.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.solana.content',
			subsections: [
				{
					id: 'solana-architecture',
					titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.solana.architecture.title',
					contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.solana.architecture.content',
					toolMentions: [{ toolId: 'solana-network' }, { toolId: 'solana-explorer' }]
				},
				{
					id: 'solana-development',
					titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.solana.development.title',
					contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.solana.development.content'
				},
				{
					id: 'solana-ecosystem',
					titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.solana.ecosystem.title',
					contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.solana.ecosystem.content',
					toolMentions: [
						{ toolId: 'jupiter-solana', context: 'DEX aggregator' },
						{ toolId: 'raydium', context: 'AMM' },
						{ toolId: 'phantom-wallet', context: 'wallet' }
					]
				}
			]
		},

		// Part 3: Cosmos Ecosystem
		{
			id: 'cosmos',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.cosmos.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.cosmos.content',
			subsections: [
				{
					id: 'cosmos-ibc',
					titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.cosmos.ibc.title',
					contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.cosmos.ibc.content',
					toolMentions: [
						{ toolId: 'cosmos-network', context: 'IBC hub' },
						{ toolId: 'ibc-protocol', context: 'protocol details' }
					]
				},
				{
					id: 'cosmos-appchains',
					titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.cosmos.appchains.title',
					contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.cosmos.appchains.content',
					toolMentions: [
						{ toolId: 'osmosis', context: 'DEX chain' },
						{ toolId: 'injective', context: 'trading chain' }
					]
				},
				{
					id: 'cosmos-staking',
					titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.cosmos.staking.title',
					contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.cosmos.staking.content',
					toolMentions: [
						{ toolId: 'keplr-wallet', context: 'staking wallet' },
						{ toolId: 'stride-zone', context: 'liquid staking' }
					]
				}
			]
		},

		// Part 4: Move-based Chains
		{
			id: 'move-chains',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.move_chains.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.move_chains.content',
			subsections: [
				{
					id: 'sui',
					titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.move_chains.sui.title',
					contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.move_chains.sui.content',
					toolMentions: [
						{ toolId: 'sui-network' },
						{ toolId: 'sui-wallet' },
						{ toolId: 'turbos-finance' }
					]
				},
				{
					id: 'aptos',
					titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.move_chains.aptos.title',
					contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.move_chains.aptos.content',
					toolMentions: [
						{ toolId: 'aptos-network' },
						{ toolId: 'petra-wallet' },
						{ toolId: 'liquidswap' }
					]
				}
			]
		},

		// Part 5: Bitcoin Ecosystem
		{
			id: 'bitcoin-ecosystem',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.bitcoin_ecosystem.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.bitcoin_ecosystem.content',
			subsections: [
				{
					id: 'ordinals',
					titleKey:
						'routes/apps/chain-tools/non-evm/guide.sections.bitcoin_ecosystem.ordinals.title',
					contentKey:
						'routes/apps/chain-tools/non-evm/guide.sections.bitcoin_ecosystem.ordinals.content'
				},
				{
					id: 'lightning',
					titleKey:
						'routes/apps/chain-tools/non-evm/guide.sections.bitcoin_ecosystem.lightning.title',
					contentKey:
						'routes/apps/chain-tools/non-evm/guide.sections.bitcoin_ecosystem.lightning.content',
					toolMentions: [{ toolId: 'lightning-network' }]
				},
				{
					id: 'bitcoin-l2s',
					titleKey:
						'routes/apps/chain-tools/non-evm/guide.sections.bitcoin_ecosystem.bitcoin_l2s.title',
					contentKey:
						'routes/apps/chain-tools/non-evm/guide.sections.bitcoin_ecosystem.bitcoin_l2s.content',
					toolMentions: [{ toolId: 'stacks' }, { toolId: 'rsk-rootstock' }]
				}
			]
		},

		// Part 6: TON Ecosystem
		{
			id: 'ton',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.ton.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.ton.content',
			toolMentions: [
				{ toolId: 'ton-network', context: 'Telegram integration' },
				{ toolId: 'tonkeeper', context: 'wallet' },
				{ toolId: 'ston-fi', context: 'DEX' }
			]
		},

		// Part 7: Other Major Ecosystems
		{
			id: 'near-protocol',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.near_protocol.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.near_protocol.content',
			toolMentions: [
				{ toolId: 'near-protocol' },
				{ toolId: 'near-explorer' },
				{ toolId: 'ref-finance' }
			]
		},
		{
			id: 'polkadot-substrate',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.polkadot_substrate.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.polkadot_substrate.content',
			toolMentions: [{ toolId: 'polkadot' }, { toolId: 'subscan' }]
		},

		// Part 8: Choosing Your Chain
		{
			id: 'choosing-chain',
			titleKey: 'routes/apps/chain-tools/non-evm/guide.sections.choosing_chain.title',
			contentKey: 'routes/apps/chain-tools/non-evm/guide.sections.choosing_chain.content',
			subsections: [
				{
					id: 'performance',
					titleKey:
						'routes/apps/chain-tools/non-evm/guide.sections.choosing_chain.performance.title',
					contentKey:
						'routes/apps/chain-tools/non-evm/guide.sections.choosing_chain.performance.content'
				},
				{
					id: 'developer-experience',
					titleKey:
						'routes/apps/chain-tools/non-evm/guide.sections.choosing_chain.developer_experience.title',
					contentKey:
						'routes/apps/chain-tools/non-evm/guide.sections.choosing_chain.developer_experience.content'
				},
				{
					id: 'ecosystem-maturity',
					titleKey:
						'routes/apps/chain-tools/non-evm/guide.sections.choosing_chain.ecosystem_maturity.title',
					contentKey:
						'routes/apps/chain-tools/non-evm/guide.sections.choosing_chain.ecosystem_maturity.content'
				}
			]
		}
	],

	// Glossary for quick reference
	glossary: [
		{
			id: 'non-evm',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.non_evm.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.non_evm.definition'
		},
		{
			id: 'parallel-execution',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.parallel_execution.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.parallel_execution.definition',
			relatedToolIds: ['solana-network', 'sui-network', 'aptos-network']
		},
		{
			id: 'ibc',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.ibc.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.ibc.definition',
			relatedToolIds: ['cosmos-network', 'ibc-protocol', 'osmosis']
		},
		{
			id: 'app-chain',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.app_chain.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.app_chain.definition',
			relatedToolIds: ['cosmos-network', 'osmosis', 'injective']
		},
		{
			id: 'validator',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.validator.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.validator.definition',
			relatedToolIds: ['cosmos-network', 'solana-network']
		},
		{
			id: 'ordinals',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.ordinals.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.ordinals.definition'
		},
		{
			id: 'inscription',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.inscription.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.inscription.definition'
		},
		{
			id: 'sharding',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.sharding.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.sharding.definition',
			relatedToolIds: ['near-protocol', 'ton-network']
		},
		{
			id: 'parachain',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.parachain.term',
			definitionKey: 'routes/apps/chain-tools/non-evm/guide.glossary.parachain.definition',
			relatedToolIds: ['polkadot']
		},
		{
			id: 'account-abstraction',
			termKey: 'routes/apps/chain-tools/non-evm/guide.glossary.account_abstraction.term',
			definitionKey:
				'routes/apps/chain-tools/non-evm/guide.glossary.account_abstraction.definition',
			relatedToolIds: ['aptos-network', 'sui-network']
		}
	],

	// Featured tools shown in sidebar/footer
	featuredToolIds: [
		'solana-network',
		'phantom-wallet',
		'cosmos-network',
		'sui-network',
		'aptos-network',
		'ton-network',
		'near-protocol',
		'polkadot'
	],

	lastUpdated: '2025-12-31'
};

/**
 * Non-EVM Tools - Heterogeneous networks (non-EVM compatible)
 *
 * Categories:
 * - Solana Ecosystem
 * - Cosmos Ecosystem
 * - Move-based Chains (Sui, Aptos)
 * - Other Alt L1s
 * - Cross-chain Infrastructure
 */
import {
	Globe,
	Zap,
	Layers,
	Network,
	Coins,
	Shield,
	TrendingUp,
	Code,
	Wallet,
	Search,
	ArrowLeftRight
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const nonEvmTools: ExternalTool[] = [
	// ========== Solana Ecosystem ==========
	{
		id: 'solana-network',
		name: 'Solana',
		descriptionKey: 'chain-tools.non_evm.tools.solana_network.description',
		url: 'https://solana.com',
		icon: Zap,
		category: 'non-evm',
		tags: ['solana', 'l1', 'high-performance', 'rust'],
		chains: ['Solana'],
		color: '#9945FF'
	},
	{
		id: 'solana-explorer',
		name: 'Solana Explorer',
		descriptionKey: 'chain-tools.non_evm.tools.solana_explorer.description',
		url: 'https://explorer.solana.com',
		icon: Search,
		category: 'non-evm',
		tags: ['solana', 'explorer', 'transactions', 'blocks'],
		chains: ['Solana'],
		color: '#9945FF'
	},
	{
		id: 'solscan',
		name: 'Solscan',
		descriptionKey: 'chain-tools.non_evm.tools.solscan.description',
		url: 'https://solscan.io',
		icon: Search,
		category: 'non-evm',
		tags: ['solana', 'explorer', 'analytics', 'tokens'],
		chains: ['Solana'],
		color: '#00FFA3'
	},
	{
		id: 'jupiter-solana',
		name: 'Jupiter (Solana)',
		descriptionKey: 'chain-tools.non_evm.tools.jupiter_solana.description',
		url: 'https://jup.ag',
		icon: Zap,
		category: 'non-evm',
		tags: ['solana', 'dex', 'aggregator', 'swap'],
		chains: ['Solana'],
		color: '#00D395'
	},
	{
		id: 'raydium',
		name: 'Raydium',
		descriptionKey: 'chain-tools.non_evm.tools.raydium.description',
		url: 'https://raydium.io',
		icon: TrendingUp,
		category: 'non-evm',
		tags: ['solana', 'amm', 'dex', 'liquidity'],
		chains: ['Solana'],
		color: '#4F67FF'
	},
	{
		id: 'marinade-finance',
		name: 'Marinade Finance',
		descriptionKey: 'chain-tools.non_evm.tools.marinade_finance.description',
		url: 'https://marinade.finance',
		icon: Coins,
		category: 'non-evm',
		tags: ['solana', 'staking', 'liquid-staking', 'msol'],
		chains: ['Solana'],
		color: '#6BF9C8'
	},
	{
		id: 'phantom-wallet',
		name: 'Phantom Wallet',
		descriptionKey: 'chain-tools.non_evm.tools.phantom_wallet.description',
		url: 'https://phantom.app',
		icon: Wallet,
		category: 'non-evm',
		tags: ['solana', 'wallet', 'browser', 'mobile'],
		chains: ['Solana', 'Ethereum', 'Polygon'],
		color: '#AB9FF2',
		isFeatured: true
	},
	{
		id: 'magic-eden-solana',
		name: 'Magic Eden',
		descriptionKey: 'chain-tools.non_evm.tools.magic_eden_solana.description',
		url: 'https://magiceden.io',
		icon: Globe,
		category: 'non-evm',
		tags: ['solana', 'nft', 'marketplace', 'trading'],
		chains: ['Solana', 'Bitcoin', 'Ethereum'],
		color: '#E42575'
	},
	{
		id: 'tensor-nft',
		name: 'Tensor',
		descriptionKey: 'chain-tools.non_evm.tools.tensor_nft.description',
		url: 'https://tensor.trade',
		icon: TrendingUp,
		category: 'non-evm',
		tags: ['solana', 'nft', 'trading', 'marketplace'],
		chains: ['Solana'],
		color: '#FF6B6B'
	},
	{
		id: 'drift-protocol',
		name: 'Drift Protocol',
		descriptionKey: 'chain-tools.non_evm.tools.drift_protocol.description',
		url: 'https://drift.trade',
		icon: TrendingUp,
		category: 'non-evm',
		tags: ['solana', 'perps', 'trading', 'defi'],
		chains: ['Solana'],
		color: '#00D395'
	},
	// ========== Cosmos Ecosystem ==========
	{
		id: 'cosmos-network',
		name: 'Cosmos Hub',
		descriptionKey: 'chain-tools.non_evm.tools.cosmos_network.description',
		url: 'https://cosmos.network',
		icon: Network,
		category: 'non-evm',
		tags: ['cosmos', 'ibc', 'interchain', 'atom'],
		chains: ['Cosmos'],
		color: '#2E3148'
	},
	{
		id: 'mintscan',
		name: 'Mintscan',
		descriptionKey: 'chain-tools.non_evm.tools.mintscan.description',
		url: 'https://mintscan.io',
		icon: Search,
		category: 'non-evm',
		tags: ['cosmos', 'explorer', 'ibc', 'multi-chain'],
		chains: ['Cosmos'],
		color: '#6C7AE0'
	},
	{
		id: 'osmosis',
		name: 'Osmosis',
		descriptionKey: 'chain-tools.non_evm.tools.osmosis.description',
		url: 'https://osmosis.zone',
		icon: Coins,
		category: 'non-evm',
		tags: ['cosmos', 'dex', 'amm', 'ibc'],
		chains: ['Osmosis'],
		color: '#5E12A0'
	},
	{
		id: 'keplr-wallet',
		name: 'Keplr Wallet',
		descriptionKey: 'chain-tools.non_evm.tools.keplr_wallet.description',
		url: 'https://keplr.app',
		icon: Wallet,
		category: 'non-evm',
		tags: ['cosmos', 'wallet', 'ibc', 'staking'],
		chains: ['Cosmos'],
		color: '#7B61FF'
	},
	{
		id: 'stride-zone',
		name: 'Stride',
		descriptionKey: 'chain-tools.non_evm.tools.stride_zone.description',
		url: 'https://stride.zone',
		icon: Coins,
		category: 'non-evm',
		tags: ['cosmos', 'liquid-staking', 'staking', 'ibc'],
		chains: ['Stride'],
		color: '#E91179'
	},
	{
		id: 'injective',
		name: 'Injective',
		descriptionKey: 'chain-tools.non_evm.tools.injective.description',
		url: 'https://injective.com',
		icon: TrendingUp,
		category: 'non-evm',
		tags: ['cosmos', 'defi', 'trading', 'derivatives'],
		chains: ['Injective'],
		color: '#00F2FE'
	},
	{
		id: 'celestia',
		name: 'Celestia',
		descriptionKey: 'chain-tools.non_evm.tools.celestia.description',
		url: 'https://celestia.org',
		icon: Layers,
		category: 'non-evm',
		tags: ['modular', 'data-availability', 'cosmos', 'rollup'],
		chains: ['Celestia'],
		color: '#7B2BF9'
	},
	{
		id: 'dymension',
		name: 'Dymension',
		descriptionKey: 'chain-tools.non_evm.tools.dymension.description',
		url: 'https://dymension.xyz',
		icon: Layers,
		category: 'non-evm',
		tags: ['cosmos', 'rollapp', 'modular', 'ibc'],
		chains: ['Dymension'],
		color: '#E91179'
	},
	{
		id: 'sei-network',
		name: 'Sei Network',
		descriptionKey: 'chain-tools.non_evm.tools.sei_network.description',
		url: 'https://sei.io',
		icon: Zap,
		category: 'non-evm',
		tags: ['cosmos', 'trading', 'parallel', 'defi'],
		chains: ['Sei'],
		color: '#9B1C1C'
	},
	// ========== Move-based Chains ==========
	{
		id: 'sui-network',
		name: 'Sui',
		descriptionKey: 'chain-tools.non_evm.tools.sui_network.description',
		url: 'https://sui.io',
		icon: Zap,
		category: 'non-evm',
		tags: ['sui', 'move', 'parallel', 'l1'],
		chains: ['Sui'],
		color: '#6FBCF0'
	},
	{
		id: 'sui-explorer',
		name: 'SuiScan',
		descriptionKey: 'chain-tools.non_evm.tools.sui_explorer.description',
		url: 'https://suiscan.xyz',
		icon: Search,
		category: 'non-evm',
		tags: ['sui', 'explorer', 'transactions', 'objects'],
		chains: ['Sui'],
		color: '#6FBCF0'
	},
	{
		id: 'sui-wallet',
		name: 'Sui Wallet',
		descriptionKey: 'chain-tools.non_evm.tools.sui_wallet.description',
		url: 'https://suiwallet.com',
		icon: Wallet,
		category: 'non-evm',
		tags: ['sui', 'wallet', 'browser', 'official'],
		chains: ['Sui'],
		color: '#6FBCF0'
	},
	{
		id: 'turbos-finance',
		name: 'Turbos Finance',
		descriptionKey: 'chain-tools.non_evm.tools.turbos_finance.description',
		url: 'https://turbos.finance',
		icon: TrendingUp,
		category: 'non-evm',
		tags: ['sui', 'dex', 'clmm', 'defi'],
		chains: ['Sui'],
		color: '#00D9E9'
	},
	{
		id: 'cetus-protocol',
		name: 'Cetus Protocol',
		descriptionKey: 'chain-tools.non_evm.tools.cetus_protocol.description',
		url: 'https://cetus.zone',
		icon: Coins,
		category: 'non-evm',
		tags: ['sui', 'aptos', 'dex', 'liquidity'],
		chains: ['Sui', 'Aptos'],
		color: '#3DBBF5'
	},
	{
		id: 'aptos-network',
		name: 'Aptos',
		descriptionKey: 'chain-tools.non_evm.tools.aptos_network.description',
		url: 'https://aptos.dev',
		icon: Globe,
		category: 'non-evm',
		tags: ['aptos', 'move', 'l1', 'parallel'],
		chains: ['Aptos'],
		color: '#06CEB4'
	},
	{
		id: 'aptos-explorer',
		name: 'Aptos Explorer',
		descriptionKey: 'chain-tools.non_evm.tools.aptos_explorer.description',
		url: 'https://explorer.aptoslabs.com',
		icon: Search,
		category: 'non-evm',
		tags: ['aptos', 'explorer', 'transactions', 'modules'],
		chains: ['Aptos'],
		color: '#06CEB4'
	},
	{
		id: 'petra-wallet',
		name: 'Petra Wallet',
		descriptionKey: 'chain-tools.non_evm.tools.petra_wallet.description',
		url: 'https://petra.app',
		icon: Wallet,
		category: 'non-evm',
		tags: ['aptos', 'wallet', 'browser', 'official'],
		chains: ['Aptos'],
		color: '#FF5A5F'
	},
	{
		id: 'pontem-wallet',
		name: 'Pontem Wallet',
		descriptionKey: 'chain-tools.non_evm.tools.pontem_wallet.description',
		url: 'https://pontem.network',
		icon: Wallet,
		category: 'non-evm',
		tags: ['aptos', 'sui', 'wallet', 'move'],
		chains: ['Aptos', 'Sui'],
		color: '#8B5CF6'
	},
	{
		id: 'liquidswap',
		name: 'LiquidSwap',
		descriptionKey: 'chain-tools.non_evm.tools.liquidswap.description',
		url: 'https://liquidswap.com',
		icon: TrendingUp,
		category: 'non-evm',
		tags: ['aptos', 'dex', 'amm', 'defi'],
		chains: ['Aptos'],
		color: '#8B5CF6'
	},
	// ========== TON Ecosystem ==========
	{
		id: 'ton-network',
		name: 'TON (The Open Network)',
		descriptionKey: 'chain-tools.non_evm.tools.ton_network.description',
		url: 'https://ton.org',
		icon: Globe,
		category: 'non-evm',
		tags: ['ton', 'telegram', 'l1', 'sharding'],
		chains: ['TON'],
		color: '#0098EA'
	},
	{
		id: 'tonscan',
		name: 'Tonscan',
		descriptionKey: 'chain-tools.non_evm.tools.tonscan.description',
		url: 'https://tonscan.org',
		icon: Search,
		category: 'non-evm',
		tags: ['ton', 'explorer', 'transactions', 'jettons'],
		chains: ['TON'],
		color: '#0098EA'
	},
	{
		id: 'tonkeeper',
		name: 'Tonkeeper',
		descriptionKey: 'chain-tools.non_evm.tools.tonkeeper.description',
		url: 'https://tonkeeper.com',
		icon: Wallet,
		category: 'non-evm',
		tags: ['ton', 'wallet', 'mobile', 'browser'],
		chains: ['TON'],
		color: '#0098EA'
	},
	{
		id: 'ston-fi',
		name: 'STON.fi',
		descriptionKey: 'chain-tools.non_evm.tools.ston_fi.description',
		url: 'https://ston.fi',
		icon: TrendingUp,
		category: 'non-evm',
		tags: ['ton', 'dex', 'amm', 'defi'],
		chains: ['TON'],
		color: '#2AA8E0'
	},
	{
		id: 'dedust',
		name: 'DeDust',
		descriptionKey: 'chain-tools.non_evm.tools.dedust.description',
		url: 'https://dedust.io',
		icon: Coins,
		category: 'non-evm',
		tags: ['ton', 'dex', 'trade', 'defi'],
		chains: ['TON'],
		color: '#000000'
	},
	// ========== Other Alt L1s ==========
	{
		id: 'near-protocol',
		name: 'NEAR Protocol',
		descriptionKey: 'chain-tools.non_evm.tools.near_protocol.description',
		url: 'https://near.org',
		icon: Globe,
		category: 'non-evm',
		tags: ['near', 'sharding', 'l1', 'rust'],
		chains: ['NEAR'],
		color: '#00C08B'
	},
	{
		id: 'near-explorer',
		name: 'NEAR Explorer',
		descriptionKey: 'chain-tools.non_evm.tools.near_explorer.description',
		url: 'https://nearblocks.io',
		icon: Search,
		category: 'non-evm',
		tags: ['near', 'explorer', 'transactions', 'accounts'],
		chains: ['NEAR'],
		color: '#00C08B'
	},
	{
		id: 'ref-finance',
		name: 'Ref Finance',
		descriptionKey: 'chain-tools.non_evm.tools.ref_finance.description',
		url: 'https://ref.finance',
		icon: TrendingUp,
		category: 'non-evm',
		tags: ['near', 'dex', 'amm', 'defi'],
		chains: ['NEAR'],
		color: '#00C6A2'
	},
	{
		id: 'algorand',
		name: 'Algorand',
		descriptionKey: 'chain-tools.non_evm.tools.algorand.description',
		url: 'https://algorand.com',
		icon: Shield,
		category: 'non-evm',
		tags: ['algorand', 'ppos', 'l1', 'carbon-negative'],
		chains: ['Algorand'],
		color: '#000000'
	},
	{
		id: 'cardano',
		name: 'Cardano',
		descriptionKey: 'chain-tools.non_evm.tools.cardano.description',
		url: 'https://cardano.org',
		icon: Globe,
		category: 'non-evm',
		tags: ['cardano', 'utxo', 'pos', 'academic'],
		chains: ['Cardano'],
		color: '#0033AD'
	},
	{
		id: 'polkadot',
		name: 'Polkadot',
		descriptionKey: 'chain-tools.non_evm.tools.polkadot.description',
		url: 'https://polkadot.network',
		icon: Network,
		category: 'non-evm',
		tags: ['polkadot', 'parachains', 'interoperability', 'substrate'],
		chains: ['Polkadot'],
		color: '#E6007A'
	},
	{
		id: 'subscan',
		name: 'Subscan',
		descriptionKey: 'chain-tools.non_evm.tools.subscan.description',
		url: 'https://subscan.io',
		icon: Search,
		category: 'non-evm',
		tags: ['polkadot', 'kusama', 'explorer', 'substrate'],
		chains: ['Polkadot', 'Kusama'],
		color: '#5C5C5C'
	},
	{
		id: 'tezos',
		name: 'Tezos',
		descriptionKey: 'chain-tools.non_evm.tools.tezos.description',
		url: 'https://tezos.com',
		icon: Code,
		category: 'non-evm',
		tags: ['tezos', 'self-amending', 'lpos', 'formal-verification'],
		chains: ['Tezos'],
		color: '#2C7DF7'
	},
	// ========== Bitcoin L2s & Sidechains ==========
	{
		id: 'stacks',
		name: 'Stacks',
		descriptionKey: 'chain-tools.non_evm.tools.stacks.description',
		url: 'https://stacks.co',
		icon: Layers,
		category: 'non-evm',
		tags: ['bitcoin', 'l2', 'smart-contracts', 'stx'],
		chains: ['Stacks'],
		color: '#5546FF'
	},
	{
		id: 'lightning-network',
		name: 'Lightning Network',
		descriptionKey: 'chain-tools.non_evm.tools.lightning_network.description',
		url: 'https://lightning.network',
		icon: Zap,
		category: 'non-evm',
		tags: ['bitcoin', 'l2', 'payments', 'scaling'],
		chains: ['Bitcoin'],
		color: '#F7931A'
	},
	{
		id: 'rsk-rootstock',
		name: 'Rootstock (RSK)',
		descriptionKey: 'chain-tools.non_evm.tools.rsk_rootstock.description',
		url: 'https://rootstock.io',
		icon: ArrowLeftRight,
		category: 'non-evm',
		tags: ['bitcoin', 'sidechain', 'smart-contracts', 'merge-mining'],
		chains: ['RSK'],
		color: '#00B520'
	},
	// ========== Cross-chain Infrastructure ==========
	{
		id: 'ibc-protocol',
		name: 'IBC Protocol',
		descriptionKey: 'chain-tools.non_evm.tools.ibc_protocol.description',
		url: 'https://ibcprotocol.dev',
		icon: Network,
		category: 'non-evm',
		tags: ['ibc', 'interchain', 'cosmos', 'cross-chain'],
		color: '#2E3148'
	},
	{
		id: 'wormhole-bridge',
		name: 'Wormhole',
		descriptionKey: 'chain-tools.non_evm.tools.wormhole_bridge.description',
		url: 'https://wormhole.com',
		icon: ArrowLeftRight,
		category: 'non-evm',
		tags: ['bridge', 'cross-chain', 'messaging', 'multi-chain'],
		color: '#0CC5B6'
	},
	{
		id: 'layerzero',
		name: 'LayerZero',
		descriptionKey: 'chain-tools.non_evm.tools.layerzero.description',
		url: 'https://layerzero.network',
		icon: Layers,
		category: 'non-evm',
		tags: ['cross-chain', 'messaging', 'omnichain', 'interoperability'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'axelar-network',
		name: 'Axelar',
		descriptionKey: 'chain-tools.non_evm.tools.axelar_network.description',
		url: 'https://axelar.network',
		icon: Network,
		category: 'non-evm',
		tags: ['cross-chain', 'cosmos', 'messaging', 'gmp'],
		color: '#00FFCC'
	}
];

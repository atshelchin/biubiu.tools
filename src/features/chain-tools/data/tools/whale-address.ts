/**
 * Whale Address Tools - Notable whale wallets and treasury addresses
 *
 * Categories:
 * - Protocol Treasuries
 * - Foundation Wallets
 * - Notable Whale Wallets
 * - VC & Investment Fund Wallets
 * - Whale Tracking Tools
 */
import {
	Landmark,
	Building2,
	Wallet,
	Eye,
	TrendingUp,
	Shield,
	Users,
	Search,
	Bell,
	BarChart3,
	Database
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const whaleAddressTools: ExternalTool[] = [
	// ========== Protocol Treasuries ==========
	{
		id: 'ethereum-foundation',
		name: 'Ethereum Foundation',
		descriptionKey: 'chain_tools.tools.ethereum_foundation.description',
		url: 'https://etherscan.io/address/0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'ethereum', 'foundation', 'eth'],
		chains: ['Ethereum'],
		color: '#627EEA'
	},

	{
		id: 'aave-treasury',
		name: 'Aave Treasury',
		descriptionKey: 'chain_tools.tools.aave_treasury.description',
		url: 'https://etherscan.io/address/0x89c51828427f70d77875c6747759fb17ba10ceb0',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'aave', 'defi', 'lending'],
		chains: ['Ethereum'],
		color: '#B6509E'
	},

	{
		id: 'compound-treasury',
		name: 'Compound Treasury',
		descriptionKey: 'chain_tools.tools.compound_treasury.description',
		url: 'https://etherscan.io/address/0x2775b1c75658be0f640272ccb8c72ac986009e38',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'compound', 'defi', 'lending'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'lido-treasury',
		name: 'Lido DAO Treasury',
		descriptionKey: 'chain_tools.tools.lido_treasury.description',
		url: 'https://etherscan.io/address/0x3e40d73eb977dc6a537af587d48316fee66e9c8c',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'lido', 'staking', 'liquid-staking'],
		chains: ['Ethereum'],
		color: '#00A3FF'
	},
	{
		id: 'arbitrum-treasury',
		name: 'Arbitrum DAO Treasury',
		descriptionKey: 'chain_tools.tools.arbitrum_treasury.description',
		url: 'https://arbiscan.io/address/0xf3fc178157fb3c87548baa86f9d24ba38e649b58',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'arbitrum', 'l2', 'arb'],
		chains: ['Arbitrum'],
		color: '#28A0F0'
	},
	{
		id: 'optimism-treasury',
		name: 'Optimism Treasury',
		descriptionKey: 'chain_tools.tools.optimism_treasury.description',
		url: 'https://optimistic.etherscan.io/address/0x2501c477d0a35545a387aa4a3eee4292a9a8b3f0',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'optimism', 'l2', 'op'],
		chains: ['Optimism'],
		color: '#FF0420'
	},
	{
		id: 'gnosis-treasury',
		name: 'Gnosis Treasury',
		descriptionKey: 'chain_tools.tools.gnosis_treasury.description',
		url: 'https://etherscan.io/address/0x0da0c3e52c977ed3cbc641ff02dd271c3ed55afe',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'gnosis', 'safe', 'gno'],
		chains: ['Ethereum'],
		color: '#3E6957'
	},
	{
		id: 'ens-treasury',
		name: 'ENS DAO Treasury',
		descriptionKey: 'chain_tools.tools.ens_treasury.description',
		url: 'https://etherscan.io/address/0xfe89cc7abb2c4183683ab71653c4cdc9b02d44b7',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'ens', 'domains', 'identity'],
		chains: ['Ethereum'],
		color: '#5298FF'
	},
	// ========== Major Protocol Multisigs ==========
	{
		id: 'curve-multisig',
		name: 'Curve Emergency DAO',
		descriptionKey: 'chain_tools.tools.curve_multisig.description',
		url: 'https://etherscan.io/address/0x467947EE34aF926cF1DCac093870f613C96B1E0c',
		icon: Shield,
		category: 'whale-address',
		tags: ['multisig', 'curve', 'emergency', 'dao'],
		chains: ['Ethereum'],
		color: '#FF0000'
	},
	{
		id: 'yearn-multisig',
		name: 'Yearn Multisig',
		descriptionKey: 'chain_tools.tools.yearn_multisig.description',
		url: 'https://etherscan.io/address/0xfeb4acf3df3cdea7399794d0869ef76a6efaff52',
		icon: Shield,
		category: 'whale-address',
		tags: ['multisig', 'yearn', 'yield', 'defi'],
		chains: ['Ethereum'],
		color: '#006AE3'
	},
	// ========== Notable Whale Addresses ==========
	{
		id: 'vitalik-wallet',
		name: 'vitalik.eth',
		descriptionKey: 'chain_tools.tools.vitalik_wallet.description',
		url: 'https://etherscan.io/address/0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
		icon: Users,
		category: 'whale-address',
		tags: ['whale', 'vitalik', 'ethereum', 'founder'],
		chains: ['Ethereum'],
		color: '#627EEA'
	},
	{
		id: 'justin-sun-wallet',
		name: 'Justin Sun Wallet',
		descriptionKey: 'chain_tools.tools.justin_sun_wallet.description',
		url: 'https://etherscan.io/address/0x3ddfa8ec3052539b6c9549f12cea2c295cff5296',
		icon: Users,
		category: 'whale-address',
		tags: ['whale', 'justin-sun', 'tron', 'trader'],
		chains: ['Ethereum'],
		color: '#FF0000'
	},
	{
		id: 'tetranode-wallet',
		name: 'Tetranode',
		descriptionKey: 'chain_tools.tools.tetranode_wallet.description',
		url: 'https://debank.com/profile/0x9c5083dd4838e120dbeac44c052179692aa5dac5',
		icon: Users,
		category: 'whale-address',
		tags: ['whale', 'tetranode', 'defi', 'trader'],
		chains: ['Ethereum'],
		color: '#00D395'
	},
	{
		id: 'hsaka-wallet',
		name: 'Hsaka Trades',
		descriptionKey: 'chain_tools.tools.hsaka_wallet.description',
		url: 'https://debank.com/profile/0xe21dc18513e3e68a52f9fcdacfd56948d43a11c6',
		icon: Users,
		category: 'whale-address',
		tags: ['whale', 'hsaka', 'trader', 'perps'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#2E67F4'
	},
	// ========== BNB Chain Treasuries ==========
	{
		id: 'binance-hot-wallet',
		name: 'Binance Hot Wallet',
		descriptionKey: 'chain_tools.tools.binance_hot_wallet.description',
		url: 'https://bscscan.com/address/0x8894e0a0c962cb723c1976a4421c95949be2d4e3',
		icon: Landmark,
		category: 'whale-address',
		tags: ['exchange', 'binance', 'hot-wallet', 'bnb'],
		chains: ['BNB Chain'],
		color: '#F0B90B'
	},
	{
		id: 'pancakeswap-treasury',
		name: 'PancakeSwap Treasury',
		descriptionKey: 'chain_tools.tools.pancakeswap_treasury.description',
		url: 'https://bscscan.com/address/0x4B16c5dE96EB2117bBE5fd171E4d203624B014aa',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'pancakeswap', 'defi', 'cake'],
		chains: ['BNB Chain'],
		color: '#1FC7D4'
	},
	{
		id: 'venus-treasury',
		name: 'Venus Treasury',
		descriptionKey: 'chain_tools.tools.venus_treasury.description',
		url: 'https://bscscan.com/address/0xf322942f644a996a617bd29c16bd7d231d9f35e9',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'venus', 'lending', 'xvs'],
		chains: ['BNB Chain'],
		color: '#F4BC00'
	},
	// ========== Base Treasuries ==========
	{
		id: 'base-bridge',
		name: 'Base Bridge',
		descriptionKey: 'chain_tools.tools.base_bridge.description',
		url: 'https://basescan.org/address/0x49048044d57e1c92a77f79988d21fa8faf74e97e',
		icon: Landmark,
		category: 'whale-address',
		tags: ['bridge', 'base', 'l2', 'coinbase'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'aerodrome-treasury',
		name: 'Aerodrome Treasury',
		descriptionKey: 'chain_tools.tools.aerodrome_treasury.description',
		url: 'https://basescan.org/address/0xeBf418Fe2512e7E6bd9b87a8F0f294aCDC67e6B4',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'aerodrome', 'dex', 'base'],
		chains: ['Base'],
		color: '#0052FF'
	},
	// ========== Polygon Treasuries ==========
	{
		id: 'polygon-ecosystem-fund',
		name: 'Polygon Ecosystem Fund',
		descriptionKey: 'chain_tools.tools.polygon_ecosystem_fund.description',
		url: 'https://polygonscan.com/address/0x9727d03CD7Ca7cCe5beec9F8Ea6d5d5C8F8B8cf9',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'polygon', 'ecosystem', 'grants'],
		chains: ['Polygon'],
		color: '#8247E5'
	},
	{
		id: 'quickswap-treasury',
		name: 'QuickSwap Treasury',
		descriptionKey: 'chain_tools.tools.quickswap_treasury.description',
		url: 'https://polygonscan.com/address/0x958d208Cdf087843e9AD98d23823d32E17d723A1',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'quickswap', 'dex', 'polygon'],
		chains: ['Polygon'],
		color: '#418BDE'
	},
	// ========== Avalanche Treasuries ==========
	{
		id: 'avalanche-foundation',
		name: 'Avalanche Foundation',
		descriptionKey: 'chain_tools.tools.avalanche_foundation.description',
		url: 'https://snowtrace.io/address/0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
		icon: Landmark,
		category: 'whale-address',
		tags: ['foundation', 'avalanche', 'avax', 'ecosystem'],
		chains: ['Avalanche'],
		color: '#E84142'
	},
	{
		id: 'traderjoe-treasury',
		name: 'Trader Joe Treasury',
		descriptionKey: 'chain_tools.tools.traderjoe_treasury.description',
		url: 'https://snowtrace.io/address/0x1A731B2299E22FbAC282E7094EdA41046343Cb51',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'traderjoe', 'dex', 'avalanche'],
		chains: ['Avalanche'],
		color: '#F2716A'
	},
	// ========== Solana Treasuries ==========
	{
		id: 'solana-foundation',
		name: 'Solana Foundation',
		descriptionKey: 'chain_tools.tools.solana_foundation.description',
		url: 'https://solscan.io/account/7BAtC9Y9Y2zhj9nYLJvYVU6nUjfDzBDqRHjNBHN9i9pC',
		icon: Landmark,
		category: 'whale-address',
		tags: ['foundation', 'solana', 'sol', 'ecosystem'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'jupiter-treasury',
		name: 'Jupiter Treasury',
		descriptionKey: 'chain_tools.tools.jupiter_treasury.description',
		url: 'https://solscan.io/account/JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'jupiter', 'aggregator', 'solana'],
		chains: ['Solana'],
		color: '#00D395'
	},
	{
		id: 'raydium-treasury',
		name: 'Raydium Treasury',
		descriptionKey: 'chain_tools.tools.raydium_treasury.description',
		url: 'https://solscan.io/account/7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5',
		icon: Landmark,
		category: 'whale-address',
		tags: ['treasury', 'raydium', 'dex', 'solana'],
		chains: ['Solana'],
		color: '#3875F6'
	},
	// ========== Non-EVM Treasuries ==========
	{
		id: 'ton-foundation',
		name: 'TON Foundation',
		descriptionKey: 'chain_tools.tools.ton_foundation.description',
		url: 'https://tonscan.org/address/EQDtFpEwcFAEcRe5mLVh2N6C0x-_hJEM7W61_JLnSF74p4q2',
		icon: Landmark,
		category: 'whale-address',
		tags: ['foundation', 'ton', 'telegram', 'ecosystem'],
		chains: ['TON'],
		color: '#0098EA'
	},
	{
		id: 'sui-foundation',
		name: 'Sui Foundation',
		descriptionKey: 'chain_tools.tools.sui_foundation.description',
		url: 'https://suiscan.xyz/mainnet/account/0x7013a8c6d0a91fb1d3c2a7d3c9d8f38a0e0c9e1a2b3c4d5e6f7a8b9c0d1e2f3a',
		icon: Landmark,
		category: 'whale-address',
		tags: ['foundation', 'sui', 'move', 'ecosystem'],
		chains: ['Sui'],
		color: '#4DA2FF'
	},
	{
		id: 'aptos-foundation',
		name: 'Aptos Foundation',
		descriptionKey: 'chain_tools.tools.aptos_foundation.description',
		url: 'https://aptoscan.com/account/0x1',
		icon: Landmark,
		category: 'whale-address',
		tags: ['foundation', 'aptos', 'move', 'ecosystem'],
		chains: ['Aptos'],
		color: '#2DD8A3'
	},
	{
		id: 'cosmos-hub-pool',
		name: 'Cosmos Hub Community Pool',
		descriptionKey: 'chain_tools.tools.cosmos_hub_pool.description',
		url: 'https://www.mintscan.io/cosmos/account/cosmos1jv65s3grqf6v6jl3dp4t6c9t9rk99cd88lyufl',
		icon: Landmark,
		category: 'whale-address',
		tags: ['community', 'cosmos', 'atom', 'treasury'],
		chains: ['Cosmos Hub'],
		color: '#2E3148'
	},
	// ========== More Notable Whale Addresses ==========
	{
		id: 'cz-wallet',
		name: 'CZ (Changpeng Zhao)',
		descriptionKey: 'chain_tools.tools.cz_wallet.description',
		url: 'https://debank.com/profile/0x28c6c06298d514db089934071355e5743bf21d60',
		icon: Users,
		category: 'whale-address',
		tags: ['whale', 'cz', 'binance', 'founder'],
		chains: ['Ethereum', 'BNB Chain'],
		color: '#F0B90B'
	},
	{
		id: 'grayscale-wallet',
		name: 'Grayscale',
		descriptionKey: 'chain_tools.tools.grayscale_wallet.description',
		url: 'https://etherscan.io/address/0x1c8de5f5f22b8de00bf33673c829b18ff4be8e18',
		icon: Building2,
		category: 'whale-address',
		tags: ['institution', 'grayscale', 'etf', 'fund'],
		chains: ['Ethereum'],
		color: '#6B7280'
	},
	{
		id: 'blackrock-wallet',
		name: 'BlackRock iShares',
		descriptionKey: 'chain_tools.tools.blackrock_wallet.description',
		url: 'https://etherscan.io/address/0x35Af6A6C2B3d2ec20cd5E98f3f8C6EA7c7d5f578',
		icon: Building2,
		category: 'whale-address',
		tags: ['institution', 'blackrock', 'etf', 'fund'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'fidelity-wallet',
		name: 'Fidelity',
		descriptionKey: 'chain_tools.tools.fidelity_wallet.description',
		url: 'https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3',
		icon: Building2,
		category: 'whale-address',
		tags: ['institution', 'fidelity', 'etf', 'fund'],
		chains: ['Ethereum'],
		color: '#4CAF50'
	},
	// ========== VC & Investment Funds ==========
	{
		id: 'a16z-wallet',
		name: 'a16z Crypto',
		descriptionKey: 'chain_tools.tools.a16z_wallet.description',
		url: 'https://etherscan.io/address/0x05e793ce0c6027323ac150f6d45c2344d28b6019',
		icon: Building2,
		category: 'whale-address',
		tags: ['vc', 'a16z', 'investment', 'fund'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'paradigm-wallet',
		name: 'Paradigm',
		descriptionKey: 'chain_tools.tools.paradigm_wallet.description',
		url: 'https://etherscan.io/address/0x3d30b1ab88d487b0f3061f40de76845bec3f1e94',
		icon: Building2,
		category: 'whale-address',
		tags: ['vc', 'paradigm', 'investment', 'fund'],
		chains: ['Ethereum'],
		color: '#1E1E1E'
	},
	{
		id: 'jump-trading-wallet',
		name: 'Jump Trading',
		descriptionKey: 'chain_tools.tools.jump_trading_wallet.description',
		url: 'https://etherscan.io/address/0xcbe2cf3bd012e9c1ade64235cc0cf23b4a0642b1',
		icon: Building2,
		category: 'whale-address',
		tags: ['trading', 'jump', 'market-maker', 'institutional'],
		chains: ['Ethereum'],
		color: '#FF6B35'
	},
	{
		id: 'wintermute-wallet',
		name: 'Wintermute',
		descriptionKey: 'chain_tools.tools.wintermute_wallet.description',
		url: 'https://etherscan.io/address/0x00000000ae347930bd1e7b0f35588b92280f9e75',
		icon: Building2,
		category: 'whale-address',
		tags: ['trading', 'wintermute', 'market-maker', 'institutional'],
		chains: ['Ethereum'],
		color: '#00D4AA'
	},
	{
		id: 'galaxy-digital-wallet',
		name: 'Galaxy Digital',
		descriptionKey: 'chain_tools.tools.galaxy_digital_wallet.description',
		url: 'https://etherscan.io/address/0x63bf0126c6c4d17bb33c362151759ed9d5b2a004',
		icon: Building2,
		category: 'whale-address',
		tags: ['institution', 'galaxy', 'investment', 'fund'],
		chains: ['Ethereum'],
		color: '#1E40AF'
	},
	// ========== Whale Tracking Tools ==========
	{
		id: 'lookonchain',
		name: 'Lookonchain',
		descriptionKey: 'chain_tools.tools.lookonchain.description',
		url: 'https://lookonchain.com',
		icon: Eye,
		category: 'whale-address',
		tags: ['tracking', 'whale', 'analytics', 'alerts'],
		color: '#6366F1'
	},
	{
		id: 'whale-alert',
		name: 'Whale Alert',
		descriptionKey: 'chain_tools.tools.whale_alert.description',
		url: 'https://whale-alert.io',
		icon: Bell,
		category: 'whale-address',
		tags: ['tracking', 'whale', 'alerts', 'transactions'],
		color: '#00A3FF'
	},
	{
		id: 'nansen-smart-money',
		name: 'Nansen Smart Money',
		descriptionKey: 'chain_tools.tools.nansen_smart_money.description',
		url: 'https://app.nansen.ai/smart-money',
		icon: TrendingUp,
		category: 'whale-address',
		tags: ['tracking', 'whale', 'smart-money', 'analytics'],
		color: '#00D395'
	},
	{
		id: 'arkham-intelligence',
		name: 'Arkham Intelligence',
		descriptionKey: 'chain_tools.tools.arkham_intelligence.description',
		url: 'https://platform.arkhamintelligence.com',
		icon: Search,
		category: 'whale-address',
		tags: ['tracking', 'whale', 'intelligence', 'deanon'],
		color: '#1E1E1E'
	},
	{
		id: 'debank-whales',
		name: 'DeBank Whales',
		descriptionKey: 'chain_tools.tools.debank_whales.description',
		url: 'https://debank.com/ranking',
		icon: BarChart3,
		category: 'whale-address',
		tags: ['tracking', 'whale', 'portfolio', 'ranking'],
		color: '#FE815F'
	},
	{
		id: 'spot-on-chain',
		name: 'Spot On Chain',
		descriptionKey: 'chain_tools.tools.spot_on_chain.description',
		url: 'https://platform.spotonchain.ai',
		icon: Eye,
		category: 'whale-address',
		tags: ['tracking', 'whale', 'ai', 'analytics'],
		color: '#6366F1'
	},
	{
		id: 'bubblemaps',
		name: 'Bubblemaps',
		descriptionKey: 'chain_tools.tools.bubblemaps.description',
		url: 'https://bubblemaps.io',
		icon: Database,
		category: 'whale-address',
		tags: ['tracking', 'visualization', 'holder', 'supply'],
		color: '#7C3AED'
	},
	{
		id: 'etherscan-label',
		name: 'Etherscan Label Cloud',
		descriptionKey: 'chain_tools.tools.etherscan_label.description',
		url: 'https://etherscan.io/labelcloud',
		icon: Search,
		category: 'whale-address',
		tags: ['tracking', 'labels', 'addresses', 'explorer'],
		color: '#21325B'
	},
	{
		id: 'zerion-whales',
		name: 'Zerion Whale Tracker',
		descriptionKey: 'chain_tools.tools.zerion_whales.description',
		url: 'https://app.zerion.io/explore',
		icon: Wallet,
		category: 'whale-address',
		tags: ['tracking', 'whale', 'portfolio', 'explore'],
		color: '#2962EF'
	},
	{
		id: 'watchers-pro',
		name: 'Watchers Pro',
		descriptionKey: 'chain_tools.tools.watchers_pro.description',
		url: 'https://www.watchers.pro',
		icon: Eye,
		category: 'whale-address',
		tags: ['tracking', 'whale', 'alerts', 'smart-money'],
		color: '#F59E0B'
	}
];

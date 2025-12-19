import {
	Layers,
	BarChart3,
	Shield,
	ArrowLeftRight,
	Wallet,
	Search,
	Code,
	Vote,
	Image,
	TrendingUp,
	Database,
	Lock,
	Zap,
	Globe,
	FileCode,
	Terminal,
	Coins,
	Eye,
	RefreshCw,
	Link2,
	Activity,
	PieChart,
	Landmark,
	Repeat,
	SendHorizontal,
	ScanSearch,
	Rocket,
	KeyRound,
	Sparkles,
	Droplets,
	CircleDollarSign,
	Gem,
	Banknote,
	LineChart,
	ScrollText,
	FileSearch,
	Cpu,
	Bug,
	Braces,
	Users,
	Building2,
	Flame,
	Target,
	Gauge,
	GitBranch,
	Box,
	Hexagon,
	CircuitBoard,
	Scan,
	Radio,
	Hash,
	BookOpen,
	Settings,
	Percent,
	DollarSign,
	Scale,
	FileText,
	MessageSquare,
	Bell,
	Megaphone,
	Award
} from '@lucide/svelte';
import type { Category, ExternalTool, CategoryId } from '../types';

/**
 * Category definitions with i18n keys and colors
 */
export const categories: Category[] = [
	{ id: 'all', labelKey: 'chain_tools.categories.all', color: '#6B7280', icon: Layers },
	{ id: 'defi', labelKey: 'chain_tools.categories.defi', color: '#10B981', icon: TrendingUp },
	{ id: 'nft', labelKey: 'chain_tools.categories.nft', color: '#EC4899', icon: Image },
	{
		id: 'analytics',
		labelKey: 'chain_tools.categories.analytics',
		color: '#3B82F6',
		icon: BarChart3
	},
	{ id: 'security', labelKey: 'chain_tools.categories.security', color: '#EF4444', icon: Shield },
	{
		id: 'bridge',
		labelKey: 'chain_tools.categories.bridge',
		color: '#8B5CF6',
		icon: ArrowLeftRight
	},
	{ id: 'wallet', labelKey: 'chain_tools.categories.wallet', color: '#F59E0B', icon: Wallet },
	{ id: 'explorer', labelKey: 'chain_tools.categories.explorer', color: '#06B6D4', icon: Search },
	{ id: 'dev', labelKey: 'chain_tools.categories.dev', color: '#6366F1', icon: Code },
	{ id: 'dao', labelKey: 'chain_tools.categories.dao', color: '#A855F7', icon: Vote }
];

/**
 * Get category by ID
 */
export function getCategoryById(id: CategoryId): Category | undefined {
	return categories.find((c) => c.id === id);
}

/**
 * External tools data
 */
export const toolsData: ExternalTool[] = [
	// DeFi
	{
		id: 'uniswap',
		name: 'Uniswap',
		descriptionKey: 'chain_tools.tools.uniswap.description',
		url: 'https://app.uniswap.org',
		icon: Repeat,
		category: 'defi',
		tags: ['swap', 'dex', 'amm', 'liquidity'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#FF007A'
	},
	{
		id: 'aave',
		name: 'Aave',
		descriptionKey: 'chain_tools.tools.aave.description',
		url: 'https://app.aave.com',
		icon: Landmark,
		category: 'defi',
		tags: ['lending', 'borrowing', 'defi', 'yield'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Avalanche'],
		color: '#B6509E'
	},
	{
		id: '1inch',
		name: '1inch',
		descriptionKey: 'chain_tools.tools.1inch.description',
		url: 'https://app.1inch.io',
		icon: Zap,
		category: 'defi',
		tags: ['aggregator', 'swap', 'dex', 'best-price'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#1B314F'
	},
	{
		id: 'curve',
		name: 'Curve',
		descriptionKey: 'chain_tools.tools.curve.description',
		url: 'https://curve.fi',
		icon: Activity,
		category: 'defi',
		tags: ['stablecoin', 'swap', 'amm', 'yield'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#FF0000'
	},

	// Analytics
	{
		id: 'dune',
		name: 'Dune Analytics',
		descriptionKey: 'chain_tools.tools.dune.description',
		url: 'https://dune.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'data', 'sql', 'dashboard', 'visualization'],
		color: '#F0603A'
	},
	{
		id: 'defillama',
		name: 'DefiLlama',
		descriptionKey: 'chain_tools.tools.defillama.description',
		url: 'https://defillama.com',
		icon: PieChart,
		category: 'analytics',
		tags: ['tvl', 'defi', 'analytics', 'protocols'],
		color: '#2775CA'
	},
	{
		id: 'nansen',
		name: 'Nansen',
		descriptionKey: 'chain_tools.tools.nansen.description',
		url: 'https://www.nansen.ai',
		icon: Eye,
		category: 'analytics',
		tags: ['wallet', 'analytics', 'smart-money', 'labels'],
		color: '#3861FB'
	},
	{
		id: 'arkham',
		name: 'Arkham Intelligence',
		descriptionKey: 'chain_tools.tools.arkham.description',
		url: 'https://platform.arkhamintelligence.com',
		icon: Database,
		category: 'analytics',
		tags: ['wallet', 'tracking', 'intelligence', 'labels'],
		color: '#000000'
	},

	// Security
	{
		id: 'revoke',
		name: 'Revoke.cash',
		descriptionKey: 'chain_tools.tools.revoke.description',
		url: 'https://revoke.cash',
		icon: Shield,
		category: 'security',
		tags: ['approvals', 'revoke', 'security', 'permissions'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'],
		color: '#E53E3E'
	},
	{
		id: 'debank',
		name: 'DeBank',
		descriptionKey: 'chain_tools.tools.debank.description',
		url: 'https://debank.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['portfolio', 'tracker', 'defi', 'nft'],
		color: '#FE815F'
	},
	{
		id: 'pocket-universe',
		name: 'Pocket Universe',
		descriptionKey: 'chain_tools.tools.pocket_universe.description',
		url: 'https://www.pocketuniverse.app',
		icon: Lock,
		category: 'security',
		tags: ['simulation', 'security', 'extension', 'protection'],
		color: '#7C3AED'
	},

	// Bridge
	{
		id: 'across',
		name: 'Across Protocol',
		descriptionKey: 'chain_tools.tools.across.description',
		url: 'https://across.to',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'cross-chain', 'fast', 'cheap'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'Base'],
		color: '#6CF9D8'
	},
	{
		id: 'stargate',
		name: 'Stargate',
		descriptionKey: 'chain_tools.tools.stargate.description',
		url: 'https://stargate.finance',
		icon: Globe,
		category: 'bridge',
		tags: ['bridge', 'omnichain', 'layerzero'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'Polygon', 'Avalanche'],
		color: '#8B5CF6'
	},
	{
		id: 'orbiter',
		name: 'Orbiter Finance',
		descriptionKey: 'chain_tools.tools.orbiter.description',
		url: 'https://www.orbiter.finance',
		icon: RefreshCw,
		category: 'bridge',
		tags: ['bridge', 'l2', 'rollup', 'fast'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'zkSync', 'Base'],
		color: '#9D4EDD'
	},

	// Explorer
	{
		id: 'etherscan',
		name: 'Etherscan',
		descriptionKey: 'chain_tools.tools.etherscan.description',
		url: 'https://etherscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'ethereum', 'transactions', 'contracts'],
		chains: ['Ethereum'],
		color: '#21325B'
	},
	{
		id: 'blockscout',
		name: 'Blockscout',
		descriptionKey: 'chain_tools.tools.blockscout.description',
		url: 'https://www.blockscout.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'open-source', 'multi-chain'],
		color: '#5C6BC0'
	},

	// Dev Tools
	{
		id: 'tenderly',
		name: 'Tenderly',
		descriptionKey: 'chain_tools.tools.tenderly.description',
		url: 'https://tenderly.co',
		icon: Terminal,
		category: 'dev',
		tags: ['debugging', 'simulation', 'monitoring', 'devtools'],
		color: '#6366F1'
	},
	{
		id: 'chainlist',
		name: 'Chainlist',
		descriptionKey: 'chain_tools.tools.chainlist.description',
		url: 'https://chainlist.org',
		icon: Link2,
		category: 'dev',
		tags: ['rpc', 'networks', 'chains', 'add-network'],
		color: '#3B82F6'
	},
	{
		id: 'remix',
		name: 'Remix IDE',
		descriptionKey: 'chain_tools.tools.remix.description',
		url: 'https://remix.ethereum.org',
		icon: FileCode,
		category: 'dev',
		tags: ['ide', 'solidity', 'development', 'compile', 'deploy'],
		color: '#5A60FF'
	},

	// NFT
	{
		id: 'opensea',
		name: 'OpenSea',
		descriptionKey: 'chain_tools.tools.opensea.description',
		url: 'https://opensea.io',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'nft', 'trading', 'collections'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#2081E2'
	},
	{
		id: 'blur',
		name: 'Blur',
		descriptionKey: 'chain_tools.tools.blur.description',
		url: 'https://blur.io',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'nft', 'trading', 'pro-traders'],
		chains: ['Ethereum', 'Blast'],
		color: '#FF6B00'
	},
	{
		id: 'reservoir',
		name: 'Reservoir',
		descriptionKey: 'chain_tools.tools.reservoir.description',
		url: 'https://reservoir.tools',
		icon: Coins,
		category: 'nft',
		tags: ['api', 'nft', 'aggregator', 'developers'],
		color: '#8B5CF6'
	},

	// DAO
	{
		id: 'snapshot',
		name: 'Snapshot',
		descriptionKey: 'chain_tools.tools.snapshot.description',
		url: 'https://snapshot.org',
		icon: Vote,
		category: 'dao',
		tags: ['governance', 'voting', 'dao', 'gasless'],
		color: '#F3AD39'
	},
	{
		id: 'tally',
		name: 'Tally',
		descriptionKey: 'chain_tools.tools.tally.description',
		url: 'https://www.tally.xyz',
		icon: Vote,
		category: 'dao',
		tags: ['governance', 'dao', 'onchain-voting', 'proposals'],
		color: '#2D3748'
	},

	// ========== BiuBiu Tools (Internal) ==========
	// Wallet Tools
	{
		id: 'biubiu-wallet-sweep',
		name: 'Wallet Sweep',
		descriptionKey: 'chain_tools.tools.biubiu_wallet_sweep.description',
		url: '/apps/wallet-sweep',
		icon: ArrowLeftRight,
		category: 'wallet',
		tags: ['sweep', 'batch', 'transfer', 'consolidate', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#10B981'
	},
	{
		id: 'biubiu-one-to-many',
		name: 'One-to-Many Transfer',
		descriptionKey: 'chain_tools.tools.biubiu_one_to_many.description',
		url: '/apps/one-to-many-transfer',
		icon: SendHorizontal,
		category: 'wallet',
		tags: ['airdrop', 'batch', 'transfer', 'distribution', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#F59E0B'
	},
	{
		id: 'biubiu-wallet-generator',
		name: 'Wallet Generator',
		descriptionKey: 'chain_tools.tools.biubiu_wallet_generator.description',
		url: '/apps/wallet-generator',
		icon: KeyRound,
		category: 'wallet',
		tags: ['generator', 'mnemonic', 'hd-wallet', 'batch', 'biubiu'],
		color: '#8B5CF6'
	},
	{
		id: 'biubiu-balance-scanner',
		name: 'Balance Scanner',
		descriptionKey: 'chain_tools.tools.biubiu_balance_scanner.description',
		url: '/apps/token-balance-scanner',
		icon: ScanSearch,
		category: 'analytics',
		tags: ['balance', 'scanner', 'batch', 'portfolio', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#3B82F6'
	},
	// Dev Tools (BiuBiu)
	{
		id: 'biubiu-contract-deployer',
		name: 'Contract Deployer',
		descriptionKey: 'chain_tools.tools.biubiu_contract_deployer.description',
		url: '/apps/contract-deployer',
		icon: Rocket,
		category: 'dev',
		tags: ['deploy', 'create2', 'deterministic', 'smart-contract', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#F59E0B'
	},
	{
		id: 'biubiu-token-deployer',
		name: 'Token Deployer',
		descriptionKey: 'chain_tools.tools.biubiu_token_deployer.description',
		url: '/apps/token-deployer',
		icon: Sparkles,
		category: 'dev',
		tags: ['erc20', 'token', 'deploy', 'create', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#10B981'
	},
	{
		id: 'biubiu-events-scanner',
		name: 'Events Scanner',
		descriptionKey: 'chain_tools.tools.biubiu_events_scanner.description',
		url: '/apps/contract-events-scanner',
		icon: FileSearch,
		category: 'analytics',
		tags: ['events', 'logs', 'scanner', 'smart-contract', 'biubiu'],
		color: '#A855F7'
	},
	{
		id: 'biubiu-chainlist',
		name: 'Chainlist',
		descriptionKey: 'chain_tools.tools.biubiu_chainlist.description',
		url: '/apps/chainlist',
		icon: Globe,
		category: 'dev',
		tags: ['chains', 'rpc', 'networks', 'add-network', 'biubiu'],
		color: '#6366F1'
	},

	// ========== More DeFi Protocols ==========
	{
		id: 'lido',
		name: 'Lido',
		descriptionKey: 'chain_tools.tools.lido.description',
		url: 'https://lido.fi',
		icon: Droplets,
		category: 'defi',
		tags: ['staking', 'liquid-staking', 'eth', 'steth'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#00A3FF'
	},
	{
		id: 'compound',
		name: 'Compound',
		descriptionKey: 'chain_tools.tools.compound.description',
		url: 'https://compound.finance',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['lending', 'borrowing', 'defi', 'interest'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Base'],
		color: '#00D395'
	},
	{
		id: 'maker',
		name: 'MakerDAO',
		descriptionKey: 'chain_tools.tools.maker.description',
		url: 'https://makerdao.com',
		icon: Banknote,
		category: 'defi',
		tags: ['stablecoin', 'dai', 'cdp', 'lending'],
		chains: ['Ethereum'],
		color: '#1AAB9B'
	},
	{
		id: 'gmx',
		name: 'GMX',
		descriptionKey: 'chain_tools.tools.gmx.description',
		url: 'https://gmx.io',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'trading', 'derivatives', 'leverage'],
		chains: ['Arbitrum', 'Avalanche'],
		color: '#2D42FC'
	},
	{
		id: 'pancakeswap',
		name: 'PancakeSwap',
		descriptionKey: 'chain_tools.tools.pancakeswap.description',
		url: 'https://pancakeswap.finance',
		icon: Repeat,
		category: 'defi',
		tags: ['swap', 'dex', 'bsc', 'amm'],
		chains: ['BSC', 'Ethereum', 'Arbitrum', 'Base'],
		color: '#1FC7D4'
	},
	{
		id: 'sushiswap',
		name: 'SushiSwap',
		descriptionKey: 'chain_tools.tools.sushiswap.description',
		url: 'https://www.sushi.com',
		icon: Repeat,
		category: 'defi',
		tags: ['swap', 'dex', 'amm', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche'],
		color: '#FA52A0'
	},
	{
		id: 'balancer',
		name: 'Balancer',
		descriptionKey: 'chain_tools.tools.balancer.description',
		url: 'https://balancer.fi',
		icon: Activity,
		category: 'defi',
		tags: ['amm', 'pool', 'liquidity', 'weighted'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#1E1E1E'
	},
	{
		id: 'eigenlayer',
		name: 'EigenLayer',
		descriptionKey: 'chain_tools.tools.eigenlayer.description',
		url: 'https://eigenlayer.xyz',
		icon: Layers,
		category: 'defi',
		tags: ['restaking', 'avs', 'security', 'ethereum'],
		chains: ['Ethereum'],
		color: '#6C5CE7'
	},

	// ========== More NFT Tools ==========
	{
		id: 'magic-eden',
		name: 'Magic Eden',
		descriptionKey: 'chain_tools.tools.magic_eden.description',
		url: 'https://magiceden.io',
		icon: Gem,
		category: 'nft',
		tags: ['marketplace', 'nft', 'bitcoin', 'ordinals'],
		chains: ['Ethereum', 'Polygon', 'Bitcoin'],
		color: '#E42575'
	},
	{
		id: 'rarible',
		name: 'Rarible',
		descriptionKey: 'chain_tools.tools.rarible.description',
		url: 'https://rarible.com',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'nft', 'create', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'Tezos'],
		color: '#FEDA03'
	},

	// ========== More Dev Tools ==========
	{
		id: 'foundry',
		name: 'Foundry',
		descriptionKey: 'chain_tools.tools.foundry.description',
		url: 'https://getfoundry.sh',
		icon: Terminal,
		category: 'dev',
		tags: ['framework', 'testing', 'solidity', 'forge'],
		color: '#000000'
	},
	{
		id: 'hardhat',
		name: 'Hardhat',
		descriptionKey: 'chain_tools.tools.hardhat.description',
		url: 'https://hardhat.org',
		icon: Cpu,
		category: 'dev',
		tags: ['framework', 'testing', 'development', 'ethereum'],
		color: '#FFF100'
	},
	{
		id: 'slither',
		name: 'Slither',
		descriptionKey: 'chain_tools.tools.slither.description',
		url: 'https://github.com/crytic/slither',
		icon: Bug,
		category: 'security',
		tags: ['audit', 'static-analysis', 'security', 'solidity'],
		color: '#6366F1'
	},
	{
		id: 'mythx',
		name: 'MythX',
		descriptionKey: 'chain_tools.tools.mythx.description',
		url: 'https://mythx.io',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'analysis', 'smart-contract'],
		color: '#3B3B98'
	},
	{
		id: 'abi-ninja',
		name: 'ABI Ninja',
		descriptionKey: 'chain_tools.tools.abi_ninja.description',
		url: 'https://abi.ninja',
		icon: Braces,
		category: 'dev',
		tags: ['abi', 'interact', 'contracts', 'read-write'],
		color: '#10B981'
	},
	{
		id: 'ethereum-signature-db',
		name: '4byte.directory',
		descriptionKey: 'chain_tools.tools.4byte.description',
		url: 'https://www.4byte.directory',
		icon: ScrollText,
		category: 'dev',
		tags: ['signature', 'selector', 'decoder', 'lookup'],
		color: '#6B7280'
	},

	// ========== More Analytics ==========
	{
		id: 'token-terminal',
		name: 'Token Terminal',
		descriptionKey: 'chain_tools.tools.token_terminal.description',
		url: 'https://tokenterminal.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['metrics', 'revenue', 'fundamentals', 'protocols'],
		color: '#00C2FF'
	},
	{
		id: 'ultrasound',
		name: 'ultrasound.money',
		descriptionKey: 'chain_tools.tools.ultrasound.description',
		url: 'https://ultrasound.money',
		icon: Activity,
		category: 'analytics',
		tags: ['eth', 'burn', 'supply', 'issuance'],
		color: '#7C3AED'
	},

	// ========== More DAO ==========
	{
		id: 'aragon',
		name: 'Aragon',
		descriptionKey: 'chain_tools.tools.aragon.description',
		url: 'https://aragon.org',
		icon: Building2,
		category: 'dao',
		tags: ['dao', 'governance', 'create', 'framework'],
		color: '#00C2FF'
	},
	{
		id: 'colony',
		name: 'Colony',
		descriptionKey: 'chain_tools.tools.colony.description',
		url: 'https://colony.io',
		icon: Users,
		category: 'dao',
		tags: ['dao', 'organization', 'payroll', 'reputation'],
		color: '#6366F1'
	},

	// ========== More DeFi (Extended) ==========
	{
		id: 'dydx',
		name: 'dYdX',
		descriptionKey: 'chain_tools.tools.dydx.description',
		url: 'https://dydx.exchange',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'derivatives', 'trading', 'margin'],
		chains: ['dYdX Chain'],
		color: '#6966FF'
	},
	{
		id: 'convex',
		name: 'Convex Finance',
		descriptionKey: 'chain_tools.tools.convex.description',
		url: 'https://www.convexfinance.com',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'curve', 'boost', 'staking'],
		chains: ['Ethereum'],
		color: '#3A3A3A'
	},
	{
		id: 'yearn',
		name: 'Yearn Finance',
		descriptionKey: 'chain_tools.tools.yearn.description',
		url: 'https://yearn.fi',
		icon: Target,
		category: 'defi',
		tags: ['yield', 'vault', 'auto-compound', 'strategy'],
		chains: ['Ethereum', 'Fantom', 'Arbitrum'],
		color: '#006AE3'
	},
	{
		id: 'pendle',
		name: 'Pendle',
		descriptionKey: 'chain_tools.tools.pendle.description',
		url: 'https://www.pendle.finance',
		icon: Percent,
		category: 'defi',
		tags: ['yield', 'tokenization', 'pt', 'yt'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#26BFBF'
	},
	{
		id: 'radiant',
		name: 'Radiant Capital',
		descriptionKey: 'chain_tools.tools.radiant.description',
		url: 'https://radiant.capital',
		icon: Flame,
		category: 'defi',
		tags: ['lending', 'omnichain', 'layerzero'],
		chains: ['Arbitrum', 'BSC'],
		color: '#00D4FF'
	},
	{
		id: 'morpho',
		name: 'Morpho',
		descriptionKey: 'chain_tools.tools.morpho.description',
		url: 'https://morpho.org',
		icon: Hexagon,
		category: 'defi',
		tags: ['lending', 'optimized', 'p2p', 'rates'],
		chains: ['Ethereum', 'Base'],
		color: '#1F77B4'
	},
	{
		id: 'frax',
		name: 'Frax Finance',
		descriptionKey: 'chain_tools.tools.frax.description',
		url: 'https://frax.finance',
		icon: DollarSign,
		category: 'defi',
		tags: ['stablecoin', 'frax', 'algorithmic', 'lending'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'rocketpool',
		name: 'Rocket Pool',
		descriptionKey: 'chain_tools.tools.rocketpool.description',
		url: 'https://rocketpool.net',
		icon: Rocket,
		category: 'defi',
		tags: ['staking', 'eth', 'decentralized', 'node'],
		chains: ['Ethereum'],
		color: '#FF6D32'
	},
	{
		id: 'venus',
		name: 'Venus Protocol',
		descriptionKey: 'chain_tools.tools.venus.description',
		url: 'https://venus.io',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['lending', 'borrowing', 'bsc'],
		chains: ['BSC'],
		color: '#F7B52C'
	},
	{
		id: 'trader-joe',
		name: 'Trader Joe',
		descriptionKey: 'chain_tools.tools.trader_joe.description',
		url: 'https://traderjoexyz.com',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'avalanche', 'liquidity-book'],
		chains: ['Avalanche', 'Arbitrum', 'BSC'],
		color: '#F2545B'
	},
	{
		id: 'camelot',
		name: 'Camelot',
		descriptionKey: 'chain_tools.tools.camelot.description',
		url: 'https://camelot.exchange',
		icon: Award,
		category: 'defi',
		tags: ['dex', 'arbitrum', 'launchpad'],
		chains: ['Arbitrum'],
		color: '#AA8929'
	},
	{
		id: 'velodrome',
		name: 'Velodrome',
		descriptionKey: 'chain_tools.tools.velodrome.description',
		url: 'https://velodrome.finance',
		icon: Gauge,
		category: 'defi',
		tags: ['dex', 'optimism', 've-tokenomics'],
		chains: ['Optimism'],
		color: '#4C82FB'
	},
	{
		id: 'aerodrome',
		name: 'Aerodrome',
		descriptionKey: 'chain_tools.tools.aerodrome.description',
		url: 'https://aerodrome.finance',
		icon: Gauge,
		category: 'defi',
		tags: ['dex', 'base', 've-tokenomics'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'maverick',
		name: 'Maverick',
		descriptionKey: 'chain_tools.tools.maverick.description',
		url: 'https://mav.xyz',
		icon: Activity,
		category: 'defi',
		tags: ['dex', 'concentrated-liquidity', 'dynamic'],
		chains: ['Ethereum', 'zkSync', 'Base'],
		color: '#8F47FF'
	},
	{
		id: 'spark',
		name: 'Spark Protocol',
		descriptionKey: 'chain_tools.tools.spark.description',
		url: 'https://spark.fi',
		icon: Sparkles,
		category: 'defi',
		tags: ['lending', 'dai', 'makerdao', 'borrowing'],
		chains: ['Ethereum'],
		color: '#F5AC37'
	},
	{
		id: 'instadapp',
		name: 'Instadapp',
		descriptionKey: 'chain_tools.tools.instadapp.description',
		url: 'https://instadapp.io',
		icon: Box,
		category: 'defi',
		tags: ['aggregator', 'dashboard', 'smart-accounts'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#3F75FF'
	},
	{
		id: 'sommelier',
		name: 'Sommelier',
		descriptionKey: 'chain_tools.tools.sommelier.description',
		url: 'https://www.sommelier.finance',
		icon: Target,
		category: 'defi',
		tags: ['vault', 'strategy', 'yield'],
		chains: ['Ethereum'],
		color: '#8884D8'
	},

	// ========== More Bridges ==========
	{
		id: 'hop',
		name: 'Hop Protocol',
		descriptionKey: 'chain_tools.tools.hop.description',
		url: 'https://hop.exchange',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'l2', 'rollup', 'fast'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#B32EFF'
	},
	{
		id: 'synapse',
		name: 'Synapse',
		descriptionKey: 'chain_tools.tools.synapse.description',
		url: 'https://synapseprotocol.com',
		icon: RefreshCw,
		category: 'bridge',
		tags: ['bridge', 'cross-chain', 'multi-chain'],
		chains: ['Ethereum', 'Arbitrum', 'Avalanche', 'BSC'],
		color: '#FF00FF'
	},
	{
		id: 'cbridge',
		name: 'cBridge',
		descriptionKey: 'chain_tools.tools.cbridge.description',
		url: 'https://cbridge.celer.network',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'celer', 'fast', 'cheap'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum'],
		color: '#46C9E5'
	},
	{
		id: 'multichain',
		name: 'Multichain',
		descriptionKey: 'chain_tools.tools.multichain.description',
		url: 'https://multichain.org',
		icon: Globe,
		category: 'bridge',
		tags: ['bridge', 'router', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Fantom', 'Avalanche'],
		color: '#463DE3'
	},
	{
		id: 'wormhole',
		name: 'Wormhole',
		descriptionKey: 'chain_tools.tools.wormhole.description',
		url: 'https://wormhole.com',
		icon: CircuitBoard,
		category: 'bridge',
		tags: ['bridge', 'messaging', 'cross-chain'],
		chains: ['Ethereum', 'Solana', 'BSC', 'Avalanche'],
		color: '#FFFFFF'
	},
	{
		id: 'socket',
		name: 'Socket (Bungee)',
		descriptionKey: 'chain_tools.tools.socket.description',
		url: 'https://bungee.exchange',
		icon: Zap,
		category: 'bridge',
		tags: ['aggregator', 'bridge', 'best-route'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#8247E5'
	},
	{
		id: 'rhino',
		name: 'rhino.fi',
		descriptionKey: 'chain_tools.tools.rhino.description',
		url: 'https://rhino.fi',
		icon: Shield,
		category: 'bridge',
		tags: ['bridge', 'aggregator', 'self-custodial'],
		chains: ['Ethereum', 'Arbitrum', 'zkSync', 'Linea'],
		color: '#5C45FF'
	},

	// ========== More Explorers ==========
	{
		id: 'arbiscan',
		name: 'Arbiscan',
		descriptionKey: 'chain_tools.tools.arbiscan.description',
		url: 'https://arbiscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'arbitrum', 'transactions'],
		chains: ['Arbitrum'],
		color: '#213147'
	},
	{
		id: 'optimistic-scan',
		name: 'Optimistic Etherscan',
		descriptionKey: 'chain_tools.tools.optimistic_scan.description',
		url: 'https://optimistic.etherscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'optimism', 'transactions'],
		chains: ['Optimism'],
		color: '#FF0420'
	},
	{
		id: 'polygonscan',
		name: 'PolygonScan',
		descriptionKey: 'chain_tools.tools.polygonscan.description',
		url: 'https://polygonscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'polygon', 'transactions'],
		chains: ['Polygon'],
		color: '#8247E5'
	},
	{
		id: 'bscscan',
		name: 'BscScan',
		descriptionKey: 'chain_tools.tools.bscscan.description',
		url: 'https://bscscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'bsc', 'transactions'],
		chains: ['BSC'],
		color: '#F0B90B'
	},
	{
		id: 'basescan',
		name: 'BaseScan',
		descriptionKey: 'chain_tools.tools.basescan.description',
		url: 'https://basescan.org',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'base', 'transactions'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'snowtrace',
		name: 'Snowtrace',
		descriptionKey: 'chain_tools.tools.snowtrace.description',
		url: 'https://snowtrace.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'avalanche', 'transactions'],
		chains: ['Avalanche'],
		color: '#E84142'
	},
	{
		id: 'zksync-explorer',
		name: 'zkSync Explorer',
		descriptionKey: 'chain_tools.tools.zksync_explorer.description',
		url: 'https://explorer.zksync.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'zksync', 'zk-rollup'],
		chains: ['zkSync Era'],
		color: '#8C8DFC'
	},
	{
		id: 'lineascan',
		name: 'LineaScan',
		descriptionKey: 'chain_tools.tools.lineascan.description',
		url: 'https://lineascan.build',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'linea', 'transactions'],
		chains: ['Linea'],
		color: '#121212'
	},

	// ========== More Analytics ==========
	{
		id: 'l2beat',
		name: 'L2BEAT',
		descriptionKey: 'chain_tools.tools.l2beat.description',
		url: 'https://l2beat.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['l2', 'rollup', 'tvl', 'risk'],
		color: '#7E41CC'
	},
	{
		id: 'messari',
		name: 'Messari',
		descriptionKey: 'chain_tools.tools.messari.description',
		url: 'https://messari.io',
		icon: FileText,
		category: 'analytics',
		tags: ['research', 'data', 'reports', 'fundamentals'],
		color: '#FFFFFF'
	},
	{
		id: 'coingecko',
		name: 'CoinGecko',
		descriptionKey: 'chain_tools.tools.coingecko.description',
		url: 'https://www.coingecko.com',
		icon: PieChart,
		category: 'analytics',
		tags: ['price', 'market-cap', 'tokens', 'charts'],
		color: '#8DC63F'
	},
	{
		id: 'coinmarketcap',
		name: 'CoinMarketCap',
		descriptionKey: 'chain_tools.tools.coinmarketcap.description',
		url: 'https://coinmarketcap.com',
		icon: LineChart,
		category: 'analytics',
		tags: ['price', 'market-cap', 'ranking'],
		color: '#3861FB'
	},
	{
		id: 'glassnode',
		name: 'Glassnode',
		descriptionKey: 'chain_tools.tools.glassnode.description',
		url: 'https://glassnode.com',
		icon: Database,
		category: 'analytics',
		tags: ['on-chain', 'metrics', 'bitcoin', 'ethereum'],
		color: '#1EB67F'
	},
	{
		id: 'santiment',
		name: 'Santiment',
		descriptionKey: 'chain_tools.tools.santiment.description',
		url: 'https://santiment.net',
		icon: Activity,
		category: 'analytics',
		tags: ['on-chain', 'social', 'sentiment', 'signals'],
		color: '#14C393'
	},
	{
		id: 'dexscreener',
		name: 'DEX Screener',
		descriptionKey: 'chain_tools.tools.dexscreener.description',
		url: 'https://dexscreener.com',
		icon: Scan,
		category: 'analytics',
		tags: ['dex', 'charts', 'pairs', 'real-time'],
		color: '#00E396'
	},
	{
		id: 'defined',
		name: 'Defined.fi',
		descriptionKey: 'chain_tools.tools.defined.description',
		url: 'https://www.defined.fi',
		icon: BarChart3,
		category: 'analytics',
		tags: ['dex', 'analytics', 'tokens', 'trending'],
		color: '#FF6B6B'
	},
	{
		id: 'bubblemaps',
		name: 'Bubblemaps',
		descriptionKey: 'chain_tools.tools.bubblemaps.description',
		url: 'https://bubblemaps.io',
		icon: PieChart,
		category: 'analytics',
		tags: ['holder', 'distribution', 'visualization', 'whales'],
		color: '#8B5CF6'
	},

	// ========== More Security Tools ==========
	{
		id: 'certik',
		name: 'CertiK',
		descriptionKey: 'chain_tools.tools.certik.description',
		url: 'https://www.certik.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'leaderboard', 'skynet'],
		color: '#00CED1'
	},
	{
		id: 'hacken',
		name: 'Hacken',
		descriptionKey: 'chain_tools.tools.hacken.description',
		url: 'https://hacken.io',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'penetration-testing', 'security'],
		color: '#16C1F3'
	},
	{
		id: 'immunefi',
		name: 'Immunefi',
		descriptionKey: 'chain_tools.tools.immunefi.description',
		url: 'https://immunefi.com',
		icon: Bug,
		category: 'security',
		tags: ['bug-bounty', 'security', 'rewards'],
		color: '#5850EC'
	},
	{
		id: 'openzeppelin',
		name: 'OpenZeppelin',
		descriptionKey: 'chain_tools.tools.openzeppelin.description',
		url: 'https://www.openzeppelin.com',
		icon: Shield,
		category: 'security',
		tags: ['contracts', 'library', 'audit', 'defender'],
		color: '#4E5EE4'
	},
	{
		id: 'dedaub',
		name: 'Dedaub',
		descriptionKey: 'chain_tools.tools.dedaub.description',
		url: 'https://library.dedaub.com',
		icon: Code,
		category: 'security',
		tags: ['decompiler', 'bytecode', 'analysis'],
		color: '#6C63FF'
	},
	{
		id: 'de-fi',
		name: 'De.Fi',
		descriptionKey: 'chain_tools.tools.de_fi.description',
		url: 'https://de.fi',
		icon: Shield,
		category: 'security',
		tags: ['scanner', 'rekt', 'approvals', 'shield'],
		color: '#00D1A0'
	},
	{
		id: 'honeypot',
		name: 'Honeypot.is',
		descriptionKey: 'chain_tools.tools.honeypot.description',
		url: 'https://honeypot.is',
		icon: Lock,
		category: 'security',
		tags: ['honeypot', 'detection', 'scam-check'],
		color: '#FFC107'
	},

	// ========== More Dev Tools ==========
	{
		id: 'ethers-js',
		name: 'Ethers.js',
		descriptionKey: 'chain_tools.tools.ethers.description',
		url: 'https://ethers.org',
		icon: Code,
		category: 'dev',
		tags: ['library', 'javascript', 'web3', 'sdk'],
		color: '#3C3C3D'
	},
	{
		id: 'viem',
		name: 'Viem',
		descriptionKey: 'chain_tools.tools.viem.description',
		url: 'https://viem.sh',
		icon: Code,
		category: 'dev',
		tags: ['library', 'typescript', 'lightweight', 'sdk'],
		color: '#1E1E1E'
	},
	{
		id: 'wagmi',
		name: 'Wagmi',
		descriptionKey: 'chain_tools.tools.wagmi.description',
		url: 'https://wagmi.sh',
		icon: Code,
		category: 'dev',
		tags: ['react', 'hooks', 'web3', 'frontend'],
		color: '#1E1E1E'
	},
	{
		id: 'rainbowkit',
		name: 'RainbowKit',
		descriptionKey: 'chain_tools.tools.rainbowkit.description',
		url: 'https://www.rainbowkit.com',
		icon: Wallet,
		category: 'dev',
		tags: ['wallet', 'connect', 'react', 'ui'],
		color: '#FF4BA6'
	},
	{
		id: 'web3modal',
		name: 'Web3Modal',
		descriptionKey: 'chain_tools.tools.web3modal.description',
		url: 'https://web3modal.com',
		icon: Wallet,
		category: 'dev',
		tags: ['wallet', 'connect', 'walletconnect', 'ui'],
		color: '#3B99FC'
	},
	{
		id: 'thirdweb',
		name: 'thirdweb',
		descriptionKey: 'chain_tools.tools.thirdweb.description',
		url: 'https://thirdweb.com',
		icon: Box,
		category: 'dev',
		tags: ['sdk', 'contracts', 'deploy', 'dashboard'],
		color: '#F213A4'
	},
	{
		id: 'alchemy',
		name: 'Alchemy',
		descriptionKey: 'chain_tools.tools.alchemy.description',
		url: 'https://www.alchemy.com',
		icon: Cpu,
		category: 'dev',
		tags: ['rpc', 'api', 'node', 'infrastructure'],
		color: '#4F46E5'
	},
	{
		id: 'infura',
		name: 'Infura',
		descriptionKey: 'chain_tools.tools.infura.description',
		url: 'https://www.infura.io',
		icon: Globe,
		category: 'dev',
		tags: ['rpc', 'api', 'node', 'infrastructure'],
		color: '#FF6B4A'
	},
	{
		id: 'quicknode',
		name: 'QuickNode',
		descriptionKey: 'chain_tools.tools.quicknode.description',
		url: 'https://www.quicknode.com',
		icon: Zap,
		category: 'dev',
		tags: ['rpc', 'api', 'node', 'multi-chain'],
		color: '#007FFF'
	},
	{
		id: 'solidity-lang',
		name: 'Solidity Docs',
		descriptionKey: 'chain_tools.tools.solidity.description',
		url: 'https://soliditylang.org',
		icon: BookOpen,
		category: 'dev',
		tags: ['documentation', 'solidity', 'language'],
		color: '#363636'
	},
	{
		id: 'evm-codes',
		name: 'EVM Codes',
		descriptionKey: 'chain_tools.tools.evm_codes.description',
		url: 'https://www.evm.codes',
		icon: Hash,
		category: 'dev',
		tags: ['opcodes', 'evm', 'reference', 'playground'],
		color: '#627EEA'
	},
	{
		id: 'sourcify',
		name: 'Sourcify',
		descriptionKey: 'chain_tools.tools.sourcify.description',
		url: 'https://sourcify.dev',
		icon: FileCode,
		category: 'dev',
		tags: ['verification', 'source-code', 'decentralized'],
		color: '#00B27D'
	},

	// ========== Wallets ==========
	{
		id: 'rabby',
		name: 'Rabby Wallet',
		descriptionKey: 'chain_tools.tools.rabby.description',
		url: 'https://rabby.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'extension', 'multi-chain', 'debank'],
		color: '#8697FF'
	},
	{
		id: 'rainbow',
		name: 'Rainbow',
		descriptionKey: 'chain_tools.tools.rainbow.description',
		url: 'https://rainbow.me',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'mobile', 'ethereum', 'nft'],
		color: '#FF4BA6'
	},
	{
		id: 'metamask',
		name: 'MetaMask',
		descriptionKey: 'chain_tools.tools.metamask.description',
		url: 'https://metamask.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'extension', 'mobile', 'popular'],
		color: '#F6851B'
	},
	{
		id: 'frame',
		name: 'Frame',
		descriptionKey: 'chain_tools.tools.frame.description',
		url: 'https://frame.sh',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'desktop', 'hardware', 'security'],
		color: '#2D2D2D'
	},
	{
		id: 'zerion',
		name: 'Zerion',
		descriptionKey: 'chain_tools.tools.zerion.description',
		url: 'https://zerion.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'portfolio', 'defi', 'nft'],
		color: '#2962FF'
	},
	{
		id: 'safe',
		name: 'Safe (Gnosis)',
		descriptionKey: 'chain_tools.tools.safe.description',
		url: 'https://safe.global',
		icon: Lock,
		category: 'wallet',
		tags: ['multisig', 'smart-wallet', 'treasury'],
		color: '#12FF80'
	},
	{
		id: 'zapper',
		name: 'Zapper',
		descriptionKey: 'chain_tools.tools.zapper.description',
		url: 'https://zapper.xyz',
		icon: Wallet,
		category: 'wallet',
		tags: ['portfolio', 'tracker', 'defi', 'nft'],
		color: '#784FFE'
	},

	// ========== NFT Tools (Extended) ==========
	{
		id: 'zora',
		name: 'Zora',
		descriptionKey: 'chain_tools.tools.zora.description',
		url: 'https://zora.co',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'mint', 'create', 'hyperstructure'],
		chains: ['Ethereum', 'Zora Network', 'Base'],
		color: '#000000'
	},
	{
		id: 'foundation',
		name: 'Foundation',
		descriptionKey: 'chain_tools.tools.foundation.description',
		url: 'https://foundation.app',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'art', 'creator', 'auction'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'sound-xyz',
		name: 'Sound.xyz',
		descriptionKey: 'chain_tools.tools.sound_xyz.description',
		url: 'https://www.sound.xyz',
		icon: Radio,
		category: 'nft',
		tags: ['music', 'nft', 'artist', 'web3'],
		chains: ['Ethereum', 'Optimism'],
		color: '#1DB954'
	},
	{
		id: 'manifold',
		name: 'Manifold',
		descriptionKey: 'chain_tools.tools.manifold.description',
		url: 'https://manifold.xyz',
		icon: Settings,
		category: 'nft',
		tags: ['creator', 'smart-contract', 'mint', 'tools'],
		chains: ['Ethereum', 'Optimism', 'Base'],
		color: '#7C3AED'
	},
	{
		id: 'icy-tools',
		name: 'icy.tools',
		descriptionKey: 'chain_tools.tools.icy_tools.description',
		url: 'https://icy.tools',
		icon: Activity,
		category: 'nft',
		tags: ['analytics', 'trending', 'mints', 'whales'],
		color: '#00B4D8'
	},
	{
		id: 'nftnerds',
		name: 'NFTNerds',
		descriptionKey: 'chain_tools.tools.nftnerds.description',
		url: 'https://nftnerds.ai',
		icon: Eye,
		category: 'nft',
		tags: ['analytics', 'sniping', 'rarity', 'trading'],
		color: '#FF6B6B'
	},

	// ========== Governance/DAO Extended ==========
	{
		id: 'boardroom',
		name: 'Boardroom',
		descriptionKey: 'chain_tools.tools.boardroom.description',
		url: 'https://boardroom.io',
		icon: Building2,
		category: 'dao',
		tags: ['governance', 'dashboard', 'proposals', 'delegate'],
		color: '#000000'
	},
	{
		id: 'karma',
		name: 'Karma',
		descriptionKey: 'chain_tools.tools.karma.description',
		url: 'https://www.karmahq.xyz',
		icon: Users,
		category: 'dao',
		tags: ['reputation', 'delegate', 'contribution'],
		color: '#6366F1'
	},

	// ========== Communication/Social ==========
	{
		id: 'lenster',
		name: 'Hey (Lenster)',
		descriptionKey: 'chain_tools.tools.lenster.description',
		url: 'https://hey.xyz',
		icon: MessageSquare,
		category: 'dao',
		tags: ['social', 'lens', 'decentralized', 'web3'],
		color: '#8B5CF6'
	},
	{
		id: 'farcaster',
		name: 'Warpcast (Farcaster)',
		descriptionKey: 'chain_tools.tools.farcaster.description',
		url: 'https://warpcast.com',
		icon: Megaphone,
		category: 'dao',
		tags: ['social', 'farcaster', 'decentralized', 'frames'],
		color: '#8465CB'
	},
	{
		id: 'push',
		name: 'Push Protocol',
		descriptionKey: 'chain_tools.tools.push.description',
		url: 'https://push.org',
		icon: Bell,
		category: 'dao',
		tags: ['notifications', 'messaging', 'web3', 'communication'],
		color: '#DD44B9'
	},

	// ========== DeFi - Lending & Borrowing ==========
	{
		id: 'euler',
		name: 'Euler Finance',
		descriptionKey: 'chain_tools.tools.euler.description',
		url: 'https://www.euler.finance',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['lending', 'permissionless', 'risk-management'],
		chains: ['Ethereum'],
		color: '#E4E7EC'
	},
	{
		id: 'benqi',
		name: 'BENQI',
		descriptionKey: 'chain_tools.tools.benqi.description',
		url: 'https://benqi.fi',
		icon: Banknote,
		category: 'defi',
		tags: ['lending', 'liquid-staking', 'avalanche'],
		chains: ['Avalanche'],
		color: '#00CFFF'
	},
	{
		id: 'silo',
		name: 'Silo Finance',
		descriptionKey: 'chain_tools.tools.silo.description',
		url: 'https://www.silo.finance',
		icon: Box,
		category: 'defi',
		tags: ['lending', 'isolated-markets', 'risk-isolation'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#4B7BF5'
	},
	{
		id: 'abracadabra',
		name: 'Abracadabra',
		descriptionKey: 'chain_tools.tools.abracadabra.description',
		url: 'https://abracadabra.money',
		icon: Sparkles,
		category: 'defi',
		tags: ['lending', 'mim', 'leverage', 'cauldrons'],
		chains: ['Ethereum', 'Arbitrum', 'Avalanche'],
		color: '#7B3FE4'
	},
	{
		id: 'alchemix',
		name: 'Alchemix',
		descriptionKey: 'chain_tools.tools.alchemix.description',
		url: 'https://alchemix.fi',
		icon: Flame,
		category: 'defi',
		tags: ['self-repaying', 'loans', 'yield', 'alUSD'],
		chains: ['Ethereum', 'Optimism'],
		color: '#F5C94C'
	},
	{
		id: 'exactly',
		name: 'Exactly Protocol',
		descriptionKey: 'chain_tools.tools.exactly.description',
		url: 'https://exact.ly',
		icon: Target,
		category: 'defi',
		tags: ['lending', 'fixed-rate', 'variable-rate'],
		chains: ['Ethereum', 'Optimism'],
		color: '#0066FF'
	},

	// ========== DeFi - DEXs & AMMs ==========
	{
		id: 'kyberswap',
		name: 'KyberSwap',
		descriptionKey: 'chain_tools.tools.kyberswap.description',
		url: 'https://kyberswap.com',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'aggregator', 'elastic-pools'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#31CB9E'
	},
	{
		id: 'odos',
		name: 'Odos',
		descriptionKey: 'chain_tools.tools.odos.description',
		url: 'https://odos.xyz',
		icon: GitBranch,
		category: 'defi',
		tags: ['aggregator', 'smart-routing', 'multi-input'],
		chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Optimism'],
		color: '#7C3AED'
	},
	{
		id: 'openocean',
		name: 'OpenOcean',
		descriptionKey: 'chain_tools.tools.openocean.description',
		url: 'https://openocean.finance',
		icon: Globe,
		category: 'defi',
		tags: ['aggregator', 'cross-chain', 'best-price'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Avalanche'],
		color: '#1B68D1'
	},
	{
		id: 'hashflow',
		name: 'Hashflow',
		descriptionKey: 'chain_tools.tools.hashflow.description',
		url: 'https://www.hashflow.com',
		icon: Hash,
		category: 'defi',
		tags: ['dex', 'rfq', 'mev-protected', 'cross-chain'],
		chains: ['Ethereum', 'Arbitrum', 'Polygon', 'Avalanche'],
		color: '#3B82F6'
	},
	{
		id: 'syncswap',
		name: 'SyncSwap',
		descriptionKey: 'chain_tools.tools.syncswap.description',
		url: 'https://syncswap.xyz',
		icon: RefreshCw,
		category: 'defi',
		tags: ['dex', 'zksync', 'concentrated-liquidity'],
		chains: ['zkSync Era'],
		color: '#2ED5A8'
	},
	{
		id: 'mute',
		name: 'Mute.io',
		descriptionKey: 'chain_tools.tools.mute.description',
		url: 'https://mute.io',
		icon: Activity,
		category: 'defi',
		tags: ['dex', 'zksync', 'amplifier'],
		chains: ['zkSync Era'],
		color: '#00D4FF'
	},
	{
		id: 'spacefi',
		name: 'SpaceFi',
		descriptionKey: 'chain_tools.tools.spacefi.description',
		url: 'https://spacefi.io',
		icon: Rocket,
		category: 'defi',
		tags: ['dex', 'zksync', 'farm'],
		chains: ['zkSync Era'],
		color: '#1F1F1F'
	},
	{
		id: 'ramses',
		name: 'Ramses Exchange',
		descriptionKey: 'chain_tools.tools.ramses.description',
		url: 'https://www.ramses.exchange',
		icon: Gauge,
		category: 'defi',
		tags: ['dex', 'arbitrum', 've-tokenomics'],
		chains: ['Arbitrum'],
		color: '#F7931A'
	},
	{
		id: 'thena',
		name: 'THENA',
		descriptionKey: 'chain_tools.tools.thena.description',
		url: 'https://thena.fi',
		icon: Gauge,
		category: 'defi',
		tags: ['dex', 'bsc', 've-tokenomics'],
		chains: ['BSC'],
		color: '#CD7F32'
	},
	{
		id: 'baseswap',
		name: 'BaseSwap',
		descriptionKey: 'chain_tools.tools.baseswap.description',
		url: 'https://baseswap.fi',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'base', 'farm'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'woofi',
		name: 'WOOFi',
		descriptionKey: 'chain_tools.tools.woofi.description',
		url: 'https://fi.woo.org',
		icon: TrendingUp,
		category: 'defi',
		tags: ['dex', 'cross-chain', 'low-slippage'],
		chains: ['Ethereum', 'Arbitrum', 'Polygon', 'BSC'],
		color: '#21C7A8'
	},

	// ========== DeFi - Perpetuals & Derivatives ==========
	{
		id: 'gains',
		name: 'Gains Network',
		descriptionKey: 'chain_tools.tools.gains.description',
		url: 'https://gains.trade',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'leverage', 'synthetic'],
		chains: ['Polygon', 'Arbitrum'],
		color: '#5C28A9'
	},
	{
		id: 'level',
		name: 'Level Finance',
		descriptionKey: 'chain_tools.tools.level.description',
		url: 'https://level.finance',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'leverage', 'bsc'],
		chains: ['BSC', 'Arbitrum'],
		color: '#E6D465'
	},
	{
		id: 'mux',
		name: 'MUX Protocol',
		descriptionKey: 'chain_tools.tools.mux.description',
		url: 'https://mux.network',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'aggregator', 'leverage'],
		chains: ['Arbitrum', 'BSC', 'Avalanche'],
		color: '#4EA8DE'
	},
	{
		id: 'vertex',
		name: 'Vertex Protocol',
		descriptionKey: 'chain_tools.tools.vertex.description',
		url: 'https://vertexprotocol.com',
		icon: Activity,
		category: 'defi',
		tags: ['perpetuals', 'spot', 'money-market'],
		chains: ['Arbitrum'],
		color: '#8B5CF6'
	},
	{
		id: 'hyperliquid',
		name: 'Hyperliquid',
		descriptionKey: 'chain_tools.tools.hyperliquid.description',
		url: 'https://hyperliquid.xyz',
		icon: Zap,
		category: 'defi',
		tags: ['perpetuals', 'orderbook', 'l1'],
		chains: ['Hyperliquid'],
		color: '#00FF88'
	},
	{
		id: 'aevo',
		name: 'Aevo',
		descriptionKey: 'chain_tools.tools.aevo.description',
		url: 'https://www.aevo.xyz',
		icon: LineChart,
		category: 'defi',
		tags: ['options', 'perpetuals', 'orderbook'],
		chains: ['Aevo L2'],
		color: '#FFD700'
	},
	{
		id: 'lyra',
		name: 'Lyra Finance',
		descriptionKey: 'chain_tools.tools.lyra.description',
		url: 'https://www.lyra.finance',
		icon: LineChart,
		category: 'defi',
		tags: ['options', 'amm', 'derivatives'],
		chains: ['Optimism', 'Arbitrum'],
		color: '#38BDF8'
	},
	{
		id: 'dopex',
		name: 'Dopex',
		descriptionKey: 'chain_tools.tools.dopex.description',
		url: 'https://www.dopex.io',
		icon: Target,
		category: 'defi',
		tags: ['options', 'ssov', 'atlantic'],
		chains: ['Arbitrum'],
		color: '#4ECDC4'
	},
	{
		id: 'premia',
		name: 'Premia',
		descriptionKey: 'chain_tools.tools.premia.description',
		url: 'https://premia.blue',
		icon: LineChart,
		category: 'defi',
		tags: ['options', 'vaults', 'defi'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#0066FF'
	},

	// ========== DeFi - Yield & Vaults ==========
	{
		id: 'beefy',
		name: 'Beefy Finance',
		descriptionKey: 'chain_tools.tools.beefy.description',
		url: 'https://beefy.com',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'auto-compound', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#5A8F35'
	},
	{
		id: 'harvest',
		name: 'Harvest Finance',
		descriptionKey: 'chain_tools.tools.harvest.description',
		url: 'https://harvest.finance',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'farming', 'auto-compound'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#F2A52B'
	},
	{
		id: 'pickle',
		name: 'Pickle Finance',
		descriptionKey: 'chain_tools.tools.pickle.description',
		url: 'https://pickle.finance',
		icon: TrendingUp,
		category: 'defi',
		tags: ['yield', 'jars', 'farms'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#48BB78'
	},
	{
		id: 'concentrator',
		name: 'Concentrator',
		descriptionKey: 'chain_tools.tools.concentrator.description',
		url: 'https://concentrator.aladdin.club',
		icon: Target,
		category: 'defi',
		tags: ['yield', 'curve', 'convex', 'boost'],
		chains: ['Ethereum'],
		color: '#F97316'
	},
	{
		id: 'conic',
		name: 'Conic Finance',
		descriptionKey: 'chain_tools.tools.conic.description',
		url: 'https://conic.finance',
		icon: PieChart,
		category: 'defi',
		tags: ['yield', 'curve', 'omnipool'],
		chains: ['Ethereum'],
		color: '#9333EA'
	},
	{
		id: 'sturdy',
		name: 'Sturdy Finance',
		descriptionKey: 'chain_tools.tools.sturdy.description',
		url: 'https://sturdy.finance',
		icon: Shield,
		category: 'defi',
		tags: ['lending', 'yield', 'interest-free'],
		chains: ['Ethereum', 'Fantom'],
		color: '#4F46E5'
	},

	// ========== DeFi - Liquid Staking ==========
	{
		id: 'stakewise',
		name: 'StakeWise',
		descriptionKey: 'chain_tools.tools.stakewise.description',
		url: 'https://stakewise.io',
		icon: TrendingUp,
		category: 'defi',
		tags: ['staking', 'liquid', 'oseth'],
		chains: ['Ethereum'],
		color: '#6B21A8'
	},
	{
		id: 'frax-ether',
		name: 'Frax Ether',
		descriptionKey: 'chain_tools.tools.frax_ether.description',
		url: 'https://frax.finance/frxeth',
		icon: TrendingUp,
		category: 'defi',
		tags: ['staking', 'liquid', 'frxeth', 'sfrxeth'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'stader',
		name: 'Stader Labs',
		descriptionKey: 'chain_tools.tools.stader.description',
		url: 'https://www.staderlabs.com',
		icon: TrendingUp,
		category: 'defi',
		tags: ['staking', 'liquid', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#60A5FA'
	},
	{
		id: 'mantle-lsp',
		name: 'Mantle LSP',
		descriptionKey: 'chain_tools.tools.mantle_lsp.description',
		url: 'https://meth.mantle.xyz',
		icon: TrendingUp,
		category: 'defi',
		tags: ['staking', 'liquid', 'meth'],
		chains: ['Ethereum', 'Mantle'],
		color: '#000000'
	},
	{
		id: 'renzo',
		name: 'Renzo Protocol',
		descriptionKey: 'chain_tools.tools.renzo.description',
		url: 'https://www.renzoprotocol.com',
		icon: Layers,
		category: 'defi',
		tags: ['restaking', 'ezeth', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#6366F1'
	},
	{
		id: 'etherfi',
		name: 'ether.fi',
		descriptionKey: 'chain_tools.tools.etherfi.description',
		url: 'https://www.ether.fi',
		icon: Layers,
		category: 'defi',
		tags: ['staking', 'restaking', 'eeth'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'puffer',
		name: 'Puffer Finance',
		descriptionKey: 'chain_tools.tools.puffer.description',
		url: 'https://www.puffer.fi',
		icon: Shield,
		category: 'defi',
		tags: ['restaking', 'pufeth', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#00D4AA'
	},
	{
		id: 'kelp',
		name: 'Kelp DAO',
		descriptionKey: 'chain_tools.tools.kelp.description',
		url: 'https://kelpdao.xyz',
		icon: Layers,
		category: 'defi',
		tags: ['restaking', 'rseth', 'eigenlayer'],
		chains: ['Ethereum'],
		color: '#22C55E'
	},

	// ========== More Bridges ==========
	{
		id: 'hyphen',
		name: 'Hyphen (Biconomy)',
		descriptionKey: 'chain_tools.tools.hyphen.description',
		url: 'https://hyphen.biconomy.io',
		icon: Zap,
		category: 'bridge',
		tags: ['bridge', 'instant', 'low-fee'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#FF4E17'
	},
	{
		id: 'connext',
		name: 'Connext',
		descriptionKey: 'chain_tools.tools.connext.description',
		url: 'https://bridge.connext.network',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'trustless', 'xchain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#8247E5'
	},
	{
		id: 'debridge',
		name: 'deBridge',
		descriptionKey: 'chain_tools.tools.debridge.description',
		url: 'https://debridge.finance',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'cross-chain', 'liquidity'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Solana'],
		color: '#7E5FFF'
	},
	{
		id: 'allbridge',
		name: 'Allbridge',
		descriptionKey: 'chain_tools.tools.allbridge.description',
		url: 'https://allbridge.io',
		icon: Globe,
		category: 'bridge',
		tags: ['bridge', 'stablecoin', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Solana', 'Tron'],
		color: '#1B68D1'
	},
	{
		id: 'portal',
		name: 'Portal Bridge',
		descriptionKey: 'chain_tools.tools.portal.description',
		url: 'https://portalbridge.com',
		icon: CircuitBoard,
		category: 'bridge',
		tags: ['bridge', 'wormhole', 'multi-chain'],
		chains: ['Ethereum', 'Solana', 'BSC', 'Polygon'],
		color: '#FFFFFF'
	},
	{
		id: 'squid',
		name: 'Squid Router',
		descriptionKey: 'chain_tools.tools.squid.description',
		url: 'https://www.squidrouter.com',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'axelar', 'cross-chain-swap'],
		chains: ['Ethereum', 'Polygon', 'Avalanche', 'Arbitrum'],
		color: '#FF0080'
	},
	{
		id: 'owlto',
		name: 'Owlto Finance',
		descriptionKey: 'chain_tools.tools.owlto.description',
		url: 'https://owlto.finance',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'l2', 'fast', 'cheap'],
		chains: ['Ethereum', 'Arbitrum', 'Optimism', 'zkSync', 'Base', 'Linea'],
		color: '#F7931A'
	},

	// ========== More Explorers & Block Scanners ==========
	{
		id: 'scrollscan',
		name: 'Scrollscan',
		descriptionKey: 'chain_tools.tools.scrollscan.description',
		url: 'https://scrollscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'scroll', 'zk-rollup'],
		chains: ['Scroll'],
		color: '#FFEEDA'
	},
	{
		id: 'mantlescan',
		name: 'Mantle Explorer',
		descriptionKey: 'chain_tools.tools.mantlescan.description',
		url: 'https://explorer.mantle.xyz',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'mantle', 'modular'],
		chains: ['Mantle'],
		color: '#000000'
	},
	{
		id: 'blastscan',
		name: 'Blastscan',
		descriptionKey: 'chain_tools.tools.blastscan.description',
		url: 'https://blastscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'blast', 'native-yield'],
		chains: ['Blast'],
		color: '#FCFC03'
	},
	{
		id: 'modescan',
		name: 'Mode Explorer',
		descriptionKey: 'chain_tools.tools.modescan.description',
		url: 'https://explorer.mode.network',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'mode', 'optimistic'],
		chains: ['Mode'],
		color: '#DFFE00'
	},
	{
		id: 'celoscan',
		name: 'Celoscan',
		descriptionKey: 'chain_tools.tools.celoscan.description',
		url: 'https://celoscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'celo', 'mobile-first'],
		chains: ['Celo'],
		color: '#35D07F'
	},
	{
		id: 'ftmscan',
		name: 'FTMScan',
		descriptionKey: 'chain_tools.tools.ftmscan.description',
		url: 'https://ftmscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'fantom', 'transactions'],
		chains: ['Fantom'],
		color: '#1969FF'
	},
	{
		id: 'gnosisscan',
		name: 'GnosisScan',
		descriptionKey: 'chain_tools.tools.gnosisscan.description',
		url: 'https://gnosisscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'gnosis', 'xdai'],
		chains: ['Gnosis'],
		color: '#04795B'
	},
	{
		id: 'cronoscan',
		name: 'Cronoscan',
		descriptionKey: 'chain_tools.tools.cronoscan.description',
		url: 'https://cronoscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'cronos', 'transactions'],
		chains: ['Cronos'],
		color: '#002D74'
	},
	{
		id: 'moonbeamscan',
		name: 'Moonscan',
		descriptionKey: 'chain_tools.tools.moonbeamscan.description',
		url: 'https://moonscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'moonbeam', 'polkadot'],
		chains: ['Moonbeam', 'Moonriver'],
		color: '#53CBC9'
	},
	// ========== More Analytics ==========
	{
		id: 'tokenterminal',
		name: 'Token Terminal',
		descriptionKey: 'chain_tools.tools.tokenterminal.description',
		url: 'https://tokenterminal.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['fundamentals', 'revenue', 'metrics', 'finance'],
		color: '#050505'
	},
	{
		id: 'artemis',
		name: 'Artemis',
		descriptionKey: 'chain_tools.tools.artemis.description',
		url: 'https://app.artemis.xyz',
		icon: BarChart3,
		category: 'analytics',
		tags: ['fundamentals', 'revenue', 'developer-activity'],
		color: '#FF6B35'
	},
	{
		id: 'growthepie',
		name: 'growthepie',
		descriptionKey: 'chain_tools.tools.growthepie.description',
		url: 'https://growthepie.xyz',
		icon: PieChart,
		category: 'analytics',
		tags: ['l2', 'analytics', 'comparison', 'metrics'],
		color: '#A3E635'
	},
	{
		id: 'dappradar',
		name: 'DappRadar',
		descriptionKey: 'chain_tools.tools.dappradar.description',
		url: 'https://dappradar.com',
		icon: BarChart3,
		category: 'analytics',
		tags: ['dapp', 'ranking', 'nft', 'defi'],
		color: '#7C3AED'
	},
	{
		id: 'ethburned',
		name: 'Watch The Burn',
		descriptionKey: 'chain_tools.tools.ethburned.description',
		url: 'https://watchtheburn.com',
		icon: Flame,
		category: 'analytics',
		tags: ['ethereum', 'eip1559', 'burn', 'gas'],
		color: '#F97316'
	},
	{
		id: 'parsec',
		name: 'Parsec Finance',
		descriptionKey: 'chain_tools.tools.parsec.description',
		url: 'https://parsec.fi',
		icon: BarChart3,
		category: 'analytics',
		tags: ['defi', 'dashboard', 'alerts', 'pro'],
		color: '#7C3AED'
	},
	{
		id: 'eigenexplorer',
		name: 'EigenExplorer',
		descriptionKey: 'chain_tools.tools.eigenexplorer.description',
		url: 'https://eigenexplorer.com',
		icon: Layers,
		category: 'analytics',
		tags: ['eigenlayer', 'restaking', 'avs', 'operators'],
		color: '#1E0555'
	},

	// ========== More Security Tools ==========
	{
		id: 'phalcon',
		name: 'Phalcon (BlockSec)',
		descriptionKey: 'chain_tools.tools.phalcon.description',
		url: 'https://phalcon.blocksec.com',
		icon: Eye,
		category: 'security',
		tags: ['explorer', 'tx-analysis', 'debug', 'trace'],
		color: '#00CED1'
	},
	{
		id: 'tx-tracer',
		name: 'Tx Tracer',
		descriptionKey: 'chain_tools.tools.tx_tracer.description',
		url: 'https://openchain.xyz/trace',
		icon: FileSearch,
		category: 'security',
		tags: ['trace', 'debug', 'calldata', 'decoder'],
		color: '#6366F1'
	},
	{
		id: 'contract-diff',
		name: 'Contract Diff',
		descriptionKey: 'chain_tools.tools.contract_diff.description',
		url: 'https://www.contract-diff.xyz',
		icon: FileCode,
		category: 'security',
		tags: ['diff', 'compare', 'contracts', 'verification'],
		color: '#10B981'
	},
	{
		id: 'forta',
		name: 'Forta',
		descriptionKey: 'chain_tools.tools.forta.description',
		url: 'https://forta.org',
		icon: Bell,
		category: 'security',
		tags: ['monitoring', 'threat-detection', 'bots', 'alerts'],
		color: '#7C3AED'
	},
	{
		id: 'chainalysis',
		name: 'Chainalysis',
		descriptionKey: 'chain_tools.tools.chainalysis.description',
		url: 'https://www.chainalysis.com',
		icon: Eye,
		category: 'security',
		tags: ['compliance', 'investigation', 'enterprise'],
		color: '#0066FF'
	},

	// ========== More Dev Tools ==========
	{
		id: 'brownie',
		name: 'Brownie',
		descriptionKey: 'chain_tools.tools.brownie.description',
		url: 'https://eth-brownie.readthedocs.io',
		icon: Code,
		category: 'dev',
		tags: ['framework', 'python', 'testing'],
		color: '#654321'
	},
	{
		id: 'ape',
		name: 'Ape Framework',
		descriptionKey: 'chain_tools.tools.ape.description',
		url: 'https://apeworx.io',
		icon: Code,
		category: 'dev',
		tags: ['framework', 'python', 'modular'],
		color: '#000000'
	},
	{
		id: 'remix-ide',
		name: 'Remix IDE',
		descriptionKey: 'chain_tools.tools.remix.description',
		url: 'https://remix.ethereum.org',
		icon: Code,
		category: 'dev',
		tags: ['ide', 'browser', 'solidity', 'deploy'],
		color: '#0D47A1'
	},
	{
		id: 'chainlink',
		name: 'Chainlink',
		descriptionKey: 'chain_tools.tools.chainlink.description',
		url: 'https://chain.link',
		icon: Link2,
		category: 'dev',
		tags: ['oracle', 'price-feeds', 'vrf', 'automation'],
		color: '#375BD2'
	},
	{
		id: 'pyth',
		name: 'Pyth Network',
		descriptionKey: 'chain_tools.tools.pyth.description',
		url: 'https://pyth.network',
		icon: Activity,
		category: 'dev',
		tags: ['oracle', 'price-feeds', 'real-time'],
		color: '#E6DAFE'
	},
	{
		id: 'the-graph',
		name: 'The Graph',
		descriptionKey: 'chain_tools.tools.the_graph.description',
		url: 'https://thegraph.com',
		icon: Database,
		category: 'dev',
		tags: ['indexer', 'subgraph', 'graphql', 'query'],
		color: '#6747ED'
	},
	{
		id: 'goldsky',
		name: 'Goldsky',
		descriptionKey: 'chain_tools.tools.goldsky.description',
		url: 'https://goldsky.com',
		icon: Database,
		category: 'dev',
		tags: ['indexer', 'subgraph', 'real-time', 'streaming'],
		color: '#FFD700'
	},
	{
		id: 'envio',
		name: 'Envio',
		descriptionKey: 'chain_tools.tools.envio.description',
		url: 'https://envio.dev',
		icon: Database,
		category: 'dev',
		tags: ['indexer', 'hypersync', 'fast', 'typescript'],
		color: '#FF6B35'
	},
	{
		id: 'moralis',
		name: 'Moralis',
		descriptionKey: 'chain_tools.tools.moralis.description',
		url: 'https://moralis.io',
		icon: Cpu,
		category: 'dev',
		tags: ['api', 'sdk', 'nft', 'defi', 'streams'],
		color: '#00C2FF'
	},
	{
		id: 'covalent',
		name: 'Covalent',
		descriptionKey: 'chain_tools.tools.covalent.description',
		url: 'https://www.covalenthq.com',
		icon: Database,
		category: 'dev',
		tags: ['api', 'data', 'multi-chain', 'unified'],
		color: '#FF4C8B'
	},
	{
		id: 'transpose',
		name: 'Transpose',
		descriptionKey: 'chain_tools.tools.transpose.description',
		url: 'https://www.transpose.io',
		icon: Database,
		category: 'dev',
		tags: ['api', 'sql', 'real-time', 'nft'],
		color: '#5046E5'
	},
	{
		id: 'chainbase',
		name: 'Chainbase',
		descriptionKey: 'chain_tools.tools.chainbase.description',
		url: 'https://chainbase.com',
		icon: Database,
		category: 'dev',
		tags: ['data', 'api', 'multi-chain', 'sync'],
		color: '#0066FF'
	},

	// ========== More Wallets ==========
	{
		id: 'coinbase-wallet',
		name: 'Coinbase Wallet',
		descriptionKey: 'chain_tools.tools.coinbase_wallet.description',
		url: 'https://www.coinbase.com/wallet',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'extension', 'mobile', 'defi'],
		color: '#0052FF'
	},
	{
		id: 'trust-wallet',
		name: 'Trust Wallet',
		descriptionKey: 'chain_tools.tools.trust_wallet.description',
		url: 'https://trustwallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'mobile', 'multi-chain'],
		color: '#0500FF'
	},
	{
		id: 'argent',
		name: 'Argent',
		descriptionKey: 'chain_tools.tools.argent.description',
		url: 'https://www.argent.xyz',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'smart-wallet', 'recovery', 'starknet'],
		color: '#FF875B'
	},
	{
		id: 'sequence',
		name: 'Sequence',
		descriptionKey: 'chain_tools.tools.sequence.description',
		url: 'https://sequence.xyz',
		icon: Wallet,
		category: 'wallet',
		tags: ['wallet', 'smart-wallet', 'gaming', 'embedded'],
		color: '#000000'
	},
	{
		id: 'ledger',
		name: 'Ledger',
		descriptionKey: 'chain_tools.tools.ledger.description',
		url: 'https://www.ledger.com',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'cold-storage', 'security'],
		color: '#000000'
	},
	{
		id: 'trezor',
		name: 'Trezor',
		descriptionKey: 'chain_tools.tools.trezor.description',
		url: 'https://trezor.io',
		icon: Lock,
		category: 'wallet',
		tags: ['hardware', 'cold-storage', 'security'],
		color: '#000000'
	},
	{
		id: 'privy',
		name: 'Privy',
		descriptionKey: 'chain_tools.tools.privy.description',
		url: 'https://www.privy.io',
		icon: KeyRound,
		category: 'wallet',
		tags: ['embedded', 'social-login', 'onboarding'],
		color: '#6D28D9'
	},
	{
		id: 'dynamic',
		name: 'Dynamic',
		descriptionKey: 'chain_tools.tools.dynamic.description',
		url: 'https://www.dynamic.xyz',
		icon: KeyRound,
		category: 'wallet',
		tags: ['embedded', 'authentication', 'multi-wallet'],
		color: '#6366F1'
	},

	// ========== More NFT Tools ==========
	{
		id: 'looksrare',
		name: 'LooksRare',
		descriptionKey: 'chain_tools.tools.looksrare.description',
		url: 'https://looksrare.org',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'rewards', 'community'],
		chains: ['Ethereum'],
		color: '#0CE466'
	},
	{
		id: 'x2y2',
		name: 'X2Y2',
		descriptionKey: 'chain_tools.tools.x2y2.description',
		url: 'https://x2y2.io',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'low-fees', 'bulk'],
		chains: ['Ethereum'],
		color: '#1968FC'
	},
	{
		id: 'gem',
		name: 'Gem (OpenSea Pro)',
		descriptionKey: 'chain_tools.tools.gem.description',
		url: 'https://pro.opensea.io',
		icon: Image,
		category: 'nft',
		tags: ['aggregator', 'bulk-buy', 'sweep'],
		chains: ['Ethereum'],
		color: '#2081E2'
	},
	{
		id: 'nftfi',
		name: 'NFTfi',
		descriptionKey: 'chain_tools.tools.nftfi.description',
		url: 'https://nftfi.com',
		icon: Banknote,
		category: 'nft',
		tags: ['lending', 'loans', 'collateral'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'arcade',
		name: 'Arcade',
		descriptionKey: 'chain_tools.tools.arcade.description',
		url: 'https://arcade.xyz',
		icon: Banknote,
		category: 'nft',
		tags: ['lending', 'loans', 'wrapped-collections'],
		chains: ['Ethereum'],
		color: '#7C3AED'
	},
	{
		id: 'mintfun',
		name: 'mint.fun',
		descriptionKey: 'chain_tools.tools.mintfun.description',
		url: 'https://mint.fun',
		icon: Sparkles,
		category: 'nft',
		tags: ['minting', 'discovery', 'trending', 'free-mints'],
		color: '#FF6B6B'
	},

	// ========== More DAO Tools ==========
	{
		id: 'daohaus',
		name: 'DAOhaus',
		descriptionKey: 'chain_tools.tools.daohaus.description',
		url: 'https://daohaus.club',
		icon: Building2,
		category: 'dao',
		tags: ['moloch', 'dao', 'community', 'grants'],
		color: '#EA1D76'
	},
	{
		id: 'charmverse',
		name: 'CharmVerse',
		descriptionKey: 'chain_tools.tools.charmverse.description',
		url: 'https://www.charmverse.io',
		icon: ScrollText,
		category: 'dao',
		tags: ['workspace', 'docs', 'bounties', 'community'],
		color: '#A855F7'
	},
	{
		id: 'wonderverse',
		name: 'Wonderverse',
		descriptionKey: 'chain_tools.tools.wonderverse.description',
		url: 'https://www.wonderverse.xyz',
		icon: Users,
		category: 'dao',
		tags: ['tasks', 'bounties', 'projects', 'contributors'],
		color: '#6366F1'
	},
	{
		id: 'coordinape',
		name: 'Coordinape',
		descriptionKey: 'chain_tools.tools.coordinape.description',
		url: 'https://coordinape.com',
		icon: Users,
		category: 'dao',
		tags: ['compensation', 'give', 'circles', 'contributors'],
		color: '#3B82F6'
	},
	{
		id: 'guild',
		name: 'Guild.xyz',
		descriptionKey: 'chain_tools.tools.guild.description',
		url: 'https://guild.xyz',
		icon: Users,
		category: 'dao',
		tags: ['access', 'roles', 'token-gating', 'community'],
		color: '#FECC00'
	},
	{
		id: 'jokerace',
		name: 'JokeRace',
		descriptionKey: 'chain_tools.tools.jokerace.description',
		url: 'https://jokerace.xyz',
		icon: Award,
		category: 'dao',
		tags: ['contests', 'voting', 'governance', 'fun'],
		color: '#FF6B6B'
	}
];

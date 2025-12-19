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
	FileText,
	MessageSquare,
	Bell,
	Megaphone,
	Award,
	// New icons for additional categories
	Server,
	Gamepad2,
	CreditCard,
	Fingerprint,
	Share2,
	BadgeCheck,
	Orbit,
	MessageCircle,
	Podcast,
	Newspaper,
	Trophy,
	Joystick,
	Sword,
	Receipt,
	ArrowUpDown,
	Layers2,
	Network,
	HardDrive,
	// New category icons
	Laugh,
	Radio as RadioIcon,
	Repeat2,
	Sprout,
	EyeOff,
	DatabaseZap
} from '@lucide/svelte';
import type { Category, ExternalTool, CategoryId } from '../types';

/**
 * Category definitions with i18n keys and colors
 */
export const categories: Category[] = [
	{ id: 'featured', labelKey: 'chain_tools.categories.featured', color: '#F59E0B', icon: Award },
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
	{ id: 'dao', labelKey: 'chain_tools.categories.dao', color: '#A855F7', icon: Vote },
	{ id: 'infra', labelKey: 'chain_tools.categories.infra', color: '#14B8A6', icon: Server },
	{ id: 'launchpad', labelKey: 'chain_tools.categories.launchpad', color: '#F97316', icon: Rocket },
	{
		id: 'identity',
		labelKey: 'chain_tools.categories.identity',
		color: '#06B6D4',
		icon: Fingerprint
	},
	{ id: 'social', labelKey: 'chain_tools.categories.social', color: '#8B5CF6', icon: Share2 },
	{ id: 'l2', labelKey: 'chain_tools.categories.l2', color: '#3B82F6', icon: Layers2 },
	{ id: 'gamefi', labelKey: 'chain_tools.categories.gamefi', color: '#EC4899', icon: Gamepad2 },
	{
		id: 'payments',
		labelKey: 'chain_tools.categories.payments',
		color: '#10B981',
		icon: CreditCard
	},
	{ id: 'meme', labelKey: 'chain_tools.categories.meme', color: '#FBBF24', icon: Laugh },
	{ id: 'oracle', labelKey: 'chain_tools.categories.oracle', color: '#7C3AED', icon: RadioIcon },
	{
		id: 'restaking',
		labelKey: 'chain_tools.categories.restaking',
		color: '#0EA5E9',
		icon: Repeat2
	},
	{ id: 'yield', labelKey: 'chain_tools.categories.yield', color: '#22C55E', icon: Sprout },
	{ id: 'privacy', labelKey: 'chain_tools.categories.privacy', color: '#64748B', icon: EyeOff },
	{ id: 'data', labelKey: 'chain_tools.categories.data', color: '#F43F5E', icon: DatabaseZap },
	{ id: 'all', labelKey: 'chain_tools.categories.all', color: '#6B7280', icon: Layers }
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
		color: '#FF007A',
		isFeatured: true
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
		color: '#B6509E',
		isFeatured: true
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
		color: '#F0603A',
		isFeatured: true
	},
	{
		id: 'defillama',
		name: 'DefiLlama',
		descriptionKey: 'chain_tools.tools.defillama.description',
		url: 'https://defillama.com',
		icon: PieChart,
		category: 'analytics',
		tags: ['tvl', 'defi', 'analytics', 'protocols'],
		color: '#2775CA',
		isFeatured: true
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
		color: '#E53E3E',
		isFeatured: true
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
		color: '#21325B',
		isFeatured: true
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
		color: '#2081E2',
		isFeatured: true
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
		color: '#10B981',
		isFeatured: true
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
		color: '#F59E0B',
		isFeatured: true
	},
	{
		id: 'biubiu-wallet-generator',
		name: 'Wallet Generator',
		descriptionKey: 'chain_tools.tools.biubiu_wallet_generator.description',
		url: '/apps/wallet-generator',
		icon: KeyRound,
		category: 'wallet',
		tags: ['generator', 'mnemonic', 'hd-wallet', 'batch', 'biubiu'],
		color: '#8B5CF6',
		isFeatured: true
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
		color: '#3B82F6',
		isFeatured: true
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
		color: '#F59E0B',
		isFeatured: true
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
		color: '#10B981',
		isFeatured: true
	},
	{
		id: 'biubiu-events-scanner',
		name: 'Events Scanner',
		descriptionKey: 'chain_tools.tools.biubiu_events_scanner.description',
		url: '/apps/contract-events-scanner',
		icon: FileSearch,
		category: 'analytics',
		tags: ['events', 'logs', 'scanner', 'smart-contract', 'biubiu'],
		color: '#A855F7',
		isFeatured: true
	},
	{
		id: 'biubiu-chainlist',
		name: 'Chainlist',
		descriptionKey: 'chain_tools.tools.biubiu_chainlist.description',
		url: '/apps/chainlist',
		icon: Globe,
		category: 'dev',
		tags: ['chains', 'rpc', 'networks', 'add-network', 'biubiu'],
		color: '#6366F1',
		isFeatured: true
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
		color: '#F6851B',
		isFeatured: true
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
		color: '#12FF80',
		isFeatured: true
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
	},

	// ============================================
	// INFRA - Infrastructure Tools
	// ============================================
	{
		id: 'ankr',
		name: 'Ankr',
		descriptionKey: 'chain_tools.tools.ankr.description',
		url: 'https://www.ankr.com',
		icon: Network,
		category: 'infra',
		tags: ['rpc', 'staking', 'node', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Avalanche', 'Fantom'],
		color: '#356DF3'
	},
	{
		id: 'chainstack',
		name: 'Chainstack',
		descriptionKey: 'chain_tools.tools.chainstack.description',
		url: 'https://chainstack.com',
		icon: HardDrive,
		category: 'infra',
		tags: ['rpc', 'node', 'enterprise', 'managed'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Solana', 'Avalanche'],
		color: '#1B1464'
	},
	{
		id: 'blast-api',
		name: 'Blast API',
		descriptionKey: 'chain_tools.tools.blast_api.description',
		url: 'https://blastapi.io',
		icon: Zap,
		category: 'infra',
		tags: ['rpc', 'api', 'decentralized', 'fast'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Avalanche'],
		color: '#FCFC03'
	},
	{
		id: 'ipfs',
		name: 'IPFS',
		descriptionKey: 'chain_tools.tools.ipfs.description',
		url: 'https://ipfs.tech',
		icon: Globe,
		category: 'infra',
		tags: ['storage', 'decentralized', 'pinning', 'content-addressing'],
		color: '#65C2CB'
	},
	{
		id: 'arweave',
		name: 'Arweave',
		descriptionKey: 'chain_tools.tools.arweave.description',
		url: 'https://www.arweave.org',
		icon: HardDrive,
		category: 'infra',
		tags: ['storage', 'permanent', 'permaweb'],
		color: '#222326'
	},
	{
		id: 'filecoin',
		name: 'Filecoin',
		descriptionKey: 'chain_tools.tools.filecoin.description',
		url: 'https://filecoin.io',
		icon: HardDrive,
		category: 'infra',
		tags: ['storage', 'decentralized', 'incentivized'],
		color: '#0090FF'
	},
	{
		id: 'ceramic',
		name: 'Ceramic',
		descriptionKey: 'chain_tools.tools.ceramic.description',
		url: 'https://ceramic.network',
		icon: Database,
		category: 'infra',
		tags: ['storage', 'streams', 'composable', 'identity'],
		color: '#FF5733'
	},
	{
		id: 'push-protocol',
		name: 'Push Protocol',
		descriptionKey: 'chain_tools.tools.push_protocol.description',
		url: 'https://push.org',
		icon: Bell,
		category: 'infra',
		tags: ['messaging', 'notifications', 'web3-native'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum'],
		color: '#DD44B9'
	},
	{
		id: 'xmtp',
		name: 'XMTP',
		descriptionKey: 'chain_tools.tools.xmtp.description',
		url: 'https://xmtp.org',
		icon: MessageSquare,
		category: 'infra',
		tags: ['messaging', 'e2e-encrypted', 'wallet-to-wallet'],
		chains: ['Ethereum'],
		color: '#FC4F37'
	},
	{
		id: 'walletconnect',
		name: 'WalletConnect',
		descriptionKey: 'chain_tools.tools.walletconnect.description',
		url: 'https://walletconnect.com',
		icon: Link2,
		category: 'infra',
		tags: ['connection', 'protocol', 'multi-chain', 'standard'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Solana'],
		color: '#3B99FC'
	},

	// ============================================
	// LAUNCHPAD - Token & NFT Launch Platforms
	// ============================================
	{
		id: 'pump-fun',
		name: 'Pump.fun',
		descriptionKey: 'chain_tools.tools.pump_fun.description',
		url: 'https://pump.fun',
		icon: Rocket,
		category: 'launchpad',
		tags: ['fair-launch', 'meme', 'bonding-curve', 'solana'],
		chains: ['Solana'],
		color: '#00D181',
		isFeatured: true
	},
	{
		id: 'dao-maker',
		name: 'DAO Maker',
		descriptionKey: 'chain_tools.tools.dao_maker.description',
		url: 'https://daomaker.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['ido', 'sho', 'incubator', 'venture'],
		chains: ['Ethereum', 'BSC', 'Polygon'],
		color: '#0B0E11'
	},
	{
		id: 'fjord-foundry',
		name: 'Fjord Foundry',
		descriptionKey: 'chain_tools.tools.fjord_foundry.description',
		url: 'https://fjordfoundry.com',
		icon: Droplets,
		category: 'launchpad',
		tags: ['lbp', 'fair-launch', 'price-discovery'],
		chains: ['Ethereum', 'Arbitrum', 'Base'],
		color: '#3B82F6'
	},
	{
		id: 'camelot-launchpad',
		name: 'Camelot Launchpad',
		descriptionKey: 'chain_tools.tools.camelot_launchpad.description',
		url: 'https://camelot.exchange',
		icon: Rocket,
		category: 'launchpad',
		tags: ['arbitrum', 'ido', 'native'],
		chains: ['Arbitrum'],
		color: '#FFAF1D'
	},
	{
		id: 'pinksale',
		name: 'PinkSale',
		descriptionKey: 'chain_tools.tools.pinksale.description',
		url: 'https://www.pinksale.finance',
		icon: Rocket,
		category: 'launchpad',
		tags: ['presale', 'fair-launch', 'multi-chain'],
		chains: ['BSC', 'Ethereum', 'Polygon', 'Arbitrum'],
		color: '#FF1493'
	},
	{
		id: 'gempad',
		name: 'GemPad',
		descriptionKey: 'chain_tools.tools.gempad.description',
		url: 'https://gempad.app',
		icon: Gem,
		category: 'launchpad',
		tags: ['presale', 'fair-launch', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Arbitrum', 'Base'],
		color: '#6366F1'
	},
	{
		id: 'mint-fun',
		name: 'Mint.fun',
		descriptionKey: 'chain_tools.tools.mint_fun.description',
		url: 'https://mint.fun',
		icon: Sparkles,
		category: 'launchpad',
		tags: ['nft', 'free-mint', 'discovery', 'trending'],
		chains: ['Ethereum', 'Base', 'Zora', 'Optimism'],
		color: '#00D395'
	},
	{
		id: 'zora-create',
		name: 'Zora Create',
		descriptionKey: 'chain_tools.tools.zora_create.description',
		url: 'https://zora.co/create',
		icon: Sparkles,
		category: 'launchpad',
		tags: ['nft', 'mint', 'creator', 'protocol'],
		chains: ['Zora', 'Base', 'Ethereum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'thirdweb-deploy',
		name: 'Thirdweb Deploy',
		descriptionKey: 'chain_tools.tools.thirdweb_deploy.description',
		url: 'https://thirdweb.com/deploy',
		icon: Rocket,
		category: 'launchpad',
		tags: ['contract', 'deploy', 'no-code', 'sdk'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Base', 'Optimism'],
		color: '#F213A4'
	},
	{
		id: 'seedify',
		name: 'Seedify',
		descriptionKey: 'chain_tools.tools.seedify.description',
		url: 'https://seedify.fund',
		icon: Rocket,
		category: 'launchpad',
		tags: ['igo', 'ino', 'gamefi', 'incubator'],
		chains: ['BSC', 'Ethereum'],
		color: '#2BFDA6'
	},
	{
		id: 'polkastarter',
		name: 'Polkastarter',
		descriptionKey: 'chain_tools.tools.polkastarter.description',
		url: 'https://polkastarter.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['ido', 'cross-chain', 'gaming'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#FF3465'
	},

	// ============================================
	// IDENTITY - DID & Credentials
	// ============================================
	{
		id: 'ens',
		name: 'ENS',
		descriptionKey: 'chain_tools.tools.ens.description',
		url: 'https://ens.domains',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'naming', 'ethereum', 'identity'],
		chains: ['Ethereum'],
		color: '#5298FF',
		isFeatured: true
	},
	{
		id: 'unstoppable-domains',
		name: 'Unstoppable Domains',
		descriptionKey: 'chain_tools.tools.unstoppable_domains.description',
		url: 'https://unstoppabledomains.com',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'nft', 'multi-chain', 'identity'],
		chains: ['Ethereum', 'Polygon'],
		color: '#0D67FE'
	},
	{
		id: 'space-id',
		name: 'SPACE ID',
		descriptionKey: 'chain_tools.tools.space_id.description',
		url: 'https://space.id',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'bnb', 'arbitrum', 'multi-chain'],
		chains: ['BSC', 'Arbitrum', 'Ethereum'],
		color: '#2B6AFF'
	},
	{
		id: 'dotbit',
		name: '.bit',
		descriptionKey: 'chain_tools.tools.dotbit.description',
		url: 'https://did.id',
		icon: Globe,
		category: 'identity',
		tags: ['domain', 'cross-chain', 'nervos'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Nervos'],
		color: '#22C55E'
	},
	{
		id: 'gitcoin-passport',
		name: 'Gitcoin Passport',
		descriptionKey: 'chain_tools.tools.gitcoin_passport.description',
		url: 'https://passport.gitcoin.co',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['sybil', 'identity', 'stamps', 'verification'],
		chains: ['Ethereum', 'Optimism'],
		color: '#02E2AC'
	},
	{
		id: 'galxe',
		name: 'Galxe',
		descriptionKey: 'chain_tools.tools.galxe.description',
		url: 'https://galxe.com',
		icon: Trophy,
		category: 'identity',
		tags: ['credentials', 'campaigns', 'oat', 'quest'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'layer3',
		name: 'Layer3',
		descriptionKey: 'chain_tools.tools.layer3.description',
		url: 'https://layer3.xyz',
		icon: Trophy,
		category: 'identity',
		tags: ['quests', 'learn-to-earn', 'credentials', 'onboarding'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#6366F1'
	},
	{
		id: 'degenscore',
		name: 'DegenScore',
		descriptionKey: 'chain_tools.tools.degenscore.description',
		url: 'https://degenscore.com',
		icon: Award,
		category: 'identity',
		tags: ['reputation', 'score', 'on-chain', 'beacon'],
		chains: ['Ethereum'],
		color: '#FF6B00'
	},
	{
		id: 'worldcoin',
		name: 'Worldcoin',
		descriptionKey: 'chain_tools.tools.worldcoin.description',
		url: 'https://worldcoin.org',
		icon: Eye,
		category: 'identity',
		tags: ['identity', 'proof-of-personhood', 'biometric'],
		chains: ['Optimism', 'Ethereum'],
		color: '#000000'
	},
	{
		id: 'civic',
		name: 'Civic',
		descriptionKey: 'chain_tools.tools.civic.description',
		url: 'https://www.civic.com',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['kyc', 'identity', 'verification', 'compliance'],
		chains: ['Ethereum', 'Solana', 'Polygon'],
		color: '#3AB03E'
	},
	{
		id: 'poap',
		name: 'POAP',
		descriptionKey: 'chain_tools.tools.poap.description',
		url: 'https://poap.xyz',
		icon: Award,
		category: 'identity',
		tags: ['attendance', 'badge', 'nft', 'proof'],
		chains: ['Gnosis', 'Ethereum'],
		color: '#6534FF'
	},
	{
		id: 'talent-protocol',
		name: 'Talent Protocol',
		descriptionKey: 'chain_tools.tools.talent_protocol.description',
		url: 'https://talentprotocol.com',
		icon: Users,
		category: 'identity',
		tags: ['builder-score', 'reputation', 'talent'],
		chains: ['Base', 'Ethereum'],
		color: '#7C3AED'
	},

	// ============================================
	// SOCIAL - SocialFi & Content
	// ============================================
	{
		id: 'lens-protocol',
		name: 'Lens Protocol',
		descriptionKey: 'chain_tools.tools.lens_protocol.description',
		url: 'https://lens.xyz',
		icon: Share2,
		category: 'social',
		tags: ['social-graph', 'composable', 'polygon', 'decentralized'],
		chains: ['Polygon'],
		color: '#00501E'
	},
	{
		id: 'warpcast',
		name: 'Warpcast',
		descriptionKey: 'chain_tools.tools.warpcast.description',
		url: 'https://warpcast.com',
		icon: MessageCircle,
		category: 'social',
		tags: ['farcaster', 'client', 'social', 'mobile'],
		chains: ['Optimism'],
		color: '#8A63D2'
	},
	{
		id: 'hey',
		name: 'Hey',
		descriptionKey: 'chain_tools.tools.hey.description',
		url: 'https://hey.xyz',
		icon: MessageCircle,
		category: 'social',
		tags: ['lens', 'social', 'decentralized', 'client'],
		chains: ['Polygon'],
		color: '#FB3A5D'
	},
	{
		id: 'orb',
		name: 'Orb',
		descriptionKey: 'chain_tools.tools.orb.description',
		url: 'https://orb.club',
		icon: Orbit,
		category: 'social',
		tags: ['lens', 'mobile', 'social', 'communities'],
		chains: ['Polygon'],
		color: '#6366F1'
	},
	{
		id: 'cyberconnect',
		name: 'CyberConnect',
		descriptionKey: 'chain_tools.tools.cyberconnect.description',
		url: 'https://cyber.co',
		icon: Share2,
		category: 'social',
		tags: ['social-graph', 'l2', 'identity'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'friend-tech',
		name: 'Friend.tech',
		descriptionKey: 'chain_tools.tools.friend_tech.description',
		url: 'https://www.friend.tech',
		icon: Users,
		category: 'social',
		tags: ['socialfi', 'keys', 'base', 'speculation'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'mirror',
		name: 'Mirror',
		descriptionKey: 'chain_tools.tools.mirror.description',
		url: 'https://mirror.xyz',
		icon: Newspaper,
		category: 'social',
		tags: ['writing', 'publishing', 'nft', 'crowdfunding'],
		chains: ['Ethereum', 'Optimism'],
		color: '#007AFF'
	},
	{
		id: 'paragraph',
		name: 'Paragraph',
		descriptionKey: 'chain_tools.tools.paragraph.description',
		url: 'https://paragraph.xyz',
		icon: Newspaper,
		category: 'social',
		tags: ['newsletter', 'writing', 'web3', 'publishing'],
		chains: ['Ethereum', 'Base'],
		color: '#000000'
	},
	{
		id: 'deso',
		name: 'DeSo',
		descriptionKey: 'chain_tools.tools.deso.description',
		url: 'https://deso.com',
		icon: Share2,
		category: 'social',
		tags: ['l1', 'social', 'decentralized', 'blockchain'],
		chains: ['DeSo'],
		color: '#0057FF'
	},
	{
		id: 'phaver',
		name: 'Phaver',
		descriptionKey: 'chain_tools.tools.phaver.description',
		url: 'https://phaver.com',
		icon: MessageCircle,
		category: 'social',
		tags: ['lens', 'farcaster', 'social', 'stake-to-post'],
		chains: ['Polygon', 'Optimism'],
		color: '#5D5FEF'
	},
	{
		id: 'drakula',
		name: 'Drakula',
		descriptionKey: 'chain_tools.tools.drakula.description',
		url: 'https://drakula.app',
		icon: Podcast,
		category: 'social',
		tags: ['video', 'short-form', 'creator', 'farcaster'],
		chains: ['Base'],
		color: '#FF0050'
	},

	// ============================================
	// L2 - Layer 2 Solutions & Tools
	// ============================================
	{
		id: 'arbitrum-one',
		name: 'Arbitrum One',
		descriptionKey: 'chain_tools.tools.arbitrum_one.description',
		url: 'https://arbitrum.io',
		icon: Layers2,
		category: 'l2',
		tags: ['optimistic-rollup', 'ethereum', 'scaling', 'evm'],
		chains: ['Arbitrum'],
		color: '#28A0F0',
		isFeatured: true
	},
	{
		id: 'optimism',
		name: 'Optimism',
		descriptionKey: 'chain_tools.tools.optimism.description',
		url: 'https://www.optimism.io',
		icon: Layers2,
		category: 'l2',
		tags: ['optimistic-rollup', 'ethereum', 'superchain', 'op-stack'],
		chains: ['Optimism'],
		color: '#FF0420'
	},
	{
		id: 'base',
		name: 'Base',
		descriptionKey: 'chain_tools.tools.base.description',
		url: 'https://base.org',
		icon: Hexagon,
		category: 'l2',
		tags: ['optimistic-rollup', 'coinbase', 'op-stack', 'evm'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'zksync-era',
		name: 'zkSync Era',
		descriptionKey: 'chain_tools.tools.zksync_era.description',
		url: 'https://zksync.io',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'ethereum', 'scaling', 'account-abstraction'],
		chains: ['zkSync'],
		color: '#8C8DFC'
	},
	{
		id: 'starknet',
		name: 'Starknet',
		descriptionKey: 'chain_tools.tools.starknet.description',
		url: 'https://www.starknet.io',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'ethereum', 'cairo', 'validity-proof'],
		chains: ['Starknet'],
		color: '#29296E'
	},
	{
		id: 'scroll',
		name: 'Scroll',
		descriptionKey: 'chain_tools.tools.scroll.description',
		url: 'https://scroll.io',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'ethereum', 'evm-equivalent', 'zkevm'],
		chains: ['Scroll'],
		color: '#FFEEDA'
	},
	{
		id: 'linea',
		name: 'Linea',
		descriptionKey: 'chain_tools.tools.linea.description',
		url: 'https://linea.build',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'consensys', 'zkevm', 'ethereum'],
		chains: ['Linea'],
		color: '#61DFFF'
	},
	{
		id: 'polygon-zkevm',
		name: 'Polygon zkEVM',
		descriptionKey: 'chain_tools.tools.polygon_zkevm.description',
		url: 'https://polygon.technology/polygon-zkevm',
		icon: Layers2,
		category: 'l2',
		tags: ['zk-rollup', 'polygon', 'zkevm', 'ethereum'],
		chains: ['Polygon zkEVM'],
		color: '#8247E5'
	},
	{
		id: 'manta-pacific',
		name: 'Manta Pacific',
		descriptionKey: 'chain_tools.tools.manta_pacific.description',
		url: 'https://pacific.manta.network',
		icon: Layers2,
		category: 'l2',
		tags: ['modular', 'zk', 'ethereum', 'defi'],
		chains: ['Manta Pacific'],
		color: '#00D2FF'
	},
	{
		id: 'blast-l2',
		name: 'Blast',
		descriptionKey: 'chain_tools.tools.blast_l2.description',
		url: 'https://blast.io',
		icon: Zap,
		category: 'l2',
		tags: ['optimistic-rollup', 'native-yield', 'ethereum'],
		chains: ['Blast'],
		color: '#FCFC03'
	},
	{
		id: 'mode',
		name: 'Mode',
		descriptionKey: 'chain_tools.tools.mode.description',
		url: 'https://www.mode.network',
		icon: Layers2,
		category: 'l2',
		tags: ['optimistic-rollup', 'op-stack', 'defi', 'sequencer-sharing'],
		chains: ['Mode'],
		color: '#DFFE00'
	},
	{
		id: 'mantle',
		name: 'Mantle',
		descriptionKey: 'chain_tools.tools.mantle.description',
		url: 'https://www.mantle.xyz',
		icon: Layers2,
		category: 'l2',
		tags: ['modular', 'ethereum', 'bitdao', 'lsd'],
		chains: ['Mantle'],
		color: '#000000'
	},
	// ============================================
	// GAMEFI - Gaming & Metaverse
	// ============================================
	{
		id: 'immutable',
		name: 'Immutable',
		descriptionKey: 'chain_tools.tools.immutable.description',
		url: 'https://www.immutable.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['gaming', 'nft', 'zkEVM', 'layer2'],
		chains: ['Immutable X', 'Immutable zkEVM'],
		color: '#00BFBF',
		isFeatured: true
	},
	{
		id: 'ronin',
		name: 'Ronin',
		descriptionKey: 'chain_tools.tools.ronin.description',
		url: 'https://roninchain.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['gaming', 'axie', 'sidechain', 'sky-mavis'],
		chains: ['Ronin'],
		color: '#1273EA'
	},
	{
		id: 'treasure',
		name: 'Treasure',
		descriptionKey: 'chain_tools.tools.treasure.description',
		url: 'https://treasure.lol',
		icon: Trophy,
		category: 'gamefi',
		tags: ['gaming', 'arbitrum', 'ecosystem', 'magic'],
		chains: ['Arbitrum'],
		color: '#DC2626'
	},
	{
		id: 'beam',
		name: 'Beam',
		descriptionKey: 'chain_tools.tools.beam.description',
		url: 'https://www.beam.gg',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['gaming', 'avalanche', 'subnet', 'merit-circle'],
		chains: ['Beam'],
		color: '#FCFC03'
	},
	{
		id: 'stardust',
		name: 'Stardust',
		descriptionKey: 'chain_tools.tools.stardust.description',
		url: 'https://stardust.gg',
		icon: Sparkles,
		category: 'gamefi',
		tags: ['sdk', 'wallet', 'nft', 'gaming'],
		chains: ['Ethereum', 'Polygon', 'Solana'],
		color: '#7C3AED'
	},
	{
		id: 'fractal',
		name: 'Fractal',
		descriptionKey: 'chain_tools.tools.fractal.description',
		url: 'https://www.fractal.is',
		icon: Hexagon,
		category: 'gamefi',
		tags: ['marketplace', 'gaming', 'nft', 'discovery'],
		chains: ['Solana', 'Ethereum', 'Polygon'],
		color: '#7C3AED'
	},
	{
		id: 'xai',
		name: 'Xai',
		descriptionKey: 'chain_tools.tools.xai.description',
		url: 'https://xai.games',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['gaming', 'arbitrum-orbit', 'layer3', 'offchain-labs'],
		chains: ['Xai'],
		color: '#F5F5F5'
	},
	{
		id: 'ygg',
		name: 'Yield Guild Games',
		descriptionKey: 'chain_tools.tools.ygg.description',
		url: 'https://yieldguild.io',
		icon: Users,
		category: 'gamefi',
		tags: ['guild', 'scholarship', 'gaming', 'dao'],
		chains: ['Ethereum', 'Polygon', 'Ronin'],
		color: '#E74C3C'
	},
	{
		id: 'loot8',
		name: 'Loot8',
		descriptionKey: 'chain_tools.tools.loot8.description',
		url: 'https://loot8.io',
		icon: Box,
		category: 'gamefi',
		tags: ['nft', 'gaming', 'collectibles', 'brands'],
		chains: ['Ethereum', 'Polygon'],
		color: '#FF6B00'
	},
	{
		id: 'iskra',
		name: 'Iskra',
		descriptionKey: 'chain_tools.tools.iskra.description',
		url: 'https://iskra.world',
		icon: Flame,
		category: 'gamefi',
		tags: ['gaming', 'platform', 'community', 'web3'],
		chains: ['Ethereum', 'Klaytn'],
		color: '#FF4500'
	},
	{
		id: 'elixir-games',
		name: 'Elixir Games',
		descriptionKey: 'chain_tools.tools.elixir_games.description',
		url: 'https://elixir.app',
		icon: Joystick,
		category: 'gamefi',
		tags: ['launcher', 'gaming', 'discovery', 'desktop'],
		chains: ['Multi-chain'],
		color: '#8B5CF6'
	},

	// ============================================
	// PAYMENTS - Crypto Payments & Fiat On-ramp
	// ============================================
	{
		id: 'moonpay',
		name: 'MoonPay',
		descriptionKey: 'chain_tools.tools.moonpay.description',
		url: 'https://www.moonpay.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'off-ramp', 'card'],
		chains: ['Ethereum', 'Bitcoin', 'Solana', 'Polygon'],
		color: '#7D00FF',
		isFeatured: true
	},
	{
		id: 'transak',
		name: 'Transak',
		descriptionKey: 'chain_tools.tools.transak.description',
		url: 'https://transak.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'off-ramp', 'sdk'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Solana'],
		color: '#0052FF'
	},
	{
		id: 'ramp',
		name: 'Ramp',
		descriptionKey: 'chain_tools.tools.ramp.description',
		url: 'https://ramp.network',
		icon: ArrowUpDown,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'sdk', 'non-custodial'],
		chains: ['Ethereum', 'Polygon', 'Solana', 'Avalanche'],
		color: '#21BF73'
	},
	{
		id: 'onmeta',
		name: 'Onmeta',
		descriptionKey: 'chain_tools.tools.onmeta.description',
		url: 'https://onmeta.in',
		icon: CreditCard,
		category: 'payments',
		tags: ['fiat', 'on-ramp', 'india', 'upi'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#6366F1'
	},
	{
		id: 'request-network',
		name: 'Request Network',
		descriptionKey: 'chain_tools.tools.request_network.description',
		url: 'https://request.network',
		icon: Receipt,
		category: 'payments',
		tags: ['invoicing', 'crypto-payments', 'b2b', 'accounting'],
		chains: ['Ethereum', 'Polygon', 'Gnosis'],
		color: '#00E6A0'
	},
	{
		id: 'superfluid',
		name: 'Superfluid',
		descriptionKey: 'chain_tools.tools.superfluid.description',
		url: 'https://superfluid.finance',
		icon: Droplets,
		category: 'payments',
		tags: ['streaming', 'real-time', 'subscriptions', 'payroll'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#12141E'
	},
	{
		id: 'sablier',
		name: 'Sablier',
		descriptionKey: 'chain_tools.tools.sablier.description',
		url: 'https://sablier.com',
		icon: Droplets,
		category: 'payments',
		tags: ['streaming', 'vesting', 'payroll', 'lockup'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#F77423'
	},
	{
		id: 'coinshift',
		name: 'Coinshift',
		descriptionKey: 'chain_tools.tools.coinshift.description',
		url: 'https://coinshift.xyz',
		icon: Building2,
		category: 'payments',
		tags: ['treasury', 'multi-sig', 'payroll', 'invoicing'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#5856D6'
	},
	{
		id: 'utopia-labs',
		name: 'Utopia Labs',
		descriptionKey: 'chain_tools.tools.utopia_labs.description',
		url: 'https://www.utopialabs.com',
		icon: Building2,
		category: 'payments',
		tags: ['payroll', 'dao', 'treasury', 'operations'],
		chains: ['Ethereum', 'Polygon', 'Optimism'],
		color: '#7C3AED'
	},
	{
		id: 'gnosis-pay',
		name: 'Gnosis Pay',
		descriptionKey: 'chain_tools.tools.gnosis_pay.description',
		url: 'https://gnosispay.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['card', 'visa', 'self-custody', 'spend'],
		chains: ['Gnosis'],
		color: '#04795B'
	},
	{
		id: 'spritz',
		name: 'Spritz',
		descriptionKey: 'chain_tools.tools.spritz.description',
		url: 'https://spritz.finance',
		icon: Banknote,
		category: 'payments',
		tags: ['bill-pay', 'off-ramp', 'ach', 'fiat'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BSC'],
		color: '#00D4AA'
	},
	{
		id: 'bitpay',
		name: 'BitPay',
		descriptionKey: 'chain_tools.tools.bitpay.description',
		url: 'https://bitpay.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['merchant', 'payments', 'card', 'invoice'],
		chains: ['Bitcoin', 'Ethereum', 'Polygon'],
		color: '#1A3B8B'
	},

	// ============================================
	// ADDITIONAL TOOLS - BATCH 2 (200 new tools)
	// ============================================

	// ========== MORE DEFI PROTOCOLS ==========
	{
		id: 'bentobox',
		name: 'BentoBox',
		descriptionKey: 'chain_tools.tools.bentobox.description',
		url: 'https://app.sushi.com/bentobox',
		icon: Box,
		category: 'defi',
		tags: ['vault', 'yield', 'lending', 'sushi'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#0E0F23'
	},
	{
		id: 'ribbon',
		name: 'Ribbon Finance',
		descriptionKey: 'chain_tools.tools.ribbon.description',
		url: 'https://app.ribbon.finance',
		icon: TrendingUp,
		category: 'defi',
		tags: ['options', 'vault', 'structured-products', 'yield'],
		chains: ['Ethereum', 'Avalanche', 'Solana'],
		color: '#FC0A54'
	},
	{
		id: 'opyn',
		name: 'Opyn',
		descriptionKey: 'chain_tools.tools.opyn.description',
		url: 'https://www.opyn.co',
		icon: Target,
		category: 'defi',
		tags: ['options', 'derivatives', 'hedging', 'squeeth'],
		chains: ['Ethereum'],
		color: '#2CE49A'
	},
	{
		id: 'notional',
		name: 'Notional Finance',
		descriptionKey: 'chain_tools.tools.notional.description',
		url: 'https://notional.finance',
		icon: Percent,
		category: 'defi',
		tags: ['fixed-rate', 'lending', 'borrowing', 'yield'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#33F8B8'
	},
	{
		id: 'goldfinch',
		name: 'Goldfinch',
		descriptionKey: 'chain_tools.tools.goldfinch.description',
		url: 'https://goldfinch.finance',
		icon: Coins,
		category: 'defi',
		tags: ['real-world', 'lending', 'credit', 'emerging-markets'],
		chains: ['Ethereum'],
		color: '#F9D54B'
	},
	{
		id: 'maple',
		name: 'Maple Finance',
		descriptionKey: 'chain_tools.tools.maple.description',
		url: 'https://maple.finance',
		icon: Building2,
		category: 'defi',
		tags: ['institutional', 'lending', 'credit', 'undercollateralized'],
		chains: ['Ethereum', 'Solana'],
		color: '#1E40AF'
	},
	{
		id: 'truefi',
		name: 'TrueFi',
		descriptionKey: 'chain_tools.tools.truefi.description',
		url: 'https://truefi.io',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['uncollateralized', 'lending', 'institutional', 'credit'],
		chains: ['Ethereum', 'Optimism'],
		color: '#1A5BFF'
	},
	{
		id: 'tokemak',
		name: 'Tokemak',
		descriptionKey: 'chain_tools.tools.tokemak.description',
		url: 'https://www.tokemak.xyz',
		icon: Droplets,
		category: 'defi',
		tags: ['liquidity', 'reactor', 'yield', 'lp'],
		chains: ['Ethereum'],
		color: '#00D1FF'
	},
	{
		id: 'olympus',
		name: 'Olympus DAO',
		descriptionKey: 'chain_tools.tools.olympus.description',
		url: 'https://app.olympusdao.finance',
		icon: Landmark,
		category: 'defi',
		tags: ['ohm', 'bonding', 'staking', 'reserve-currency'],
		chains: ['Ethereum'],
		color: '#708B96'
	},
	{
		id: 'jones-dao',
		name: 'Jones DAO',
		descriptionKey: 'chain_tools.tools.jones_dao.description',
		url: 'https://www.jonesdao.io',
		icon: TrendingUp,
		category: 'defi',
		tags: ['options', 'vault', 'yield', 'arbitrum'],
		chains: ['Arbitrum'],
		color: '#E87B35'
	},
	{
		id: 'umami',
		name: 'Umami Finance',
		descriptionKey: 'chain_tools.tools.umami.description',
		url: 'https://umami.finance',
		icon: Activity,
		category: 'defi',
		tags: ['yield', 'glp', 'vault', 'arbitrum'],
		chains: ['Arbitrum'],
		color: '#8B5CF6'
	},
	{
		id: 'rage-trade',
		name: 'Rage Trade',
		descriptionKey: 'chain_tools.tools.rage_trade.description',
		url: 'https://www.rage.trade',
		icon: Flame,
		category: 'defi',
		tags: ['perpetuals', 'delta-neutral', 'yield', 'arbitrum'],
		chains: ['Arbitrum'],
		color: '#EF4444'
	},
	{
		id: 'vela',
		name: 'Vela Exchange',
		descriptionKey: 'chain_tools.tools.vela.description',
		url: 'https://www.vela.exchange',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'trading', 'leverage', 'derivatives'],
		chains: ['Arbitrum'],
		color: '#0EA5E9'
	},
	{
		id: 'y2k',
		name: 'Y2K Finance',
		descriptionKey: 'chain_tools.tools.y2k.description',
		url: 'https://www.y2k.finance',
		icon: Shield,
		category: 'defi',
		tags: ['depeg', 'insurance', 'hedging', 'stablecoin'],
		chains: ['Arbitrum'],
		color: '#10B981'
	},
	{
		id: 'kwenta',
		name: 'Kwenta',
		descriptionKey: 'chain_tools.tools.kwenta.description',
		url: 'https://kwenta.io',
		icon: TrendingUp,
		category: 'defi',
		tags: ['perpetuals', 'synthetix', 'trading', 'derivatives'],
		chains: ['Optimism'],
		color: '#FFD75E'
	},
	{
		id: 'polynomial',
		name: 'Polynomial',
		descriptionKey: 'chain_tools.tools.polynomial.description',
		url: 'https://polynomial.fi',
		icon: Activity,
		category: 'defi',
		tags: ['options', 'vault', 'synthetix', 'yield'],
		chains: ['Optimism'],
		color: '#7C3AED'
	},
	{
		id: 'angle',
		name: 'Angle Protocol',
		descriptionKey: 'chain_tools.tools.angle.description',
		url: 'https://angle.money',
		icon: Coins,
		category: 'defi',
		tags: ['stablecoin', 'euro', 'ageur', 'forex'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#FF6B00'
	},
	{
		id: 'liquity',
		name: 'Liquity',
		descriptionKey: 'chain_tools.tools.liquity.description',
		url: 'https://www.liquity.org',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['stablecoin', 'lusd', 'borrowing', 'collateral'],
		chains: ['Ethereum'],
		color: '#2EB6EA'
	},
	{
		id: 'reflexer',
		name: 'Reflexer',
		descriptionKey: 'chain_tools.tools.reflexer.description',
		url: 'https://reflexer.finance',
		icon: RefreshCw,
		category: 'defi',
		tags: ['rai', 'stablecoin', 'algorithmic', 'non-pegged'],
		chains: ['Ethereum'],
		color: '#4AE3A7'
	},
	{
		id: 'mstable',
		name: 'mStable',
		descriptionKey: 'chain_tools.tools.mstable.description',
		url: 'https://mstable.org',
		icon: Coins,
		category: 'defi',
		tags: ['stablecoin', 'savings', 'meta-asset', 'yield'],
		chains: ['Ethereum', 'Polygon'],
		color: '#000000'
	},
	{
		id: 'raft',
		name: 'Raft',
		descriptionKey: 'chain_tools.tools.raft.description',
		url: 'https://raft.fi',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['stablecoin', 'r-stablecoin', 'lsd', 'borrowing'],
		chains: ['Ethereum'],
		color: '#0052FF'
	},
	{
		id: 'prisma',
		name: 'Prisma Finance',
		descriptionKey: 'chain_tools.tools.prisma.description',
		url: 'https://prismafinance.com',
		icon: Gem,
		category: 'defi',
		tags: ['stablecoin', 'mkusd', 'lsd', 'curve'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'gravita',
		name: 'Gravita Protocol',
		descriptionKey: 'chain_tools.tools.gravita.description',
		url: 'https://www.gravitaprotocol.com',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['stablecoin', 'grai', 'lsd', 'borrowing'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#1E40AF'
	},
	{
		id: 'gyroscope',
		name: 'Gyroscope',
		descriptionKey: 'chain_tools.tools.gyroscope.description',
		url: 'https://gyro.finance',
		icon: RefreshCw,
		category: 'defi',
		tags: ['stablecoin', 'gysd', 'reserve', 'metastablecoin'],
		chains: ['Ethereum', 'Polygon'],
		color: '#00D395'
	},
	{
		id: 'origin-dollar',
		name: 'Origin Dollar',
		descriptionKey: 'chain_tools.tools.origin_dollar.description',
		url: 'https://www.ousd.com',
		icon: CircleDollarSign,
		category: 'defi',
		tags: ['stablecoin', 'ousd', 'yield', 'rebasing'],
		chains: ['Ethereum'],
		color: '#0074F0'
	},
	{
		id: 'paraswap',
		name: 'ParaSwap',
		descriptionKey: 'chain_tools.tools.paraswap.description',
		url: 'https://paraswap.io',
		icon: Repeat,
		category: 'defi',
		tags: ['aggregator', 'swap', 'dex', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche'],
		color: '#0058F7'
	},
	{
		id: 'matcha',
		name: 'Matcha',
		descriptionKey: 'chain_tools.tools.matcha.description',
		url: 'https://matcha.xyz',
		icon: Repeat,
		category: 'defi',
		tags: ['aggregator', 'swap', '0x', 'dex'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Arbitrum', 'Optimism', 'Avalanche'],
		color: '#22C55E'
	},
	{
		id: 'cowswap',
		name: 'CoW Swap',
		descriptionKey: 'chain_tools.tools.cowswap.description',
		url: 'https://swap.cow.fi',
		icon: Repeat,
		category: 'defi',
		tags: ['aggregator', 'mev-protection', 'swap', 'batch-auction'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#012F6A'
	},
	{
		id: 'bebop',
		name: 'Bebop',
		descriptionKey: 'chain_tools.tools.bebop.description',
		url: 'https://bebop.xyz',
		icon: Repeat,
		category: 'defi',
		tags: ['aggregator', 'swap', 'multi-token', 'gasless'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BSC'],
		color: '#6366F1'
	},
	{
		id: 'dodo',
		name: 'DODO',
		descriptionKey: 'chain_tools.tools.dodo.description',
		url: 'https://dodoex.io',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'pmm', 'liquidity', 'crowdpooling'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum'],
		color: '#FFE804'
	},
	{
		id: 'clipper',
		name: 'Clipper',
		descriptionKey: 'chain_tools.tools.clipper.description',
		url: 'https://clipper.exchange',
		icon: Repeat,
		category: 'defi',
		tags: ['dex', 'retail', 'small-trades', 'low-slippage'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#00D395'
	},
	{
		id: 'woofi-pro',
		name: 'WOOFi Pro',
		descriptionKey: 'chain_tools.tools.woofi_pro.description',
		url: 'https://pro.woo.org',
		icon: LineChart,
		category: 'defi',
		tags: ['perpetuals', 'trading', 'orderbook', 'derivatives'],
		chains: ['Arbitrum'],
		color: '#00C8B0'
	},

	// ========== MORE NFT TOOLS ==========
	{
		id: 'sudoswap',
		name: 'Sudoswap',
		descriptionKey: 'chain_tools.tools.sudoswap.description',
		url: 'https://sudoswap.xyz',
		icon: Image,
		category: 'nft',
		tags: ['amm', 'nft', 'liquidity', 'trading'],
		chains: ['Ethereum'],
		color: '#0066FF'
	},
	{
		id: 'caviar',
		name: 'Caviar',
		descriptionKey: 'chain_tools.tools.caviar.description',
		url: 'https://goerli.caviar.sh',
		icon: Image,
		category: 'nft',
		tags: ['amm', 'nft', 'fractionalization', 'liquidity'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'nftx',
		name: 'NFTX',
		descriptionKey: 'chain_tools.tools.nftx.description',
		url: 'https://nftx.io',
		icon: Image,
		category: 'nft',
		tags: ['vault', 'nft', 'liquidity', 'fractionalization'],
		chains: ['Ethereum'],
		color: '#FC5C7D'
	},
	{
		id: 'floor-protocol',
		name: 'Floor Protocol',
		descriptionKey: 'chain_tools.tools.floor_protocol.description',
		url: 'https://flooring.io',
		icon: Image,
		category: 'nft',
		tags: ['fractionalization', 'nft', 'micro-tokens', 'liquidity'],
		chains: ['Ethereum'],
		color: '#7C3AED'
	},
	{
		id: 'tessera',
		name: 'Tessera',
		descriptionKey: 'chain_tools.tools.tessera.description',
		url: 'https://tessera.co',
		icon: Image,
		category: 'nft',
		tags: ['fractionalization', 'nft', 'collective', 'ownership'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'premint',
		name: 'PREMINT',
		descriptionKey: 'chain_tools.tools.premint.description',
		url: 'https://www.premint.xyz',
		icon: Image,
		category: 'nft',
		tags: ['allowlist', 'nft', 'whitelist', 'launch'],
		chains: ['Ethereum', 'Polygon'],
		color: '#FF6B6B'
	},
	{
		id: 'bueno',
		name: 'Bueno',
		descriptionKey: 'chain_tools.tools.bueno.description',
		url: 'https://bueno.art',
		icon: Image,
		category: 'nft',
		tags: ['generator', 'nft', 'art', 'no-code'],
		color: '#0A0A0A'
	},
	{
		id: 'highlight',
		name: 'Highlight',
		descriptionKey: 'chain_tools.tools.highlight.description',
		url: 'https://highlight.xyz',
		icon: Image,
		category: 'nft',
		tags: ['minting', 'nft', 'creator', 'tools'],
		chains: ['Ethereum', 'Base', 'Polygon', 'Arbitrum', 'Optimism'],
		color: '#000000'
	},
	{
		id: 'transient-labs',
		name: 'Transient Labs',
		descriptionKey: 'chain_tools.tools.transient_labs.description',
		url: 'https://transientlabs.xyz',
		icon: Image,
		category: 'nft',
		tags: ['smart-contract', 'nft', 'creator', 'tools'],
		chains: ['Ethereum', 'Base', 'Arbitrum'],
		color: '#00D9FF'
	},
	{
		id: 'decent-xyz',
		name: 'Decent',
		descriptionKey: 'chain_tools.tools.decent_xyz.description',
		url: 'https://decent.xyz',
		icon: Image,
		category: 'nft',
		tags: ['cross-chain', 'nft', 'minting', 'bridge'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#6366F1'
	},
	{
		id: 'tokenproof',
		name: 'Tokenproof',
		descriptionKey: 'chain_tools.tools.tokenproof.description',
		url: 'https://tokenproof.xyz',
		icon: BadgeCheck,
		category: 'nft',
		tags: ['verification', 'nft', 'events', 'gating'],
		color: '#8B5CF6'
	},
	{
		id: 'delegate-cash',
		name: 'Delegate.cash',
		descriptionKey: 'chain_tools.tools.delegate_cash.description',
		url: 'https://delegate.cash',
		icon: Link2,
		category: 'nft',
		tags: ['delegation', 'nft', 'security', 'hot-wallet'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#000000'
	},
	{
		id: 'warm-xyz',
		name: 'Warm.xyz',
		descriptionKey: 'chain_tools.tools.warm_xyz.description',
		url: 'https://warm.xyz',
		icon: Link2,
		category: 'nft',
		tags: ['delegation', 'nft', 'linking', 'wallets'],
		chains: ['Ethereum'],
		color: '#FF6B6B'
	},
	{
		id: 'layer3-quests',
		name: 'Layer3',
		descriptionKey: 'chain_tools.tools.layer3_quests.description',
		url: 'https://layer3.xyz',
		icon: Trophy,
		category: 'nft',
		tags: ['quests', 'learn', 'earn', 'credentials'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#4F46E5'
	},
	{
		id: 'rabbithole',
		name: 'RabbitHole',
		descriptionKey: 'chain_tools.tools.rabbithole.description',
		url: 'https://rabbithole.gg',
		icon: Trophy,
		category: 'nft',
		tags: ['quests', 'credentials', 'learn', 'earn'],
		chains: ['Ethereum', 'Polygon', 'Optimism', 'Arbitrum'],
		color: '#8B5CF6'
	},

	// ========== MORE ANALYTICS ==========
	{
		id: 'flipside',
		name: 'Flipside Crypto',
		descriptionKey: 'chain_tools.tools.flipside.description',
		url: 'https://flipsidecrypto.xyz',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'sql', 'data', 'dashboard'],
		color: '#00C2FF'
	},
	{
		id: 'footprint',
		name: 'Footprint Analytics',
		descriptionKey: 'chain_tools.tools.footprint.description',
		url: 'https://www.footprint.network',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'no-code', 'dashboard', 'data'],
		color: '#5C5CFF'
	},
	{
		id: 'defi-pulse',
		name: 'DeFi Pulse',
		descriptionKey: 'chain_tools.tools.defi_pulse.description',
		url: 'https://defipulse.com',
		icon: Activity,
		category: 'analytics',
		tags: ['tvl', 'defi', 'rankings', 'analytics'],
		color: '#00D395'
	},
	{
		id: 'l2fees',
		name: 'L2Fees',
		descriptionKey: 'chain_tools.tools.l2fees.description',
		url: 'https://l2fees.info',
		icon: BarChart3,
		category: 'analytics',
		tags: ['l2', 'fees', 'comparison', 'gas'],
		color: '#4F46E5'
	},
	{
		id: 'cryptofees',
		name: 'CryptoFees',
		descriptionKey: 'chain_tools.tools.cryptofees.description',
		url: 'https://cryptofees.info',
		icon: BarChart3,
		category: 'analytics',
		tags: ['fees', 'revenue', 'protocols', 'analytics'],
		color: '#00D395'
	},
	{
		id: 'openbb',
		name: 'OpenBB',
		descriptionKey: 'chain_tools.tools.openbb.description',
		url: 'https://openbb.co',
		icon: Terminal,
		category: 'analytics',
		tags: ['terminal', 'research', 'analysis', 'open-source'],
		color: '#14B8A6'
	},
	{
		id: 'watchers',
		name: 'Watchers',
		descriptionKey: 'chain_tools.tools.watchers.description',
		url: 'https://watchers.pro',
		icon: Eye,
		category: 'analytics',
		tags: ['whale', 'tracking', 'alerts', 'wallets'],
		color: '#6366F1'
	},
	{
		id: 'cielo',
		name: 'Cielo',
		descriptionKey: 'chain_tools.tools.cielo.description',
		url: 'https://cielo.finance',
		icon: Eye,
		category: 'analytics',
		tags: ['wallet', 'tracking', 'feed', 'social'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#3B82F6'
	},
	{
		id: 'zerion-api',
		name: 'Zerion DeFi SDK',
		descriptionKey: 'chain_tools.tools.zerion_api.description',
		url: 'https://developers.zerion.io',
		icon: Code,
		category: 'analytics',
		tags: ['api', 'portfolio', 'defi', 'sdk'],
		color: '#2962FF'
	},
	{
		id: 'sim-farm',
		name: 'DeFi Simulator',
		descriptionKey: 'chain_tools.tools.sim_farm.description',
		url: 'https://simfarm.co',
		icon: Activity,
		category: 'analytics',
		tags: ['simulation', 'yield', 'farming', 'calculator'],
		color: '#10B981'
	},

	// ========== MORE SECURITY ==========
	{
		id: 'hexagate',
		name: 'Hexagate',
		descriptionKey: 'chain_tools.tools.hexagate.description',
		url: 'https://www.hexagate.com',
		icon: Shield,
		category: 'security',
		tags: ['monitoring', 'security', 'real-time', 'threats'],
		color: '#6366F1'
	},
	{
		id: 'hypernative',
		name: 'Hypernative',
		descriptionKey: 'chain_tools.tools.hypernative.description',
		url: 'https://www.hypernative.io',
		icon: Shield,
		category: 'security',
		tags: ['monitoring', 'security', 'prevention', 'ai'],
		color: '#14B8A6'
	},
	{
		id: 'chainalert',
		name: 'ChainAlert',
		descriptionKey: 'chain_tools.tools.chainalert.description',
		url: 'https://chainalert.io',
		icon: Bell,
		category: 'security',
		tags: ['alerts', 'monitoring', 'security', 'notifications'],
		color: '#EF4444'
	},
	{
		id: 'webacy',
		name: 'Webacy',
		descriptionKey: 'chain_tools.tools.webacy.description',
		url: 'https://webacy.com',
		icon: Shield,
		category: 'security',
		tags: ['backup', 'recovery', 'inheritance', 'wallet-safety'],
		color: '#8B5CF6'
	},
	{
		id: 'harpie',
		name: 'Harpie',
		descriptionKey: 'chain_tools.tools.harpie.description',
		url: 'https://harpie.io',
		icon: Shield,
		category: 'security',
		tags: ['firewall', 'protection', 'scam', 'wallet-security'],
		color: '#00D395'
	},
	{
		id: 'blowfish',
		name: 'Blowfish',
		descriptionKey: 'chain_tools.tools.blowfish.description',
		url: 'https://blowfish.xyz',
		icon: Shield,
		category: 'security',
		tags: ['simulation', 'transaction', 'preview', 'protection'],
		color: '#3B82F6'
	},
	{
		id: 'stelo',
		name: 'Stelo',
		descriptionKey: 'chain_tools.tools.stelo.description',
		url: 'https://stelolabs.com',
		icon: Shield,
		category: 'security',
		tags: ['transaction', 'preview', 'simulation', 'security'],
		color: '#000000'
	},
	{
		id: 'fire',
		name: 'Fire',
		descriptionKey: 'chain_tools.tools.fire.description',
		url: 'https://www.joinfire.xyz',
		icon: Flame,
		category: 'security',
		tags: ['transaction', 'simulation', 'protection', 'wallet'],
		color: '#EF4444'
	},
	{
		id: 'wallet-guard',
		name: 'Wallet Guard',
		descriptionKey: 'chain_tools.tools.wallet_guard.description',
		url: 'https://www.walletguard.app',
		icon: Shield,
		category: 'security',
		tags: ['extension', 'protection', 'phishing', 'scam'],
		color: '#22C55E'
	},
	{
		id: 'scamsniffer',
		name: 'ScamSniffer',
		descriptionKey: 'chain_tools.tools.scamsniffer.description',
		url: 'https://scamsniffer.io',
		icon: Bug,
		category: 'security',
		tags: ['scam', 'detection', 'phishing', 'protection'],
		color: '#EF4444'
	},
	{
		id: 'peckshield',
		name: 'PeckShield',
		descriptionKey: 'chain_tools.tools.peckshield.description',
		url: 'https://peckshield.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'analysis'],
		color: '#0052FF'
	},
	{
		id: 'slowmist',
		name: 'SlowMist',
		descriptionKey: 'chain_tools.tools.slowmist.description',
		url: 'https://www.slowmist.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'investigation'],
		color: '#1E40AF'
	},
	{
		id: 'quantstamp',
		name: 'Quantstamp',
		descriptionKey: 'chain_tools.tools.quantstamp.description',
		url: 'https://quantstamp.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'enterprise'],
		color: '#2962FF'
	},
	{
		id: 'consensys-diligence',
		name: 'ConsenSys Diligence',
		descriptionKey: 'chain_tools.tools.consensys_diligence.description',
		url: 'https://consensys.io/diligence',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'fuzzing', 'tools'],
		color: '#1E40AF'
	},
	{
		id: 'spearbit',
		name: 'Spearbit',
		descriptionKey: 'chain_tools.tools.spearbit.description',
		url: 'https://spearbit.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'security', 'research', 'experts'],
		color: '#EF4444'
	},

	// ========== MORE DEV TOOLS ==========
	{
		id: 'scaffold-eth',
		name: 'Scaffold-ETH',
		descriptionKey: 'chain_tools.tools.scaffold_eth.description',
		url: 'https://scaffoldeth.io',
		icon: Terminal,
		category: 'dev',
		tags: ['framework', 'starter-kit', 'rapid', 'prototyping'],
		color: '#10B981'
	},
	{
		id: 'create-eth-app',
		name: 'Create Eth App',
		descriptionKey: 'chain_tools.tools.create_eth_app.description',
		url: 'https://github.com/WalletConnect/create-eth-app',
		icon: Terminal,
		category: 'dev',
		tags: ['cli', 'boilerplate', 'react', 'starter'],
		color: '#000000'
	},
	{
		id: 'cookbook-dev',
		name: 'Cookbook.dev',
		descriptionKey: 'chain_tools.tools.cookbook_dev.description',
		url: 'https://www.cookbook.dev',
		icon: BookOpen,
		category: 'dev',
		tags: ['contracts', 'templates', 'search', 'registry'],
		color: '#8B5CF6'
	},
	{
		id: 'solidity-by-example',
		name: 'Solidity by Example',
		descriptionKey: 'chain_tools.tools.solidity_by_example.description',
		url: 'https://solidity-by-example.org',
		icon: BookOpen,
		category: 'dev',
		tags: ['learning', 'examples', 'solidity', 'tutorials'],
		color: '#363636'
	},
	{
		id: 'speedrun-ethereum',
		name: 'SpeedRunEthereum',
		descriptionKey: 'chain_tools.tools.speedrun_ethereum.description',
		url: 'https://speedrunethereum.com',
		icon: Zap,
		category: 'dev',
		tags: ['learning', 'challenges', 'solidity', 'quests'],
		color: '#EF4444'
	},
	{
		id: 'eth-build',
		name: 'ETH.Build',
		descriptionKey: 'chain_tools.tools.eth_build.description',
		url: 'https://eth.build',
		icon: Braces,
		category: 'dev',
		tags: ['visual', 'sandbox', 'learning', 'education'],
		color: '#6366F1'
	},
	{
		id: 'crypto-zombies',
		name: 'CryptoZombies',
		descriptionKey: 'chain_tools.tools.crypto_zombies.description',
		url: 'https://cryptozombies.io',
		icon: BookOpen,
		category: 'dev',
		tags: ['learning', 'game', 'solidity', 'tutorials'],
		color: '#14B8A6'
	},
	{
		id: 'useweb3',
		name: 'useWeb3',
		descriptionKey: 'chain_tools.tools.useweb3.description',
		url: 'https://www.useweb3.xyz',
		icon: BookOpen,
		category: 'dev',
		tags: ['resources', 'learning', 'curated', 'tutorials'],
		color: '#0052FF'
	},
	{
		id: 'buildspace',
		name: 'Buildspace',
		descriptionKey: 'chain_tools.tools.buildspace.description',
		url: 'https://buildspace.so',
		icon: Rocket,
		category: 'dev',
		tags: ['learning', 'projects', 'community', 'web3'],
		color: '#8B5CF6'
	},
	{
		id: 'pointer',
		name: 'Pointer',
		descriptionKey: 'chain_tools.tools.pointer.description',
		url: 'https://www.pointer.gg',
		icon: BookOpen,
		category: 'dev',
		tags: ['learning', 'tutorials', 'earn', 'coding'],
		color: '#6366F1'
	},
	{
		id: 'chainide',
		name: 'ChainIDE',
		descriptionKey: 'chain_tools.tools.chainide.description',
		url: 'https://chainide.com',
		icon: Code,
		category: 'dev',
		tags: ['ide', 'multi-chain', 'development', 'cloud'],
		color: '#3B82F6'
	},
	{
		id: 'atlas-ide',
		name: 'Atlas',
		descriptionKey: 'chain_tools.tools.atlas_ide.description',
		url: 'https://www.atlaszk.com',
		icon: Code,
		category: 'dev',
		tags: ['ide', 'zk', 'development', 'cloud'],
		color: '#000000'
	},
	{
		id: 'constructor',
		name: 'Constructor',
		descriptionKey: 'chain_tools.tools.constructor.description',
		url: 'https://constructor.tech',
		icon: Code,
		category: 'dev',
		tags: ['no-code', 'smart-contract', 'builder', 'visual'],
		color: '#6366F1'
	},
	{
		id: 'bunzz',
		name: 'Bunzz',
		descriptionKey: 'chain_tools.tools.bunzz.description',
		url: 'https://bunzz.dev',
		icon: Code,
		category: 'dev',
		tags: ['no-code', 'smart-contract', 'deployment', 'modules'],
		color: '#FFD700'
	},
	{
		id: 'crossmint',
		name: 'Crossmint',
		descriptionKey: 'chain_tools.tools.crossmint.description',
		url: 'https://crossmint.com',
		icon: CreditCard,
		category: 'dev',
		tags: ['nft', 'api', 'fiat', 'minting'],
		chains: ['Ethereum', 'Polygon', 'Solana'],
		color: '#22C55E'
	},
	{
		id: 'paper-xyz',
		name: 'Paper',
		descriptionKey: 'chain_tools.tools.paper_xyz.description',
		url: 'https://paper.xyz',
		icon: CreditCard,
		category: 'dev',
		tags: ['nft', 'checkout', 'fiat', 'minting'],
		chains: ['Ethereum', 'Polygon', 'Avalanche'],
		color: '#000000'
	},

	// ========== MORE BRIDGE ==========
	{
		id: 'li-fi',
		name: 'LI.FI',
		descriptionKey: 'chain_tools.tools.li_fi.description',
		url: 'https://li.fi',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['aggregator', 'bridge', 'multi-chain', 'swap'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Avalanche'],
		color: '#BF40BF'
	},
	{
		id: 'bungee',
		name: 'Bungee',
		descriptionKey: 'chain_tools.tools.bungee.description',
		url: 'https://bungee.exchange',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['aggregator', 'bridge', 'refuel', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#6366F1'
	},
	{
		id: 'jumper',
		name: 'Jumper',
		descriptionKey: 'chain_tools.tools.jumper.description',
		url: 'https://jumper.exchange',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['aggregator', 'bridge', 'lifi', 'multi-chain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Base'],
		color: '#8B5CF6'
	},
	{
		id: 'superbridge',
		name: 'Superbridge',
		descriptionKey: 'chain_tools.tools.superbridge.description',
		url: 'https://superbridge.app',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'optimism', 'base', 'l2'],
		chains: ['Ethereum', 'Optimism', 'Base'],
		color: '#EF4444'
	},
	{
		id: 'relay',
		name: 'Relay',
		descriptionKey: 'chain_tools.tools.relay.description',
		url: 'https://relay.link',
		icon: Zap,
		category: 'bridge',
		tags: ['bridge', 'instant', 'cross-chain', 'fast'],
		chains: ['Ethereum', 'Base', 'Zora', 'Optimism'],
		color: '#3B82F6'
	},
	{
		id: 'symbiosis',
		name: 'Symbiosis',
		descriptionKey: 'chain_tools.tools.symbiosis.description',
		url: 'https://symbiosis.finance',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'dex', 'cross-chain', 'liquidity'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Avalanche', 'Arbitrum'],
		color: '#00FF94'
	},
	{
		id: 'dln',
		name: 'DLN',
		descriptionKey: 'chain_tools.tools.dln.description',
		url: 'https://dln.trade',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'debridge', 'cross-chain', 'limit-orders'],
		chains: ['Ethereum', 'BSC', 'Polygon', 'Arbitrum', 'Solana'],
		color: '#BF40BF'
	},
	{
		id: 'circle-cctp',
		name: 'Circle CCTP',
		descriptionKey: 'chain_tools.tools.circle_cctp.description',
		url: 'https://www.circle.com/en/cross-chain-transfer-protocol',
		icon: ArrowLeftRight,
		category: 'bridge',
		tags: ['bridge', 'usdc', 'native', 'burn-mint'],
		chains: ['Ethereum', 'Avalanche', 'Arbitrum', 'Optimism', 'Base'],
		color: '#2775CA'
	},

	// ========== MORE WALLET ==========
	{
		id: 'ambire',
		name: 'Ambire Wallet',
		descriptionKey: 'chain_tools.tools.ambire.description',
		url: 'https://ambire.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['smart-wallet', 'email-login', 'gasless', 'multi-chain'],
		color: '#8B5CF6'
	},
	{
		id: 'obvious',
		name: 'Obvious',
		descriptionKey: 'chain_tools.tools.obvious.description',
		url: 'https://obvious.technology',
		icon: Wallet,
		category: 'wallet',
		tags: ['smart-wallet', 'account-abstraction', 'social-recovery'],
		color: '#000000'
	},
	{
		id: 'soul-wallet',
		name: 'Soul Wallet',
		descriptionKey: 'chain_tools.tools.soul_wallet.description',
		url: 'https://soulwallet.io',
		icon: Wallet,
		category: 'wallet',
		tags: ['smart-wallet', 'erc-4337', 'account-abstraction', 'modular'],
		color: '#6366F1'
	},
	{
		id: 'patch-wallet',
		name: 'Patch Wallet',
		descriptionKey: 'chain_tools.tools.patch_wallet.description',
		url: 'https://patchwallet.com',
		icon: Wallet,
		category: 'wallet',
		tags: ['smart-wallet', 'social', 'email', 'embedded'],
		color: '#10B981'
	},
	{
		id: 'pimlico',
		name: 'Pimlico',
		descriptionKey: 'chain_tools.tools.pimlico.description',
		url: 'https://pimlico.io',
		icon: Settings,
		category: 'wallet',
		tags: ['bundler', 'paymaster', 'erc-4337', 'infrastructure'],
		color: '#8B5CF6'
	},
	{
		id: 'stackup',
		name: 'Stackup',
		descriptionKey: 'chain_tools.tools.stackup.description',
		url: 'https://stackup.sh',
		icon: Settings,
		category: 'wallet',
		tags: ['bundler', 'paymaster', 'erc-4337', 'sdk'],
		color: '#3B82F6'
	},
	{
		id: 'biconomy',
		name: 'Biconomy',
		descriptionKey: 'chain_tools.tools.biconomy.description',
		url: 'https://biconomy.io',
		icon: Settings,
		category: 'wallet',
		tags: ['account-abstraction', 'gasless', 'sdk', 'paymaster'],
		color: '#FF4E17'
	},
	{
		id: 'alchemy-aa',
		name: 'Alchemy Account Kit',
		descriptionKey: 'chain_tools.tools.alchemy_aa.description',
		url: 'https://accountkit.alchemy.com',
		icon: Settings,
		category: 'wallet',
		tags: ['account-abstraction', 'sdk', 'smart-wallet', 'infrastructure'],
		color: '#0C5ADB'
	},
	{
		id: 'zerodev',
		name: 'ZeroDev',
		descriptionKey: 'chain_tools.tools.zerodev.description',
		url: 'https://zerodev.app',
		icon: Settings,
		category: 'wallet',
		tags: ['account-abstraction', 'sdk', 'kernel', 'modular'],
		color: '#6366F1'
	},
	{
		id: 'particle-network',
		name: 'Particle Network',
		descriptionKey: 'chain_tools.tools.particle_network.description',
		url: 'https://particle.network',
		icon: Settings,
		category: 'wallet',
		tags: ['wallet-as-a-service', 'social-login', 'sdk', 'embedded'],
		color: '#9945FF'
	},

	// ========== MORE EXPLORER ==========
	{
		id: 'oklink',
		name: 'OKLink',
		descriptionKey: 'chain_tools.tools.oklink.description',
		url: 'https://www.oklink.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'multi-chain', 'analytics', 'okx'],
		color: '#000000'
	},
	{
		id: 'routescan',
		name: 'Routescan',
		descriptionKey: 'chain_tools.tools.routescan.description',
		url: 'https://routescan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'multi-chain', 'unified', 'search'],
		color: '#3B82F6'
	},
	{
		id: 'onceupon',
		name: 'Once Upon',
		descriptionKey: 'chain_tools.tools.onceupon.description',
		url: 'https://onceupon.gg',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'human-readable', 'transactions', 'social'],
		color: '#8B5CF6'
	},
	{
		id: 'evm-explorer',
		name: 'EVM Explorer',
		descriptionKey: 'chain_tools.tools.evm_explorer.description',
		url: 'https://evmexplorer.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'multi-chain', 'unified', 'evm'],
		color: '#6366F1'
	},
	{
		id: 'anyabi',
		name: 'AnyABI',
		descriptionKey: 'chain_tools.tools.anyabi.description',
		url: 'https://anyabi.xyz',
		icon: FileCode,
		category: 'explorer',
		tags: ['abi', 'decoder', 'lookup', 'contracts'],
		color: '#000000'
	},
	{
		id: 'samczsun-explorer',
		name: 'sam.wtf',
		descriptionKey: 'chain_tools.tools.samczsun_explorer.description',
		url: 'https://tx.eth.samczsun.com',
		icon: Search,
		category: 'explorer',
		tags: ['transaction', 'tracer', 'debugger', 'analysis'],
		color: '#EF4444'
	},

	// ========== MORE DAO ==========
	{
		id: 'commonwealth',
		name: 'Commonwealth',
		descriptionKey: 'chain_tools.tools.commonwealth.description',
		url: 'https://commonwealth.im',
		icon: Users,
		category: 'dao',
		tags: ['governance', 'discussion', 'community', 'forum'],
		color: '#6366F1'
	},
	{
		id: 'jokedao',
		name: 'JokeDAO',
		descriptionKey: 'chain_tools.tools.jokedao.description',
		url: 'https://www.jokedao.io',
		icon: Vote,
		category: 'dao',
		tags: ['governance', 'contests', 'voting', 'community'],
		color: '#EC4899'
	},
	{
		id: 'nouns-builder',
		name: 'Nouns Builder',
		descriptionKey: 'chain_tools.tools.nouns_builder.description',
		url: 'https://nouns.build',
		icon: Vote,
		category: 'dao',
		tags: ['dao', 'builder', 'nouns', 'governance'],
		chains: ['Ethereum', 'Base', 'Zora'],
		color: '#EF4444'
	},
	{
		id: 'hats-protocol',
		name: 'Hats Protocol',
		descriptionKey: 'chain_tools.tools.hats_protocol.description',
		url: 'https://www.hatsprotocol.xyz',
		icon: Users,
		category: 'dao',
		tags: ['roles', 'permissions', 'dao', 'organization'],
		color: '#8B5CF6'
	},
	{
		id: 'llama',
		name: 'Llama',
		descriptionKey: 'chain_tools.tools.llama.description',
		url: 'https://llama.xyz',
		icon: Building2,
		category: 'dao',
		tags: ['governance', 'operations', 'treasury', 'services'],
		color: '#3B82F6'
	},
	{
		id: 'utopia-dao',
		name: 'Utopia',
		descriptionKey: 'chain_tools.tools.utopia_dao.description',
		url: 'https://www.utopialabs.com',
		icon: Building2,
		category: 'dao',
		tags: ['payroll', 'treasury', 'operations', 'payments'],
		color: '#5856D6'
	},

	// ========== MORE INFRA ==========
	{
		id: 'grove',
		name: 'Grove (POKT)',
		descriptionKey: 'chain_tools.tools.grove.description',
		url: 'https://grove.city',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'decentralized', 'relay', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#10B981'
	},
	{
		id: 'drpc',
		name: 'dRPC',
		descriptionKey: 'chain_tools.tools.drpc.description',
		url: 'https://drpc.org',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'decentralized', 'multi-chain', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#6366F1'
	},
	{
		id: 'nodies',
		name: 'Nodies',
		descriptionKey: 'chain_tools.tools.nodies.description',
		url: 'https://nodies.app',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'node', 'multi-chain', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Avalanche'],
		color: '#EF4444'
	},
	{
		id: 'llamanodes',
		name: 'LlamaNodes',
		descriptionKey: 'chain_tools.tools.llamanodes.description',
		url: 'https://llamanodes.com',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'privacy', 'multi-chain', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BSC'],
		color: '#14B8A6'
	},
	{
		id: 'tenderly-node',
		name: 'Tenderly Node',
		descriptionKey: 'chain_tools.tools.tenderly_node.description',
		url: 'https://tenderly.co/web3-gateway',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'node', 'simulation', 'infrastructure'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#7C3AED'
	},
	{
		id: 'getblock',
		name: 'GetBlock',
		descriptionKey: 'chain_tools.tools.getblock.description',
		url: 'https://getblock.io',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'node', 'multi-chain', 'infrastructure'],
		color: '#FF4444'
	},
	{
		id: 'public-node',
		name: 'PublicNode',
		descriptionKey: 'chain_tools.tools.public_node.description',
		url: 'https://publicnode.com',
		icon: Server,
		category: 'infra',
		tags: ['rpc', 'free', 'public', 'infrastructure'],
		color: '#22C55E'
	},
	{
		id: 'flashbots-protect',
		name: 'Flashbots Protect',
		descriptionKey: 'chain_tools.tools.flashbots_protect.description',
		url: 'https://protect.flashbots.net',
		icon: Shield,
		category: 'infra',
		tags: ['mev', 'protection', 'rpc', 'privacy'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'mev-blocker',
		name: 'MEV Blocker',
		descriptionKey: 'chain_tools.tools.mev_blocker.description',
		url: 'https://mevblocker.io',
		icon: Shield,
		category: 'infra',
		tags: ['mev', 'protection', 'rpc', 'rebates'],
		chains: ['Ethereum'],
		color: '#22C55E'
	},

	// ========== MORE LAUNCHPAD ==========
	{
		id: 'bounce',
		name: 'Bounce',
		descriptionKey: 'chain_tools.tools.bounce.description',
		url: 'https://bounce.finance',
		icon: Rocket,
		category: 'launchpad',
		tags: ['auction', 'ido', 'nft', 'launchpad'],
		chains: ['Ethereum', 'BSC', 'Polygon'],
		color: '#2D55FF'
	},
	{
		id: 'tokensoft',
		name: 'Tokensoft',
		descriptionKey: 'chain_tools.tools.tokensoft.description',
		url: 'https://tokensoft.io',
		icon: Rocket,
		category: 'launchpad',
		tags: ['distribution', 'airdrop', 'compliance', 'launch'],
		color: '#4F46E5'
	},
	{
		id: 'hedgey',
		name: 'Hedgey',
		descriptionKey: 'chain_tools.tools.hedgey.description',
		url: 'https://hedgey.finance',
		icon: Lock,
		category: 'launchpad',
		tags: ['vesting', 'lockups', 'token', 'distribution'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base'],
		color: '#8B5CF6'
	},
	{
		id: 'magna',
		name: 'Magna',
		descriptionKey: 'chain_tools.tools.magna.description',
		url: 'https://magna.so',
		icon: Lock,
		category: 'launchpad',
		tags: ['vesting', 'token', 'management', 'distribution'],
		color: '#3B82F6'
	},
	{
		id: 'superfluid-vesting',
		name: 'Superfluid Vesting',
		descriptionKey: 'chain_tools.tools.superfluid_vesting.description',
		url: 'https://www.superfluid.finance/vesting',
		icon: Lock,
		category: 'launchpad',
		tags: ['vesting', 'streaming', 'token', 'continuous'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#10B981'
	},

	// ========== MORE IDENTITY ==========
	{
		id: 'talentprotocol',
		name: 'Talent Protocol',
		descriptionKey: 'chain_tools.tools.talentprotocol.description',
		url: 'https://talentprotocol.com',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['reputation', 'builder-score', 'credentials', 'talent'],
		color: '#6366F1'
	},
	{
		id: 'phi',
		name: 'Phi',
		descriptionKey: 'chain_tools.tools.phi.description',
		url: 'https://philand.xyz',
		icon: Globe,
		category: 'identity',
		tags: ['metaverse', 'identity', 'land', 'credentials'],
		color: '#3B82F6'
	},
	{
		id: 'otterspace',
		name: 'Otterspace',
		descriptionKey: 'chain_tools.tools.otterspace.description',
		url: 'https://otterspace.xyz',
		icon: BadgeCheck,
		category: 'identity',
		tags: ['badges', 'soulbound', 'membership', 'dao'],
		color: '#10B981'
	},
	{
		id: 'disco',
		name: 'Disco',
		descriptionKey: 'chain_tools.tools.disco.description',
		url: 'https://disco.xyz',
		icon: Fingerprint,
		category: 'identity',
		tags: ['credentials', 'data-backpack', 'identity', 'verifiable'],
		color: '#8B5CF6'
	},
	{
		id: 'holonym',
		name: 'Holonym',
		descriptionKey: 'chain_tools.tools.holonym.description',
		url: 'https://holonym.id',
		icon: Fingerprint,
		category: 'identity',
		tags: ['privacy', 'identity', 'zk', 'verification'],
		color: '#14B8A6'
	},
	{
		id: 'anima',
		name: 'Anima',
		descriptionKey: 'chain_tools.tools.anima.description',
		url: 'https://anima.io',
		icon: Fingerprint,
		category: 'identity',
		tags: ['biometric', 'identity', 'verification', 'sybil'],
		color: '#6366F1'
	},

	// ========== MORE SOCIAL ==========
	{
		id: 'link3',
		name: 'Link3',
		descriptionKey: 'chain_tools.tools.link3.description',
		url: 'https://link3.to',
		icon: Share2,
		category: 'social',
		tags: ['events', 'credentials', 'social', 'cyberconnect'],
		color: '#10B981'
	},
	{
		id: 'kiwi-news',
		name: 'Kiwi News',
		descriptionKey: 'chain_tools.tools.kiwi_news.description',
		url: 'https://news.kiwistand.com',
		icon: Newspaper,
		category: 'social',
		tags: ['news', 'curation', 'community', 'web3'],
		color: '#22C55E'
	},
	{
		id: 'orb-app',
		name: 'Orb',
		descriptionKey: 'chain_tools.tools.orb_app.description',
		url: 'https://orb.ac',
		icon: MessageCircle,
		category: 'social',
		tags: ['lens', 'social', 'professional', 'web3'],
		color: '#8B5CF6'
	},
	{
		id: 'buttrfly',
		name: 'Buttrfly',
		descriptionKey: 'chain_tools.tools.buttrfly.description',
		url: 'https://buttrfly.app',
		icon: MessageCircle,
		category: 'social',
		tags: ['lens', 'social', 'aggregator', 'cross-platform'],
		color: '#EC4899'
	},
	{
		id: 'tape',
		name: 'Tape',
		descriptionKey: 'chain_tools.tools.tape.description',
		url: 'https://tape.xyz',
		icon: Podcast,
		category: 'social',
		tags: ['video', 'lens', 'decentralized', 'creator'],
		color: '#000000'
	},
	{
		id: 'unlonely',
		name: 'Unlonely',
		descriptionKey: 'chain_tools.tools.unlonely.description',
		url: 'https://www.unlonely.app',
		icon: Podcast,
		category: 'social',
		tags: ['streaming', 'live', 'web3', 'community'],
		color: '#15F5BA'
	},

	// ========== MORE L2 ==========
	{
		id: 'l2-marathon',
		name: 'L2 Marathon',
		descriptionKey: 'chain_tools.tools.l2_marathon.description',
		url: 'https://l2marathon.com',
		icon: Layers2,
		category: 'l2',
		tags: ['analytics', 'comparison', 'l2', 'metrics'],
		color: '#6366F1'
	},
	{
		id: 'chainlist-l2',
		name: 'Chainlist',
		descriptionKey: 'chain_tools.tools.chainlist_l2.description',
		url: 'https://chainlist.org',
		icon: Globe,
		category: 'l2',
		tags: ['rpc', 'chainid', 'networks', 'add-network'],
		color: '#3B82F6'
	},
	{
		id: 'op-stack',
		name: 'OP Stack',
		descriptionKey: 'chain_tools.tools.op_stack.description',
		url: 'https://stack.optimism.io',
		icon: Layers2,
		category: 'l2',
		tags: ['framework', 'rollup', 'modular', 'superchain'],
		color: '#EF4444'
	},
	{
		id: 'orbit-chain',
		name: 'Arbitrum Orbit',
		descriptionKey: 'chain_tools.tools.orbit_chain.description',
		url: 'https://orbit.arbitrum.io',
		icon: Layers2,
		category: 'l2',
		tags: ['framework', 'l3', 'customizable', 'arbitrum'],
		color: '#28A0F0'
	},
	{
		id: 'polygon-cdk',
		name: 'Polygon CDK',
		descriptionKey: 'chain_tools.tools.polygon_cdk.description',
		url: 'https://polygon.technology/cdk',
		icon: Layers2,
		category: 'l2',
		tags: ['framework', 'zk', 'modular', 'polygon'],
		color: '#8247E5'
	},
	{
		id: 'zk-stack',
		name: 'ZK Stack',
		descriptionKey: 'chain_tools.tools.zk_stack.description',
		url: 'https://zkstack.io',
		icon: Layers2,
		category: 'l2',
		tags: ['framework', 'zksync', 'hyperchain', 'modular'],
		color: '#4E529A'
	},

	// ========== MORE GAMEFI ==========
	{
		id: 'loot',
		name: 'Loot',
		descriptionKey: 'chain_tools.tools.loot.description',
		url: 'https://www.lootproject.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['nft', 'gaming', 'composable', 'community'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'pixels',
		name: 'Pixels',
		descriptionKey: 'chain_tools.tools.pixels.description',
		url: 'https://www.pixels.xyz',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['game', 'farming', 'social', 'play-to-earn'],
		chains: ['Ronin'],
		color: '#22C55E'
	},
	{
		id: 'parallel',
		name: 'Parallel',
		descriptionKey: 'chain_tools.tools.parallel.description',
		url: 'https://parallel.life',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['tcg', 'sci-fi', 'cards', 'competitive'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'pirate-nation',
		name: 'Pirate Nation',
		descriptionKey: 'chain_tools.tools.pirate_nation.description',
		url: 'https://piratenation.game',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['game', 'rpg', 'fully-onchain', 'adventure'],
		chains: ['Apex (Arbitrum L3)'],
		color: '#8B5CF6'
	},
	{
		id: 'illuvium',
		name: 'Illuvium',
		descriptionKey: 'chain_tools.tools.illuvium.description',
		url: 'https://illuvium.io',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['game', 'rpg', 'auto-battler', 'aaa'],
		chains: ['Immutable X'],
		color: '#9945FF'
	},
	{
		id: 'shrapnel',
		name: 'Shrapnel',
		descriptionKey: 'chain_tools.tools.shrapnel.description',
		url: 'https://www.shrapnel.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['game', 'fps', 'extraction', 'moddable'],
		chains: ['Avalanche'],
		color: '#EF4444'
	},
	{
		id: 'ev-io',
		name: 'Ev.io',
		descriptionKey: 'chain_tools.tools.ev_io.description',
		url: 'https://ev.io',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['game', 'fps', 'browser', 'play-to-earn'],
		chains: ['Solana'],
		color: '#3B82F6'
	},

	// ========== MORE PAYMENTS ==========
	{
		id: 'gnosis-card',
		name: 'Gnosis Card',
		descriptionKey: 'chain_tools.tools.gnosis_card.description',
		url: 'https://gnosispay.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['card', 'visa', 'defi', 'spend'],
		chains: ['Gnosis'],
		color: '#04795B'
	},
	{
		id: 'holyheld',
		name: 'Holyheld',
		descriptionKey: 'chain_tools.tools.holyheld.description',
		url: 'https://holyheld.com',
		icon: CreditCard,
		category: 'payments',
		tags: ['card', 'defi', 'yield', 'spend'],
		color: '#000000'
	},
	{
		id: 'fusepay',
		name: 'Fuse Pay',
		descriptionKey: 'chain_tools.tools.fusepay.description',
		url: 'https://fuse.io/fuse-pay',
		icon: CreditCard,
		category: 'payments',
		tags: ['card', 'fuse', 'spend', 'crypto'],
		chains: ['Fuse'],
		color: '#B4F9A1'
	},
	{
		id: 'loopcrypto',
		name: 'Loop Crypto',
		descriptionKey: 'chain_tools.tools.loopcrypto.description',
		url: 'https://loopcrypto.xyz',
		icon: Receipt,
		category: 'payments',
		tags: ['subscriptions', 'recurring', 'billing', 'automation'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#6366F1'
	},
	{
		id: 'reveel',
		name: 'Reveel',
		descriptionKey: 'chain_tools.tools.reveel.description',
		url: 'https://reveel.co',
		icon: Banknote,
		category: 'payments',
		tags: ['revenue-share', 'splits', 'royalties', 'automation'],
		chains: ['Ethereum', 'Polygon', 'Optimism'],
		color: '#8B5CF6'
	},
	{
		id: 'splits',
		name: '0xSplits',
		descriptionKey: 'chain_tools.tools.splits.description',
		url: 'https://splits.org',
		icon: Banknote,
		category: 'payments',
		tags: ['revenue-share', 'splits', 'payments', 'automation'],
		chains: ['Ethereum', 'Polygon', 'Optimism', 'Base', 'Arbitrum'],
		color: '#10B981'
	},

	// ============================================
	// Meme - Meme coin launch platforms
	// ============================================
	{
		id: 'four_meme',
		name: 'Four.meme',
		descriptionKey: 'chain_tools.tools.four_meme.description',
		url: 'https://four.meme',
		icon: Laugh,
		category: 'meme',
		tags: ['meme', 'token-launch', 'bnb', 'fair-launch'],
		chains: ['BNB Chain'],
		color: '#FBBF24',
		isFeatured: true
	},
	{
		id: 'sunpump',
		name: 'SunPump',
		descriptionKey: 'chain_tools.tools.sunpump.description',
		url: 'https://sunpump.meme',
		icon: Laugh,
		category: 'meme',
		tags: ['meme', 'token-launch', 'tron', 'fair-launch'],
		chains: ['Tron'],
		color: '#FF0000'
	},
	{
		id: 'moonshot',
		name: 'Moonshot',
		descriptionKey: 'chain_tools.tools.moonshot.description',
		url: 'https://moonshot.money',
		icon: Rocket,
		category: 'meme',
		tags: ['meme', 'token-launch', 'solana', 'trading'],
		chains: ['Solana'],
		color: '#7C3AED'
	},
	{
		id: 'ape_store',
		name: 'Ape.Store',
		descriptionKey: 'chain_tools.tools.ape_store.description',
		url: 'https://ape.store',
		icon: Laugh,
		category: 'meme',
		tags: ['meme', 'token-launch', 'ethereum', 'fair-launch'],
		chains: ['Ethereum', 'Base'],
		color: '#10B981'
	},
	{
		id: 'believe',
		name: 'Believe',
		descriptionKey: 'chain_tools.tools.believe.description',
		url: 'https://believe.app',
		icon: Sparkles,
		category: 'meme',
		tags: ['meme', 'social', 'token-launch', 'solana'],
		chains: ['Solana'],
		color: '#EC4899'
	},
	{
		id: 'virtuals',
		name: 'Virtuals Protocol',
		descriptionKey: 'chain_tools.tools.virtuals.description',
		url: 'https://virtuals.io',
		icon: Cpu,
		category: 'meme',
		tags: ['ai-agent', 'token-launch', 'base', 'gaming'],
		chains: ['Base'],
		color: '#3B82F6'
	},
	{
		id: 'clanker',
		name: 'Clanker',
		descriptionKey: 'chain_tools.tools.clanker.description',
		url: 'https://clanker.world',
		icon: Laugh,
		category: 'meme',
		tags: ['meme', 'farcaster', 'base', 'social-token'],
		chains: ['Base'],
		color: '#8B5CF6'
	},
	{
		id: 'dexscreener_moonshot',
		name: 'DEXScreener Moonshot',
		descriptionKey: 'chain_tools.tools.dexscreener_moonshot.description',
		url: 'https://dexscreener.com/moonshot',
		icon: TrendingUp,
		category: 'meme',
		tags: ['meme', 'analytics', 'trending', 'discovery'],
		chains: ['Solana'],
		color: '#22C55E'
	},

	// ============================================
	// Launchpad - Additional 20 tools
	// ============================================
	{
		id: 'lfg_launchpad',
		name: 'LFG Launchpad',
		descriptionKey: 'chain_tools.tools.lfg_launchpad.description',
		url: 'https://lfg.jup.ag',
		icon: Rocket,
		category: 'launchpad',
		tags: ['jupiter', 'solana', 'ido', 'fair-launch'],
		chains: ['Solana'],
		color: '#22C55E'
	},
	{
		id: 'starter',
		name: 'Starter',
		descriptionKey: 'chain_tools.tools.starter.description',
		url: 'https://starter.xyz',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'incubator'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon'],
		color: '#F97316'
	},
	{
		id: 'impossible_finance',
		name: 'Impossible Finance',
		descriptionKey: 'chain_tools.tools.impossible_finance.description',
		url: 'https://impossible.finance',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'incubator', 'staking'],
		chains: ['BNB Chain', 'Ethereum', 'Arbitrum'],
		color: '#3B82F6'
	},
	{
		id: 'gamefi_launchpad',
		name: 'GameFi Launchpad',
		descriptionKey: 'chain_tools.tools.gamefi_launchpad.description',
		url: 'https://gamefi.org/launchpad',
		icon: Gamepad2,
		category: 'launchpad',
		tags: ['gaming', 'igo', 'ido', 'incubator'],
		chains: ['BNB Chain', 'Ethereum', 'Polygon'],
		color: '#EC4899'
	},
	{
		id: 'kommunitas',
		name: 'Kommunitas',
		descriptionKey: 'chain_tools.tools.kommunitas.description',
		url: 'https://kommunitas.net',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'community', 'tier-system'],
		chains: ['Polygon', 'BNB Chain', 'Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'red_kite',
		name: 'Red Kite',
		descriptionKey: 'chain_tools.tools.red_kite.description',
		url: 'https://redkite.polkafoundry.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'polkafoundry'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon'],
		color: '#EF4444'
	},
	{
		id: 'enjinstarter',
		name: 'Enjinstarter',
		descriptionKey: 'chain_tools.tools.enjinstarter.description',
		url: 'https://enjinstarter.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['gaming', 'metaverse', 'ido', 'nft'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon'],
		color: '#7C3AED'
	},
	{
		id: 'trustpad',
		name: 'TrustPad',
		descriptionKey: 'chain_tools.tools.trustpad.description',
		url: 'https://trustpad.io',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'tier-system', 'staking'],
		chains: ['BNB Chain', 'Ethereum', 'Solana'],
		color: '#0EA5E9'
	},
	{
		id: 'spores',
		name: 'Spores Network',
		descriptionKey: 'chain_tools.tools.spores.description',
		url: 'https://spores.app',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'nft', 'incubator'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon'],
		color: '#22C55E'
	},
	{
		id: 'bullperks',
		name: 'BullPerks',
		descriptionKey: 'chain_tools.tools.bullperks.description',
		url: 'https://bullperks.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'vc', 'tier-system'],
		chains: ['BNB Chain', 'Ethereum', 'Polygon'],
		color: '#F59E0B'
	},
	{
		id: 'decubate',
		name: 'Decubate',
		descriptionKey: 'chain_tools.tools.decubate.description',
		url: 'https://decubate.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'vesting', 'crowdfunding'],
		chains: ['BNB Chain', 'Ethereum'],
		color: '#3B82F6'
	},
	{
		id: 'gagarin',
		name: 'Gagarin Launchpad',
		descriptionKey: 'chain_tools.tools.gagarin.description',
		url: 'https://gagarin.world',
		icon: Rocket,
		category: 'launchpad',
		tags: ['ton', 'ido', 'telegram', 'fair-launch'],
		chains: ['TON'],
		color: '#0088CC'
	},
	{
		id: 'tonstarter',
		name: 'TONStarter',
		descriptionKey: 'chain_tools.tools.tonstarter.description',
		url: 'https://tonstarter.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['ton', 'ido', 'telegram', 'incubator'],
		chains: ['TON'],
		color: '#0088CC'
	},
	{
		id: 'raydium_acceleraytor',
		name: 'AcceleRaytor',
		descriptionKey: 'chain_tools.tools.raydium_acceleraytor.description',
		url: 'https://raydium.io/acceleraytor',
		icon: Rocket,
		category: 'launchpad',
		tags: ['solana', 'ido', 'raydium', 'defi'],
		chains: ['Solana'],
		color: '#2DD4BF'
	},
	{
		id: 'meteora_dlmm',
		name: 'Meteora DLMM',
		descriptionKey: 'chain_tools.tools.meteora_dlmm.description',
		url: 'https://app.meteora.ag',
		icon: Droplets,
		category: 'launchpad',
		tags: ['solana', 'liquidity', 'dlmm', 'token-launch'],
		chains: ['Solana'],
		color: '#F97316'
	},
	{
		id: 'orca_whirlpools',
		name: 'Orca Whirlpools',
		descriptionKey: 'chain_tools.tools.orca_whirlpools.description',
		url: 'https://orca.so',
		icon: Droplets,
		category: 'launchpad',
		tags: ['solana', 'liquidity', 'concentrated', 'amm'],
		chains: ['Solana'],
		color: '#FFD700'
	},
	{
		id: 'legion',
		name: 'Legion',
		descriptionKey: 'chain_tools.tools.legion.description',
		url: 'https://legion.cc',
		icon: Rocket,
		category: 'launchpad',
		tags: ['solana', 'ido', 'community', 'fair-launch'],
		chains: ['Solana'],
		color: '#8B5CF6'
	},
	{
		id: 'armada',
		name: 'Armada',
		descriptionKey: 'chain_tools.tools.armada.description',
		url: 'https://armada.so',
		icon: Rocket,
		category: 'launchpad',
		tags: ['solana', 'staking', 'validators', 'infrastructure'],
		chains: ['Solana'],
		color: '#1E3A8A'
	},
	{
		id: 'streamflow',
		name: 'Streamflow',
		descriptionKey: 'chain_tools.tools.streamflow.description',
		url: 'https://streamflow.finance',
		icon: Lock,
		category: 'launchpad',
		tags: ['vesting', 'streaming', 'payroll', 'multichain'],
		chains: ['Solana', 'Ethereum', 'BNB Chain', 'Aptos', 'Sui'],
		color: '#6366F1'
	},
	{
		id: 'vestinglab',
		name: 'VestingLab',
		descriptionKey: 'chain_tools.tools.vestinglab.description',
		url: 'https://vestinglab.io',
		icon: Lock,
		category: 'launchpad',
		tags: ['vesting', 'token-management', 'multichain'],
		chains: ['Ethereum', 'Polygon', 'BNB Chain', 'Arbitrum'],
		color: '#10B981'
	},

	// ============================================
	// Oracle - Price feeds and data oracles
	// ============================================
	{
		id: 'switchboard',
		name: 'Switchboard',
		descriptionKey: 'chain_tools.tools.switchboard.description',
		url: 'https://switchboard.xyz',
		icon: RadioIcon,
		category: 'oracle',
		tags: ['oracle', 'solana', 'vrf', 'price-feeds'],
		chains: ['Solana', 'Aptos', 'Sui', 'CoreDAO'],
		color: '#00D1FF'
	},
	{
		id: 'dia',
		name: 'DIA',
		descriptionKey: 'chain_tools.tools.dia.description',
		url: 'https://diadata.org',
		icon: RadioIcon,
		category: 'oracle',
		tags: ['oracle', 'transparent', 'customizable', 'nft-floor'],
		chains: ['Ethereum', 'Polygon', 'BNB Chain', 'Arbitrum', 'Fantom'],
		color: '#FF6B6B'
	},
	{
		id: 'band_protocol',
		name: 'Band Protocol',
		descriptionKey: 'chain_tools.tools.band_protocol.description',
		url: 'https://bandprotocol.com',
		icon: RadioIcon,
		category: 'oracle',
		tags: ['oracle', 'cross-chain', 'cosmos', 'price-feeds'],
		chains: ['Ethereum', 'BNB Chain', 'Fantom', 'Cosmos'],
		color: '#516AFF'
	},
	{
		id: 'tellor',
		name: 'Tellor',
		descriptionKey: 'chain_tools.tools.tellor.description',
		url: 'https://tellor.io',
		icon: RadioIcon,
		category: 'oracle',
		tags: ['oracle', 'decentralized', 'dispute', 'crypto-native'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#20E19F'
	},

	// ============================================
	// Restaking - Restaking and AVS platforms
	// ============================================
	{
		id: 'symbiotic_restaking',
		name: 'Symbiotic',
		descriptionKey: 'chain_tools.tools.symbiotic_restaking.description',
		url: 'https://symbiotic.fi',
		icon: Repeat2,
		category: 'restaking',
		tags: ['restaking', 'modular', 'permissionless', 'security'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	},
	{
		id: 'karak',
		name: 'Karak',
		descriptionKey: 'chain_tools.tools.karak.description',
		url: 'https://karak.network',
		icon: Repeat2,
		category: 'restaking',
		tags: ['restaking', 'universal', 'multichain', 'security'],
		chains: ['Ethereum', 'Arbitrum', 'BNB Chain'],
		color: '#F97316'
	},
	{
		id: 'ether_fi',
		name: 'Ether.fi',
		descriptionKey: 'chain_tools.tools.ether_fi.description',
		url: 'https://ether.fi',
		icon: Repeat2,
		category: 'restaking',
		tags: ['liquid-restaking', 'eeth', 'non-custodial', 'defi'],
		chains: ['Ethereum'],
		color: '#6366F1',
		isFeatured: true
	},
	{
		id: 'swell',
		name: 'Swell',
		descriptionKey: 'chain_tools.tools.swell.description',
		url: 'https://swellnetwork.io',
		icon: Repeat2,
		category: 'restaking',
		tags: ['liquid-restaking', 'sweth', 'rsweth', 'defi'],
		chains: ['Ethereum'],
		color: '#0EA5E9'
	},

	// ============================================
	// Yield - Yield optimization and farming
	// ============================================
	{
		id: 'equilibria',
		name: 'Equilibria',
		descriptionKey: 'chain_tools.tools.equilibria.description',
		url: 'https://equilibria.fi',
		icon: Sprout,
		category: 'yield',
		tags: ['yield', 'pendle', 'boosted', 'vaults'],
		chains: ['Ethereum', 'Arbitrum', 'BNB Chain'],
		color: '#8B5CF6'
	},

	// ============================================
	// Privacy - Privacy and anonymity tools
	// ============================================
	{
		id: 'railgun',
		name: 'Railgun',
		descriptionKey: 'chain_tools.tools.railgun.description',
		url: 'https://railgun.org',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'zk-snark', 'defi', 'shielded'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'BNB Chain'],
		color: '#2D3748'
	},
	{
		id: 'aztec',
		name: 'Aztec',
		descriptionKey: 'chain_tools.tools.aztec.description',
		url: 'https://aztec.network',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'zk-rollup', 'programmable', 'l2'],
		chains: ['Ethereum'],
		color: '#4A5568'
	},
	{
		id: 'nocturne',
		name: 'Nocturne',
		descriptionKey: 'chain_tools.tools.nocturne.description',
		url: 'https://nocturne.xyz',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'stealth', 'defi', 'ethereum'],
		chains: ['Ethereum'],
		color: '#1A1A2E'
	},
	{
		id: 'umbra',
		name: 'Umbra',
		descriptionKey: 'chain_tools.tools.umbra.description',
		url: 'https://umbra.cash',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'stealth-addresses', 'payments', 'multichain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Gnosis'],
		color: '#553C9A'
	},
	{
		id: 'labyrinth',
		name: 'Labyrinth',
		descriptionKey: 'chain_tools.tools.labyrinth.description',
		url: 'https://labyrinth.technology',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'compliance', 'zkp', 'institutional'],
		chains: ['Ethereum'],
		color: '#0D1117'
	},
	{
		id: 'elusiv',
		name: 'Elusiv',
		descriptionKey: 'chain_tools.tools.elusiv.description',
		url: 'https://elusiv.io',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'solana', 'zk', 'compliant'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'zcash',
		name: 'Zcash',
		descriptionKey: 'chain_tools.tools.zcash.description',
		url: 'https://z.cash',
		icon: EyeOff,
		category: 'privacy',
		tags: ['privacy', 'shielded', 'zk-snark', 'native'],
		chains: ['Zcash'],
		color: '#F4B728'
	},

	// ============================================
	// Data - On-chain data and indexing
	// ============================================
	{
		id: 'the_graph',
		name: 'The Graph',
		descriptionKey: 'chain_tools.tools.the_graph.description',
		url: 'https://thegraph.com',
		icon: DatabaseZap,
		category: 'data',
		tags: ['indexing', 'subgraph', 'api', 'decentralized'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BNB Chain', 'Avalanche'],
		color: '#6747ED',
		isFeatured: true
	},
	{
		id: 'space_and_time',
		name: 'Space and Time',
		descriptionKey: 'chain_tools.tools.space_and_time.description',
		url: 'https://spaceandtime.io',
		icon: DatabaseZap,
		category: 'data',
		tags: ['data-warehouse', 'zk', 'sql', 'verifiable'],
		chains: ['Ethereum', 'Polygon', 'Sui', 'Avalanche'],
		color: '#7C3AED'
	},
	{
		id: 'allium',
		name: 'Allium',
		descriptionKey: 'chain_tools.tools.allium.description',
		url: 'https://allium.so',
		icon: DatabaseZap,
		category: 'data',
		tags: ['data', 'analytics', 'enterprise', 'real-time'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Solana'],
		color: '#F97316'
	},
	{
		id: 'sentio',
		name: 'Sentio',
		descriptionKey: 'chain_tools.tools.sentio.description',
		url: 'https://sentio.xyz',
		icon: DatabaseZap,
		category: 'data',
		tags: ['observability', 'monitoring', 'debugging', 'multichain'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BNB Chain', 'Aptos', 'Sui'],
		color: '#3B82F6'
	},

	// ============================================
	// Additional tools for existing categories
	// ============================================

	// NFT - 5 more
	{
		id: 'tensor',
		name: 'Tensor',
		descriptionKey: 'chain_tools.tools.tensor.description',
		url: 'https://tensor.trade',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'solana', 'trading', 'amm'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'hyperspace',
		name: 'Hyperspace',
		descriptionKey: 'chain_tools.tools.hyperspace.description',
		url: 'https://hyperspace.xyz',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'solana', 'aggregator'],
		chains: ['Solana'],
		color: '#8B5CF6'
	},
	{
		id: 'tradeport',
		name: 'Tradeport',
		descriptionKey: 'chain_tools.tools.tradeport.description',
		url: 'https://tradeport.xyz',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'sui', 'aptos', 'move'],
		chains: ['Sui', 'Aptos'],
		color: '#0EA5E9'
	},
	{
		id: 'campfire',
		name: 'Campfire',
		descriptionKey: 'chain_tools.tools.campfire.description',
		url: 'https://campfire.exchange',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'avalanche', 'nft'],
		chains: ['Avalanche'],
		color: '#E84142'
	},
	{
		id: 'paintswap',
		name: 'PaintSwap',
		descriptionKey: 'chain_tools.tools.paintswap.description',
		url: 'https://paintswap.finance',
		icon: Image,
		category: 'nft',
		tags: ['marketplace', 'fantom', 'sonic', 'nft'],
		chains: ['Fantom', 'Sonic'],
		color: '#1969FF'
	},

	// Analytics - 3 more
	{
		id: 'defillama_yields',
		name: 'DefiLlama Yields',
		descriptionKey: 'chain_tools.tools.defillama_yields.description',
		url: 'https://defillama.com/yields',
		icon: BarChart3,
		category: 'analytics',
		tags: ['yields', 'apy', 'farming', 'comparison'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BNB Chain'],
		color: '#2172E5'
	},
	{
		id: 'defilabs',
		name: 'DeFi Labs',
		descriptionKey: 'chain_tools.tools.defilabs.description',
		url: 'https://defilabs.gg',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'whale', 'smart-money', 'tracking'],
		chains: ['Ethereum', 'Solana'],
		color: '#F97316'
	},
	{
		id: 'chainanalytics',
		name: 'Chain Analytics',
		descriptionKey: 'chain_tools.tools.chainanalytics.description',
		url: 'https://chainanalytics.xyz',
		icon: BarChart3,
		category: 'analytics',
		tags: ['analytics', 'dashboards', 'custom', 'data'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum'],
		color: '#3B82F6'
	},

	// Security - 2 more
	{
		id: 'code4rena',
		name: 'Code4rena',
		descriptionKey: 'chain_tools.tools.code4rena.description',
		url: 'https://code4rena.com',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'contest', 'community', 'security'],
		chains: ['Ethereum', 'Solana'],
		color: '#22C55E'
	},
	{
		id: 'sherlock',
		name: 'Sherlock',
		descriptionKey: 'chain_tools.tools.sherlock.description',
		url: 'https://sherlock.xyz',
		icon: Shield,
		category: 'security',
		tags: ['audit', 'insurance', 'contest', 'coverage'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	}
];

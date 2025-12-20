/**
 * Web3 Teams Tools - Startups, VCs & Investment Brands
 *
 * Categories:
 * - Tier 1 Crypto VCs
 * - Crypto-Native Funds
 * - Corporate Ventures
 * - Accelerators & Incubators
 * - Notable Builders/Teams
 * - Investment Tracking
 */
import {
	Building2,
	DollarSign,
	Rocket,
	Users,
	Briefcase,
	TrendingUp,
	Globe,
	Star,
	Lightbulb,
	Target
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const web3TeamsTools: ExternalTool[] = [
	// ========== Tier 1 Crypto VCs ==========
	// {
	// 	id: 'a16z-crypto',
	// 	name: 'a16z crypto',
	// 	descriptionKey: 'chain_tools.tools.a16z_crypto.description',
	// 	url: 'https://a16zcrypto.com',
	// 	icon: Building2,
	// 	category: 'web3-teams',
	// 	tags: ['vc', 'tier1', 'multi-stage', 'regulatory'],
	// 	color: '#FF6B35',
	// 	isFeatured: true
	// },
	{
		id: 'paradigm-vc',
		name: 'Paradigm',
		descriptionKey: 'chain_tools.tools.paradigm_vc.description',
		url: 'https://www.paradigm.xyz',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'tier1', 'research', 'technical'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'sequoia-crypto',
		name: 'Sequoia Capital',
		descriptionKey: 'chain_tools.tools.sequoia_crypto.description',
		url: 'https://www.sequoiacap.com',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'tier1', 'traditional', 'multi-stage'],
		color: '#B91C1C'
	},
	{
		id: 'polychain-capital',
		name: 'Polychain Capital',
		descriptionKey: 'chain_tools.tools.polychain_capital.description',
		url: 'https://polychain.capital',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'tier1', 'crypto-native', 'early-stage'],
		color: '#6366F1',
		isFeatured: true
	},
	{
		id: 'pantera-capital',
		name: 'Pantera Capital',
		descriptionKey: 'chain_tools.tools.pantera_capital.description',
		url: 'https://panteracapital.com',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'tier1', 'oldest', 'multi-strategy'],
		color: '#1E40AF'
	},
	{
		id: 'dragonfly-capital',
		name: 'Dragonfly',
		descriptionKey: 'chain_tools.tools.dragonfly_capital.description',
		url: 'https://www.dragonfly.xyz',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'tier1', 'asia', 'global'],
		color: '#FF6B00',
		isFeatured: true
	},
	{
		id: 'multicoin-capital',
		name: 'Multicoin Capital',
		descriptionKey: 'chain_tools.tools.multicoin_capital.description',
		url: 'https://multicoin.capital',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'tier1', 'solana', 'thesis-driven'],
		color: '#14B8A6'
	},
	{
		id: 'electric-capital',
		name: 'Electric Capital',
		descriptionKey: 'chain_tools.tools.electric_capital.description',
		url: 'https://www.electriccapital.com',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'tier1', 'developer-report', 'infra'],
		color: '#8B5CF6'
	},
	// ========== Crypto-Native Funds ==========
	{
		id: 'framework-ventures',
		name: 'Framework Ventures',
		descriptionKey: 'chain_tools.tools.framework_ventures.description',
		url: 'https://framework.ventures',
		icon: TrendingUp,
		category: 'web3-teams',
		tags: ['vc', 'defi', 'gaming', 'active'],
		color: '#3B82F6'
	},
	{
		id: 'delphi-ventures',
		name: 'Delphi Ventures',
		descriptionKey: 'chain_tools.tools.delphi_ventures.description',
		url: 'https://delphidigital.io/ventures',
		icon: TrendingUp,
		category: 'web3-teams',
		tags: ['vc', 'research', 'defi', 'gaming'],
		color: '#F97316'
	},
	{
		id: 'placeholder-vc',
		name: 'Placeholder',
		descriptionKey: 'chain_tools.tools.placeholder_vc.description',
		url: 'https://placeholder.vc',
		icon: TrendingUp,
		category: 'web3-teams',
		tags: ['vc', 'thesis-driven', 'defi', 'governance'],
		color: '#000000'
	},
	{
		id: 'variant-fund',
		name: 'Variant',
		descriptionKey: 'chain_tools.tools.variant_fund.description',
		url: 'https://variant.fund',
		icon: TrendingUp,
		category: 'web3-teams',
		tags: ['vc', 'ownership', 'user-owned', 'web3'],
		color: '#1E40AF'
	},
	{
		id: 'hashed-vc',
		name: 'Hashed',
		descriptionKey: 'chain_tools.tools.hashed_vc.description',
		url: 'https://hashed.com',
		icon: Globe,
		category: 'web3-teams',
		tags: ['vc', 'korea', 'asia', 'gaming'],
		color: '#FF6B35'
	},
	{
		id: 'spartan-group',
		name: 'Spartan Group',
		descriptionKey: 'chain_tools.tools.spartan_group.description',
		url: 'https://spartangroup.io',
		icon: TrendingUp,
		category: 'web3-teams',
		tags: ['vc', 'asia', 'trading', 'advisory'],
		color: '#DC2626'
	},
	{
		id: 'hack-vc',
		name: 'Hack VC',
		descriptionKey: 'chain_tools.tools.hack_vc.description',
		url: 'https://hack.vc',
		icon: Rocket,
		category: 'web3-teams',
		tags: ['vc', 'early-stage', 'infra', 'technical'],
		color: '#000000'
	},
	{
		id: 'bankless-ventures',
		name: 'Bankless Ventures',
		descriptionKey: 'chain_tools.tools.bankless_ventures.description',
		url: 'https://www.banklessventures.com',
		icon: TrendingUp,
		category: 'web3-teams',
		tags: ['vc', 'community', 'ethereum', 'defi'],
		color: '#FF0420'
	},
	{
		id: '1kx-capital',
		name: '1kx',
		descriptionKey: 'chain_tools.tools.1kx_capital.description',
		url: 'https://1kx.network',
		icon: TrendingUp,
		category: 'web3-teams',
		tags: ['vc', 'token-networks', 'governance', 'early-stage'],
		color: '#4F46E5'
	},
	{
		id: 'robot-ventures',
		name: 'Robot Ventures',
		descriptionKey: 'chain_tools.tools.robot_ventures.description',
		url: 'https://robvc.com',
		icon: Rocket,
		category: 'web3-teams',
		tags: ['vc', 'early-stage', 'defi', 'compound'],
		color: '#3B82F6'
	},
	// ========== Corporate Ventures ==========
	{
		id: 'coinbase-ventures',
		name: 'Coinbase Ventures',
		descriptionKey: 'chain_tools.tools.coinbase_ventures.description',
		url: 'https://www.coinbase.com/ventures',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'corporate', 'exchange', 'ecosystem'],
		color: '#0052FF',
		isFeatured: true
	},
	{
		id: 'binance-labs',
		name: 'Binance Labs',
		descriptionKey: 'chain_tools.tools.binance_labs.description',
		url: 'https://labs.binance.com',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'corporate', 'exchange', 'incubator'],
		color: '#F0B90B',
		isFeatured: true
	},
	{
		id: 'okx-ventures',
		name: 'OKX Ventures',
		descriptionKey: 'chain_tools.tools.okx_ventures.description',
		url: 'https://www.okx.com/ventures',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'corporate', 'exchange', 'global'],
		color: '#000000'
	},
	{
		id: 'kraken-ventures',
		name: 'Kraken Ventures',
		descriptionKey: 'chain_tools.tools.kraken_ventures.description',
		url: 'https://www.kraken.com/ventures',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'corporate', 'exchange', 'infra'],
		color: '#5741D9'
	},
	{
		id: 'circle-ventures',
		name: 'Circle Ventures',
		descriptionKey: 'chain_tools.tools.circle_ventures.description',
		url: 'https://www.circle.com/en/circle-ventures',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'corporate', 'stablecoin', 'usdc'],
		color: '#00D395'
	},
	{
		id: 'galaxy-ventures',
		name: 'Galaxy Ventures',
		descriptionKey: 'chain_tools.tools.galaxy_ventures.description',
		url: 'https://www.galaxy.com/ventures',
		icon: Building2,
		category: 'web3-teams',
		tags: ['vc', 'corporate', 'institutional', 'multi-stage'],
		color: '#7C3AED'
	},
	// ========== Accelerators & Incubators ==========
	{
		id: 'alliance-dao',
		name: 'Alliance',
		descriptionKey: 'chain_tools.tools.alliance_dao.description',
		url: 'https://alliance.xyz',
		icon: Rocket,
		category: 'web3-teams',
		tags: ['accelerator', 'web3', 'mentorship', 'batch'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'ycombinator-crypto',
		name: 'Y Combinator',
		descriptionKey: 'chain_tools.tools.ycombinator_crypto.description',
		url: 'https://www.ycombinator.com',
		icon: Rocket,
		category: 'web3-teams',
		tags: ['accelerator', 'startup', 'batch', 'demo-day'],
		color: '#FF6600'
	},
	{
		id: 'outlier-ventures',
		name: 'Outlier Ventures',
		descriptionKey: 'chain_tools.tools.outlier_ventures.description',
		url: 'https://outlierventures.io',
		icon: Rocket,
		category: 'web3-teams',
		tags: ['accelerator', 'web3', 'base-camp', 'token'],
		color: '#1E40AF'
	},
	{
		id: 'longhash-ventures',
		name: 'LongHash Ventures',
		descriptionKey: 'chain_tools.tools.longhash_ventures.description',
		url: 'https://www.longhash.vc',
		icon: Rocket,
		category: 'web3-teams',
		tags: ['accelerator', 'asia', 'web3', 'batch'],
		color: '#6366F1'
	},
	{
		id: 'techstars-crypto',
		name: 'Techstars',
		descriptionKey: 'chain_tools.tools.techstars_crypto.description',
		url: 'https://www.techstars.com',
		icon: Rocket,
		category: 'web3-teams',
		tags: ['accelerator', 'startup', 'mentorship', 'global'],
		color: '#00B140'
	},
	// ========== Notable Builder Teams ==========
	{
		id: 'consensys-team',
		name: 'Consensys',
		descriptionKey: 'chain_tools.tools.consensys_team.description',
		url: 'https://consensys.io',
		icon: Users,
		category: 'web3-teams',
		tags: ['builder', 'metamask', 'infura', 'ethereum'],
		color: '#3259A5',
		isFeatured: true
	},
	{
		id: 'offchain-labs',
		name: 'Offchain Labs',
		descriptionKey: 'chain_tools.tools.offchain_labs.description',
		url: 'https://offchainlabs.com',
		icon: Users,
		category: 'web3-teams',
		tags: ['builder', 'arbitrum', 'l2', 'rollup'],
		color: '#28A0F0'
	},
	{
		id: 'matter-labs',
		name: 'Matter Labs',
		descriptionKey: 'chain_tools.tools.matter_labs.description',
		url: 'https://matter-labs.io',
		icon: Users,
		category: 'web3-teams',
		tags: ['builder', 'zksync', 'l2', 'zk-rollup'],
		color: '#8C8DFC'
	},
	{
		id: 'optimism-team',
		name: 'OP Labs',
		descriptionKey: 'chain_tools.tools.optimism_team.description',
		url: 'https://optimism.io',
		icon: Users,
		category: 'web3-teams',
		tags: ['builder', 'optimism', 'l2', 'superchain'],
		color: '#FF0420'
	},
	{
		id: 'alchemy-team',
		name: 'Alchemy',
		descriptionKey: 'chain_tools.tools.alchemy_team.description',
		url: 'https://www.alchemy.com',
		icon: Users,
		category: 'web3-teams',
		tags: ['builder', 'infra', 'node', 'api'],
		color: '#0052FF'
	},
	{
		id: 'chainlink-labs',
		name: 'Chainlink Labs',
		descriptionKey: 'chain_tools.tools.chainlink_labs.description',
		url: 'https://chainlinklabs.com',
		icon: Users,
		category: 'web3-teams',
		tags: ['builder', 'oracle', 'ccip', 'data'],
		color: '#375BD2'
	},
	{
		id: 'eigenlayer-team',
		name: 'Eigen Labs',
		descriptionKey: 'chain_tools.tools.eigenlayer_team.description',
		url: 'https://www.eigenlayer.xyz',
		icon: Users,
		category: 'web3-teams',
		tags: ['builder', 'restaking', 'avs', 'ethereum'],
		color: '#1E40AF'
	},
	{
		id: 'uniswap-labs',
		name: 'Uniswap Labs',
		descriptionKey: 'chain_tools.tools.uniswap_labs.description',
		url: 'https://uniswap.org',
		icon: Users,
		category: 'web3-teams',
		tags: ['builder', 'dex', 'amm', 'defi'],
		color: '#FF007A'
	},
	// ========== Research & Advisory ==========
	{
		id: 'jump-crypto',
		name: 'Jump Crypto',
		descriptionKey: 'chain_tools.tools.jump_crypto.description',
		url: 'https://jumpcrypto.com',
		icon: Briefcase,
		category: 'web3-teams',
		tags: ['trading', 'infra', 'wormhole', 'builder'],
		color: '#000000'
	},
	{
		id: 'wintermute-trading',
		name: 'Wintermute',
		descriptionKey: 'chain_tools.tools.wintermute_trading.description',
		url: 'https://wintermute.com',
		icon: Briefcase,
		category: 'web3-teams',
		tags: ['trading', 'market-making', 'liquidity', 'ventures'],
		color: '#00D395'
	},
	{
		id: 'gauntlet-network',
		name: 'Gauntlet',
		descriptionKey: 'chain_tools.tools.gauntlet_network.description',
		url: 'https://gauntlet.network',
		icon: Target,
		category: 'web3-teams',
		tags: ['risk', 'simulation', 'defi', 'optimization'],
		color: '#6366F1'
	},
	// ========== Investment Tracking ==========
	{
		id: 'dealroom-crypto',
		name: 'Dealroom',
		descriptionKey: 'chain_tools.tools.dealroom_crypto.description',
		url: 'https://dealroom.co/guides/web3',
		icon: DollarSign,
		category: 'web3-teams',
		tags: ['database', 'funding', 'startups', 'analytics'],
		color: '#4F46E5'
	},
	{
		id: 'pitchbook-crypto',
		name: 'PitchBook',
		descriptionKey: 'chain_tools.tools.pitchbook_crypto.description',
		url: 'https://pitchbook.com',
		icon: DollarSign,
		category: 'web3-teams',
		tags: ['database', 'vc', 'deals', 'institutional'],
		color: '#1E40AF'
	},
	{
		id: 'crypto-fundraising',
		name: 'Crypto Fundraising',
		descriptionKey: 'chain_tools.tools.crypto_fundraising.description',
		url: 'https://crypto-fundraising.info',
		icon: DollarSign,
		category: 'web3-teams',
		tags: ['funding', 'deals', 'tracker', 'free'],
		color: '#10B981'
	}
];

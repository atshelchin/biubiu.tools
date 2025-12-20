/**
 * Funding Tools - Web3 VC, investment platforms, and fundraising
 */
import { Banknote, TrendingUp, Users, Building2, Briefcase, Target } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const fundingTools: ExternalTool[] = [
	// ========== Major VC Firms ==========
	{
		id: 'a16z-crypto',
		name: 'a16z Crypto',
		descriptionKey: 'chain_tools.tools.a16z_crypto.description',
		url: 'https://a16zcrypto.com',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'investment', 'web3'],
		color: '#000000'
	},
	{
		id: 'paradigm',
		name: 'Paradigm',
		descriptionKey: 'chain_tools.tools.paradigm.description',
		url: 'https://paradigm.xyz',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'research', 'crypto'],
		color: '#000000'
	},
	{
		id: 'polychain',
		name: 'Polychain Capital',
		descriptionKey: 'chain_tools.tools.polychain.description',
		url: 'https://polychain.capital',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'crypto', 'fund'],
		color: '#6366F1'
	},
	{
		id: 'pantera',
		name: 'Pantera Capital',
		descriptionKey: 'chain_tools.tools.pantera.description',
		url: 'https://panteracapital.com',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'blockchain', 'fund'],
		color: '#1E40AF'
	},
	{
		id: 'multicoin',
		name: 'Multicoin Capital',
		descriptionKey: 'chain_tools.tools.multicoin.description',
		url: 'https://multicoin.capital',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'thesis-driven', 'crypto'],
		color: '#10B981'
	},
	{
		id: 'dragonfly',
		name: 'Dragonfly',
		descriptionKey: 'chain_tools.tools.dragonfly.description',
		url: 'https://dragonfly.xyz',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'global', 'crypto'],
		color: '#DC2626'
	},
	{
		id: 'variant',
		name: 'Variant',
		descriptionKey: 'chain_tools.tools.variant.description',
		url: 'https://variant.fund',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'ownership-economy', 'web3'],
		color: '#8B5CF6'
	},
	{
		id: 'framework-ventures',
		name: 'Framework Ventures',
		descriptionKey: 'chain_tools.tools.framework_ventures.description',
		url: 'https://framework.ventures',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'defi', 'gaming'],
		color: '#3B82F6'
	},
	{
		id: 'electric-capital',
		name: 'Electric Capital',
		descriptionKey: 'chain_tools.tools.electric_capital.description',
		url: 'https://electriccapital.com',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'developer-report', 'crypto'],
		color: '#FBBF24'
	},
	{
		id: 'placeholder',
		name: 'Placeholder',
		descriptionKey: 'chain_tools.tools.placeholder.description',
		url: 'https://placeholder.vc',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'network', 'crypto'],
		color: '#000000'
	},

	// ========== Investment Platforms ==========
	{
		id: 'angellist-crypto',
		name: 'AngelList Crypto',
		descriptionKey: 'chain_tools.tools.angellist_crypto.description',
		url: 'https://www.angellist.com/crypto',
		icon: Users,
		category: 'funding',
		tags: ['angel', 'syndicate', 'investment', 'platform'],
		color: '#000000'
	},
	{
		id: 'republic-crypto',
		name: 'Republic Crypto',
		descriptionKey: 'chain_tools.tools.republic_crypto.description',
		url: 'https://republic.com/crypto',
		icon: Users,
		category: 'funding',
		tags: ['crowdfunding', 'retail', 'investment', 'platform'],
		color: '#6366F1'
	},
	{
		id: 'coinlist',
		name: 'CoinList',
		descriptionKey: 'chain_tools.tools.coinlist.description',
		url: 'https://coinlist.co',
		icon: TrendingUp,
		category: 'funding',
		tags: ['token-sale', 'launchpad', 'investment', 'platform'],
		color: '#000000'
	},
	{
		id: 'echo-xyz',
		name: 'Echo',
		descriptionKey: 'chain_tools.tools.echo_xyz.description',
		url: 'https://echo.xyz',
		icon: Users,
		category: 'funding',
		tags: ['angel', 'community', 'allocation', 'investing'],
		color: '#8B5CF6'
	},
	{
		id: 'syndicate-dao',
		name: 'Syndicate',
		descriptionKey: 'chain_tools.tools.syndicate_dao.description',
		url: 'https://syndicate.io',
		icon: Users,
		category: 'funding',
		tags: ['investment-dao', 'club', 'collective', 'onchain'],
		color: '#3B82F6'
	},

	// ========== Data & Research ==========
	{
		id: 'crunchbase-crypto',
		name: 'Crunchbase',
		descriptionKey: 'chain_tools.tools.crunchbase_crypto.description',
		url: 'https://www.crunchbase.com/hub/web3-companies',
		icon: TrendingUp,
		category: 'funding',
		tags: ['database', 'funding-data', 'startups', 'research'],
		color: '#0052FF'
	},
	{
		id: 'pitchbook-crypto',
		name: 'PitchBook',
		descriptionKey: 'chain_tools.tools.pitchbook_crypto.description',
		url: 'https://pitchbook.com',
		icon: TrendingUp,
		category: 'funding',
		tags: ['database', 'vc-data', 'deals', 'research'],
		color: '#1E3A8A'
	},
	{
		id: 'dealroom-web3',
		name: 'Dealroom',
		descriptionKey: 'chain_tools.tools.dealroom_web3.description',
		url: 'https://dealroom.co',
		icon: TrendingUp,
		category: 'funding',
		tags: ['database', 'startups', 'funding', 'europe'],
		color: '#10B981'
	},

	// ========== Grant Platforms ==========
	{
		id: 'gitcoin-grants',
		name: 'Gitcoin Grants',
		descriptionKey: 'chain_tools.tools.gitcoin_grants.description',
		url: 'https://grants.gitcoin.co',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'quadratic-funding', 'public-goods', 'open-source'],
		color: '#02E2AC'
	},
	{
		id: 'optimism-rpgf',
		name: 'Optimism RetroPGF',
		descriptionKey: 'chain_tools.tools.optimism_rpgf.description',
		url: 'https://app.optimism.io/retropgf',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'retroactive', 'public-goods', 'optimism'],
		chains: ['Optimism'],
		color: '#FF0420'
	},
	{
		id: 'arbitrum-grants',
		name: 'Arbitrum Grants',
		descriptionKey: 'chain_tools.tools.arbitrum_grants.description',
		url: 'https://arbitrum.foundation/grants',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'ecosystem', 'arbitrum', 'funding'],
		chains: ['Arbitrum'],
		color: '#28A0F0'
	},
	{
		id: 'ethereum-foundation',
		name: 'Ethereum Foundation',
		descriptionKey: 'chain_tools.tools.ethereum_foundation.description',
		url: 'https://ethereum.org/en/community/grants',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'ecosystem', 'ethereum', 'research'],
		chains: ['Ethereum'],
		color: '#627EEA'
	},
	{
		id: 'polygon-grants',
		name: 'Polygon Grants',
		descriptionKey: 'chain_tools.tools.polygon_grants.description',
		url: 'https://polygon.technology/village/grants',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'ecosystem', 'polygon', 'funding'],
		chains: ['Polygon'],
		color: '#8247E5'
	},
	{
		id: 'solana-grants',
		name: 'Solana Grants',
		descriptionKey: 'chain_tools.tools.solana_grants.description',
		url: 'https://solana.org/grants',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'ecosystem', 'solana', 'funding'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'uniswap-grants',
		name: 'Uniswap Grants',
		descriptionKey: 'chain_tools.tools.uniswap_grants.description',
		url: 'https://www.unigrants.org',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'defi', 'uniswap', 'ecosystem'],
		color: '#FF007A'
	},
	{
		id: 'aave-grants',
		name: 'Aave Grants',
		descriptionKey: 'chain_tools.tools.aave_grants.description',
		url: 'https://aavegrants.org',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'defi', 'aave', 'ecosystem'],
		color: '#B6509E'
	},
	{
		id: 'compound-grants',
		name: 'Compound Grants',
		descriptionKey: 'chain_tools.tools.compound_grants.description',
		url: 'https://compoundgrants.org',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'defi', 'compound', 'ecosystem'],
		color: '#00D395'
	},

	// ========== Accelerators & Incubators ==========
	{
		id: 'alliance-dao',
		name: 'Alliance',
		descriptionKey: 'chain_tools.tools.alliance_dao.description',
		url: 'https://alliance.xyz',
		icon: Target,
		category: 'funding',
		tags: ['accelerator', 'incubator', 'mentorship', 'web3'],
		color: '#000000'
	},
	{
		id: 'outlier-ventures',
		name: 'Outlier Ventures',
		descriptionKey: 'chain_tools.tools.outlier_ventures.description',
		url: 'https://outlierventures.io',
		icon: Target,
		category: 'funding',
		tags: ['accelerator', 'base-camp', 'web3', 'metaverse'],
		color: '#6366F1'
	},
	{
		id: 'longhash-ventures',
		name: 'LongHash Ventures',
		descriptionKey: 'chain_tools.tools.longhash_ventures.description',
		url: 'https://longhash.vc',
		icon: Target,
		category: 'funding',
		tags: ['accelerator', 'asia', 'web3', 'incubator'],
		color: '#3B82F6'
	},
	{
		id: 'kernel',
		name: 'Kernel',
		descriptionKey: 'chain_tools.tools.kernel.description',
		url: 'https://kernel.community',
		icon: Target,
		category: 'funding',
		tags: ['fellowship', 'education', 'community', 'web3'],
		color: '#10B981'
	},
	{
		id: 'encode-club',
		name: 'Encode Club',
		descriptionKey: 'chain_tools.tools.encode_club.description',
		url: 'https://www.encode.club',
		icon: Target,
		category: 'funding',
		tags: ['hackathons', 'accelerator', 'education', 'bootcamp'],
		color: '#EC4899'
	},

	// ========== More VCs ==========
	{
		id: 'coinbase-ventures',
		name: 'Coinbase Ventures',
		descriptionKey: 'chain_tools.tools.coinbase_ventures.description',
		url: 'https://ventures.coinbase.com',
		icon: Briefcase,
		category: 'funding',
		tags: ['vc', 'corporate-vc', 'coinbase', 'investment'],
		color: '#0052FF'
	},
	{
		id: 'binance-labs',
		name: 'Binance Labs',
		descriptionKey: 'chain_tools.tools.binance_labs.description',
		url: 'https://labs.binance.com',
		icon: Briefcase,
		category: 'funding',
		tags: ['vc', 'corporate-vc', 'binance', 'incubator'],
		color: '#F0B90B'
	},
	{
		id: 'galaxy-digital',
		name: 'Galaxy Digital',
		descriptionKey: 'chain_tools.tools.galaxy_digital.description',
		url: 'https://www.galaxy.com',
		icon: Briefcase,
		category: 'funding',
		tags: ['investment', 'trading', 'asset-management', 'institutional'],
		color: '#000000'
	},
	{
		id: 'hashkey-capital',
		name: 'HashKey Capital',
		descriptionKey: 'chain_tools.tools.hashkey_capital.description',
		url: 'https://hashkey.capital',
		icon: Briefcase,
		category: 'funding',
		tags: ['vc', 'asia', 'hong-kong', 'institutional'],
		color: '#1E40AF'
	},
	{
		id: 'spartan-group',
		name: 'Spartan Group',
		descriptionKey: 'chain_tools.tools.spartan_group.description',
		url: 'https://spartangroup.io',
		icon: Briefcase,
		category: 'funding',
		tags: ['vc', 'advisory', 'asia', 'investment'],
		color: '#DC2626'
	}
];

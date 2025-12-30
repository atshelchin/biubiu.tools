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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.a16z_crypto.description',
		url: 'https://a16zcrypto.com',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'investment', 'web3'],
		color: '#000000'
	},
	{
		id: 'paradigm',
		name: 'Paradigm',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.paradigm.description',
		url: 'https://paradigm.xyz',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'research', 'crypto'],
		color: '#000000'
	},
	{
		id: 'polychain',
		name: 'Polychain Capital',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.polychain.description',
		url: 'https://polychain.capital',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'crypto', 'fund'],
		color: '#6366F1'
	},
	{
		id: 'pantera',
		name: 'Pantera Capital',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.pantera.description',
		url: 'https://panteracapital.com',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'blockchain', 'fund'],
		color: '#1E40AF'
	},
	{
		id: 'multicoin',
		name: 'Multicoin Capital',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.multicoin.description',
		url: 'https://multicoin.capital',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'thesis-driven', 'crypto'],
		color: '#10B981'
	},
	{
		id: 'dragonfly',
		name: 'Dragonfly',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.dragonfly.description',
		url: 'https://dragonfly.xyz',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'global', 'crypto'],
		color: '#DC2626'
	},
	{
		id: 'variant',
		name: 'Variant',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.variant.description',
		url: 'https://variant.fund',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'ownership-economy', 'web3'],
		color: '#8B5CF6'
	},
	{
		id: 'framework-ventures',
		name: 'Framework Ventures',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.framework_ventures.description',
		url: 'https://framework.ventures',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'defi', 'gaming'],
		color: '#3B82F6'
	},
	{
		id: 'electric-capital',
		name: 'Electric Capital',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.electric_capital.description',
		url: 'https://electriccapital.com',
		icon: Building2,
		category: 'funding',
		tags: ['vc', 'venture-capital', 'developer-report', 'crypto'],
		color: '#FBBF24'
	},
	{
		id: 'placeholder',
		name: 'Placeholder',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.placeholder.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.angellist_crypto.description',
		url: 'https://www.angellist.com/crypto',
		icon: Users,
		category: 'funding',
		tags: ['angel', 'syndicate', 'investment', 'platform'],
		color: '#000000'
	},
	{
		id: 'republic-crypto',
		name: 'Republic Crypto',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.republic_crypto.description',
		url: 'https://republic.com/crypto',
		icon: Users,
		category: 'funding',
		tags: ['crowdfunding', 'retail', 'investment', 'platform'],
		color: '#6366F1'
	},
	{
		id: 'coinlist',
		name: 'CoinList',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.coinlist.description',
		url: 'https://coinlist.co',
		icon: TrendingUp,
		category: 'funding',
		tags: ['token-sale', 'launchpad', 'investment', 'platform'],
		color: '#000000'
	},
	{
		id: 'echo-xyz',
		name: 'Echo',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.echo_xyz.description',
		url: 'https://echo.xyz',
		icon: Users,
		category: 'funding',
		tags: ['angel', 'community', 'allocation', 'investing'],
		color: '#8B5CF6'
	},
	{
		id: 'syndicate-dao',
		name: 'Syndicate',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.syndicate_dao.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.crunchbase_crypto.description',
		url: 'https://www.crunchbase.com/hub/web3-companies',
		icon: TrendingUp,
		category: 'funding',
		tags: ['database', 'funding-data', 'startups', 'research'],
		color: '#0052FF'
	},
	{
		id: 'pitchbook-crypto',
		name: 'PitchBook',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.pitchbook_crypto.description',
		url: 'https://pitchbook.com',
		icon: TrendingUp,
		category: 'funding',
		tags: ['database', 'vc-data', 'deals', 'research'],
		color: '#1E3A8A'
	},
	{
		id: 'dealroom-web3',
		name: 'Dealroom',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.dealroom_web3.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.gitcoin_grants.description',
		url: 'https://grants.gitcoin.co',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'quadratic-funding', 'public-goods', 'open-source'],
		color: '#02E2AC'
	},
	{
		id: 'optimism-rpgf',
		name: 'Optimism RetroPGF',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.optimism_rpgf.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.arbitrum_grants.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.ethereum_foundation.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.polygon_grants.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.solana_grants.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.uniswap_grants.description',
		url: 'https://www.unigrants.org',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'defi', 'uniswap', 'ecosystem'],
		color: '#FF007A'
	},
	{
		id: 'aave-grants',
		name: 'Aave Grants',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.aave_grants.description',
		url: 'https://aavegrants.org',
		icon: Banknote,
		category: 'funding',
		tags: ['grants', 'defi', 'aave', 'ecosystem'],
		color: '#B6509E'
	},
	{
		id: 'compound-grants',
		name: 'Compound Grants',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.compound_grants.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.alliance_dao.description',
		url: 'https://alliance.xyz',
		icon: Target,
		category: 'funding',
		tags: ['accelerator', 'incubator', 'mentorship', 'web3'],
		color: '#000000'
	},
	{
		id: 'outlier-ventures',
		name: 'Outlier Ventures',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.outlier_ventures.description',
		url: 'https://outlierventures.io',
		icon: Target,
		category: 'funding',
		tags: ['accelerator', 'base-camp', 'web3', 'metaverse'],
		color: '#6366F1'
	},
	{
		id: 'longhash-ventures',
		name: 'LongHash Ventures',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.longhash_ventures.description',
		url: 'https://longhash.vc',
		icon: Target,
		category: 'funding',
		tags: ['accelerator', 'asia', 'web3', 'incubator'],
		color: '#3B82F6'
	},
	{
		id: 'kernel',
		name: 'Kernel',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.kernel.description',
		url: 'https://kernel.community',
		icon: Target,
		category: 'funding',
		tags: ['fellowship', 'education', 'community', 'web3'],
		color: '#10B981'
	},
	{
		id: 'encode-club',
		name: 'Encode Club',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.encode_club.description',
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
		descriptionKey: 'routes/apps/chain-tools/funding.tools.coinbase_ventures.description',
		url: 'https://ventures.coinbase.com',
		icon: Briefcase,
		category: 'funding',
		tags: ['vc', 'corporate-vc', 'coinbase', 'investment'],
		color: '#0052FF'
	},
	{
		id: 'binance-labs',
		name: 'Binance Labs',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.binance_labs.description',
		url: 'https://labs.binance.com',
		icon: Briefcase,
		category: 'funding',
		tags: ['vc', 'corporate-vc', 'binance', 'incubator'],
		color: '#F0B90B'
	},
	{
		id: 'galaxy-digital',
		name: 'Galaxy Digital',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.galaxy_digital.description',
		url: 'https://www.galaxy.com',
		icon: Briefcase,
		category: 'funding',
		tags: ['investment', 'trading', 'asset-management', 'institutional'],
		color: '#000000'
	},
	{
		id: 'hashkey-capital',
		name: 'HashKey Capital',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.hashkey_capital.description',
		url: 'https://hashkey.capital',
		icon: Briefcase,
		category: 'funding',
		tags: ['vc', 'asia', 'hong-kong', 'institutional'],
		color: '#1E40AF'
	},
	{
		id: 'spartan-group',
		name: 'Spartan Group',
		descriptionKey: 'routes/apps/chain-tools/funding.tools.spartan_group.description',
		url: 'https://spartangroup.io',
		icon: Briefcase,
		category: 'funding',
		tags: ['vc', 'advisory', 'asia', 'investment'],
		color: '#DC2626'
	}
];

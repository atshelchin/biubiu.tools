/**
 * Twitter/X Tools - Web3 high-quality accounts and influencers
 */
import { Twitter, User, Building2, Code, TrendingUp, Microscope, Sparkles } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const twitterTools: ExternalTool[] = [
	// ========== Founders & CEOs ==========
	{
		id: 'x-vitalik',
		name: 'Vitalik Buterin',
		descriptionKey: 'chain_tools.tools.x_vitalik.description',
		url: 'https://x.com/VitalikButerin',
		icon: User,
		category: 'twitter',
		tags: ['founder', 'ethereum', 'research', 'philosophy'],
		color: '#1DA1F2'
	},
	{
		id: 'x-cz-binance',
		name: 'CZ (Changpeng Zhao)',
		descriptionKey: 'chain_tools.tools.x_cz_binance.description',
		url: 'https://x.com/cz_binance',
		icon: User,
		category: 'twitter',
		tags: ['founder', 'binance', 'exchange', 'investment'],
		color: '#F0B90B'
	},
	{
		id: 'x-brian-armstrong',
		name: 'Brian Armstrong',
		descriptionKey: 'chain_tools.tools.x_brian_armstrong.description',
		url: 'https://x.com/brian_armstrong',
		icon: User,
		category: 'twitter',
		tags: ['founder', 'coinbase', 'regulation', 'adoption'],
		color: '#0052FF'
	},
	{
		id: 'x-hayden-adams',
		name: 'Hayden Adams',
		descriptionKey: 'chain_tools.tools.x_hayden_adams.description',
		url: 'https://x.com/haydenzadams',
		icon: User,
		category: 'twitter',
		tags: ['founder', 'uniswap', 'defi', 'amm'],
		color: '#FF007A'
	},
	{
		id: 'x-stani-kulechov',
		name: 'Stani Kulechov',
		descriptionKey: 'chain_tools.tools.x_stani_kulechov.description',
		url: 'https://x.com/StaniKulechov',
		icon: User,
		category: 'twitter',
		tags: ['founder', 'aave', 'lens', 'defi'],
		color: '#B6509E'
	},
	{
		id: 'x-sergey-nazarov',
		name: 'Sergey Nazarov',
		descriptionKey: 'chain_tools.tools.x_sergey_nazarov.description',
		url: 'https://x.com/SergeyNazarov',
		icon: User,
		category: 'twitter',
		tags: ['founder', 'chainlink', 'oracles', 'infrastructure'],
		color: '#375BD2'
	},

	// ========== Researchers & Thought Leaders ==========
	{
		id: 'x-hasufl',
		name: 'Hasu',
		descriptionKey: 'chain_tools.tools.x_hasufl.description',
		url: 'https://x.com/hasufl',
		icon: Microscope,
		category: 'twitter',
		tags: ['researcher', 'mev', 'flashbots', 'analysis'],
		color: '#1DA1F2'
	},
	{
		id: 'x-samczsun',
		name: 'samczsun',
		descriptionKey: 'chain_tools.tools.x_samczsun.description',
		url: 'https://x.com/samczsun',
		icon: Microscope,
		category: 'twitter',
		tags: ['security', 'research', 'paradigm', 'audits'],
		color: '#EF4444'
	},
	{
		id: 'x-jon-charbonneau',
		name: 'Jon Charbonneau',
		descriptionKey: 'chain_tools.tools.x_jon_charbonneau.description',
		url: 'https://x.com/jon_charb',
		icon: Microscope,
		category: 'twitter',
		tags: ['researcher', 'delphi', 'l2', 'analysis'],
		color: '#3B82F6'
	},
	{
		id: 'x-polynya',
		name: 'Polynya',
		descriptionKey: 'chain_tools.tools.x_polynya.description',
		url: 'https://x.com/polynya',
		icon: Microscope,
		category: 'twitter',
		tags: ['researcher', 'rollups', 'scaling', 'analysis'],
		color: '#10B981'
	},
	{
		id: 'x-dankrad',
		name: 'Dankrad Feist',
		descriptionKey: 'chain_tools.tools.x_dankrad.description',
		url: 'https://x.com/dankrad',
		icon: Microscope,
		category: 'twitter',
		tags: ['researcher', 'ethereum', 'danksharding', 'protocol'],
		color: '#627EEA'
	},

	// ========== Protocol & Project Accounts ==========
	{
		id: 'x-ethereum',
		name: 'Ethereum',
		descriptionKey: 'chain_tools.tools.x_ethereum.description',
		url: 'https://x.com/ethereum',
		icon: Building2,
		category: 'twitter',
		tags: ['protocol', 'ethereum', 'official', 'updates'],
		color: '#627EEA',
		isFeatured: true
	},
	{
		id: 'x-uniswap',
		name: 'Uniswap',
		descriptionKey: 'chain_tools.tools.x_uniswap.description',
		url: 'https://x.com/Uniswap',
		icon: Building2,
		category: 'twitter',
		tags: ['protocol', 'defi', 'dex', 'updates'],
		color: '#FF007A'
	},
	{
		id: 'x-aave',
		name: 'Aave',
		descriptionKey: 'chain_tools.tools.x_aave.description',
		url: 'https://x.com/aave',
		icon: Building2,
		category: 'twitter',
		tags: ['protocol', 'defi', 'lending', 'updates'],
		color: '#B6509E'
	},
	{
		id: 'x-arbitrum',
		name: 'Arbitrum',
		descriptionKey: 'chain_tools.tools.x_arbitrum.description',
		url: 'https://x.com/arbitrum',
		icon: Building2,
		category: 'twitter',
		tags: ['protocol', 'l2', 'rollup', 'updates'],
		color: '#28A0F0'
	},
	{
		id: 'x-optimism',
		name: 'Optimism',
		descriptionKey: 'chain_tools.tools.x_optimism.description',
		url: 'https://x.com/Optimism',
		icon: Building2,
		category: 'twitter',
		tags: ['protocol', 'l2', 'superchain', 'updates'],
		color: '#FF0420'
	},
	{
		id: 'x-base',
		name: 'Base',
		descriptionKey: 'chain_tools.tools.x_base.description',
		url: 'https://x.com/base',
		icon: Building2,
		category: 'twitter',
		tags: ['protocol', 'l2', 'coinbase', 'updates'],
		color: '#0052FF'
	},

	// ========== Developers & Builders ==========
	{
		id: 'x-transmissions11',
		name: 't11s (transmissions11)',
		descriptionKey: 'chain_tools.tools.x_transmissions11.description',
		url: 'https://x.com/transmissions11',
		icon: Code,
		category: 'twitter',
		tags: ['developer', 'solidity', 'paradigm', 'gas-optimization'],
		color: '#6366F1'
	},
	{
		id: 'x-gakonst',
		name: 'Georgios Konstantopoulos',
		descriptionKey: 'chain_tools.tools.x_gakonst.description',
		url: 'https://x.com/gakonst',
		icon: Code,
		category: 'twitter',
		tags: ['developer', 'paradigm', 'reth', 'infrastructure'],
		color: '#6366F1'
	},
	{
		id: 'x-austin-griffith',
		name: 'Austin Griffith',
		descriptionKey: 'chain_tools.tools.x_austin_griffith.description',
		url: 'https://x.com/austingriffith',
		icon: Code,
		category: 'twitter',
		tags: ['developer', 'scaffold-eth', 'education', 'buidlguidl'],
		color: '#10B981'
	},
	{
		id: 'x-patrickalphac',
		name: 'Patrick Collins',
		descriptionKey: 'chain_tools.tools.x_patrickalphac.description',
		url: 'https://x.com/PatrickAlphaC',
		icon: Code,
		category: 'twitter',
		tags: ['developer', 'education', 'chainlink', 'tutorials'],
		color: '#375BD2'
	},

	// ========== VCs & Investors ==========
	{
		id: 'x-a16zcrypto',
		name: 'a16z crypto',
		descriptionKey: 'chain_tools.tools.x_a16zcrypto.description',
		url: 'https://x.com/a16zcrypto',
		icon: TrendingUp,
		category: 'twitter',
		tags: ['vc', 'investment', 'research', 'portfolio'],
		color: '#000000',
		isFeatured: true
	},
	{
		id: 'x-paradigm',
		name: 'Paradigm',
		descriptionKey: 'chain_tools.tools.x_paradigm.description',
		url: 'https://x.com/paradigm',
		icon: TrendingUp,
		category: 'twitter',
		tags: ['vc', 'investment', 'research', 'portfolio'],
		color: '#000000'
	},
	{
		id: 'x-dragonfly',
		name: 'Dragonfly',
		descriptionKey: 'chain_tools.tools.x_dragonfly.description',
		url: 'https://x.com/dragonfly_xyz',
		icon: TrendingUp,
		category: 'twitter',
		tags: ['vc', 'investment', 'research', 'asia'],
		color: '#F97316'
	},

	// ========== Insightful Individual Accounts (Active, High-Quality) ==========
	{
		id: 'x-punk6529',
		name: '6529',
		descriptionKey: 'chain_tools.tools.x_punk6529.description',
		url: 'https://x.com/punk6529',
		icon: Sparkles,
		category: 'twitter',
		tags: ['nft', 'culture', 'philosophy', 'collector'],
		color: '#EC4899'
	},
	{
		id: 'x-iamDCinvestor',
		name: 'DCinvestor',
		descriptionKey: 'chain_tools.tools.x_iamDCinvestor.description',
		url: 'https://x.com/iamDCinvestor',
		icon: Sparkles,
		category: 'twitter',
		tags: ['ethereum', 'culture', 'macro', 'insight'],
		color: '#627EEA'
	},
	{
		id: 'x-sassal0x',
		name: 'sassal.eth',
		descriptionKey: 'chain_tools.tools.x_sassal0x.description',
		url: 'https://x.com/sassal0x',
		icon: Sparkles,
		category: 'twitter',
		tags: ['ethereum', 'daily-updates', 'ultrasound', 'education'],
		color: '#627EEA'
	},
	{
		id: 'x-evan-van-ness',
		name: 'Evan Van Ness',
		descriptionKey: 'chain_tools.tools.x_evan_van_ness.description',
		url: 'https://x.com/evan_van_ness',
		icon: Sparkles,
		category: 'twitter',
		tags: ['ethereum', 'newsletter', 'week-in-eth', 'updates'],
		color: '#627EEA'
	},
	{
		id: 'x-lex-node',
		name: 'lex_node',
		descriptionKey: 'chain_tools.tools.x_lex_node.description',
		url: 'https://x.com/lex_node',
		icon: Sparkles,
		category: 'twitter',
		tags: ['legal', 'dao', 'governance', 'insight'],
		color: '#8B5CF6'
	},
	{
		id: 'x-cygaar',
		name: 'cygaar',
		descriptionKey: 'chain_tools.tools.x_cygaar.description',
		url: 'https://x.com/0xCygaar',
		icon: Sparkles,
		category: 'twitter',
		tags: ['developer', 'nft', 'erc721a', 'education'],
		color: '#10B981'
	},
	{
		id: 'x-0xfoobar',
		name: '0xfoobar',
		descriptionKey: 'chain_tools.tools.x_0xfoobar.description',
		url: 'https://x.com/0xfoobar',
		icon: Sparkles,
		category: 'twitter',
		tags: ['developer', 'defi', 'security', 'insight'],
		color: '#6366F1'
	},
	{
		id: 'x-twobitidiot',
		name: 'Ryan Selkis (TBI)',
		descriptionKey: 'chain_tools.tools.x_twobitidiot.description',
		url: 'https://x.com/twobitidiot',
		icon: Sparkles,
		category: 'twitter',
		tags: ['messari', 'research', 'macro', 'commentary'],
		color: '#000000'
	},
	{
		id: 'x-matthuang',
		name: 'Matt Huang',
		descriptionKey: 'chain_tools.tools.x_matthuang.description',
		url: 'https://x.com/matthuang',
		icon: Sparkles,
		category: 'twitter',
		tags: ['paradigm', 'investment', 'insight', 'founder'],
		color: '#000000'
	},
	{
		id: 'x-rleshner',
		name: 'Robert Leshner',
		descriptionKey: 'chain_tools.tools.x_rleshner.description',
		url: 'https://x.com/rleshner',
		icon: Sparkles,
		category: 'twitter',
		tags: ['compound', 'defi', 'founder', 'governance'],
		color: '#00D395'
	},
	{
		id: 'x-dabit',
		name: 'Nader Dabit',
		descriptionKey: 'chain_tools.tools.x_dabit.description',
		url: 'https://x.com/dabit3',
		icon: Sparkles,
		category: 'twitter',
		tags: ['developer', 'education', 'tutorials', 'lens'],
		color: '#8B5CF6'
	},
	{
		id: 'x-warcaster',
		name: 'Warpcast Dan',
		descriptionKey: 'chain_tools.tools.x_warcaster.description',
		url: 'https://x.com/dwr',
		icon: Sparkles,
		category: 'twitter',
		tags: ['farcaster', 'social', 'founder', 'insight'],
		color: '#8465CB'
	},
	{
		id: 'x-balajis',
		name: 'Balaji Srinivasan',
		descriptionKey: 'chain_tools.tools.x_balajis.description',
		url: 'https://x.com/balajis',
		icon: Sparkles,
		category: 'twitter',
		tags: ['network-state', 'macro', 'tech', 'philosophy'],
		color: '#F59E0B'
	},
	{
		id: 'x-cdixon',
		name: 'Chris Dixon',
		descriptionKey: 'chain_tools.tools.x_cdixon.description',
		url: 'https://x.com/cdixon',
		icon: Sparkles,
		category: 'twitter',
		tags: ['a16z', 'investment', 'insight', 'web3'],
		color: '#000000'
	},
	{
		id: 'x-ljxie',
		name: 'Linda Xie',
		descriptionKey: 'chain_tools.tools.x_ljxie.description',
		url: 'https://x.com/ljxie',
		icon: Sparkles,
		category: 'twitter',
		tags: ['scalar', 'investment', 'education', 'defi'],
		color: '#EC4899'
	},
	{
		id: 'x-spencernoon',
		name: 'Spencer Noon',
		descriptionKey: 'chain_tools.tools.x_spencernoon.description',
		url: 'https://x.com/spencernoon',
		icon: Sparkles,
		category: 'twitter',
		tags: ['variant', 'investment', 'data', 'defi'],
		color: '#3B82F6'
	},
	{
		id: 'x-sui414',
		name: 'Sui Zhu',
		descriptionKey: 'chain_tools.tools.x_sui414.description',
		url: 'https://x.com/zhusu',
		icon: Sparkles,
		category: 'twitter',
		tags: ['three-arrows', 'trading', 'macro', 'insight'],
		color: '#1DA1F2'
	},
	{
		id: 'x-inversebrah',
		name: 'inversebrah',
		descriptionKey: 'chain_tools.tools.x_inversebrah.description',
		url: 'https://x.com/inversebrah',
		icon: Sparkles,
		category: 'twitter',
		tags: ['meme', 'humor', 'culture', 'ct'],
		color: '#EC4899'
	},
	{
		id: 'x-tetranode',
		name: 'Tetranode',
		descriptionKey: 'chain_tools.tools.x_tetranode.description',
		url: 'https://x.com/Tetranode',
		icon: Sparkles,
		category: 'twitter',
		tags: ['defi', 'whale', 'yield', 'insight'],
		color: '#10B981'
	},
	{
		id: 'x-lookonchain',
		name: 'Lookonchain',
		descriptionKey: 'chain_tools.tools.x_lookonchain.description',
		url: 'https://x.com/lookonchain',
		icon: Twitter,
		category: 'twitter',
		tags: ['analytics', 'onchain', 'whale-tracking', 'data'],
		color: '#3B82F6'
	},
	{
		id: 'x-thedefiedge',
		name: 'The DeFi Edge',
		descriptionKey: 'chain_tools.tools.x_thedefiedge.description',
		url: 'https://x.com/thedefiedge',
		icon: Twitter,
		category: 'twitter',
		tags: ['kol', 'defi', 'education', 'strategies'],
		color: '#10B981'
	},
	{
		id: 'x-defi-made-here',
		name: 'DeFi Made Here',
		descriptionKey: 'chain_tools.tools.x_defi_made_here.description',
		url: 'https://x.com/DeFi_Made_Here',
		icon: Twitter,
		category: 'twitter',
		tags: ['kol', 'defi', 'yields', 'strategies'],
		color: '#8B5CF6'
	},
	{
		id: 'x-0xngmi',
		name: '0xngmi',
		descriptionKey: 'chain_tools.tools.x_0xngmi.description',
		url: 'https://x.com/0xngmi',
		icon: Code,
		category: 'twitter',
		tags: ['developer', 'defillama', 'analytics', 'builder'],
		color: '#10B981'
	},
	{
		id: 'x-banteg',
		name: 'banteg',
		descriptionKey: 'chain_tools.tools.x_banteg.description',
		url: 'https://x.com/banteg',
		icon: Code,
		category: 'twitter',
		tags: ['developer', 'yearn', 'defi', 'python'],
		color: '#0657F9'
	},
	{
		id: 'x-fubuloubu',
		name: 'fubuloubu',
		descriptionKey: 'chain_tools.tools.x_fubuloubu.description',
		url: 'https://x.com/fubuloubu',
		icon: Code,
		category: 'twitter',
		tags: ['developer', 'vyper', 'security', 'ape'],
		color: '#6366F1'
	},

	// ========== Chinese Web3 Bloggers ==========
	{
		id: 'x-0xning',
		name: '0xNing',
		descriptionKey: 'chain_tools.tools.x_0xning.description',
		url: 'https://x.com/0xNing0x',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'kol', 'defi', 'analysis'],
		color: '#EF4444'
	},
	{
		id: 'x-tmel0211',
		name: 'Tmel0211',
		descriptionKey: 'chain_tools.tools.x_tmel0211.description',
		url: 'https://x.com/Tmel0211',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'kol', 'defi', 'research'],
		color: '#3B82F6'
	},
	{
		id: 'x-phyrex',
		name: 'Phyrex',
		descriptionKey: 'chain_tools.tools.x_phyrex.description',
		url: 'https://x.com/Phyrex_Ni',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'analyst', 'data', 'market'],
		color: '#6366F1'
	},
	{
		id: 'x-mindaoyang',
		name: 'Mindao',
		descriptionKey: 'chain_tools.tools.x_mindaoyang.description',
		url: 'https://x.com/mindaoyang',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'defi', 'dforce', 'founder'],
		color: '#8B5CF6'
	},
	{
		id: 'x-jasonchen',
		name: 'Jason Chen',
		descriptionKey: 'chain_tools.tools.x_jasonchen.description',
		url: 'https://x.com/velar_BTC',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'velar', 'btc', 'defi'],
		color: '#F7931A'
	},
	{
		id: 'x-mapleleafcap',
		name: 'MapleLeafCap',
		descriptionKey: 'chain_tools.tools.x_mapleleafcap.description',
		url: 'https://x.com/MapleLeafCap',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'investment', 'research', 'macro'],
		color: '#EF4444'
	},
	{
		id: 'x-cmdefi',
		name: 'CMDeFi',
		descriptionKey: 'chain_tools.tools.x_cmdefi.description',
		url: 'https://x.com/CMDeFi',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'defi', 'research', 'analysis'],
		color: '#10B981'
	},
	{
		id: 'x-0xtodd',
		name: '0xTodd',
		descriptionKey: 'chain_tools.tools.x_0xtodd.description',
		url: 'https://x.com/0x_Todd',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'nothing-research', 'investment', 'insight'],
		color: '#000000'
	},
	{
		id: 'x-haotian',
		name: 'Haotian',
		descriptionKey: 'chain_tools.tools.x_haotian.description',
		url: 'https://x.com/tmel0211',
		icon: Twitter,
		category: 'twitter',
		tags: ['chinese', 'research', 'analysis', 'insight'],
		color: '#3B82F6'
	}
];

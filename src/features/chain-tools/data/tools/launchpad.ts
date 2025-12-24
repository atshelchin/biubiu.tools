/**
 * Launchpad Tools - Token & NFT launch platforms, IDOs, and vesting
 */
import { Rocket, Droplets, Gem, Sparkles, Cpu, TrendingUp, Gamepad2, Lock } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const launchpadTools: ExternalTool[] = [
	// ========== Major Launchpads ==========
	{
		id: 'pump-fun',
		name: 'Pump.fun',
		descriptionKey: 'chain-tools.tools.pump_fun.description',
		url: 'https://pump.fun',
		icon: Rocket,
		category: 'launchpad',
		tags: ['fair-launch', 'meme', 'bonding-curve', 'solana'],
		chains: ['Solana'],
		color: '#00D181'
	},
	{
		id: 'four_meme',
		name: 'Four.meme',
		descriptionKey: 'chain-tools.tools.four_meme.description',
		url: 'https://four.meme',
		icon: Rocket,
		category: 'launchpad',
		tags: ['meme', 'token-launch', 'bnb', 'fair-launch'],
		chains: ['BNB Chain'],
		color: '#FBBF24'
	},
	{
		id: 'dao-maker',
		name: 'DAO Maker',
		descriptionKey: 'chain-tools.tools.dao_maker.description',
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
		descriptionKey: 'chain-tools.tools.fjord_foundry.description',
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
		descriptionKey: 'chain-tools.tools.camelot_launchpad.description',
		url: 'https://camelot.exchange',
		icon: Rocket,
		category: 'launchpad',
		tags: ['arbitrum', 'ido', 'native'],
		chains: ['Arbitrum'],
		color: '#FFAF1D'
	},

	// ========== Presale Platforms ==========
	{
		id: 'pinksale',
		name: 'PinkSale',
		descriptionKey: 'chain-tools.tools.pinksale.description',
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
		descriptionKey: 'chain-tools.tools.gempad.description',
		url: 'https://gempad.app',
		icon: Gem,
		category: 'launchpad',
		tags: ['presale', 'fair-launch', 'multi-chain'],
		chains: ['Ethereum', 'BSC', 'Arbitrum', 'Base'],
		color: '#6366F1'
	},

	// ========== NFT Launch Platforms ==========
	{
		id: 'mint-fun',
		name: 'Mint.fun',
		descriptionKey: 'chain-tools.tools.mint_fun.description',
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
		descriptionKey: 'chain-tools.tools.zora_create.description',
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
		descriptionKey: 'chain-tools.tools.thirdweb_deploy.description',
		url: 'https://thirdweb.com/deploy',
		icon: Rocket,
		category: 'launchpad',
		tags: ['contract', 'deploy', 'no-code', 'sdk'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Base', 'Optimism'],
		color: '#F213A4'
	},

	// ========== GameFi Launchpads ==========
	{
		id: 'seedify',
		name: 'Seedify',
		descriptionKey: 'chain-tools.tools.seedify.description',
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
		descriptionKey: 'chain-tools.tools.polkastarter.description',
		url: 'https://polkastarter.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['ido', 'cross-chain', 'gaming'],
		chains: ['Ethereum', 'Polygon', 'BSC'],
		color: '#FF006B'
	},
	{
		id: 'gamefi_launchpad',
		name: 'GameFi Launchpad',
		descriptionKey: 'chain-tools.tools.gamefi_launchpad.description',
		url: 'https://gamefi.org/launchpad',
		icon: Gamepad2,
		category: 'launchpad',
		tags: ['gaming', 'igo', 'ido', 'incubator'],
		chains: ['BNB Chain', 'Ethereum', 'Polygon'],
		color: '#EC4899'
	},
	{
		id: 'enjinstarter',
		name: 'Enjinstarter',
		descriptionKey: 'chain-tools.tools.enjinstarter.description',
		url: 'https://enjinstarter.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['gaming', 'metaverse', 'ido', 'nft'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon'],
		color: '#7C3AED'
	},

	// ========== Meme Token Launchpads ==========
	{
		id: 'sunpump',
		name: 'SunPump',
		descriptionKey: 'chain-tools.tools.sunpump.description',
		url: 'https://sunpump.meme',
		icon: Rocket,
		category: 'launchpad',
		tags: ['meme', 'token-launch', 'tron', 'fair-launch'],
		chains: ['Tron'],
		color: '#FF0000'
	},
	{
		id: 'moonshot',
		name: 'Moonshot',
		descriptionKey: 'chain-tools.tools.moonshot.description',
		url: 'https://moonshot.money',
		icon: Rocket,
		category: 'launchpad',
		tags: ['meme', 'token-launch', 'solana', 'trading'],
		chains: ['Solana'],
		color: '#7C3AED'
	},
	{
		id: 'ape_store',
		name: 'Ape.Store',
		descriptionKey: 'chain-tools.tools.ape_store.description',
		url: 'https://ape.store',
		icon: Rocket,
		category: 'launchpad',
		tags: ['meme', 'token-launch', 'ethereum', 'fair-launch'],
		chains: ['Ethereum', 'Base'],
		color: '#10B981'
	},
	{
		id: 'believe',
		name: 'Believe',
		descriptionKey: 'chain-tools.tools.believe.description',
		url: 'https://believe.app',
		icon: Sparkles,
		category: 'launchpad',
		tags: ['meme', 'social', 'token-launch', 'solana'],
		chains: ['Solana'],
		color: '#EC4899'
	},
	{
		id: 'virtuals',
		name: 'Virtuals Protocol',
		descriptionKey: 'chain-tools.tools.virtuals.description',
		url: 'https://virtuals.io',
		icon: Cpu,
		category: 'launchpad',
		tags: ['ai-agent', 'token-launch', 'base', 'gaming'],
		chains: ['Base'],
		color: '#3B82F6'
	},
	{
		id: 'clanker',
		name: 'Clanker',
		descriptionKey: 'chain-tools.tools.clanker.description',
		url: 'https://clanker.world',
		icon: Rocket,
		category: 'launchpad',
		tags: ['meme', 'farcaster', 'base', 'social-token'],
		chains: ['Base'],
		color: '#8B5CF6'
	},
	{
		id: 'dexscreener_moonshot',
		name: 'DEXScreener Moonshot',
		descriptionKey: 'chain-tools.tools.dexscreener_moonshot.description',
		url: 'https://dexscreener.com/moonshot',
		icon: TrendingUp,
		category: 'launchpad',
		tags: ['meme', 'analytics', 'trending', 'discovery'],
		chains: ['Solana'],
		color: '#00D395'
	},

	// ========== Multi-chain Launchpads ==========
	{
		id: 'bounce',
		name: 'Bounce',
		descriptionKey: 'chain-tools.tools.bounce.description',
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
		descriptionKey: 'chain-tools.tools.tokensoft.description',
		url: 'https://tokensoft.io',
		icon: Rocket,
		category: 'launchpad',
		tags: ['distribution', 'airdrop', 'compliance', 'launch'],
		color: '#4F46E5'
	},
	{
		id: 'starter',
		name: 'Starter',
		descriptionKey: 'chain-tools.tools.starter.description',
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
		descriptionKey: 'chain-tools.tools.impossible_finance.description',
		url: 'https://impossible.finance',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'incubator', 'staking'],
		chains: ['BNB Chain', 'Ethereum', 'Arbitrum'],
		color: '#3B82F6'
	},
	{
		id: 'kommunitas',
		name: 'Kommunitas',
		descriptionKey: 'chain-tools.tools.kommunitas.description',
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
		descriptionKey: 'chain-tools.tools.red_kite.description',
		url: 'https://redkite.polkafoundry.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'polkafoundry'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon'],
		color: '#EF4444'
	},
	{
		id: 'trustpad',
		name: 'TrustPad',
		descriptionKey: 'chain-tools.tools.trustpad.description',
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
		descriptionKey: 'chain-tools.tools.spores.description',
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
		descriptionKey: 'chain-tools.tools.bullperks.description',
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
		descriptionKey: 'chain-tools.tools.decubate.description',
		url: 'https://decubate.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'vesting', 'crowdfunding'],
		chains: ['BNB Chain', 'Ethereum'],
		color: '#3B82F6'
	},
	{
		id: 'ape-terminal',
		name: 'Ape Terminal',
		descriptionKey: 'chain-tools.tools.ape_terminal.description',
		url: 'https://apeterminal.io',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'fair-launch', 'research'],
		chains: ['Ethereum', 'BNB Chain', 'Arbitrum', 'Base'],
		color: '#10B981'
	},

	// ========== TON Launchpads ==========
	{
		id: 'gagarin',
		name: 'Gagarin Launchpad',
		descriptionKey: 'chain-tools.tools.gagarin.description',
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
		descriptionKey: 'chain-tools.tools.tonstarter.description',
		url: 'https://tonstarter.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['ton', 'ido', 'telegram', 'incubator'],
		chains: ['TON'],
		color: '#0088CC'
	},

	// ========== Solana Launchpads ==========
	{
		id: 'lfg_launchpad',
		name: 'LFG Launchpad',
		descriptionKey: 'chain-tools.tools.lfg_launchpad.description',
		url: 'https://lfg.jup.ag',
		icon: Rocket,
		category: 'launchpad',
		tags: ['jupiter', 'solana', 'ido', 'fair-launch'],
		chains: ['Solana'],
		color: '#22C55E'
	},
	{
		id: 'raydium_acceleraytor',
		name: 'AcceleRaytor',
		descriptionKey: 'chain-tools.tools.raydium_acceleraytor.description',
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
		descriptionKey: 'chain-tools.tools.meteora_dlmm.description',
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
		descriptionKey: 'chain-tools.tools.orca_whirlpools.description',
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
		descriptionKey: 'chain-tools.tools.legion.description',
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
		descriptionKey: 'chain-tools.tools.armada.description',
		url: 'https://armada.so',
		icon: Rocket,
		category: 'launchpad',
		tags: ['solana', 'staking', 'validators', 'infrastructure'],
		chains: ['Solana'],
		color: '#1E3A8A'
	},
	{
		id: 'poolside-fi',
		name: 'Poolside',
		descriptionKey: 'chain-tools.tools.poolside_fi.description',
		url: 'https://poolside.fi',
		icon: Rocket,
		category: 'launchpad',
		tags: ['solana', 'liquidity', 'bootstrap', 'lbp'],
		chains: ['Solana'],
		color: '#14F195'
	},

	// ========== Vesting & Token Management ==========
	{
		id: 'hedgey',
		name: 'Hedgey',
		descriptionKey: 'chain-tools.tools.hedgey.description',
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
		descriptionKey: 'chain-tools.tools.magna.description',
		url: 'https://magna.so',
		icon: Lock,
		category: 'launchpad',
		tags: ['vesting', 'token', 'management', 'distribution'],
		color: '#3B82F6'
	},
	{
		id: 'superfluid-vesting',
		name: 'Superfluid Vesting',
		descriptionKey: 'chain-tools.tools.superfluid_vesting.description',
		url: 'https://www.superfluid.finance/vesting',
		icon: Lock,
		category: 'launchpad',
		tags: ['vesting', 'streaming', 'token', 'continuous'],
		chains: ['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC'],
		color: '#10B981'
	},
	{
		id: 'streamflow',
		name: 'Streamflow',
		descriptionKey: 'chain-tools.tools.streamflow.description',
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
		descriptionKey: 'chain-tools.tools.vestinglab.description',
		url: 'https://vestinglab.io',
		icon: Lock,
		category: 'launchpad',
		tags: ['vesting', 'token-management', 'multichain'],
		chains: ['Ethereum', 'Polygon', 'BNB Chain', 'Arbitrum'],
		color: '#8B5CF6'
	},

	// ========== New Launchpads ==========
	{
		id: 'echo-launchpad',
		name: 'Echo',
		descriptionKey: 'chain-tools.tools.echo_launchpad.description',
		url: 'https://echo.xyz',
		icon: Rocket,
		category: 'launchpad',
		tags: ['angel', 'community', 'investing', 'allocation'],
		color: '#8B5CF6'
	},
	{
		id: 'bonsaidao-launchpad',
		name: 'BonsaiDAO',
		descriptionKey: 'chain-tools.tools.bonsaidao_launchpad.description',
		url: 'https://bonsaidao.xyz',
		icon: Rocket,
		category: 'launchpad',
		tags: ['arbitrum', 'incubator', 'community', 'launch'],
		chains: ['Arbitrum'],
		color: '#22C55E'
	},
	{
		id: 'axis-finance',
		name: 'Axis Finance',
		descriptionKey: 'chain-tools.tools.axis_finance.description',
		url: 'https://axis.finance',
		icon: Rocket,
		category: 'launchpad',
		tags: ['auctions', 'otc', 'batch', 'token-sales'],
		chains: ['Ethereum', 'Arbitrum', 'Base'],
		color: '#3B82F6'
	},
	{
		id: 'surge-launchpad',
		name: 'Surge',
		descriptionKey: 'chain-tools.tools.surge_launchpad.description',
		url: 'https://surge.build',
		icon: Rocket,
		category: 'launchpad',
		tags: ['base', 'incubator', 'community', 'fair-launch'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'blastoff-launchpad',
		name: 'Blastoff',
		descriptionKey: 'chain-tools.tools.blastoff_launchpad.description',
		url: 'https://blastoff.zone',
		icon: Rocket,
		category: 'launchpad',
		tags: ['blast', 'ido', 'staking', 'allocation'],
		chains: ['Blast'],
		color: '#FCFC03'
	},
	{
		id: 'daomaker-launchpad',
		name: 'DAO Maker Launchpad',
		descriptionKey: 'chain-tools.tools.daomaker_launchpad.description',
		url: 'https://daomaker.com/launchpad',
		icon: Rocket,
		category: 'launchpad',
		tags: ['sho', 'ido', 'multichain', 'tier-system'],
		chains: ['Ethereum', 'BNB Chain', 'Polygon'],
		color: '#F97316'
	},
	{
		id: 'seedify-launchpad',
		name: 'Seedify Launchpad',
		descriptionKey: 'chain-tools.tools.seedify_launchpad.description',
		url: 'https://launchpad.seedify.fund',
		icon: Rocket,
		category: 'launchpad',
		tags: ['gaming', 'igo', 'incubator', 'staking'],
		chains: ['BNB Chain', 'Ethereum'],
		color: '#22C55E'
	},
	{
		id: 'coinstarter',
		name: 'CoinStarter',
		descriptionKey: 'chain-tools.tools.coinstarter.description',
		url: 'https://coinstarter.com',
		icon: Rocket,
		category: 'launchpad',
		tags: ['multichain', 'ido', 'crowdfunding', 'community'],
		chains: ['Ethereum', 'BNB Chain'],
		color: '#EF4444'
	}
];

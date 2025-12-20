/**
 * GameFi Tools - Gaming, metaverse, and play-to-earn platforms
 */
import {
	Gamepad2,
	Sword,
	Trophy,
	Sparkles,
	Hexagon,
	Users,
	Box,
	Flame,
	Joystick
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const gamefiTools: ExternalTool[] = [
	// ========== Gaming Platforms ==========
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

	// ========== Gaming SDKs & Tools ==========
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

	// ========== Gaming Guilds ==========
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

	// ========== Gaming Assets ==========
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

	// ========== Gaming Platforms ==========
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
		id: 'portal-gaming',
		name: 'Portal',
		descriptionKey: 'chain_tools.tools.portal_gaming.description',
		url: 'https://portalgaming.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['cross-chain', 'gaming', 'wallet', 'discovery'],
		color: '#6366F1'
	},

	// ========== Games ==========
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

	// ========== Gaming Chains ==========
	{
		id: 'ronin-gaming',
		name: 'Ronin',
		descriptionKey: 'chain_tools.tools.ronin_gaming.description',
		url: 'https://roninchain.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['gaming', 'chain', 'axie', 'sidechain'],
		chains: ['Ronin'],
		color: '#1273EA'
	},
	{
		id: 'prime-gaming',
		name: 'Prime Gaming',
		descriptionKey: 'chain_tools.tools.prime_gaming.description',
		url: 'https://echelon.io',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['parallel', 'gaming', 'prime', 'ecosystem'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'sui-gaming',
		name: 'Sui Gaming',
		descriptionKey: 'chain_tools.tools.sui_gaming.description',
		url: 'https://sui.io/gaming',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['sui', 'gaming', 'move', 'objects'],
		chains: ['Sui'],
		color: '#4DA2FF'
	},
	{
		id: 'fractal-gaming',
		name: 'Fractal',
		descriptionKey: 'chain_tools.tools.fractal_gaming.description',
		url: 'https://fractal.is',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['marketplace', 'gaming', 'nft', 'discovery'],
		chains: ['Solana', 'Ethereum', 'Polygon'],
		color: '#8B5CF6'
	},
	{
		id: 'playnance',
		name: 'Playnance',
		descriptionKey: 'chain_tools.tools.playnance.description',
		url: 'https://playnance.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['esports', 'prediction', 'gaming', 'betting'],
		color: '#EC4899'
	},
	{
		id: 'myria-gaming',
		name: 'Myria',
		descriptionKey: 'chain_tools.tools.myria_gaming.description',
		url: 'https://myria.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['l2', 'gaming', 'nft', 'studio'],
		chains: ['Myria'],
		color: '#00F0FF'
	},
	{
		id: 'oasys-gaming',
		name: 'Oasys',
		descriptionKey: 'chain_tools.tools.oasys_gaming.description',
		url: 'https://oasys.games',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['gaming', 'chain', 'japan', 'aaa'],
		chains: ['Oasys'],
		color: '#00D4AA'
	},
	{
		id: 'xborg-gaming',
		name: 'XBorg',
		descriptionKey: 'chain_tools.tools.xborg_gaming.description',
		url: 'https://xborg.com',
		icon: Trophy,
		category: 'gamefi',
		tags: ['esports', 'identity', 'gaming', 'credentials'],
		color: '#EF4444'
	},
	{
		id: 'beam-gaming',
		name: 'Beam',
		descriptionKey: 'chain_tools.tools.beam_gaming.description',
		url: 'https://beam.gg',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['gaming', 'subnet', 'avalanche', 'merit-circle'],
		chains: ['Beam'],
		color: '#FBBF24'
	},

	// ========== Additional Gaming Tools ==========
	{
		id: 'gala-games',
		name: 'Gala Games',
		descriptionKey: 'chain_tools.tools.gala_games.description',
		url: 'https://gala.games',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['gaming', 'ecosystem', 'nft', 'play-to-earn'],
		chains: ['Ethereum', 'GalaChain'],
		color: '#F59E0B'
	},
	{
		id: 'sandbox',
		name: 'The Sandbox',
		descriptionKey: 'chain_tools.tools.sandbox.description',
		url: 'https://www.sandbox.game',
		icon: Box,
		category: 'gamefi',
		tags: ['metaverse', 'land', 'ugc', 'virtual-world'],
		chains: ['Ethereum', 'Polygon'],
		color: '#04ADBF'
	},
	{
		id: 'decentraland',
		name: 'Decentraland',
		descriptionKey: 'chain_tools.tools.decentraland.description',
		url: 'https://decentraland.org',
		icon: Box,
		category: 'gamefi',
		tags: ['metaverse', 'land', 'virtual-world', 'dao'],
		chains: ['Ethereum'],
		color: '#FF2D55'
	},
	{
		id: 'axie-infinity',
		name: 'Axie Infinity',
		descriptionKey: 'chain_tools.tools.axie_infinity.description',
		url: 'https://axieinfinity.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['game', 'nft', 'breeding', 'play-to-earn'],
		chains: ['Ronin'],
		color: '#1273EA'
	},
	{
		id: 'gods-unchained',
		name: 'Gods Unchained',
		descriptionKey: 'chain_tools.tools.gods_unchained.description',
		url: 'https://godsunchained.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['tcg', 'cards', 'free-to-play', 'competitive'],
		chains: ['Immutable X'],
		color: '#C9AA6B'
	},
	{
		id: 'bigtime',
		name: 'Big Time',
		descriptionKey: 'chain_tools.tools.bigtime.description',
		url: 'https://bigtime.gg',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['game', 'action-rpg', 'multiplayer', 'aaa'],
		chains: ['Ethereum'],
		color: '#7C3AED'
	},
	{
		id: 'guild-of-guardians',
		name: 'Guild of Guardians',
		descriptionKey: 'chain_tools.tools.guild_of_guardians.description',
		url: 'https://guildofguardians.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['game', 'rpg', 'mobile', 'squad-based'],
		chains: ['Immutable X'],
		color: '#00BFBF'
	},
	{
		id: 'ember-sword',
		name: 'Ember Sword',
		descriptionKey: 'chain_tools.tools.ember_sword.description',
		url: 'https://embersword.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['mmorpg', 'sandbox', 'free-to-play', 'land'],
		chains: ['Immutable zkEVM'],
		color: '#FF6B35'
	},
	{
		id: 'star-atlas',
		name: 'Star Atlas',
		descriptionKey: 'chain_tools.tools.star_atlas.description',
		url: 'https://staratlas.com',
		icon: Sparkles,
		category: 'gamefi',
		tags: ['metaverse', 'space', 'strategy', 'solana'],
		chains: ['Solana'],
		color: '#0D1117'
	},
	{
		id: 'splinterlands',
		name: 'Splinterlands',
		descriptionKey: 'chain_tools.tools.splinterlands.description',
		url: 'https://splinterlands.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['tcg', 'cards', 'battle', 'play-to-earn'],
		chains: ['Hive', 'BSC'],
		color: '#F44336'
	},
	// ========== More Popular Games ==========
	{
		id: 'stepn',
		name: 'STEPN',
		descriptionKey: 'chain_tools.tools.stepn.description',
		url: 'https://stepn.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['move-to-earn', 'fitness', 'nft', 'lifestyle'],
		chains: ['Solana', 'BNB Chain', 'Ethereum'],
		color: '#00E676',
		isFeatured: true
	},
	{
		id: 'hero-of-mavia',
		name: 'Heroes of Mavia',
		descriptionKey: 'chain_tools.tools.hero_of_mavia.description',
		url: 'https://mavia.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['strategy', 'base-building', 'mobile', 'pvp'],
		chains: ['Ethereum'],
		color: '#7C3AED'
	},
	{
		id: 'night-crows',
		name: 'Night Crows',
		descriptionKey: 'chain_tools.tools.night_crows.description',
		url: 'https://nightcrows.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['mmorpg', 'wemix', 'korean', 'aaa'],
		chains: ['WEMIX'],
		color: '#1E1E1E'
	},
	{
		id: 'mir4',
		name: 'MIR4',
		descriptionKey: 'chain_tools.tools.mir4.description',
		url: 'https://mir4global.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['mmorpg', 'wemix', 'martial-arts', 'mining'],
		chains: ['WEMIX'],
		color: '#C9AA6B'
	},
	{
		id: 'wildcard',
		name: 'Wildcard',
		descriptionKey: 'chain_tools.tools.wildcard.description',
		url: 'https://playwildcard.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['arena', 'strategy', 'competitive', 'esports'],
		chains: ['Ethereum'],
		color: '#FF6B00'
	},
	{
		id: 'off-the-grid',
		name: 'Off the Grid',
		descriptionKey: 'chain_tools.tools.off_the_grid.description',
		url: 'https://offthegrid.gg',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['battle-royale', 'shooter', 'cyberpunk', 'aaa'],
		chains: ['Avalanche'],
		color: '#00FF87',
		isFeatured: true
	},
	{
		id: 'maple-story-universe',
		name: 'MapleStory Universe',
		descriptionKey: 'chain_tools.tools.maple_story_universe.description',
		url: 'https://msu.io',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['mmorpg', 'nexon', 'korean', 'nostalgic'],
		chains: ['Polygon'],
		color: '#FF9800'
	},
	{
		id: 'nyan-heroes',
		name: 'Nyan Heroes',
		descriptionKey: 'chain_tools.tools.nyan_heroes.description',
		url: 'https://nyanheroes.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['shooter', 'hero', 'solana', 'free-to-play'],
		chains: ['Solana'],
		color: '#FF6B6B'
	},
	{
		id: 'aurory',
		name: 'Aurory',
		descriptionKey: 'chain_tools.tools.aurory.description',
		url: 'https://aurory.io',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['jrpg', 'tactics', 'solana', 'nft'],
		chains: ['Solana'],
		color: '#8B5CF6'
	},
	{
		id: 'phantom-galaxies',
		name: 'Phantom Galaxies',
		descriptionKey: 'chain_tools.tools.phantom_galaxies.description',
		url: 'https://phantomgalaxies.com',
		icon: Sparkles,
		category: 'gamefi',
		tags: ['mecha', 'space', 'action-rpg', 'polygon'],
		chains: ['Polygon'],
		color: '#6366F1'
	},
	{
		id: 'crypto-unicorns',
		name: 'Crypto Unicorns',
		descriptionKey: 'chain_tools.tools.crypto_unicorns.description',
		url: 'https://cryptounicorns.fun',
		icon: Sparkles,
		category: 'gamefi',
		tags: ['breeding', 'farming', 'casual', 'polygon'],
		chains: ['Polygon'],
		color: '#EC4899'
	},
	{
		id: 'legends-of-venari',
		name: 'Legends of Venari',
		descriptionKey: 'chain_tools.tools.legends_of_venari.description',
		url: 'https://legendsofvenari.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['creature', 'exploration', 'collection', 'ethereum'],
		chains: ['Ethereum'],
		color: '#22C55E'
	},
	{
		id: 'blocklords',
		name: 'BLOCKLORDS',
		descriptionKey: 'chain_tools.tools.blocklords.description',
		url: 'https://blocklords.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['strategy', 'medieval', 'grand-strategy', 'immutable'],
		chains: ['Immutable X'],
		color: '#B45309'
	},
	{
		id: 'planet-ix',
		name: 'Planet IX',
		descriptionKey: 'chain_tools.tools.planet_ix.description',
		url: 'https://planetix.com',
		icon: Box,
		category: 'gamefi',
		tags: ['strategy', 'nft', 'polygon', 'land'],
		chains: ['Polygon'],
		color: '#3B82F6'
	},
	{
		id: 'sweat-economy',
		name: 'Sweat Economy',
		descriptionKey: 'chain_tools.tools.sweat_economy.description',
		url: 'https://sweateconomy.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['move-to-earn', 'fitness', 'near', 'lifestyle'],
		chains: ['NEAR'],
		color: '#F59E0B'
	},
	{
		id: 'superior',
		name: 'Superior',
		descriptionKey: 'chain_tools.tools.superior.description',
		url: 'https://playsuperior.com',
		icon: Gamepad2,
		category: 'gamefi',
		tags: ['roguelike', 'shooter', 'co-op', 'gala'],
		chains: ['GalaChain'],
		color: '#EF4444'
	},
	{
		id: 'champions-ascension',
		name: 'Champions Ascension',
		descriptionKey: 'chain_tools.tools.champions_ascension.description',
		url: 'https://championsascension.com',
		icon: Sword,
		category: 'gamefi',
		tags: ['action-rpg', 'arena', 'massively', 'ethereum'],
		chains: ['Ethereum'],
		color: '#8B5CF6'
	}
];

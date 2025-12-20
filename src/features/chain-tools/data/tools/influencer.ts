/**
 * Web3 Influencers & KOLs - Global Crypto Thought Leaders
 *
 * Categories:
 * - English (Global)
 * - Chinese (中文)
 * - Japanese (日本語)
 * - Korean (한국어)
 * - Spanish (Español)
 * - Portuguese (Português)
 * - French (Français)
 * - German (Deutsch)
 * - Russian (Русский)
 * - Arabic (العربية)
 * - Turkish (Türkçe)
 * - Vietnamese (Tiếng Việt)
 * - Indonesian (Bahasa)
 * - Thai (ไทย)
 * - Hindi (हिन्दी)
 */
import { Twitter, Youtube, MessageCircle, User, Mic, Video, Globe } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const influencerTools: ExternalTool[] = [
	// ========== English - Global Influencers ==========
	{
		id: 'kol-vitalik',
		name: 'Vitalik Buterin',
		descriptionKey: 'chain_tools.tools.kol_vitalik.description',
		url: 'https://x.com/VitalikButerin',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'ethereum', 'founder', 'english'],
		color: '#627EEA',
		isFeatured: true
	},
	{
		id: 'kol-cz-binance',
		name: 'CZ (Changpeng Zhao)',
		descriptionKey: 'chain_tools.tools.kol_cz_binance.description',
		url: 'https://x.com/cz_binance',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'binance', 'founder', 'english', 'chinese'],
		color: '#F0B90B',
		isFeatured: true
	},
	{
		id: 'kol-brian-armstrong',
		name: 'Brian Armstrong',
		descriptionKey: 'chain_tools.tools.kol_brian_armstrong.description',
		url: 'https://x.com/brian_armstrong',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'coinbase', 'ceo', 'english'],
		color: '#0052FF',
		isFeatured: true
	},
	{
		id: 'kol-balaji',
		name: 'Balaji Srinivasan',
		descriptionKey: 'chain_tools.tools.kol_balaji.description',
		url: 'https://x.com/balajis',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'a16z', 'network-state', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-naval',
		name: 'Naval Ravikant',
		descriptionKey: 'chain_tools.tools.kol_naval.description',
		url: 'https://x.com/naval',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'investor', 'philosophy', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-cobie',
		name: 'Cobie',
		descriptionKey: 'chain_tools.tools.kol_cobie.description',
		url: 'https://x.com/cobie',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'trader', 'defi', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-hsaka',
		name: 'Hsaka',
		descriptionKey: 'chain_tools.tools.kol_hsaka.description',
		url: 'https://x.com/HsakaTrades',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'trader', 'analysis', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-tetranode',
		name: 'Tetranode',
		descriptionKey: 'chain_tools.tools.kol_tetranode.description',
		url: 'https://x.com/Tetranode',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'defi', 'whale', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-lookonchain',
		name: 'Lookonchain',
		descriptionKey: 'chain_tools.tools.kol_lookonchain.description',
		url: 'https://x.com/lookonchain',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'on-chain', 'analytics', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-defi-dad',
		name: 'DeFi Dad',
		descriptionKey: 'chain_tools.tools.kol_defi_dad.description',
		url: 'https://x.com/DeFi_Dad',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'defi', 'education', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-punk6529',
		name: 'punk6529',
		descriptionKey: 'chain_tools.tools.kol_punk6529.description',
		url: 'https://x.com/punk6529',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'nft', 'collector', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-ansem',
		name: 'Ansem',
		descriptionKey: 'chain_tools.tools.kol_ansem.description',
		url: 'https://x.com/blknoiz06',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'solana', 'meme', 'english'],
		color: '#9945FF',
		isFeatured: true
	},
	{
		id: 'kol-cryptohayes',
		name: 'Arthur Hayes',
		descriptionKey: 'chain_tools.tools.kol_cryptohayes.description',
		url: 'https://x.com/CryptoHayes',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'bitmex', 'macro', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-raoul-pal',
		name: 'Raoul Pal',
		descriptionKey: 'chain_tools.tools.kol_raaborhmason.description',
		url: 'https://x.com/RaoulGMI',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'macro', 'realvision', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-ericryptoguy',
		name: 'Eric Cryptoman',
		descriptionKey: 'chain_tools.tools.kol_ericryptoguy.description',
		url: 'https://x.com/EricCryptoman',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'trader', 'altcoins', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-dankrad',
		name: 'Dankrad Feist',
		descriptionKey: 'chain_tools.tools.kol_dankrad.description',
		url: 'https://x.com/dankrad',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'ethereum', 'researcher', 'english'],
		color: '#627EEA'
	},
	{
		id: 'kol-sassal',
		name: 'Sassal',
		descriptionKey: 'chain_tools.tools.kol_sassal.description',
		url: 'https://x.com/sassal0x',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'ethereum', 'daily-gwei', 'english'],
		color: '#627EEA'
	},
	{
		id: 'kol-wublock',
		name: 'WuBlockchain',
		descriptionKey: 'chain_tools.tools.kol_wublock.description',
		url: 'https://x.com/WuBlockchain',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'news', 'china', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-tier10k',
		name: 'Tier10K',
		descriptionKey: 'chain_tools.tools.kol_tier10k.description',
		url: 'https://x.com/tier10k',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'news', 'breaking', 'english'],
		color: '#1DA1F2'
	},
	// ========== YouTube & Podcasts ==========
	{
		id: 'kol-bankless-yt',
		name: 'Bankless',
		descriptionKey: 'chain_tools.tools.kol_bankless_yt.description',
		url: 'https://www.youtube.com/@Bankless',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'kol-coinbureau',
		name: 'Coin Bureau',
		descriptionKey: 'chain_tools.tools.kol_coinbureau.description',
		url: 'https://www.youtube.com/@CoinBureau',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'kol-unchained-yt',
		name: 'Unchained Podcast',
		descriptionKey: 'chain_tools.tools.kol_unchained_yt.description',
		url: 'https://www.youtube.com/@UnchainedPodcast',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'podcast', 'interview', 'english'],
		color: '#FF0000'
	},
	{
		id: 'kol-bell-curve',
		name: 'Bell Curve Podcast',
		descriptionKey: 'chain_tools.tools.kol_bell_curve.description',
		url: 'https://www.youtube.com/@TheBellCurvePodcast',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#FF0000'
	},

	// ========== Chinese 中文 KOL ==========
	{
		id: 'kol-bitfish',
		name: '比特傻 (BitFish)',
		descriptionKey: 'chain_tools.tools.kol_bitfish.description',
		url: 'https://x.com/bitfish1',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'analysis', 'macro'],
		color: '#DE2910',
		isFeatured: true
	},
	{
		id: 'kol-colin-wu',
		name: '吴说区块链 (Colin Wu)',
		descriptionKey: 'chain_tools.tools.kol_colin_wu.description',
		url: 'https://x.com/WuBlockchain',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'news', 'mining'],
		color: '#DE2910',
		isFeatured: true
	},
	{
		id: 'kol-mindao',
		name: '杨民道 (Mindao)',
		descriptionKey: 'chain_tools.tools.kol_mindao.description',
		url: 'https://x.com/mindaoyang',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'defi', 'dforce'],
		color: '#DE2910'
	},
	{
		id: 'kol-bitrun',
		name: '比特币狂人',
		descriptionKey: 'chain_tools.tools.kol_bitrun.description',
		url: 'https://weibo.com/bitcoinmania',
		icon: Globe,
		category: 'influencer',
		tags: ['kol', 'chinese', 'analysis', 'weibo'],
		color: '#DE2910'
	},
	{
		id: 'kol-phyrex',
		name: 'Phyrex',
		descriptionKey: 'chain_tools.tools.kol_phyrex.description',
		url: 'https://x.com/Phyrex_Ni',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'data', 'analysis'],
		color: '#DE2910',
		isFeatured: true
	},
	{
		id: 'kol-0xsun',
		name: '0xSun',
		descriptionKey: 'chain_tools.tools.kol_0xsun.description',
		url: 'https://x.com/0xSunNFT',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'nft', 'alpha'],
		color: '#DE2910'
	},
	{
		id: 'kol-bitwu',
		name: 'BitWu吴子龙',
		descriptionKey: 'chain_tools.tools.kol_bitwu.description',
		url: 'https://x.com/BTW0205',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'trader', 'education'],
		color: '#DE2910'
	},

	// ========== Japanese 日本語 KOL ==========
	{
		id: 'kol-maki',
		name: 'マキ (Maki)',
		descriptionKey: 'chain_tools.tools.kol_maki.description',
		url: 'https://x.com/0xMaki',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'japanese', 'defi', 'sushi'],
		color: '#BC002D',
		isFeatured: true
	},
	{
		id: 'kol-ikehaya',
		name: 'ikehaya (イケハヤ)',
		descriptionKey: 'chain_tools.tools.kol_ikehaya.description',
		url: 'https://x.com/IHayato',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'japanese', 'nft', 'creator'],
		color: '#BC002D',
		isFeatured: true
	},
	{
		id: 'kol-crypto-navi',
		name: 'クリプトナビ',
		descriptionKey: 'chain_tools.tools.kol_crypto_navi.description',
		url: 'https://www.youtube.com/@cryptonavi',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'japanese', 'youtube', 'education'],
		color: '#BC002D'
	},

	// ========== Korean 한국어 KOL ==========
	{
		id: 'kol-cryptoquant-ki',
		name: 'Ki Young Ju',
		descriptionKey: 'chain_tools.tools.kol_cryptoquant_ki.description',
		url: 'https://x.com/ki_young_ju',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'korean', 'cryptoquant', 'on-chain'],
		color: '#003478',
		isFeatured: true
	},
	{
		id: 'kol-crypto-god',
		name: '크립토갓 (Crypto God)',
		descriptionKey: 'chain_tools.tools.kol_crypto_god.description',
		url: 'https://www.youtube.com/@cryptogod_kr',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'korean', 'youtube', 'analysis'],
		color: '#003478'
	},

	// ========== Spanish Español KOL ==========
	{
		id: 'kol-cripto247',
		name: 'Cripto247',
		descriptionKey: 'chain_tools.tools.kol_cripto247.description',
		url: 'https://x.com/Cripto247',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'spanish', 'news', 'latam'],
		color: '#F1BF00'
	},
	{
		id: 'kol-jorge-crypto',
		name: 'Jorge Crypto',
		descriptionKey: 'chain_tools.tools.kol_jorge_crypto.description',
		url: 'https://www.youtube.com/@JorgeCryptoTV',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'spanish', 'youtube', 'trading'],
		color: '#F1BF00'
	},

	// ========== Portuguese Português KOL ==========
	{
		id: 'kol-criptomaniacos',
		name: 'Criptomaníacos',
		descriptionKey: 'chain_tools.tools.kol_criptomaniacos.description',
		url: 'https://www.youtube.com/@criptomaniacos',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'portuguese', 'youtube', 'education'],
		color: '#009B3A'
	},
	{
		id: 'kol-bitboy-br',
		name: 'Gustavo Cerbasi Crypto',
		descriptionKey: 'chain_tools.tools.kol_bitboy_br.description',
		url: 'https://x.com/gcerbasi',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'portuguese', 'brazil', 'finance'],
		color: '#009B3A'
	},

	// ========== French Français KOL ==========
	{
		id: 'kol-hasheur',
		name: 'Hasheur (Owen Simonin)',
		descriptionKey: 'chain_tools.tools.kol_hasheur.description',
		url: 'https://x.com/PowerHasheur',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'french', 'youtube', 'education'],
		color: '#002654',
		isFeatured: true
	},
	{
		id: 'kol-cryptoast',
		name: 'Cryptoast',
		descriptionKey: 'chain_tools.tools.kol_cryptoast.description',
		url: 'https://x.com/Cryptoast_FR',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'french', 'news', 'media'],
		color: '#002654'
	},
	{
		id: 'kol-monsieur-tk',
		name: 'Monsieur TK',
		descriptionKey: 'chain_tools.tools.kol_monsieur_tk.description',
		url: 'https://x.com/MiningTk',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'french', 'defi', 'analysis'],
		color: '#002654'
	},

	// ========== German Deutsch KOL ==========
	{
		id: 'kol-blocktrainer',
		name: 'Blocktrainer',
		descriptionKey: 'chain_tools.tools.kol_blocktrainer.description',
		url: 'https://www.youtube.com/@Blocktrainer',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'german', 'bitcoin', 'education'],
		color: '#FFCC00',
		isFeatured: true
	},
	{
		id: 'kol-julian-hosp',
		name: 'Julian Hosp',
		descriptionKey: 'chain_tools.tools.kol_julian_hosp.description',
		url: 'https://x.com/julianhosp',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'german', 'defi', 'cakedefi'],
		color: '#FFCC00'
	},

	// ========== Russian Русский KOL ==========
	{
		id: 'kol-incrypted',
		name: 'Incrypted',
		descriptionKey: 'chain_tools.tools.kol_incrypted.description',
		url: 'https://x.com/incrypted_com',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'russian', 'news', 'media'],
		color: '#D52B1E'
	},
	{
		id: 'kol-cryptoins',
		name: 'Crypto Insider RU',
		descriptionKey: 'chain_tools.tools.kol_cryptoins.description',
		url: 'https://t.me/cryptoinsiders_ru',
		icon: MessageCircle,
		category: 'influencer',
		tags: ['kol', 'russian', 'telegram', 'signals'],
		color: '#D52B1E'
	},

	// ========== Arabic العربية KOL ==========

	// ========== Turkish Türkçe KOL ==========
	{
		id: 'kol-coin-otag',
		name: 'Coin Otag',
		descriptionKey: 'chain_tools.tools.kol_coin_otag.description',
		url: 'https://x.com/CoinOtag',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'turkish', 'news', 'media'],
		color: '#E30A17'
	},
	{
		id: 'kol-kripto-tv',
		name: 'Kripto TV',
		descriptionKey: 'chain_tools.tools.kol_kripto_tv.description',
		url: 'https://www.youtube.com/@KriptoTV',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'turkish', 'youtube', 'analysis'],
		color: '#E30A17'
	},

	// ========== Vietnamese Tiếng Việt KOL ==========
	{
		id: 'kol-coin68',
		name: 'Coin68',
		descriptionKey: 'chain_tools.tools.kol_coin68.description',
		url: 'https://x.com/coin68',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'vietnamese', 'news', 'media'],
		color: '#DA251D',
		isFeatured: true
	},

	// ========== Indonesian Bahasa KOL ==========
	{
		id: 'kol-coinvestasi',
		name: 'Coinvestasi',
		descriptionKey: 'chain_tools.tools.kol_coinvestasi.description',
		url: 'https://x.com/coinvestasi',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'indonesian', 'news', 'education'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'kol-indodax',
		name: 'Indodax Academy',
		descriptionKey: 'chain_tools.tools.kol_indodax.description',
		url: 'https://x.com/indodax',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'indonesian', 'exchange', 'education'],
		color: '#FF0000'
	},

	// ========== Thai ไทย KOL ==========
	{
		id: 'kol-bitkub',
		name: 'Bitkub Academy',
		descriptionKey: 'chain_tools.tools.kol_bitkub.description',
		url: 'https://x.com/BitkubOfficial',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'thai', 'exchange', 'education'],
		color: '#FF6C00',
		isFeatured: true
	},
	{
		id: 'kol-siam-block',
		name: 'Siam Blockchain',
		descriptionKey: 'chain_tools.tools.kol_siam_block.description',
		url: 'https://x.com/SiamBlockchain',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'thai', 'news', 'media'],
		color: '#FF6C00'
	},

	// ========== Hindi हिन्दी KOL ==========
	{
		id: 'kol-pushpendra',
		name: 'Pushpendra Singh',
		descriptionKey: 'chain_tools.tools.kol_pushpendra.description',
		url: 'https://x.com/pushpendrakum',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'hindi', 'education', 'youtube'],
		color: '#FF9933'
	},
	{
		id: 'kol-crypto-gurukul',
		name: 'Crypto Gurukul',
		descriptionKey: 'chain_tools.tools.kol_crypto_gurukul.description',
		url: 'https://www.youtube.com/@CryptoGurukul',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'hindi', 'youtube', 'education'],
		color: '#FF9933'
	},

	// ========== Dutch/Netherlands KOL ==========
	{
		id: 'kol-bitvavo',
		name: 'Bitvavo Academy',
		descriptionKey: 'chain_tools.tools.kol_bitvavo.description',
		url: 'https://x.com/bitvavocom',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'dutch', 'exchange', 'education'],
		color: '#21468B'
	},

	// ========== Polish KOL ==========

	// ========== Italian KOL ==========
	{
		id: 'kol-cryptonomist',
		name: 'The Cryptonomist IT',
		descriptionKey: 'chain_tools.tools.kol_cryptonomist.description',
		url: 'https://x.com/Cryptonomist_it',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'italian', 'news', 'media'],
		color: '#009246'
	}
];

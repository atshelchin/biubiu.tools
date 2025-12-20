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
import { Twitter, Youtube, MessageCircle, Mic, Globe } from '@lucide/svelte';
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
		descriptionKey: 'chain_tools.tools.kol_raoul_pal.description',
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
	},

	// ========== Additional English Global KOLs ==========
	{
		id: 'kol-zhusu',
		name: 'Zhu Su',
		descriptionKey: 'chain_tools.tools.kol_zhusu.description',
		url: 'https://x.com/zhusu',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'trader', 'threearrowscapital'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-hasu',
		name: 'Hasu',
		descriptionKey: 'chain_tools.tools.kol_hasu.description',
		url: 'https://x.com/hasufl',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'research', 'flashbots'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-banteg',
		name: 'Banteg',
		descriptionKey: 'chain_tools.tools.kol_banteg.description',
		url: 'https://x.com/banteg',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'yearn', 'defi'],
		color: '#0657F9'
	},
	{
		id: 'kol-frankdegods',
		name: 'Frank DeGods',
		descriptionKey: 'chain_tools.tools.kol_frankdegods.description',
		url: 'https://x.com/frankdegods',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'nft', 'degods'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-gametheory',
		name: 'Game Theory',
		descriptionKey: 'chain_tools.tools.kol_gametheory.description',
		url: 'https://x.com/gametheory',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'analysis', 'macro'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-zachxbt',
		name: 'ZachXBT',
		descriptionKey: 'chain_tools.tools.kol_zachxbt.description',
		url: 'https://x.com/zachxbt',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'investigation', 'security'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-bitcoinmagazine',
		name: 'Bitcoin Magazine',
		descriptionKey: 'chain_tools.tools.kol_bitcoinmagazine.description',
		url: 'https://x.com/BitcoinMagazine',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'bitcoin', 'news'],
		color: '#F7931A',
		isFeatured: true
	},
	{
		id: 'kol-saylor',
		name: 'Michael Saylor',
		descriptionKey: 'chain_tools.tools.kol_saylor.description',
		url: 'https://x.com/saylor',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'bitcoin', 'microstrategy'],
		color: '#F7931A',
		isFeatured: true
	},
	{
		id: 'kol-layah',
		name: 'Layah Heilpern',
		descriptionKey: 'chain_tools.tools.kol_layah.description',
		url: 'https://x.com/LayahHeilpern',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'bitcoin', 'journalist'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-pomp',
		name: 'Anthony Pompliano',
		descriptionKey: 'chain_tools.tools.kol_pomp.description',
		url: 'https://x.com/APompliano',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'bitcoin', 'investor'],
		color: '#F7931A',
		isFeatured: true
	},
	{
		id: 'kol-samczsun',
		name: 'samczsun',
		descriptionKey: 'chain_tools.tools.kol_samczsun.description',
		url: 'https://x.com/samczsun',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'security', 'paradigm'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-iamDCinvestor',
		name: 'DCinvestor',
		descriptionKey: 'chain_tools.tools.kol_dcinvestor.description',
		url: 'https://x.com/iamDCinvestor',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'ethereum', 'nft'],
		color: '#627EEA'
	},
	{
		id: 'kol-ledger',
		name: 'Ledger Status',
		descriptionKey: 'chain_tools.tools.kol_ledger.description',
		url: 'https://x.com/Ledger',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'hardware', 'security'],
		color: '#000000'
	},
	{
		id: 'kol-aave',
		name: 'Stani Kulechov',
		descriptionKey: 'chain_tools.tools.kol_stani.description',
		url: 'https://x.com/StaniKulechov',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'aave', 'lens'],
		color: '#B6509E',
		isFeatured: true
	},
	{
		id: 'kol-haydenzadams',
		name: 'Hayden Adams',
		descriptionKey: 'chain_tools.tools.kol_haydenzadams.description',
		url: 'https://x.com/haydenzadams',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'uniswap', 'founder'],
		color: '#FF007A',
		isFeatured: true
	},
	{
		id: 'kol-defiance',
		name: 'DeFi Ignas',
		descriptionKey: 'chain_tools.tools.kol_defiignas.description',
		url: 'https://x.com/DefiIgnas',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'defi', 'research'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-inversebrah',
		name: 'InverseBrah',
		descriptionKey: 'chain_tools.tools.kol_inversebrah.description',
		url: 'https://x.com/inversebrah',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'trading', 'memes'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-cryptowizardd',
		name: 'Crypto Wizard',
		descriptionKey: 'chain_tools.tools.kol_cryptowizardd.description',
		url: 'https://x.com/CryptoWizardd',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'trading', 'altcoins'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-gauntlet',
		name: 'Gauntlet',
		descriptionKey: 'chain_tools.tools.kol_gauntlet.description',
		url: 'https://x.com/gauntlet_xyz',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'defi', 'risk'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-defilama',
		name: 'DefiLlama',
		descriptionKey: 'chain_tools.tools.kol_defilama.description',
		url: 'https://x.com/DefiLlama',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'data', 'analytics'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'kol-sandymillin',
		name: 'Sandy Carter',
		descriptionKey: 'chain_tools.tools.kol_sandymillin.description',
		url: 'https://x.com/sandy_carter',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'web3', 'enterprise'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-cryptokitty',
		name: 'Crypto Kitty',
		descriptionKey: 'chain_tools.tools.kol_cryptokitty.description',
		url: 'https://x.com/crypto_kittyy',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'education', 'community'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-cryptonews',
		name: 'Crypto News Alerts',
		descriptionKey: 'chain_tools.tools.kol_cryptonews.description',
		url: 'https://x.com/CryptoNewsYes',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'news', 'breaking'],
		color: '#1DA1F2'
	},
	{
		id: 'kol-etherscan',
		name: 'Etherscan',
		descriptionKey: 'chain_tools.tools.kol_etherscan.description',
		url: 'https://x.com/etherscan',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'english', 'ethereum', 'explorer'],
		color: '#627EEA'
	},

	// ========== Additional YouTube & Podcasts ==========
	{
		id: 'kol-whiteboard',
		name: 'Whiteboard Crypto',
		descriptionKey: 'chain_tools.tools.kol_whiteboard.description',
		url: 'https://www.youtube.com/@WhiteboardCrypto',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'kol-finematics',
		name: 'Finematics',
		descriptionKey: 'chain_tools.tools.kol_finematics.description',
		url: 'https://www.youtube.com/@Finematics',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'defi', 'education'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'kol-epicenter',
		name: 'Epicenter Podcast',
		descriptionKey: 'chain_tools.tools.kol_epicenter.description',
		url: 'https://www.youtube.com/@EpicenterTV',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'podcast', 'interview', 'english'],
		color: '#FF0000'
	},
	{
		id: 'kol-uponly',
		name: 'UpOnly',
		descriptionKey: 'chain_tools.tools.kol_uponly.description',
		url: 'https://www.youtube.com/@UpOnlyTV',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'podcast', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'kol-cryptobanter',
		name: 'Crypto Banter',
		descriptionKey: 'chain_tools.tools.kol_cryptobanter.description',
		url: 'https://www.youtube.com/@CryptoBanterGroup',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'live', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'kol-realvision',
		name: 'Real Vision Crypto',
		descriptionKey: 'chain_tools.tools.kol_realvision.description',
		url: 'https://www.youtube.com/@RealVisionCrypto',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'macro', 'english'],
		color: '#FF0000'
	},
	{
		id: 'kol-taiki',
		name: 'Taiki Maeda',
		descriptionKey: 'chain_tools.tools.kol_taiki.description',
		url: 'https://www.youtube.com/@TaikiMaeda',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'defi', 'education'],
		color: '#FF0000'
	},

	// ========== Additional Chinese 中文 KOL ==========
	{
		id: 'kol-wuwei',
		name: '吴说播客',
		descriptionKey: 'chain_tools.tools.kol_wuwei.description',
		url: 'https://x.com/WuBlockchain',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'podcast', 'news'],
		color: '#DE2910'
	},
	{
		id: 'kol-ningning',
		name: 'NingNing',
		descriptionKey: 'chain_tools.tools.kol_ningning.description',
		url: 'https://x.com/0xNing0x',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'research', 'defi'],
		color: '#DE2910',
		isFeatured: true
	},
	{
		id: 'kol-jamestoken',
		name: 'James',
		descriptionKey: 'chain_tools.tools.kol_jamestoken.description',
		url: 'https://x.com/JamesYeYe_',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'research', 'alpha'],
		color: '#DE2910'
	},
	{
		id: 'kol-haotian',
		name: 'Haotian',
		descriptionKey: 'chain_tools.tools.kol_haotian.description',
		url: 'https://x.com/tmelHaotian',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'security', 'research'],
		color: '#DE2910',
		isFeatured: true
	},
	{
		id: 'kol-0xtodd',
		name: '0xTodd',
		descriptionKey: 'chain_tools.tools.kol_0xtodd.description',
		url: 'https://x.com/0x_Todd',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'defi', 'research'],
		color: '#DE2910'
	},
	{
		id: 'kol-maplenft',
		name: 'Maple',
		descriptionKey: 'chain_tools.tools.kol_maplenft.description',
		url: 'https://x.com/MapleNFT_',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'nft', 'alpha'],
		color: '#DE2910'
	},
	{
		id: 'kol-yudan',
		name: 'Yudan',
		descriptionKey: 'chain_tools.tools.kol_yudan.description',
		url: 'https://x.com/0xYudan',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'trading', 'analysis'],
		color: '#DE2910'
	},
	{
		id: 'kol-0xmagicblue',
		name: '0xMagicBlue',
		descriptionKey: 'chain_tools.tools.kol_0xmagicblue.description',
		url: 'https://x.com/0xMagicBlue',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'chinese', 'research', 'threads'],
		color: '#DE2910'
	},

	// ========== Additional Japanese 日本語 KOL ==========
	{
		id: 'kol-ryoma',
		name: 'Ryoma',
		descriptionKey: 'chain_tools.tools.kol_ryoma.description',
		url: 'https://x.com/ryoma_defi',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'japanese', 'defi', 'research'],
		color: '#BC002D'
	},
	{
		id: 'kol-tasuku',
		name: 'Tasuku',
		descriptionKey: 'chain_tools.tools.kol_tasuku.description',
		url: 'https://x.com/tasuku_eth',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'japanese', 'ethereum', 'alpha'],
		color: '#BC002D'
	},

	// ========== Additional Korean 한국어 KOL ==========
	{
		id: 'kol-coinnavi',
		name: 'Coin Navi Korea',
		descriptionKey: 'chain_tools.tools.kol_coinnavi.description',
		url: 'https://x.com/CoinNaviKorea',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'korean', 'research', 'analysis'],
		color: '#003478'
	},
	{
		id: 'kol-blockmedia',
		name: 'Block Media Korea',
		descriptionKey: 'chain_tools.tools.kol_blockmedia.description',
		url: 'https://x.com/BlockMediaKR',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'korean', 'news', 'media'],
		color: '#003478'
	},

	// ========== Additional Spanish Español KOL ==========
	{
		id: 'kol-criptonoticias',
		name: 'CriptoNoticias',
		descriptionKey: 'chain_tools.tools.kol_criptonoticias.description',
		url: 'https://x.com/CriptoNoticias',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'spanish', 'news', 'latam'],
		color: '#F1BF00',
		isFeatured: true
	},
	{
		id: 'kol-bitcobie',
		name: 'Bitcobie',
		descriptionKey: 'chain_tools.tools.kol_bitcobie.description',
		url: 'https://x.com/Bitcobie',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'spanish', 'bitcoin', 'education'],
		color: '#F1BF00'
	},
	{
		id: 'kol-dalto',
		name: 'DaltoNic',
		descriptionKey: 'chain_tools.tools.kol_daltonic.description',
		url: 'https://www.youtube.com/@DaltoNic',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'spanish', 'youtube', 'trading'],
		color: '#F1BF00'
	},

	// ========== YouTube Web3 Influencers (100+ High Traffic) ==========
	{
		id: 'yt-bitboy',
		name: 'BitBoy Crypto',
		descriptionKey: 'chain_tools.tools.yt_bitboy.description',
		url: 'https://www.youtube.com/@BitBoyCrypto',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'english', 'trading'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-aantonop',
		name: 'aantonop (Andreas Antonopoulos)',
		descriptionKey: 'chain_tools.tools.yt_aantonop.description',
		url: 'https://www.youtube.com/@aantonop',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'education'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-datadash',
		name: 'DataDash',
		descriptionKey: 'chain_tools.tools.yt_datadash.description',
		url: 'https://www.youtube.com/@DataDash',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'analysis', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-altcoin-daily',
		name: 'Altcoin Daily',
		descriptionKey: 'chain_tools.tools.yt_altcoin_daily.description',
		url: 'https://www.youtube.com/@AltcoinDaily',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'altcoins', 'news'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-crypto-casey',
		name: 'Crypto Casey',
		descriptionKey: 'chain_tools.tools.yt_crypto_casey.description',
		url: 'https://www.youtube.com/@CryptoCasey',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-cryptorusb',
		name: 'CryptosRUs',
		descriptionKey: 'chain_tools.tools.yt_cryptorusb.description',
		url: 'https://www.youtube.com/@CryptosRUs',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'analysis', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-ivan-on-tech',
		name: 'Ivan on Tech',
		descriptionKey: 'chain_tools.tools.yt_ivan_on_tech.description',
		url: 'https://www.youtube.com/@IvanOnTech',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-the-moon',
		name: 'The Moon',
		descriptionKey: 'chain_tools.tools.yt_the_moon.description',
		url: 'https://www.youtube.com/@TheMoonCarl',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'trading'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-jebb',
		name: 'Crypto Jebb',
		descriptionKey: 'chain_tools.tools.yt_crypto_jebb.description',
		url: 'https://www.youtube.com/@CryptoJebb',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'analysis', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-benjamin-cowen',
		name: 'Benjamin Cowen',
		descriptionKey: 'chain_tools.tools.yt_benjamin_cowen.description',
		url: 'https://www.youtube.com/@intothecryptoverse',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'analysis', 'macro'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-crypto-zombies',
		name: 'Crypto Zombies',
		descriptionKey: 'chain_tools.tools.yt_crypto_zombies.description',
		url: 'https://www.youtube.com/@CryptoZombie',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-ellio-trades',
		name: 'Ellio Trades',
		descriptionKey: 'chain_tools.tools.yt_ellio_trades.description',
		url: 'https://www.youtube.com/@EllioTrades',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'nft', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-michael',
		name: 'Crypto Michael',
		descriptionKey: 'chain_tools.tools.yt_crypto_michael.description',
		url: 'https://www.youtube.com/@CryptoMich',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-lark-davis',
		name: 'Lark Davis',
		descriptionKey: 'chain_tools.tools.yt_lark_davis.description',
		url: 'https://www.youtube.com/@TheCryptoLark',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'defi', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-crypto-daily',
		name: 'Crypto Daily',
		descriptionKey: 'chain_tools.tools.yt_crypto_daily.description',
		url: 'https://www.youtube.com/@CryptoDaily',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'entertainment', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-alex-becker',
		name: 'Alex Becker',
		descriptionKey: 'chain_tools.tools.yt_alex_becker.description',
		url: 'https://www.youtube.com/@AlexBeckersChannel',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-tips',
		name: 'Crypto Tips',
		descriptionKey: 'chain_tools.tools.yt_crypto_tips.description',
		url: 'https://www.youtube.com/@CryptoTips',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'tips', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-alessio-rastani',
		name: 'Alessio Rastani',
		descriptionKey: 'chain_tools.tools.yt_alessio_rastani.description',
		url: 'https://www.youtube.com/@AlessioRastani',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-digital-asset',
		name: 'Digital Asset News',
		descriptionKey: 'chain_tools.tools.yt_digital_asset.description',
		url: 'https://www.youtube.com/@DigitalAssetNews',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-coin-telegraph',
		name: 'Cointelegraph',
		descriptionKey: 'chain_tools.tools.yt_coin_telegraph.description',
		url: 'https://www.youtube.com/@cointelegraph',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-paul-barron',
		name: 'Paul Barron Network',
		descriptionKey: 'chain_tools.tools.yt_paul_barron.description',
		url: 'https://www.youtube.com/@PaulBarronNetwork',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'tech', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-wendy',
		name: 'Crypto Wendy O',
		descriptionKey: 'chain_tools.tools.yt_crypto_wendy.description',
		url: 'https://www.youtube.com/@CryptoWendyO',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-boxmining',
		name: 'Boxmining',
		descriptionKey: 'chain_tools.tools.yt_boxmining.description',
		url: 'https://www.youtube.com/@Boxmining',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-love',
		name: 'Crypto Love',
		descriptionKey: 'chain_tools.tools.yt_crypto_love.description',
		url: 'https://www.youtube.com/@CryptoLove',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'altcoins', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-sunny-decree',
		name: 'Sunny Decree',
		descriptionKey: 'chain_tools.tools.yt_sunny_decree.description',
		url: 'https://www.youtube.com/@SunnyDecree',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-kirby',
		name: 'Crypto Kirby',
		descriptionKey: 'chain_tools.tools.yt_crypto_kirby.description',
		url: 'https://www.youtube.com/@CryptoKirby',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-chico-crypto',
		name: 'Chico Crypto',
		descriptionKey: 'chain_tools.tools.yt_chico_crypto.description',
		url: 'https://www.youtube.com/@ChicoCrypto',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'research', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-invest-answers',
		name: 'InvestAnswers',
		descriptionKey: 'chain_tools.tools.yt_invest_answers.description',
		url: 'https://www.youtube.com/@InvestAnswers',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'analysis', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-crypto-crew',
		name: 'Crypto Crew University',
		descriptionKey: 'chain_tools.tools.yt_crypto_crew.description',
		url: 'https://www.youtube.com/@CryptoCrewUniversity',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-jason-pizzino',
		name: 'Jason Pizzino',
		descriptionKey: 'chain_tools.tools.yt_jason_pizzino.description',
		url: 'https://www.youtube.com/@JasonPizzino',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-dapp-university',
		name: 'Dapp University',
		descriptionKey: 'chain_tools.tools.yt_dapp_university.description',
		url: 'https://www.youtube.com/@DappUniversity',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'development', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-eat-the-blocks',
		name: 'Eat The Blocks',
		descriptionKey: 'chain_tools.tools.yt_eat_the_blocks.description',
		url: 'https://www.youtube.com/@EatTheBlocks',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'development', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-smart-contract',
		name: 'Smart Contract Programmer',
		descriptionKey: 'chain_tools.tools.yt_smart_contract.description',
		url: 'https://www.youtube.com/@smartcontractprogrammer',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'solidity', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-patrick-collins',
		name: 'Patrick Collins',
		descriptionKey: 'chain_tools.tools.yt_patrick_collins.description',
		url: 'https://www.youtube.com/@PatrickCollins',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'development', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-moralis',
		name: 'Moralis Web3',
		descriptionKey: 'chain_tools.tools.yt_moralis.description',
		url: 'https://www.youtube.com/@MoralisWeb3',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'development', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-nader-dabit',
		name: 'Nader Dabit',
		descriptionKey: 'chain_tools.tools.yt_nader_dabit.description',
		url: 'https://www.youtube.com/@naderdabit',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'development', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-alchemy',
		name: 'Alchemy',
		descriptionKey: 'chain_tools.tools.yt_alchemy.description',
		url: 'https://www.youtube.com/@alchemyplatform',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'development', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-chainlink',
		name: 'Chainlink',
		descriptionKey: 'chain_tools.tools.yt_chainlink.description',
		url: 'https://www.youtube.com/@chainlink',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'oracle', 'english'],
		color: '#375BD2',
		isFeatured: true
	},
	{
		id: 'yt-lex-fridman',
		name: 'Lex Fridman (Crypto Episodes)',
		descriptionKey: 'chain_tools.tools.yt_lex_fridman.description',
		url: 'https://www.youtube.com/@lexfridman',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'podcast', 'interview'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-what-bitcoin',
		name: 'What Bitcoin Did',
		descriptionKey: 'chain_tools.tools.yt_what_bitcoin.description',
		url: 'https://www.youtube.com/@WhatBitcoinDid',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'podcast'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-crypto-tips-matt',
		name: 'The Crypto Matt',
		descriptionKey: 'chain_tools.tools.yt_crypto_tips_matt.description',
		url: 'https://www.youtube.com/@TheCryptoMatt',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-andrei-jikh',
		name: 'Andrei Jikh',
		descriptionKey: 'chain_tools.tools.yt_andrei_jikh.description',
		url: 'https://www.youtube.com/@AndreiJikh',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'finance', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-graham-stephan',
		name: 'Graham Stephan (Crypto)',
		descriptionKey: 'chain_tools.tools.yt_graham_stephan.description',
		url: 'https://www.youtube.com/@GrahamStephan',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'finance', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-miles-deutscher',
		name: 'Miles Deutscher',
		descriptionKey: 'chain_tools.tools.yt_miles_deutscher.description',
		url: 'https://www.youtube.com/@MilesDeutscher',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'altcoins', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-coinsider',
		name: 'Coinsider',
		descriptionKey: 'chain_tools.tools.yt_coinsider.description',
		url: 'https://www.youtube.com/@Coinsider',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'analysis', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-virtual-bacon',
		name: 'Virtual Bacon',
		descriptionKey: 'chain_tools.tools.yt_virtual_bacon.description',
		url: 'https://www.youtube.com/@VirtualBacon',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'altcoins', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-byte-megan',
		name: 'Byte Megan',
		descriptionKey: 'chain_tools.tools.yt_byte_megan.description',
		url: 'https://www.youtube.com/@ByteMegan',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-brian-jung',
		name: 'Brian Jung',
		descriptionKey: 'chain_tools.tools.yt_brian_jung.description',
		url: 'https://www.youtube.com/@BrianJung',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'finance', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-tech-lead',
		name: 'TechLead (Crypto)',
		descriptionKey: 'chain_tools.tools.yt_tech_lead.description',
		url: 'https://www.youtube.com/@TechLead',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'tech', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-birb',
		name: 'Crypto Birb',
		descriptionKey: 'chain_tools.tools.yt_crypto_birb.description',
		url: 'https://www.youtube.com/@CryptoBirb',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-sheldon-evans',
		name: 'Sheldon Evans',
		descriptionKey: 'chain_tools.tools.yt_sheldon_evans.description',
		url: 'https://www.youtube.com/@SheldonEvans',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'nft', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-max-maher',
		name: 'Max Maher',
		descriptionKey: 'chain_tools.tools.yt_max_maher.description',
		url: 'https://www.youtube.com/@MaxMaher',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'finance', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-digital-perspectives',
		name: 'Digital Perspectives',
		descriptionKey: 'chain_tools.tools.yt_digital_perspectives.description',
		url: 'https://www.youtube.com/@DigitalPerspectives',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'xrp', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-working-money',
		name: 'Working Money Channel',
		descriptionKey: 'chain_tools.tools.yt_working_money.description',
		url: 'https://www.youtube.com/@WorkingMoneyChannel',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'xrp', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-moon-lambo',
		name: 'Moon Lambo',
		descriptionKey: 'chain_tools.tools.yt_moon_lambo.description',
		url: 'https://www.youtube.com/@MoonLambo',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'xrp', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-banter-ran',
		name: 'Ran Neuner',
		descriptionKey: 'chain_tools.tools.yt_crypto_banter_ran.description',
		url: 'https://www.youtube.com/@RanNeuner',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-trader-mayne',
		name: 'Trader Mayne',
		descriptionKey: 'chain_tools.tools.yt_trader_mayne.description',
		url: 'https://www.youtube.com/@TraderMayne',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-capital',
		name: 'Crypto Capital Venture',
		descriptionKey: 'chain_tools.tools.yt_crypto_capital.description',
		url: 'https://www.youtube.com/@CryptoCapitalVenture',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-the-birb-nest',
		name: 'The Birb Nest',
		descriptionKey: 'chain_tools.tools.yt_the_birb_nest.description',
		url: 'https://www.youtube.com/@TheBirbNest',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-face',
		name: 'CryptoFace',
		descriptionKey: 'chain_tools.tools.yt_crypto_face.description',
		url: 'https://www.youtube.com/@CryptoFace',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-coin-stories',
		name: 'Coin Stories',
		descriptionKey: 'chain_tools.tools.yt_coin_stories.description',
		url: 'https://www.youtube.com/@CoinStories',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-99bitcoins',
		name: '99Bitcoins',
		descriptionKey: 'chain_tools.tools.yt_99bitcoins.description',
		url: 'https://www.youtube.com/@99Bitcoins',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-bitcoin-magazine',
		name: 'Bitcoin Magazine',
		descriptionKey: 'chain_tools.tools.yt_bitcoin_magazine.description',
		url: 'https://www.youtube.com/@BitcoinMagazine',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'news'],
		color: '#F7931A',
		isFeatured: true
	},
	{
		id: 'yt-wolf-crypto',
		name: 'Wolf Of All Streets',
		descriptionKey: 'chain_tools.tools.yt_wolf_crypto.description',
		url: 'https://www.youtube.com/@ScottMelker',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-kitco-crypto',
		name: 'Kitco NEWS (Crypto)',
		descriptionKey: 'chain_tools.tools.yt_kitco_crypto.description',
		url: 'https://www.youtube.com/@kitco',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'macro'],
		color: '#FF0000'
	},
	{
		id: 'yt-the-defiant',
		name: 'The Defiant',
		descriptionKey: 'chain_tools.tools.yt_the_defiant.description',
		url: 'https://www.youtube.com/@TheDefiant',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'defi', 'news'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-coindesk',
		name: 'CoinDesk',
		descriptionKey: 'chain_tools.tools.yt_coindesk.description',
		url: 'https://www.youtube.com/@coindesk',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'english'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-decrypt',
		name: 'Decrypt',
		descriptionKey: 'chain_tools.tools.yt_decrypt.description',
		url: 'https://www.youtube.com/@decrypt',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-thinking-crypto',
		name: 'Thinking Crypto',
		descriptionKey: 'chain_tools.tools.yt_thinking_crypto.description',
		url: 'https://www.youtube.com/@ThinkingCrypto',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'interview'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-bobby',
		name: 'Crypto Bobby',
		descriptionKey: 'chain_tools.tools.yt_crypto_bobby.description',
		url: 'https://www.youtube.com/@CryptoBobby',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-coin-code',
		name: 'Coin Code',
		descriptionKey: 'chain_tools.tools.yt_coin_code.description',
		url: 'https://www.youtube.com/@CoinCode',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'analysis', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-rover',
		name: 'Crypto Rover',
		descriptionKey: 'chain_tools.tools.yt_crypto_rover.description',
		url: 'https://www.youtube.com/@CryptoRover',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-tyler-hill',
		name: 'Tyler Hill Investing',
		descriptionKey: 'chain_tools.tools.yt_tyler_hill.description',
		url: 'https://www.youtube.com/@TylerHillInvesting',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'analysis', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-gains',
		name: 'Crypto Gains',
		descriptionKey: 'chain_tools.tools.yt_crypto_gains.description',
		url: 'https://www.youtube.com/@CryptoGains',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'altcoins', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-coin-push-crypto',
		name: 'Coin Push Crypto',
		descriptionKey: 'chain_tools.tools.yt_coin_push_crypto.description',
		url: 'https://www.youtube.com/@CoinPushCrypto',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-rand',
		name: 'Crypto Rand',
		descriptionKey: 'chain_tools.tools.yt_crypto_rand.description',
		url: 'https://www.youtube.com/@CryptoRand',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-world',
		name: 'Crypto World',
		descriptionKey: 'chain_tools.tools.yt_crypto_world.description',
		url: 'https://www.youtube.com/@CryptoWorldJosh',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-pompliano',
		name: 'Anthony Pompliano',
		descriptionKey: 'chain_tools.tools.yt_pompliano.description',
		url: 'https://www.youtube.com/@AnthonyPompliano',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'podcast'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-preston-pysh',
		name: 'Preston Pysh (We Study Billionaires)',
		descriptionKey: 'chain_tools.tools.yt_preston_pysh.description',
		url: 'https://www.youtube.com/@PrestonPysh',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'podcast'],
		color: '#FF0000'
	},
	{
		id: 'yt-crypto-jargon',
		name: 'Crypto Jargon',
		descriptionKey: 'chain_tools.tools.yt_crypto_jargon.description',
		url: 'https://www.youtube.com/@CryptoJargon',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-cryptobus',
		name: 'CryptoBus',
		descriptionKey: 'chain_tools.tools.yt_cryptobus.description',
		url: 'https://www.youtube.com/@CryptoBus',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'trading', 'english'],
		color: '#FF0000'
	},
	{
		id: 'yt-bitcoin-university',
		name: 'Bitcoin University',
		descriptionKey: 'chain_tools.tools.yt_bitcoin_university.description',
		url: 'https://www.youtube.com/@BitcoinUniversity',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'bitcoin', 'education'],
		color: '#F7931A'
	},
	{
		id: 'yt-altcoin-buzz',
		name: 'Altcoin Buzz',
		descriptionKey: 'chain_tools.tools.yt_altcoin_buzz.description',
		url: 'https://www.youtube.com/@AltcoinBuzz',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'altcoins', 'news'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-coinmarketcap',
		name: 'CoinMarketCap',
		descriptionKey: 'chain_tools.tools.yt_coinmarketcap.description',
		url: 'https://www.youtube.com/@CoinMarketCap',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'data'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-coingecko',
		name: 'CoinGecko',
		descriptionKey: 'chain_tools.tools.yt_coingecko.description',
		url: 'https://www.youtube.com/@CoinGeckoTV',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'news', 'data'],
		color: '#8CC63F'
	},
	{
		id: 'yt-binance-academy',
		name: 'Binance Academy',
		descriptionKey: 'chain_tools.tools.yt_binance_academy.description',
		url: 'https://www.youtube.com/@BinanceAcademy',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'education', 'english'],
		color: '#F0B90B'
	},
	{
		id: 'yt-a16z-crypto',
		name: 'a16z crypto',
		descriptionKey: 'chain_tools.tools.yt_a16z_crypto.description',
		url: 'https://www.youtube.com/@a16zcrypto',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'vc', 'research'],
		color: '#FF0000',
		isFeatured: true
	},
	{
		id: 'yt-pantera-capital',
		name: 'Pantera Capital',
		descriptionKey: 'chain_tools.tools.yt_pantera_capital.description',
		url: 'https://www.youtube.com/@PanteraCapital',
		icon: Youtube,
		category: 'influencer',
		tags: ['kol', 'youtube', 'vc', 'analysis'],
		color: '#FF0000'
	},

	// ========== Web3 Podcast Influencers (50+) ==========
	{
		id: 'pod-unchained',
		name: 'Unchained (Laura Shin)',
		descriptionKey: 'chain_tools.tools.pod_unchained.description',
		url: 'https://www.youtube.com/@UnchainedPodcast',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'interview', 'english'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'pod-bankless-pod',
		name: 'Bankless Podcast',
		descriptionKey: 'chain_tools.tools.pod_bankless.description',
		url: 'https://www.youtube.com/@Bankless',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'pod-up-only',
		name: 'Up Only',
		descriptionKey: 'chain_tools.tools.pod_up_only.description',
		url: 'https://www.youtube.com/@UpOnlyTV',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'trading', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-uncommon-core',
		name: 'Uncommon Core',
		descriptionKey: 'chain_tools.tools.pod_uncommon_core.description',
		url: 'https://www.youtube.com/@UncommonCore',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'research', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-on-the-brink',
		name: 'On The Brink',
		descriptionKey: 'chain_tools.tools.pod_on_the_brink.description',
		url: 'https://onthebrink-podcast.com/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'bitcoin', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-what-bitcoin-did',
		name: 'What Bitcoin Did',
		descriptionKey: 'chain_tools.tools.pod_what_bitcoin_did.description',
		url: 'https://www.whatbitcoindid.com/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'bitcoin', 'english'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'pod-stephan-livera',
		name: 'Stephan Livera Podcast',
		descriptionKey: 'chain_tools.tools.pod_stephan_livera.description',
		url: 'https://stephanlivera.com/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'bitcoin', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-tales-crypt',
		name: 'Tales from the Crypt',
		descriptionKey: 'chain_tools.tools.pod_tales_crypt.description',
		url: 'https://www.youtube.com/@TftC21M',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'bitcoin', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-bitcoin-audible',
		name: 'Bitcoin Audible',
		descriptionKey: 'chain_tools.tools.pod_bitcoin_audible.description',
		url: 'https://www.youtube.com/@BitcoinAudible',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'bitcoin', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-defiant-pod',
		name: 'The Defiant Podcast',
		descriptionKey: 'chain_tools.tools.pod_defiant.description',
		url: 'https://thedefiant.io/podcasts',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-crypto-101',
		name: 'Crypto 101',
		descriptionKey: 'chain_tools.tools.pod_crypto_101.description',
		url: 'https://www.youtube.com/@Crypto101Podcast',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'education', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-pomp-pod',
		name: 'The Pomp Podcast',
		descriptionKey: 'chain_tools.tools.pod_pomp.description',
		url: 'https://www.youtube.com/@AnthonyPompliano',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'bitcoin', 'english'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'pod-zero-knowledge',
		name: 'Zero Knowledge',
		descriptionKey: 'chain_tools.tools.pod_zero_knowledge.description',
		url: 'https://zeroknowledge.fm/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'zk', 'english'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'pod-epicenter-pod',
		name: 'Epicenter',
		descriptionKey: 'chain_tools.tools.pod_epicenter.description',
		url: 'https://epicenter.tv/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'interview', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-real-vision-crypto',
		name: 'Real Vision Crypto',
		descriptionKey: 'chain_tools.tools.pod_real_vision.description',
		url: 'https://www.realvision.com/crypto',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'macro', 'english'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'pod-bell-curve-pod',
		name: 'Bell Curve',
		descriptionKey: 'chain_tools.tools.pod_bell_curve.description',
		url: 'https://www.youtube.com/@TheBellCurvePodcast',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-empire',
		name: 'Empire (Blockworks)',
		descriptionKey: 'chain_tools.tools.pod_empire.description',
		url: 'https://www.youtube.com/@Blockworks',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'research', 'english'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'pod-lightspeed',
		name: 'Lightspeed',
		descriptionKey: 'chain_tools.tools.pod_lightspeed.description',
		url: 'https://www.youtube.com/@Blockworks',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'solana', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-flipping-tables',
		name: 'Flipping Tables',
		descriptionKey: 'chain_tools.tools.pod_flipping_tables.description',
		url: 'https://www.youtube.com/@FlippingTables',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-into-the-ether',
		name: 'Into the Ether',
		descriptionKey: 'chain_tools.tools.pod_into_the_ether.description',
		url: 'https://podcast.ethhub.io/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'ethereum', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-the-daily-gwei',
		name: 'The Daily Gwei',
		descriptionKey: 'chain_tools.tools.pod_daily_gwei.description',
		url: 'https://www.youtube.com/@TheDailyGwei',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'ethereum', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-web3-galaxy-brain',
		name: 'Web3 Galaxy Brain',
		descriptionKey: 'chain_tools.tools.pod_web3_galaxy.description',
		url: 'https://web3galaxybrain.com/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'development', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-a16z-web3',
		name: 'a16z Web3 Podcast',
		descriptionKey: 'chain_tools.tools.pod_a16z_web3.description',
		url: 'https://a16zcrypto.com/podcasts/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'vc', 'english'],
		color: '#8B5CF6',
		isFeatured: true
	},
	{
		id: 'pod-breakdown',
		name: 'The Breakdown (NLW)',
		descriptionKey: 'chain_tools.tools.pod_breakdown.description',
		url: 'https://www.coindesk.com/podcasts/the-breakdown/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'news', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-crypto-native',
		name: 'Crypto Native',
		descriptionKey: 'chain_tools.tools.pod_crypto_native.description',
		url: 'https://www.youtube.com/@CryptoNativePodcast',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'interview', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-where-it-happens',
		name: 'Where It Happens',
		descriptionKey: 'chain_tools.tools.pod_where_it_happens.description',
		url: 'https://sahilbloom.com/podcast',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'business', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-paradigm-shift',
		name: 'Paradigm Shift (Paradigm)',
		descriptionKey: 'chain_tools.tools.pod_paradigm_shift.description',
		url: 'https://www.paradigm.xyz/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'vc', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-crypto-fundamental',
		name: 'Crypto Fundamental',
		descriptionKey: 'chain_tools.tools.pod_crypto_fundamental.description',
		url: 'https://www.youtube.com/@CryptoFundamental',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'analysis', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-solana-decoded',
		name: 'Validated (Solana)',
		descriptionKey: 'chain_tools.tools.pod_solana_decoded.description',
		url: 'https://www.youtube.com/@SolanaFndn',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'solana', 'english'],
		color: '#9945FF'
	},
	{
		id: 'pod-cosmos-pods',
		name: 'Interchain FM',
		descriptionKey: 'chain_tools.tools.pod_cosmos_pods.description',
		url: 'https://interchain.fm/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'cosmos', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-green-pill',
		name: 'Green Pill',
		descriptionKey: 'chain_tools.tools.pod_green_pill.description',
		url: 'https://www.youtube.com/@greenpill',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'regen', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-bankless-nation',
		name: 'Bankless Nation',
		descriptionKey: 'chain_tools.tools.pod_bankless_nation.description',
		url: 'https://www.youtube.com/@BanklessHQ',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-let-me-speak',
		name: 'Let Me Speak (Kyle Samani)',
		descriptionKey: 'chain_tools.tools.pod_let_me_speak.description',
		url: 'https://www.multicoin.capital/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'vc', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-crypto-tonight',
		name: 'Crypto Tonight',
		descriptionKey: 'chain_tools.tools.pod_crypto_tonight.description',
		url: 'https://www.youtube.com/@CryptoTonight',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'interview', 'chinese'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-bitcoin-brainstorm',
		name: 'Bitcoin Brainstorm',
		descriptionKey: 'chain_tools.tools.pod_bitcoin_brainstorm.description',
		url: 'https://www.youtube.com/@BitcoinBrainstorm',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'bitcoin', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-rug-radio',
		name: 'Rug Radio',
		descriptionKey: 'chain_tools.tools.pod_rug_radio.description',
		url: 'https://www.rug.fm/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'nft', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-gm-web3',
		name: 'GM Web3',
		descriptionKey: 'chain_tools.tools.pod_gm_web3.description',
		url: 'https://www.gmweb3.com/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'web3', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-frax-radio',
		name: 'Frax Radio',
		descriptionKey: 'chain_tools.tools.pod_frax_radio.description',
		url: 'https://www.youtube.com/@FraxFinance',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-defiant-defi',
		name: 'Defiant DeFi Decoded',
		descriptionKey: 'chain_tools.tools.pod_defiant_defi.description',
		url: 'https://thedefiant.io/podcasts',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'defi', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-moon-or-bust',
		name: 'Moon or Bust',
		descriptionKey: 'chain_tools.tools.pod_moon_or_bust.description',
		url: 'https://www.youtube.com/@MoonOrBustPod',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'trading', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-token-talks',
		name: 'Token Talks',
		descriptionKey: 'chain_tools.tools.pod_token_talks.description',
		url: 'https://www.youtube.com/@TokenTalks',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'interview', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-nft-now',
		name: 'NFT Now',
		descriptionKey: 'chain_tools.tools.pod_nft_now.description',
		url: 'https://nftnow.com/podcast/',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'nft', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-proof-of-work',
		name: 'Proof of Work',
		descriptionKey: 'chain_tools.tools.pod_proof_of_work.description',
		url: 'https://www.youtube.com/@ProofOfWorkPod',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'bitcoin', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-crypto-skeptics',
		name: 'Crypto Skeptics',
		descriptionKey: 'chain_tools.tools.pod_crypto_skeptics.description',
		url: 'https://www.youtube.com/@CryptoSkeptics',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'analysis', 'english'],
		color: '#8B5CF6'
	},
	{
		id: 'pod-eth-daily',
		name: 'ETH Daily',
		descriptionKey: 'chain_tools.tools.pod_eth_daily.description',
		url: 'https://www.youtube.com/@ETHDaily',
		icon: Mic,
		category: 'influencer',
		tags: ['kol', 'podcast', 'ethereum', 'english'],
		color: '#627EEA'
	},

	// ========== Twitter/X High-Traffic Influencers (50+) ==========
	{
		id: 'tw-milesdeutscher',
		name: 'Miles Deutscher',
		descriptionKey: 'chain_tools.tools.tw_milesdeutscher.description',
		url: 'https://x.com/MilesDeutscher',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'altcoins', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'tw-cryptowendy',
		name: 'Crypto Wendy O',
		descriptionKey: 'chain_tools.tools.tw_cryptowendy.description',
		url: 'https://x.com/CryptoWendyO',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-austinvirts',
		name: 'Austin Virts',
		descriptionKey: 'chain_tools.tools.tw_austinvirts.description',
		url: 'https://x.com/austinvirts',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'crypto', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-dwr',
		name: 'Dan Romero (dwr)',
		descriptionKey: 'chain_tools.tools.tw_dwr.description',
		url: 'https://x.com/dwr',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'farcaster', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'tw-jessepollak',
		name: 'Jesse Pollak',
		descriptionKey: 'chain_tools.tools.tw_jessepollak.description',
		url: 'https://x.com/jessepollak',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'base', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'tw-degenspartan',
		name: 'DegenSpartan',
		descriptionKey: 'chain_tools.tools.tw_degenspartan.description',
		url: 'https://x.com/DegenSpartan',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-pentosh1',
		name: 'Pentoshi',
		descriptionKey: 'chain_tools.tools.tw_pentosh1.description',
		url: 'https://x.com/Pentosh1',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'tw-100trillionusd',
		name: 'PlanB',
		descriptionKey: 'chain_tools.tools.tw_100trillionusd.description',
		url: 'https://x.com/100trillionUSD',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'bitcoin', 'english'],
		color: '#F7931A',
		isFeatured: true
	},
	{
		id: 'tw-crediblecrypto',
		name: 'Credible Crypto',
		descriptionKey: 'chain_tools.tools.tw_crediblecrypto.description',
		url: 'https://x.com/CredibleCrypto',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-icebergnavig',
		name: 'Ice Berg',
		descriptionKey: 'chain_tools.tools.tw_icebergnavig.description',
		url: 'https://x.com/IcebergNavig',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-tikibarvc',
		name: 'Tiki Bar VC',
		descriptionKey: 'chain_tools.tools.tw_tikibarvc.description',
		url: 'https://x.com/TikiBarVC',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'vc', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-girlgone_crypto',
		name: 'Girl Gone Crypto',
		descriptionKey: 'chain_tools.tools.tw_girlgone_crypto.description',
		url: 'https://x.com/girlgone_crypto',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'education', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-ratio-finance',
		name: 'The Ratio',
		descriptionKey: 'chain_tools.tools.tw_ratio_finance.description',
		url: 'https://x.com/RatioFinance_',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'defi', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-doomsdayapp',
		name: 'Doomsday',
		descriptionKey: 'chain_tools.tools.tw_doomsdayapp.description',
		url: 'https://x.com/DoomsdayApp',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'alpha', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-route2fi',
		name: 'Route 2 FI',
		descriptionKey: 'chain_tools.tools.tw_route2fi.description',
		url: 'https://x.com/Route2FI',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'defi', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'tw-0xngmi',
		name: '0xngmi',
		descriptionKey: 'chain_tools.tools.tw_0xngmi.description',
		url: 'https://x.com/0xngmi',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'defi', 'development'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'tw-scottmelker',
		name: 'Scott Melker',
		descriptionKey: 'chain_tools.tools.tw_scottmelker.description',
		url: 'https://x.com/scottmelker',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-martyparty',
		name: 'Marty Bent',
		descriptionKey: 'chain_tools.tools.tw_martyparty.description',
		url: 'https://x.com/MartyBent',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'bitcoin', 'english'],
		color: '#F7931A'
	},
	{
		id: 'tw-whale_alert',
		name: 'Whale Alert',
		descriptionKey: 'chain_tools.tools.tw_whale_alert.description',
		url: 'https://x.com/whale_alert',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'analytics', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'tw-intothegreyzone',
		name: 'Into The Greyzone',
		descriptionKey: 'chain_tools.tools.tw_intothegreyzone.description',
		url: 'https://x.com/IntoTheGreyzone',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'research', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-ryanberckmans',
		name: 'Ryan Berckmans',
		descriptionKey: 'chain_tools.tools.tw_ryanberckmans.description',
		url: 'https://x.com/ryanberckmans',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'ethereum', 'english'],
		color: '#627EEA'
	},
	{
		id: 'tw-cryptokaleo',
		name: 'Crypto Kaleo',
		descriptionKey: 'chain_tools.tools.tw_cryptokaleo.description',
		url: 'https://x.com/CryptoKaleo',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-ceteris',
		name: 'Ceteris',
		descriptionKey: 'chain_tools.tools.tw_ceterispar1bus.description',
		url: 'https://x.com/ceterispar1bus',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'defi', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-smokeycrypto',
		name: 'Smokey',
		descriptionKey: 'chain_tools.tools.tw_smokeycrypto.description',
		url: 'https://x.com/SmokeyTheBera',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'defi', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-cryptopathic',
		name: 'Crypto Pathic',
		descriptionKey: 'chain_tools.tools.tw_cryptopathic.description',
		url: 'https://x.com/CryptoPathic',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-naiivememe',
		name: 'Naiive',
		descriptionKey: 'chain_tools.tools.tw_naiivememe.description',
		url: 'https://x.com/NaiiveMeme',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'meme', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-crypto_bitlord',
		name: 'BitLord',
		descriptionKey: 'chain_tools.tools.tw_crypto_bitlord.description',
		url: 'https://x.com/Crypto_Bitlord',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-tardigrade',
		name: 'Tardigrade',
		descriptionKey: 'chain_tools.tools.tw_tardigrade.description',
		url: 'https://x.com/Tardigrade',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'research', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-artchick',
		name: 'ArtChick',
		descriptionKey: 'chain_tools.tools.tw_artchick.description',
		url: 'https://x.com/artchick',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'nft', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-pranksy',
		name: 'Pranksy',
		descriptionKey: 'chain_tools.tools.tw_pranksy.description',
		url: 'https://x.com/pranksy',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'nft', 'english'],
		color: '#1DA1F2',
		isFeatured: true
	},
	{
		id: 'tw-cobiesgem',
		name: 'Cobies Gem',
		descriptionKey: 'chain_tools.tools.tw_cobiesgem.description',
		url: 'https://x.com/CobiesGem',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'alpha', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-alphaketchum',
		name: 'Alpha Ketchum',
		descriptionKey: 'chain_tools.tools.tw_alphaketchum.description',
		url: 'https://x.com/AlphaKetchum',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'alpha', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-cryptodon_',
		name: 'CryptoDon',
		descriptionKey: 'chain_tools.tools.tw_cryptodon.description',
		url: 'https://x.com/CryptoDon_',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-nebraskangooner',
		name: 'Nebraskan Gooner',
		descriptionKey: 'chain_tools.tools.tw_nebraskangooner.description',
		url: 'https://x.com/NebraskanGooner',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-cantering_clark',
		name: 'Cantering Clark',
		descriptionKey: 'chain_tools.tools.tw_cantering_clark.description',
		url: 'https://x.com/CanteringClark',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-lilyknightcap',
		name: 'Lily Knight Capital',
		descriptionKey: 'chain_tools.tools.tw_lilyknightcap.description',
		url: 'https://x.com/LilyKnightCap',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-coldbloodedshiller',
		name: 'Cold Blooded Shiller',
		descriptionKey: 'chain_tools.tools.tw_coldbloodedshiller.description',
		url: 'https://x.com/ColdBloodShill',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-blknoiz06',
		name: 'Blknoiz (Ansem)',
		descriptionKey: 'chain_tools.tools.tw_blknoiz06.description',
		url: 'https://x.com/blknoiz06',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'solana', 'english'],
		color: '#9945FF',
		isFeatured: true
	},
	{
		id: 'tw-cryptodoggy',
		name: 'Crypto Doggy',
		descriptionKey: 'chain_tools.tools.tw_cryptodoggy.description',
		url: 'https://x.com/CryptoDoggy',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'meme', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-impaulsive',
		name: 'Impaulsive',
		descriptionKey: 'chain_tools.tools.tw_impaulsive.description',
		url: 'https://x.com/imPaulsive',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'mainstream', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-cryptogems555',
		name: 'Crypto Gems',
		descriptionKey: 'chain_tools.tools.tw_cryptogems555.description',
		url: 'https://x.com/CryptoGems555',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'altcoins', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-mrktmeditations',
		name: 'Markt Meditations',
		descriptionKey: 'chain_tools.tools.tw_mrktmeditations.description',
		url: 'https://x.com/MrktMeditations',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'research', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-cryptocred',
		name: 'CryptoCred',
		descriptionKey: 'chain_tools.tools.tw_cryptocred.description',
		url: 'https://x.com/CryptoCred',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'trading', 'english'],
		color: '#1DA1F2'
	},
	{
		id: 'tw-ledger-status',
		name: 'Ledger',
		descriptionKey: 'chain_tools.tools.tw_ledger_status.description',
		url: 'https://x.com/Ledger',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'security', 'english'],
		color: '#000000'
	},
	{
		id: 'tw-trezor',
		name: 'Trezor',
		descriptionKey: 'chain_tools.tools.tw_trezor.description',
		url: 'https://x.com/Trezor',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'security', 'english'],
		color: '#00A300'
	},
	{
		id: 'tw-ethereumfdn',
		name: 'Ethereum Foundation',
		descriptionKey: 'chain_tools.tools.tw_ethereumfdn.description',
		url: 'https://x.com/ethereum',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'ethereum', 'official'],
		color: '#627EEA',
		isFeatured: true
	},
	{
		id: 'tw-solana-status',
		name: 'Solana',
		descriptionKey: 'chain_tools.tools.tw_solana_status.description',
		url: 'https://x.com/solana',
		icon: Twitter,
		category: 'influencer',
		tags: ['kol', 'twitter', 'solana', 'official'],
		color: '#9945FF',
		isFeatured: true
	}
];

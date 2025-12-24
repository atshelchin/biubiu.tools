/**
 * CEX Tools - Centralized Exchanges & Future Challengers
 *
 * Categories:
 * - Tier 1 CEX (Top 10 by volume)
 * - Regional Leaders
 * - Derivatives Exchanges
 * - Rising Challengers
 * - Exchange Comparison & Analytics
 */
import {
	Building2,
	TrendingUp,
	Globe,
	BarChart3,
	Zap,
	Shield,
	Coins,
	ArrowUpDown,
	Star,
	Users
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const cexTools: ExternalTool[] = [
	// ========== Tier 1 Global CEX ==========
	{
		id: 'binance-cex',
		name: 'Binance',
		descriptionKey: 'chain-tools.tools.binance_cex.description',
		url: 'https://www.binance.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'spot', 'futures', 'global'],
		color: '#F0B90B',
		isFeatured: true
	},
	{
		id: 'coinbase-cex',
		name: 'Coinbase',
		descriptionKey: 'chain-tools.tools.coinbase_cex.description',
		url: 'https://www.coinbase.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'regulated', 'us', 'nasdaq'],
		color: '#0052FF'
	},
	{
		id: 'okx-cex',
		name: 'OKX',
		descriptionKey: 'chain-tools.tools.okx_cex.description',
		url: 'https://www.okx.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'derivatives', 'web3'],
		color: '#000000'
	},
	{
		id: 'bybit-cex',
		name: 'Bybit',
		descriptionKey: 'chain-tools.tools.bybit_cex.description',
		url: 'https://www.bybit.com',
		icon: TrendingUp,
		category: 'cex',
		tags: ['cex', 'exchange', 'derivatives', 'perpetuals'],
		color: '#F7A600'
	},
	{
		id: 'kraken-cex',
		name: 'Kraken',
		descriptionKey: 'chain-tools.tools.kraken_cex.description',
		url: 'https://www.kraken.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'regulated', 'security'],
		color: '#5741D9'
	},
	{
		id: 'bitget-cex',
		name: 'Bitget',
		descriptionKey: 'chain-tools.tools.bitget_cex.description',
		url: 'https://www.bitget.com',
		icon: TrendingUp,
		category: 'cex',
		tags: ['cex', 'exchange', 'copy-trading', 'derivatives'],
		color: '#00F0FF'
	},
	{
		id: 'kucoin-cex',
		name: 'KuCoin',
		descriptionKey: 'chain-tools.tools.kucoin_cex.description',
		url: 'https://www.kucoin.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'altcoins', 'trading-bot'],
		color: '#23AF91'
	},
	{
		id: 'gateio-cex',
		name: 'Gate.io',
		descriptionKey: 'chain-tools.tools.gateio_cex.description',
		url: 'https://www.gate.io',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'altcoins', 'startup'],
		color: '#17E6A1'
	},
	{
		id: 'htx-cex',
		name: 'HTX (Huobi)',
		descriptionKey: 'chain-tools.tools.htx_cex.description',
		url: 'https://www.htx.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'asia', 'derivatives'],
		color: '#2859D1'
	},
	{
		id: 'mexc-cex',
		name: 'MEXC',
		descriptionKey: 'chain-tools.tools.mexc_cex.description',
		url: 'https://www.mexc.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'new-listings', 'altcoins'],
		color: '#00B897'
	},
	// ========== Derivatives Focused ==========
	{
		id: 'deribit-cex',
		name: 'Deribit',
		descriptionKey: 'chain-tools.tools.deribit_cex.description',
		url: 'https://www.deribit.com',
		icon: ArrowUpDown,
		category: 'cex',
		tags: ['cex', 'exchange', 'options', 'futures', 'institutional'],
		color: '#00FF88'
	},
	{
		id: 'bitfinex-cex',
		name: 'Bitfinex',
		descriptionKey: 'chain-tools.tools.bitfinex_cex.description',
		url: 'https://www.bitfinex.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'margin', 'lending'],
		color: '#16B157'
	},
	{
		id: 'bitmex-cex',
		name: 'BitMEX',
		descriptionKey: 'chain-tools.tools.bitmex_cex.description',
		url: 'https://www.bitmex.com',
		icon: Zap,
		category: 'cex',
		tags: ['cex', 'exchange', 'perpetuals', 'leverage'],
		color: '#5A39FF'
	},
	// ========== Regional Leaders ==========
	{
		id: 'upbit-cex',
		name: 'Upbit',
		descriptionKey: 'chain-tools.tools.upbit_cex.description',
		url: 'https://upbit.com',
		icon: Globe,
		category: 'cex',
		tags: ['cex', 'exchange', 'korea', 'kimchi-premium'],
		color: '#003C88'
	},
	{
		id: 'bithumb-cex',
		name: 'Bithumb',
		descriptionKey: 'chain-tools.tools.bithumb_cex.description',
		url: 'https://www.bithumb.com',
		icon: Globe,
		category: 'cex',
		tags: ['cex', 'exchange', 'korea'],
		color: '#F37321'
	},
	{
		id: 'bitflyer-cex',
		name: 'bitFlyer',
		descriptionKey: 'chain-tools.tools.bitflyer_cex.description',
		url: 'https://bitflyer.com',
		icon: Globe,
		category: 'cex',
		tags: ['cex', 'exchange', 'japan', 'regulated'],
		color: '#1652F0'
	},
	{
		id: 'coincheck-cex',
		name: 'Coincheck',
		descriptionKey: 'chain-tools.tools.coincheck_cex.description',
		url: 'https://coincheck.com',
		icon: Globe,
		category: 'cex',
		tags: ['cex', 'exchange', 'japan', 'nft'],
		color: '#39B54A'
	},
	{
		id: 'wazirx-cex',
		name: 'WazirX',
		descriptionKey: 'chain-tools.tools.wazirx_cex.description',
		url: 'https://wazirx.com',
		icon: Globe,
		category: 'cex',
		tags: ['cex', 'exchange', 'india', 'p2p'],
		color: '#4253F0'
	},
	{
		id: 'bitstamp-cex',
		name: 'Bitstamp',
		descriptionKey: 'chain-tools.tools.bitstamp_cex.description',
		url: 'https://www.bitstamp.net',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'europe', 'oldest', 'regulated'],
		color: '#2A9D8F'
	},
	{
		id: 'lbank-cex',
		name: 'LBank',
		descriptionKey: 'chain-tools.tools.lbank_cex.description',
		url: 'https://www.lbank.com',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'exchange', 'altcoins', 'launchpad'],
		color: '#1E6EFF'
	},
	// ========== Rising Challengers ==========
	{
		id: 'backpack-cex',
		name: 'Backpack Exchange',
		descriptionKey: 'chain-tools.tools.backpack_cex.description',
		url: 'https://backpack.exchange',
		icon: Star,
		category: 'cex',
		tags: ['cex', 'exchange', 'solana', 'regulated', 'dubai'],
		color: '#E84142'
	},
	{
		id: 'hyperliquid-cex',
		name: 'Hyperliquid',
		descriptionKey: 'chain-tools.tools.hyperliquid_cex.description',
		url: 'https://hyperliquid.xyz',
		icon: Zap,
		category: 'cex',
		tags: ['dex', 'perpetuals', 'orderbook', 'l1'],
		color: '#00D395'
	},
	{
		id: 'cube-cex',
		name: 'Cube Exchange',
		descriptionKey: 'chain-tools.tools.cube_cex.description',
		url: 'https://cube.exchange',
		icon: Star,
		category: 'cex',
		tags: ['cex', 'exchange', 'hybrid', 'mpc'],
		color: '#6366F1'
	},
	{
		id: 'bullish-cex',
		name: 'Bullish',
		descriptionKey: 'chain-tools.tools.bullish_cex.description',
		url: 'https://bullish.com',
		icon: TrendingUp,
		category: 'cex',
		tags: ['cex', 'exchange', 'institutional', 'block-one'],
		color: '#FFCC00'
	},
	{
		id: 'hashkey-cex',
		name: 'HashKey Exchange',
		descriptionKey: 'chain-tools.tools.hashkey_cex.description',
		url: 'https://www.hashkey.com',
		icon: Shield,
		category: 'cex',
		tags: ['cex', 'exchange', 'hong-kong', 'licensed'],
		color: '#1E40AF'
	},
	{
		id: 'osl-cex',
		name: 'OSL',
		descriptionKey: 'chain-tools.tools.osl_cex.description',
		url: 'https://osl.com',
		icon: Shield,
		category: 'cex',
		tags: ['cex', 'exchange', 'hong-kong', 'institutional'],
		color: '#00A3FF'
	},
	// ========== Exchange Comparison & Analytics ==========
	{
		id: 'coingecko-exchanges',
		name: 'CoinGecko Exchanges',
		descriptionKey: 'chain-tools.tools.coingecko_exchanges.description',
		url: 'https://www.coingecko.com/en/exchanges',
		icon: BarChart3,
		category: 'cex',
		tags: ['analytics', 'exchange-ranking', 'volume', 'trust-score'],
		color: '#8CC63F'
	},
	{
		id: 'cmc-exchanges',
		name: 'CMC Exchange Ranking',
		descriptionKey: 'chain-tools.tools.cmc_exchanges.description',
		url: 'https://coinmarketcap.com/rankings/exchanges',
		icon: BarChart3,
		category: 'cex',
		tags: ['analytics', 'exchange-ranking', 'volume', 'liquidity'],
		color: '#3861FB'
	},
	{
		id: 'cryptorank-exchanges',
		name: 'CryptoRank Exchanges',
		descriptionKey: 'chain-tools.tools.cryptorank_exchanges.description',
		url: 'https://cryptorank.io/exchanges',
		icon: BarChart3,
		category: 'cex',
		tags: ['analytics', 'exchange-ranking', 'data'],
		color: '#8B5CF6'
	},
	{
		id: 'kaiko-data',
		name: 'Kaiko',
		descriptionKey: 'chain-tools.tools.kaiko_data.description',
		url: 'https://www.kaiko.com',
		icon: BarChart3,
		category: 'cex',
		tags: ['analytics', 'market-data', 'institutional', 'api'],
		color: '#6366F1'
	},
	{
		id: 'ccdata',
		name: 'CCData (CryptoCompare)',
		descriptionKey: 'chain-tools.tools.ccdata.description',
		url: 'https://ccdata.io',
		icon: BarChart3,
		category: 'cex',
		tags: ['analytics', 'market-data', 'indices', 'institutional'],
		color: '#FF6600'
	},
	// ========== Institutional Trading ==========
	{
		id: 'coinbase-prime',
		name: 'Coinbase Prime',
		descriptionKey: 'chain-tools.tools.coinbase_prime.description',
		url: 'https://prime.coinbase.com',
		icon: Shield,
		category: 'cex',
		tags: ['cex', 'institutional', 'prime-broker', 'custody'],
		color: '#0052FF'
	},
	{
		id: 'binance-institutional',
		name: 'Binance Institutional',
		descriptionKey: 'chain-tools.tools.binance_institutional.description',
		url: 'https://www.binance.com/en/vip-institutional-services',
		icon: Building2,
		category: 'cex',
		tags: ['cex', 'institutional', 'vip', 'otc'],
		color: '#F0B90B'
	},
	{
		id: 'galaxy-trading',
		name: 'Galaxy Trading',
		descriptionKey: 'chain-tools.tools.galaxy_trading.description',
		url: 'https://www.galaxy.com/trading',
		icon: TrendingUp,
		category: 'cex',
		tags: ['trading', 'institutional', 'otc', 'derivatives'],
		color: '#7C3AED'
	},
	{
		id: 'cumberland-trading',
		name: 'Cumberland',
		descriptionKey: 'chain-tools.tools.cumberland_trading.description',
		url: 'https://cumberland.io',
		icon: Building2,
		category: 'cex',
		tags: ['trading', 'institutional', 'otc', 'market-making'],
		color: '#1E40AF'
	},
	// ========== Crypto-Fiat On/Off Ramps ==========
	{
		id: 'moonpay-ramp',
		name: 'MoonPay',
		descriptionKey: 'chain-tools.tools.moonpay_ramp.description',
		url: 'https://www.moonpay.com',
		icon: Coins,
		category: 'cex',
		tags: ['on-ramp', 'fiat', 'buy-crypto', 'payments'],
		color: '#7C3AED'
	},
	{
		id: 'transak-ramp',
		name: 'Transak',
		descriptionKey: 'chain-tools.tools.transak_ramp.description',
		url: 'https://transak.com',
		icon: Coins,
		category: 'cex',
		tags: ['on-ramp', 'fiat', 'integration', 'global'],
		color: '#1A56DB'
	},
	{
		id: 'ramp-network',
		name: 'Ramp Network',
		descriptionKey: 'chain-tools.tools.ramp_network.description',
		url: 'https://ramp.network',
		icon: Coins,
		category: 'cex',
		tags: ['on-ramp', 'off-ramp', 'sdk', 'compliance'],
		color: '#21D375'
	},
	{
		id: 'banxa-ramp',
		name: 'Banxa',
		descriptionKey: 'chain-tools.tools.banxa_ramp.description',
		url: 'https://banxa.com',
		icon: Coins,
		category: 'cex',
		tags: ['on-ramp', 'fiat', 'regulated', 'payments'],
		color: '#5340FF'
	},
	// ========== P2P Trading ==========
	{
		id: 'paxful-p2p',
		name: 'Paxful',
		descriptionKey: 'chain-tools.tools.paxful_p2p.description',
		url: 'https://paxful.com',
		icon: Users,
		category: 'cex',
		tags: ['p2p', 'trading', 'escrow', 'gift-cards'],
		color: '#00A5EF'
	},
	{
		id: 'localbitcoins-p2p',
		name: 'LocalBitcoins',
		descriptionKey: 'chain-tools.tools.localbitcoins_p2p.description',
		url: 'https://localbitcoins.com',
		icon: Users,
		category: 'cex',
		tags: ['p2p', 'bitcoin', 'local', 'cash'],
		color: '#4A90D9'
	},
	{
		id: 'noones-p2p',
		name: 'Noones',
		descriptionKey: 'chain-tools.tools.noones_p2p.description',
		url: 'https://noones.com',
		icon: Users,
		category: 'cex',
		tags: ['p2p', 'trading', 'emerging-markets', 'social'],
		color: '#FF6B35'
	}
];

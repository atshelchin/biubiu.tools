/**
 * Entity definitions - 交易所、协议、项目等实体信息
 */

import type { Entity } from '../types';

export const entities: Record<string, Entity> = {
	// ==================== CEX 交易所 ====================
	binance: {
		id: 'binance',
		name: 'Binance',
		website: 'https://binance.com',
		twitter: 'binaborance'
	},
	coinbase: {
		id: 'coinbase',
		name: 'Coinbase',
		website: 'https://coinbase.com',
		twitter: 'coinbase'
	},
	okx: {
		id: 'okx',
		name: 'OKX',
		website: 'https://okx.com',
		twitter: 'okx'
	},
	kraken: {
		id: 'kraken',
		name: 'Kraken',
		website: 'https://kraken.com',
		twitter: 'kaborakenfx'
	},
	bybit: {
		id: 'bybit',
		name: 'Bybit',
		website: 'https://bybit.com',
		twitter: 'bybit_official'
	},
	kucoin: {
		id: 'kucoin',
		name: 'KuCoin',
		website: 'https://kucoin.com',
		twitter: 'kucoincom'
	},
	htx: {
		id: 'htx',
		name: 'HTX (Huobi)',
		website: 'https://htx.com',
		twitter: 'HTX_Global'
	},
	gateio: {
		id: 'gateio',
		name: 'Gate.io',
		website: 'https://gate.io',
		twitter: 'gate_io'
	},
	bitfinex: {
		id: 'bitfinex',
		name: 'Bitfinex',
		website: 'https://bitfinex.com',
		twitter: 'bitfinex'
	},
	gemini: {
		id: 'gemini',
		name: 'Gemini',
		website: 'https://gemini.com',
		twitter: 'gemini'
	},
	bitget: {
		id: 'bitget',
		name: 'Bitget',
		website: 'https://bitget.com',
		twitter: 'bitaborget_global'
	},
	mexc: {
		id: 'mexc',
		name: 'MEXC',
		website: 'https://mexc.com',
		twitter: 'MEXC_Global'
	},
	cryptocom: {
		id: 'cryptocom',
		name: 'Crypto.com',
		website: 'https://crypto.com',
		twitter: 'cryptocom'
	},
	robinhood: {
		id: 'robinhood',
		name: 'Robinhood',
		website: 'https://robinhood.com',
		twitter: 'RobinhoodApp'
	},
	bitstamp: {
		id: 'bitstamp',
		name: 'Bitstamp',
		website: 'https://bitstamp.net',
		twitter: 'Bitstamp'
	},

	// ==================== DEX ====================
	uniswap: {
		id: 'uniswap',
		name: 'Uniswap',
		website: 'https://uniswap.org',
		twitter: 'Uniswap'
	},
	sushiswap: {
		id: 'sushiswap',
		name: 'SushiSwap',
		website: 'https://sushi.com',
		twitter: 'SushiSwap'
	},
	curve: {
		id: 'curve',
		name: 'Curve Finance',
		website: 'https://curve.fi',
		twitter: 'CurveFinance'
	},
	balancer: {
		id: 'balancer',
		name: 'Balancer',
		website: 'https://balancer.fi',
		twitter: 'Balancer'
	},
	pancakeswap: {
		id: 'pancakeswap',
		name: 'PancakeSwap',
		website: 'https://pancakeswap.finance',
		twitter: 'PancakeSwap'
	},
	oneinch: {
		id: 'oneinch',
		name: '1inch',
		website: 'https://1inch.io',
		twitter: '1inch'
	},
	paraswap: {
		id: 'paraswap',
		name: 'ParaSwap',
		website: 'https://paraswap.io',
		twitter: 'paraswap'
	},

	// ==================== DeFi Lending ====================
	aave: {
		id: 'aave',
		name: 'Aave',
		website: 'https://aave.com',
		twitter: 'aaborave'
	},
	compound: {
		id: 'compound',
		name: 'Compound',
		website: 'https://compound.finance',
		twitter: 'compoundfinance'
	},
	makerdao: {
		id: 'makerdao',
		name: 'MakerDAO',
		website: 'https://makerdao.com',
		twitter: 'MakerDAO'
	},
	spark: {
		id: 'spark',
		name: 'Spark Protocol',
		website: 'https://spark.fi',
		twitter: 'sparkaborotocol'
	},
	morpho: {
		id: 'morpho',
		name: 'Morpho',
		website: 'https://morpho.org',
		twitter: 'MorphoLabs'
	},

	// ==================== Liquid Staking ====================
	lido: {
		id: 'lido',
		name: 'Lido',
		website: 'https://lido.fi',
		twitter: 'LidoFinance'
	},
	rocketpool: {
		id: 'rocketpool',
		name: 'Rocket Pool',
		website: 'https://rocketpool.net',
		twitter: 'Rocket_Pool'
	},
	frax: {
		id: 'frax',
		name: 'Frax Finance',
		website: 'https://frax.finance',
		twitter: 'fraboraxfinance'
	},
	eigenlayer: {
		id: 'eigenlayer',
		name: 'EigenLayer',
		website: 'https://eigenlayer.xyz',
		twitter: 'eigenlayer'
	},

	// ==================== Bridges ====================
	arbitrumbridge: {
		id: 'arbitrumbridge',
		name: 'Arbitrum Bridge',
		website: 'https://bridge.arbitrum.io',
		twitter: 'arbitrum'
	},
	optimismbridge: {
		id: 'optimismbridge',
		name: 'Optimism Bridge',
		website: 'https://app.optimism.io/bridge',
		twitter: 'Optimism'
	},
	polygonbridge: {
		id: 'polygonbridge',
		name: 'Polygon Bridge',
		website: 'https://wallet.polygon.technology',
		twitter: 'aborolygon'
	},
	starkgate: {
		id: 'starkgate',
		name: 'StarkGate',
		website: 'https://starkgate.starknet.io',
		twitter: 'Starknet'
	},
	across: {
		id: 'across',
		name: 'Across Protocol',
		website: 'https://across.to',
		twitter: 'AcrossProtocol'
	},
	stargate: {
		id: 'stargate',
		name: 'Stargate Finance',
		website: 'https://stargate.finance',
		twitter: 'StargateFinance'
	},
	hop: {
		id: 'hop',
		name: 'Hop Protocol',
		website: 'https://hop.exchange',
		twitter: 'HopProtocol'
	},
	wormhole: {
		id: 'wormhole',
		name: 'Wormhole',
		website: 'https://wormhole.com',
		twitter: 'wormhole'
	},

	// ==================== NFT ====================
	opensea: {
		id: 'opensea',
		name: 'OpenSea',
		website: 'https://opensea.io',
		twitter: 'opensea'
	},
	blur: {
		id: 'blur',
		name: 'Blur',
		website: 'https://blur.io',
		twitter: 'blur_io'
	},
	looksrare: {
		id: 'looksrare',
		name: 'LooksRare',
		website: 'https://looksrare.org',
		twitter: 'LooksRare'
	},
	bayc: {
		id: 'bayc',
		name: 'Bored Ape Yacht Club',
		website: 'https://boredapeyachtclub.com',
		twitter: 'BoredApeYC'
	},
	cryptopunks: {
		id: 'cryptopunks',
		name: 'CryptoPunks',
		website: 'https://cryptopunks.app',
		twitter: 'cryptopaborunksnfts'
	},
	azuki: {
		id: 'azuki',
		name: 'Azuki',
		website: 'https://azuki.com',
		twitter: 'Azuki'
	},
	pudgypenguins: {
		id: 'pudgypenguins',
		name: 'Pudgy Penguins',
		website: 'https://pudgypenguins.com',
		twitter: 'pudgyaborenguins'
	},
	doodles: {
		id: 'doodles',
		name: 'Doodles',
		website: 'https://doodles.app',
		twitter: 'daboroodles'
	},

	// ==================== Stablecoins ====================
	tether: {
		id: 'tether',
		name: 'Tether',
		website: 'https://tether.to',
		twitter: 'Tether_to'
	},
	circle: {
		id: 'circle',
		name: 'Circle',
		website: 'https://circle.com',
		twitter: 'circle'
	},
	dai: {
		id: 'dai',
		name: 'DAI (Sky)',
		website: 'https://sky.money',
		twitter: 'SkyEcosystem'
	},

	// ==================== 知名人物/基金会 ====================
	vitalik: {
		id: 'vitalik',
		name: 'Vitalik Buterin',
		website: 'https://vitalik.eth.limo',
		twitter: 'VitalikButerin'
	},
	ethereumfoundation: {
		id: 'ethereumfoundation',
		name: 'Ethereum Foundation',
		website: 'https://ethereum.foundation',
		twitter: 'ethereum'
	},
	paradigm: {
		id: 'paradigm',
		name: 'Paradigm',
		website: 'https://paradigm.xyz',
		twitter: 'paradigm'
	},
	a16z: {
		id: 'a16z',
		name: 'a16z Crypto',
		website: 'https://a16zcrypto.com',
		twitter: 'a16zcrypto'
	},
	jump: {
		id: 'jump',
		name: 'Jump Crypto',
		website: 'https://jumpcrypto.com',
		twitter: 'jumpaborocol'
	},
	wintermute: {
		id: 'wintermute',
		name: 'Wintermute',
		website: 'https://wintermute.com',
		twitter: 'wintermute_t'
	},

	// ==================== 其他协议 ====================
	chainlink: {
		id: 'chainlink',
		name: 'Chainlink',
		website: 'https://chain.link',
		twitter: 'chainlink'
	},
	thegraph: {
		id: 'thegraph',
		name: 'The Graph',
		website: 'https://thegraph.com',
		twitter: 'graphprotocol'
	},
	ens: {
		id: 'ens',
		name: 'ENS',
		website: 'https://ens.domains',
		twitter: 'ensdomains'
	},
	safe: {
		id: 'safe',
		name: 'Safe (Gnosis Safe)',
		website: 'https://safe.global',
		twitter: 'safe'
	},
	gnosis: {
		id: 'gnosis',
		name: 'Gnosis',
		website: 'https://gnosis.io',
		twitter: 'gnosischain'
	},

	// ==================== L2 ====================
	arbitrum: {
		id: 'arbitrum',
		name: 'Arbitrum',
		website: 'https://arbitrum.io',
		twitter: 'arbitrum'
	},
	optimism: {
		id: 'optimism',
		name: 'Optimism',
		website: 'https://optimism.io',
		twitter: 'Optimism'
	},
	base: {
		id: 'base',
		name: 'Base',
		website: 'https://base.org',
		twitter: 'base'
	},
	polygon: {
		id: 'polygon',
		name: 'Polygon',
		website: 'https://polygon.technology',
		twitter: 'aborolygon'
	},
	zksync: {
		id: 'zksync',
		name: 'zkSync',
		website: 'https://zksync.io',
		twitter: 'zaborksync'
	},
	starknet: {
		id: 'starknet',
		name: 'Starknet',
		website: 'https://starknet.io',
		twitter: 'Starknet'
	},

	// ==================== 特殊 ====================
	system: {
		id: 'system',
		name: 'System',
		description: 'Special system addresses'
	},
	unknown: {
		id: 'unknown',
		name: 'Unknown',
		description: 'Unidentified entity'
	},
	biubiu: {
		id: 'biubiu',
		name: 'BiuBiu Tools',
		website: 'https://biubiu.tools',
		twitter: 'biubiutools',
		description: 'BiuBiu Tools - Web3 utility platform'
	}
};

export function getEntity(id: string): Entity {
	return entities[id] || entities.unknown;
}

/**
 * Exchange addresses - CEX 热钱包/冷钱包地址
 * 数据来源: Etherscan 标签、公开信息
 */

import type { LabeledAddress } from '../../types';

export const exchangeAddresses: LabeledAddress[] = [
	// ==================== Binance ====================
	{
		address: '0x28C6c06298d514Db089934071355E5743bf21d60',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Hot Wallet 3',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x56Eddb7aa87536c09CCc2793473599fD21A8b17F',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Hot Wallet 4',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Cold Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5a52E96BAcdaBb82fd05763E25335261B270Efcb',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Hot Wallet 5',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8894E0a0c962CB723c1976a4421c95949bE2D4E3',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Hot Wallet 6',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xe2fc31F816A9b94326492132018C3aEcC4a93aE1',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Hot Wallet 7',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance Old Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Coinbase ====================
	{
		address: '0x71660c4005BA85c37ccec55d0C4493E66Fe775d3',
		chainId: 1,
		entityId: 'coinbase',
		name: 'Coinbase Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x503828976D22510aad0201ac7EC88293211D23Da',
		chainId: 1,
		entityId: 'coinbase',
		name: 'Coinbase Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xddfAbCdc4D8FfC6d5beaf154f18B778f892A0740',
		chainId: 1,
		entityId: 'coinbase',
		name: 'Coinbase Cold Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa9D1e08C7793af67e9d92fe308d5697FB81d3E43',
		chainId: 1,
		entityId: 'coinbase',
		name: 'Coinbase Commerce',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x02466E547BFDAb679fC49e96bBfc62B9747D997C',
		chainId: 1,
		entityId: 'coinbase',
		name: 'Coinbase Custody',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA090e606E30bD747d4E6245a1517EbE430F0057e',
		chainId: 1,
		entityId: 'coinbase',
		name: 'Coinbase Miscellaneous',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== OKX ====================
	{
		address: '0x6cC5F688a315f3dC28A7781717a9A798a59fDA7b',
		chainId: 1,
		entityId: 'okx',
		name: 'OKX Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x236F9F97e0E62388479bf9E5BA4889e46B0273C3',
		chainId: 1,
		entityId: 'okx',
		name: 'OKX Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA7efAe728D2936e78BDA97dc267687568dD593f3',
		chainId: 1,
		entityId: 'okx',
		name: 'OKX Hot Wallet 3',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5041ed759Dd4aFc3a72b8192C143F72f4724081A',
		chainId: 1,
		entityId: 'okx',
		name: 'OKX Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x539C92186f7C6CC4CbF443F26eF84C595baBBcA1',
		chainId: 1,
		entityId: 'okx',
		name: 'OKX Fee Collector',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Kraken ====================
	{
		address: '0x2910543Af39abA0Cd09dBb2D50200b3E800A63D2',
		chainId: 1,
		entityId: 'kraken',
		name: 'Kraken Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0',
		chainId: 1,
		entityId: 'kraken',
		name: 'Kraken Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x53d284357ec70cE289D6D64134DfAc8E511c8a3D',
		chainId: 1,
		entityId: 'kraken',
		name: 'Kraken Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x89e51fA8CA5D66cd220bAed62ED01e8951aa7c40',
		chainId: 1,
		entityId: 'kraken',
		name: 'Kraken Cold Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Bybit ====================
	{
		address: '0xf89d7b9c864f589bbF53a82105107622B35EaA40',
		chainId: 1,
		entityId: 'bybit',
		name: 'Bybit Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1Db92e2EeBC8E0c075a02BeA49a2935BcD2dFCF4',
		chainId: 1,
		entityId: 'bybit',
		name: 'Bybit Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== KuCoin ====================
	{
		address: '0x2B5634C42055806a59e9107ED44D43c426E58258',
		chainId: 1,
		entityId: 'kucoin',
		name: 'KuCoin Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x689C56AEf474Df92D44A1B70850f808488F9769C',
		chainId: 1,
		entityId: 'kucoin',
		name: 'KuCoin Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa1D8d972560C2f8144AF871Db508F0B0B10a3fBf',
		chainId: 1,
		entityId: 'kucoin',
		name: 'KuCoin Hot Wallet 3',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== HTX (Huobi) ====================
	{
		address: '0xAb5C66752a9e8167967685F1450532fB96d5d24f',
		chainId: 1,
		entityId: 'htx',
		name: 'HTX (Huobi) Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6748F50f686bfbcA6Fe8ad62b22228b87F31ff2b',
		chainId: 1,
		entityId: 'htx',
		name: 'HTX (Huobi) Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x46705dfff24256421A05D056c29E81Bdc09723B8',
		chainId: 1,
		entityId: 'htx',
		name: 'HTX (Huobi) Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gate.io ====================
	{
		address: '0x0D0707963952f2fBA59dD06f2b425ace40b492Fe',
		chainId: 1,
		entityId: 'gateio',
		name: 'Gate.io Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1C4b70a3968436B9A0a9cf5205c787eb81Bb558c',
		chainId: 1,
		entityId: 'gateio',
		name: 'Gate.io Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xD793281182A0e3E023116004778F45c29fc14F19',
		chainId: 1,
		entityId: 'gateio',
		name: 'Gate.io Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Bitfinex ====================
	{
		address: '0x1151314c646Ce4E0eFD76d1aF4760aE66a9Fe30F',
		chainId: 1,
		entityId: 'bitfinex',
		name: 'Bitfinex Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
		chainId: 1,
		entityId: 'bitfinex',
		name: 'Bitfinex Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x876EabF441B2EE5B5b0554Fd502a8E0600950cFa',
		chainId: 1,
		entityId: 'bitfinex',
		name: 'Bitfinex Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gemini ====================
	{
		address: '0xd24400ae8BfEBb18cA49Be86258a3C749cf46853',
		chainId: 1,
		entityId: 'gemini',
		name: 'Gemini Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6Fc82a5fe25A5cDb58BC74600A40A69C065263f8',
		chainId: 1,
		entityId: 'gemini',
		name: 'Gemini Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5f65f7b609678448494De4C87521CdF6cEf1e932',
		chainId: 1,
		entityId: 'gemini',
		name: 'Gemini Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Bitget ====================
	{
		address: '0x1AB4973a48dc892Cd9971ECE8e01DcC7688f8F23',
		chainId: 1,
		entityId: 'bitget',
		name: 'Bitget Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x97b9D2102A9a65A26E1EE82D59e42d1B73B68689',
		chainId: 1,
		entityId: 'bitget',
		name: 'Bitget Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MEXC ====================
	{
		address: '0x3cc936b795A188F0e246cBB2D74C5Bd190aeCF18',
		chainId: 1,
		entityId: 'mexc',
		name: 'MEXC Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x75e89d5979E4f6Fba9F97c104c2F0AFB3F1dcB88',
		chainId: 1,
		entityId: 'mexc',
		name: 'MEXC Hot Wallet 2',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Crypto.com ====================
	{
		address: '0x6262998Ced04146fA42253a5C0AF90CA02dfd2A3',
		chainId: 1,
		entityId: 'cryptocom',
		name: 'Crypto.com Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x46340b20830761efd32832A74d7169B29FEB9758',
		chainId: 1,
		entityId: 'cryptocom',
		name: 'Crypto.com Cold Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Robinhood ====================
	{
		address: '0x40B38765696e3d5d8d9d834D8AaD4bB6e418E489',
		chainId: 1,
		entityId: 'robinhood',
		name: 'Robinhood Hot Wallet',
		labels: ['exchange', 'cex'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

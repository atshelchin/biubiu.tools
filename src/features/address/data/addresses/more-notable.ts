/**
 * More Notable Addresses - Famous wallets, protocols, and contracts
 * 数据来源: Etherscan, official documentation
 */

import type { LabeledAddress } from '../../types';

export const moreNotableAddresses: LabeledAddress[] = [
	// ==================== Famous Wallets ====================
	{
		address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
		chainId: 1,
		entityId: 'vitalik',
		name: 'vitalik.eth',
		labels: ['notable', 'whale'],
		riskLevel: 'safe',
		description: 'Vitalik Buterin - Ethereum co-founder',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
		chainId: 1,
		entityId: 'vitalik',
		name: 'Vitalik Legacy Wallet',
		labels: ['notable', 'whale'],
		riskLevel: 'safe',
		description: 'Vitalik Buterin legacy wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x220866B1A2219f40e72f5c628B65D54268cA3A9D',
		chainId: 1,
		entityId: 'paradigm',
		name: 'Paradigm Treasury',
		labels: ['notable', 'whale'],
		riskLevel: 'safe',
		description: 'Paradigm VC treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0716a17FBAeE714f1E6aB0f9d59edbC5f09815C0',
		chainId: 1,
		entityId: 'jump',
		name: 'Jump Trading',
		labels: ['notable', 'whale'],
		riskLevel: 'safe',
		description: 'Jump Trading/Crypto wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x28C6c06298d514Db089934071355E5743bf21d60',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance 14',
		labels: ['exchange', 'whale'],
		riskLevel: 'safe',
		description: 'Binance hot wallet 14',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance 15',
		labels: ['exchange', 'whale'],
		riskLevel: 'safe',
		description: 'Binance hot wallet 15',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Protocol Treasuries ====================
	{
		address: '0x0bc3807Ec262cB779b38D65b38158acC3bfedE10',
		chainId: 1,
		entityId: 'notional',
		name: 'Notional Finance Treasury',
		labels: ['defi', 'whale'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5a52E96BAcdaBb82fd05763E25335261B270Efcb',
		chainId: 1,
		entityId: 'olympus',
		name: 'Olympus DAO Treasury',
		labels: ['dao', 'whale'],
		riskLevel: 'safe',
		description: 'OlympusDAO treasury',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
		chainId: 1,
		entityId: 'polygon',
		name: 'Polygon ERC20 Bridge',
		labels: ['bridge', 'contract'],
		riskLevel: 'safe',
		description: 'Polygon PoS bridge for ERC20',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== DeFi Giants ====================
	{
		address: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V2 Router',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Uniswap V2 router contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V3 Router',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Uniswap V3 swap router',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap V3 Router 2',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Uniswap V3 swap router 02',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
		chainId: 1,
		entityId: 'uniswap',
		name: 'Uniswap Universal Router',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Uniswap universal router',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Stablecoins ====================
	{
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		chainId: 1,
		entityId: 'circle',
		name: 'USDC Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Circle USDC stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
		chainId: 1,
		entityId: 'tether',
		name: 'USDT Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Tether USDT stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
		chainId: 1,
		entityId: 'makerdao',
		name: 'DAI Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'MakerDAO DAI stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Top Tokens ====================
	{
		address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
		chainId: 1,
		entityId: 'chainlink',
		name: 'LINK Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Chainlink LINK token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
		chainId: 1,
		entityId: 'aave',
		name: 'AAVE Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Aave governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
		chainId: 1,
		entityId: 'makerdao',
		name: 'MKR Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'MakerDAO governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
		chainId: 1,
		entityId: 'compound',
		name: 'COMP Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Compound governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xD533a949740bb3306d119CC777fa900bA034cd52',
		chainId: 1,
		entityId: 'curve',
		name: 'CRV Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Curve DAO token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xba100000625a3754423978a60c9317c58a424e3D',
		chainId: 1,
		entityId: 'balancer',
		name: 'BAL Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Balancer governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
		chainId: 1,
		entityId: 'sushi',
		name: 'SUSHI Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'SushiSwap token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x111111111117dC0aa78b770fA6A738034120C302',
		chainId: 1,
		entityId: '1inch',
		name: '1INCH Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: '1inch governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== NFT Collections ====================
	{
		address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
		chainId: 1,
		entityId: 'bayc',
		name: 'Bored Ape Yacht Club',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'BAYC NFT collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x60E4d786628Fea6478F785A6d7e704777c86a7c6',
		chainId: 1,
		entityId: 'bayc',
		name: 'Mutant Ape Yacht Club',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'MAYC NFT collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
		chainId: 1,
		entityId: 'larvalabs',
		name: 'CryptoPunks',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'CryptoPunks NFT collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
		chainId: 1,
		entityId: 'proof',
		name: 'Moonbirds',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'Moonbirds NFT collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
		chainId: 1,
		entityId: 'azuki',
		name: 'Azuki',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'Azuki NFT collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B',
		chainId: 1,
		entityId: 'clone',
		name: 'CloneX',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'CloneX NFT collection by RTFKT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
		chainId: 1,
		entityId: 'doodles',
		name: 'Doodles',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'Doodles NFT collection',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258',
		chainId: 1,
		entityId: 'otherdeed',
		name: 'Otherdeed for Otherside',
		labels: ['nft'],
		riskLevel: 'safe',
		description: 'Yuga Labs Otherdeed NFT',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== L2 Tokens ====================
	{
		address: '0x912CE59144191C1204E64559FE8253a0e49E6548',
		chainId: 42161,
		entityId: 'arbitrum',
		name: 'ARB Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		description: 'Arbitrum governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x4200000000000000000000000000000000000042',
		chainId: 10,
		entityId: 'optimism',
		name: 'OP Token',
		labels: ['token', 'layer2'],
		riskLevel: 'safe',
		description: 'Optimism governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Infrastructure ====================
	{
		address: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
		chainId: 1,
		entityId: 'ethereum',
		name: 'ETH 2.0 Deposit Contract',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'Ethereum 2.0 staking deposit contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
		chainId: 1,
		entityId: 'weth',
		name: 'WETH Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Wrapped Ether (WETH9)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== VC Wallets ====================
	{
		address: '0x2B6eD29A95753C3Ad948348e3e7b1A251080Ffb9',
		chainId: 1,
		entityId: 'a16z',
		name: 'a16z Crypto',
		labels: ['notable', 'whale'],
		riskLevel: 'safe',
		description: 'Andreessen Horowitz crypto fund',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0b4C02C8af8d2dd0c5bF4Ea10dE9e9cD8C8e9c7A',
		chainId: 1,
		entityId: 'polychain',
		name: 'Polychain Capital',
		labels: ['notable', 'whale'],
		riskLevel: 'safe',
		description: 'Polychain Capital wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7bFEE91193d9Df2Ac0bFe90191D40F23c773C060',
		chainId: 1,
		entityId: 'dragonfly',
		name: 'Dragonfly Capital',
		labels: ['notable', 'whale'],
		riskLevel: 'safe',
		description: 'Dragonfly Capital wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Exchange Hot Wallets ====================
	{
		address: '0xDFd5293D8e347dFe59E90eFd55b2956a1343963d',
		chainId: 1,
		entityId: 'coinbase',
		name: 'Coinbase Commerce',
		labels: ['exchange', 'whale'],
		riskLevel: 'safe',
		description: 'Coinbase Commerce wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1151314c646Ce4E0eFD76d1aF4760aE66a9Fe30F',
		chainId: 1,
		entityId: 'bitfinex',
		name: 'Bitfinex Hot Wallet',
		labels: ['exchange', 'whale'],
		riskLevel: 'safe',
		description: 'Bitfinex exchange hot wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
		chainId: 1,
		entityId: 'bitfinex',
		name: 'Bitfinex Cold Wallet',
		labels: ['exchange', 'whale'],
		riskLevel: 'safe',
		description: 'Bitfinex exchange cold wallet',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance 7 (Cold)',
		labels: ['exchange', 'whale'],
		riskLevel: 'safe',
		description: 'Binance cold wallet 7',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
		chainId: 1,
		entityId: 'binance',
		name: 'Binance 8',
		labels: ['exchange', 'whale'],
		riskLevel: 'safe',
		description: 'Binance hot wallet 8',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

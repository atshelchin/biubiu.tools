/**
 * Additional DeFi Protocol Addresses
 * 数据来源：官方文档、DeFiLlama、Etherscan
 */

import type { LabeledAddress } from '../../types';

export const moreDefiAddresses: LabeledAddress[] = [
	// ==================== Uniswap V3 ====================

	{
		address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
		chainId: 1,
		name: 'Uniswap SwapRouter02',
		labels: ['defi', 'contract'],
		entityId: 'uniswap',
		riskLevel: 'safe',
		description: 'Uniswap swap router V2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
		chainId: 1,
		name: 'Uniswap V3 Positions NFT',
		labels: ['defi', 'nft', 'contract'],
		entityId: 'uniswap',
		riskLevel: 'safe',
		description: 'Uniswap V3 NFT positions manager',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a',
		chainId: 1,
		name: 'Uniswap V4 PoolManager',
		labels: ['defi', 'contract'],
		entityId: 'uniswap',
		riskLevel: 'safe',
		description: 'Uniswap V4 pool manager',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Curve ====================
	{
		address: '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7',
		chainId: 1,
		name: 'Curve 3Pool',
		labels: ['defi', 'contract'],
		entityId: 'curve',
		riskLevel: 'safe',
		description: 'Curve 3Pool (DAI/USDC/USDT)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022',
		chainId: 1,
		name: 'Curve stETH Pool',
		labels: ['defi', 'contract'],
		entityId: 'curve',
		riskLevel: 'safe',
		description: 'Curve stETH/ETH pool',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x99a58482BD75cbab83b27EC03CA68fF489b5788f',
		chainId: 1,
		name: 'Curve crvUSD Controller',
		labels: ['defi', 'contract'],
		entityId: 'curve',
		riskLevel: 'safe',
		description: 'Curve crvUSD controller',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E',
		chainId: 1,
		name: 'crvUSD Token',
		labels: ['token'],
		entityId: 'curve',
		riskLevel: 'safe',
		description: 'Curve USD stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Aave V3 ====================
	{
		address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
		chainId: 1,
		name: 'Aave V3 Pool',
		labels: ['defi', 'contract'],
		entityId: 'aave',
		riskLevel: 'safe',
		description: 'Aave V3 lending pool',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x2f39d218133AFaB8F2B819B1066c7E434Ad94E9e',
		chainId: 1,
		name: 'Aave V3 Pool Addresses Provider',
		labels: ['defi', 'contract'],
		entityId: 'aave',
		riskLevel: 'safe',
		description: 'Aave V3 pool addresses provider',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x64b761D848206f447Fe2dd461b0c635Ec39EbB27',
		chainId: 1,
		name: 'Aave V3 Pool Configurator',
		labels: ['defi', 'contract'],
		entityId: 'aave',
		riskLevel: 'safe',
		description: 'Aave V3 pool configurator',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3',
		chainId: 1,
		name: 'GHO Token',
		labels: ['token'],
		entityId: 'aave',
		riskLevel: 'safe',
		description: 'Aave GHO stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Morpho ====================
	{
		address: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
		chainId: 1,
		name: 'Morpho Blue',
		labels: ['defi', 'contract'],
		entityId: 'morpho',
		riskLevel: 'safe',
		description: 'Morpho Blue lending protocol',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x777777c9898D384F785Ee44Acfe945efDFf5f3E0',
		chainId: 1,
		name: 'Morpho Aave V3 Optimizer',
		labels: ['defi', 'contract'],
		entityId: 'morpho',
		riskLevel: 'safe',
		description: 'Morpho Aave V3 optimizer',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Pendle ====================
	{
		address: '0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8',
		chainId: 1,
		name: 'Pendle Router',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Pendle router contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x808507121B80c02388fAd14726482e061B8da827',
		chainId: 1,
		name: 'PENDLE Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Pendle governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Convex ====================
	{
		address: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
		chainId: 1,
		name: 'CVX Token',
		labels: ['token'],
		riskLevel: 'safe',
		description: 'Convex Finance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xF403C135812408BFbE8713b5A23a04b3D48AAE31',
		chainId: 1,
		name: 'Convex Booster',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Convex main deposit contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Frax ====================
	{
		address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
		chainId: 1,
		name: 'FRAX Token',
		labels: ['token'],
		entityId: 'frax',
		riskLevel: 'safe',
		description: 'Frax stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
		chainId: 1,
		name: 'FXS Token',
		labels: ['token'],
		entityId: 'frax',
		riskLevel: 'safe',
		description: 'Frax Share token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xac3E018457B222d93114458476f3E3416Abbe38F',
		chainId: 1,
		name: 'sfrxETH',
		labels: ['token'],
		entityId: 'frax',
		riskLevel: 'safe',
		description: 'Staked Frax ETH',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5E8422345238F34275888049021821E8E08CAa1f',
		chainId: 1,
		name: 'frxETH',
		labels: ['token'],
		entityId: 'frax',
		riskLevel: 'safe',
		description: 'Frax Ether',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Yearn ====================
	{
		address: '0x27B5739e22ad9033bcBf192059122d163b60349D',
		chainId: 1,
		name: 'Yearn V3 Factory',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Yearn V3 vault factory',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x444045c5C13C246e117eD36437303cac8E250aB0',
		chainId: 1,
		name: 'Yearn Partner Tracker',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		description: 'Yearn partner tracker',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== EigenLayer ====================
	{
		address: '0x858646372CC42E1A627fcE94aa7A7033e7CF075A',
		chainId: 1,
		name: 'EigenLayer Strategy Manager',
		labels: ['defi', 'contract'],
		entityId: 'eigenlayer',
		riskLevel: 'safe',
		description: 'EigenLayer strategy manager',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A',
		chainId: 1,
		name: 'EigenLayer Delegation Manager',
		labels: ['defi', 'contract'],
		entityId: 'eigenlayer',
		riskLevel: 'safe',
		description: 'EigenLayer delegation manager',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7Fe7E9CC0F274d2435AD5d56D5fa73E47F6A23D8',
		chainId: 1,
		name: 'EigenLayer Slasher',
		labels: ['defi', 'contract'],
		entityId: 'eigenlayer',
		riskLevel: 'safe',
		description: 'EigenLayer slasher contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Maker/Sky ====================
	{
		address: '0x9759A6Ac90977b93B58547b4A71c78317f391A28',
		chainId: 1,
		name: 'DAI Token',
		labels: ['token'],
		entityId: 'makerdao',
		riskLevel: 'safe',
		description: 'DAI stablecoin (MakerDAO)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x35D1b3F3D7966A1DFe207aa4514C12a259A0492B',
		chainId: 1,
		name: 'MakerDAO Vat',
		labels: ['defi', 'contract'],
		entityId: 'makerdao',
		riskLevel: 'safe',
		description: 'MakerDAO core vault engine',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x19c0976f590D67707E62397C87829d896Dc0f1F1',
		chainId: 1,
		name: 'MakerDAO Jug',
		labels: ['defi', 'contract'],
		entityId: 'makerdao',
		riskLevel: 'safe',
		description: 'MakerDAO stability fee collector',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0a3f6849f78076aefaDf113F5BED87720274dDC0',
		chainId: 1,
		name: 'USDS Token',
		labels: ['token'],
		entityId: 'dai',
		riskLevel: 'safe',
		description: 'Sky USD stablecoin',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x56072C95FAA701256059aa122697B133aDEd9279',
		chainId: 1,
		name: 'SKY Token',
		labels: ['token'],
		entityId: 'dai',
		riskLevel: 'safe',
		description: 'Sky governance token (formerly MKR)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Compound V3 ====================
	{
		address: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
		chainId: 1,
		name: 'Compound V3 USDC',
		labels: ['defi', 'contract'],
		entityId: 'compound',
		riskLevel: 'safe',
		description: 'Compound V3 USDC market',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA17581A9E3356d9A858b789D68B4d866e593aE94',
		chainId: 1,
		name: 'Compound V3 WETH',
		labels: ['defi', 'contract'],
		entityId: 'compound',
		riskLevel: 'safe',
		description: 'Compound V3 WETH market',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Spark Protocol ====================
	{
		address: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
		chainId: 1,
		name: 'Spark Pool',
		labels: ['defi', 'contract'],
		entityId: 'spark',
		riskLevel: 'safe',
		description: 'Spark Protocol lending pool',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x02C3eA4e34C0cBd694D2adFa2c690EECbC1793eE',
		chainId: 1,
		name: 'Spark Pool Addresses Provider',
		labels: ['defi', 'contract'],
		entityId: 'spark',
		riskLevel: 'safe',
		description: 'Spark addresses provider',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x83F20F44975D03b1b09e64809B757c47f942BEeA',
		chainId: 1,
		name: 'sDAI Token',
		labels: ['token'],
		entityId: 'spark',
		riskLevel: 'safe',
		description: 'Savings DAI',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

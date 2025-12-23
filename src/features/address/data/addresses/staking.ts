/**
 * Staking and Liquid Staking addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const stakingAddresses: LabeledAddress[] = [
	// ==================== Lido ====================
	{
		address: '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido stETH',
		labels: ['staking', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido wstETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x889edC2eDab5f40e902b864aD4d7AdE8E412F9B1',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido Withdrawal Queue',
		labels: ['staking', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
		chainId: 1,
		entityId: 'lido',
		name: 'Lido DAO Token (LDO)',
		labels: ['token', 'dao'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Rocket Pool ====================
	{
		address: '0xae78736Cd615f374D3085123A210448E74Fc6393',
		chainId: 1,
		entityId: 'rocketpool',
		name: 'Rocket Pool rETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1d8f8f00cfa6758d7bE78336684788Fb0ee0Fa46',
		chainId: 1,
		entityId: 'rocketpool',
		name: 'Rocket Pool Token (RPL)',
		labels: ['token', 'dao'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDD3f50F8A6CafbE9b31a427582963f465E745AF8',
		chainId: 1,
		entityId: 'rocketpool',
		name: 'Rocket Pool Deposit Pool',
		labels: ['staking', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Coinbase cbETH ====================
	{
		address: '0xBe9895146f7AF43049ca1c1AE358B0541Ea49704',
		chainId: 1,
		entityId: 'coinbase',
		name: 'Coinbase Wrapped Staked ETH (cbETH)',
		labels: ['staking', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Frax ETH ====================
	{
		address: '0x5E8422345238F34275888049021821E8E08CAa1f',
		chainId: 1,
		entityId: 'frax',
		name: 'Frax Ether (frxETH)',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xac3E018457B222d93114458476f3E3416Abbe38F',
		chainId: 1,
		entityId: 'frax',
		name: 'Staked Frax Ether (sfrxETH)',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Mantle mETH ====================
	{
		address: '0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
		chainId: 1,
		entityId: 'mantle',
		name: 'Mantle Staked Ether (mETH)',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Swell ====================
	{
		address: '0xf951E335afb289353dc249e82926178EaC7DEd78',
		chainId: 1,
		entityId: 'swell',
		name: 'Swell swETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0',
		chainId: 1,
		entityId: 'swell',
		name: 'Swell rswETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== EigenLayer ====================
	{
		address: '0x858646372CC42E1A627fcE94aa7A7033e7CF075A',
		chainId: 1,
		entityId: 'eigenlayer',
		name: 'EigenLayer Strategy Manager',
		labels: ['staking', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x39053D51B77DC0d36036Fc1fCc8Cb819df8Ef37A',
		chainId: 1,
		entityId: 'eigenlayer',
		name: 'EigenLayer Delegation Manager',
		labels: ['staking', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xec53bF9167f50cDEB3Ae105f56099aaaB9061F83',
		chainId: 1,
		entityId: 'eigenlayer',
		name: 'EIGEN Token',
		labels: ['token', 'dao'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== ether.fi ====================
	{
		address: '0x35fA164735182de50811E8e2E824cFb9B6118ac2',
		chainId: 1,
		entityId: 'etherfi',
		name: 'ether.fi eETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee',
		chainId: 1,
		entityId: 'etherfi',
		name: 'ether.fi weETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x308861A430be4cce5502d0A12724771Fc6DaF216',
		chainId: 1,
		entityId: 'etherfi',
		name: 'ether.fi Liquidity Pool',
		labels: ['staking', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Renzo ====================
	{
		address: '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
		chainId: 1,
		entityId: 'renzo',
		name: 'Renzo ezETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x74a09653A083691711cF8215a6ab074BB4e99ef5',
		chainId: 1,
		entityId: 'renzo',
		name: 'Renzo RestakeManager',
		labels: ['staking', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Kelp DAO ====================
	{
		address: '0xA35b1B31Ce002FBF2058D22F30f95D405200A15b',
		chainId: 1,
		entityId: 'kelp',
		name: 'Kelp rsETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x036676389e48133B63a802f8635AD39E752D375D',
		chainId: 1,
		entityId: 'kelp',
		name: 'Kelp LRT Deposit Pool',
		labels: ['staking', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Puffer Finance ====================
	{
		address: '0xD9A442856C234a39a81a089C06451EBAa4306a72',
		chainId: 1,
		entityId: 'puffer',
		name: 'Puffer pufETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Stader ====================
	{
		address: '0xA35b1B31Ce002FBF2058D22F30f95D405200A15b',
		chainId: 1,
		entityId: 'stader',
		name: 'Stader ETHx',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xf03A7Eb46d01d9EcAA104558C732Cf82f6B6B645',
		chainId: 56,
		entityId: 'stader',
		name: 'Stader BNBx on BSC',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Ankr ====================
	{
		address: '0xE95A203B1a91a908F9B9CE46459d101078c2c3cb',
		chainId: 1,
		entityId: 'ankr',
		name: 'Ankr Staked ETH (ankrETH)',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x52F24a5e03aee338Da5fd9Df68D2b6FAe1178827',
		chainId: 56,
		entityId: 'ankr',
		name: 'Ankr Staked BNB (ankrBNB)',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Binance ====================
	{
		address: '0xa2E3356610840701BDf5611a53974510Ae27E2e1',
		chainId: 56,
		entityId: 'binance',
		name: 'Binance Staked BNB (stkBNB)',
		labels: ['staking', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== StakeWise ====================
	{
		address: '0xFe2e637202056d30016725477c5da089Ab0A043A',
		chainId: 1,
		entityId: 'stakewise',
		name: 'StakeWise sETH2',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x20BC832ca081b91433ff6c17f85701B6e92486c5',
		chainId: 1,
		entityId: 'stakewise',
		name: 'StakeWise rETH2',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Origin Protocol ====================
	{
		address: '0x856c4Efb76C1D1AE02e20CEB03A2A6a08b0b8dC3',
		chainId: 1,
		entityId: 'origin',
		name: 'Origin Ether (OETH)',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xDcEe70654261AF21C44c093C300eD3Bb97b78192',
		chainId: 1,
		entityId: 'origin',
		name: 'Wrapped OETH',
		labels: ['staking', 'defi', 'token'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Ethereum 2.0 Deposit ====================
	{
		address: '0x00000000219ab540356cBB839Cbe05303d7705Fa',
		chainId: 1,
		entityId: 'ethereum',
		name: 'ETH 2.0 Deposit Contract',
		labels: ['staking', 'contract'],
		riskLevel: 'safe',
		description: 'Official Ethereum 2.0 Beacon Chain deposit contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

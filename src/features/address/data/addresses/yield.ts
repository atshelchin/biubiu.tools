/**
 * Yield aggregator and farming protocol addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const yieldAddresses: LabeledAddress[] = [
	// ==================== Yearn Finance ====================
	{
		address: '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e',
		chainId: 1,
		entityId: 'yearn',
		name: 'Yearn Finance Token (YFI)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa354F35829Ae975e850e23e9615b11Da1B3dC4DE',
		chainId: 1,
		entityId: 'yearn',
		name: 'Yearn yvUSDC Vault',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xa258C4606Ca8206D8aA700cE2143D7db854D168c',
		chainId: 1,
		entityId: 'yearn',
		name: 'Yearn yvWETH Vault',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xdA816459F1AB5631232FE5e97a05BBBb94970c95',
		chainId: 1,
		entityId: 'yearn',
		name: 'Yearn yvDAI Vault',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Convex Finance ====================
	{
		address: '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
		chainId: 1,
		entityId: 'convex',
		name: 'Convex Token (CVX)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7',
		chainId: 1,
		entityId: 'convex',
		name: 'Convex cvxCRV',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xF403C135812408BFbE8713b5A23a04b3D48AAE31',
		chainId: 1,
		entityId: 'convex',
		name: 'Convex Booster',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Beefy Finance ====================
	{
		address: '0xCa3F508B8e4Dd382eE878A314789373D80A5190A',
		chainId: 56,
		entityId: 'beefy',
		name: 'Beefy Token (BIFI)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
		chainId: 1,
		entityId: 'beefy',
		name: 'Beefy Token (BIFI) on Ethereum',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Harvest Finance ====================
	{
		address: '0xa0246c9032bC3A600820415aE600c6388619A14D',
		chainId: 1,
		entityId: 'harvest',
		name: 'Harvest Finance Token (FARM)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Idle Finance ====================
	{
		address: '0x875773784Af8135eA0ef43b5a374AaD105c5D39e',
		chainId: 1,
		entityId: 'idle',
		name: 'Idle Finance Token (IDLE)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Pickle Finance ====================
	{
		address: '0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5',
		chainId: 1,
		entityId: 'pickle',
		name: 'Pickle Finance Token (PICKLE)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Pendle ====================
	{
		address: '0x808507121B80c02388fAd14726482e061B8da827',
		chainId: 1,
		entityId: 'pendle',
		name: 'Pendle Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8',
		chainId: 1,
		entityId: 'pendle',
		name: 'Pendle Router',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8',
		chainId: 42161,
		entityId: 'pendle',
		name: 'Pendle Router on Arbitrum',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Sommelier ====================
	{
		address: '0xa670d7237398238DE01267472C6f13e5B8010FD1',
		chainId: 1,
		entityId: 'sommelier',
		name: 'Sommelier Token (SOMM)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Concentrator ====================
	{
		address: '0xb3Ad645dB386D7F6D753B2b9C3F4B853DA6890B8',
		chainId: 1,
		entityId: 'concentrator',
		name: 'Concentrator CTR Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Stake DAO ====================
	{
		address: '0x73968b9a57c6E53d41345FD57a6E6ae27d6CDB2F',
		chainId: 1,
		entityId: 'stakedao',
		name: 'Stake DAO Token (SDT)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Jones DAO ====================
	{
		address: '0x10393c20975cF177a3513071bC110f7962CD67da',
		chainId: 42161,
		entityId: 'jones',
		name: 'Jones DAO Token (JONES)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Tokemak ====================
	{
		address: '0x2e9d63788249371f1DFC918a52f8d799F4a38C94',
		chainId: 1,
		entityId: 'tokemak',
		name: 'Tokemak Token (TOKE)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Badger DAO ====================
	{
		address: '0x3472A5A71965499acd81997a54BBA8D852C6E53d',
		chainId: 1,
		entityId: 'badger',
		name: 'Badger DAO Token (BADGER)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x19D97D8fA813EE2f51aD4B4e04EA08bAf4DFfC28',
		chainId: 1,
		entityId: 'badger',
		name: 'Badger Sett Vault',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Alpaca Finance ====================
	{
		address: '0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F',
		chainId: 56,
		entityId: 'alpaca',
		name: 'Alpaca Finance Token (ALPACA)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== AutoFarm ====================
	{
		address: '0xa184088a740c695E156F91f5cC086a06bb78b827',
		chainId: 56,
		entityId: 'autofarm',
		name: 'AutoFarm Token (AUTO)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Beets (Beethoven X) ====================
	{
		address: '0xF24Bcf4d1e507740041C9cFd2DddB29585aDCe1e',
		chainId: 250,
		entityId: 'beets',
		name: 'Beets Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xfcef8a994209d6916EB2C86cDD2AFD60Aa6F54b1',
		chainId: 10,
		entityId: 'beets',
		name: 'Beets Token on Optimism',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gamma Strategies ====================
	{
		address: '0x6BEa7CFEF803D1e3d5f7C0103f7ded065644e197',
		chainId: 1,
		entityId: 'gamma',
		name: 'Gamma Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Arrakis Finance ====================
	{
		address: '0x162c7BA6A8E40e8De846e3A4B6dF32b4D9fBd67e',
		chainId: 1,
		entityId: 'arrakis',
		name: 'Arrakis V2 Helper',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Yearn V3 ====================
	{
		address: '0x444045c5C13C246e117eD36437303cac8E250aB0',
		chainId: 1,
		entityId: 'yearn',
		name: 'Yearn V3 Vault Factory',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Mean Finance ====================
	{
		address: '0xB5289063370A7fEB234e6a6F95E9a5D6B6B3F8C2',
		chainId: 10,
		entityId: 'mean',
		name: 'Mean Finance Hub',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

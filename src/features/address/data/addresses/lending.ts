/**
 * Lending protocol addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const lendingAddresses: LabeledAddress[] = [
	// ==================== Aave V3 ====================
	{
		address: '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2',
		chainId: 1,
		entityId: 'aave',
		name: 'Aave V3 Pool',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
		chainId: 42161,
		entityId: 'aave',
		name: 'Aave V3 Pool on Arbitrum',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
		chainId: 10,
		entityId: 'aave',
		name: 'Aave V3 Pool on Optimism',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
		chainId: 137,
		entityId: 'aave',
		name: 'Aave V3 Pool on Polygon',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA238Dd80C259a72e81d7e4664a9801593F98d1c5',
		chainId: 8453,
		entityId: 'aave',
		name: 'Aave V3 Pool on Base',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Compound V3 ====================
	{
		address: '0xc3d688B66703497DAA19211EEdff47f25384cdc3',
		chainId: 1,
		entityId: 'compound',
		name: 'Compound V3 cUSDCv3',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA17581A9E3356d9A858b789D68B4d866e593aE94',
		chainId: 1,
		entityId: 'compound',
		name: 'Compound V3 cWETHv3',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x9c4ec768c28520B50860ea7a15bd7213a9fF58bf',
		chainId: 42161,
		entityId: 'compound',
		name: 'Compound V3 cUSDCv3 on Arbitrum',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xb125E6687d4313864e53df431d5425969c15Eb2F',
		chainId: 8453,
		entityId: 'compound',
		name: 'Compound V3 cUSDCv3 on Base',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== MakerDAO / Spark ====================
	{
		address: '0x5f3b5DfEb7B28CDbD7FAba78963EE202a494e2A2',
		chainId: 1,
		entityId: 'makerdao',
		name: 'MakerDAO Vat',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC13e21B648A5Ee794902342038FF3aDAB66BE987',
		chainId: 1,
		entityId: 'spark',
		name: 'Spark Protocol Pool',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Morpho ====================
	{
		address: '0x33333aea097c193e66081E930c33020272b33333',
		chainId: 1,
		entityId: 'morpho',
		name: 'Morpho Aave V3 Optimizer',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb',
		chainId: 1,
		entityId: 'morpho',
		name: 'Morpho Blue',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Radiant Capital ====================
	{
		address: '0xF4B1486DD74D07706052A33d31d7c0AAFD0659E1',
		chainId: 42161,
		entityId: 'unknown',
		name: 'Radiant V2 Lending Pool',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Venus Protocol ====================
	{
		address: '0xfD36E2c2a6789Db23113685031d7F16329158384',
		chainId: 56,
		entityId: 'venus',
		name: 'Venus Comptroller',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x151B1e2635A717bcDc836ECd6FbB62B674FE3E1D',
		chainId: 56,
		entityId: 'venus',
		name: 'Venus vBNB',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Benqi ====================
	{
		address: '0x486Af39519B4Dc9a7fCcd318217352830E8AD9b4',
		chainId: 43114,
		entityId: 'benqi',
		name: 'Benqi Comptroller',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Euler Finance ====================
	{
		address: '0x27182842E098f60e3D576794A5bFFb0777E025d3',
		chainId: 1,
		entityId: 'euler',
		name: 'Euler V1 (Legacy)',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'neutral',
		description: 'V1 was exploited, V2 launched',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Silo Finance ====================
	{
		address: '0x4D919CEcfD4793c0D47866C8d0a02a0950737589',
		chainId: 1,
		entityId: 'silo',
		name: 'Silo Router',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8658047e48CC09161f4152c79155Dac1d710Ff0a',
		chainId: 42161,
		entityId: 'silo',
		name: 'Silo Router on Arbitrum',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Liquity ====================
	{
		address: '0xA39739EF8b0231DbFA0DcdA07d7e29faAbCf4bb2',
		chainId: 1,
		entityId: 'liquity',
		name: 'Liquity TroveManager',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x24179CD81c9e782A4096035f7eC97fB8B783e007',
		chainId: 1,
		entityId: 'liquity',
		name: 'Liquity StabilityPool',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Fraxlend ====================
	{
		address: '0x32467a5fc2d72D21E8DCe990906547A2b012f382',
		chainId: 1,
		entityId: 'frax',
		name: 'Fraxlend Pair Deployer',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Notional Finance ====================
	{
		address: '0x1344A36A1B56144C3Bc62E7757377D288fDE0369',
		chainId: 1,
		entityId: 'notional',
		name: 'Notional V3 Router',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Gearbox ====================
	{
		address: '0xA7eBCE8A89a83a1EdB4a33f77ec8A8b78e3B7c91',
		chainId: 1,
		entityId: 'gearbox',
		name: 'Gearbox V3 Pool USDC',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Alchemix ====================
	{
		address: '0x5C6374a2ac4EBC38DeA0Fc1F8716e5Ea1AdD94dd',
		chainId: 1,
		entityId: 'alchemix',
		name: 'Alchemist V2',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Abracadabra ====================
	{
		address: '0xd96f48665a1410C0cd669A88898ecA36B9Fc2cce',
		chainId: 1,
		entityId: 'unknown',
		name: 'Abracadabra DegenBox',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'neutral',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Fluid (Instadapp) ====================
	{
		address: '0x52Aa899454998Be5b000Ad077a46Bbe360F4e497',
		chainId: 1,
		entityId: 'instadapp',
		name: 'Fluid Liquidity',
		labels: ['lending', 'defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

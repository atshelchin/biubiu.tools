/**
 * Real World Asset (RWA) protocol addresses
 * 数据来源: Official documentation, Etherscan verified
 */

import type { LabeledAddress } from '../../types';

export const rwaAddresses: LabeledAddress[] = [
	// ==================== Ondo Finance ====================
	{
		address: '0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3',
		chainId: 1,
		entityId: 'ondo',
		name: 'ONDO Token',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x96F6eF951840721AdBF46Ac996b59E0235CB985C',
		chainId: 1,
		entityId: 'ondo',
		name: 'USDY (Ondo US Dollar Yield)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x35D8949372D46B7a3D5A56006AE77B215fc69bC0',
		chainId: 1,
		entityId: 'ondo',
		name: 'OUSG (Ondo Short-Term US Gov)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Centrifuge ====================
	{
		address: '0xc221b7E65FfC80DE234bbB6667aBDd46593D34F0',
		chainId: 1,
		entityId: 'centrifuge',
		name: 'Centrifuge Token (CFG)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Maple Finance ====================
	{
		address: '0x33349B282065b0284d756F0577FB39c158F935e6',
		chainId: 1,
		entityId: 'maple',
		name: 'Maple Token (MPL)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x6F6c8013f639979C84b756C7FC1500eB5aF18Dc4',
		chainId: 1,
		entityId: 'maple',
		name: 'Maple Pool Manager',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Goldfinch ====================
	{
		address: '0xdab396cCF3d84Cf2D07C4454e10C8A6F5b008D2b',
		chainId: 1,
		entityId: 'goldfinch',
		name: 'Goldfinch Token (GFI)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8481a6EbAf5c7DABc3F7e09e44A89531fd31F822',
		chainId: 1,
		entityId: 'goldfinch',
		name: 'Goldfinch Senior Pool',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== TrueFi ====================
	{
		address: '0x4C19596f5aAfF459fA38B0f7eD92F11AE6543784',
		chainId: 1,
		entityId: 'truefi',
		name: 'TrueFi Token (TRU)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xA991356d261fbaF194463aF6DF8f0464F8f1c742',
		chainId: 1,
		entityId: 'truefi',
		name: 'TrueFi Pool',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Backed Finance ====================
	{
		address: '0xCA30c93B02514f86d5C86a6e375E3A330B435Fb5',
		chainId: 1,
		entityId: 'backed',
		name: 'bIBTA (Backed IBTA)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x2F123cF3F37CE3328CC9B5b8415f9EC5109b45e7',
		chainId: 1,
		entityId: 'backed',
		name: 'bCSPX (Backed S&P 500)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Matrixdock ====================
	{
		address: '0x530824DA86689C9C17CdC2871Ff29B058345b44a',
		chainId: 1,
		entityId: 'matrixdock',
		name: 'STBT (Short-term Treasury Bill)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== RealT ====================
	{
		address: '0xE5f7ef61443Fc36AE040650aa585B0395AEf77c8',
		chainId: 1,
		entityId: 'realt',
		name: 'RealT Tokenized Properties',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== OpenEden ====================
	{
		address: '0xdd50C053C096CB04A3e3362E2b622529EC5f2e8a',
		chainId: 1,
		entityId: 'openeden',
		name: 'TBILL (T-Bill Token)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Mountain Protocol ====================
	{
		address: '0x59D9356E565Ab3A36dD77763Fc0d87fEaf85508C',
		chainId: 1,
		entityId: 'mountain',
		name: 'USDM (Mountain Protocol USD)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Hashnote ====================
	{
		address: '0x136471a34f6ef19fE571EFFC1CA711fdb8E49f2b',
		chainId: 1,
		entityId: 'hashnote',
		name: 'USYC (US Yield Coin)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Paxos ====================
	{
		address: '0x45804880De22913dAFE09f4980848ECE6EcbAf78',
		chainId: 1,
		entityId: 'paxos',
		name: 'Pax Gold (PAXG)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Tether Gold ====================
	{
		address: '0x68749665FF8D2d112Fa859AA293F07A622782F38',
		chainId: 1,
		entityId: 'tether',
		name: 'Tether Gold (XAUT)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Swarm ====================
	{
		address: '0xBDfC66c6ae41E9bE2f37926B89d57A012F8EBe88',
		chainId: 1,
		entityId: 'swarm',
		name: 'Swarm Token (SMT)',
		labels: ['token', 'defi'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Securitize ====================
	{
		address: '0x1F4cb3E8C3B0EB5BDfBEF29Bdc87a3A8C53d7DD4',
		chainId: 1,
		entityId: 'securitize',
		name: 'Securitize Token Registry',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Tokeny ====================
	{
		address: '0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39',
		chainId: 1,
		entityId: 'tokeny',
		name: 'Tokeny T-REX Registry',
		labels: ['defi', 'contract'],
		riskLevel: 'safe',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

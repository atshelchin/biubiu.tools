/**
 * Infrastructure Addresses - Oracles, indexers, and core infrastructure
 * 数据来源: 官方文档、Etherscan、公开资料
 */

import type { LabeledAddress } from '../../types';

export const infrastructureAddresses: LabeledAddress[] = [
	// ==================== Chainlink ====================
	{
		address: '0x47Fb2585D2C56Fe188D0E6ec628a38b74fCeeeDf',
		chainId: 1,
		name: 'Chainlink: Price Feed Registry',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink price feed registry',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419',
		chainId: 1,
		name: 'Chainlink: ETH/USD Feed',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink ETH/USD price feed',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
		chainId: 1,
		name: 'Chainlink: BTC/USD Feed',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink BTC/USD price feed',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
		chainId: 1,
		name: 'Chainlink: USDC/USD Feed',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink USDC/USD price feed',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
		chainId: 1,
		name: 'Chainlink: USDT/USD Feed',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink USDT/USD price feed',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
		chainId: 1,
		name: 'Chainlink: DAI/USD Feed',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink DAI/USD price feed',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xCc72039A141c6e34a779eF93AEF5eB4C82A893c7',
		chainId: 1,
		name: 'Chainlink: LINK/USD Feed',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink LINK/USD price feed',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x271bf4568fb737cc2e6277e9B1EE0034098cDA2a',
		chainId: 1,
		name: 'Chainlink: VRF Coordinator V2',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink VRF (Verifiable Random Function) V2',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x02777053d6764996e594c3E88AF1D58D5363a2e6',
		chainId: 1,
		name: 'Chainlink: Automation Registry',
		labels: ['contract'],
		entityId: 'chainlink',
		riskLevel: 'safe',
		description: 'Chainlink Automation (Keepers) registry',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== The Graph ====================
	{
		address: '0xF55041E37E12cD407ad00CE2910B8269B01263b9',
		chainId: 1,
		name: 'The Graph: GRT Staking',
		labels: ['contract'],
		entityId: 'thegraph',
		riskLevel: 'safe',
		description: 'The Graph GRT staking contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x8D79F219246fF6C1E0b0bfDAdEB447c3Af94Bb34',
		chainId: 1,
		name: 'The Graph: Curation',
		labels: ['contract'],
		entityId: 'thegraph',
		riskLevel: 'safe',
		description: 'The Graph curation contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xaDcA0dd4729c8BA3aCf3E99F3A9f471EF37b6825',
		chainId: 1,
		name: 'The Graph: Rewards Manager',
		labels: ['contract'],
		entityId: 'thegraph',
		riskLevel: 'safe',
		description: 'The Graph rewards distribution',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== ENS ====================
	{
		address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e',
		chainId: 1,
		name: 'ENS Registry',
		labels: ['contract'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS main registry contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
		chainId: 1,
		name: 'ENS: Public Resolver',
		labels: ['contract'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS public resolver',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x253553366Da8546fC250F225fe3d25d0C782303b',
		chainId: 1,
		name: 'ENS: ETH Registrar Controller',
		labels: ['contract'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS .eth name registrar',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
		chainId: 1,
		name: 'ENS: Base Registrar',
		labels: ['contract', 'nft'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS .eth base registrar (NFT)',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xD4416b13d2b3a9aBae7AcD5D6C2BbDBE25686401',
		chainId: 1,
		name: 'ENS: Name Wrapper',
		labels: ['contract'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS name wrapper for subdomains',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
		chainId: 1,
		name: 'ENS: DAO Token',
		labels: ['token'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
		chainId: 1,
		name: 'ENS Token',
		labels: ['token'],
		entityId: 'ens',
		riskLevel: 'safe',
		description: 'ENS governance token',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Safe (Gnosis Safe) ====================
	{
		address: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
		chainId: 1,
		name: 'Safe Proxy Factory',
		labels: ['contract'],
		entityId: 'safe',
		riskLevel: 'safe',
		description: 'Safe (Gnosis Safe) proxy factory',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xd9Db270c1B5E3Bd161E8c8503c55cEABeE709552',
		chainId: 1,
		name: 'Safe Singleton',
		labels: ['contract'],
		entityId: 'safe',
		riskLevel: 'safe',
		description: 'Safe (Gnosis Safe) master copy',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
		chainId: 1,
		name: 'Safe Fallback Handler',
		labels: ['contract'],
		entityId: 'safe',
		riskLevel: 'safe',
		description: 'Safe fallback handler',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
		chainId: 1,
		name: 'Safe Multi Send',
		labels: ['contract'],
		entityId: 'safe',
		riskLevel: 'safe',
		description: 'Safe batch transaction contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Pyth Network ====================
	{
		address: '0x4305FB66699C3B2702D4d05CF36551390A4c69C6',
		chainId: 1,
		name: 'Pyth Network',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'Pyth oracle contract on Ethereum',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Wormhole ====================
	{
		address: '0x98f3c9e6E3fAce36bAAd05FE09d375Ef1464288B',
		chainId: 1,
		name: 'Wormhole Core Bridge',
		labels: ['bridge', 'contract'],
		entityId: 'wormhole',
		riskLevel: 'safe',
		description: 'Wormhole core contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x3ee18B2214AFF97000D974cf647E7C347E8fa585',
		chainId: 1,
		name: 'Wormhole Token Bridge',
		labels: ['bridge'],
		entityId: 'wormhole',
		riskLevel: 'safe',
		description: 'Wormhole token bridge',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== LayerZero ====================
	{
		address: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
		chainId: 1,
		name: 'LayerZero Endpoint',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'LayerZero V1 endpoint contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x1a44076050125825900e736c501f859c50fE728c',
		chainId: 1,
		name: 'LayerZero Endpoint V2',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'LayerZero V2 endpoint contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Multicall ====================
	{
		address: '0xcA11bde05977b3631167028862bE2a173976CA11',
		chainId: 1,
		name: 'Multicall3',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'Multicall3 contract for batched calls',
		source: 'verified',
		updatedAt: '2024-12-01'
	},
	{
		address: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
		chainId: 1,
		name: 'Multicall2',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'Multicall2 contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== Permit2 ====================
	{
		address: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
		chainId: 1,
		name: 'Permit2',
		labels: ['contract'],
		entityId: 'uniswap',
		riskLevel: 'safe',
		description: 'Uniswap Permit2 contract',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== CREATE2 Deployer ====================
	{
		address: '0x4e59b44847b379578588920cA78FbF26c0B4956C',
		chainId: 1,
		name: 'Deterministic Deployer',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'CREATE2 deployer factory',
		source: 'verified',
		updatedAt: '2024-12-01'
	},

	// ==================== EIP-1167 Minimal Proxy ====================
	{
		address: '0x0000000000FFe8B47B3e2130213B802212439497',
		chainId: 1,
		name: 'Clone Factory',
		labels: ['contract'],
		riskLevel: 'safe',
		description: 'EIP-1167 minimal proxy factory',
		source: 'verified',
		updatedAt: '2024-12-01'
	}
];

/**
 * Contract deployment configurations
 */

import type { Address } from 'viem';
import type {
	ContractDeploymentConfig,
	DeploymentConfigRegistry,
	DeploymentContext
} from '$lib/types/deployment-config';
import {
	createCREATE2ProxyDeployment,
	createCREATE2Deployment
} from '$lib/utils/contract-deployment';

// CREATE2 Proxy deployment configuration
const CREATE2_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'CREATE2 Proxy',
	contractAddress: '0x4e59b44847b379578588920cA78FbF26c0B4956C' as Address,
	description: 'Deterministic deployment proxy for contract creation',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/Arachnid/deterministic-deployment-proxy',

	// CREATE2 specific bytecode and deployment tx
	bytecode:
		'0x604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3',

	deployFunction: async (context: DeploymentContext) => {
		return createCREATE2ProxyDeployment(context, context.t);
	}
};

// Multicall3 deployment configuration
const MULTICALL3_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'Multicall3',
	contractAddress: '0x2055A30B00555e7cAd48b1756eac4f917781489b' as Address,
	description: 'Multicall3 contract for batching multiple calls',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/mds1/multicall',

	// Note: This is a placeholder bytecode. The actual Multicall3 bytecode should be:
	// 1. Obtained from the official mds1/multicall repository
	// 2. Compiled with Solidity 0.8.12, optimizer enabled with 10,000,000 runs
	// 3. No constructor arguments are needed
	// The bytecode shown below is incomplete and needs to be replaced with the full deployment bytecode
	bytecode:
		'0x608060405234801561001057600080fd5b50610ee0806100206000396000f3fe6080604052600436106100f35760003560e01c80634d2301cc1161008a578063a8b0574e11610059578063a8b0574e1461025a578063bce38bd714610275578063c3077fa914610288578063ee82ac5e1461029b57600080fd5b80634d2301cc146101ec57806372425d9d1461022157806382ad56cb1461023457806386d516e81461024757600080fd5b80633408e470116100c65780633408e47014610191578063399542e9146101a45780633e64a696146101c657806342cbb15c146101d957600080fd5b80630f28c97d146100f8578063174dea711461011a578063252dba421461013a57806327e86d6e1461015b575b600080fd5b34801561010457600080fd5b50425b6040519081526020015b60405180910390f35b61012d610128366004610a85565b6102ba565b6040516101119190610bbe565b61014d610148366004610a85565b6104ef565b604051610111929190610bd8565b34801561016757600080fd5b50437fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0140610107565b34801561019d57600080fd5b5046610107565b6101b76101b2366004610c60565b610690565b60405161011193929190610cba565b3480156101d257600080fd5b5048610107565b3480156101e557600080fd5b5043610107565b3480156101f857600080fd5b50610107610207366004610ce2565b73ffffffffffffffffffffffffffffffffffffffff163190565b34801561022d57600080fd5b5044610107565b61012d610242366004610a85565b6106ab565b34801561025357600080fd5b5045610107565b34801561026657600080fd5b50604051418152602001610111565b61012d610283366004610c60565b61085a565b6101b7610296366004610a85565b610a1a565b3480156102a757600080fd5b506101076102b6366004610d18565b4090565b60606000828067ffffffffffffffff8111156102d8576102d8610d31565b60405190808252806020026020018201604052801561031e57816020015b6040805180820190915260008152606060208201528152602001906001900390816102f65790505b5092503660005b8281101561047757600085828151811061034157610341610d60565b6020026020010151905087878381811061035d5761035d610d60565b905060200281019061036f9190610d8f565b6040810135958601959093506103886020850185610ce2565b73ffffffffffffffffffffffffffffffffffffffff16816103ac6060870187610dcd565b6040516103ba929190610e32565b60006040518083038185875af1925050503d80600081146103f7576040519150601f19603f3d011682016040523d82523d6000602084013e6103fc565b606091505b50602080850191909152901515808452908501351761046d577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260846000fd5b5050600101610325565b508234146104e6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601a60248201527f4d756c746963616c6c333a2076616c7565206d69736d6174636800000000000060448201526064015b60405180910390fd5b50505092915050565b436060828067ffffffffffffffff81111561050c5761050c610d31565b60405190808252806020026020018201604052801561053f57816020015b606081526020019060019003908161052a5790505b5091503660005b8281101561068657600087878381811061056257610562610d60565b90506020028101906105749190610e42565b92506105836020840184610ce2565b73ffffffffffffffffffffffffffffffffffffffff166105a66020850185610dcd565b6040516105b4929190610e32565b6000604051808303816000865af19150503d80600081146105f1576040519150601f19603f3d011682016040523d82523d6000602084013e6105f6565b606091505b5086848151811061060957610609610d60565b602090810291909101015290508061067d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b50600101610546565b5050509250929050565b43804060606106a086868661085a565b905093509350939050565b6060818067ffffffffffffffff8111156106c7576106c7610d31565b60405190808252806020026020018201604052801561070d57816020015b6040805180820190915260008152606060208201528152602001906001900390816106e55790505b5091503660005b828110156104e657600084828151811061073057610730610d60565b6020026020010151905086868381811061074c5761074c610d60565b905060200281019061075e9190610e76565b925061076d6020840184610ce2565b73ffffffffffffffffffffffffffffffffffffffff166107906040850185610dcd565b60405161079e929190610e32565b6000604051808303816000865af19150503d80600081146107db576040519150601f19603f3d011682016040523d82523d6000602084013e6107e0565b606091505b506020808401919091529015158083529084013517610851577f08c379a000000000000000000000000000000000000000000000000000000000600052602060045260176024527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060445260646000fd5b50600101610714565b6060818067ffffffffffffffff81111561087657610876610d31565b6040519080825280602002602001820160405280156108bc57816020015b6040805180820190915260008152606060208201528152602001906001900390816108945790505b5091503660005b82811015610a105760008482815181106108df576108df610d60565b602002602001015190508686838181106108fb576108fb610d60565b905060200281019061090d9190610e42565b925061091c6020840184610ce2565b73ffffffffffffffffffffffffffffffffffffffff1661093f6020850185610dcd565b60405161094d929190610e32565b6000604051808303816000865af19150503d806000811461098a576040519150601f19603f3d011682016040523d82523d6000602084013e61098f565b606091505b506020830152151581528715610a07578051610a07576040517f08c379a000000000000000000000000000000000000000000000000000000000815260206004820152601760248201527f4d756c746963616c6c333a2063616c6c206661696c656400000000000000000060448201526064016104dd565b506001016108c3565b5050509392505050565b6000806060610a2b60018686610690565b919790965090945092505050565b60008083601f840112610a4b57600080fd5b50813567ffffffffffffffff811115610a6357600080fd5b6020830191508360208260051b8501011115610a7e57600080fd5b9250929050565b60008060208385031215610a9857600080fd5b823567ffffffffffffffff811115610aaf57600080fd5b610abb85828601610a39565b90969095509350505050565b6000815180845260005b81811015610aed57602081850181015186830182015201610ad1565b81811115610aff576000602083870101525b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b600082825180855260208086019550808260051b84010181860160005b84811015610bb1578583037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe001895281518051151584528401516040858501819052610b9d81860183610ac7565b9a86019a9450505090830190600101610b4f565b5090979650505050505050565b602081526000610bd16020830184610b32565b9392505050565b600060408201848352602060408185015281855180845260608601915060608160051b870101935082870160005b82811015610c52577fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa0888703018452610c40868351610ac7565b95509284019290840190600101610c06565b509398975050505050505050565b600080600060408486031215610c7557600080fd5b83358015158114610c8557600080fd5b9250602084013567ffffffffffffffff811115610ca157600080fd5b610cad86828701610a39565b9497909650939450505050565b838152826020820152606060408201526000610cd96060830184610b32565b95945050505050565b600060208284031215610cf457600080fd5b813573ffffffffffffffffffffffffffffffffffffffff81168114610bd157600080fd5b600060208284031215610d2a57600080fd5b5035919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81833603018112610dc357600080fd5b9190910192915050565b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe1843603018112610e0257600080fd5b83018035915067ffffffffffffffff821115610e1d57600080fd5b602001915036819003821315610a7e57600080fd5b8183823760009101908152919050565b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffc1833603018112610dc357600080fd5b600082357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffa1833603018112610dc357600080fdfea2646970667358221220bb2b5c71a328032f97c676ae39a1ec2148d3e5d6f73d95e9b17910152d61f16264736f6c634300080c0033' as `0x${string}`,

	// Constructor args for Multicall3 (none needed)
	constructorArgs: [],

	deployFunction: async (context: DeploymentContext) => {
		return createCREATE2Deployment(
			context,
			MULTICALL3_DEPLOYMENT_CONFIG.bytecode!,
			{ contractName: 'Multicall3' },
			context.t
		);
	}
};

// BiuBiuPremium deployment configuration
const BIUBIU_PREMIUM_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'BiuBiuPremium',
	contractAddress: '0x61Ae52Bb677847853DB30091ccc32d9b68878B71' as Address,
	description: 'Premium membership management contract',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',

	// BiuBiuPremium bytecode - loaded dynamically from /contracts/BiuBiuPremium.json
	bytecode: undefined, // Will be loaded dynamically from /contracts/BiuBiuPremium.json

	// No constructor arguments needed
	constructorArgs: [],

	deployFunction: async (context: DeploymentContext) => {
		// Load bytecode from BiuBiuPremium.json
		const response = await fetch('/contracts/BiuBiuPremium.json');
		const data = await response.json();
		const bytecode = data.bytecode.object as `0x${string}`;

		return createCREATE2Deployment(context, bytecode, { contractName: 'BiuBiuPremium' }, context.t);
	}
};

// TokenSweep deployment configuration
const wallet_sweep_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'TokenSweep',
	contractAddress: '0x34bb5CE9B48bEb31ed3763e80DD0d93cb7C8842b' as Address,
	description: 'Batch token transfer contract with premium membership integration',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',

	// TokenSweep bytecode - loaded dynamically from /contracts/TokenSweep.json
	bytecode: undefined, // Will be loaded dynamically from /contracts/TokenSweep.json

	// No constructor arguments needed
	constructorArgs: [],

	deployFunction: async (context: DeploymentContext) => {
		// Load bytecode from TokenSweep.json
		const response = await fetch('/contracts/TokenSweep.json');
		const data = await response.json();
		const bytecode = data.bytecode.object as `0x${string}`;

		return createCREATE2Deployment(
			context,
			bytecode,
			{ contractName: 'TokenSweep', gasLimit: BigInt(5000000) },
			context.t
		);
	}
};

// TokenFactory deployment configuration
const TOKEN_FACTORY_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'TokenFactory',
	contractAddress: '0xe731602Ff2C355Ca0e6CE68932AFaA6ff973aE79' as Address,
	description: 'ERC20 token deployment factory with CREATE2 support',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',

	// TokenFactory bytecode - from https://github.com/atshelchin/biubiu-contracts commit aa6c1a0
	// Loaded from static/contracts/TokenFactory.json
	bytecode: undefined, // Will be loaded dynamically from /contracts/TokenFactory.json

	// No constructor arguments needed
	constructorArgs: [],

	deployFunction: async (context: DeploymentContext) => {
		// Load bytecode from TokenFactory.json
		const response = await fetch('/contracts/TokenFactory.json');
		const data = await response.json();
		const bytecode = data.bytecode.object as `0x${string}`;

		return createCREATE2Deployment(
			context,
			bytecode,
			{ contractName: 'TokenFactory', gasLimit: BigInt(10000000) },
			context.t
		);
	}
};

// NFTMetadata deployment configuration (required before NFTFactory)
const NFT_METADATA_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'NFTMetadata',
	contractAddress: '0xF68B52ceEAFb4eDB2320E44Efa0be2EBe7a715A6' as Address,
	description: 'On-chain NFT metadata library used by NFTFactory',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',

	// NFTMetadata bytecode - loaded dynamically from /contracts/NFTMetadata.json
	bytecode: undefined, // Will be loaded dynamically from /contracts/NFTMetadata.json

	// No constructor arguments needed
	constructorArgs: [],

	deployFunction: async (context: DeploymentContext) => {
		// Load bytecode from NFTMetadata.json
		const response = await fetch('/contracts/NFTMetadata.json');
		const data = await response.json();
		const bytecode = data.bytecode.object as `0x${string}`;

		return createCREATE2Deployment(
			context,
			bytecode,
			{ contractName: 'NFTMetadata', gasLimit: BigInt(10000000) },
			context.t
		);
	}
};

// NFTFactory deployment configuration
const NFT_FACTORY_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'NFTFactory',
	contractAddress: '0x917e63eD2FA8BF71d11BAF6cAdcaC65098a68499' as Address,
	description: 'ERC721 NFT deployment factory with stake-to-mint support',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',

	// NFTFactory bytecode - from https://github.com/atshelchin/biubiu-contracts
	// Loaded from static/contracts/NFTFactory.json
	bytecode: undefined, // Will be loaded dynamically from /contracts/NFTFactory.json

	// No constructor arguments needed
	constructorArgs: [],

	deployFunction: async (context: DeploymentContext) => {
		// Load bytecode from NFTFactory.json
		const response = await fetch('/contracts/NFTFactory.json');
		const data = await response.json();
		const bytecode = data.bytecode.object as `0x${string}`;

		return createCREATE2Deployment(
			context,
			bytecode,
			{ contractName: 'NFTFactory', gasLimit: BigInt(10000000) },
			context.t
		);
	}
};

// WETH deployment configuration
const WETH_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'WETH',
	contractAddress: '0xFe7291380b8Dc405fEf345222f2De2408A6CA18e' as Address,
	description: 'Wrapped ETH for TokenDistribution delegated mode',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',

	// WETH bytecode - from https://github.com/atshelchin/biubiu-contracts commit 8212ca1
	// Loaded from static/contracts/WETH.json
	bytecode: undefined, // Will be loaded dynamically from /contracts/WETH.json

	// No constructor arguments needed
	constructorArgs: [],

	deployFunction: async (context: DeploymentContext) => {
		// Load bytecode from WETH.json
		const response = await fetch('/contracts/WETH.json');
		const data = await response.json();
		const bytecode = data.bytecode.object as `0x${string}`;

		return createCREATE2Deployment(
			context,
			bytecode,
			{ contractName: 'WETH', gasLimit: BigInt(5000000) },
			context.t
		);
	}
};

// TokenDistribution deployment configuration
const TOKEN_DISTRIBUTION_DEPLOYMENT_CONFIG: ContractDeploymentConfig = {
	contractName: 'TokenDistribution',
	contractAddress: '0x57A2dB6B6cf17a1b9B7F1B9e269e88A180291221' as Address,
	description: 'Batch distribute tokens/NFTs to multiple recipients',
	canDeploy: true,
	deployGuideUrl: 'https://github.com/atshelchin/biubiu-contracts',

	// TokenDistribution bytecode - from https://github.com/atshelchin/biubiu-contracts commit 8212ca1
	// Loaded from static/contracts/TokenDistribution.json
	bytecode: undefined, // Will be loaded dynamically from /contracts/TokenDistribution.json

	// No constructor arguments needed
	constructorArgs: [],

	deployFunction: async (context: DeploymentContext) => {
		// Load bytecode from TokenDistribution.json
		const response = await fetch('/contracts/TokenDistribution.json');
		const data = await response.json();
		const bytecode = data.bytecode.object as `0x${string}`;

		return createCREATE2Deployment(
			context,
			bytecode,
			{ contractName: 'TokenDistribution', gasLimit: BigInt(10000000) },
			context.t
		);
	}
};

/**
 * Deployment configuration registry
 * Maps contract addresses to their deployment configs
 */
export const DEPLOYMENT_CONFIGS: DeploymentConfigRegistry = {
	[CREATE2_DEPLOYMENT_CONFIG.contractAddress]: CREATE2_DEPLOYMENT_CONFIG,
	[MULTICALL3_DEPLOYMENT_CONFIG.contractAddress]: MULTICALL3_DEPLOYMENT_CONFIG,
	[BIUBIU_PREMIUM_DEPLOYMENT_CONFIG.contractAddress]: BIUBIU_PREMIUM_DEPLOYMENT_CONFIG,
	[wallet_sweep_DEPLOYMENT_CONFIG.contractAddress]: wallet_sweep_DEPLOYMENT_CONFIG,
	[TOKEN_FACTORY_DEPLOYMENT_CONFIG.contractAddress]: TOKEN_FACTORY_DEPLOYMENT_CONFIG,
	[NFT_METADATA_DEPLOYMENT_CONFIG.contractAddress]: NFT_METADATA_DEPLOYMENT_CONFIG,
	[NFT_FACTORY_DEPLOYMENT_CONFIG.contractAddress]: NFT_FACTORY_DEPLOYMENT_CONFIG,
	[WETH_DEPLOYMENT_CONFIG.contractAddress]: WETH_DEPLOYMENT_CONFIG,
	[TOKEN_DISTRIBUTION_DEPLOYMENT_CONFIG.contractAddress]: TOKEN_DISTRIBUTION_DEPLOYMENT_CONFIG
};

/**
 * Get deployment config for a contract address
 */
export function getDeploymentConfig(address: Address): ContractDeploymentConfig | undefined {
	return DEPLOYMENT_CONFIGS[address];
}

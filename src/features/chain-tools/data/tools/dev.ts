/**
 * Dev Tools - Development frameworks, libraries, and infrastructure
 */
import {
	Terminal,
	Link2,
	FileCode,
	Cpu,
	Code,
	BookOpen,
	Hash,
	Globe,
	Database,
	Zap,
	Box,
	Wallet,
	Rocket,
	Sparkles,
	FileSearch,
	Braces
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const devTools: ExternalTool[] = [
	// ========== BiuBiu Internal Tools ==========
	{
		id: 'biubiu-contract-deployer',
		name: 'Contract Deployer',
		descriptionKey: 'chain-tools.dev.tools.biubiu_contract_deployer.description',
		url: '/apps/contract-deployer',
		icon: Rocket,
		category: 'dev',
		tags: ['deploy', 'create2', 'deterministic', 'smart-contract', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#F59E0B'
	},
	{
		id: 'biubiu-token-deployer',
		name: 'Token Deployer',
		descriptionKey: 'chain-tools.dev.tools.biubiu_token_deployer.description',
		url: '/apps/token-deployer',
		icon: Sparkles,
		category: 'dev',
		tags: ['erc20', 'token', 'deploy', 'create', 'biubiu'],
		chains: ['Ethereum', 'Polygon', 'BSC', 'Base', 'Arbitrum'],
		color: '#10B981'
	},
	{
		id: 'biubiu-events-scanner',
		name: 'Events Scanner',
		descriptionKey: 'chain-tools.dev.tools.biubiu_events_scanner.description',
		url: '/apps/contract-events-scanner',
		icon: FileSearch,
		category: 'dev',
		tags: ['events', 'logs', 'scanner', 'smart-contract', 'biubiu'],
		color: '#A855F7'
	},
	{
		id: 'biubiu-chainlist',
		name: 'Chainlist',
		descriptionKey: 'chain-tools.dev.tools.biubiu_chainlist.description',
		url: '/apps/chainlist',
		icon: Globe,
		category: 'dev',
		tags: ['chains', 'rpc', 'networks', 'add-network', 'biubiu'],
		color: '#6366F1'
	},

	// ========== Development Frameworks ==========
	{
		id: 'tenderly',
		name: 'Tenderly',
		descriptionKey: 'chain-tools.dev.tools.tenderly.description',
		url: 'https://tenderly.co',
		icon: Terminal,
		category: 'dev',
		tags: ['debugging', 'simulation', 'monitoring', 'devtools'],
		color: '#6366F1'
	},
	{
		id: 'chainlist',
		name: 'Chainlist',
		descriptionKey: 'chain-tools.dev.tools.chainlist.description',
		url: 'https://chainlist.org',
		icon: Link2,
		category: 'dev',
		tags: ['rpc', 'networks', 'chains', 'add-network'],
		color: '#3B82F6'
	},
	{
		id: 'remix',
		name: 'Remix IDE',
		descriptionKey: 'chain-tools.dev.tools.remix.description',
		url: 'https://remix.ethereum.org',
		icon: FileCode,
		category: 'dev',
		tags: ['ide', 'solidity', 'development', 'compile', 'deploy'],
		color: '#5A60FF'
	},
	{
		id: 'foundry',
		name: 'Foundry',
		descriptionKey: 'chain-tools.dev.tools.foundry.description',
		url: 'https://getfoundry.sh',
		icon: Terminal,
		category: 'dev',
		tags: ['framework', 'testing', 'solidity', 'forge'],
		color: '#000000'
	},
	{
		id: 'hardhat',
		name: 'Hardhat',
		descriptionKey: 'chain-tools.dev.tools.hardhat.description',
		url: 'https://hardhat.org',
		icon: Cpu,
		category: 'dev',
		tags: ['framework', 'testing', 'development', 'ethereum'],
		color: '#FFF100',
		isFeatured: true
	},

	// ========== Contract Utilities ==========
	{
		id: 'abi-ninja',
		name: 'ABI Ninja',
		descriptionKey: 'chain-tools.dev.tools.abi_ninja.description',
		url: 'https://abi.ninja',
		icon: Braces,
		category: 'dev',
		tags: ['abi', 'interact', 'contracts', 'read-write'],
		color: '#10B981'
	},
	{
		id: 'ethereum-signature-db',
		name: '4byte.directory',
		descriptionKey: 'chain-tools.dev.tools.4byte.description',
		url: 'https://www.4byte.directory',
		icon: Hash,
		category: 'dev',
		tags: ['signature', 'selector', 'decoder', 'lookup'],
		color: '#6B7280'
	},

	// ========== Libraries & SDKs ==========
	{
		id: 'ethers-js',
		name: 'Ethers.js',
		descriptionKey: 'chain-tools.dev.tools.ethers.description',
		url: 'https://ethers.org',
		icon: Code,
		category: 'dev',
		tags: ['library', 'javascript', 'web3', 'sdk'],
		color: '#3C3C3D'
	},
	{
		id: 'viem',
		name: 'Viem',
		descriptionKey: 'chain-tools.dev.tools.viem.description',
		url: 'https://viem.sh',
		icon: Code,
		category: 'dev',
		tags: ['library', 'typescript', 'lightweight', 'sdk'],
		color: '#1E1E1E'
	},
	{
		id: 'wagmi',
		name: 'Wagmi',
		descriptionKey: 'chain-tools.dev.tools.wagmi.description',
		url: 'https://wagmi.sh',
		icon: Code,
		category: 'dev',
		tags: ['react', 'hooks', 'web3', 'frontend'],
		color: '#1E1E1E'
	},
	{
		id: 'rainbowkit',
		name: 'RainbowKit',
		descriptionKey: 'chain-tools.dev.tools.rainbowkit.description',
		url: 'https://www.rainbowkit.com',
		icon: Wallet,
		category: 'dev',
		tags: ['wallet', 'connect', 'react', 'ui'],
		color: '#FF4BA6'
	},
	{
		id: 'web3modal',
		name: 'Web3Modal',
		descriptionKey: 'chain-tools.dev.tools.web3modal.description',
		url: 'https://web3modal.com',
		icon: Wallet,
		category: 'dev',
		tags: ['wallet', 'connect', 'walletconnect', 'ui'],
		color: '#3B99FC'
	},
	{
		id: 'thirdweb',
		name: 'thirdweb',
		descriptionKey: 'chain-tools.dev.tools.thirdweb.description',
		url: 'https://thirdweb.com',
		icon: Box,
		category: 'dev',
		tags: ['sdk', 'contracts', 'deploy', 'dashboard'],
		color: '#F213A4'
	},

	// ========== Node Providers ==========
	{
		id: 'alchemy',
		name: 'Alchemy',
		descriptionKey: 'chain-tools.dev.tools.alchemy.description',
		url: 'https://www.alchemy.com',
		icon: Cpu,
		category: 'dev',
		tags: ['rpc', 'api', 'node', 'infrastructure'],
		color: '#4F46E5',
		isFeatured: true
	},
	{
		id: 'infura',
		name: 'Infura',
		descriptionKey: 'chain-tools.dev.tools.infura.description',
		url: 'https://www.infura.io',
		icon: Globe,
		category: 'dev',
		tags: ['rpc', 'api', 'node', 'infrastructure'],
		color: '#FF6B4A',
		isFeatured: true
	},
	{
		id: 'quicknode',
		name: 'QuickNode',
		descriptionKey: 'chain-tools.dev.tools.quicknode.description',
		url: 'https://www.quicknode.com',
		icon: Zap,
		category: 'dev',
		tags: ['rpc', 'api', 'node', 'multi-chain'],
		color: '#007FFF'
	},

	// ========== Documentation & Learning ==========
	{
		id: 'solidity-lang',
		name: 'Solidity Docs',
		descriptionKey: 'chain-tools.dev.tools.solidity.description',
		url: 'https://soliditylang.org',
		icon: BookOpen,
		category: 'dev',
		tags: ['documentation', 'solidity', 'language'],
		color: '#363636'
	},
	{
		id: 'evm-codes',
		name: 'EVM Codes',
		descriptionKey: 'chain-tools.dev.tools.evm_codes.description',
		url: 'https://www.evm.codes',
		icon: Hash,
		category: 'dev',
		tags: ['opcodes', 'evm', 'reference', 'playground'],
		color: '#627EEA'
	},
	{
		id: 'sourcify',
		name: 'Sourcify',
		descriptionKey: 'chain-tools.dev.tools.sourcify.description',
		url: 'https://sourcify.dev',
		icon: FileCode,
		category: 'dev',
		tags: ['verification', 'source-code', 'decentralized'],
		color: '#00B27D'
	},

	// ========== Oracles ==========
	{
		id: 'chainlink',
		name: 'Chainlink',
		descriptionKey: 'chain-tools.dev.tools.chainlink.description',
		url: 'https://chain.link',
		icon: Link2,
		category: 'dev',
		tags: ['oracle', 'price-feeds', 'vrf', 'automation'],
		color: '#375BD2',
		isFeatured: true
	},
	{
		id: 'pyth',
		name: 'Pyth Network',
		descriptionKey: 'chain-tools.dev.tools.pyth.description',
		url: 'https://pyth.network',
		icon: Zap,
		category: 'dev',
		tags: ['oracle', 'price-feeds', 'real-time'],
		color: '#E6DAFE'
	},

	// ========== Indexers ==========
	{
		id: 'the-graph',
		name: 'The Graph',
		descriptionKey: 'chain-tools.dev.tools.the_graph.description',
		url: 'https://thegraph.com',
		icon: Database,
		category: 'dev',
		tags: ['indexer', 'subgraph', 'graphql', 'query'],
		color: '#6747ED'
	},
	{
		id: 'goldsky',
		name: 'Goldsky',
		descriptionKey: 'chain-tools.dev.tools.goldsky.description',
		url: 'https://goldsky.com',
		icon: Database,
		category: 'dev',
		tags: ['indexer', 'subgraph', 'real-time', 'streaming'],
		color: '#FFD700'
	},
	{
		id: 'envio',
		name: 'Envio',
		descriptionKey: 'chain-tools.dev.tools.envio.description',
		url: 'https://envio.dev',
		icon: Database,
		category: 'dev',
		tags: ['indexer', 'hypersync', 'fast', 'typescript'],
		color: '#FF6B35'
	},

	// ========== APIs & Data ==========
	{
		id: 'moralis',
		name: 'Moralis',
		descriptionKey: 'chain-tools.dev.tools.moralis.description',
		url: 'https://moralis.io',
		icon: Cpu,
		category: 'dev',
		tags: ['api', 'sdk', 'nft', 'defi', 'streams'],
		color: '#00C2FF'
	},
	{
		id: 'covalent',
		name: 'Covalent',
		descriptionKey: 'chain-tools.dev.tools.covalent.description',
		url: 'https://www.covalenthq.com',
		icon: Database,
		category: 'dev',
		tags: ['api', 'data', 'multi-chain', 'unified'],
		color: '#FF4C8B'
	},
	{
		id: 'transpose',
		name: 'Transpose',
		descriptionKey: 'chain-tools.dev.tools.transpose.description',
		url: 'https://www.transpose.io',
		icon: Database,
		category: 'dev',
		tags: ['api', 'sql', 'real-time', 'nft'],
		color: '#5046E5'
	},
	{
		id: 'chainbase',
		name: 'Chainbase',
		descriptionKey: 'chain-tools.dev.tools.chainbase.description',
		url: 'https://chainbase.com',
		icon: Database,
		category: 'dev',
		tags: ['data', 'api', 'multi-chain', 'sync'],
		color: '#0066FF'
	},

	// ========== Learning Platforms ==========
	{
		id: 'scaffold-eth',
		name: 'Scaffold-ETH',
		descriptionKey: 'chain-tools.dev.tools.scaffold_eth.description',
		url: 'https://scaffoldeth.io',
		icon: Terminal,
		category: 'dev',
		tags: ['framework', 'starter-kit', 'rapid', 'prototyping'],
		color: '#10B981'
	},
	{
		id: 'create-eth-app',
		name: 'Create Eth App',
		descriptionKey: 'chain-tools.dev.tools.create_eth_app.description',
		url: 'https://github.com/WalletConnect/create-eth-app',
		icon: Terminal,
		category: 'dev',
		tags: ['cli', 'boilerplate', 'react', 'starter'],
		color: '#000000'
	},
	{
		id: 'cookbook-dev',
		name: 'Cookbook.dev',
		descriptionKey: 'chain-tools.dev.tools.cookbook_dev.description',
		url: 'https://www.cookbook.dev',
		icon: BookOpen,
		category: 'dev',
		tags: ['contracts', 'templates', 'search', 'registry'],
		color: '#8B5CF6'
	},
	{
		id: 'solidity-by-example',
		name: 'Solidity by Example',
		descriptionKey: 'chain-tools.dev.tools.solidity_by_example.description',
		url: 'https://solidity-by-example.org',
		icon: BookOpen,
		category: 'dev',
		tags: ['learning', 'examples', 'solidity', 'tutorials'],
		color: '#363636'
	},
	{
		id: 'speedrun-ethereum',
		name: 'SpeedRunEthereum',
		descriptionKey: 'chain-tools.dev.tools.speedrun_ethereum.description',
		url: 'https://speedrunethereum.com',
		icon: Zap,
		category: 'dev',
		tags: ['learning', 'challenges', 'solidity', 'quests'],
		color: '#EF4444'
	},
	{
		id: 'eth-build',
		name: 'ETH.Build',
		descriptionKey: 'chain-tools.dev.tools.eth_build.description',
		url: 'https://eth.build',
		icon: Braces,
		category: 'dev',
		tags: ['visual', 'sandbox', 'learning', 'education'],
		color: '#6366F1'
	},
	{
		id: 'crypto-zombies',
		name: 'CryptoZombies',
		descriptionKey: 'chain-tools.dev.tools.crypto_zombies.description',
		url: 'https://cryptozombies.io',
		icon: BookOpen,
		category: 'dev',
		tags: ['learning', 'game', 'solidity', 'tutorials'],
		color: '#14B8A6'
	},
	{
		id: 'useweb3',
		name: 'useWeb3',
		descriptionKey: 'chain-tools.dev.tools.useweb3.description',
		url: 'https://www.useweb3.xyz',
		icon: BookOpen,
		category: 'dev',
		tags: ['resources', 'learning', 'curated', 'tutorials'],
		color: '#0052FF'
	},
	{
		id: 'buildspace',
		name: 'Buildspace',
		descriptionKey: 'chain-tools.dev.tools.buildspace.description',
		url: 'https://buildspace.so',
		icon: Rocket,
		category: 'dev',
		tags: ['learning', 'projects', 'community', 'web3'],
		color: '#8B5CF6'
	},
	{
		id: 'pointer',
		name: 'Pointer',
		descriptionKey: 'chain-tools.dev.tools.pointer.description',
		url: 'https://www.pointer.gg',
		icon: BookOpen,
		category: 'dev',
		tags: ['learning', 'tutorials', 'earn', 'coding'],
		color: '#6366F1'
	},

	// ========== IDEs ==========
	{
		id: 'chainide',
		name: 'ChainIDE',
		descriptionKey: 'chain-tools.dev.tools.chainide.description',
		url: 'https://chainide.com',
		icon: Code,
		category: 'dev',
		tags: ['ide', 'multi-chain', 'development', 'cloud'],
		color: '#3B82F6'
	},
	{
		id: 'atlas-ide',
		name: 'Atlas',
		descriptionKey: 'chain-tools.dev.tools.atlas_ide.description',
		url: 'https://www.atlaszk.com',
		icon: Code,
		category: 'dev',
		tags: ['ide', 'zk', 'development', 'cloud'],
		color: '#000000'
	},
	{
		id: 'constructor',
		name: 'Constructor',
		descriptionKey: 'chain-tools.dev.tools.constructor.description',
		url: 'https://constructor.tech',
		icon: Code,
		category: 'dev',
		tags: ['no-code', 'smart-contract', 'builder', 'visual'],
		color: '#6366F1'
	},
	{
		id: 'bunzz',
		name: 'Bunzz',
		descriptionKey: 'chain-tools.dev.tools.bunzz.description',
		url: 'https://bunzz.dev',
		icon: Code,
		category: 'dev',
		tags: ['no-code', 'smart-contract', 'deployment', 'modules'],
		color: '#FFD700'
	},

	// ========== NFT & Payment APIs ==========
	{
		id: 'crossmint',
		name: 'Crossmint',
		descriptionKey: 'chain-tools.dev.tools.crossmint.description',
		url: 'https://crossmint.com',
		icon: Wallet,
		category: 'dev',
		tags: ['nft', 'api', 'fiat', 'minting'],
		chains: ['Ethereum', 'Polygon', 'Solana'],
		color: '#22C55E'
	},
	{
		id: 'paper-xyz',
		name: 'Paper',
		descriptionKey: 'chain-tools.dev.tools.paper_xyz.description',
		url: 'https://paper.xyz',
		icon: Wallet,
		category: 'dev',
		tags: ['nft', 'checkout', 'fiat', 'minting'],
		chains: ['Ethereum', 'Polygon', 'Avalanche'],
		color: '#000000'
	},

	// ========== Smart Contract Languages ==========
	{
		id: 'brownie',
		name: 'Brownie',
		descriptionKey: 'chain-tools.dev.tools.brownie.description',
		url: 'https://eth-brownie.readthedocs.io',
		icon: Code,
		category: 'dev',
		tags: ['framework', 'python', 'testing'],
		color: '#654321'
	},
	{
		id: 'ape',
		name: 'Ape Framework',
		descriptionKey: 'chain-tools.dev.tools.ape.description',
		url: 'https://apeworx.io',
		icon: Code,
		category: 'dev',
		tags: ['framework', 'python', 'modular'],
		color: '#000000'
	},
	{
		id: 'anchor-lang',
		name: 'Anchor',
		descriptionKey: 'chain-tools.dev.tools.anchor_lang.description',
		url: 'https://anchor-lang.com',
		icon: Code,
		category: 'dev',
		tags: ['solana', 'framework', 'rust', 'programs'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'move-lang',
		name: 'Move Language',
		descriptionKey: 'chain-tools.dev.tools.move_lang.description',
		url: 'https://move-language.github.io/move',
		icon: Code,
		category: 'dev',
		tags: ['sui', 'aptos', 'language', 'smart-contracts'],
		chains: ['Sui', 'Aptos'],
		color: '#4DA2FF'
	},
	{
		id: 'cairo-lang',
		name: 'Cairo',
		descriptionKey: 'chain-tools.dev.tools.cairo_lang.description',
		url: 'https://cairo-lang.org',
		icon: Code,
		category: 'dev',
		tags: ['starknet', 'zk', 'language', 'provable'],
		chains: ['StarkNet'],
		color: '#EC796B'
	},
	{
		id: 'noir-lang',
		name: 'Noir',
		descriptionKey: 'chain-tools.dev.tools.noir_lang.description',
		url: 'https://noir-lang.org',
		icon: Code,
		category: 'dev',
		tags: ['zk', 'circuits', 'privacy', 'aztec'],
		color: '#000000'
	},
	{
		id: 'circom',
		name: 'Circom',
		descriptionKey: 'chain-tools.dev.tools.circom.description',
		url: 'https://docs.circom.io',
		icon: Code,
		category: 'dev',
		tags: ['zk', 'circuits', 'snark', 'dsl'],
		color: '#F97316'
	},
	{
		id: 'huff-lang',
		name: 'Huff',
		descriptionKey: 'chain-tools.dev.tools.huff_lang.description',
		url: 'https://huff.sh',
		icon: Code,
		category: 'dev',
		tags: ['evm', 'assembly', 'gas-optimized', 'low-level'],
		chains: ['Ethereum'],
		color: '#363636'
	},
	{
		id: 'vyper-lang',
		name: 'Vyper',
		descriptionKey: 'chain-tools.dev.tools.vyper_lang.description',
		url: 'https://vyper.readthedocs.io',
		icon: Code,
		category: 'dev',
		tags: ['evm', 'python', 'security', 'smart-contracts'],
		chains: ['Ethereum'],
		color: '#3670A0'
	},
	{
		id: 'fe-lang',
		name: 'Fe',
		descriptionKey: 'chain-tools.dev.tools.fe_lang.description',
		url: 'https://fe-lang.org',
		icon: Code,
		category: 'dev',
		tags: ['evm', 'rust-like', 'smart-contracts', 'safe'],
		chains: ['Ethereum'],
		color: '#B7410E'
	},

	// ========== StarkNet Tools ==========
	{
		id: 'protostar',
		name: 'Protostar',
		descriptionKey: 'chain-tools.dev.tools.protostar.description',
		url: 'https://docs.swmansion.com/protostar',
		icon: Terminal,
		category: 'dev',
		tags: ['starknet', 'testing', 'toolchain', 'cairo'],
		chains: ['StarkNet'],
		color: '#EC796B'
	},
	{
		id: 'starkli',
		name: 'Starkli',
		descriptionKey: 'chain-tools.dev.tools.starkli.description',
		url: 'https://book.starkli.rs',
		icon: Terminal,
		category: 'dev',
		tags: ['starknet', 'cli', 'deployment', 'tooling'],
		chains: ['StarkNet'],
		color: '#29296E'
	}
];

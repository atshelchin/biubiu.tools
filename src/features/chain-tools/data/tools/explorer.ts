/**
 * Explorer Tools - Block explorers and transaction analysis
 */
import { Search, FileCode } from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const explorerTools: ExternalTool[] = [
	// ========== Major Ethereum Explorers ==========
	{
		id: 'etherscan',
		name: 'Etherscan',
		descriptionKey: 'chain-tools.explorer.tools.etherscan.description',
		url: 'https://etherscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'ethereum', 'transactions', 'contracts'],
		chains: ['Ethereum'],
		color: '#21325B',
		isFeatured: true
	},
	{
		id: 'blockscout',
		name: 'Blockscout',
		descriptionKey: 'chain-tools.explorer.tools.blockscout.description',
		url: 'https://www.blockscout.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'open-source', 'multi-chain'],
		color: '#5C6BC0',
		isFeatured: true
	},

	// ========== L2 Explorers ==========
	{
		id: 'arbiscan',
		name: 'Arbiscan',
		descriptionKey: 'chain-tools.explorer.tools.arbiscan.description',
		url: 'https://arbiscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'arbitrum', 'transactions'],
		chains: ['Arbitrum'],
		color: '#213147'
	},
	{
		id: 'optimistic-scan',
		name: 'Optimistic Etherscan',
		descriptionKey: 'chain-tools.explorer.tools.optimistic_scan.description',
		url: 'https://optimistic.etherscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'optimism', 'transactions'],
		chains: ['Optimism'],
		color: '#FF0420'
	},
	{
		id: 'basescan',
		name: 'BaseScan',
		descriptionKey: 'chain-tools.explorer.tools.basescan.description',
		url: 'https://basescan.org',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'base', 'transactions'],
		chains: ['Base'],
		color: '#0052FF'
	},
	{
		id: 'zksync-explorer',
		name: 'zkSync Explorer',
		descriptionKey: 'chain-tools.explorer.tools.zksync_explorer.description',
		url: 'https://explorer.zksync.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'zksync', 'zk-rollup'],
		chains: ['zkSync Era'],
		color: '#8C8DFC'
	},
	{
		id: 'lineascan',
		name: 'LineaScan',
		descriptionKey: 'chain-tools.explorer.tools.lineascan.description',
		url: 'https://lineascan.build',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'linea', 'transactions'],
		chains: ['Linea'],
		color: '#121212'
	},
	{
		id: 'scrollscan',
		name: 'Scrollscan',
		descriptionKey: 'chain-tools.explorer.tools.scrollscan.description',
		url: 'https://scrollscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'scroll', 'zk-rollup'],
		chains: ['Scroll'],
		color: '#FFEEDA'
	},
	{
		id: 'mantlescan',
		name: 'Mantle Explorer',
		descriptionKey: 'chain-tools.explorer.tools.mantlescan.description',
		url: 'https://explorer.mantle.xyz',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'mantle', 'modular'],
		chains: ['Mantle'],
		color: '#000000'
	},
	{
		id: 'blastscan',
		name: 'Blastscan',
		descriptionKey: 'chain-tools.explorer.tools.blastscan.description',
		url: 'https://blastscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'blast', 'native-yield'],
		chains: ['Blast'],
		color: '#FCFC03'
	},
	{
		id: 'modescan',
		name: 'Mode Explorer',
		descriptionKey: 'chain-tools.explorer.tools.modescan.description',
		url: 'https://explorer.mode.network',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'mode', 'optimistic'],
		chains: ['Mode'],
		color: '#DFFE00'
	},

	// ========== EVM Chain Explorers ==========
	{
		id: 'polygonscan',
		name: 'PolygonScan',
		descriptionKey: 'chain-tools.explorer.tools.polygonscan.description',
		url: 'https://polygonscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'polygon', 'transactions'],
		chains: ['Polygon'],
		color: '#8247E5'
	},
	{
		id: 'bscscan',
		name: 'BscScan',
		descriptionKey: 'chain-tools.explorer.tools.bscscan.description',
		url: 'https://bscscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'bsc', 'transactions'],
		chains: ['BSC'],
		color: '#F0B90B'
	},
	{
		id: 'snowtrace',
		name: 'Snowtrace',
		descriptionKey: 'chain-tools.explorer.tools.snowtrace.description',
		url: 'https://snowtrace.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'avalanche', 'transactions'],
		chains: ['Avalanche'],
		color: '#E84142'
	},
	{
		id: 'celoscan',
		name: 'Celoscan',
		descriptionKey: 'chain-tools.explorer.tools.celoscan.description',
		url: 'https://celoscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'celo', 'mobile-first'],
		chains: ['Celo'],
		color: '#35D07F'
	},
	{
		id: 'ftmscan',
		name: 'FTMScan',
		descriptionKey: 'chain-tools.explorer.tools.ftmscan.description',
		url: 'https://ftmscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'fantom', 'transactions'],
		chains: ['Fantom'],
		color: '#1969FF'
	},
	{
		id: 'gnosisscan',
		name: 'GnosisScan',
		descriptionKey: 'chain-tools.explorer.tools.gnosisscan.description',
		url: 'https://gnosisscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'gnosis', 'xdai'],
		chains: ['Gnosis'],
		color: '#04795B'
	},
	{
		id: 'cronoscan',
		name: 'Cronoscan',
		descriptionKey: 'chain-tools.explorer.tools.cronoscan.description',
		url: 'https://cronoscan.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'cronos', 'transactions'],
		chains: ['Cronos'],
		color: '#002D74'
	},
	{
		id: 'moonbeamscan',
		name: 'Moonscan',
		descriptionKey: 'chain-tools.explorer.tools.moonbeamscan.description',
		url: 'https://moonscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'moonbeam', 'polkadot'],
		chains: ['Moonbeam', 'Moonriver'],
		color: '#53CBC9'
	},

	// ========== Non-EVM Chain Explorers ==========
	{
		id: 'solscan',
		name: 'Solscan',
		descriptionKey: 'chain-tools.explorer.tools.solscan.description',
		url: 'https://solscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['solana', 'explorer', 'analytics', 'tokens'],
		chains: ['Solana'],
		color: '#14F195'
	},
	{
		id: 'mintscan',
		name: 'Mintscan',
		descriptionKey: 'chain-tools.explorer.tools.mintscan.description',
		url: 'https://mintscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['cosmos', 'ibc', 'staking', 'explorer'],
		chains: ['Cosmos', 'Osmosis', 'Celestia'],
		color: '#5F4AE8'
	},
	{
		id: 'nearblocks',
		name: 'NearBlocks',
		descriptionKey: 'chain-tools.explorer.tools.nearblocks.description',
		url: 'https://nearblocks.io',
		icon: Search,
		category: 'explorer',
		tags: ['near', 'explorer', 'analytics', 'tokens'],
		chains: ['NEAR'],
		color: '#00C08B'
	},
	{
		id: 'blockchair',
		name: 'Blockchair',
		descriptionKey: 'chain-tools.explorer.tools.blockchair.description',
		url: 'https://blockchair.com',
		icon: Search,
		category: 'explorer',
		tags: ['multichain', 'explorer', 'privacy', 'analytics'],
		chains: ['Bitcoin', 'Ethereum', 'Litecoin', 'Dogecoin'],
		color: '#0052FF'
	},
	{
		id: 'avascan',
		name: 'AvaScan',
		descriptionKey: 'chain-tools.explorer.tools.avascan.description',
		url: 'https://avascan.info',
		icon: Search,
		category: 'explorer',
		tags: ['avalanche', 'explorer', 'subnets', 'validator'],
		chains: ['Avalanche'],
		color: '#E84142'
	},
	{
		id: 'tonscan',
		name: 'TONScan',
		descriptionKey: 'chain-tools.explorer.tools.tonscan.description',
		url: 'https://tonscan.org',
		icon: Search,
		category: 'explorer',
		tags: ['ton', 'explorer', 'jettons', 'nft'],
		chains: ['TON'],
		color: '#0088CC'
	},
	{
		id: 'tronscan',
		name: 'TronScan',
		descriptionKey: 'chain-tools.explorer.tools.tronscan.description',
		url: 'https://tronscan.org',
		icon: Search,
		category: 'explorer',
		tags: ['tron', 'explorer', 'trc20', 'staking'],
		chains: ['Tron'],
		color: '#FF0000'
	},
	{
		id: 'cardanoscan',
		name: 'Cardanoscan',
		descriptionKey: 'chain-tools.explorer.tools.cardanoscan.description',
		url: 'https://cardanoscan.io',
		icon: Search,
		category: 'explorer',
		tags: ['cardano', 'explorer', 'staking', 'tokens'],
		chains: ['Cardano'],
		color: '#0033AD'
	},
	{
		id: 'viewblock',
		name: 'ViewBlock',
		descriptionKey: 'chain-tools.explorer.tools.viewblock.description',
		url: 'https://viewblock.io',
		icon: Search,
		category: 'explorer',
		tags: ['multichain', 'explorer', 'analytics', 'zilliqa'],
		chains: ['Zilliqa', 'THORChain', 'Arweave'],
		color: '#22C55E'
	},
	{
		id: 'suiscan',
		name: 'SuiScan',
		descriptionKey: 'chain-tools.explorer.tools.suiscan.description',
		url: 'https://suiscan.xyz',
		icon: Search,
		category: 'explorer',
		tags: ['sui', 'explorer', 'objects', 'move'],
		chains: ['Sui'],
		color: '#4DA2FF'
	},

	// ========== Multi-chain Explorers ==========
	{
		id: 'oklink',
		name: 'OKLink',
		descriptionKey: 'chain-tools.explorer.tools.oklink.description',
		url: 'https://www.oklink.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'multi-chain', 'analytics', 'okx'],
		color: '#000000'
	},
	{
		id: 'routescan',
		name: 'Routescan',
		descriptionKey: 'chain-tools.explorer.tools.routescan.description',
		url: 'https://routescan.io',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'multi-chain', 'unified', 'search'],
		color: '#3B82F6'
	},
	{
		id: 'onceupon',
		name: 'Once Upon',
		descriptionKey: 'chain-tools.explorer.tools.onceupon.description',
		url: 'https://onceupon.gg',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'human-readable', 'transactions', 'social'],
		color: '#8B5CF6'
	},
	{
		id: 'evm-explorer',
		name: 'EVM Explorer',
		descriptionKey: 'chain-tools.explorer.tools.evm_explorer.description',
		url: 'https://evmexplorer.com',
		icon: Search,
		category: 'explorer',
		tags: ['explorer', 'multi-chain', 'unified', 'evm'],
		color: '#6366F1'
	},

	// ========== Developer Tools ==========
	{
		id: 'anyabi',
		name: 'AnyABI',
		descriptionKey: 'chain-tools.explorer.tools.anyabi.description',
		url: 'https://anyabi.xyz',
		icon: FileCode,
		category: 'explorer',
		tags: ['abi', 'decoder', 'lookup', 'contracts'],
		color: '#000000'
	},
	{
		id: 'samczsun-explorer',
		name: 'sam.wtf',
		descriptionKey: 'chain-tools.explorer.tools.samczsun_explorer.description',
		url: 'https://tx.eth.samczsun.com',
		icon: Search,
		category: 'explorer',
		tags: ['transaction', 'tracer', 'debugger', 'analysis'],
		color: '#EF4444'
	}
];

/**
 * Chain data types based on chainlist.org/rpcs.json structure
 */

export interface NativeCurrency {
	name: string;
	symbol: string;
	decimals: number;
}

export interface RpcEndpoint {
	url: string;
	tracking: 'none' | 'limited' | 'yes' | 'unspecified';
	isOpenSource?: boolean;
}

export interface Explorer {
	name: string;
	url: string;
	standard?: string;
	icon?: string;
}

export interface ChainFeature {
	name: string;
}

export interface EnsConfig {
	registry: string;
}

export interface ParentChain {
	type: string;
	chain: string;
	bridges?: Array<{ url: string }>;
}

export interface Chain {
	name: string;
	chain: string;
	chainId: number;
	networkId: number;
	shortName: string;
	icon?: string;
	rpc: RpcEndpoint[];
	nativeCurrency: NativeCurrency;
	explorers?: Explorer[];
	faucets: string[];
	infoURL: string;
	features?: ChainFeature[];
	slip44?: number;
	ens?: EnsConfig;
	tvl?: number;
	chainSlug?: string;
	isTestnet?: boolean;
	parent?: ParentChain;
	status?: string;
}

export type RpcTestStatus = 'idle' | 'testing' | 'success' | 'failed';

export interface RpcTestResult {
	url: string;
	status: RpcTestStatus;
	latency?: number;
	blockHeight?: number;
	error?: string;
}

export type NetworkFilter = 'all' | 'mainnet' | 'testnet';

export interface ChainlistState {
	searchQuery: string;
	filter: NetworkFilter;
	expandedChainId: number | null;
	rpcTestResults: Map<string, RpcTestResult>;
}

import { SvelteMap } from 'svelte/reactivity';
import type { Chain, NetworkFilter, RpcTestResult } from '../types/chain';

class ChainlistState {
	searchQuery = $state('');
	filter = $state<NetworkFilter>('all');
	expandedChainId = $state<number | null>(null);
	rpcTestResults = $state<SvelteMap<string, RpcTestResult>>(new SvelteMap());

	// Cached chains data
	private _chains = $state<Chain[]>([]);

	get chains(): Chain[] {
		return this._chains;
	}

	setChains(chains: Chain[]) {
		this._chains = chains;
	}

	get filteredChains(): Chain[] {
		let result = this._chains;

		// Apply network filter
		if (this.filter === 'mainnet') {
			result = result.filter((chain) => !chain.isTestnet);
		} else if (this.filter === 'testnet') {
			result = result.filter((chain) => chain.isTestnet);
		}

		// Apply search filter
		if (this.searchQuery.trim()) {
			const query = this.searchQuery.toLowerCase().trim();
			result = result.filter(
				(chain) =>
					chain.name.toLowerCase().includes(query) ||
					chain.chainId.toString().includes(query) ||
					chain.shortName.toLowerCase().includes(query) ||
					chain.nativeCurrency.symbol.toLowerCase().includes(query) ||
					chain.chain.toLowerCase().includes(query)
			);
		}

		// Sort by TVL (descending), then by name
		// Use slice() to create a copy before sorting to avoid mutating the original array
		return [...result].sort((a, b) => {
			const tvlA = a.tvl ?? 0;
			const tvlB = b.tvl ?? 0;
			if (tvlB !== tvlA) {
				return tvlB - tvlA;
			}
			return a.name.localeCompare(b.name);
		});
	}

	setSearchQuery(query: string) {
		this.searchQuery = query;
	}

	setFilter(filter: NetworkFilter) {
		this.filter = filter;
	}

	toggleExpanded(chainId: number) {
		if (this.expandedChainId === chainId) {
			this.expandedChainId = null;
		} else {
			this.expandedChainId = chainId;
		}
	}

	isExpanded(chainId: number): boolean {
		return this.expandedChainId === chainId;
	}

	setRpcTestResult(url: string, result: RpcTestResult) {
		this.rpcTestResults.set(url, result);
	}

	getRpcTestResult(url: string): RpcTestResult | undefined {
		return this.rpcTestResults.get(url);
	}

	clearRpcTestResults() {
		this.rpcTestResults.clear();
	}

	reset() {
		this.searchQuery = '';
		this.filter = 'all';
		this.expandedChainId = null;
		this.rpcTestResults.clear();
	}
}

export const chainlistState = new ChainlistState();

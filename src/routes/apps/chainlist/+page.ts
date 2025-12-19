import type { PageLoad } from './$types';
import type { Chain, RpcEndpoint, Explorer } from '@/features/chainlist/types/chain';

// Dedupe arrays by a key field (keep first occurrence)
function dedupeByKey<T>(items: T[], keyFn: (item: T) => string): T[] {
	const seen = new Set<string>();
	return items.filter((item) => {
		const key = keyFn(item);
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch('/rpcs.json');
	const chains: Chain[] = await response.json();

	// Dedupe RPC endpoints and explorers for each chain
	const processedChains = chains.map((chain) => ({
		...chain,
		rpc: dedupeByKey<RpcEndpoint>(chain.rpc, (r) => r.url),
		explorers: chain.explorers
			? dedupeByKey<Explorer>(chain.explorers, (e) => e.url)
			: undefined
	}));

	return {
		chains: processedChains,
		meta: {
			title: 'Chain List - EVM Networks Directory',
			description:
				'Search and add EVM-compatible blockchain networks to your wallet. Real-time RPC testing, latency monitoring, and one-click wallet integration.',
			keywords: [
				'chainlist',
				'evm chains',
				'rpc endpoints',
				'blockchain networks',
				'metamask',
				'add network',
				'chain id'
			]
		}
	};
};

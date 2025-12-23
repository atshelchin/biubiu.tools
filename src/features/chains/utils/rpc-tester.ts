import type { RpcLatencyResult } from '../types';

/**
 * Test RPC endpoint latency by making an eth_blockNumber call
 */
export async function testRpcLatency(url: string, timeoutMs = 5000): Promise<RpcLatencyResult> {
	// Skip WebSocket endpoints for now (would need different handling)
	if (url.startsWith('wss://') || url.startsWith('ws://')) {
		return { url, latency: null, error: 'WebSocket not supported' };
	}

	const startTime = performance.now();

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				method: 'eth_blockNumber',
				params: [],
				id: 1
			}),
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		if (!response.ok) {
			return { url, latency: null, error: `HTTP ${response.status}` };
		}

		const data = await response.json();
		const latency = Math.round(performance.now() - startTime);

		if (data.error) {
			return { url, latency: null, error: data.error.message };
		}

		const blockNumber = parseInt(data.result, 16);
		return { url, latency, blockNumber };
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? error.name === 'AbortError'
					? 'Timeout'
					: error.message
				: 'Unknown error';
		return { url, latency: null, error: errorMessage };
	}
}

/**
 * Test multiple RPC endpoints concurrently with rate limiting
 */
export async function testMultipleRpcs(
	urls: string[],
	options: {
		concurrency?: number;
		timeoutMs?: number;
		onProgress?: (completed: number, total: number) => void;
	} = {}
): Promise<Map<string, RpcLatencyResult>> {
	const { concurrency = 5, timeoutMs = 5000, onProgress } = options;
	const results = new Map<string, RpcLatencyResult>();
	let completed = 0;

	// Process in batches
	for (let i = 0; i < urls.length; i += concurrency) {
		const batch = urls.slice(i, i + concurrency);
		const batchResults = await Promise.all(batch.map((url) => testRpcLatency(url, timeoutMs)));

		for (const result of batchResults) {
			results.set(result.url, result);
			completed++;
			onProgress?.(completed, urls.length);
		}
	}

	return results;
}

/**
 * Sort RPC endpoints by latency (fastest first, failed last)
 */
export function sortByLatency<T extends { url: string }>(
	endpoints: T[],
	latencyResults: Map<string, RpcLatencyResult>
): T[] {
	return [...endpoints].sort((a, b) => {
		const resultA = latencyResults.get(a.url);
		const resultB = latencyResults.get(b.url);

		const latencyA = resultA?.latency ?? Infinity;
		const latencyB = resultB?.latency ?? Infinity;

		// Both failed - maintain original order
		if (latencyA === Infinity && latencyB === Infinity) return 0;

		// One failed - put it last
		if (latencyA === Infinity) return 1;
		if (latencyB === Infinity) return -1;

		// Both succeeded - sort by latency
		return latencyA - latencyB;
	});
}

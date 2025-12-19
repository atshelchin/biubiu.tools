import type { RpcTestResult } from '../types/chain';

const RPC_TEST_TIMEOUT = 10000; // 10 seconds
const WS_TEST_TIMEOUT = 5000; // 5 seconds for WebSocket

/**
 * Test a WebSocket RPC endpoint
 */
async function testWebSocketEndpoint(url: string): Promise<RpcTestResult> {
	const startTime = performance.now();

	return new Promise((resolve) => {
		let resolved = false;

		const timeoutId = setTimeout(() => {
			if (!resolved) {
				resolved = true;
				ws.close();
				resolve({
					url,
					status: 'failed',
					error: 'Timeout'
				});
			}
		}, WS_TEST_TIMEOUT);

		const ws = new WebSocket(url);

		ws.onopen = () => {
			// Send eth_blockNumber request
			ws.send(
				JSON.stringify({
					jsonrpc: '2.0',
					method: 'eth_blockNumber',
					params: [],
					id: 1
				})
			);
		};

		ws.onmessage = (event) => {
			if (resolved) return;
			resolved = true;
			clearTimeout(timeoutId);

			try {
				const data = JSON.parse(event.data);
				const latency = Math.round(performance.now() - startTime);

				if (data.error) {
					ws.close();
					resolve({
						url,
						status: 'failed',
						error: data.error.message || 'RPC error'
					});
					return;
				}

				if (data.result) {
					const blockHeight = parseInt(data.result, 16);
					ws.close();
					resolve({
						url,
						status: 'success',
						latency,
						blockHeight
					});
					return;
				}

				ws.close();
				resolve({
					url,
					status: 'failed',
					error: 'No result returned'
				});
			} catch {
				ws.close();
				resolve({
					url,
					status: 'failed',
					error: 'Invalid response'
				});
			}
		};

		ws.onerror = () => {
			if (resolved) return;
			resolved = true;
			clearTimeout(timeoutId);
			ws.close();
			resolve({
				url,
				status: 'failed',
				error: 'WebSocket connection failed'
			});
		};

		ws.onclose = () => {
			if (resolved) return;
			resolved = true;
			clearTimeout(timeoutId);
			resolve({
				url,
				status: 'failed',
				error: 'Connection closed'
			});
		};
	});
}

/**
 * Test a single RPC endpoint by calling eth_blockNumber
 */
export async function testRpcEndpoint(url: string): Promise<RpcTestResult> {
	// Handle WebSocket URLs
	if (url.startsWith('wss://') || url.startsWith('ws://')) {
		return testWebSocketEndpoint(url);
	}

	const startTime = performance.now();

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), RPC_TEST_TIMEOUT);

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
			return {
				url,
				status: 'failed',
				error: `HTTP ${response.status}`
			};
		}

		const data = await response.json();
		const latency = Math.round(performance.now() - startTime);

		if (data.error) {
			return {
				url,
				status: 'failed',
				error: data.error.message || 'RPC error'
			};
		}

		if (!data.result) {
			return {
				url,
				status: 'failed',
				error: 'No result returned'
			};
		}

		const blockHeight = parseInt(data.result, 16);

		return {
			url,
			status: 'success',
			latency,
			blockHeight
		};
	} catch (error) {
		const latency = Math.round(performance.now() - startTime);

		if (error instanceof Error) {
			if (error.name === 'AbortError') {
				return {
					url,
					status: 'failed',
					error: 'Timeout',
					latency
				};
			}

			// CORS errors or network errors
			return {
				url,
				status: 'failed',
				error: 'CORS or network error'
			};
		}

		return {
			url,
			status: 'failed',
			error: 'Unknown error'
		};
	}
}

/**
 * Test multiple RPC endpoints in parallel
 */
export async function testRpcEndpoints(
	urls: string[],
	onResult?: (result: RpcTestResult) => void
): Promise<RpcTestResult[]> {
	const results: RpcTestResult[] = [];

	const promises = urls.map(async (url) => {
		const result = await testRpcEndpoint(url);
		results.push(result);
		onResult?.(result);
		return result;
	});

	await Promise.all(promises);

	// Sort by latency (successful first, then by latency)
	return results.sort((a, b) => {
		if (a.status === 'success' && b.status !== 'success') return -1;
		if (a.status !== 'success' && b.status === 'success') return 1;
		if (a.status === 'success' && b.status === 'success') {
			return (a.latency ?? Infinity) - (b.latency ?? Infinity);
		}
		return 0;
	});
}

/**
 * Format latency for display
 */
export function formatLatency(latency: number | undefined): string {
	if (latency === undefined) return '-';
	if (latency < 1000) return `${latency}ms`;
	return `${(latency / 1000).toFixed(1)}s`;
}

/**
 * Format block height for display
 */
export function formatBlockHeight(height: number | undefined): string {
	if (height === undefined) return '-';
	return height.toLocaleString();
}

/**
 * Get latency quality class
 */
export function getLatencyQuality(
	latency: number | undefined
): 'good' | 'medium' | 'slow' | 'none' {
	if (latency === undefined) return 'none';
	if (latency < 300) return 'good';
	if (latency < 1000) return 'medium';
	return 'slow';
}

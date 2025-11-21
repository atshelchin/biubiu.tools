import { spawn, spawnPool } from '$lib/utils/worker-pool';
import { walletKeysStore } from '@/features/token-sweep/stores/wallet-keys-store.svelte';
import { SvelteDate } from 'svelte/reactivity';
import type {
	WalletGenerationRequest,
	WalletGenerationResult
} from '$lib/workers/wallet-import.worker';
import type {
	PrivateKeyImportRequest,
	PrivateKeyImportResult
} from '$lib/workers/private-key-import.worker';
import WalletImportWorkerUrl from '$lib/workers/wallet-import.worker?worker&url';
import PrivateKeyImportWorkerUrl from '$lib/workers/private-key-import.worker?worker&url';

export function useWalletGeneration() {
	async function generateFromMnemonic(
		requestData: WalletGenerationRequest,
		totalAddresses: number,
		onProgress: (progress: number) => void
	) {
		const useParallel = totalAddresses > 500;

		if (useParallel) {
			// Parallel execution with multiple workers
			const result = await spawnPool<
				WalletGenerationRequest,
				WalletGenerationResult,
				WalletGenerationResult
			>(WalletImportWorkerUrl, {
				data: requestData,
				workerCount: 'auto',
				splitTask: (data, workerIndex, totalWorkers) => {
					if (data.pathType === 'sequential') {
						// Split sequential index range across workers
						const totalAddresses = data.endIndex! - data.startIndex! + 1;
						const addressesPerWorker = Math.floor(totalAddresses / totalWorkers);
						const remainder = totalAddresses % totalWorkers;

						const workerStart =
							data.startIndex! +
							workerIndex * addressesPerWorker +
							Math.min(workerIndex, remainder);
						const workerCount = addressesPerWorker + (workerIndex < remainder ? 1 : 0);
						const workerEnd = workerStart + workerCount - 1;

						return {
							...data,
							startIndex: workerStart,
							endIndex: workerEnd
						};
					} else {
						// Split date range across workers
						const startDate = new SvelteDate(data.startDate!);
						const endDate = new SvelteDate(data.endDate!);
						const totalDays = Math.ceil(
							(endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
						);
						const daysPerWorker = Math.floor(totalDays / totalWorkers);
						const remainder = totalDays % totalWorkers;

						const workerDays = daysPerWorker + (workerIndex < remainder ? 1 : 0);
						const startOffset = workerIndex * daysPerWorker + Math.min(workerIndex, remainder);

						const workerStartDate = new SvelteDate(startDate);
						workerStartDate.setDate(startDate.getDate() + startOffset);

						const workerEndDate = new SvelteDate(workerStartDate);
						workerEndDate.setDate(workerStartDate.getDate() + workerDays - 1);

						if (workerEndDate > endDate) {
							workerEndDate.setTime(endDate.getTime());
						}

						return {
							...data,
							startDate: workerStartDate.toISOString().split('T')[0],
							endDate: workerEndDate.toISOString().split('T')[0]
						};
					}
				},
				mergeResults: (results) => {
					const allWallets = results.flatMap((r) => r.wallets);
					return {
						wallets: allWallets,
						progress: 100,
						done: true
					};
				},
				onProgress
			});

			if (!result.error) {
				// Store private keys
				walletKeysStore.storeKeys(
					result.wallets.map((w) => ({
						address: w.address,
						privateKey: w.privateKey as `0x${string}`
					}))
				);
			}

			return result;
		} else {
			// Single worker execution
			const result = await spawn<WalletGenerationRequest, WalletGenerationResult>(
				WalletImportWorkerUrl
			).execute(requestData, {
				onProgress
			});

			if (!result.error) {
				// Store private keys
				walletKeysStore.storeKeys(
					result.wallets.map((w) => ({
						address: w.address,
						privateKey: w.privateKey as `0x${string}`
					}))
				);
			}

			return result;
		}
	}

	async function importPrivateKeys(
		keys: string[],
		onProgress: (progress: number) => void
	): Promise<PrivateKeyImportResult> {
		const useParallel = keys.length > 200;

		if (useParallel) {
			// Parallel execution with multiple workers
			const result = await spawnPool<
				PrivateKeyImportRequest,
				PrivateKeyImportResult,
				PrivateKeyImportResult
			>(PrivateKeyImportWorkerUrl, {
				data: { keys, batchSize: 100 },
				workerCount: 'auto',
				splitTask: (data, workerIndex, totalWorkers) => {
					const totalKeys = data.keys.length;
					const keysPerWorker = Math.floor(totalKeys / totalWorkers);
					const remainder = totalKeys % totalWorkers;

					const startIdx = workerIndex * keysPerWorker + Math.min(workerIndex, remainder);
					const count = keysPerWorker + (workerIndex < remainder ? 1 : 0);
					const endIdx = startIdx + count;

					const workerKeys = data.keys.slice(startIdx, endIdx);

					return {
						keys: workerKeys,
						batchSize: data.batchSize
					};
				},
				mergeResults: (results) => {
					const allWallets = results.flatMap((r) => r.wallets);
					const allInvalidKeys = results.flatMap((r) => r.invalidKeys);

					return {
						wallets: allWallets,
						invalidKeys: allInvalidKeys,
						progress: 100,
						done: true
					};
				},
				onProgress
			});

			if (!result.error) {
				// Store private keys
				walletKeysStore.storeKeys(
					result.wallets.map((w) => ({
						address: w.address,
						privateKey: w.privateKey as `0x${string}`
					}))
				);
			}

			return result;
		} else {
			// Single worker execution
			const result = await spawn<PrivateKeyImportRequest, PrivateKeyImportResult>(
				PrivateKeyImportWorkerUrl
			).execute(
				{
					keys,
					batchSize: 100
				},
				{
					onProgress
				}
			);

			if (!result.error) {
				// Store private keys
				walletKeysStore.storeKeys(
					result.wallets.map((w) => ({
						address: w.address,
						privateKey: w.privateKey as `0x${string}`
					}))
				);
			}

			return result;
		}
	}

	return {
		generateFromMnemonic,
		importPrivateKeys
	};
}

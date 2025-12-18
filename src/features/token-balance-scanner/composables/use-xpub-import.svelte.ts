/**
 * Composable for xpub address derivation
 * Uses web worker pool for parallel non-blocking derivation
 */

import type { DerivationPathType } from '@/features/wallet-sweep/types/wallet';
import { step4State } from '../stores/step4-state.svelte';
import type { XpubAddressRequest, XpubAddressResult } from '$lib/workers/xpub-address.worker';
import { spawn, spawnPool } from '$lib/utils/worker-pool';
import XpubAddressWorkerUrl from '$lib/workers/xpub-address.worker?worker&url';

// Threshold for using parallel workers (above this count, use multiple workers)
const PARALLEL_THRESHOLD = 500;

// Helper to get current year
function getCurrentYear(): number {
	return new Date().getFullYear();
}

export function useXpubImport() {
	// State
	let xpubText = $state('');
	let pathType = $state<DerivationPathType>('sequential');
	let startIndex = $state(0);
	let endIndex = $state(999);
	let startYear = $state(getCurrentYear() - 10);
	let endYear = $state(getCurrentYear());
	let includeMonth = $state(true);
	let includeDay = $state(true);
	let useLeadingZeros = $state(true);

	let isGenerating = $state(false);
	let generationProgress = $state(0);
	let errorMessage = $state('');

	// Validate xpub format
	function validateXpub(xpub: string): boolean {
		const trimmed = xpub.trim();
		return /^(xpub|ypub|zpub)[a-zA-Z0-9]{107,111}$/.test(trimmed);
	}

	// Calculate total addresses to derive
	function calculateTotalAddresses(): number {
		if (pathType === 'sequential') {
			return endIndex - startIndex + 1;
		} else {
			// Date mode - estimate based on year range
			return (endYear - startYear + 1) * 365; // Rough estimate
		}
	}

	// Derive addresses from xpub using single worker
	async function deriveWithSingleWorker(request: XpubAddressRequest): Promise<XpubAddressResult> {
		return spawn<XpubAddressRequest, XpubAddressResult>(XpubAddressWorkerUrl).execute(request, {
			onProgress: (p) => {
				generationProgress = p;
			}
		});
	}

	// Derive addresses from xpub using parallel workers
	async function deriveWithParallelWorkers(
		request: XpubAddressRequest
	): Promise<XpubAddressResult> {
		return spawnPool<XpubAddressRequest, XpubAddressResult, XpubAddressResult>(
			XpubAddressWorkerUrl,
			{
				data: request,
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
						// Split date range across workers by year
						const totalYears = data.endYear! - data.startYear! + 1;
						const yearsPerWorker = Math.floor(totalYears / totalWorkers);
						const remainder = totalYears % totalWorkers;

						const workerYears = yearsPerWorker + (workerIndex < remainder ? 1 : 0);
						const startOffset = workerIndex * yearsPerWorker + Math.min(workerIndex, remainder);

						const workerStartYear = data.startYear! + startOffset;
						const workerEndYear = Math.min(workerStartYear + workerYears - 1, data.endYear!);

						return {
							...data,
							startYear: workerStartYear,
							endYear: workerEndYear
						};
					}
				},
				mergeResults: (results) => {
					// Merge all addresses from all workers
					const allAddresses = results.flatMap((r) => r.addresses);
					// Sort by index to maintain order
					allAddresses.sort((a, b) => a.index - b.index);

					return {
						addresses: allAddresses,
						progress: 100,
						done: true
					};
				},
				onProgress: (p) => {
					generationProgress = p;
				}
			}
		);
	}

	// Derive addresses from xpub
	async function deriveAddresses(): Promise<void> {
		const trimmedXpub = xpubText.trim();

		if (!trimmedXpub) {
			errorMessage = 'Please enter an xpub';
			return;
		}

		if (!validateXpub(trimmedXpub)) {
			errorMessage = 'Invalid xpub format. Must start with xpub, ypub, or zpub.';
			return;
		}

		isGenerating = true;
		generationProgress = 0;
		errorMessage = '';

		try {
			const request: XpubAddressRequest = {
				xpub: trimmedXpub,
				pathType,
				startIndex,
				endIndex,
				startYear,
				endYear
			};

			// Decide whether to use parallel workers
			const totalAddresses = calculateTotalAddresses();
			const useParallel = totalAddresses > PARALLEL_THRESHOLD;

			const result = useParallel
				? await deriveWithParallelWorkers(request)
				: await deriveWithSingleWorker(request);

			// Add addresses to state with derivation paths
			if (result.addresses.length > 0) {
				result.addresses.forEach((item) => {
					step4State.addWallet(item.address, item.derivationPath);
				});
				// Don't clear input - keep it for user reference
			} else {
				errorMessage = 'No addresses were derived';
			}
		} catch (error) {
			errorMessage = error instanceof Error ? error.message : 'Failed to derive addresses';
		} finally {
			isGenerating = false;
		}
	}

	// Clear error
	function clearError(): void {
		errorMessage = '';
	}

	// Reset all state
	function reset(): void {
		xpubText = '';
		pathType = 'sequential';
		startIndex = 0;
		endIndex = 999;
		startYear = getCurrentYear() - 10;
		endYear = getCurrentYear();
		isGenerating = false;
		generationProgress = 0;
		errorMessage = '';
	}

	return {
		// Getters
		get xpubText() {
			return xpubText;
		},
		set xpubText(value: string) {
			xpubText = value;
		},
		get pathType() {
			return pathType;
		},
		set pathType(value: DerivationPathType) {
			pathType = value;
		},
		get startIndex() {
			return startIndex;
		},
		set startIndex(value: number) {
			startIndex = value;
		},
		get endIndex() {
			return endIndex;
		},
		set endIndex(value: number) {
			endIndex = value;
		},
		get startYear() {
			return startYear;
		},
		set startYear(value: number) {
			startYear = value;
		},
		get endYear() {
			return endYear;
		},
		set endYear(value: number) {
			endYear = value;
		},
		get includeMonth() {
			return includeMonth;
		},
		set includeMonth(value: boolean) {
			includeMonth = value;
		},
		get includeDay() {
			return includeDay;
		},
		set includeDay(value: boolean) {
			includeDay = value;
		},
		get useLeadingZeros() {
			return useLeadingZeros;
		},
		set useLeadingZeros(value: boolean) {
			useLeadingZeros = value;
		},
		get isGenerating() {
			return isGenerating;
		},
		get generationProgress() {
			return generationProgress;
		},
		get errorMessage() {
			return errorMessage;
		},

		// Methods
		deriveAddresses,
		clearError,
		reset
	};
}

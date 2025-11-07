// Web Worker for HD wallet address generation from mnemonic
import { HDKey } from '@scure/bip32';
import { mnemonicToSeed } from '@scure/bip39';
import { privateKeyToAccount } from 'viem/accounts';
import type { Address } from 'viem';
import { Buffer } from 'buffer';
import type { DateFormat } from '../types/wallet';

export interface WalletGenerationRequest {
	mnemonic: string;
	pathType: 'sequential' | 'date';
	// Sequential mode
	startIndex?: number;
	endIndex?: number;
	// Date mode
	startDate?: string;
	endDate?: string;
	dateFormat?: DateFormat;
	batchSize?: number;
}

export interface WalletGenerationResult {
	wallets: Array<{
		id: string;
		address: Address;
		derivationPath: string;
	}>;
	progress: number;
	done: boolean;
	error?: string;
}

/**
 * Generate date-based indices
 */
function generateDateIndices(startDate: string, endDate: string, format: DateFormat): number[] {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const indices: number[] = [];

	// Determine granularity based on format
	const isYearOnly = format === 'yyyy';
	const isMonthGranular = format === 'yyyymm' || format === 'yyyym';

	if (isYearOnly) {
		// Generate one index per year
		for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
			indices.push(year);
		}
	} else if (isMonthGranular) {
		// Generate one index per month
		const currentDate = new Date(start);
		while (currentDate <= end) {
			const year = currentDate.getFullYear();
			const month = currentDate.getMonth() + 1;

			let index: number;
			if (format === 'yyyymm') {
				// Format: 202401 (with leading zeros) - always 2-digit month
				index = year * 100 + month;
			} else {
				// Format: 20241 (no leading zeros) - parse as number without padding
				const dateStr = `${year}${month}`;
				index = parseInt(dateStr, 10);
			}
			indices.push(index);

			// Move to next month
			currentDate.setMonth(currentDate.getMonth() + 1);
		}
	} else {
		// Generate one index per day
		for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
			const year = d.getFullYear();
			const month = d.getMonth() + 1;
			const day = d.getDate();

			let index: number;
			if (format === 'yyyymmdd') {
				// Format: 20240919 (with leading zeros) - always 2-digit month/day
				index = year * 10000 + month * 100 + day;
			} else {
				// Format: 2024919 (no leading zeros) - parse as number without padding
				const dateStr = `${year}${month}${day}`;
				index = parseInt(dateStr, 10);
			}
			indices.push(index);
		}
	}

	return indices;
}

// Process wallet generation in batches
self.addEventListener('message', async (event: MessageEvent<WalletGenerationRequest>) => {
	const { mnemonic, pathType, startIndex, endIndex, startDate, endDate, dateFormat, batchSize = 100 } = event.data;

	try {
		// Generate seed
		const seed = await mnemonicToSeed(mnemonic);
		const hdKey = HDKey.fromMasterSeed(seed);

		// Determine indices to derive
		let indices: number[] = [];
		if (pathType === 'sequential') {
			const start = startIndex || 0;
			const end = endIndex || 999;
			indices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
		} else if (pathType === 'date') {
			if (!startDate || !endDate) {
				self.postMessage({
					wallets: [],
					progress: 100,
					done: true,
					error: 'Date range is required for date-based derivation'
				} as WalletGenerationResult);
				return;
			}
			indices = generateDateIndices(startDate, endDate, dateFormat || 'yyyymmdd');
		}

		const total = indices.length;
		const wallets: WalletGenerationResult['wallets'] = [];
		let processed = 0;

		// Process in batches to provide progress updates
		function processBatch(startIdx: number) {
			const endIdx = Math.min(startIdx + batchSize, total);

			for (let i = startIdx; i < endIdx; i++) {
				const index = indices[i];
				const path = `m/44'/60'/0'/0/${index}`;
				const child = hdKey.derive(path);

				if (!child.privateKey) {
					continue;
				}

				const account = privateKeyToAccount(
					`0x${Buffer.from(child.privateKey).toString('hex')}` as Address
				);

				wallets.push({
					id: `${account.address}-${index}`,
					address: account.address,
					derivationPath: path
				});
				processed++;
			}

			// Send progress update
			const progress = (processed / total) * 100;
			const done = processed === total;

			self.postMessage({
				wallets: done ? wallets : [],
				progress,
				done,
				error: undefined
			} as WalletGenerationResult);

			// Continue with next batch if not done
			if (!done) {
				// Use setTimeout to prevent blocking
				setTimeout(() => processBatch(endIdx), 0);
			}
		}

		// Start processing
		if (indices.length > 0) {
			processBatch(0);
		} else {
			self.postMessage({
				wallets: [],
				progress: 100,
				done: true,
				error: undefined
			} as WalletGenerationResult);
		}
	} catch (error) {
		self.postMessage({
			wallets: [],
			progress: 100,
			done: true,
			error: error instanceof Error ? error.message : 'Failed to generate wallets'
		} as WalletGenerationResult);
	}
});

export {};

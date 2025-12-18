// Web Worker for HD wallet address derivation from xpub (public key only - no private keys)
import { HDKey } from '@scure/bip32';
import { secp256k1 } from '@noble/curves/secp256k1.js';
import { keccak256 } from 'viem';
import type { Address } from 'viem';

export interface XpubAddressRequest {
	xpub: string;
	pathType: 'sequential' | 'date';
	// Sequential mode
	startIndex?: number;
	endIndex?: number;
	// Date mode - use numeric indices like YYYYMMDD
	startYear?: number;
	endYear?: number;
	batchSize?: number;
}

export interface XpubAddressResult {
	addresses: Array<{
		address: Address;
		derivationPath: string;
		index: number;
	}>;
	progress: number;
	done: boolean;
	error?: string;
}

/**
 * Generate date-based indices (YYYYMMDD format)
 */
function generateDateIndices(startYear: number, endYear: number): number[] {
	const indices: number[] = [];

	for (let year = startYear; year <= endYear; year++) {
		// Generate one index per day for the year
		const startDate = new Date(year, 0, 1);
		const endDate = new Date(year, 11, 31);

		for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
			const y = d.getFullYear();
			const m = d.getMonth() + 1;
			const day = d.getDate();
			// Format: YYYYMMDD (with leading zeros)
			const index = y * 10000 + m * 100 + day;
			indices.push(index);
		}
	}

	return indices;
}

/**
 * Derive Ethereum address from compressed public key
 * @param compressedPublicKey - 33-byte compressed public key from HDKey
 */
function publicKeyToAddress(compressedPublicKey: Uint8Array): Address {
	// Decompress the public key (33 bytes -> 65 bytes)
	// secp256k1.Point.fromBytes handles compressed format (auto-detects)
	const point = secp256k1.Point.fromBytes(compressedPublicKey);
	// Get uncompressed public key (65 bytes: 0x04 + 32 bytes x + 32 bytes y)
	const uncompressedPublicKey = point.toBytes(false);

	// Remove the first byte (0x04 prefix for uncompressed public key)
	const pubKeyWithoutPrefix = uncompressedPublicKey.slice(1);
	// Keccak256 hash of the public key (x || y)
	const hash = keccak256(pubKeyWithoutPrefix);
	// Take the last 20 bytes (40 hex characters)
	return `0x${hash.slice(-40)}` as Address;
}

// Process address derivation in batches
self.addEventListener('message', async (event: MessageEvent<XpubAddressRequest>) => {
	const { xpub, pathType, startIndex, endIndex, startYear, endYear, batchSize = 100 } = event.data;

	try {
		// Parse xpub
		const hdKey = HDKey.fromExtendedKey(xpub);

		// Determine indices to derive
		let indices: number[] = [];
		if (pathType === 'sequential') {
			const start = startIndex ?? 0;
			const end = endIndex ?? 999;
			indices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
		} else if (pathType === 'date') {
			const sYear = startYear ?? new Date().getFullYear() - 10;
			const eYear = endYear ?? new Date().getFullYear();
			indices = generateDateIndices(sYear, eYear);
		}

		const total = indices.length;
		const addresses: XpubAddressResult['addresses'] = [];
		let processed = 0;

		// Process in batches to provide progress updates
		function processBatch(startIdx: number) {
			const endIdx = Math.min(startIdx + batchSize, total);

			for (let i = startIdx; i < endIdx; i++) {
				const index = indices[i];
				// Standard BIP44 path relative to xpub: 0/{index}
				// xpub is typically at m/44'/60'/0' so we derive 0/{index}
				// The relative path from xpub level
				const relativePath = `m/0/${index}`;
				// Full BIP44 display path for user reference
				const displayPath = `m/44'/60'/0'/0/${index}`;

				try {
					const child = hdKey.derive(relativePath);

					if (!child.publicKey) {
						continue;
					}

					// Derive address from compressed public key
					const address = publicKeyToAddress(child.publicKey);

					addresses.push({
						address,
						derivationPath: displayPath,
						index
					});
				} catch {
					// Skip invalid derivations
					continue;
				}
				processed++;
			}

			// Send progress update
			const progress = (processed / total) * 100;
			const done = processed >= total || endIdx >= total;

			self.postMessage({
				addresses: done ? addresses : [],
				progress,
				done,
				error: undefined
			} as XpubAddressResult);

			// Continue with next batch if not done
			if (!done) {
				setTimeout(() => processBatch(endIdx), 0);
			}
		}

		// Start processing
		if (indices.length > 0) {
			processBatch(0);
		} else {
			self.postMessage({
				addresses: [],
				progress: 100,
				done: true,
				error: undefined
			} as XpubAddressResult);
		}
	} catch (error) {
		self.postMessage({
			addresses: [],
			progress: 100,
			done: true,
			error: error instanceof Error ? error.message : 'Failed to derive addresses from xpub'
		} as XpubAddressResult);
	}
});

export {};

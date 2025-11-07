import { HDKey } from '@scure/bip32';
import { mnemonicToSeed, validateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import { privateKeyToAccount } from 'viem/accounts';
import type {
	ImportedWallet,
	MnemonicImportConfig,
	WalletImportResult,
	DateFormat
} from '../types/wallet';
import type { Address } from 'viem';

/**
 * Validate mnemonic phrase
 */
export function validateMnemonicPhrase(mnemonic: string): boolean {
	try {
		const words = mnemonic.trim().split(/\s+/);
		if (words.length !== 12 && words.length !== 24) {
			return false;
		}
		return validateMnemonic(mnemonic, wordlist);
	} catch {
		return false;
	}
}

/**
 * Validate private key format
 */
export function validatePrivateKey(privateKey: string): boolean {
	return /^0x[a-fA-F0-9]{64}$/.test(privateKey);
}

/**
 * Generate date range indices
 */
function generateDateIndices(startDate: string, endDate: string, format: DateFormat): number[] {
	const start = new Date(startDate);
	const end = new Date(endDate);
	const indices: number[] = [];

	for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
		const year = d.getFullYear();
		const month = d.getMonth() + 1;
		const day = d.getDate();

		let index: number;
		if (format === 'yyyymmdd') {
			// Format: 20240919
			index = year * 10000 + month * 100 + day;
		} else {
			// Format: 2024919 (no leading zeros)
			index = year * 10000 + month * 100 + day;
		}
		indices.push(index);
	}

	return indices;
}

/**
 * Derive addresses from mnemonic
 */
export async function deriveAddressesFromMnemonic(
	config: MnemonicImportConfig
): Promise<WalletImportResult> {
	try {
		// Validate mnemonic
		if (!validateMnemonicPhrase(config.mnemonic)) {
			return {
				success: false,
				wallets: [],
				error: 'Invalid mnemonic phrase'
			};
		}

		// Generate seed
		const seed = await mnemonicToSeed(config.mnemonic);
		const hdKey = HDKey.fromMasterSeed(seed);

		// Determine indices to derive
		let indices: number[] = [];
		if (config.pathType === 'sequential') {
			const start = config.startIndex || 0;
			const end = config.endIndex || 999;
			indices = Array.from({ length: end - start + 1 }, (_, i) => start + i);
		} else if (config.pathType === 'date') {
			if (!config.startDate || !config.endDate) {
				return {
					success: false,
					wallets: [],
					error: 'Date range is required for date-based derivation'
				};
			}
			indices = generateDateIndices(
				config.startDate,
				config.endDate,
				config.dateFormat || 'yyyymmdd'
			);
		}

		// Limit to prevent browser freeze
		if (indices.length > 10000) {
			return {
				success: false,
				wallets: [],
				error: 'Too many addresses (max 10,000)'
			};
		}

		// Derive wallets
		const wallets: ImportedWallet[] = [];
		for (const index of indices) {
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
		}

		return {
			success: true,
			wallets
		};
	} catch (error) {
		console.error('Failed to derive addresses:', error);
		return {
			success: false,
			wallets: [],
			error: error instanceof Error ? error.message : 'Failed to derive addresses'
		};
	}
}

/**
 * Import wallets from private keys
 */
export function importFromPrivateKeys(privateKeys: string[]): WalletImportResult {
	try {
		const wallets: ImportedWallet[] = [];
		const errors: string[] = [];

		for (const pk of privateKeys) {
			const trimmed = pk.trim();
			if (!trimmed) continue;

			if (!validatePrivateKey(trimmed)) {
				errors.push(`Invalid private key: ${trimmed.slice(0, 10)}...`);
				continue;
			}

			try {
				const account = privateKeyToAccount(trimmed as Address);
				wallets.push({
					id: account.address,
					address: account.address
				});
			} catch {
				errors.push(`Failed to import: ${trimmed.slice(0, 10)}...`);
			}
		}

		if (wallets.length === 0 && errors.length > 0) {
			return {
				success: false,
				wallets: [],
				error: errors.join('\n')
			};
		}

		return {
			success: true,
			wallets,
			error: errors.length > 0 ? errors.join('\n') : undefined
		};
	} catch (error) {
		console.error('Failed to import private keys:', error);
		return {
			success: false,
			wallets: [],
			error: error instanceof Error ? error.message : 'Failed to import private keys'
		};
	}
}

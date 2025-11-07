/**
 * Wallet Generation Utilities
 */

import { mnemonicToSeed, generateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english.js';
import { HDKey } from '@scure/bip32';
import { privateKeyToAccount } from 'viem/accounts';
import type { InputSourceType, GeneratedWallet, WalletGeneratorConfig } from '../types/wallet';

/**
 * Generate seed from secret text using SHA-256
 */
async function generateSeedFromSecret(secret: string): Promise<Uint8Array> {
	const encoder = new TextEncoder();
	const data = encoder.encode(secret);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	// Generate mnemonic from hash
	const hashArray = new Uint8Array(hashBuffer);
	// Use first 16 bytes (128 bits) for 12-word mnemonic
	// const entropy = hashArray.slice(0, 16);
	const mnemonic = generateMnemonic(wordlist, 128);
	return mnemonicToSeed(mnemonic);
}

/**
 * Get seed from input source
 */
async function getSeed(
	type: InputSourceType,
	value: string
): Promise<{ seed: Uint8Array; hdkey?: HDKey }> {
	switch (type) {
		case 'mnemonic': {
			const seed = await mnemonicToSeed(value);
			return { seed };
		}
		case 'xpub': {
			// For xpub, we don't have seed, just the extended public key
			const hdkey = HDKey.fromExtendedKey(value);
			return { seed: new Uint8Array(0), hdkey };
		}
		case 'secret': {
			const seed = await generateSeedFromSecret(value);
			return { seed };
		}
		default:
			throw new Error(`Unknown input type: ${type}`);
	}
}

/**
 * Derive HD path for a given index
 */
function derivePathForIndex(basePath: string, index: number): string {
	// If basePath ends with a number without apostrophe, append /{index}
	// Otherwise, append /0/{index}
	if (/\/\d+$/.test(basePath)) {
		return `${basePath.replace(/\/\d+$/, '')}/${index}`;
	}
	return `${basePath}/${index}`;
}

/**
 * Generate Ethereum wallet from HD path
 */
function generateEthereumWallet(hdkey: HDKey, path: string, index: number): GeneratedWallet | null {
	try {
		const fullPath = derivePathForIndex(path, index);
		const derived = hdkey.derive(fullPath);

		if (!derived.privateKey) {
			console.error('No private key derived');
			return null;
		}

		const account = privateKeyToAccount(`0x${Buffer.from(derived.privateKey).toString('hex')}`);

		return {
			index,
			address: account.address,
			privateKey: `0x${Buffer.from(derived.privateKey).toString('hex')}`,
			path: fullPath,
			publicKey: derived.publicKey
				? `0x${Buffer.from(derived.publicKey).toString('hex')}`
				: undefined
		};
	} catch (error) {
		console.error('Error generating Ethereum wallet:', error);
		return null;
	}
}

/**
 * Generate Bitcoin wallet from HD path
 * Note: This is a placeholder. Full Bitcoin support requires additional libraries.
 */
function generateBitcoinWallet(hdkey: HDKey, path: string, index: number): GeneratedWallet | null {
	try {
		const fullPath = derivePathForIndex(path, index);
		const derived = hdkey.derive(fullPath);

		if (!derived.privateKey || !derived.publicKey) {
			return null;
		}

		// Placeholder: Bitcoin address generation requires additional crypto libraries
		// For now, we'll return a placeholder
		return {
			index,
			address: 'Bitcoin address generation not yet implemented',
			privateKey: Buffer.from(derived.privateKey).toString('hex'),
			path: fullPath,
			publicKey: Buffer.from(derived.publicKey).toString('hex')
		};
	} catch (error) {
		console.error('Error generating Bitcoin wallet:', error);
		return null;
	}
}

/**
 * Generate a single wallet
 */
async function generateSingleWallet(
	config: WalletGeneratorConfig,
	index: number,
	hdkey?: HDKey
): Promise<GeneratedWallet | null> {
	try {
		// Get or create HDKey
		let masterKey: HDKey;

		if (hdkey) {
			// Using xpub
			masterKey = hdkey;
		} else {
			// Generate from seed
			const { seed } = await getSeed(config.inputSource.type, config.inputSource.value);
			masterKey = HDKey.fromMasterSeed(seed);
		}

		// Generate wallet based on blockchain
		switch (config.blockchain) {
			case 'ethereum':
				return generateEthereumWallet(masterKey, config.hdPath, config.startIndex + index);
			case 'bitcoin':
				return generateBitcoinWallet(masterKey, config.hdPath, config.startIndex + index);
			default:
				throw new Error(`Unknown blockchain: ${config.blockchain}`);
		}
	} catch (error) {
		console.error('Error in generateSingleWallet:', error);
		return null;
	}
}

/**
 * Generate multiple wallets
 */
export async function generateWallets(
	config: WalletGeneratorConfig,
	onProgress?: (current: number, total: number) => void
): Promise<GeneratedWallet[]> {
	const wallets: GeneratedWallet[] = [];

	// Pre-initialize HDKey if using xpub
	let hdkey: HDKey | undefined;
	if (config.inputSource.type === 'xpub') {
		hdkey = HDKey.fromExtendedKey(config.inputSource.value);
	}

	// Generate wallets sequentially for now
	// TODO: Optimize with batching or Web Workers
	for (let i = 0; i < config.count; i++) {
		const wallet = await generateSingleWallet(config, i, hdkey);

		if (wallet) {
			wallets.push(wallet);
		}

		// Report progress
		if (onProgress) {
			onProgress(i + 1, config.count);
		}

		// Allow UI to update
		await new Promise((resolve) => setTimeout(resolve, 0));
	}

	return wallets;
}

/**
 * Batch generate wallets with chunking for better performance
 */
export async function generateWalletsBatch(
	config: WalletGeneratorConfig,
	chunkSize: number = 10,
	onProgress?: (current: number, total: number) => void
): Promise<GeneratedWallet[]> {
	const wallets: GeneratedWallet[] = [];

	// Pre-initialize HDKey if using xpub
	let hdkey: HDKey | undefined;
	if (config.inputSource.type === 'xpub') {
		hdkey = HDKey.fromExtendedKey(config.inputSource.value);
	}

	const chunks = Math.ceil(config.count / chunkSize);

	for (let chunk = 0; chunk < chunks; chunk++) {
		const chunkStart = chunk * chunkSize;
		const chunkEnd = Math.min(chunkStart + chunkSize, config.count);

		// Generate chunk of wallets
		const chunkWallets = await Promise.all(
			Array.from({ length: chunkEnd - chunkStart }, (_, i) =>
				generateSingleWallet(config, chunkStart + i, hdkey)
			)
		);

		// Filter out nulls and add to results
		wallets.push(...chunkWallets.filter((w): w is GeneratedWallet => w !== null));

		// Report progress
		if (onProgress) {
			onProgress(chunkEnd, config.count);
		}

		// Allow UI to update
		await new Promise((resolve) => setTimeout(resolve, 10));
	}

	return wallets;
}

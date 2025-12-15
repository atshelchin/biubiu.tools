import type { Address } from 'viem';
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { keccak256, toHex, recoverAddress } from 'viem';
import type { TemporaryWallet } from '../types/fee';

/**
 * Generate a random temporary wallet
 *
 * @param taskId - Unique task identifier
 * @returns Temporary wallet information
 */
export function generateTemporaryWallet(taskId: string): TemporaryWallet {
	// Generate a completely random private key
	const privateKey = generatePrivateKey();
	const account = privateKeyToAccount(privateKey);

	return {
		address: account.address,
		privateKey,
		createdAt: Date.now(),
		taskId
	};
}

/**
 * Import a temporary wallet from a private key
 *
 * @param privateKey - The private key to import (0x prefixed hex string)
 * @param taskId - Unique task identifier
 * @returns Temporary wallet information
 * @throws Error if private key is invalid
 */
export function importTemporaryWallet(privateKey: `0x${string}`, taskId: string): TemporaryWallet {
	// Validate private key format
	if (!privateKey.startsWith('0x') || privateKey.length !== 66) {
		throw new Error('Invalid private key format. Must be 0x prefixed 32-byte hex string.');
	}

	try {
		const account = privateKeyToAccount(privateKey);

		return {
			address: account.address,
			privateKey,
			createdAt: Date.now(),
			taskId
		};
	} catch (error) {
		throw new Error(
			`Failed to import private key: ${error instanceof Error ? error.message : 'Unknown error'}`
		);
	}
}

/**
 * Export temporary wallet as JSON for download
 *
 * @param wallet - The temporary wallet to export
 * @param password - Optional password to encrypt the key (not implemented yet)
 * @returns JSON string ready for download
 */
export function exportTemporaryWallet(wallet: TemporaryWallet, password?: string): string {
	// In a production app, you should encrypt the private key with the password
	// For now, we just export as-is with a warning
	const exportData = {
		address: wallet.address,
		privateKey: wallet.privateKey,
		createdAt: wallet.createdAt,
		taskId: wallet.taskId,
		warning: '⚠️ KEEP THIS FILE SECURE! Anyone with this private key can access your funds.',
		...(password ? { encrypted: false, note: 'Encryption not yet implemented' } : {})
	};

	return JSON.stringify(exportData, null, 2);
}

/**
 * Download temporary wallet as a file
 *
 * @param wallet - The temporary wallet to download
 * @param filename - Optional filename (defaults to address-based name)
 */
export function downloadTemporaryWallet(wallet: TemporaryWallet, filename?: string): void {
	const json = exportTemporaryWallet(wallet);
	const blob = new Blob([json], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = filename || `temp-wallet-${wallet.address.slice(0, 10)}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

/**
 * Verify that a signature belongs to a specific address
 *
 * @param message - Original message that was signed
 * @param signature - The signature to verify
 * @param expectedAddress - The address that should have signed the message
 * @returns True if signature is valid
 */
export async function verifySignature(
	message: string,
	signature: `0x${string}`,
	expectedAddress: Address
): Promise<boolean> {
	try {
		const recoveredAddress = await recoverAddress({
			hash: keccak256(toHex(message)),
			signature
		});

		return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
	} catch (error) {
		console.error('Signature verification failed:', error);
		return false;
	}
}

/**
 * Create a message for the user to sign to generate a temporary wallet
 *
 * @param taskId - Unique task identifier
 * @returns Message string to be signed
 */
export function createTemporaryWalletSignMessage(taskId: string): string {
	return `Create temporary wallet for Token Sweep task: ${taskId}\n\nThis signature will generate a temporary wallet for automated batch transactions.\n\nTimestamp: ${Date.now()}`;
}

/**
 * Store temporary wallet in session storage (browser memory only)
 *
 * @param wallet - The temporary wallet to store
 */
export function storeTemporaryWallet(wallet: TemporaryWallet): void {
	const key = `temp_wallet_${wallet.taskId}`;
	sessionStorage.setItem(key, JSON.stringify(wallet));
}

/**
 * Retrieve temporary wallet from session storage
 *
 * @param taskId - The task ID to retrieve wallet for
 * @returns Temporary wallet or null if not found
 */
export function retrieveTemporaryWallet(taskId: string): TemporaryWallet | null {
	const key = `temp_wallet_${taskId}`;
	const stored = sessionStorage.getItem(key);

	if (!stored) return null;

	try {
		return JSON.parse(stored) as TemporaryWallet;
	} catch (error) {
		console.error('Failed to parse temporary wallet:', error);
		return null;
	}
}

/**
 * Clear temporary wallet from session storage
 *
 * @param taskId - The task ID to clear
 */
export function clearTemporaryWallet(taskId: string): void {
	const key = `temp_wallet_${taskId}`;
	sessionStorage.removeItem(key);
}

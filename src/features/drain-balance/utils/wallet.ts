import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';
import { isAddress, type Address, type Hex } from 'viem';

/**
 * Validate if a string is a valid private key
 */
export function validatePrivateKey(key: string): boolean {
	try {
		// Remove 0x prefix if present
		const cleanKey = key.startsWith('0x') ? key : `0x${key}`;

		// Check if it's a valid hex string and has correct length (32 bytes = 64 hex chars)
		if (!/^0x[0-9a-fA-F]{64}$/.test(cleanKey)) {
			return false;
		}

		// Try to create an account from the private key
		privateKeyToAccount(cleanKey as Hex);
		return true;
	} catch {
		return false;
	}
}

/**
 * Get address from private key
 */
export function getAddressFromPrivateKey(privateKey: string): Address {
	try {
		const cleanKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
		const account = privateKeyToAccount(cleanKey as Hex);
		return account.address;
	} catch (error) {
		throw new Error(`Invalid private key: ${error}`);
	}
}

/**
 * Create account from private key
 */
export function createAccount(privateKey: string): PrivateKeyAccount {
	const cleanKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
	return privateKeyToAccount(cleanKey as Hex);
}

/**
 * Validate Ethereum address
 */
export function validateAddress(address: string): boolean {
	return isAddress(address);
}

/**
 * Format private key for display (show only first and last few characters)
 */
export function formatPrivateKey(privateKey: string): string {
	if (!privateKey) return '';
	const cleanKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
	if (cleanKey.length < 20) return cleanKey;
	return `${cleanKey.slice(0, 6)}...${cleanKey.slice(-4)}`;
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
	if (!address) return '';
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

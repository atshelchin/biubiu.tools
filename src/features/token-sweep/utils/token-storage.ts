import type { ERC20Token, CustomTokenStorage } from '$lib/types/token';

const STORAGE_KEY = 'token-sweep:custom-tokens';
const STORAGE_VERSION = 1;

/**
 * Load custom tokens from localStorage
 * @param chainId - Optional chain ID to filter tokens
 */
export function loadCustomTokens(chainId?: number): ERC20Token[] {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return [];

		const data: CustomTokenStorage = JSON.parse(stored);

		// Version check for future migrations
		if (data.version !== STORAGE_VERSION) {
			console.warn('Custom tokens storage version mismatch, resetting...');
			return [];
		}

		const tokens = data.tokens || [];

		// Filter by chain ID if provided
		if (chainId !== undefined) {
			return tokens.filter((t) => t.chainId === chainId);
		}

		return tokens;
	} catch (error) {
		console.error('Failed to load custom tokens:', error);
		return [];
	}
}

/**
 * Save custom tokens to localStorage
 */
export function saveCustomTokens(tokens: ERC20Token[]): void {
	try {
		const data: CustomTokenStorage = {
			tokens,
			version: STORAGE_VERSION
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch (error) {
		console.error('Failed to save custom tokens:', error);
	}
}

/**
 * Add a custom token
 */
export function addCustomToken(token: ERC20Token): void {
	const tokens = loadCustomTokens();

	// Check if token already exists
	const exists = tokens.some((t) => t.id === token.id);
	if (exists) {
		console.warn('Token already exists:', token.id);
		return;
	}

	tokens.push({ ...token, isCustom: true });
	saveCustomTokens(tokens);
}

/**
 * Remove a custom token
 */
export function removeCustomToken(tokenId: string): void {
	const tokens = loadCustomTokens();
	const filtered = tokens.filter((t) => t.id !== tokenId);
	saveCustomTokens(filtered);
}

/**
 * Check if a token is custom (user-added)
 */
export function isCustomToken(tokenId: string): boolean {
	const tokens = loadCustomTokens();
	return tokens.some((t) => t.id === tokenId);
}

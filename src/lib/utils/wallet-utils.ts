/**
 * Wallet utility functions
 * Pure functions for wallet-related operations
 */

/**
 * Format blockchain address for display
 * @param addr - Full blockchain address
 * @returns Shortened address (e.g., "0x1234...5678")
 */
export function formatAddress(addr: string): string {
	return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/**
 * Parse wallet connection errors into user-friendly messages
 * @param error - Error from wallet connection/switching
 * @param selectedChainId - The chain ID user tried to connect to
 * @param networkName - Name of the network (optional)
 * @returns User-friendly error message
 */
export function parseWalletError(
	error: unknown,
	selectedChainId: number,
	networkName?: string
): string {
	if (error instanceof Error) {
		const errorMessage = error.message;

		// Chain not supported error
		if (errorMessage.includes('is not supported by this connector')) {
			const chainIdMatch = errorMessage.match(/Chain \[(\d+)\]/);
			const connectorMatch = errorMessage.match(/connector \[(.*?)\]/);

			const chainId = chainIdMatch ? chainIdMatch[1] : selectedChainId.toString();
			const connectorName = connectorMatch ? connectorMatch[1] : 'Your wallet';

			return `${connectorName} doesn't support ${networkName || `Chain ${chainId}`}. Please try a different wallet or select another network that your wallet supports.`;
		}

		// User rejected request
		if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
			return 'Connection request was rejected. Please try again when you are ready.';
		}

		// Network switch error
		if (errorMessage.includes('switch') || errorMessage.includes('Switch')) {
			return `Failed to switch to ${networkName || 'the selected network'}. Please try switching manually in your wallet settings.`;
		}

		// Generic error with message
		return `Failed to connect: ${errorMessage}`;
	}

	// Unknown error type
	return 'An unexpected error occurred. Please try again or contact support.';
}

/**
 * Format wei balance to readable format
 * @param balance - Balance in wei (bigint)
 * @param decimals - Number of decimal places (default: 4)
 * @returns Formatted balance string
 */
export function formatBalance(balance: bigint, decimals: number = 4): string {
	const formatted = (Number(balance) / 1e18).toFixed(decimals);
	return formatted;
}

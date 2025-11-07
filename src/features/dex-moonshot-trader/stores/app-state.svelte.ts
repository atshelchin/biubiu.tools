import type { Address } from 'viem';
import type { TokenInfo } from '../types/token';
import type { TradeType } from '../types/trade';

/**
 * Global app state for the DEX Moonshot Trader
 */
class AppState {
	// Step 1: Network & Wallet
	selectedChainId = $state<number | null>(null);
	connectedWallet = $state<Address | null>(null);

	// Step 2: Token Information
	tokenAddress = $state<Address | null>(null);
	tokenInfo = $state<TokenInfo | null>(null);

	// Step 3: Trade State
	activeTradeType = $state<TradeType>('buy');
	tradeAmount = $state<string>('');
	slippage = $state<number>(0.5); // Default 0.5%

	// Reset token and trade state (used when going back to Step 2)
	resetTokenState() {
		this.tokenAddress = null;
		this.tokenInfo = null;
		this.resetTradeState();
	}

	// Reset trade state (used when switching trade type)
	resetTradeState() {
		this.tradeAmount = '';
	}

	// Reset all state
	resetAll() {
		this.selectedChainId = null;
		this.connectedWallet = null;
		this.resetTokenState();
	}
}

// Create singleton instance
export const appState = new AppState();

import type { Address } from 'viem';
import type { NativeToken, ERC20Token } from '$lib/types/token';
import type { WalletBalance, ScanStatus, ScanProgress, ScanSummary } from '../types/scanner';
import { SvelteSet, SvelteMap } from 'svelte/reactivity';

/**
 * Module-level state for Token Balance Scanner
 * Shared across all components
 */
class ScannerState {
	// Step 2: Networks & Tokens
	selectedTokens = $state(new SvelteSet<string>()); // token IDs
	tokens = $state<(NativeToken | ERC20Token)[]>([]);

	// Step 3: Wallets
	wallets = $state<Address[]>([]);
	walletLabels = $state(new SvelteMap<Address, string>());

	// Step 4 & 5: Scan results
	scanStatus = $state<ScanStatus>('idle');
	scanProgress = $state<ScanProgress>({
		current: 0,
		total: 0,
		percentage: 0
	});
	balances = $state<WalletBalance[]>([]);
	summary = $state<ScanSummary | null>(null);
	error = $state<string | null>(null);

	// Reset all state
	reset() {
		this.selectedTokens.clear();
		this.tokens = [];
		this.wallets = [];
		this.walletLabels.clear();
		this.scanStatus = 'idle';
		this.scanProgress = { current: 0, total: 0, percentage: 0 };
		this.balances = [];
		this.summary = null;
		this.error = null;
	}

	// Add wallet
	addWallet(address: Address, label?: string) {
		if (!this.wallets.includes(address)) {
			this.wallets = [...this.wallets, address];
			if (label) {
				this.walletLabels.set(address, label);
			}
		}
	}

	// Remove wallet
	removeWallet(address: Address) {
		this.wallets = this.wallets.filter((w) => w !== address);
		this.walletLabels.delete(address);
	}

	// Toggle token selection
	toggleToken(tokenId: string) {
		if (this.selectedTokens.has(tokenId)) {
			this.selectedTokens.delete(tokenId);
		} else {
			this.selectedTokens.add(tokenId);
		}
	}

	// Get selected tokens
	getSelectedTokens(): (NativeToken | ERC20Token)[] {
		return this.tokens.filter((t) => this.selectedTokens.has(t.id));
	}

	// Add token
	addToken(tokenId: string) {
		this.selectedTokens.add(tokenId);
	}

	// Remove token
	removeToken(tokenId: string) {
		this.selectedTokens.delete(tokenId);
	}

	// Clear all tokens
	clearTokens() {
		this.selectedTokens.clear();
	}

	// Clear all wallets
	clearWallets() {
		this.wallets = [];
		this.walletLabels.clear();
	}

	// Set scan status
	setScanStatus(status: ScanStatus) {
		this.scanStatus = status;
	}

	// Set error
	setError(error: string | null) {
		this.error = error;
	}

	// Set progress
	setProgress(progress: ScanProgress) {
		this.scanProgress = progress;
	}

	// Get progress
	get progress() {
		return this.scanProgress;
	}

	// Set balances
	setBalances(balances: WalletBalance[]) {
		this.balances = balances;
	}
}

export const scannerState = new ScannerState();

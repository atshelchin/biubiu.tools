import type { TokenAdvancedParams } from '../types/token';
import type { Address } from 'viem';

interface Step3State extends TokenAdvancedParams {
	// All properties from TokenAdvancedParams
}

function createStep3State(): Step3State {
	// Supply management
	let maxSupply = $state<string | undefined>('');
	let mintable = $state(false);
	let burnable = $state(false);

	// Access control
	let pausable = $state(false);
	let blacklistable = $state(false);

	// Tax/Fee
	let taxEnabled = $state(false);
	let buyTax = $state<number | undefined>(0);
	let sellTax = $state<number | undefined>(0);
	let taxReceiver = $state<Address | undefined>(undefined);

	// Anti-bot
	let maxTransactionAmount = $state<string | undefined>('');
	let maxWalletAmount = $state<string | undefined>('');
	let tradingDelay = $state<number | undefined>(0);

	return {
		get maxSupply() {
			return maxSupply;
		},
		set maxSupply(value: string | undefined) {
			maxSupply = value;
		},
		get mintable() {
			return mintable;
		},
		set mintable(value: boolean) {
			mintable = value;
		},
		get burnable() {
			return burnable;
		},
		set burnable(value: boolean) {
			burnable = value;
		},
		get pausable() {
			return pausable;
		},
		set pausable(value: boolean) {
			pausable = value;
		},
		get blacklistable() {
			return blacklistable;
		},
		set blacklistable(value: boolean) {
			blacklistable = value;
		},
		get taxEnabled() {
			return taxEnabled;
		},
		set taxEnabled(value: boolean) {
			taxEnabled = value;
		},
		get buyTax() {
			return buyTax;
		},
		set buyTax(value: number | undefined) {
			buyTax = value;
		},
		get sellTax() {
			return sellTax;
		},
		set sellTax(value: number | undefined) {
			sellTax = value;
		},
		get taxReceiver() {
			return taxReceiver;
		},
		set taxReceiver(value: Address | undefined) {
			taxReceiver = value;
		},
		get maxTransactionAmount() {
			return maxTransactionAmount;
		},
		set maxTransactionAmount(value: string | undefined) {
			maxTransactionAmount = value;
		},
		get maxWalletAmount() {
			return maxWalletAmount;
		},
		set maxWalletAmount(value: string | undefined) {
			maxWalletAmount = value;
		},
		get tradingDelay() {
			return tradingDelay;
		},
		set tradingDelay(value: number | undefined) {
			tradingDelay = value;
		}
	};
}

export const step3State = createStep3State();

// Validation helpers
export function validateStep3(): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];

	// Validate max supply
	if (step3State.maxSupply && step3State.maxSupply.trim()) {
		const supply = parseFloat(step3State.maxSupply);
		if (isNaN(supply) || supply <= 0) {
			errors.push('Max supply must be a positive number');
		}
	}

	// Validate tax parameters
	if (step3State.taxEnabled) {
		if (step3State.buyTax !== undefined && (step3State.buyTax < 0 || step3State.buyTax > 100)) {
			errors.push('Buy tax must be between 0 and 100');
		}
		if (step3State.sellTax !== undefined && (step3State.sellTax < 0 || step3State.sellTax > 100)) {
			errors.push('Sell tax must be between 0 and 100');
		}
		if (!step3State.taxReceiver) {
			errors.push('Tax receiver address is required when tax is enabled');
		}
	}

	// Validate anti-bot parameters
	if (step3State.maxTransactionAmount && step3State.maxTransactionAmount.trim()) {
		const amount = parseFloat(step3State.maxTransactionAmount);
		if (isNaN(amount) || amount <= 0) {
			errors.push('Max transaction amount must be a positive number');
		}
	}

	if (step3State.maxWalletAmount && step3State.maxWalletAmount.trim()) {
		const amount = parseFloat(step3State.maxWalletAmount);
		if (isNaN(amount) || amount <= 0) {
			errors.push('Max wallet amount must be a positive number');
		}
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}

export function getAdvancedParams(): TokenAdvancedParams {
	return {
		maxSupply: step3State.maxSupply,
		mintable: step3State.mintable,
		burnable: step3State.burnable,
		pausable: step3State.pausable,
		blacklistable: step3State.blacklistable,
		taxEnabled: step3State.taxEnabled,
		buyTax: step3State.taxEnabled ? step3State.buyTax : undefined,
		sellTax: step3State.taxEnabled ? step3State.sellTax : undefined,
		taxReceiver: step3State.taxEnabled ? step3State.taxReceiver : undefined,
		maxTransactionAmount: step3State.maxTransactionAmount,
		maxWalletAmount: step3State.maxWalletAmount,
		tradingDelay: step3State.tradingDelay
	};
}

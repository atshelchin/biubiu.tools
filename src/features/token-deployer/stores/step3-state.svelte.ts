import type { TokenBasicConfig } from '../types/token';

interface Step3State {
	name: string;
	symbol: string;
	decimals: number;
	initialSupply: string;
	mintable: boolean;
}

function createStep3State(): Step3State {
	let name = $state('');
	let symbol = $state('');
	let decimals = $state(18);
	let initialSupply = $state('');
	let mintable = $state(false);

	return {
		get name() {
			return name;
		},
		set name(value: string) {
			name = value;
		},
		get symbol() {
			return symbol;
		},
		set symbol(value: string) {
			symbol = value;
		},
		get decimals() {
			return decimals;
		},
		set decimals(value: number) {
			decimals = value;
		},
		get initialSupply() {
			return initialSupply;
		},
		set initialSupply(value: string) {
			initialSupply = value;
		},
		get mintable() {
			return mintable;
		},
		set mintable(value: boolean) {
			mintable = value;
		}
	};
}

export const step3State = createStep3State();

// Validation helpers
export function validateStep3(): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!step3State.name.trim()) {
		errors.push('Token name is required');
	}

	if (!step3State.symbol.trim()) {
		errors.push('Token symbol is required');
	}

	if (step3State.decimals < 0 || step3State.decimals > 18) {
		errors.push('Decimals must be between 0 and 18');
	}

	if (!step3State.initialSupply.trim()) {
		errors.push('Initial supply is required');
	} else {
		const supply = parseFloat(step3State.initialSupply);
		if (isNaN(supply) || supply <= 0) {
			errors.push('Initial supply must be a positive number');
		}
	}

	return {
		isValid: errors.length === 0,
		errors
	};
}

export function getBasicConfig(): TokenBasicConfig {
	return {
		name: step3State.name,
		symbol: step3State.symbol,
		decimals: step3State.decimals,
		initialSupply: step3State.initialSupply
	};
}

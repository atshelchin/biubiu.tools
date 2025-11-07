import type { TokenBasicConfig } from '../types/token';

interface Step2State {
	name: string;
	symbol: string;
	decimals: number;
	initialSupply: string;
}

function createStep2State(): Step2State {
	let name = $state('');
	let symbol = $state('');
	let decimals = $state(18);
	let initialSupply = $state('');

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
		}
	};
}

export const step2State = createStep2State();

// Validation helpers
export function validateStep2(): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (!step2State.name.trim()) {
		errors.push('Token name is required');
	}

	if (!step2State.symbol.trim()) {
		errors.push('Token symbol is required');
	}

	if (step2State.decimals < 0 || step2State.decimals > 18) {
		errors.push('Decimals must be between 0 and 18');
	}

	if (!step2State.initialSupply.trim()) {
		errors.push('Initial supply is required');
	} else {
		const supply = parseFloat(step2State.initialSupply);
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
		name: step2State.name,
		symbol: step2State.symbol,
		decimals: step2State.decimals,
		initialSupply: step2State.initialSupply
	};
}

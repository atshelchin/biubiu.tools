import type { NFTBasicConfig } from '../types/nft';

/**
 * Step 3 state - NFT Basic Configuration
 */
class Step3State {
	name = $state<string>('');
	symbol = $state<string>('');
	description = $state<string>('');
	baseUri = $state<string>('');

	reset() {
		this.name = '';
		this.symbol = '';
		this.description = '';
		this.baseUri = '';
	}

	isValid(): boolean {
		return (
			this.name.trim().length > 0 &&
			this.symbol.trim().length > 0 &&
			this.description.trim().length > 0
		);
	}

	getConfig(): NFTBasicConfig {
		return {
			name: this.name.trim(),
			symbol: this.symbol.trim().toUpperCase(),
			description: this.description.trim(),
			baseUri: this.baseUri.trim() || undefined
		};
	}
}

export const step3State = new Step3State();

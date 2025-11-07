import type { NFTStandard } from '../types/nft';

/**
 * Step 2 state - NFT Standard Selection
 */
class Step2State {
	selectedStandard = $state<NFTStandard | null>(null);

	reset() {
		this.selectedStandard = null;
	}

	isValid(): boolean {
		return this.selectedStandard !== null;
	}
}

export const step2State = new Step2State();

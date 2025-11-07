import type { NativeToken, ERC20Token } from '$lib/types/token';
import type { DistributionAmountMode } from '@/features/token-distribution/types/distribution';

/**
 * Module-level state for Step 3 (Select Token & Amount)
 * Shared across all step components
 */
class Step3State {
	selectedToken = $state<NativeToken | ERC20Token | null>(null);
	amountMode = $state<DistributionAmountMode>('equal');
	amountPerRecipient = $state<string>('');
	totalAmount = $state<string>('');

	reset() {
		this.selectedToken = null;
		this.amountMode = 'equal';
		this.amountPerRecipient = '';
		this.totalAmount = '';
	}

	get isValid(): boolean {
		if (!this.selectedToken) return false;
		if (this.amountMode === 'equal') {
			return this.amountPerRecipient !== '' && parseFloat(this.amountPerRecipient) > 0;
		}
		// For custom mode, amounts are set per recipient in Step 4
		return true;
	}
}

export const step3State = new Step3State();

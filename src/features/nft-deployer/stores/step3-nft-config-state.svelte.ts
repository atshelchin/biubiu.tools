import type { Address } from 'viem';

/**
 * Step 3 state - NFT Configuration
 * Based on NFTFactory createERC721 parameters
 */
class Step3NFTConfigState {
	// Basic NFT info
	name = $state<string>('');
	symbol = $state<string>('');
	baseURI = $state<string>('');

	// Mint settings
	publicMintEnabled = $state<boolean>(true);

	// Stake-to-mint settings
	stakeToMintEnabled = $state<boolean>(false);
	stakeToken = $state<string>('');
	stakeAmount = $state<string>('');

	reset() {
		this.name = '';
		this.symbol = '';
		this.baseURI = '';
		this.publicMintEnabled = true;
		this.stakeToMintEnabled = false;
		this.stakeToken = '';
		this.stakeAmount = '';
	}

	isValid(): boolean {
		// Basic validation
		if (!this.name || this.name.trim().length === 0) {
			return false;
		}
		if (!this.symbol || this.symbol.trim().length === 0) {
			return false;
		}
		if (!this.baseURI || this.baseURI.trim().length === 0) {
			return false;
		}

		// Stake-to-mint validation
		if (this.stakeToMintEnabled) {
			if (!this.stakeToken || this.stakeToken.length !== 42) {
				return false;
			}
			if (!this.stakeAmount || this.stakeAmount === '0') {
				return false;
			}
		}

		return true;
	}

	getConfig() {
		return {
			name: this.name,
			symbol: this.symbol,
			baseURI: this.baseURI,
			publicMintEnabled: this.publicMintEnabled,
			stakeToMintEnabled: this.stakeToMintEnabled,
			stakeToken: this.stakeToMintEnabled
				? (this.stakeToken as Address)
				: ('0x0000000000000000000000000000000000000000' as Address),
			stakeAmount: this.stakeToMintEnabled ? BigInt(this.stakeAmount) : BigInt(0)
		};
	}
}

export const step3NFTConfigState = new Step3NFTConfigState();

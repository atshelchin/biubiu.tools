import type { Address } from 'viem';
import type { NFTAdvancedSettings } from '../types/nft';

/**
 * Step 4 state - NFT Advanced Settings
 */
class Step4State {
	// Supply & Pricing
	maxSupply = $state<number>(0); // 0 = unlimited
	mintPrice = $state<string>('0');
	maxMintPerWallet = $state<number>(0); // 0 = unlimited

	// Royalties
	royaltyEnabled = $state<boolean>(false);
	royaltyRecipient = $state<string>('');
	royaltyPercentage = $state<number>(5); // Default 5%

	// Access Control
	ownerMintOnly = $state<boolean>(false);
	publicMintEnabled = $state<boolean>(true);
	whitelistEnabled = $state<boolean>(false);

	// Features
	pausable = $state<boolean>(false);
	burnable = $state<boolean>(false);
	revealable = $state<boolean>(false);

	// Stake-to-mint
	stakeToMintEnabled = $state<boolean>(false);
	stakeToken = $state<string>('');
	stakeAmount = $state<string>('');

	// ERC1155 specific
	fungible = $state<boolean>(false);

	reset() {
		this.maxSupply = 0;
		this.mintPrice = '0';
		this.maxMintPerWallet = 0;
		this.royaltyEnabled = false;
		this.royaltyRecipient = '';
		this.royaltyPercentage = 5;
		this.ownerMintOnly = false;
		this.publicMintEnabled = true;
		this.whitelistEnabled = false;
		this.pausable = false;
		this.burnable = false;
		this.revealable = false;
		this.stakeToMintEnabled = false;
		this.stakeToken = '';
		this.stakeAmount = '';
		this.fungible = false;
	}

	isValid(): boolean {
		// Validate royalty settings if enabled
		if (this.royaltyEnabled) {
			if (!this.royaltyRecipient || this.royaltyRecipient.length !== 42) {
				return false;
			}
			if (this.royaltyPercentage < 0 || this.royaltyPercentage > 100) {
				return false;
			}
		}

		// Validate stake-to-mint settings if enabled
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

	getSettings(): NFTAdvancedSettings {
		return {
			maxSupply: this.maxSupply > 0 ? this.maxSupply : undefined,
			mintPrice: this.mintPrice !== '0' ? this.mintPrice : undefined,
			maxMintPerWallet: this.maxMintPerWallet > 0 ? this.maxMintPerWallet : undefined,
			royaltyEnabled: this.royaltyEnabled,
			royaltyRecipient: this.royaltyEnabled ? (this.royaltyRecipient as Address) : undefined,
			royaltyPercentage: this.royaltyEnabled ? this.royaltyPercentage : undefined,
			ownerMintOnly: this.ownerMintOnly,
			publicMintEnabled: this.publicMintEnabled,
			whitelistEnabled: this.whitelistEnabled,
			pausable: this.pausable,
			burnable: this.burnable,
			revealable: this.revealable,
			stakeToMintEnabled: this.stakeToMintEnabled,
			stakeToken: this.stakeToMintEnabled ? (this.stakeToken as Address) : undefined,
			stakeAmount: this.stakeToMintEnabled ? this.stakeAmount : undefined,
			fungible: this.fungible
		};
	}
}

export const step4State = new Step4State();

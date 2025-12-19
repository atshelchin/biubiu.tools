import type {
	NativeToken,
	ERC20Token,
	ERC721Token,
	ERC1155Token,
	AnyToken
} from '$lib/types/token';
import type {
	DistributionAmountMode,
	DistributionTokenType
} from '@/features/token-distribution/types/distribution';

/**
 * Module-level state for Step 3 (Select Token Type & Token)
 * Shared across all step components
 */

// Token type selection (first level)
let tokenType = $state<DistributionTokenType>('native');

// Selected token (second level)
let selectedToken = $state<AnyToken | null>(null);

// Distribution mode (for fungible tokens: native, erc20)
let amountMode = $state<DistributionAmountMode>('equal');

// Amount per recipient (for equal mode)
let amountPerRecipient = $state<string>('');

// Total amount (calculated or input)
let totalAmount = $state<string>('');

// Custom NFT contract address (for ERC721/ERC1155)
let customNftAddress = $state<string>('');

// Custom NFT token IDs (comma-separated for multiple)
let customNftTokenIds = $state<string>('');

// Custom NFT validation state
let customNftError = $state<string>('');
let customNftLoading = $state<boolean>(false);

export const step3State = {
	// Token type getters/setters
	get tokenType() {
		return tokenType;
	},
	set tokenType(value: DistributionTokenType) {
		tokenType = value;
		// Reset selected token when type changes
		selectedToken = null;
		amountPerRecipient = '';
		totalAmount = '';
		customNftAddress = '';
		customNftTokenIds = '';
		customNftError = '';
	},

	// Selected token getters/setters
	get selectedToken() {
		return selectedToken;
	},
	set selectedToken(value: AnyToken | null) {
		selectedToken = value;
	},

	// Amount mode getters/setters
	get amountMode() {
		return amountMode;
	},
	set amountMode(value: DistributionAmountMode) {
		amountMode = value;
		if (value !== 'equal') {
			amountPerRecipient = '';
			totalAmount = '';
		}
	},

	// Amount per recipient
	get amountPerRecipient() {
		return amountPerRecipient;
	},
	set amountPerRecipient(value: string) {
		amountPerRecipient = value;
	},

	// Total amount
	get totalAmount() {
		return totalAmount;
	},
	set totalAmount(value: string) {
		totalAmount = value;
	},

	// Custom NFT address
	get customNftAddress() {
		return customNftAddress;
	},
	set customNftAddress(value: string) {
		customNftAddress = value;
		customNftError = '';
	},

	// Custom NFT token IDs
	get customNftTokenIds() {
		return customNftTokenIds;
	},
	set customNftTokenIds(value: string) {
		customNftTokenIds = value;
	},

	// Custom NFT error
	get customNftError() {
		return customNftError;
	},
	set customNftError(value: string) {
		customNftError = value;
	},

	// Custom NFT loading
	get customNftLoading() {
		return customNftLoading;
	},
	set customNftLoading(value: boolean) {
		customNftLoading = value;
	},

	/**
	 * Reset state (called when network changes or step reset)
	 */
	reset() {
		tokenType = 'native';
		selectedToken = null;
		amountMode = 'equal';
		amountPerRecipient = '';
		totalAmount = '';
		customNftAddress = '';
		customNftTokenIds = '';
		customNftError = '';
		customNftLoading = false;
	},

	/**
	 * Check if the current selection is valid to proceed
	 */
	get isValid(): boolean {
		if (!selectedToken) return false;

		// For NFTs (ERC721/ERC1155), just need a token selected
		if (tokenType === 'erc721' || tokenType === 'erc1155') {
			return true;
		}

		// For fungible tokens (native/erc20)
		if (amountMode === 'equal') {
			return amountPerRecipient !== '' && parseFloat(amountPerRecipient) > 0;
		}

		// For custom/random mode, amounts are set per recipient in Step 4
		return true;
	},

	/**
	 * Check if current token type is fungible (has amounts)
	 */
	get isFungible(): boolean {
		return tokenType === 'native' || tokenType === 'erc20';
	},

	/**
	 * Check if current token type is NFT
	 */
	get isNFT(): boolean {
		return tokenType === 'erc721' || tokenType === 'erc1155';
	},

	/**
	 * Get selected token as specific type (type guards)
	 */
	getAsNative(): NativeToken | null {
		return selectedToken?.type === 'native' ? (selectedToken as NativeToken) : null;
	},

	getAsERC20(): ERC20Token | null {
		return selectedToken?.type === 'erc20' ? (selectedToken as ERC20Token) : null;
	},

	getAsERC721(): ERC721Token | null {
		return selectedToken?.type === 'erc721' ? (selectedToken as ERC721Token) : null;
	},

	getAsERC1155(): ERC1155Token | null {
		return selectedToken?.type === 'erc1155' ? (selectedToken as ERC1155Token) : null;
	}
};

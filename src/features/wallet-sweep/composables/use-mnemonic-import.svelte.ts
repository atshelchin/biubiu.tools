import { validateMnemonicPhrase } from '@/features/wallet-sweep/utils/wallet-import';
import { useWalletGeneration } from './use-wallet-generation.svelte';
import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';
import type { DerivationPathType } from '@/features/wallet-sweep/types/wallet';
import type { WalletGenerationRequest } from '$lib/workers/wallet-import.worker';

// Helper to get current year without triggering Date reactivity warning
const getCurrentYear = () => {
	const date = new Date();
	return date.getFullYear();
};

import type { TranslationKeys } from '@shelchin/i18n';

export function useMnemonicImport(
	t: (key: keyof TranslationKeys, params?: Record<string, string | number>) => string
) {
	const walletGeneration = useWalletGeneration();

	// State
	let mnemonicText = $state('');
	let pathType = $state<DerivationPathType>('sequential');
	let startIndex = $state(0);
	let endIndex = $state(999);
	let startYear = $state(getCurrentYear() - 10);
	let endYear = $state(getCurrentYear());
	let includeMonth = $state(false);
	let includeDay = $state(false);
	let useLeadingZeros = $state(true);
	let isGenerating = $state(false);
	let generationProgress = $state(0);
	let errorMessage = $state('');

	async function generateAddresses() {
		if (!mnemonicText.trim()) {
			errorMessage = t('wallet-sweep.step4.content.mnemonic.error_empty');
			return { success: false };
		}

		if (!validateMnemonicPhrase(mnemonicText.trim())) {
			errorMessage = t('wallet-sweep.step4.content.mnemonic.error_invalid');
			return { success: false };
		}

		// Clear existing wallets before generating new ones
		step4State.clearWallets();

		isGenerating = true;
		generationProgress = 0;
		errorMessage = '';

		try {
			// Prepare request data
			let requestData: WalletGenerationRequest;
			let totalAddresses = 0;

			if (pathType === 'sequential') {
				// Sequential mode validation
				if (startIndex < 0 || endIndex < startIndex) {
					errorMessage = t('wallet-sweep.step4.content.mnemonic.error_range');
					isGenerating = false;
					return { success: false };
				}

				totalAddresses = endIndex - startIndex + 1;

				requestData = {
					mnemonic: mnemonicText.trim(),
					pathType: 'sequential' as const,
					startIndex,
					endIndex,
					batchSize: 50
				};
			} else {
				// Date mode
				const startDate = `${startYear}-01-01`;
				const endDateStr = `${endYear}-12-31`;

				// Determine date format based on granularity
				let dateFormat: 'yyyy' | 'yyyymm' | 'yyyym' | 'yyyymmdd' | 'yyyymdd';
				if (!includeMonth && !includeDay) {
					dateFormat = 'yyyy';
					totalAddresses = endYear - startYear + 1;
				} else if (includeMonth && !includeDay) {
					dateFormat = useLeadingZeros ? 'yyyymm' : 'yyyym';
					totalAddresses = (endYear - startYear + 1) * 12;
				} else {
					dateFormat = useLeadingZeros ? 'yyyymmdd' : 'yyyymdd';
					// Estimate days (rough calculation)
					/* eslint-disable svelte/prefer-svelte-reactivity -- local variables, not reactive state */
					const start = new Date(startDate);
					const end = new Date(endDateStr);
					/* eslint-enable svelte/prefer-svelte-reactivity */
					totalAddresses = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
				}

				requestData = {
					mnemonic: mnemonicText.trim(),
					pathType: 'date' as const,
					startDate,
					endDate: endDateStr,
					dateFormat,
					batchSize: 50
				};
			}

			// Generate wallets using composable
			const result = await walletGeneration.generateFromMnemonic(
				requestData,
				totalAddresses,
				(p) => (generationProgress = p)
			);

			if (result.error) {
				errorMessage = result.error;
				return { success: false };
			} else {
				// Add wallets (without privateKey field - already stored in walletKeysStore)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				step4State.addWallets(result.wallets.map(({ privateKey: _pk, ...wallet }) => wallet));
				return { success: true, walletCount: result.wallets.length };
			}
		} catch (error) {
			errorMessage =
				error instanceof Error
					? error.message
					: t('wallet-sweep.step4.content.errors.generate_failed');
			return { success: false };
		} finally {
			isGenerating = false;
			generationProgress = 0;
		}
	}

	function reset() {
		mnemonicText = '';
		pathType = 'sequential';
		startIndex = 0;
		endIndex = 999;
		startYear = getCurrentYear() - 10;
		endYear = getCurrentYear();
		includeMonth = false;
		includeDay = false;
		useLeadingZeros = true;
		isGenerating = false;
		generationProgress = 0;
		errorMessage = '';
	}

	function clearError() {
		errorMessage = '';
	}

	return {
		// State getters
		get mnemonicText() {
			return mnemonicText;
		},
		set mnemonicText(value: string) {
			mnemonicText = value;
		},
		get pathType() {
			return pathType;
		},
		set pathType(value: DerivationPathType) {
			pathType = value;
		},
		get startIndex() {
			return startIndex;
		},
		set startIndex(value: number) {
			startIndex = value;
		},
		get endIndex() {
			return endIndex;
		},
		set endIndex(value: number) {
			endIndex = value;
		},
		get startYear() {
			return startYear;
		},
		set startYear(value: number) {
			startYear = value;
		},
		get endYear() {
			return endYear;
		},
		set endYear(value: number) {
			endYear = value;
		},
		get includeMonth() {
			return includeMonth;
		},
		set includeMonth(value: boolean) {
			includeMonth = value;
		},
		get includeDay() {
			return includeDay;
		},
		set includeDay(value: boolean) {
			includeDay = value;
		},
		get useLeadingZeros() {
			return useLeadingZeros;
		},
		set useLeadingZeros(value: boolean) {
			useLeadingZeros = value;
		},
		get isGenerating() {
			return isGenerating;
		},
		get generationProgress() {
			return generationProgress;
		},
		get errorMessage() {
			return errorMessage;
		},

		// Actions
		generateAddresses,
		reset,
		clearError
	};
}

export type MnemonicImportInstance = ReturnType<typeof useMnemonicImport>;

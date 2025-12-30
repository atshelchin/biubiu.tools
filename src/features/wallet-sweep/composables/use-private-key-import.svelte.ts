import { useWalletGeneration } from './use-wallet-generation.svelte';
import { step4State } from '@/features/wallet-sweep/stores/step4-state.svelte';

interface InvalidPrivateKey {
	key: string;
	reason?: string;
}

import type { TranslationKeys } from '@shelchin/i18n';

export function usePrivateKeyImport(
	t: (key: keyof TranslationKeys, params?: Record<string, string | number>) => string
) {
	const walletGeneration = useWalletGeneration();

	// State
	let privateKeysText = $state('');
	let isGenerating = $state(false);
	let generationProgress = $state(0);
	let errorMessage = $state('');
	let invalidPrivateKeys = $state<InvalidPrivateKey[]>([]);

	// Track if we've had errors before (to detect when user fixes them)
	let hadErrors = $state(false);
	let autoRetryTimeout: ReturnType<typeof setTimeout> | null = null;

	// Watch for error fixes and auto-retry import
	$effect(() => {
		const currentLines = privateKeysText
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

		// Check if any invalid keys have been fixed
		if (hadErrors && invalidPrivateKeys.length > 0) {
			const stillInvalid = invalidPrivateKeys.filter((invalidKey) =>
				currentLines.includes(invalidKey.key.trim())
			);

			// If some errors were removed (user fixed them), auto-retry
			if (stillInvalid.length < invalidPrivateKeys.length) {
				// Clear previous timeout
				if (autoRetryTimeout) {
					clearTimeout(autoRetryTimeout);
				}

				// Debounce auto-retry (wait 1 second after last edit)
				autoRetryTimeout = setTimeout(() => {
					importPrivateKeys();
				}, 1000);
			}
		}

		// Track if we have errors
		if (invalidPrivateKeys.length > 0) {
			hadErrors = true;
		}
	});

	async function importPrivateKeys() {
		if (!privateKeysText.trim()) {
			errorMessage = t('routes/apps/wallet-sweep.step4.content.private_key.error_empty');
			return { success: false };
		}

		const lines = privateKeysText
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line.length > 0);

		if (lines.length === 0) {
			errorMessage = t('routes/apps/wallet-sweep.step4.content.private_key.error_none');
			return { success: false };
		}

		// Clear existing wallets before importing new ones
		step4State.clearWallets();

		isGenerating = true;
		generationProgress = 0;
		errorMessage = '';
		invalidPrivateKeys = [];

		try {
			// Import private keys using composable
			const result = await walletGeneration.importPrivateKeys(
				lines,
				(p) => (generationProgress = p)
			);

			if (result.error) {
				errorMessage = result.error;
				return { success: false };
			} else {
				// Add wallets (without privateKey field - already stored in walletKeysStore)
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				step4State.addWallets(result.wallets.map(({ privateKey: _pk, ...wallet }) => wallet));

				if (result.invalidKeys.length > 0) {
					invalidPrivateKeys = result.invalidKeys.map((key) => ({ key }));
					errorMessage = t(
						'routes/apps/wallet-sweep.step4.content.private_key.success_with_invalid',
						{
							valid: result.wallets.length,
							invalid: result.invalidKeys.length
						}
					);
				}

				return { success: true, walletCount: result.wallets.length };
			}
		} catch (error) {
			errorMessage =
				error instanceof Error
					? error.message
					: t('routes/apps/wallet-sweep.step4.content.errors.import_failed');
			return { success: false };
		} finally {
			isGenerating = false;
			generationProgress = 0;
		}
	}

	function reset() {
		privateKeysText = '';
		isGenerating = false;
		generationProgress = 0;
		errorMessage = '';
		invalidPrivateKeys = [];
		hadErrors = false;

		if (autoRetryTimeout) {
			clearTimeout(autoRetryTimeout);
			autoRetryTimeout = null;
		}
	}

	function clearError() {
		errorMessage = '';
	}

	return {
		// State getters
		get privateKeysText() {
			return privateKeysText;
		},
		set privateKeysText(value: string) {
			privateKeysText = value;
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
		get invalidPrivateKeys() {
			return invalidPrivateKeys;
		},

		// Actions
		importPrivateKeys,
		reset,
		clearError
	};
}

export type PrivateKeyImportInstance = ReturnType<typeof usePrivateKeyImport>;

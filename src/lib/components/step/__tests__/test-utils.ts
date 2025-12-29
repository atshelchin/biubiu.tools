/**
 * Test utilities for step components.
 * Provides mock factories for common dependencies.
 */

import { vi } from 'vitest';

/**
 * Create a mock connect store for testing.
 */
export function createMockConnectStore(overrides: Partial<MockConnectStore> = {}): MockConnectStore {
	return {
		isConnected: false,
		currentChainId: null,
		address: null,
		networks: [
			{
				chainId: 1,
				name: 'Ethereum',
				symbol: 'ETH',
				rpcEndpoints: [{ url: 'https://eth.example.com' }],
				blockExplorer: 'https://etherscan.io'
			}
		],
		...overrides
	};
}

export interface MockConnectStore {
	isConnected: boolean;
	currentChainId: number | null;
	address: string | null;
	networks: Array<{
		chainId: number;
		name: string;
		symbol: string;
		rpcEndpoints: Array<{ url: string }>;
		blockExplorer: string;
	}>;
}

/**
 * Create a mock step manager for testing.
 */
export function createMockStepManager() {
	return {
		next: vi.fn(),
		prev: vi.fn(),
		goTo: vi.fn(),
		currentStep: 1
	};
}

/**
 * Create a mock i18n instance for testing.
 */
export function createMockI18n(translations: Record<string, string> = {}) {
	return {
		t: vi.fn((key: string, params?: Record<string, string>) => {
			if (translations[key]) {
				let result = translations[key];
				if (params) {
					Object.entries(params).forEach(([k, v]) => {
						result = result.replace(`{${k}}`, v);
					});
				}
				return result;
			}
			return key; // Return key if no translation
		}),
		locale: 'en'
	};
}

/**
 * Default translations for connect wallet step.
 */
export const connectWalletTranslations: Record<string, string> = {
	'test-tool.step1.content.title': 'Connect Wallet',
	'test-tool.step1.content.description': 'Connect your wallet to continue',
	'test-tool.step1.content.loading': 'Loading...',
	'test-tool.step1.footer.continue': 'Continue',
	'test-tool.step1.footer.hint': 'Connect wallet to continue',
	'test-tool.step1.sidebar.title': 'Step 1',
	'test-tool.step1.sidebar.description': 'Connect your wallet'
};

/**
 * Default translations for dependency check step.
 */
export const dependencyCheckTranslations: Record<string, string> = {
	'test-tool.step2.content.title': 'Checking Dependencies',
	'test-tool.step2.content.description': 'Verifying requirements...',
	'test-tool.step2.footer.continue': 'Continue',
	'test-tool.step2.footer.checking_dependencies': 'Checking...',
	'test-tool.step2.footer.resolve_issues': 'Please resolve issues',
	'test-tool.step2.footer.waiting_for_checks': 'Waiting...',
	'test-tool.step2.sidebar.title': 'Step 2',
	'test-tool.step2.sidebar.description': 'Check dependencies'
};

/**
 * Default translations for token selection step.
 */
export const tokenSelectionTranslations: Record<string, string> = {
	'test-tool.step3.content.title': 'Select Tokens',
	'test-tool.step3.content.description': 'Select tokens on {network}',
	'test-tool.step3.content.description_fallback': 'Select tokens',
	'test-tool.step3.content.wallet_not_connected_title': 'Wallet Not Connected',
	'test-tool.step3.content.wallet_not_connected_message': 'Please connect your wallet',
	'test-tool.step3.content.empty_message': 'No tokens found',
	'test-tool.step3.footer.hint': 'Select at least one token',
	'test-tool.step3.sidebar.selected_tokens_title': 'Selected Tokens',
	'test-tool.step3.sidebar.count_label': 'Count:',
	'test-tool.step3.sidebar.empty_hint': 'No tokens selected'
};

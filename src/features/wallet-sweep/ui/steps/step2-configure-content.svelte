<script lang="ts">
	/**
	 * Wallet Sweep Step 2: Dependency Check Content
	 * Uses shared DependencyCheckContent component with wallet-sweep specific checker
	 */
	import { DependencyCheckContent } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/wallet-sweep/stores/step2-state.svelte';
	import { checkAllDependencies } from '@/features/wallet-sweep/utils/dependency-checker';
	import type { TranslationKeys } from '@shelchin/i18n';

	/**
	 * Wallet-sweep specific dependency checker adapter.
	 * Wraps checkAllDependencies with the correct signature for DependencyCheckContent.
	 */
	function checkDependencies(
		rpcUrl: string,
		chainId: number,
		networkName: string,
		t: (key: string, params?: Record<string, unknown>) => string
	) {
		// Wrap t function with proper type assertion for wallet-sweep i18n keys
		const typedT = (key: keyof TranslationKeys, params?: Record<string, string | number>) =>
			t(key, params);

		return checkAllDependencies(
			rpcUrl,
			chainId,
			networkName,
			typedT,
			undefined, // membershipContract
			undefined // sweepContract
		);
	}

	/**
	 * Sync state changes to step2State for sidebar/footer access.
	 */
	function handleStateChange(state: {
		checks: typeof step2State.checks;
		summary: typeof step2State.summary;
		isChecking: boolean;
		hasChecked: boolean;
	}) {
		step2State.checks = state.checks;
		step2State.summary = state.summary;
		step2State.isChecking = state.isChecking;
		step2State.hasChecked = state.hasChecked;
	}
</script>

<DependencyCheckContent
	i18nPrefix="wallet-sweep"
	{checkDependencies}
	onStateChange={handleStateChange}
/>

<script lang="ts">
	/**
	 * NFT Deployer Step 2: Check Dependencies Content
	 * Uses shared DependencyCheckContent component
	 */
	import { DependencyCheckContent } from '$lib/components/step/dependency-check';
	import { step2CheckDepsState } from '@/features/nft-deployer/stores/step2-check-deps-state.svelte';
	import { checkAllDependencies } from '@/features/nft-deployer/utils/dependency-checker';
	import type { TranslationKeys } from '@shelchin/i18n';

	/**
	 * Wrapper for checkAllDependencies that adapts the function signature
	 * to match the expected interface of DependencyCheckContent
	 */
	function checkDependencies(
		rpcUrl: string,
		chainId: number,
		networkName: string,
		t: (key: string, params?: Record<string, unknown>) => string
	) {
		// Adapt the translation function to the expected type
		const typedT = (key: keyof TranslationKeys, params?: Record<string, string | number>) =>
			t(key, params);

		return checkAllDependencies(rpcUrl, chainId, networkName, typedT);
	}

	/**
	 * Sync state back to the module-level step2CheckDepsState store
	 * so sidebar and footer can access the same state
	 */
	function handleStateChange(state: {
		checks: typeof step2CheckDepsState.checks;
		summary: typeof step2CheckDepsState.summary;
		isChecking: boolean;
		hasChecked: boolean;
	}) {
		step2CheckDepsState.checks = state.checks;
		step2CheckDepsState.summary = state.summary;
		step2CheckDepsState.isChecking = state.isChecking;
		step2CheckDepsState.hasChecked = state.hasChecked;
	}
</script>

<DependencyCheckContent
	i18nPrefix="routes/apps/nft-deployer"
	{checkDependencies}
	onStateChange={handleStateChange}
/>

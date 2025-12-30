<script lang="ts">
	/**
	 * Token Deployer Step 2: Check Dependencies Content
	 * Uses shared DependencyCheckContent component
	 */
	import { DependencyCheckContent } from '$lib/components/step/dependency-check';
	import { step2State } from '@/features/token-deployer/stores/step2-state.svelte';
	import { checkAllDependencies } from '@/features/token-deployer/utils/dependency-checker';
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
	 * Sync state back to the module-level step2State store
	 * so sidebar and footer can access the same state
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
	i18nPrefix="routes/apps/token-deployer"
	{checkDependencies}
	onStateChange={handleStateChange}
/>

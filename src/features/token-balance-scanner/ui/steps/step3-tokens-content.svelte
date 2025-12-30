<script lang="ts">
	/**
	 * Token Balance Scanner Step 3: Select Tokens Content
	 * Uses shared TokenSelectionContent component
	 */
	import { TokenSelectionContent } from '$lib/components/step/token-selection';
	import { step3State } from '../../stores/step3-state.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	function handleSelectionChange(newSelection: SvelteSet<string>) {
		// Clear existing and add new selections
		step3State.selectedTokens.clear();
		newSelection.forEach((tokenId) => step3State.selectedTokens.add(tokenId));
	}

	function handleTokenAdded(tokenId: string) {
		// Auto-select the newly added token
		step3State.addToken(tokenId);
	}

	function handleRemoveCustomToken(tokenId: string) {
		// Remove from selection if it was selected
		if (step3State.selectedTokens.has(tokenId)) {
			step3State.removeToken(tokenId);
		}
	}
</script>

<TokenSelectionContent
	i18nPrefix="routes/apps/token-balance-scanner"
	selectedTokenIds={step3State.selectedTokens}
	onSelectionChange={handleSelectionChange}
	onTokenAdded={handleTokenAdded}
	onRemoveCustomToken={handleRemoveCustomToken}
/>

<script lang="ts">
	/**
	 * Wallet Sweep Step 3: Select Tokens Content
	 * Uses shared TokenSelectionContent component
	 */
	import { TokenSelectionContent } from '$lib/components/step/token-selection';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import { SvelteSet } from 'svelte/reactivity';

	function handleSelectionChange(newSelection: SvelteSet<string>) {
		step3State.selectedTokenIds = newSelection;
	}

	function handleTokenAdded(tokenId: string) {
		// Auto-select the newly added token
		step3State.selectedTokenIds.add(tokenId);
		// Trigger reactivity by creating new SvelteSet
		step3State.selectedTokenIds = new SvelteSet(step3State.selectedTokenIds);
	}

	function handleRemoveCustomToken(tokenId: string) {
		// Remove from selection if it was selected
		if (step3State.selectedTokenIds.has(tokenId)) {
			step3State.selectedTokenIds.delete(tokenId);
			// Trigger reactivity
			step3State.selectedTokenIds = new SvelteSet(step3State.selectedTokenIds);
		}
	}
</script>

<TokenSelectionContent
	i18nPrefix="wallet-sweep"
	selectedTokenIds={step3State.selectedTokenIds}
	onSelectionChange={handleSelectionChange}
	onTokenAdded={handleTokenAdded}
	onRemoveCustomToken={handleRemoveCustomToken}
/>

<script lang="ts">
	/**
	 * Wallet Sweep Step 3: Select Tokens Footer
	 * Uses shared TokenSelectionFooter component
	 */
	import { TokenSelectionFooter } from '$lib/components/step/token-selection';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';

	let selectedCount = $derived(step3State.selectedTokenIds.size);
</script>

<TokenSelectionFooter i18nPrefix="wallet-sweep" {selectedCount} />

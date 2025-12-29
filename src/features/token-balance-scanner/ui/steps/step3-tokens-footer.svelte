<script lang="ts">
	/**
	 * Token Balance Scanner Step 3: Select Tokens Footer
	 * Uses shared TokenSelectionFooter component
	 */
	import { TokenSelectionFooter } from '$lib/components/step/token-selection';
	import { step3State } from '../../stores/step3-state.svelte';

	let selectedCount = $derived(step3State.selectedTokens.size);
</script>

<TokenSelectionFooter i18nPrefix="token-balance-scanner" {selectedCount} />

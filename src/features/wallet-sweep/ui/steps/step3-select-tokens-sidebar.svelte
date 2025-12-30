<script lang="ts">
	/**
	 * Wallet Sweep Step 3: Select Tokens Sidebar
	 * Uses shared TokenSelectionSidebar component
	 */
	import { TokenSelectionSidebar } from '$lib/components/step/token-selection';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';

	let selectedCount = $derived(step3State.selectedTokenIds.size);
</script>

<TokenSelectionSidebar i18nPrefix="routes/apps/wallet-sweep" {selectedCount} />

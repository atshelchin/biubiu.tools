<script lang="ts">
	import { fade } from 'svelte/transition';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '$lib/components/step/step-summary.svelte';
	import EmptyHint from '$lib/components/ui/empty-hint.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	// Use shared state - create reactive count
	let selectedCount = $derived(step3State.selectedTokenIds.size);
</script>

<StepSidebar title="" description="" stepNumber={3} showWalletConnect={true}>
	{#if selectedCount > 0}
		<div transition:fade>
			<StepSummary title={i18n.t('tools.wallet_sweep.step3.sidebar.selected_tokens_title')}>
				<div class="summary-item">
					<span>{i18n.t('tools.wallet_sweep.step3.sidebar.count_label')}</span>
					<strong>{selectedCount}</strong>
				</div>
			</StepSummary>
		</div>
	{:else}
		<EmptyHint message={i18n.t('tools.wallet_sweep.step3.sidebar.empty_hint')} />
	{/if}
</StepSidebar>

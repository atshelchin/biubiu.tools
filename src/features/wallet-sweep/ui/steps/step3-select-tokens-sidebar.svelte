<script lang="ts">
	import { fade } from 'svelte/transition';
	import { step3State } from '@/features/wallet-sweep/stores/step3-state.svelte';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '@/features/wallet-sweep/ui/components/step-summary.svelte';
	import InfoCard from '$lib/components/step/info-card.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	// Use shared state - create reactive count
	let selectedCount = $derived(step3State.selectedTokenIds.size);
</script>

<StepSidebar title="" description="" stepNumber={3} showWalletConnect={true}>
	{#if selectedCount > 0}
		<div transition:fade>
			<StepSummary title={i18n.t('tools.token_sweep.step3.sidebar.selected_tokens_title')}>
				<div class="summary-item">
					<span>{i18n.t('tools.token_sweep.step3.sidebar.count_label')}</span>
					<strong>{selectedCount}</strong>
				</div>
			</StepSummary>
		</div>
	{:else}
		<p class="empty-hint">{i18n.t('tools.token_sweep.step3.sidebar.empty_hint')}</p>
	{/if}

	<InfoCard
		variant="tips"
		icon="💡"
		title={i18n.t('tools.token_sweep.step3.sidebar.beginner_tips')}
	>
		<ul>
			<li>{i18n.t('tools.token_sweep.step3.sidebar.tip1')}</li>
			<li>{i18n.t('tools.token_sweep.step3.sidebar.tip2')}</li>
			<li>{i18n.t('tools.token_sweep.step3.sidebar.tip3')}</li>
		</ul>
	</InfoCard>
</StepSidebar>

<style>
	.empty-hint {
		margin-top: var(--space-4);
		padding: var(--space-3);
		text-align: center;
		font-size: var(--text-sm);
		color: var(--gray-500);
		font-style: italic;
	}
</style>

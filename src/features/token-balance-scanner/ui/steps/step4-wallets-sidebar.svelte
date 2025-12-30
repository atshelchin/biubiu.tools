<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import StepSummary from '$lib/components/step/step-summary.svelte';
	import EmptyHint from '$lib/components/ui/empty-hint.svelte';
	import { step4State } from '../../stores/step4-state.svelte';

	const i18n = useI18n();

	const walletCount = $derived(step4State.wallets.length);
</script>

<StepSidebar stepNumber={4} title="" description="">
	{#if walletCount > 0}
		<StepSummary
			title={i18n.t('routes/apps/token-balance-scanner.step4.sidebar.title') || 'Summary'}
		>
			<div class="summary-item">
				<span
					>{i18n.t('routes/apps/token-balance-scanner.step4.sidebar.total_label') ||
						'Total Wallets'}</span
				>
				<strong>{walletCount.toLocaleString()}</strong>
			</div>
		</StepSummary>
	{:else}
		<EmptyHint
			message={i18n.t('routes/apps/token-balance-scanner.step4.sidebar.empty_hint') ||
				'No wallets added yet'}
		/>
	{/if}
</StepSidebar>

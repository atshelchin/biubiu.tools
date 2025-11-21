<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import CheckSummary from '$lib/components/ui/check-summary.svelte';
	import { step2State } from '@/features/token-sweep/stores/step2-state.svelte';
	import InfoCard from '$lib/components/step/info-card.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	// Use $derived for easier access in template
	let summary = $derived(step2State.summary);
</script>

<StepSidebar stepNumber={2} title="" description="" showWalletConnect={true}>
	{#if summary}
		<CheckSummary {summary} />
	{/if}

	<InfoCard
		variant="tips"
		icon="💡"
		title={i18n.t('tools.token_sweep.step2.sidebar.beginner_tips')}
	>
		<ul>
			<li>{i18n.t('tools.token_sweep.step2.sidebar.tip1')}</li>
			<li>{i18n.t('tools.token_sweep.step2.sidebar.tip2')}</li>
			<li>{i18n.t('tools.token_sweep.step2.sidebar.tip3')}</li>
		</ul>
	</InfoCard>
</StepSidebar>

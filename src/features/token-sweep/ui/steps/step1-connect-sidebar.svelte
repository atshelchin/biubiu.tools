<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import InfoCard from '$lib/components/step/info-card.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
</script>

<!-- 	title={i18n.t('tools.token_sweep.step1.sidebar.title')} -->
<StepSidebar stepNumber={1} title="" description="">
	<!-- What is this step? -->
	<!-- <InfoCard
		variant="primary"
		icon="📝"
		title={i18n.t('tools.token_sweep.step1.sidebar.what_is_this')}
		description={i18n.t('tools.token_sweep.step1.sidebar.what_explanation')}
	>
		<ul>
			<li>{i18n.t('tools.token_sweep.step1.sidebar.what_item1')}</li>
			<li>{i18n.t('tools.token_sweep.step1.sidebar.what_item2')}</li>
		</ul>
	</InfoCard> -->

	<!-- Why do this? -->
	<!-- <InfoCard
		variant="primary"
		icon="❓"
		title={i18n.t('tools.token_sweep.step1.sidebar.why_do_this')}
		description={i18n.t('tools.token_sweep.step1.sidebar.why_explanation')}
	/> -->
	<!-- Beginner Tips -->
	<InfoCard
		variant="tips"
		icon="💡"
		title={i18n.t('tools.token_sweep.step1.sidebar.beginner_tips')}
	>
		<ul>
			<li>{i18n.t('tools.token_sweep.step1.sidebar.tip1')}</li>
			<li>{i18n.t('tools.token_sweep.step1.sidebar.tip2')}</li>
			<li>{i18n.t('tools.token_sweep.step1.sidebar.tip3')}</li>
		</ul>
	</InfoCard>
</StepSidebar>

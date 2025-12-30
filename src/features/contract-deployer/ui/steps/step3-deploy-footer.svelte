<script lang="ts">
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();

	// This is the final step, so we don't need continue button
	// Just show a hint about the deployment
</script>

<StepFooter canContinue={false} hint={i18n.t('routes/apps/contract-deployer.step3.footer.hint')} />

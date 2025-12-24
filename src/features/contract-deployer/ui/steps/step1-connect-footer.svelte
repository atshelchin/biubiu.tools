<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n } from '@shelchin/i18n';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();
	const i18n = useI18n();

	const isReadyToContinue = $derived(
		Boolean(connectStore.isConnected && connectStore.currentChainId !== null)
	);

	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText={i18n.t('contract-deployer.step1.footer.continue')}
	onContinue={handleContinue}
	hint={i18n.t('contract-deployer.step1.footer.hint')}
/>

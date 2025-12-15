<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';
	import StepFooter from '$lib/components/step/step-footer.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	const connectStore = useConnectStore();
	const stepManager = useStepManager();
	const i18n = useI18n();

	// This needs to track the same selectedChainId as content
	// We'll use connectStore.currentChainId which is set after connection
	const isReadyToContinue = $derived(
		Boolean(connectStore.isConnected && connectStore.currentChainId !== null)
	);

	// Handle continue to next step
	function handleContinue() {
		if (isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText={i18n.t('tools.token_sweep.step1.footer.continue')}
	onContinue={handleContinue}
	hint={i18n.t('tools.token_sweep.step1.footer.hint')}
/>

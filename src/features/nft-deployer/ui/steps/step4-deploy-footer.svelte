<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import Button from '$lib/components/ui/button.svelte';
	import { ChevronLeft, RefreshCw } from '@lucide/svelte';
	import { step4DeployState } from '../../stores/step4-deploy-state.svelte';
	import { step2CheckDepsState } from '../../stores/step2-check-deps-state.svelte';
	import { step3NFTConfigState } from '../../stores/step3-nft-config-state.svelte';

	const i18n = useI18n();

	interface Props {
		onPrevious: () => void;
	}

	let { onPrevious }: Props = $props();

	const isDeployed = $derived(step4DeployState.status === 'completed');

	function handleReset() {
		// Reset all states
		step2CheckDepsState.reset();
		step3NFTConfigState.reset();
		step4DeployState.reset();

		// Navigate to step 1
		window.location.reload();
	}
</script>

<div class="flex items-center justify-between gap-4">
	<Button variant="outline" onclick={onPrevious} disabled={isDeployed}>
		<ChevronLeft class="mr-2 h-4 w-4" />
		{i18n.t('common.previous')}
	</Button>

	{#if isDeployed}
		<Button onclick={handleReset}>
			<RefreshCw class="mr-2 h-4 w-4" />
			{i18n.t('routes/apps/nft-deployer.step4.footer.deploy_another')}
		</Button>
	{/if}
</div>

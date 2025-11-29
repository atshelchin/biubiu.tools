<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { step4DeployState } from '../../stores/step4-deploy-state.svelte';
	import { CheckCircle, Loader2, XCircle, Rocket } from '@lucide/svelte';

	const i18n = useI18n();

	const status = $derived(step4DeployState.deploymentStatus);
</script>

<div class="space-y-3">
	<div class="flex items-center gap-2">
		{#if status === 'idle'}
			<Rocket class="h-5 w-5 text-muted-foreground" />
		{:else if status === 'deploying'}
			<Loader2 class="h-5 w-5 animate-spin text-blue-600" />
		{:else if status === 'completed'}
			<CheckCircle class="h-5 w-5 text-green-600" />
		{:else if status === 'error'}
			<XCircle class="h-5 w-5 text-red-600" />
		{/if}
		<h3 class="font-semibold">{i18n.t('tools.nft_deployer.step4.sidebar.title')}</h3>
	</div>

	<p class="text-sm text-muted-foreground">
		{i18n.t('tools.nft_deployer.step4.sidebar.description')}
	</p>

	{#if status === 'completed' && step4DeployState.deployedAddress}
		<div class="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
			<p class="text-sm font-medium text-green-900 dark:text-green-100">
				{i18n.t('tools.nft_deployer.step4.sidebar.success')}
			</p>
		</div>
	{:else if status === 'error'}
		<div class="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
			<p class="text-sm font-medium text-red-900 dark:text-red-100">
				{i18n.t('tools.nft_deployer.step4.sidebar.error')}
			</p>
		</div>
	{/if}
</div>

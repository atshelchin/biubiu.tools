<script lang="ts">
	import { mainnet } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/ens-scanner/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: data.steps,
		appTitle: i18n.t('ens-scanner.title'),
		appDescription: i18n.t('ens-scanner.description'),
		walletConnect: {
			chains: [mainnet],
			storageKey: 'biubiu-tools-ens-scanner'
		},
		stepComponents
	}}
/>

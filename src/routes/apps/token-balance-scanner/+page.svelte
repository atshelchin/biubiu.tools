<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-balance-scanner/ui/steps';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: data.steps,
		appTitle: i18n.t('tools.token_balance_scanner.title'),
		appDescription: i18n.t('tools.token_balance_scanner.description'),
		walletConnect: {
			chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-balance-scanner'
		},
		stepComponents
	}}
/>

<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import DeployedTokensList from '@/features/token-deployer/ui/deployed-tokens-list.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { createConnectConfig } from '$lib/utils/connect-config';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Initialize wallet connect
	const store = createConnectStore(
		createConnectConfig({
			chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-deployer',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			i18n: i18n as any
		})
	);
	store.initialize();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
</svelte:head>

<PageLayout>
	<DeployedTokensList />
</PageLayout>

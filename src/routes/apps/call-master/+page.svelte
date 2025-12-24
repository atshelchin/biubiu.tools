<script lang="ts">
	import CallMaster from '@/features/call-master/index.svelte';
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import PageLayout from '$lib/components/page-layout.svelte';
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();

	// 初始化 wallet connect store
	createConnectStore({
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
		storageKey: 'biubiu-tools-call-master',
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		i18n: i18n as any
	});
</script>

<PageLayout>
	<CallMaster />
</PageLayout>

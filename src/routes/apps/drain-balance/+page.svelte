<script lang="ts">
	import DrainBlanace from '@/features/drain-balance/index.svelte';
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';

	// 初始化 wallet connect store
	createConnectStore({
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
		storageKey: 'biubiu-tools-drain-balance'
	});
</script>

<DrainBlanace />

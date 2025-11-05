<script lang="ts">
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';

	// 初始化 wallet connect store,配置此app需要的chains
	createConnectStore({
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		chains: [mainnet, polygon, base, bsc, arbitrum, optimism], // 可以根据app需求自定义
		storageKey: 'biubiu-tools-token-sweep' // 每个app使用不同的storageKey
	});
</script>

# Token Sweep

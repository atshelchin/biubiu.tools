<script lang="ts">
	import { StepToolApp } from '$lib/step-tool-system';
	import { walletSweepTool } from '@/features/wallet-sweep/tool';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<StepToolApp feature={walletSweepTool} meta={data.meta} structuredData={data.structuredData} />

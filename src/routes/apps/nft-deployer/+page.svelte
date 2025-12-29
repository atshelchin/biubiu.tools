<script lang="ts">
	import { StepToolApp } from '$lib/step-tool-system';
	import { nftDeployerTool } from '@/features/nft-deployer/tool';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<StepToolApp
	feature={nftDeployerTool}
	meta={data.meta}
	structuredData={data.structuredData}
	steps={data.steps}
/>

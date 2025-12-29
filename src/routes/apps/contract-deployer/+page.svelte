<script lang="ts">
	import { StepToolApp } from '$lib/step-tool-system';
	import { contractDeployerTool } from '@/features/contract-deployer/feature';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<StepToolApp feature={contractDeployerTool} meta={data.meta} structuredData={data.structuredData} />

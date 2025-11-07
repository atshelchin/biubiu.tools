<script lang="ts">
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { createConnectConfig } from '$lib/utils/connect-config';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import PageLayout from '$lib/components/page-layout.svelte';
	import AppTitle from '$lib/components/ui/app-title.svelte';
	import NetworkSettingsButton from '$lib/components/ui/network-settings-button.svelte';
	import ReferralButton from '$lib/components/ui/referral-button.svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepIndicator, { createStepManager } from '$lib/components/ui/step-indicator.svelte';
	import StepControls from '$lib/components/ui/step-controls.svelte';

	import type { PageData } from './$types';

	// 当前应用专用
	import { stepComponents } from '@/features/token-sweep/ui/steps';

	const { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// 当前应用专用
	// 初始化 wallet connect store，配置此 app 需要的 chains
	createConnectStore(
		createConnectConfig({
			chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-sweep'
		})
	);
	// Create step manager from steps config loaded from +page.ts (auto-sets context internally)
	const stepManager = createStepManager(
		data.steps.map((step) => ({
			label: step.name,
			description: step.description
		}))
	);

	// 获取当前步骤的组件
	const SidebarComponent = $derived(stepComponents.sidebar[stepManager.currentStep - 1]);
	const ContentComponent = $derived(stepComponents.content[stepManager.currentStep - 1]);
	const FooterComponent = $derived(stepComponents.footer[stepManager.currentStep - 1]);
</script>

<!-- SEO Optimization -->
<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	canonical={data.meta.canonical}
	type={data.meta.type}
	image={data.meta.image}
	locale={data.meta.locale}
	structuredData={data.structuredData}
/>

<PageLayout>
	{#snippet toolbar()}
		<div class="toolbar-content">
			<!--  当前应用专用 -->
			<AppTitle
				title={i18n.t('tools.token_sweep.title')}
				description={i18n.t('tools.token_sweep.description')}
			/>
			<div class="toolbar-actions">
				<NetworkSettingsButton variant="ghost" size="sm" />
				<ReferralButton variant="ghost" size="sm" />
			</div>
		</div>
	{/snippet}

	{#snippet sidebar()}
		<SidebarComponent />
	{/snippet}

	{#snippet footer()}
		<FooterComponent />
	{/snippet}

	<!-- 主要内容 -->
	<div class="page-content">
		<StepIndicator manager={stepManager} />
		{#if typeof window !== 'undefined' && window.location.hostname === 'localhost'}
			<StepControls manager={stepManager} />
		{/if}
		<ContentComponent />
	</div>
</PageLayout>

<style>
	.page-content :global(.step-controls) {
		margin: var(--space-6) 0;
	}

	/* Toolbar styles */
	.toolbar-content {
		position: relative;
		min-height: 60px;
		padding-right: var(--space-20);
	}

	.toolbar-actions {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		display: flex;
		gap: var(--space-2);
	}

	@media (max-width: 768px) {
		.toolbar-content {
			padding-right: 0;
			min-height: auto;
		}

		.toolbar-actions {
			position: static;
			width: 100%;
			flex-wrap: wrap;
			margin-top: var(--space-3);
		}
	}
</style>

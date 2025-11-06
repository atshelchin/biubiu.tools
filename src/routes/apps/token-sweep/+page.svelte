<script lang="ts">
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import PageLayout from '$lib/components/page-layout.svelte';
	import AppTitle from '$lib/components/ui/app-title.svelte';
	import NetworkSettingsButton from '$lib/components/ui/network-settings-button.svelte';
	import ReferralButton from '$lib/components/ui/referral-button.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepIndicator, { createStepManager } from '$lib/components/ui/step-indicator.svelte';
	import StepControls from '$lib/components/ui/step-controls.svelte';
	import { Step1Connect, Step2Configure, Step3Complete } from '@/features/token-sweep/ui';
	import { initializeReferral } from '$lib/utils/referral';
	import { onMount } from 'svelte';

	const i18n = useI18n();

	// 创建步骤管理器
	const stepManager = createStepManager([
		{ label: 'Connect Wallet', description: 'Link your Web3 wallet' },
		{ label: 'Configure', description: 'Set up your preferences' },
		{ label: 'Complete', description: 'Finish setup' }
	]);

	// 初始化 wallet connect store，配置此 app 需要的 chains
	createConnectStore({
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
		storageKey: 'biubiu-tools-token-sweep'
	});

	// 初始化推荐系统
	onMount(() => {
		initializeReferral();
	});
</script>

<PageLayout>
	{#snippet toolbar()}
		<div class="toolbar-content">
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
		{#if stepManager.currentStep === 1}
			<Step1Connect section="sidebar" />
		{:else if stepManager.currentStep === 2}
			<Step2Configure section="sidebar" />
		{:else if stepManager.currentStep === 3}
			<Step3Complete section="sidebar" />
		{/if}
	{/snippet}

	{#snippet footer()}
		{#if stepManager.currentStep === 1}
			<Step1Connect section="footer" />
		{:else if stepManager.currentStep === 2}
			<Step2Configure section="footer" />
		{:else if stepManager.currentStep === 3}
			<Step3Complete section="footer" />
		{/if}
	{/snippet}

	<!-- 主要内容 -->
	<div class="page-content">
		<StepIndicator manager={stepManager} />
		<StepControls manager={stepManager} />

		{#if stepManager.currentStep === 1}
			<Step1Connect section="content" />
		{:else if stepManager.currentStep === 2}
			<Step2Configure section="content" />
		{:else if stepManager.currentStep === 3}
			<Step3Complete section="content" />
		{/if}
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

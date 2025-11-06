<script lang="ts">
	import { createConnectStore, useConnectStore } from '$lib/stores/connect.svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import PageLayout from '$lib/components/page-layout.svelte';
	import AppTitle from '$lib/components/ui/app-title.svelte';
	import IconButton from '$lib/components/ui/icon-button.svelte';
	import NetworkSettingsModal from '$lib/components/ui/network-settings-modal.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Share2, Settings } from 'lucide-svelte';
	import StepIndicator, { createStepManager } from '$lib/components/ui/step-indicator.svelte';
	import StepControls from '$lib/components/ui/step-controls.svelte';
	import { Step1Connect, Step2Configure, Step3Complete } from '@/features/token-sweep/ui';
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

	const connectStore = useConnectStore();

	let showNetworkSettings = $state(false);

	function handleShareLink() {
		const url = window.location.href;
		navigator.clipboard.writeText(url);
	}

	function handleOpenSettings() {
		showNetworkSettings = true;
	}

	function handleCloseSettings() {
		showNetworkSettings = false;
	}
</script>

<PageLayout>
	{#snippet toolbar()}
		<div class="toolbar-content">
			<AppTitle
				title={i18n.t('tools.token_sweep.title')}
				description={i18n.t('tools.token_sweep.description')}
			/>
			<div class="toolbar-actions">
				<IconButton
					icon={Settings}
					label={i18n.t('tools.actions.settings')}
					tooltip={i18n.t('tools.actions.settings_tooltip')}
					variant="ghost"
					size="sm"
					onclick={handleOpenSettings}
				/>
				<IconButton
					icon={Share2}
					label={i18n.t('tools.actions.share_link')}
					tooltip={i18n.t('tools.actions.share_tooltip')}
					variant="ghost"
					size="sm"
					showSuccessIcon={true}
					onclick={handleShareLink}
				/>
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

	<!-- Network Settings Modal -->
	<NetworkSettingsModal
		open={showNetworkSettings}
		networks={connectStore.networks}
		currentChainId={connectStore.currentChainId}
		onClose={handleCloseSettings}
		onToggleNetwork={connectStore.toggleNetwork}
		isNetworkEnabled={connectStore.isNetworkEnabled}
		onSaveNetwork={connectStore.updateNetworkRpc}
		onAddOrUpdateNetwork={connectStore.addOrUpdateNetwork}
	/>
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

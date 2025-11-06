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
	import StepIndicatorExample from '@/lib/components/ui/step-indicator.example.svelte';
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

	let addressCount = $state(0);
	let totalValue = $state(0);
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
		<div class="sidebar-content">
			<h3>Quick Actions</h3>
			<div class="sidebar-actions">
				<button class="sidebar-btn">Add Address</button>
				<button class="sidebar-btn">Settings</button>
				<button class="sidebar-btn">History</button>
			</div>

			<div class="sidebar-info">
				<h4>Statistics</h4>
				<div class="stat-item">
					<span class="stat-label">Addresses:</span>
					<span class="stat-value">{addressCount}</span>
				</div>
				<div class="stat-item">
					<span class="stat-label">Total Value:</span>
					<span class="stat-value">${totalValue.toFixed(2)}</span>
				</div>
			</div>
		</div>
	{/snippet}

	{#snippet footer()}
		<div class="footer-content">
			<div class="footer-stats">
				<span>Total Addresses: {addressCount}</span>
				<span>|</span>
				<span>Total Value: ${totalValue.toFixed(2)}</span>
			</div>
			<button class="start-sweep-btn">Start Sweep</button>
		</div>
	{/snippet}

	<!-- 主要内容 -->
	<div class="page-content">
		<StepIndicator manager={stepManager} />
		<StepControls manager={stepManager} />

		<h1>Token Sweep</h1>
		<p>Sweep tokens from multiple addresses to a single destination address.</p>

		{#if connectStore.isConnected}
			<div class="connected-info">
				<p>Connected: {connectStore.address}</p>
			</div>
		{:else}
			<div class="connect-prompt">
				<p>Please connect your wallet to continue.</p>
			</div>
		{/if}

		<div class="sweep-form">
			<h2>Configuration</h2>
			<p>Configure your token sweep settings here.</p>
		</div>
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
	.page-content {
		padding: var(--space-4);
	}

	.page-content :global(.step-controls) {
		margin: var(--space-6) 0;
	}

	.page-content h1 {
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-2);
	}

	.page-content p {
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-6);
	}

	.connected-info,
	.connect-prompt {
		padding: var(--space-4);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-6);
	}

	.connected-info {
		background: var(--color-success-light, #d1fae5);
		border: 1px solid var(--color-success, #10b981);
	}

	.connect-prompt {
		background: var(--color-warning-light, #fef3c7);
		border: 1px solid var(--color-warning, #f59e0b);
	}

	.sweep-form {
		background: var(--color-card);
		padding: var(--space-6);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.sweep-form h2 {
		font-size: var(--text-xl);
		margin-bottom: var(--space-4);
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

	/* Sidebar styles */
	.sidebar-content h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-4);
	}

	.sidebar-actions {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-bottom: var(--space-6);
	}

	.sidebar-btn {
		width: 100%;
		padding: var(--space-3);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		text-align: left;
		transition: all 0.2s;
	}

	.sidebar-btn:hover {
		background: var(--color-muted);
	}

	.sidebar-info h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-3);
	}

	.stat-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.stat-label {
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	.stat-value {
		font-weight: var(--font-semibold);
	}

	/* Footer styles */
	.footer-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer-stats {
		display: flex;
		gap: var(--space-4);
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	.start-sweep-btn {
		padding: var(--space-3) var(--space-6);
		background: linear-gradient(135deg, var(--brand-500), var(--brand-600));
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.start-sweep-btn:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
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

		.footer-content {
			flex-direction: column;
			gap: var(--space-3);
		}

		.footer-stats {
			flex-direction: column;
			gap: var(--space-2);
			text-align: center;
		}
	}
</style>

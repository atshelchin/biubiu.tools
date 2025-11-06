<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { LogOut, ChevronDown, Check } from '@lucide/svelte';
	import CopyButton from './copy-button.svelte';
	import CopyButtonWithText from './copy-button-with-text.svelte';
	import WalletInfo from './wallet-info.svelte';
	import Modal from './modal.svelte';
	import QRCode from './qr-code.svelte';
	import InstructionList from './instruction-list.svelte';
	import GradientButton from './gradient-button.svelte';
	import Dropdown from './dropdown.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { longPress } from '$lib/utils/long-press';

	const i18n = useI18n();
	const t = i18n.t;

	// 从 context 获取 connect store
	const connectStore = useConnectStore();

	// 账户切换相关状态
	let showAccountDropdown = $state(false);
	let accounts = $state<string[]>([]);
	let walletInfoElement: HTMLElement | undefined = $state();

	// WalletConnect 说明步骤
	const walletConnectSteps = $derived([
		t('wallet.walletconnect.step_1'),
		t('wallet.walletconnect.step_2'),
		t('wallet.walletconnect.step_3')
	]);

	// 格式化地址显示
	function formatAddress(addr: string): string {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	// 加载账户列表并恢复之前选择的账户
	async function loadAccounts() {
		const accs = await connectStore.getAccounts();
		accounts = accs || [];

		// 如果有多个账户，检查是否需要恢复之前选择的账户
		if (accounts.length > 1 && connectStore.address) {
			// 获取持久化的连接信息
			const storageKey = 'biubiu-tools-wallet-connection';
			const savedData = localStorage.getItem(storageKey);
			if (savedData) {
				try {
					const { address: savedAddress } = JSON.parse(savedData);
					// 如果保存的地址在账户列表中，且不是当前地址，则切换
					if (
						savedAddress &&
						accounts.some((acc) => acc.toLowerCase() === savedAddress.toLowerCase()) &&
						savedAddress.toLowerCase() !== connectStore.address.toLowerCase()
					) {
						await connectStore.switchAccount(savedAddress);
					}
				} catch (e) {
					// Ignore parse errors
					console.error('loadAccounts=>', e);
				}
			}
		}
	}

	// 切换账户
	async function handleSwitchAccount(address: string) {
		await connectStore.switchAccount(address);
		showAccountDropdown = false;
	}

	// 切换账户下拉框
	function toggleAccountDropdown() {
		if (accounts.length > 1) {
			showAccountDropdown = !showAccountDropdown;
		}
	}

	// 长按重置连接状态
	let longPressProgress = $state(0);
	let isPressing = $state(false);

	async function forceResetConnection() {
		console.log('forceResetConnection');
		await connectStore.cancelConnection();
		// 强制清理状态
		connectStore.closeModal();
		connectStore.closeWalletConnectModal();
		isPressing = false;
	}

	onMount(async () => {
		await connectStore.initialize();
		if (connectStore.isConnected) {
			await loadAccounts();
		}
	});

	onDestroy(() => {
		connectStore.cleanup();
	});

	// 当连接状态变化时重新加载账户
	$effect(() => {
		if (connectStore.isConnected) {
			loadAccounts();
		} else {
			accounts = [];
		}
	});
</script>

{#if connectStore.isConnected && connectStore.address}
	<div class="wallet-connected-group">
		<div bind:this={walletInfoElement} class="wallet-info-wrapper">
			<button
				class="wallet-info-button"
				class:clickable={accounts.length > 1}
				onclick={toggleAccountDropdown}
				type="button"
			>
				<WalletInfo
					address={connectStore.address}
					{formatAddress}
					connectorIcon={connectStore.connectorIcon}
				/>
				{#if accounts.length > 1}
					<ChevronDown size={16} class="chevron-icon" />
				{/if}
			</button>
		</div>
		<CopyButton value={connectStore.address} />
		<button
			class="icon-button disconnect-button"
			onclick={connectStore.disconnect}
			type="button"
			title={i18n.t('wallet.disconnect')}
		>
			<LogOut size={16} />
		</button>
	</div>

	<!-- 账户切换下拉框 -->
	<Dropdown
		bind:open={showAccountDropdown}
		onClose={() => (showAccountDropdown = false)}
		trigger={walletInfoElement}
		align="left"
	>
		{#each accounts as account (account)}
			<button class="account-item" onclick={() => handleSwitchAccount(account)}>
				<div class="account-address">
					<div class="address-text">{formatAddress(account)}</div>
					<div class="address-full">{account}</div>
				</div>
				{#if account.toLowerCase() === connectStore.address?.toLowerCase()}
					<Check size={16} class="check-icon" />
				{/if}
			</button>
		{/each}
	</Dropdown>
{:else}
	<div class="connect-button-wrapper">
		<div
			use:longPress={{
				duration: 3000,
				onProgress: (progress) => {
					if (progress > 0) {
						isPressing = true;
						longPressProgress = progress;
					} else {
						isPressing = false;
						longPressProgress = 0;
					}
				},
				onComplete: forceResetConnection
			}}
		>
			<GradientButton
				onclick={connectStore.isConnecting
					? connectStore.cancelConnection
					: connectStore.openConnectorModal}
			>
				{connectStore.isConnecting ? i18n.t('wallet.connecting') : i18n.t('wallet.connect')}
			</GradientButton>
		</div>
		{#if connectStore.isConnecting}
			{#if isPressing && longPressProgress > 0}
				<div class="long-press-indicator">
					<div class="progress-bar" style:width="{longPressProgress}%"></div>
				</div>
			{/if}
			<div class="reset-hint">
				{t('wallet.long_press_hint')}
			</div>
		{/if}
	</div>
{/if}

<!-- 连接器选择模态框 -->
<Modal
	open={connectStore.showConnectorModal}
	onClose={connectStore.closeModal}
	title={i18n.t('wallet.select_wallet')}
>
	<div class="connector-list">
		{#each connectStore.availableConnectors as connector (connector.id)}
			<button class="connector-item" onclick={() => connectStore.connectWallet(connector)}>
				{#if connector.icon}
					<img src={connector.icon} alt={connector.name} class="connector-icon" />
				{/if}
				<span class="connector-name">{connector.name}</span>
				{#if !connector.ready}
					<span class="not-ready">{i18n.t('wallet.not_installed')}</span>
				{/if}
			</button>
		{/each}
	</div>
</Modal>

<!-- WalletConnect QR 码模态框 -->
<Modal
	open={connectStore.showWalletConnectModal}
	onClose={connectStore.closeWalletConnectModal}
	title={i18n.t('wallet.scan_qr')}
	maxWidth="420px"
>
	<div class="walletconnect-content">
		{#if connectStore.walletConnectUri}
			<div class="qr-code-container">
				<QRCode data={connectStore.walletConnectUri} />
			</div>

			<InstructionList title={i18n.t('wallet.walletconnect.title')} items={walletConnectSteps} />

			<CopyButtonWithText
				value={connectStore.walletConnectUri}
				text={i18n.t('wallet.walletconnect.copy_link')}
				copiedText={i18n.t('wallet.walletconnect.link_copied')}
			/>
		{:else}
			<div class="loading-container">
				<div class="loading-spinner"></div>
				<p>{t('wallet.walletconnect.generating')}</p>
			</div>
		{/if}
	</div>
</Modal>

<style>
	/* Connected Wallet Group */
	.wallet-connected-group {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.wallet-info-wrapper {
		position: relative;
	}

	.wallet-info-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: 0;
		background: transparent;
		border: none;
		cursor: default;
		transition: all 0.2s;
	}

	.wallet-info-button.clickable {
		cursor: pointer;
		padding: var(--space-2);
		border-radius: var(--radius-md);
	}

	.wallet-info-button.clickable:hover {
		background: var(--color-secondary);
	}

	.wallet-info-button :global(.chevron-icon) {
		color: var(--color-muted-foreground);
		transition: transform 0.2s;
	}

	/* Account Dropdown Items */
	.account-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		width: 100%;
		text-align: left;
	}

	.account-item:hover {
		background: var(--color-muted);
	}

	.account-address {
		flex: 1;
		min-width: 0;
	}

	.address-text {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		margin-bottom: var(--space-1);
	}

	.address-full {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		font-family: var(--font-mono, monospace);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.account-item :global(.check-icon) {
		color: var(--brand-500);
		flex-shrink: 0;
	}

	/* Icon Buttons */
	.icon-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--space-8);
		height: var(--space-8);
		padding: 0;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-secondary);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.icon-button:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.icon-button:active {
		transform: translateY(0);
	}

	.disconnect-button:hover {
		color: var(--color-danger);
		border-color: var(--color-danger);
	}

	/* Long Press Reset */
	.connect-button-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-2);
	}

	.long-press-indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--color-muted);
		border-radius: 0 0 var(--radius-md) var(--radius-md);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--brand-500), var(--color-danger));
		transition: width 0.05s linear;
	}

	.reset-hint {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		text-align: center;
		animation: fadeIn 0.3s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.connector-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.connector-item {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);

		background: var(--color-muted);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.connector-item:hover {
		background: var(--color-secondary);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.connector-icon {
		width: var(--space-8);
		height: var(--space-8);
		border-radius: var(--radius-md);
	}

	.connector-name {
		flex: 1;
	}

	.not-ready {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		padding: var(--space-1) var(--space-2);
		background: var(--color-muted);
		border-radius: var(--radius);
	}

	/* WalletConnect Modal Styles */
	.walletconnect-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-6);
	}

	.qr-code-container {
		width: 100%;
		display: flex;
		justify-content: center;
		padding: var(--space-4);
		background: var(--color-background);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-8);
	}

	.loading-spinner {
		width: var(--space-12);
		height: var(--space-12);
		border: 3px solid var(--color-border);
		border-top-color: var(--brand-600);
		border-radius: var(--radius-full);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-container p {
		margin: 0;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	@media (max-width: 768px) {
		.wallet-connected-group {
			width: 100%;
			justify-content: center;
			gap: var(--space-3);
		}

		.icon-button {
			min-width: var(--space-12);
			min-height: var(--space-10);
		}

		.qr-code-container {
			padding: var(--space-2);
		}
	}
</style>

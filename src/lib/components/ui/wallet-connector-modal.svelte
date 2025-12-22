<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import CopyButtonWithText from './copy-button-with-text.svelte';
	import Modal from './modal.svelte';
	import QRCode from './qr-code.svelte';
	import InstructionList from './instruction-list.svelte';

	import { useI18n } from '@shelchin/i18n/svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import { checkConsent } from '$lib/stores/cookie-consent.svelte';

	const i18n = useI18n();
	const t = i18n.t;

	// 从 context 获取 connect store
	const connectStore = useConnectStore();

	let accounts = $state<string[]>([]);

	// WalletConnect 说明步骤
	const walletConnectSteps = $derived([
		t('wallet.walletconnect.step_1'),
		t('wallet.walletconnect.step_2'),
		t('wallet.walletconnect.step_3')
	]);

	// 加载账户列表并恢复之前选择的账户
	async function loadAccounts() {
		const accs = await connectStore.getAccounts();
		accounts = accs || [];

		// 如果有多个账户，检查是否需要恢复之前选择的账户
		// Only check localStorage if functional cookies are consented
		if (accounts.length > 1 && connectStore.address && checkConsent('functional')) {
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

<!-- 连接器选择模态框 -->
<Modal
	open={connectStore.showConnectorModal}
	onClose={connectStore.closeModal}
	title={i18n.t('wallet.select_wallet')}
>
	<!-- Connection Error Display -->
	{#if connectStore.connectionError}
		<div class="connection-error-banner">
			<div class="error-header">
				<div class="error-icon">⚠️</div>
				<h4>{connectStore.connectionError.message}</h4>
				<button class="error-close" onclick={connectStore.clearConnectionError} type="button">
					×
				</button>
			</div>
			{#if connectStore.connectionError.details}
				<p class="error-details">{connectStore.connectionError.details}</p>
			{/if}
			{#if connectStore.connectionError.solutions}
				<div class="error-solutions">
					<strong>Solutions:</strong>
					<ul>
						{#each connectStore.connectionError.solutions as solution, index (index)}
							<li>{solution}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}

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

	/* Connection Error Banner */
	.connection-error-banner {
		margin-bottom: var(--space-4);
		padding: var(--space-4);
		background: hsla(0, 80%, 50%, 0.08);
		border: 2px solid hsl(0, 80%, 50%);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .connection-error-banner {
		background: hsla(0, 80%, 60%, 0.12);
		border-color: hsl(0, 80%, 60%);
	}

	.error-header {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.error-icon {
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.error-header h4 {
		flex: 1;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: hsl(0, 80%, 40%);
		margin: 0;
	}

	:global([data-theme='dark']) .error-header h4 {
		color: hsl(0, 80%, 65%);
	}

	.error-close {
		width: 24px;
		height: 24px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		background: transparent;
		border: none;
		color: var(--gray-500);
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		flex-shrink: 0;
		transition: color 0.2s;
	}

	.error-close:hover {
		color: hsl(0, 80%, 50%);
	}

	.error-details {
		margin: 0 0 var(--space-3) 0;
		padding-left: calc(1.5rem + var(--space-2));
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .error-details {
		color: var(--gray-300);
	}

	.error-solutions {
		padding-left: calc(1.5rem + var(--space-2));
		font-size: var(--text-sm);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .error-solutions {
		color: var(--gray-300);
	}

	.error-solutions strong {
		display: block;
		margin-bottom: var(--space-2);
		color: hsl(0, 80%, 40%);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .error-solutions strong {
		color: hsl(0, 80%, 65%);
	}

	.error-solutions ul {
		margin: 0;
		padding-left: var(--space-5);
		list-style-type: disc;
	}

	.error-solutions li {
		margin-bottom: var(--space-1);
		line-height: 1.5;
	}

	.error-solutions li:last-child {
		margin-bottom: 0;
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
		.qr-code-container {
			padding: var(--space-2);
		}
	}
</style>

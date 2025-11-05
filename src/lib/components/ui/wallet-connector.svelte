<script lang="ts">
	import {
		WalletConnectConnector,
		EIP6963Connector,
		type Connector
	} from '@shelchin/ethereum-connectors';
	import { mainnet } from 'viem/chains';
	import { onMount } from 'svelte';

	// 钱包连接状态
	let isConnected = $state(false);
	let isConnecting = $state(false);
	let address = $state<string | undefined>();
	let connector = $state<Connector | undefined>();

	// 格式化地址显示
	function formatAddress(addr: string): string {
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}

	// 连接钱包
	async function connect() {
		if (isConnecting) return;

		isConnecting = true;
		try {
			// TODO: 实现完整的连接器管理逻辑
			// 这里仅作为示例，需要集成 WalletConnectionManager
			console.log('Connecting wallet...');
		} catch (error) {
			console.error('Failed to connect wallet:', error);
		} finally {
			isConnecting = false;
		}
	}

	// 断开连接
	async function disconnect() {
		try {
			if (connector) {
				await connector.disconnect();
				isConnected = false;
				address = undefined;
				connector = undefined;
			}
		} catch (error) {
			console.error('Failed to disconnect wallet:', error);
		}
	}

	onMount(() => {
		// TODO: 实现自动连接逻辑
		// 从 localStorage 恢复连接状态
	});
</script>

{#if isConnected && address}
	<button class="wallet-button connected" onclick={disconnect} type="button">
		<span class="wallet-indicator"></span>
		<span class="wallet-address">{formatAddress(address)}</span>
	</button>
{:else}
	<button class="wallet-button connect" onclick={connect} disabled={isConnecting} type="button">
		{isConnecting ? '连接中...' : '连接钱包'}
	</button>
{/if}

<style>
	.wallet-button {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-5);
		border: none;
		border-radius: var(--radius-full);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	.wallet-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.wallet-button.connect {
		background: linear-gradient(135deg, var(--brand-500) 0%, var(--brand-600) 100%);
		color: var(--color-primary-foreground);
	}

	.wallet-button.connect:hover:not(:disabled) {
		background: linear-gradient(135deg, var(--brand-600) 0%, var(--brand-700) 100%);
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.wallet-button.connect:active:not(:disabled) {
		transform: translateY(0);
	}

	.wallet-button.connected {
		background: var(--color-secondary);
		color: var(--color-secondary-foreground);
		border: 1px solid var(--color-border);
	}

	.wallet-button.connected:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.wallet-indicator {
		width: var(--space-2);
		height: var(--space-2);
		border-radius: var(--radius-full);
		background: var(--color-success);
		animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.wallet-address {
		font-family: var(--font-family-mono);
		font-size: var(--text-sm);
	}

	@media (max-width: 768px) {
		.wallet-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>

<script lang="ts">
	interface Props {
		address: string;
		connectorIcon?: string;
		showIndicator?: boolean;
		formatAddress?: (addr: string) => string;
		class?: string;
	}

	let {
		address,
		connectorIcon,
		showIndicator = true,
		formatAddress = defaultFormatAddress,
		class: className = ''
	}: Props = $props();

	// 默认地址格式化函数
	function defaultFormatAddress(addr: string): string {
		if (addr.length < 10) return addr;
		return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
	}
</script>

<div class="wallet-info {className}">
	{#if connectorIcon}
		<img src={connectorIcon} alt="Wallet" class="connector-icon" />
	{:else if showIndicator}
		<span class="wallet-indicator"></span>
	{/if}
	<span class="wallet-address">{formatAddress(address)}</span>
</div>

<style>
	.wallet-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-secondary);
		color: var(--color-secondary-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
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

	.connector-icon {
		width: var(--space-4);
		height: var(--space-4);
		border-radius: var(--radius-sm);
	}
</style>

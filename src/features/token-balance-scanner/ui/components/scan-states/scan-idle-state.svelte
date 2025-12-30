<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { Play } from '@lucide/svelte';

	interface Props {
		networkName: string;
		walletCount: number;
		tokenCount: number;
		rpcCount: number;
		onStartScan: () => void;
	}

	let { networkName, walletCount, tokenCount, rpcCount, onStartScan }: Props = $props();

	const i18n = useI18n();
</script>

<div class="scan-idle">
	<div class="scan-config">
		<div class="config-item">
			<span class="config-label"
				>{i18n.t('routes/apps/token-balance-scanner.step5.config.network') || 'Network'}:</span
			>
			<span class="config-value">{networkName}</span>
		</div>
		<div class="config-item">
			<span class="config-label"
				>{i18n.t('routes/apps/token-balance-scanner.step5.config.wallets') || 'Wallets'}:</span
			>
			<span class="config-value">{walletCount}</span>
		</div>
		<div class="config-item">
			<span class="config-label"
				>{i18n.t('routes/apps/token-balance-scanner.step5.config.tokens') || 'Tokens'}:</span
			>
			<span class="config-value">{tokenCount}</span>
		</div>
		<div class="config-item">
			<span class="config-label"
				>{i18n.t('routes/apps/token-balance-scanner.step5.config.rpcs') || 'RPC Endpoints'}:</span
			>
			<span class="config-value">{rpcCount}</span>
		</div>
	</div>

	<button class="start-btn" onclick={onStartScan}>
		<Play size={24} />
		<span>{i18n.t('routes/apps/token-balance-scanner.step5.start') || 'Start Scanning'}</span>
	</button>
</div>

<style>
	.scan-idle {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.scan-config {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.config-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.config-item:last-child {
		border-bottom: none;
	}

	.config-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .config-label {
		color: var(--gray-400);
	}

	.config-value {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .config-value {
		color: var(--gray-100);
	}

	.start-btn {
		width: 100%;
		padding: var(--space-4) var(--space-8);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
	}

	.start-btn:hover {
		opacity: 0.9;
	}
</style>

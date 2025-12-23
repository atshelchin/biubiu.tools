<script lang="ts">
	import { Loader2, Search, Check } from '@lucide/svelte';

	interface Props {
		isScanning: boolean;
		scanProgress?: number;
		scanCompleted?: boolean;
		disabled?: boolean;
		scanningText?: string;
		scanButtonText?: string;
		completedText?: string;
		onScan: () => void;
	}

	let {
		isScanning,
		scanProgress: _scanProgress,
		scanCompleted = false,
		disabled = false,
		scanningText = 'Scanning...',
		scanButtonText = 'Scan Balances',
		completedText = 'Scan Completed',
		onScan
	}: Props = $props();
	// Note: scanProgress is received but not displayed (commented out in template)
	void _scanProgress;

	let isDisabled = $derived(disabled || isScanning);
</script>

<button
	class="scan-balance-btn"
	class:scanning={isScanning}
	class:completed={scanCompleted && !isScanning}
	onclick={onScan}
	disabled={isDisabled}
>
	{#if isScanning}
		<Loader2 size={16} class="spinning" />
		<span>{scanningText}</span>
	{:else if scanCompleted}
		<Check size={16} />
		<span>{completedText}</span>
	{:else}
		<Search size={16} />
		<span>{scanButtonText}</span>
	{/if}
</button>

<style>
	.scan-balance-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
		min-width: 160px;
		width: 100%;
	}

	.scan-balance-btn:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
	}

	.scan-balance-btn:active:not(:disabled) {
		transform: translateY(0);
	}

	.scan-balance-btn:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}

	.scan-balance-btn.scanning {
		background: linear-gradient(135deg, #6366f1, #4f46e5);
	}

	.scan-balance-btn.completed {
		background: linear-gradient(135deg, #10b981, #059669);
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

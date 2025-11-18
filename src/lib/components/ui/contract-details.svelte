<script lang="ts">
	import { ExternalLink } from '@lucide/svelte';
	import type { Address } from 'viem';

	interface DetailItem {
		label: string;
		value: string;
	}

	interface Props {
		/** Contract address to display */
		contractAddress?: Address;
		/** Block explorer base URL */
		blockExplorer?: string;
		/** Additional detail items to display */
		details?: DetailItem[];
		/** Label for contract address row */
		addressLabel?: string;
	}

	let {
		contractAddress,
		blockExplorer,
		details = [],
		addressLabel = 'Contract Address:'
	}: Props = $props();
</script>

<div class="contract-details">
	{#each details as detail}
		<div class="detail-row">
			<span class="label">{detail.label}</span>
			<span class="value">{detail.value}</span>
		</div>
	{/each}

	{#if contractAddress}
		<div class="detail-row">
			<span class="label">{addressLabel}</span>
			<div class="address-value">
				<code>{contractAddress}</code>
				{#if blockExplorer}
					<a
						href="{blockExplorer}/address/{contractAddress}"
						target="_blank"
						rel="noopener noreferrer"
						class="explorer-link"
						title="View on Block Explorer"
					>
						<ExternalLink size={14} />
					</a>
				{/if}
			</div>
		</div>
	{/if}
</div>

<style>
	.contract-details {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--gray-50);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .contract-details {
		background: var(--gray-900);
	}

	.detail-row {
		display: flex;
		gap: var(--space-3);
		align-items: center;
		font-size: var(--text-sm);
	}

	.label {
		font-weight: var(--font-semibold);
		color: var(--gray-600);
		min-width: 140px;
		flex-shrink: 0;
	}

	:global([data-theme='dark']) .label {
		color: var(--gray-400);
	}

	.value {
		color: var(--gray-900);
		flex: 1;
	}

	:global([data-theme='dark']) .value {
		color: var(--gray-100);
	}

	.address-value {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	code {
		font-family: var(--font-mono, monospace);
		font-size: var(--text-xs);
		color: var(--gray-700);
		background: var(--gray-50);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
		word-break: break-all;
		flex: 1;
	}

	:global([data-theme='dark']) code {
		color: var(--gray-300);
		background: var(--gray-900);
		border-color: var(--gray-700);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		color: var(--gray-600);
		background: var(--gray-50);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.explorer-link:hover {
		color: var(--color-primary);
		background: var(--gray-100);
	}

	:global([data-theme='dark']) .explorer-link {
		background: var(--gray-900);
		border-color: var(--gray-700);
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .explorer-link:hover {
		background: var(--gray-800);
		color: var(--color-primary);
	}

	@media (max-width: 640px) {
		.detail-row {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-1);
		}

		.label {
			min-width: auto;
		}
	}
</style>

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
	{#each details as detail (detail.label)}
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
		width: 100%;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-3) var(--space-4);
		padding: var(--space-4);
		background: var(--gray-200);
		border-radius: var(--radius-lg);
		align-items: start;
	}

	:global([data-theme='dark']) .contract-details {
		background: var(--gray-900);
	}

	.detail-row {
		display: contents;
	}

	.label {
		font-weight: var(--font-semibold);
		color: var(--gray-600);
		font-size: var(--text-sm);
		white-space: nowrap;
		padding-top: 2px;
	}

	:global([data-theme='dark']) .label {
		color: var(--gray-400);
	}

	.value {
		color: var(--gray-900);
		font-size: var(--text-sm);
		word-break: break-word;
	}

	:global([data-theme='dark']) .value {
		color: var(--gray-100);
	}

	.address-value {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
	}

	code {
		font-family: var(--font-mono, monospace);
		font-size: var(--text-xs);
		color: var(--gray-700);
		/* background: var(--white); */
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		word-break: break-all;
		flex: 1;
	}

	:global([data-theme='dark']) code {
		color: var(--gray-300);
		/* background: var(--gray-800); */
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		color: var(--gray-600);
		/* background: var(--white); */
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.explorer-link:hover {
		color: var(--color-primary);
		background: var(--gray-100);
	}

	:global([data-theme='dark']) .explorer-link {
		/* background: var(--gray-800); */
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .explorer-link:hover {
		background: var(--gray-700);
		color: var(--color-primary);
	}

	/* Responsive: Hide labels on small screens for cleaner look */
	@media (max-width: 640px) {
		.contract-details {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);
			padding: var(--space-3);
		}

		.detail-row {
			display: block;
		}

		.label {
			display: none;
		}

		.value {
			font-size: var(--text-sm);
		}

		.address-value {
			flex-wrap: wrap;
		}

		code {
			font-size: 11px;
			padding: 0px;
			/* padding: var(--space-1-5) var(--space-2-5); */
			word-break: break-all;
		}

		.explorer-link {
			padding: var(--space-1-5);
		}
	}

	/* Tablet: Optimize spacing */
	@media (min-width: 641px) and (max-width: 1024px) {
		.contract-details {
			gap: var(--space-2) var(--space-3);
		}
	}
</style>

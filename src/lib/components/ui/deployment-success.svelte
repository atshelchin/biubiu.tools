<script lang="ts">
	import { CheckCircle2, ExternalLink } from '@lucide/svelte';
	import type { Address } from 'viem';

	interface Props {
		/** Contract address that was deployed */
		contractAddress: Address;
		/** Block explorer base URL */
		blockExplorer?: string;
		/** Success message title */
		title?: string;
		/** Success message description */
		description?: string;
		/** View on explorer link text */
		viewOnExplorerText?: string;
	}

	let {
		contractAddress,
		blockExplorer,
		title = 'Deployment Successful!',
		description = 'The contract has been successfully deployed.',
		viewOnExplorerText = 'View on Explorer'
	}: Props = $props();
</script>

<div class="success-section">
	<CheckCircle2 size={64} />
	<h3>{title}</h3>
	<!-- <p>{description}</p> -->
	<div class="deployed-address">
		<code>{contractAddress}</code>
		{#if blockExplorer}
			<a
				href="{blockExplorer}/address/{contractAddress}"
				target="_blank"
				rel="noopener noreferrer"
				class="explorer-link"
			>
				<ExternalLink size={16} />
				{viewOnExplorerText}
			</a>
		{/if}
	</div>
</div>

<style>
	.success-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		align-items: center;
		text-align: center;
		animation: fadeInUp 0.4s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.success-section :global(svg:first-child) {
		color: hsl(120, 60%, 45%);
		filter: drop-shadow(0 0 12px hsla(120, 60%, 50%, 0.6));
		animation: successPop 0.6s ease-out;
	}

	@keyframes successPop {
		0% {
			transform: scale(0);
			opacity: 0;
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
			opacity: 1;
		}
	}

	h3 {
		background: linear-gradient(135deg, hsl(220, 70%, 55%) 0%, hsl(250, 70%, 60%) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0;
	}

	p {
		margin: 0;
		color: var(--gray-600);
		line-height: 1.6;
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}

	.deployed-address {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-3);
		width: 100%;
	}

	code {
		font-family: var(--font-mono, monospace);
		font-size: var(--text-sm);
		color: var(--gray-700);
		background: var(--gray-200);
		padding: var(--space-2-5) var(--space-4);
		border-radius: var(--radius-md);
		word-break: break-all;
		max-width: 100%;
	}

	:global([data-theme='dark']) code {
		color: var(--gray-300);
		background: var(--gray-800);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2-5) var(--space-4);
		color: var(--color-primary);
		background: var(--gray-100);
		border-radius: var(--radius-md);
		transition: all 0.2s;
		text-decoration: none;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.explorer-link:hover {
		background: var(--color-primary);
		color: white;
	}

	:global([data-theme='dark']) .explorer-link {
		background: var(--gray-800);
	}

	:global([data-theme='dark']) .explorer-link:hover {
		background: var(--color-primary);
		color: white;
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.success-section {
			gap: var(--space-4);
		}

		h3 {
			font-size: var(--text-xl);
		}

		p {
			font-size: var(--text-sm);
		}

		code {
			font-size: 11px;
			padding: var(--space-2) var(--space-3);
		}

		.explorer-link {
			font-size: 13px;
			padding: var(--space-2) var(--space-3);
		}
	}
</style>

<script lang="ts">
	import type { Token, ERC20Token } from '$lib/types/token';
	import { ExternalLink } from 'lucide-svelte';

	interface Props {
		tokens: Token[];
		currentNetwork?: { blockExplorer?: string } | null;
	}

	let { tokens, currentNetwork = null }: Props = $props();
</script>

{#if tokens.length > 0}
	<div class="token-list">
		{#each tokens as token (token.id)}
			<div class="token-item">
				<div class="token-info">
					<div class="token-icon">
						{#if token.logoUrl}
							<img src={token.logoUrl} alt={token.symbol} />
						{:else}
							<div class="token-placeholder">{token.symbol.charAt(0)}</div>
						{/if}
					</div>
					<div class="token-details">
						<strong>{token.symbol}</strong>
						<small>{token.name}</small>
					</div>
				</div>
				<div class="token-meta">
					<span class="token-type">{token.type === 'native' ? 'Native' : 'ERC20'}</span>
					{#if token.type === 'erc20' && currentNetwork?.blockExplorer}
						{@const erc20Token = token as ERC20Token}
						<a
							href="{currentNetwork.blockExplorer}/address/{erc20Token.address}"
							target="_blank"
							rel="noopener noreferrer"
							class="explorer-link"
							title="View on explorer"
						>
							<ExternalLink size={14} />
						</a>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{:else}
	<p class="empty-message">No tokens selected</p>
{/if}

<style>
	.token-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.token-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}
	:global([data-theme='dark']) .token-item {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.token-item:hover {
		background: var(--gray-100);
		border-color: var(--gray-300);
	}
	:global([data-theme='dark']) .token-item:hover {
		background: var(--gray-750);
		border-color: var(--gray-600);
	}

	.token-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.token-icon {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--gray-200);
	}
	:global([data-theme='dark']) .token-icon {
		background: var(--gray-700);
	}

	.token-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.token-placeholder {
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: var(--gray-600);
	}
	:global([data-theme='dark']) .token-placeholder {
		color: var(--gray-300);
	}

	.token-details {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.token-details strong {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}
	:global([data-theme='dark']) .token-details strong {
		color: var(--gray-100);
	}

	.token-details small {
		font-size: var(--text-xs);
		color: var(--gray-600);
	}
	:global([data-theme='dark']) .token-details small {
		color: var(--gray-400);
	}

	.token-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.token-type {
		padding: 2px 8px;
		background: var(--color-primary);
		color: white;
		font-size: var(--text-xs);
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		color: var(--color-primary);
		transition: color 0.2s;
	}

	.explorer-link:hover {
		color: var(--color-primary-dark);
	}

	.empty-message {
		text-align: center;
		color: var(--gray-500);
		font-size: var(--text-sm);
		padding: var(--space-4);
	}
</style>

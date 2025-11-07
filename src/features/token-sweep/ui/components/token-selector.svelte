<script lang="ts">
	import type { Token } from '$lib/types/token';
	import { CheckCircle2, Trash2, ExternalLink } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		tokens: Token[];
		selectedTokenIds?: SvelteSet<string>;
		onToggle?: (tokenId: string) => void;
		onSelectAll?: () => void;
		onDeselectAll?: () => void;
		onRemoveCustomToken?: (tokenId: string) => void;
		blockExplorer?: string;
		emptyMessage?: string;
		showBulkActions?: boolean;
	}

	let {
		tokens,
		selectedTokenIds = new SvelteSet<string>(),
		onToggle,
		onSelectAll,
		onDeselectAll,
		onRemoveCustomToken,
		blockExplorer,
		emptyMessage = 'No tokens available',
		showBulkActions = true
	}: Props = $props();

	function handleToggle(tokenId: string) {
		onToggle?.(tokenId);
	}

	function handleSelectAll() {
		onSelectAll?.();
	}

	function handleDeselectAll() {
		onDeselectAll?.();
	}

	function handleRemove(tokenId: string) {
		if (confirm('Are you sure you want to remove this custom token?')) {
			onRemoveCustomToken?.(tokenId);
		}
	}

	function getTokenLogo(token: Token): string {
		if (token.logoUrl) return token.logoUrl;
		// Fallback to generic icon
		return `https://ui-avatars.com/api/?name=${token.symbol}&background=random`;
	}
</script>

{#if tokens.length === 0}
	<div class="empty-state">
		<div class="empty-icon">🪙</div>
		<p>{emptyMessage}</p>
	</div>
{:else}
	{#if showBulkActions && tokens.length > 0}
		<div class="bulk-actions">
			<button class="btn-secondary" onclick={handleSelectAll}>Select All</button>
			<button class="btn-secondary" onclick={handleDeselectAll}>Deselect All</button>
		</div>
	{/if}
	<div class="tokens-grid">
		{#each tokens as token (token.id)}
			<div
				class="token-card"
				class:selected={selectedTokenIds.has(token.id)}
				onclick={() => handleToggle(token.id)}
				transition:slide={{ duration: 200 }}
			>
				<div class="token-card-content">
					<div class="token-header">
						<img src={getTokenLogo(token)} alt={token.symbol} class="token-logo" />
						<div class="token-info">
							<h4>{token.symbol}</h4>
							<p class="token-name">{token.name}</p>
						</div>
					</div>

					<div class="token-meta">
						<span class="token-type">{token.type === 'native' ? 'Native' : 'ERC20'}</span>
						{#if token.type === 'erc20' && blockExplorer}
							{@const erc20Token = token as import('$lib/types/token').ERC20Token}
							<a
								href="{blockExplorer}/address/{erc20Token.address}"
								target="_blank"
								rel="noopener noreferrer"
								class="explorer-link"
								onclick={(e) => e.stopPropagation()}
							>
								<ExternalLink size={14} />
							</a>
						{/if}
						{#if token.isCustom && onRemoveCustomToken}
							<button
								class="remove-btn"
								onclick={(e) => {
									e.stopPropagation();
									handleRemove(token.id);
								}}
								title="Remove custom token"
							>
								<Trash2 size={14} />
							</button>
						{/if}
					</div>
				</div>

				<div class="token-checkmark">
					{#if selectedTokenIds.has(token.id)}
						<CheckCircle2 size={24} />
					{:else}
						<div class="checkmark-placeholder"></div>
					{/if}
				</div>
			</div>
		{/each}
	</div>
{/if}

<style>
	.bulk-actions {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-8);
		text-align: center;
	}

	.empty-icon {
		font-size: 4rem;
	}

	.empty-state p {
		color: var(--gray-600);
		max-width: 400px;
	}

	:global([data-theme='dark']) .empty-state p {
		color: var(--gray-400);
	}

	.tokens-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: var(--space-4);
		padding: var(--space-2);
	}

	.token-card {
		position: relative;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	:global([data-theme='dark']) .token-card {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.token-card:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .token-card:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.token-card.selected {
		border-color: var(--color-primary);
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	:global([data-theme='dark']) .token-card.selected {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
	}

	.token-card-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.token-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.token-logo {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		background: var(--gray-100);
	}

	:global([data-theme='dark']) .token-logo {
		background: var(--gray-700);
	}

	.token-info {
		flex: 1;
		min-width: 0;
	}

	.token-info h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin: 0;
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .token-info h4 {
		color: var(--gray-100);
	}

	.token-name {
		font-size: var(--text-sm);
		color: var(--gray-500);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0;
	}

	.token-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.token-type {
		display: inline-block;
		padding: 2px 8px;
		background: var(--gray-200);
		color: var(--gray-700);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .token-type {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		padding: 4px;
		color: var(--color-primary);
		background: var(--color-panel-1);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
		text-decoration: none;
	}

	.explorer-link:hover {
		background: var(--color-primary);
		color: white;
	}

	.remove-btn {
		display: inline-flex;
		align-items: center;
		padding: 4px;
		background: transparent;
		border: none;
		color: hsl(0, 70%, 50%);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}

	.remove-btn:hover {
		background: hsla(0, 70%, 50%, 0.1);
		color: hsl(0, 80%, 40%);
	}

	.token-checkmark {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		color: var(--color-primary);
	}

	.checkmark-placeholder {
		width: 24px;
		height: 24px;
		border: 2px solid var(--gray-300);
		border-radius: 50%;
	}

	:global([data-theme='dark']) .checkmark-placeholder {
		border-color: var(--gray-600);
	}

	@media (max-width: 768px) {
		.tokens-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

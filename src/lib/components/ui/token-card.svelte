<script lang="ts">
	import type { Token, ERC20Token } from '$lib/types/token';
	import { CheckCircle2, Trash2, ExternalLink } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import ConfirmDialog from '$lib/components/ui/confirm-dialog.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	interface Props {
		token: Token;
		isSelected?: boolean;
		blockExplorer?: string;
		onToggle?: (tokenId: string) => void;
		onRemove?: (tokenId: string, chainId: number) => void;
		showCheckmark?: boolean;
	}

	let {
		token,
		isSelected = false,
		blockExplorer,
		onToggle,
		onRemove,
		showCheckmark = true
	}: Props = $props();

	const i18n = useI18n();
	let showConfirmDialog = $state(false);

	function handleToggle() {
		onToggle?.(token.id);
	}

	function handleRemove(e: Event) {
		e.stopPropagation();
		showConfirmDialog = true;
	}

	function confirmRemove() {
		onRemove?.(token.id, token.chainId);
		showConfirmDialog = false;
	}

	function cancelRemove() {
		showConfirmDialog = false;
	}

	function getTokenLogo(token: Token): string {
		if (token.logoUrl) return token.logoUrl;
		// Fallback to generic icon
		return `https://ui-avatars.com/api/?name=${token.symbol}&background=random`;
	}
</script>

<div
	class="token-card"
	class:selected={isSelected}
	onclick={handleToggle}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleToggle();
		}
	}}
	role="button"
	tabindex="0"
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
			<span class="token-type"
				>{token.type === 'native'
					? i18n.t('components.token_card.native')
					: i18n.t('components.token_card.erc20')}</span
			>
			{#if token.type === 'erc20' && blockExplorer}
				{@const erc20Token = token as ERC20Token}
				<a
					href="{blockExplorer}/token/{erc20Token.address}"
					target="_blank"
					rel="noopener noreferrer"
					class="explorer-link"
					onclick={(e) => e.stopPropagation()}
				>
					<ExternalLink size={14} />
				</a>
			{/if}
			{#if token.isCustom && onRemove}
				<button
					class="remove-btn"
					onclick={handleRemove}
					title={i18n.t('components.token_card.remove_custom_token')}
				>
					<Trash2 size={14} />
				</button>
			{/if}
		</div>
	</div>

	{#if showCheckmark}
		<div class="token-checkmark">
			{#if isSelected}
				<CheckCircle2 size={24} />
			{:else}
				<div class="checkmark-placeholder"></div>
			{/if}
		</div>
	{/if}
</div>

<ConfirmDialog
	bind:open={showConfirmDialog}
	title={i18n.t('components.token_card.remove_dialog_title')}
	message={i18n.t('components.token_card.remove_dialog_message', {
		symbol: token.symbol,
		name: token.name
	})}
	confirmText={i18n.t('components.token_card.remove_button')}
	cancelText={i18n.t('common.cancel')}
	variant="danger"
	requireLongPress={false}
	longPressDuration={3000}
	onConfirm={confirmRemove}
	onCancel={cancelRemove}
/>

<style>
	.token-card {
		position: relative;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		text-align: left;
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
		width: 36px;
		height: 36px;
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
</style>

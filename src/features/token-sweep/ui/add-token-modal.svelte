<script lang="ts">
	import Modal from '$lib/components/ui/modal.svelte';
	import { addCustomToken } from '../utils/token-storage';
	import type { ERC20Token } from '../types/token';
	import type { Address } from 'viem';
	import { slide } from 'svelte/transition';

	interface Props {
		open: boolean;
		chainId: number;
		onClose: () => void;
		onTokenAdded?: (tokenId: string) => void;
	}

	let { open = $bindable(false), chainId, onClose, onTokenAdded }: Props = $props();

	let newTokenAddress = $state('');
	let newTokenSymbol = $state('');
	let newTokenName = $state('');
	let newTokenDecimals = $state('18');
	let isAddingToken = $state(false);
	let addTokenError = $state('');

	// Reset form when modal opens
	$effect(() => {
		if (open) {
			newTokenAddress = '';
			newTokenSymbol = '';
			newTokenName = '';
			newTokenDecimals = '18';
			addTokenError = '';
			isAddingToken = false;
		}
	});

	async function handleAddToken() {
		// Validate inputs
		if (!newTokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
			addTokenError = 'Invalid token address';
			return;
		}

		if (!newTokenSymbol || !newTokenName) {
			addTokenError = 'Symbol and name are required';
			return;
		}

		const decimals = parseInt(newTokenDecimals);
		if (isNaN(decimals) || decimals < 0 || decimals > 18) {
			addTokenError = 'Decimals must be between 0 and 18';
			return;
		}

		isAddingToken = true;
		addTokenError = '';

		try {
			const tokenId = `${chainId}:${newTokenAddress.toLowerCase()}`;

			const customToken: ERC20Token = {
				id: tokenId,
				type: 'erc20',
				address: newTokenAddress as Address,
				symbol: newTokenSymbol.toUpperCase(),
				name: newTokenName,
				decimals,
				chainId,
				isCustom: true
			};

			addCustomToken(customToken);

			// Notify parent and close
			onTokenAdded?.(tokenId);
			onClose();
		} catch (error) {
			console.error('Failed to add token:', error);
			addTokenError = error instanceof Error ? error.message : 'Failed to add token';
		} finally {
			isAddingToken = false;
		}
	}

	function handleCancel() {
		if (!isAddingToken) {
			onClose();
		}
	}
</script>

<Modal {open} onClose={handleCancel} title="Add Custom Token" maxWidth="500px">
	<div class="form-container">
			<div class="form-group">
				<label for="token-address">Token Address</label>
				<input
					id="token-address"
					type="text"
					placeholder="0x..."
					bind:value={newTokenAddress}
					class="form-input"
					disabled={isAddingToken}
				/>
			</div>

			<div class="form-group">
				<label for="token-symbol">Token Symbol</label>
				<input
					id="token-symbol"
					type="text"
					placeholder="e.g. USDT"
					bind:value={newTokenSymbol}
					class="form-input"
					disabled={isAddingToken}
				/>
			</div>

			<div class="form-group">
				<label for="token-name">Token Name</label>
				<input
					id="token-name"
					type="text"
					placeholder="e.g. Tether USD"
					bind:value={newTokenName}
					class="form-input"
					disabled={isAddingToken}
				/>
			</div>

			<div class="form-group">
				<label for="token-decimals">Decimals</label>
				<input
					id="token-decimals"
					type="number"
					min="0"
					max="18"
					bind:value={newTokenDecimals}
					class="form-input"
					disabled={isAddingToken}
				/>
			</div>

			{#if addTokenError}
				<div class="error-message" transition:slide>
					{addTokenError}
				</div>
			{/if}
		</div>

	{#snippet footer()}
		<div class="footer-actions">
			<button class="btn-secondary" onclick={handleCancel} disabled={isAddingToken}>
				Cancel
			</button>
			<button class="btn-primary" onclick={handleAddToken} disabled={isAddingToken}>
				{isAddingToken ? 'Adding...' : 'Add Token'}
			</button>
		</div>
	{/snippet}
</Modal>

<style>
	.form-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-group label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .form-group label {
		color: var(--gray-300);
	}

	.form-input {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-base);
		background: var(--white);
		color: var(--gray-900);
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .form-input {
		background: var(--gray-700);
		color: var(--gray-100);
		border-color: var(--gray-600);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.form-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error-message {
		padding: var(--space-3);
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		border-radius: var(--radius-sm);
		color: hsl(0, 80%, 40%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .error-message {
		background: hsla(0, 80%, 15%, 0.5);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	.footer-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: flex-end;
		width: 100%;
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--gray-300);
	}

	:global([data-theme='dark']) .btn-secondary:hover:not(:disabled) {
		background: var(--gray-600);
	}

	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>

<script lang="ts">
	import type { ERC20Token } from '$lib/types/token';
	import Modal from '$lib/components/ui/modal.svelte';
	import { addCustomToken } from '$lib/utils/token-storage';
	import type { Address } from 'viem';
	import { createPublicClient, http, getAddress } from 'viem';
	import { scale, fade } from 'svelte/transition';
	import { Loader2, CheckCircle2, AlertCircle } from '@lucide/svelte';
	import { SvelteSet } from 'svelte/reactivity';

	interface Props {
		open: boolean;
		chainId: number;
		rpcUrl: string;
		onClose: () => void;
		onTokenAdded?: (tokenId: string) => void;
	}

	let { open = $bindable(false), chainId, rpcUrl, onClose, onTokenAdded }: Props = $props();

	// Form state
	let newTokenAddress = $state('');
	let newTokenSymbol = $state('');
	let newTokenName = $state('');
	let newTokenDecimals = $state('18');

	// UI state
	let isFetchingInfo = $state(false);
	let isAddingToken = $state(false);
	let fetchStatus = $state<'idle' | 'loading' | 'success' | 'error'>('idle');
	let errorMessage = $state('');
	let fetchedFields = $state<SvelteSet<string>>(new SvelteSet());
	// ERC20 ABI for fetching token info
	const ERC20_ABI = [
		{
			constant: true,
			inputs: [],
			name: 'name',
			outputs: [{ name: '', type: 'string' }],
			type: 'function'
		},
		{
			constant: true,
			inputs: [],
			name: 'symbol',
			outputs: [{ name: '', type: 'string' }],
			type: 'function'
		},
		{
			constant: true,
			inputs: [],
			name: 'decimals',
			outputs: [{ name: '', type: 'uint8' }],
			type: 'function'
		}
	] as const;

	// Reset form when modal opens
	$effect(() => {
		if (open) {
			newTokenAddress = '';
			newTokenSymbol = '';
			newTokenName = '';
			newTokenDecimals = '18';
			errorMessage = '';
			fetchStatus = 'idle';
			isFetchingInfo = false;
			isAddingToken = false;
			fetchedFields = new SvelteSet();
		}
	});

	// Auto-fetch token info when address changes
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		if (newTokenAddress && newTokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
			// Debounce the fetch
			if (debounceTimer) clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				fetchTokenInfo();
			}, 500);
		} else {
			fetchStatus = 'idle';
			errorMessage = '';
		}

		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});

	async function fetchTokenInfo() {
		if (!newTokenAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
			return;
		}

		isFetchingInfo = true;
		fetchStatus = 'loading';
		errorMessage = '';
		fetchedFields = new SvelteSet();

		try {
			const publicClient = createPublicClient({
				transport: http(rpcUrl)
			});

			// Fetch all token info in parallel
			const [symbol, name, decimals] = await Promise.all([
				publicClient.readContract({
					address: newTokenAddress as Address,
					abi: ERC20_ABI,
					functionName: 'symbol'
				}),
				publicClient.readContract({
					address: newTokenAddress as Address,
					abi: ERC20_ABI,
					functionName: 'name'
				}),
				publicClient.readContract({
					address: newTokenAddress as Address,
					abi: ERC20_ABI,
					functionName: 'decimals'
				})
			]);

			// Smooth fill animation - delay each field slightly
			fetchStatus = 'success';
			fetchedFields = new SvelteSet();

			// Fill symbol
			await new Promise((resolve) => setTimeout(resolve, 100));
			newTokenSymbol = symbol as string;
			fetchedFields.add('symbol');

			// Fill name
			await new Promise((resolve) => setTimeout(resolve, 100));
			newTokenName = name as string;
			fetchedFields.add('name');

			// Fill decimals
			await new Promise((resolve) => setTimeout(resolve, 100));
			newTokenDecimals = String(decimals);
			fetchedFields.add('decimals');

			// Clear success state after a moment
			setTimeout(() => {
				if (fetchStatus === 'success') {
					fetchStatus = 'idle';
				}
			}, 2000);
		} catch (error) {
			console.error('Failed to fetch token info:', error);
			fetchStatus = 'error';

			// Provide helpful error messages
			if (error instanceof Error) {
				if (error.message.includes('execution reverted') || error.message.includes('revert')) {
					errorMessage =
						'This address is not a valid ERC-20 token contract. Please check the address and try again.';
				} else if (error.message.includes('network') || error.message.includes('fetch')) {
					errorMessage =
						'Network error. Please check your connection and RPC endpoint, then try again.';
				} else {
					errorMessage = `Failed to fetch token info: ${error.message}`;
				}
			} else {
				errorMessage = 'Unable to fetch token information. You can still add it manually.';
			}
		} finally {
			isFetchingInfo = false;
		}
	}

	async function handleAddToken() {
		// Validate inputs
		if (!newTokenAddress.match(/^0x[a-fA-F0-9]{40}$/i)) {
			errorMessage = 'Invalid token address. Please enter a valid Ethereum address (0x...).';
			return;
		}

		// Prevent saving if auto-fetch failed (address not found)
		if (fetchStatus === 'error') {
			errorMessage =
				'Cannot add token: unable to verify this address as a valid ERC-20 token. Please check the address or enter token details manually.';
			return;
		}

		if (!newTokenSymbol || !newTokenName) {
			errorMessage = 'Token symbol and name are required. Please fill in all fields.';
			return;
		}

		const decimals = parseInt(newTokenDecimals);
		if (isNaN(decimals) || decimals < 0 || decimals > 18) {
			errorMessage = 'Decimals must be a number between 0 and 18.';
			return;
		}

		isAddingToken = true;
		errorMessage = '';

		try {
			// Convert to checksum address
			let checksumAddress: Address;
			try {
				checksumAddress = getAddress(newTokenAddress);
			} catch {
				errorMessage = 'Invalid Ethereum address format.';
				return;
			}

			const tokenId = `${chainId}:${checksumAddress.toLowerCase()}`;

			const customToken: ERC20Token = {
				id: tokenId,
				type: 'erc20',
				address: checksumAddress,
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
			errorMessage =
				error instanceof Error
					? error.message
					: 'Failed to add token. Please try again or contact support.';
		} finally {
			isAddingToken = false;
		}
	}

	function handleCancel() {
		if (!isAddingToken && !isFetchingInfo) {
			onClose();
		}
	}
</script>

<Modal {open} onClose={handleCancel} title="Add Custom Token" maxWidth="500px">
	<div class="form-container">
		<!-- Token Address Input with Status Indicator -->
		<div class="form-group">
			<label for="token-address">
				Token Address
				{#if isFetchingInfo}
					<span class="status-badge loading" transition:scale={{ duration: 500, start: 0.8 }}>
						<Loader2 size={12} class="spin" />
						Fetching...
					</span>
				{:else if fetchStatus === 'success'}
					<span class="status-badge success" transition:scale={{ duration: 500, start: 0.8 }}>
						<CheckCircle2 size={12} />
						Found!
					</span>
				{:else if fetchStatus === 'error'}
					<span class="status-badge error" transition:scale={{ duration: 500, start: 0.8 }}>
						<AlertCircle size={12} />
						Not found
					</span>
				{/if}
			</label>
			<input
				id="token-address"
				type="text"
				placeholder="0x... "
				bind:value={newTokenAddress}
				class="form-input"
				class:loading={isFetchingInfo}
				disabled={isAddingToken}
			/>
			<p class="input-hint">Enter the contract address of the ERC-20 token</p>
		</div>

		<!-- Token Symbol -->
		<div class="form-group">
			<label for="token-symbol">
				Token Symbol
				{#if fetchedFields.has('symbol')}
					<span class="auto-filled" transition:scale={{ duration: 200, start: 0.8 }}
						>Auto-filled</span
					>
				{/if}
			</label>
			<input
				id="token-symbol"
				type="text"
				placeholder="e.g. USDT"
				bind:value={newTokenSymbol}
				class="form-input"
				class:auto-filled={fetchedFields.has('symbol')}
				disabled={isAddingToken || isFetchingInfo}
			/>
		</div>

		<!-- Token Name -->
		<div class="form-group">
			<label for="token-name">
				Token Name
				{#if fetchedFields.has('name')}
					<span class="auto-filled" transition:scale={{ duration: 200, start: 0.8 }}
						>Auto-filled</span
					>
				{/if}
			</label>
			<input
				id="token-name"
				type="text"
				placeholder="e.g. Tether USD"
				bind:value={newTokenName}
				class="form-input"
				class:auto-filled={fetchedFields.has('name')}
				disabled={isAddingToken || isFetchingInfo}
			/>
		</div>

		<!-- Token Decimals -->
		<div class="form-group">
			<label for="token-decimals">
				Decimals
				{#if fetchedFields.has('decimals')}
					<span class="auto-filled" transition:scale={{ duration: 200, start: 0.8 }}
						>Auto-filled</span
					>
				{/if}
			</label>
			<input
				id="token-decimals"
				type="number"
				min="0"
				max="18"
				bind:value={newTokenDecimals}
				class="form-input"
				class:auto-filled={fetchedFields.has('decimals')}
				disabled={isAddingToken || isFetchingInfo}
			/>
			<p class="input-hint">Usually 18 for most ERC-20 tokens</p>
		</div>

		<!-- Error/Info Messages -->
		{#if errorMessage}
			<div class="message error" transition:fade={{ duration: 200 }}>
				<AlertCircle size={16} />
				<div>
					<strong>Error:</strong>
					{errorMessage}
				</div>
			</div>
		{/if}

		{#if fetchStatus === 'success' && !errorMessage}
			<div class="message success" transition:fade={{ duration: 200 }}>
				<CheckCircle2 size={16} />
				<div>
					<strong>Success!</strong> Token information fetched successfully. Please review and confirm.
				</div>
			</div>
		{/if}
	</div>

	{#snippet footer()}
		<div class="footer-actions">
			<button
				class="btn-secondary"
				onclick={handleCancel}
				disabled={isAddingToken || isFetchingInfo}
			>
				Cancel
			</button>
			<button
				class="btn-primary"
				onclick={handleAddToken}
				disabled={isAddingToken ||
					isFetchingInfo ||
					fetchStatus === 'error' ||
					!newTokenAddress ||
					!newTokenSymbol ||
					!newTokenName}
			>
				{#if isAddingToken}
					<Loader2 size={16} class="spin" />
					Adding...
				{:else}
					Add Token
				{/if}
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
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 20px; /* Fixed height to prevent layout shift */
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		white-space: nowrap; /* Prevent wrapping to new line */
	}

	:global([data-theme='dark']) .form-group label {
		color: var(--gray-300);
	}

	.status-badge,
	.auto-filled {
		flex-shrink: 0; /* Prevent shrinking */
		white-space: nowrap; /* Keep text on one line */
	}

	.status-badge {
		/* display: inline-flex; */
		position: absolute;
		top: 0;
		right: 0;
		align-items: center;
		gap: 4px;
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		font-size: 11px;
		font-weight: var(--font-medium);
		margin-left: auto; /* Push to the right */
	}

	.status-badge.loading {
		background: hsla(210, 100%, 50%, 0.1);
		color: hsl(210, 100%, 50%);
	}

	.status-badge.success {
		background: hsla(142, 76%, 36%, 0.1);
		color: hsl(142, 76%, 36%);
	}

	.status-badge.error {
		background: hsla(0, 80%, 50%, 0.1);
		color: hsl(0, 80%, 50%);
	}

	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.auto-filled {
		display: inline-flex;
		align-items: center;
		font-size: 11px;
		color: hsl(142, 76%, 36%);
		font-weight: var(--font-medium);
		margin-left: auto; /* Push to the right */
		padding: 2px 8px;
		border-radius: var(--radius-sm);
		background: hsla(142, 76%, 36%, 0.1);
	}

	:global([data-theme='dark']) .auto-filled {
		color: hsl(142, 76%, 60%);
		background: hsla(142, 76%, 36%, 0.15);
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

	.form-input.loading {
		border-color: hsl(210, 100%, 50%);
		background: hsla(210, 100%, 50%, 0.02);
	}

	.form-input.auto-filled {
		border-color: hsl(142, 76%, 36%);
		background: hsla(142, 76%, 96%, 1);
	}

	:global([data-theme='dark']) .form-input {
		background: var(--gray-700);
		color: var(--gray-100);
		border-color: var(--gray-600);
	}

	:global([data-theme='dark']) .form-input.auto-filled {
		background: hsla(142, 76%, 10%, 0.3);
		border-color: hsl(142, 76%, 36%);
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

	.input-hint {
		font-size: var(--text-xs);
		color: var(--gray-500);
		margin: 0;
	}

	:global([data-theme='dark']) .input-hint {
		color: var(--gray-400);
	}

	.message {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		padding: var(--space-3);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	.message.error {
		background: hsla(0, 80%, 95%, 1);
		border: 1px solid hsl(0, 80%, 60%);
		color: hsl(0, 80%, 40%);
	}

	:global([data-theme='dark']) .message.error {
		background: hsla(0, 80%, 15%, 0.5);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	.message.success {
		background: hsla(142, 76%, 96%, 1);
		border: 1px solid hsl(142, 76%, 50%);
		color: hsl(142, 76%, 36%);
	}

	:global([data-theme='dark']) .message.success {
		background: hsla(142, 76%, 10%, 0.3);
		border-color: hsl(142, 76%, 40%);
		color: hsl(142, 76%, 60%);
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

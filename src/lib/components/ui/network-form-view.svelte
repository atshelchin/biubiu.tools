<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { ArrowLeft, Plus, Trash2 } from '@lucide/svelte';
	import InfoHint from './info-hint.svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import { useI18n } from '@shelchin/i18n/svelte';
	import { SvelteMap } from 'svelte/reactivity';
	import {
		useFormState,
		Form,
		FormField,
		Validators,
		type FormState
	} from '@packages/formstate/src';

	interface Props {
		mode: 'add' | 'edit';
		network?: NetworkConfig;
		onSave: (data: {
			chainId: number;
			name: string;
			symbol: string;
			rpcEndpoints: Array<{ url: string; isPrimary: boolean }>;
			blockExplorer?: string;
		}) => void;
		onCancel: () => void;
	}

	let { mode, network, onSave, onCancel }: Props = $props();

	const i18n = useI18n();
	const t = i18n.t;

	let newRpcUrl = $state('');
	let newRpcError = $state<string | null>(null);
	let rpcLatencies = new SvelteMap<string, number | undefined>();
	let firstInputRef: HTMLInputElement | undefined = $state(undefined);
	let isValidatingPrimaryRpc = $state(false);
	let primaryRpcValidationError = $state<string | null>(null);

	// Auto-focus first input when entering add mode
	onMount(() => {
		if (mode === 'add' && firstInputRef) {
			firstInputRef.focus();
		}
	});

	// Create form state with validators
	const form: FormState = useFormState({
		fields: {
			chainId: {
				defaultValue: network?.chainId ?? '',
				validateOnMount: true,
				validator: Validators.compose(
					Validators.required(t('wallet.network_settings.error_chainid_required')),
					Validators.min(1, t('wallet.network_settings.error_chainid_min'))
				)
			},
			name: {
				defaultValue: network?.name || '',
				validateOnMount: true,
				validator: Validators.required(t('wallet.network_settings.error_name_required'))
			},
			symbol: {
				defaultValue: network?.symbol || '',
				validateOnMount: true,
				validator: Validators.required(t('wallet.network_settings.error_symbol_required'))
			},
			blockExplorer: {
				defaultValue: network?.blockExplorer || ''
			},
			rpcEndpoints: {
				defaultValue: (network?.rpcEndpoints || []).map((rpc) => ({
					url: rpc.url,
					isPrimary: rpc.isPrimary
				})) as Array<{ url: string; isPrimary: boolean }>,
				validateOnMount: true,
				validator: {
					validate: (value: unknown) => {
						const endpoints = value as Array<{ url: string; isPrimary: boolean }>;
						if (!endpoints || endpoints.length === 0) {
							return t('wallet.network_settings.error_rpc_required');
						}
						return null;
					}
				}
			}
		}
	});

	// Computed property - include isValidatingPrimaryRpc to disable submit during validation
	const canSubmitValue = $derived(form.isValid && !form.isValidating && !isValidatingPrimaryRpc);

	// Expose to parent via getter
	export function getCanSubmit() {
		return canSubmitValue;
	}

	// Test latency for existing RPC endpoints on mount
	$effect(() => {
		const endpoints = form.values.rpcEndpoints as Array<{ url: string; isPrimary: boolean }>;
		if (endpoints && endpoints.length > 0) {
			// First, set all untested endpoints to "testing" state
			const endpointsToTest: string[] = [];
			endpoints.forEach((endpoint) => {
				if (!rpcLatencies.has(endpoint.url)) {
					rpcLatencies.set(endpoint.url, undefined); // Testing state
					endpointsToTest.push(endpoint.url);
				}
			});

			// Then test each endpoint sequentially to avoid overwhelming
			endpointsToTest.forEach(async (url) => {
				const latency = await testRpcLatency(url);
				rpcLatencies.set(url, latency);
			});
		}
	});

	// Get chainId from RPC
	async function getRpcChainId(rpcUrl: string): Promise<number | null> {
		try {
			const response = await fetch(rpcUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					method: 'eth_chainId',
					params: [],
					id: 1
				}),
				signal: AbortSignal.timeout(5000)
			});
			if (!response.ok) return null;
			const data = await response.json();
			if (data.result) {
				// Convert hex chainId to decimal
				return parseInt(data.result, 16);
			}
			return null;
		} catch {
			return null;
		}
	}

	// RPC latency testing
	async function testRpcLatency(rpcUrl: string): Promise<number> {
		const startTime = performance.now();
		try {
			const response = await fetch(rpcUrl, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					method: 'eth_blockNumber',
					params: [],
					id: 1
				}),
				signal: AbortSignal.timeout(5000)
			});
			if (!response.ok) throw new Error('RPC request failed');
			const endTime = performance.now();
			return Math.round(endTime - startTime);
		} catch {
			return -1;
		}
	}

	async function handleAddRpc() {
		if (!newRpcUrl.trim()) return;

		const url = newRpcUrl.trim();
		newRpcError = null; // Clear previous error

		// Validate chainId if chainId is already set
		const currentChainId = form.values.chainId as number | string;
		if (currentChainId && typeof currentChainId === 'number') {
			// Get chainId from RPC
			const rpcChainId = await getRpcChainId(url);

			if (rpcChainId === null) {
				newRpcError = t('wallet.network_settings.error_rpc_unavailable');
				return;
			}

			if (rpcChainId !== currentChainId) {
				newRpcError = t('wallet.network_settings.error_rpc_chainid_mismatch', {
					expected: currentChainId,
					actual: rpcChainId
				});
				return;
			}
		}

		const currentEndpoints = form.values.rpcEndpoints as Array<{
			url: string;
			isPrimary: boolean;
		}>;
		const isPrimary = currentEndpoints.length === 0;

		// Add to form
		form.setValue('rpcEndpoints', [...currentEndpoints, { url, isPrimary }]);

		newRpcUrl = '';
		newRpcError = null; // Clear error on success

		// Test latency
		rpcLatencies.set(url, undefined); // Testing state
		const latency = await testRpcLatency(url);
		rpcLatencies.set(url, latency);
	}

	function handleRemoveRpc(index: number) {
		const currentEndpoints = form.values.rpcEndpoints as Array<{
			url: string;
			isPrimary: boolean;
		}>;
		const removed = currentEndpoints[index];
		const updated = currentEndpoints.filter((_, i) => i !== index);

		// If removed primary, make first one primary
		if (removed.isPrimary && updated.length > 0) {
			updated[0] = { ...updated[0], isPrimary: true };
		}

		// Create a new array to ensure reactivity
		form.setValue('rpcEndpoints', [...updated]);

		// Remove from latencies map
		rpcLatencies.delete(removed.url);
	}

	async function handleSetPrimary(index: number) {
		const currentEndpoints = form.values.rpcEndpoints as Array<{
			url: string;
			isPrimary: boolean;
		}>;

		// Get the endpoint being set as primary
		const newPrimary = currentEndpoints[index];

		// Create new array: new primary first, then others (all non-primary)
		const updated = [
			{ ...newPrimary, isPrimary: true },
			...currentEndpoints.filter((_, i) => i !== index).map((rpc) => ({ ...rpc, isPrimary: false }))
		];

		form.setValue('rpcEndpoints', updated);

		// Test latency for the new primary endpoint
		rpcLatencies.set(newPrimary.url, undefined); // Set to "testing" state
		const latency = await testRpcLatency(newPrimary.url);
		rpcLatencies.set(newPrimary.url, latency);
	}

	// Export function to parent - validates primary RPC before saving
	// Returns true if save was successful, false if validation failed
	export async function handleSubmit(): Promise<boolean> {
		console.log('[NetworkFormView] handleSubmit called values', form.values);
		console.log('[NetworkFormView] form.isValid:', form.isValid);
		console.log('[NetworkFormView] form.isValidating:', form.isValidating);

		if (!form.isValid || form.isValidating || isValidatingPrimaryRpc) {
			console.log('[NetworkFormView] Cannot submit - form invalid or validating');
			return false;
		}

		// Use $state.snapshot to get plain values from Immer proxy
		const values = $state.snapshot(form.values);
		const chainId = values.chainId as number;
		const rpcEndpoints = values.rpcEndpoints as Array<{ url: string; isPrimary: boolean }>;

		// Find the primary RPC endpoint
		const primaryRpc = rpcEndpoints.find((rpc) => rpc.isPrimary);
		if (!primaryRpc) {
			console.log('[NetworkFormView] No primary RPC found');
			primaryRpcValidationError = t('wallet.network_settings.error_rpc_required');
			return false;
		}

		// Validate primary RPC is available and matches chain ID
		console.log('[NetworkFormView] Validating primary RPC:', primaryRpc.url);
		isValidatingPrimaryRpc = true;
		primaryRpcValidationError = null;

		try {
			const rpcChainId = await getRpcChainId(primaryRpc.url);

			if (rpcChainId === null) {
				primaryRpcValidationError = t('wallet.network_settings.error_rpc_unavailable');
				console.log('[NetworkFormView] Primary RPC unavailable');
				return false;
			}

			if (rpcChainId !== chainId) {
				primaryRpcValidationError = t('wallet.network_settings.error_rpc_chainid_mismatch', {
					expected: chainId,
					actual: rpcChainId
				});
				console.log('[NetworkFormView] Primary RPC chain ID mismatch:', rpcChainId, 'vs', chainId);
				return false;
			}

			console.log('[NetworkFormView] Primary RPC validation passed');

			const dataToSave = {
				chainId,
				name: values.name as string,
				symbol: values.symbol as string,
				blockExplorer: values.blockExplorer as string | undefined,
				rpcEndpoints
			};

			console.log('[NetworkFormView] Calling onSave with:', dataToSave);
			onSave(dataToSave);
			return true;
		} finally {
			isValidatingPrimaryRpc = false;
		}
	}
</script>

<div class="form-view">
	<div class="form-header">
		<button type="button" class="back-btn" onclick={onCancel}>
			<ArrowLeft size={18} />
			{t('wallet.network_settings.back')}
		</button>
		<h3>
			{mode === 'edit'
				? t('wallet.network_settings.edit_network')
				: t('wallet.network_settings.add_network')}
		</h3>
	</div>

	<InfoHint>
		{t('wallet.network_settings.chainlist_hint_prefix')}
		<a href="https://chainid.network" target="_blank" rel="noopener noreferrer">chainid.network</a>
		{t('wallet.network_settings.chainlist_hint_suffix')}
	</InfoHint>
	<Form formState={form}>
		<div class="form-content">
			<!-- Network basic info: 3 columns on large screens, 1 column on mobile -->
			<div class="basic-info-row">
				<FormField name="name" label={t('wallet.network_settings.network_name')}>
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="text"
							{value}
							placeholder="Ethereum Mainnet"
							class:error={touched && error}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
						/>
					{/snippet}
				</FormField>

				<FormField name="symbol" label={t('wallet.network_settings.currency_symbol')}>
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="text"
							{value}
							placeholder="ETH"
							class:error={touched && error}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
						/>
					{/snippet}
				</FormField>

				<FormField name="chainId" label={t('wallet.network_settings.chain_id')}>
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							bind:this={firstInputRef}
							type="number"
							{value}
							disabled={mode === 'edit'}
							placeholder="1"
							class:error={touched && error}
							oninput={(e) => onInput(Number(e.currentTarget.value))}
							onblur={onBlur}
						/>
					{/snippet}
				</FormField>
			</div>

			<div class="form-group rpc-group">
				<div class="rpc-label">{t('wallet.network_settings.rpc_endpoints_label')}</div>

				{#if form.getFieldState('rpcEndpoints').error && form.getFieldState('rpcEndpoints').touched}
					{@const rpcEndpointsState = form.getFieldState('rpcEndpoints')}
					<span class="error-message">{rpcEndpointsState.error}</span>
				{/if}

				<div class="rpc-list-form">
					{#each form.values.rpcEndpoints as Array<{ url: string; isPrimary: boolean }> as rpc, index (rpc.url)}
						<div
							class="rpc-item-form"
							class:primary={rpc.isPrimary}
							animate:flip={{ duration: 300 }}
						>
							<div class="rpc-info-wrapper">
								<div class="rpc-url-display">{rpc.url}</div>
								{#if rpcLatencies.has(rpc.url)}
									{@const latency = rpcLatencies.get(rpc.url)}
									{#if latency === undefined}
										<div class="rpc-latency testing">{t('wallet.network_settings.testing')}</div>
									{:else if latency !== null}
										<div class="rpc-latency" class:failed={latency === -1}>
											{latency === -1 ? t('wallet.network_settings.failed') : `${latency}ms`}
										</div>
									{/if}
								{/if}
							</div>
							<div class="rpc-actions-form">
								{#if rpc.isPrimary}
									<span class="primary-badge-small">{t('wallet.network_settings.primary')}</span>
								{:else}
									<button
										type="button"
										class="rpc-action-btn-small"
										onclick={() => handleSetPrimary(index)}
									>
										{t('wallet.network_settings.set_primary')}
									</button>
								{/if}
								<button
									type="button"
									class="rpc-action-btn-small danger"
									onclick={() => handleRemoveRpc(index)}
								>
									<Trash2 size={12} />
								</button>
							</div>
						</div>
					{/each}
				</div>

				<div class="add-rpc-input">
					<input
						type="text"
						placeholder={t('wallet.network_settings.add_rpc_placeholder')}
						bind:value={newRpcUrl}
						oninput={() => (newRpcError = null)}
						onkeydown={(e) => e.key === 'Enter' && handleAddRpc()}
						class:error={newRpcError}
					/>
					<button type="button" class="add-btn-small" onclick={handleAddRpc}>
						<Plus size={14} />
						{t('wallet.network_settings.add')}
					</button>
				</div>
				{#if newRpcError}
					<span class="error-message">{newRpcError}</span>
				{/if}
				{#if primaryRpcValidationError}
					<span class="error-message">{primaryRpcValidationError}</span>
				{/if}
				{#if isValidatingPrimaryRpc}
					<div class="validating-message">
						{t('wallet.network_settings.validating_primary_rpc')}
					</div>
				{/if}
			</div>

			<FormField
				name="blockExplorer"
				label={t('wallet.network_settings.block_explorer_optional')}
				showError={false}
			>
				{#snippet children({ value, onInput, onBlur })}
					<input
						type="text"
						{value}
						placeholder="https://etherscan.io"
						oninput={(e) => onInput(e.currentTarget.value)}
						onblur={onBlur}
					/>
				{/snippet}
			</FormField>

			<!-- <InfoHint>
				{t('wallet.network_settings.explorer_hint_prefix')}
				<a href="https://github.com/ethereum-lists/chains" target="_blank" rel="noopener noreferrer"
					>ethereum-lists/chains</a
				>
				{t('wallet.network_settings.explorer_hint_suffix')}
			</InfoHint> -->
		</div>
	</Form>
</div>

<style>
	.form-view {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.form-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}

	.form-header h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		margin: 0;
	}

	.back-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2);
		background: transparent;
		border: none;
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s;
		border-radius: var(--radius-md);
	}

	.back-btn:hover {
		background: var(--gray-100);
		color: var(--gray-800);
	}

	.form-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	/* Network basic info: responsive 3-column layout */
	.basic-info-row {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: var(--space-4);
	}

	@media (max-width: 640px) {
		.basic-info-row {
			grid-template-columns: 1fr;
		}
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	input {
		width: 100%;
		padding: var(--space-2-5) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		background: var(--color-input);
		color: var(--color-foreground);
		transition: all 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--brand-500);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	input.error {
		border-color: var(--color-danger);
	}

	input.error:focus {
		border-color: var(--color-danger);
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
	}

	.error-message {
		color: var(--color-danger);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.validating-message {
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		animation: pulse-opacity 1.5s ease-in-out infinite;
	}

	.rpc-group {
		gap: var(--space-2);
	}

	.rpc-label {
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.rpc-list-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.rpc-item-form {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2-5);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		transition: all 0.2s;
	}

	.rpc-item-form.primary {
		border-color: var(--brand-500);
		background: color-mix(in srgb, var(--brand-500) 5%, transparent);
	}

	.rpc-info-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		flex: 1;
		margin-right: var(--space-3);
	}

	.rpc-url-display {
		font-size: var(--text-xs);
		font-family: monospace;
		color: var(--color-foreground);
		word-break: break-all;
	}

	.rpc-latency {
		font-size: var(--text-xs);
		padding: var(--space-0-5) var(--space-1-5);
		border-radius: var(--radius-sm);
		display: inline-flex;
		align-items: center;
		width: fit-content;
	}

	.rpc-latency.testing {
		color: var(--color-muted-foreground);
		background: var(--color-muted);
		animation: pulse-opacity 1.5s ease-in-out infinite;
	}

	.rpc-latency:not(.testing):not(.failed) {
		color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
	}

	.rpc-latency.failed {
		color: var(--color-danger);
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
	}

	@keyframes pulse-opacity {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.rpc-actions-form {
		display: flex;
		align-items: center;
		gap: var(--space-1-5);
	}

	.primary-badge-small {
		padding: var(--space-1) var(--space-2);
		background: color-mix(in srgb, var(--brand-500) 10%, transparent);
		color: var(--brand-600);
		font-size: var(--text-xs);
		font-weight: var(--font-normal);
		border-radius: var(--radius-sm);
		border: 1px solid color-mix(in srgb, var(--brand-500) 20%, transparent);
	}

	.rpc-action-btn-small {
		padding: var(--space-1) var(--space-2);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-normal);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.rpc-action-btn-small:hover {
		background: var(--color-muted);
		color: var(--color-foreground);
		border-color: var(--color-border);
	}

	.rpc-action-btn-small.danger {
		color: var(--color-danger);
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		border-color: color-mix(in srgb, var(--color-danger) 20%, transparent);
	}

	.rpc-action-btn-small.danger:hover {
		background: color-mix(in srgb, var(--color-danger) 20%, transparent);
	}

	.add-rpc-input {
		display: flex;
		gap: var(--space-2);
	}

	.add-rpc-input input {
		flex: 1;
	}

	.add-btn-small {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2-5) var(--space-3);
		background: transparent;
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-normal);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
	}

	.add-btn-small:hover {
		background: var(--color-muted);
		border-color: var(--color-border);
	}

	/* Dark Mode */
	:global([data-theme='dark']) .back-btn {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .back-btn:hover {
		background: var(--gray-800);
		color: var(--gray-200);
	}

	:global([data-theme='dark']) .error-message {
		color: hsl(0, 80%, 60%);
	}
</style>

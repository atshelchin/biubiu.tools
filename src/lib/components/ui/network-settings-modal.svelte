<script lang="ts">
	import Modal from './modal.svelte';
	import NetworkListView from './network-list-view.svelte';
	import NetworkFormView from './network-form-view.svelte';
	import { Check } from '@lucide/svelte';
	import type { NetworkConfig } from '@shelchin/ethereum-connectors';
	import { useI18n } from '@shelchin/i18n';

	interface Props {
		open: boolean;
		networks: NetworkConfig[];
		currentChainId?: number;
		/** If provided, open directly to edit mode for this network */
		initialEditChainId?: number;
		onClose: () => void;
		onToggleNetwork: (chainId: number, enabled: boolean) => boolean;
		isNetworkEnabled: (chainId: number) => boolean;
		onSaveNetwork: (
			chainId: number,
			rpcEndpoints: Array<{ url: string; isPrimary: boolean }>,
			blockExplorer?: string
		) => void;
		onAddOrUpdateNetwork: (network: {
			chainId: number;
			name: string;
			symbol: string;
			rpcEndpoints: Array<{ url: string; isPrimary: boolean }>;
			blockExplorer?: string;
			isBuiltIn?: boolean;
		}) => void;
	}

	let {
		open,
		networks,
		currentChainId,
		initialEditChainId: _initialEditChainId,
		onClose,
		onToggleNetwork,
		isNetworkEnabled,
		onSaveNetwork,
		onAddOrUpdateNetwork
	}: Props = $props();

	const i18n = useI18n();
	const t = i18n.t.bind(i18n);

	type ViewMode = 'list' | 'edit' | 'add';
	type SaveStatus = 'idle' | 'saving' | 'success' | 'error';
	let viewMode = $state<ViewMode>('list');
	let editingNetwork = $state<NetworkConfig | undefined>(undefined);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let networkFormView: any = $state(undefined);
	let saveStatus = $state<SaveStatus>('idle');

	// Handle initialEditChainId - open directly to edit mode when modal opens
	$effect(() => {
		if (open && _initialEditChainId) {
			const networkToEdit = networks.find((n) => n.chainId === _initialEditChainId);
			if (networkToEdit) {
				viewMode = 'edit';
				editingNetwork = networkToEdit;
			}
		}
	});

	// Reset to list view when modal closes
	$effect(() => {
		if (!open) {
			viewMode = 'list';
			editingNetwork = undefined;
			saveStatus = 'idle';
		}
	});

	// Handle save button click with status feedback
	async function handleSaveClick() {
		if (!networkFormView) return;

		saveStatus = 'saving';

		try {
			const success = await networkFormView.handleSubmit();
			if (success) {
				saveStatus = 'success';
				// Show success for 1 second then go back to list
				setTimeout(() => {
					// handleBackToList();
					saveStatus = 'idle';
				}, 1000);
			} else {
				// Validation failed - form will show error, reset button state
				saveStatus = 'idle';
			}
		} catch {
			saveStatus = 'error';
			// Reset after showing error
			setTimeout(() => {
				saveStatus = 'idle';
			}, 2000);
		}
	}

	function handleAddNetwork() {
		viewMode = 'add';
		editingNetwork = undefined;
	}

	function handleEditNetwork(network: NetworkConfig) {
		viewMode = 'edit';
		editingNetwork = network;
	}

	function handleBackToList() {
		viewMode = 'list';
		editingNetwork = undefined;
	}

	function handleSaveNetwork(data: {
		chainId: number;
		name: string;
		symbol: string;
		rpcEndpoints: Array<{ url: string; isPrimary: boolean }>;
		blockExplorer?: string;
	}) {
		console.log('[NetworkSettingsModal] handleSaveNetwork called');
		console.log('[NetworkSettingsModal] viewMode:', viewMode);
		console.log('[NetworkSettingsModal] data:', data);

		if (viewMode === 'add') {
			// Adding new network
			console.log('[NetworkSettingsModal] Adding new network');
			onAddOrUpdateNetwork({
				chainId: data.chainId,
				name: data.name,
				symbol: data.symbol,
				rpcEndpoints: data.rpcEndpoints,
				blockExplorer: data.blockExplorer
			});

			// New networks are always enabled by default
			onToggleNetwork(data.chainId, true);
		} else {
			// Editing existing network
			const existingNetwork = networks.find((n) => n.chainId === data.chainId);
			console.log('[NetworkSettingsModal] Editing existing network');
			console.log('[NetworkSettingsModal] existingNetwork:', existingNetwork);

			if (existingNetwork) {
				// Check if name or symbol changed
				const nameChanged = existingNetwork.name !== data.name;
				const symbolChanged = existingNetwork.symbol !== data.symbol;
				console.log(
					'[NetworkSettingsModal] nameChanged:',
					nameChanged,
					existingNetwork.name,
					'->',
					data.name
				);
				console.log(
					'[NetworkSettingsModal] symbolChanged:',
					symbolChanged,
					existingNetwork.symbol,
					'->',
					data.symbol
				);

				if (nameChanged || symbolChanged) {
					// Name or symbol changed, use full update
					console.log('[NetworkSettingsModal] Calling onAddOrUpdateNetwork for full update');
					onAddOrUpdateNetwork({
						chainId: data.chainId,
						name: data.name,
						symbol: data.symbol,
						rpcEndpoints: data.rpcEndpoints,
						blockExplorer: data.blockExplorer,
						// Preserve isBuiltIn flag from existing network
						isBuiltIn: existingNetwork.isBuiltIn
					});
				} else {
					// Only RPC endpoints or block explorer changed
					console.log('[NetworkSettingsModal] Calling onSaveNetwork for RPC/explorer update');
					onSaveNetwork(data.chainId, data.rpcEndpoints, data.blockExplorer);
				}
				// Edit mode: keep original enabled state (don't change it)
			}
		}

		// handleBackToList();
	}
</script>

<!-- height="80vh" -->
<Modal
	{open}
	{onClose}
	title={t('wallet.network_settings.title')}
	maxWidth="600px"
	closeOnOverlayClick={false}
>
	{#snippet footer()}
		{#if viewMode !== 'list' && networkFormView}
			<div class="modal-footer-actions">
				<button
					type="button"
					class="btn-secondary"
					onclick={handleBackToList}
					disabled={saveStatus === 'saving' || saveStatus === 'success'}
				>
					{t('wallet.network_settings.cancel')}
				</button>
				<button
					type="button"
					class="btn-primary"
					class:saving={saveStatus === 'saving'}
					class:success={saveStatus === 'success'}
					class:error={saveStatus === 'error'}
					disabled={!networkFormView.getCanSubmit() ||
						saveStatus === 'saving' ||
						saveStatus === 'success'}
					onclick={handleSaveClick}
				>
					{#if saveStatus === 'saving'}
						{t('wallet.network_settings.saving')}
					{:else if saveStatus === 'success'}
						<Check size={16} />
						{t('wallet.network_settings.saved')}
					{:else if saveStatus === 'error'}
						{t('wallet.network_settings.save_failed')}
					{:else}
						{t('wallet.network_settings.save')}
					{/if}
				</button>
			</div>
		{/if}
	{/snippet}

	<div class="network-settings">
		{#if viewMode === 'list'}
			<NetworkListView
				{networks}
				{currentChainId}
				{isNetworkEnabled}
				{onToggleNetwork}
				onEditNetwork={handleEditNetwork}
				onAddNetwork={handleAddNetwork}
			/>
		{:else}
			<NetworkFormView
				bind:this={networkFormView}
				mode={viewMode}
				network={editingNetwork}
				onSave={handleSaveNetwork}
				onCancel={handleBackToList}
			/>
		{/if}
	</div>
</Modal>

<style>
	.network-settings {
		/* padding: 10px; */
		/* min-height: 400px; */
		overflow-x: hidden;
	}

	/* 滚动条样式适配暗色模式 */
	.network-settings::-webkit-scrollbar {
		width: 8px;
	}

	.network-settings::-webkit-scrollbar-track {
		background: var(--color-muted);
		border-radius: var(--radius-md);
	}

	.network-settings::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: var(--radius-md);
		transition: background 0.2s;
	}

	.network-settings::-webkit-scrollbar-thumb:hover {
		background: color-mix(in srgb, var(--color-foreground) 30%, transparent);
	}

	/* Modal Footer Actions */
	.modal-footer-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: flex-end;
		width: 100%;
	}

	.btn-secondary,
	.btn-primary {
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary {
		background: var(--gray-100);
		color: var(--gray-700);
		border: 1px solid var(--gray-200);
	}

	.btn-secondary:hover {
		background: var(--gray-200);
	}

	.btn-primary {
		background: var(--brand-600);
		color: white;
		border: none;
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--brand-700);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Save button states */
	.btn-primary.saving {
		background: var(--brand-500);
		opacity: 0.8;
	}

	.btn-primary.success {
		background: var(--color-success, #10b981);
		opacity: 1;
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.btn-primary.error {
		background: var(--color-danger, #ef4444);
		opacity: 1;
	}

	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Dark Mode */
	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		color: var(--gray-200);
		border-color: var(--gray-600);
	}

	:global([data-theme='dark']) .btn-secondary:hover {
		background: var(--gray-600);
	}
</style>

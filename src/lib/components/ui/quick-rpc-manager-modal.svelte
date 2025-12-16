<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { X, Plus, Trash2 } from '@lucide/svelte';

	const i18n = useI18n();

	interface Props {
		open: boolean;
		network: {
			name: string;
			chainId: number;
			rpcEndpoints: { url: string; isPrimary: boolean }[];
		};
		onClose: () => void;
		onSave: (rpcEndpoints: { url: string; isPrimary: boolean }[]) => void;
	}

	let { open = $bindable(), network, onClose, onSave }: Props = $props();

	// Local state for editing
	let rpcEndpoints = $state<{ url: string; isPrimary: boolean }[]>([]);
	let newRpcUrl = $state('');

	// Initialize when opening
	$effect(() => {
		if (open && network) {
			rpcEndpoints = [...network.rpcEndpoints];
		}
	});

	function handleAddRpc() {
		const trimmedUrl = newRpcUrl.trim();
		if (!trimmedUrl) return;

		// Basic validation
		if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
			alert(i18n.t('components.quick_rpc_manager.invalid_url'));
			return;
		}

		// Check for duplicates
		if (rpcEndpoints.some((ep) => ep.url === trimmedUrl)) {
			alert(i18n.t('components.quick_rpc_manager.duplicate_url'));
			return;
		}

		rpcEndpoints.push({ url: trimmedUrl, isPrimary: false });
		newRpcUrl = '';
	}

	function handleRemoveRpc(index: number) {
		rpcEndpoints = rpcEndpoints.filter((_, i) => i !== index);
	}

	function handleSetPrimary(index: number) {
		rpcEndpoints = rpcEndpoints.map((ep, i) => ({
			...ep,
			isPrimary: i === index
		}));
	}

	function handleSave() {
		if (rpcEndpoints.length === 0) {
			alert(i18n.t('components.quick_rpc_manager.at_least_one'));
			return;
		}
		onSave(rpcEndpoints);
		onClose();
	}

	function handleClose() {
		onClose();
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
	<div class="modal-overlay" onclick={handleClose}>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="modal-content"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<div class="modal-header">
				<h3>{i18n.t('components.quick_rpc_manager.title')}</h3>
				<button class="close-btn" onclick={handleClose}>
					<X size={20} />
				</button>
			</div>

			<div class="modal-body">
				<div class="network-info">
					<span class="network-label">{i18n.t('components.quick_rpc_manager.network')}:</span>
					<span class="network-name">{network.name}</span>
				</div>

				<div class="section">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="section-label">{i18n.t('components.quick_rpc_manager.add_new')}</label>
					<div class="add-rpc-row">
						<input
							type="text"
							bind:value={newRpcUrl}
							placeholder={i18n.t('components.quick_rpc_manager.placeholder')}
							class="rpc-input"
							onkeydown={(e) => e.key === 'Enter' && handleAddRpc()}
						/>
						<button class="btn-add" onclick={handleAddRpc}>
							<Plus size={16} />
							{i18n.t('components.quick_rpc_manager.add_button')}
						</button>
					</div>
				</div>

				<div class="section">
					<!-- svelte-ignore a11y_label_has_associated_control -->
					<label class="section-label"
						>{i18n.t('components.quick_rpc_manager.current_rpcs')} ({rpcEndpoints.length})</label
					>
					<div class="rpc-list">
						{#each rpcEndpoints as endpoint, index (endpoint.url)}
							<div class="rpc-item">
								<div class="rpc-url-container">
									<input
										type="radio"
										name="primary-rpc"
										checked={endpoint.isPrimary}
										onchange={() => handleSetPrimary(index)}
									/>
									<span class="rpc-url" title={endpoint.url}>{endpoint.url}</span>
									{#if endpoint.isPrimary}
										<span class="primary-badge"
											>{i18n.t('components.quick_rpc_manager.primary')}</span
										>
									{/if}
								</div>
								<button class="btn-remove" onclick={() => handleRemoveRpc(index)}>
									<Trash2 size={16} />
								</button>
							</div>
						{/each}
						{#if rpcEndpoints.length === 0}
							<div class="empty-state">{i18n.t('components.quick_rpc_manager.no_rpcs')}</div>
						{/if}
					</div>
				</div>

				<div class="hint">
					💡 {i18n.t('components.quick_rpc_manager.hint')}
					<br />
					{i18n.t('components.quick_rpc_manager.recommend_prefix')}
					<a href="https://chainid.network" target="_blank" rel="noopener noreferrer">
						chainid.network
					</a>
					{i18n.t('components.quick_rpc_manager.recommend_suffix')}
				</div>
			</div>

			<div class="modal-footer">
				<button class="btn-secondary" onclick={handleClose}>
					{i18n.t('components.quick_rpc_manager.cancel')}
				</button>
				<button class="btn-primary" onclick={handleSave}>
					{i18n.t('components.quick_rpc_manager.save')}
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--space-4);
	}

	.modal-content {
		background: white;
		border-radius: var(--radius-lg);
		max-width: 600px;
		width: 100%;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
	}

	:global([data-theme='dark']) .modal-content {
		background: var(--gray-800);
	}

	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4);
		border-bottom: 1px solid var(--gray-200);
	}

	:global([data-theme='dark']) .modal-header {
		border-bottom-color: var(--gray-700);
	}

	.modal-header h3 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .modal-header h3 {
		color: var(--gray-100);
	}

	.close-btn {
		background: none;
		border: none;
		color: var(--gray-500);
		cursor: pointer;
		padding: var(--space-1);
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}

	.close-btn:hover {
		background: var(--gray-100);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .close-btn:hover {
		background: var(--gray-700);
		color: var(--gray-300);
	}

	.modal-body {
		padding: var(--space-4);
		overflow-y: auto;
		flex: 1;
	}

	.network-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--gray-50);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) .network-info {
		background: var(--gray-700);
	}

	.network-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .network-label {
		color: var(--gray-400);
	}

	.network-name {
		font-weight: var(--font-semibold);
		color: var(--color-primary);
	}

	.section {
		margin-bottom: var(--space-4);
	}

	.section-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .section-label {
		color: var(--gray-300);
	}

	.add-rpc-row {
		display: flex;
		gap: var(--space-2);
	}

	.rpc-input {
		flex: 1;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .rpc-input {
		background: var(--gray-700);
		border-color: var(--gray-600);
		color: var(--gray-100);
	}

	.rpc-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
	}

	.btn-add {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		white-space: nowrap;
		transition: all 0.2s;
	}

	.btn-add:hover {
		background: #2563eb;
	}

	.rpc-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		max-height: 300px;
		overflow-y: auto;
	}

	.rpc-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-3);
		background: var(--gray-50);
		border: 1px solid var(--gray-200);
		border-radius: var(--radius-md);
		gap: var(--space-2);
	}

	:global([data-theme='dark']) .rpc-item {
		background: var(--gray-700);
		border-color: var(--gray-600);
	}

	.rpc-url-container {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex: 1;
		min-width: 0;
	}

	.rpc-url {
		font-size: var(--text-sm);
		color: var(--gray-700);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global([data-theme='dark']) .rpc-url {
		color: var(--gray-300);
	}

	.primary-badge {
		padding: 2px 8px;
		background: #10b981;
		color: white;
		font-size: var(--text-xs);
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		white-space: nowrap;
	}

	.btn-remove {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: none;
		border: none;
		color: hsl(0, 70%, 50%);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all 0.2s;
	}

	.btn-remove:hover {
		background: hsla(0, 70%, 50%, 0.1);
	}

	.empty-state {
		text-align: center;
		padding: var(--space-6);
		color: var(--gray-400);
		font-size: var(--text-sm);
	}

	.hint {
		padding: var(--space-3);
		background: #eff6ff;
		border-left: 3px solid var(--color-primary);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.5;
	}

	.hint a {
		color: var(--color-primary);
		text-decoration: none;
	}

	.hint a:hover {
		text-decoration: underline;
	}

	:global([data-theme='dark']) .hint {
		background: rgba(59, 130, 246, 0.1);
		color: var(--gray-300);
	}

	:global([data-theme='dark']) .hint a {
		color: var(--blue-400);
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-2);
		padding: var(--space-4);
		border-top: 1px solid var(--gray-200);
	}

	:global([data-theme='dark']) .modal-footer {
		border-top-color: var(--gray-700);
	}

	.btn-secondary,
	.btn-primary {
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary {
		background: white;
		border: 1px solid var(--gray-300);
		color: var(--gray-700);
	}

	.btn-secondary:hover {
		background: var(--gray-50);
	}

	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		border-color: var(--gray-600);
		color: var(--gray-300);
	}

	:global([data-theme='dark']) .btn-secondary:hover {
		background: var(--gray-600);
	}

	.btn-primary {
		background: var(--color-primary);
		border: none;
		color: white;
	}

	.btn-primary:hover {
		background: #2563eb;
	}

	@media (max-width: 640px) {
		.modal-content {
			max-width: 100%;
			max-height: 90vh;
		}

		.add-rpc-row {
			flex-direction: column;
		}
	}
</style>

<script lang="ts">
	import { Plus } from '@lucide/svelte';
	import AddTokenModal from '$lib/components/ui/add-token-modal.svelte';

	interface Props {
		chainId: number;
		rpcUrl: string;
		onTokenAdded?: (tokenId: string) => void;
		buttonText?: string;
		buttonSubtext?: string;
	}

	let {
		chainId,
		rpcUrl,
		onTokenAdded,
		buttonText = 'Add Custom Token',
		buttonSubtext = 'Import ERC-20 token'
	}: Props = $props();

	let showModal = $state(false);

	function openModal() {
		showModal = true;
	}

	function closeModal() {
		showModal = false;
	}

	function handleTokenAdded(tokenId: string) {
		onTokenAdded?.(tokenId);
		closeModal();
	}
</script>

<!-- Add Token Card (Dashed Border) -->
<button class="token-card add-token-card" onclick={openModal}>
	<div class="add-token-icon">
		<Plus size={32} />
	</div>
	<div class="add-token-info">
		<div class="add-token-title">{buttonText}</div>
		<div class="add-token-subtitle">{buttonSubtext}</div>
	</div>
</button>

<!-- Modal -->
<AddTokenModal
	bind:open={showModal}
	{chainId}
	{rpcUrl}
	onClose={closeModal}
	onTokenAdded={handleTokenAdded}
/>

<style>
	/* Add Token Card (Dashed Border) */
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
		text-align: left;
	}

	.add-token-card {
		border-style: dashed;
		border-width: 2px;
		border-color: var(--color-border);
		background: transparent;
		justify-content: center;
		flex-direction: column;
		gap: var(--space-2);
		align-items: center;
	}

	.add-token-card:hover {
		border-color: var(--color-primary);
		background: hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.05);
		transform: translateY(-2px);
	}

	:global([data-theme='dark']) .add-token-card {
		background: transparent;
		border-color: var(--color-panel-border-2);
	}

	:global([data-theme='dark']) .add-token-card:hover {
		border-color: var(--color-primary);
		background: hsla(var(--brand-hue), var(--brand-saturation), 60%, 0.08);
	}

	.add-token-icon {
		color: var(--gray-400);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.add-token-card:hover .add-token-icon {
		color: var(--color-primary);
		transform: scale(1.1);
	}

	.add-token-info {
		text-align: center;
	}

	.add-token-title {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		margin-bottom: var(--space-1);
	}

	.add-token-subtitle {
		font-size: var(--text-sm);
		color: var(--gray-500);
	}

	.add-token-card:hover .add-token-title {
		color: var(--color-primary);
	}

	.add-token-card:hover .add-token-subtitle {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .add-token-title {
		color: var(--gray-200);
	}

	:global([data-theme='dark']) .add-token-subtitle {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .add-token-card:hover .add-token-title {
		color: var(--color-primary);
	}
</style>

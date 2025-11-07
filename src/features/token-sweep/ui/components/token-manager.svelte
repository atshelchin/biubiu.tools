<script lang="ts">
	import { Plus } from 'lucide-svelte';
	import AddTokenModal from '../add-token-modal.svelte';

	interface Props {
		chainId: number;
		onTokenAdded?: (tokenId: string) => void;
		buttonText?: string;
		buttonClass?: string;
	}

	let {
		chainId,
		onTokenAdded,
		buttonText = 'Add Custom Token',
		buttonClass = 'btn-primary'
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
	}
</script>

<button class={buttonClass} onclick={openModal}>
	<Plus size={18} />
	{buttonText}
</button>

<AddTokenModal
	bind:open={showModal}
	{chainId}
	onClose={closeModal}
	onTokenAdded={handleTokenAdded}
/>

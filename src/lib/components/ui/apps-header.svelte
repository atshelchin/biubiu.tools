<script lang="ts">
	import WalletConnectorModal from '$lib/components/ui/wallet-connector-modal.svelte';
</script>

<div class="header">
	<!-- Brand is now in global TopToolbar, only keep home link for apps pages -->
</div>

<WalletConnectorModal />

<style>
	.header {
		margin-bottom: var(--space-3);
		/* Add padding top to account for fixed toolbar */
		/* padding-top: 60px; */
	}
	@media (max-width: 768px) {
		.header {
			margin-bottom: var(--space-1);
		}
	}
</style>

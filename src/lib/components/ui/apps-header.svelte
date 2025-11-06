<script lang="ts">
	import WalletConnector from './wallet-connector.svelte';
</script>

<div class="header">
	<div class="brand-group">
		<img src="/logo.svg" alt="BiuBiu" class="logo" />
		<span class="brand-name">biubiu.tools</span>
	</div>
	<WalletConnector />
</div>

<style>
	.header {
		background: var(--color-card);
		border-radius: var(--radius-xl);
		padding: var(--space-4) var(--space-4);
		margin-bottom: var(--space-5);
		box-shadow: var(--shadow-sm);
		border: 1px solid var(--color-border);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	/* Brand */
	.brand-group {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.logo {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: var(--radius-md);
	}

	.brand-name {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
	}

	@media (max-width: 768px) {
		.header {
			padding: var(--space-4) var(--space-4);
			flex-direction: column;
			gap: var(--space-3);
			text-align: center;
		}
	}
</style>

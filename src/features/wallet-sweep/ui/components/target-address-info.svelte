<script lang="ts">
	interface Props {
		label: string;
		address: string;
		hint: string;
	}

	let { label, address, hint }: Props = $props();
</script>

<div class="target-address-info">
	<h4>{label}</h4>
	<div class="address-display">
		<span class="address">{address}</span>
		<span class="hint">{hint}</span>
	</div>
</div>

<style>
	.target-address-info {
		margin-bottom: var(--space-6);
		padding: var(--space-4);
		background: var(--gray-50);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .target-address-info {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.target-address-info h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-heading-2);
	}

	.address-display {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.address-display .address {
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
		font-size: var(--text-sm);
		color: var(--color-text-1);
		word-break: break-all;
	}

	.address-display .hint {
		font-size: var(--text-xs);
		color: var(--gray-500);
	}
</style>

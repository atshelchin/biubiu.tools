<script lang="ts">
	interface Props {
		targetAddress: string;
	}

	let { targetAddress = $bindable() }: Props = $props();
</script>

<div class="form-section">
	<label class="form-label" for="target-address-input">Target Address</label>
	<input
		id="target-address-input"
		type="text"
		class="form-input"
		bind:value={targetAddress}
		placeholder="0x... (Address to receive all assets)"
	/>
	<p class="form-hint">💡 All assets will be transferred to this address</p>
</div>

<style>
	.form-section {
		margin-bottom: var(--space-6);
	}

	.form-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .form-label {
		color: var(--gray-300);
	}

	.form-input {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		font-size: var(--text-sm);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		background: var(--color-panel-1);
		color: var(--color-text-1);
		transition: all 0.2s;
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
	}

	.form-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
	}

	.form-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: var(--space-2) 0 0 0;
	}

	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}
</style>

<script lang="ts">
	import type { ImportMethod } from '../../types/wallet';

	interface Props {
		selected: ImportMethod;
		onSelect: (method: ImportMethod) => void;
	}

	let { selected = $bindable(), onSelect }: Props = $props();

	function handleSelect(method: ImportMethod) {
		selected = method;
		onSelect(method);
	}
</script>

<div class="method-selector">
	<button
		class="method-option"
		class:selected={selected === 'mnemonic'}
		onclick={() => handleSelect('mnemonic')}
	>
		<div class="method-icon">🔐</div>
		<div class="method-content">
			<div class="method-label">Mnemonic Phrase</div>
			<div class="method-desc">Batch derive addresses</div>
		</div>
	</button>

	<button
		class="method-option"
		class:selected={selected === 'privateKey'}
		onclick={() => handleSelect('privateKey')}
	>
		<div class="method-icon">🔑</div>
		<div class="method-content">
			<div class="method-label">Private Keys</div>
			<div class="method-desc">Import one by one</div>
		</div>
	</button>
</div>

<style>
	.method-selector {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-3);
	}

	.method-option {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s;
		text-align: left;
	}

	:global([data-theme='dark']) .method-option {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.method-option:hover {
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .method-option:hover {
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.method-option.selected {
		border-color: var(--color-primary);
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	:global([data-theme='dark']) .method-option.selected {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
	}

	.method-icon {
		font-size: 2rem;
		line-height: 1;
	}

	.method-content {
		flex: 1;
	}

	.method-label {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
		margin-bottom: var(--space-1);
	}

	:global([data-theme='dark']) .method-label {
		color: var(--gray-100);
	}

	.method-desc {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .method-desc {
		color: var(--gray-400);
	}

	@media (max-width: 640px) {
		.method-selector {
			grid-template-columns: 1fr;
		}
	}
</style>

<script lang="ts" generics="T extends string">
	interface Option<V> {
		value: V;
		label: string;
	}

	interface Props {
		options: Option<T>[];
		value: T;
		onValueChange?: (value: T) => void;
	}

	let { options, value = $bindable(), onValueChange }: Props = $props();

	function handleSelect(newValue: T) {
		value = newValue;
		onValueChange?.(newValue);
	}
</script>

<div class="segmented-control">
	{#each options as option (option.value)}
		<button
			class="segment"
			class:active={value === option.value}
			onclick={() => handleSelect(option.value)}
		>
			{option.label}
		</button>
	{/each}
</div>

<style>
	.segmented-control {
		display: inline-flex;
		background: var(--gray-100);
		border-radius: var(--radius-md);
		padding: 2px;
		gap: 2px;
		width: 100%;
	}

	:global([data-theme='dark']) .segmented-control {
		background: var(--gray-800);
	}

	.segment {
		padding: var(--space-2) var(--space-4);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--gray-600);
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	:global([data-theme='dark']) .segment {
		color: var(--gray-400);
	}

	.segment:hover:not(.active) {
		color: var(--gray-900);
		background: var(--gray-50);
	}

	:global([data-theme='dark']) .segment:hover:not(.active) {
		color: var(--gray-200);
		background: var(--gray-700);
	}

	.segment.active {
		color: var(--gray-900);
		background: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	:global([data-theme='dark']) .segment.active {
		color: var(--gray-100);
		background: var(--gray-700);
	}
</style>

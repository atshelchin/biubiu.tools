<script lang="ts">
	import { CirclePlus } from '@lucide/svelte';

	interface Props {
		/** Main title text */
		title: string;
		/** Subtitle/description text */
		subtitle?: string;
		/** Icon size */
		iconSize?: number;
		/** Click handler */
		onclick?: () => void;
		/** Custom class for styling */
		class?: string;
	}

	let { title, subtitle, iconSize = 32, onclick, class: className = '' }: Props = $props();
</script>

<button class="add-card {className}" {onclick}>
	<div class="add-card-icon">
		<CirclePlus size={iconSize} />
	</div>
	<div class="add-card-info">
		<div class="add-card-title">{title}</div>
		{#if subtitle}
			<div class="add-card-subtitle">{subtitle}</div>
		{/if}
	</div>
</button>

<style>
	.add-card {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		/* flex-direction: column; */
		gap: var(--space-2);
		padding: var(--space-3);
		background: transparent;
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		cursor: pointer;
		transition: all 0.2s ease;
		text-align: center;
		width: 100%;
	}

	.add-card:hover {
		background: var(--color-panel-1);
		border-color: var(--color-primary);
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .add-card {
		background: transparent;
		border-color: var(--color-panel-border-2);
	}

	:global([data-theme='dark']) .add-card:hover {
		border-color: var(--color-primary);
		background: hsla(var(--brand-hue), var(--brand-saturation), 60%, 0.08);
	}

	.add-card-icon {
		color: var(--gray-400);
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.add-card:hover .add-card-icon {
		color: var(--color-primary);
		transform: scale(1.1);
	}

	.add-card-info {
		text-align: center;
	}

	.add-card-title {
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		margin-bottom: var(--space-1);
	}

	.add-card-subtitle {
		font-size: var(--text-sm);
		color: var(--gray-500);
	}

	.add-card:hover .add-card-title {
		color: var(--color-primary);
	}

	.add-card:hover .add-card-subtitle {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .add-card-title {
		color: var(--gray-200);
	}

	:global([data-theme='dark']) .add-card-subtitle {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .add-card:hover .add-card-title {
		color: var(--color-primary);
	}
</style>

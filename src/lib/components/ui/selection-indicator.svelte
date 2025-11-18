<script lang="ts">
	import { Check } from '@lucide/svelte';

	interface Props {
		/** Whether to show the indicator */
		visible?: boolean;
		/** Size of the indicator circle */
		size?: number;
		/** Icon size */
		iconSize?: number;
		/** Position (absolute positioning) */
		position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
		/** Custom class for styling */
		class?: string;
	}

	let {
		visible = true,
		size = 28,
		iconSize = 20,
		position = 'top-right',
		class: className = ''
	}: Props = $props();

	const positionClasses = {
		'top-right': 'top-right',
		'top-left': 'top-left',
		'bottom-right': 'bottom-right',
		'bottom-left': 'bottom-left',
		inline: 'inline'
	};
</script>

{#if visible}
	<div
		class="selection-indicator {positionClasses[position]} {className}"
		style:width="{size}px"
		style:height="{size}px"
	>
		<Check size={iconSize} strokeWidth={3} />
	</div>
{/if}

<style>
	.selection-indicator {
		border-radius: 50%;
		background: var(--color-primary);
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		animation: scaleIn 0.2s ease;
		flex-shrink: 0;
	}

	.selection-indicator.top-right {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
	}

	.selection-indicator.top-left {
		position: absolute;
		top: var(--space-3);
		left: var(--space-3);
	}

	.selection-indicator.bottom-right {
		position: absolute;
		bottom: var(--space-3);
		right: var(--space-3);
	}

	.selection-indicator.bottom-left {
		position: absolute;
		bottom: var(--space-3);
		left: var(--space-3);
	}

	.selection-indicator.inline {
		position: relative;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>

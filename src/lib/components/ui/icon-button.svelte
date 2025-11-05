<script lang="ts">
	import type { ComponentType } from 'svelte';
	import type { Icon } from 'lucide-svelte';

	interface Props {
		icon: ComponentType<Icon>;
		label: string;
		tooltip?: string;
		variant?: 'default' | 'primary' | 'danger';
		size?: 'sm' | 'md' | 'lg';
		onclick?: () => void;
	}

	let {
		icon: IconComponent,
		label,
		tooltip,
		variant = 'default',
		size = 'md',
		onclick
	}: Props = $props();

	let showTooltip = $state(false);
	let isPressed = $state(false);

	function handleClick() {
		isPressed = true;
		setTimeout(() => {
			isPressed = false;
		}, 200);
		onclick?.();
	}

	function handleMouseEnter() {
		if (tooltip) {
			showTooltip = true;
		}
	}

	function handleMouseLeave() {
		showTooltip = false;
	}
</script>

<button
	class="icon-button"
	class:pressed={isPressed}
	class:variant-primary={variant === 'primary'}
	class:variant-danger={variant === 'danger'}
	class:size-sm={size === 'sm'}
	class:size-lg={size === 'lg'}
	onclick={handleClick}
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	aria-label={label}
>
	<span class="icon">
		<IconComponent size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
	</span>
	<span class="label">{label}</span>

	{#if tooltip && showTooltip}
		<span class="tooltip">{tooltip}</span>
	{/if}
</button>

<style>
	.icon-button {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.icon-button:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.icon-button:active,
	.icon-button.pressed {
		transform: translateY(0) scale(0.98);
		box-shadow: none;
	}

	.icon-button.variant-primary {
		background: linear-gradient(135deg, var(--brand-500), var(--brand-600));
		color: white;
		border-color: var(--brand-600);
	}

	.icon-button.variant-primary:hover {
		background: linear-gradient(135deg, var(--brand-600), var(--brand-700));
		box-shadow: 0 4px 12px rgba(var(--brand-500-rgb, 99, 102, 241), 0.3);
	}

	.icon-button.variant-danger {
		background: var(--color-destructive, #ef4444);
		color: white;
		border-color: var(--color-destructive, #dc2626);
	}

	.icon-button.variant-danger:hover {
		background: var(--color-destructive-dark, #dc2626);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
	}

	.icon-button.size-sm {
		padding: var(--space-1-5) var(--space-3);
		font-size: var(--text-xs);
		gap: var(--space-1-5);
	}

	.icon-button.size-lg {
		padding: var(--space-3) var(--space-5);
		font-size: var(--text-base);
		gap: var(--space-2-5);
	}

	.icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		transition: transform 0.2s ease;
	}

	.icon-button:hover .icon {
		transform: scale(1.1);
	}

	.icon-button.pressed .icon {
		transform: scale(0.9);
	}

	.label {
		transition: opacity 0.2s ease;
	}

	.tooltip {
		position: absolute;
		bottom: calc(100% + var(--space-2));
		left: 50%;
		transform: translateX(-50%);
		padding: var(--space-2) var(--space-3);
		background: var(--color-popover, #1f2937);
		color: var(--color-popover-foreground, white);
		font-size: var(--text-xs);
		border-radius: var(--radius-md);
		white-space: nowrap;
		pointer-events: none;
		box-shadow: var(--shadow-lg);
		animation: tooltip-in 0.2s ease;
		z-index: 50;
	}

	.tooltip::after {
		content: '';
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		border: 4px solid transparent;
		border-top-color: var(--color-popover, #1f2937);
	}

	@keyframes tooltip-in {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}

	@media (max-width: 768px) {
		.icon-button {
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-xs);
		}

		.icon-button.size-lg {
			padding: var(--space-2-5) var(--space-4);
			font-size: var(--text-sm);
		}
	}
</style>

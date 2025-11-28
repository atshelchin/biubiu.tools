<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Sparkles, Lock, Rocket, TestTube, FlaskConical } from '@lucide/svelte';

	interface Props {
		status: 'coming-soon' | 'alpha' | 'beta' | 'stable' | 'new';
	}

	let { status }: Props = $props();

	const i18n = useI18n();

	// Status configuration
	const statusConfig = {
		'coming-soon': {
			label: i18n.t('common.status.coming_soon'),
			icon: Lock,
			gradient: 'linear-gradient(135deg, #6B7280, #9CA3AF)',
			color: '#9CA3AF'
		},
		alpha: {
			label: i18n.t('common.status.alpha'),
			icon: FlaskConical,
			gradient: 'linear-gradient(135deg, #8B5CF6, #A78BFA)',
			color: '#8B5CF6'
		},
		beta: {
			label: i18n.t('common.status.beta'),
			icon: TestTube,
			gradient: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
			color: '#3B82F6'
		},
		stable: {
			label: i18n.t('common.status.stable'),
			icon: Sparkles,
			gradient: 'linear-gradient(135deg, #10B981, #34D399)',
			color: '#10B981'
		},
		new: {
			label: i18n.t('common.status.new'),
			icon: Rocket,
			gradient: 'linear-gradient(135deg, #F59E0B, #FBBF24)',
			color: '#F59E0B'
		}
	};

	const config = $derived(statusConfig[status]);
	const Icon = $derived(config.icon);
</script>

<div
	class="status-badge"
	style="--badge-gradient: {config.gradient}; --badge-color: {config.color}"
>
	<div class="badge-glow"></div>
	<div class="badge-content" data-status={status}>
		<Icon size={12} strokeWidth={2.5} />
		<span>{config.label}</span>
	</div>
</div>

<style>
	.status-badge {
		position: absolute;
		top: var(--space-3);
		right: var(--space-3);
		z-index: 10;
	}

	/* Glow effect - only for 'new' status */
	.badge-glow {
		position: absolute;
		inset: -4px;
		background: var(--badge-gradient);
		border-radius: var(--radius-md);
		filter: blur(8px);
		opacity: 0;
	}

	/* Subtle style by default */
	.badge-content {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		color: var(--color-description-2);
		font-size: 10px;
		font-weight: var(--font-semibold);
		border-radius: var(--radius-md);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	:global(.light) .badge-content {
		background: white;
		border: 1px solid var(--color-border);
		color: var(--color-text-secondary);
		box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.08);
	}

	/* Icon color based on status */
	.badge-content :global(svg) {
		color: var(--badge-color);
		opacity: 0.7;
	}

	.badge-content span {
		line-height: 1;
		white-space: nowrap;
	}

	/* Animation on mount */
	@keyframes badgeFadeIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(-2px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.status-badge {
		animation: badgeFadeIn 0.3s ease-out;
	}

	/* Special styling for 'new' status - eye-catching */
	.status-badge:has([data-status='new']) .badge-glow {
		opacity: 0.4;
	}

	.status-badge:has([data-status='new']) .badge-content {
		background: var(--badge-gradient);
		border: none;
		color: white;
		box-shadow:
			0 2px 8px 0 color-mix(in srgb, var(--badge-color) 40%, transparent),
			0 1px 3px 0 rgb(0 0 0 / 0.2);
	}

	.status-badge:has([data-status='new']) .badge-content :global(svg) {
		color: white;
		opacity: 1;
	}

	:global(.light) .status-badge:has([data-status='new']) .badge-content {
		box-shadow:
			0 2px 12px 0 color-mix(in srgb, var(--badge-color) 50%, transparent),
			0 1px 4px 0 rgb(0 0 0 / 0.15);
	}

	/* Special styling for 'coming-soon' - muted */
	.status-badge:has([data-status='coming-soon']) .badge-content {
		opacity: 0.7;
	}
</style>

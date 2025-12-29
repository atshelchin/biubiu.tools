<script lang="ts">
	import { useI18n } from '@shelchin/i18n';

	export type ToolStatus = 'coming_soon' | 'alpha' | 'beta' | 'stable' | 'new' | 'deprecated';

	interface Props {
		status: ToolStatus;
		class?: string;
	}

	let { status, class: className = '' }: Props = $props();

	const i18n = useI18n();

	const statusConfig = $derived({
		coming_soon: {
			label: i18n.t('common.status.coming_soon'),
			variant: 'warning' as const
		},
		alpha: {
			label: i18n.t('common.status.alpha'),
			variant: 'warning' as const
		},
		beta: {
			label: i18n.t('common.status.beta'),
			variant: 'info' as const
		},
		stable: {
			label: i18n.t('common.status.stable'),
			variant: 'success' as const
		},
		new: {
			label: i18n.t('common.status.new'),
			variant: 'primary' as const
		},
		deprecated: {
			label: i18n.t('common.status.deprecated'),
			variant: 'error' as const
		}
	});

	const config = $derived(statusConfig[status]);
</script>

<span class="status-badge {config.variant} {className}">
	{config.label}
</span>

<style>
	.status-badge {
		display: inline-flex;
		align-items: center;
		padding: 0.125rem 0.5rem;
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-full);
		white-space: nowrap;
	}

	.warning {
		background: hsla(45, 100%, 50%, 0.15);
		color: hsl(45, 100%, 35%);
		border: 1px solid hsla(45, 100%, 50%, 0.3);
	}

	.info {
		background: hsla(210, 100%, 50%, 0.15);
		color: hsl(210, 100%, 40%);
		border: 1px solid hsla(210, 100%, 50%, 0.3);
	}

	.success {
		background: hsla(145, 80%, 40%, 0.15);
		color: hsl(145, 80%, 30%);
		border: 1px solid hsla(145, 80%, 40%, 0.3);
	}

	.primary {
		background: hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.15);
		color: var(--color-primary);
		border: 1px solid hsla(var(--brand-hue), var(--brand-saturation), 50%, 0.3);
	}

	.error {
		background: hsla(0, 80%, 50%, 0.15);
		color: hsl(0, 80%, 40%);
		border: 1px solid hsla(0, 80%, 50%, 0.3);
	}

	/* Dark mode adjustments */
	:global([data-theme='dark']) .warning {
		background: hsla(45, 100%, 50%, 0.12);
		color: hsl(45, 100%, 60%);
		border-color: hsla(45, 100%, 50%, 0.25);
	}

	:global([data-theme='dark']) .info {
		background: hsla(210, 100%, 50%, 0.12);
		color: hsl(210, 100%, 65%);
		border-color: hsla(210, 100%, 50%, 0.25);
	}

	:global([data-theme='dark']) .success {
		background: hsla(145, 80%, 40%, 0.12);
		color: hsl(145, 80%, 55%);
		border-color: hsla(145, 80%, 40%, 0.25);
	}

	:global([data-theme='dark']) .error {
		background: hsla(0, 80%, 50%, 0.12);
		color: hsl(0, 80%, 65%);
		border-color: hsla(0, 80%, 50%, 0.25);
	}
</style>

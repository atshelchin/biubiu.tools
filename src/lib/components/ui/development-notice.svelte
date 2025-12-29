<script lang="ts">
	import { X, Github, MessageCircle } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import { checkConsent } from '@shelchin/cookie-consent';
	import type { ToolStatus } from './status-badge.svelte';

	interface Props {
		status: ToolStatus;
		/** Unique key for localStorage to remember dismissal */
		storageKey?: string;
		/** GitHub issues URL */
		githubUrl?: string;
	}

	let {
		status,
		storageKey,
		githubUrl = 'https://github.com/atshelchin/biubiu.tools/issues'
	}: Props = $props();

	const i18n = useI18n();

	// Only show for non-stable statuses
	const shouldShow = $derived(status !== 'stable');

	// Check if dismissed (only if functional cookies consented)
	let isDismissed = $state(false);

	$effect(() => {
		if (storageKey && checkConsent('functional')) {
			isDismissed = localStorage.getItem(`dev-notice-dismissed-${storageKey}`) === 'true';
		}
	});

	function dismiss() {
		isDismissed = true;
		if (storageKey && checkConsent('functional')) {
			localStorage.setItem(`dev-notice-dismissed-${storageKey}`, 'true');
		}
	}

	// Get status-specific message
	const statusMessages = $derived({
		coming_soon: i18n.t('common.development_notice.coming_soon'),
		alpha: i18n.t('common.development_notice.alpha'),
		beta: i18n.t('common.development_notice.beta'),
		new: i18n.t('common.development_notice.new'),
		deprecated: i18n.t('common.development_notice.deprecated'),
		stable: ''
	});

	const message = $derived(statusMessages[status]);

	// Determine variant based on status
	const variant = $derived(
		status === 'deprecated'
			? 'error'
			: status === 'coming_soon' || status === 'alpha'
				? 'warning'
				: 'info'
	);
</script>

{#if shouldShow && !isDismissed}
	<div class="development-notice {variant}">
		<div class="notice-content">
			<div class="notice-icon">
				<MessageCircle size={18} />
			</div>
			<div class="notice-text">
				<p class="notice-message">{message}</p>
				<p class="notice-cta">
					{i18n.t('common.development_notice.feedback_prompt')}
					<a href={githubUrl} target="_blank" rel="noopener noreferrer" class="github-link">
						<Github size={14} />
						{i18n.t('common.development_notice.github_issues')}
					</a>
				</p>
			</div>
		</div>
		<button class="dismiss-btn" onclick={dismiss} aria-label="Dismiss notice">
			<X size={16} />
		</button>
	</div>
{/if}

<style>
	.development-notice {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-3) var(--space-4);
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
	}

	.warning {
		background: hsla(45, 100%, 50%, 0.08);
		border: 1px solid hsla(45, 100%, 50%, 0.25);
	}

	.info {
		background: hsla(210, 100%, 50%, 0.08);
		border: 1px solid hsla(210, 100%, 50%, 0.25);
	}

	.error {
		background: hsla(0, 80%, 50%, 0.08);
		border: 1px solid hsla(0, 80%, 50%, 0.25);
	}

	.notice-content {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		flex: 1;
	}

	.notice-icon {
		flex-shrink: 0;
		margin-top: 2px;
	}

	.warning .notice-icon {
		color: hsl(45, 100%, 40%);
	}

	.info .notice-icon {
		color: hsl(210, 100%, 45%);
	}

	.error .notice-icon {
		color: hsl(0, 80%, 45%);
	}

	.notice-text {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.notice-message {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--color-foreground);
		line-height: 1.5;
	}

	.notice-cta {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		display: flex;
		align-items: center;
		gap: var(--space-1);
		flex-wrap: wrap;
	}

	.github-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		color: var(--color-primary);
		text-decoration: none;
		font-weight: var(--font-medium);
	}

	.github-link:hover {
		text-decoration: underline;
	}

	.dismiss-btn {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
		height: 24px;
		padding: 0;
		background: transparent;
		border: none;
		border-radius: var(--radius-sm);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.dismiss-btn:hover {
		background: hsla(0, 0%, 50%, 0.1);
		color: var(--color-foreground);
	}

	/* Dark mode */
	:global([data-theme='dark']) .warning {
		background: hsla(45, 100%, 50%, 0.06);
		border-color: hsla(45, 100%, 50%, 0.2);
	}

	:global([data-theme='dark']) .warning .notice-icon {
		color: hsl(45, 100%, 55%);
	}

	:global([data-theme='dark']) .info {
		background: hsla(210, 100%, 50%, 0.06);
		border-color: hsla(210, 100%, 50%, 0.2);
	}

	:global([data-theme='dark']) .info .notice-icon {
		color: hsl(210, 100%, 60%);
	}

	:global([data-theme='dark']) .error {
		background: hsla(0, 80%, 50%, 0.06);
		border-color: hsla(0, 80%, 50%, 0.2);
	}

	:global([data-theme='dark']) .error .notice-icon {
		color: hsl(0, 80%, 60%);
	}

	@media (max-width: 640px) {
		.notice-cta {
			flex-direction: column;
			align-items: flex-start;
		}
	}
</style>

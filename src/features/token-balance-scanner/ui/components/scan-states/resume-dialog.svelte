<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { History, Play, Trash2 } from '@lucide/svelte';
	import type { ResumableSession } from '../../../types/scanner';

	interface Props {
		session: ResumableSession;
		onResume: () => void;
		onDiscard: () => void;
	}

	let { session, onResume, onDiscard }: Props = $props();

	const i18n = useI18n();

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}
</script>

<div class="resume-dialog">
	<div class="resume-icon">
		<History size={32} />
	</div>

	<div class="resume-content">
		<h4>{i18n.t('tools.token_balance_scanner.step5.resume.title') || 'Resume Previous Scan?'}</h4>
		<p class="resume-info">
			{i18n.t('tools.token_balance_scanner.step5.resume.info', {
				progress: session.progress,
				addresses: session.addressCount,
				tokens: session.tokenCount
			}) ||
				`Progress: ${session.progress}% (${session.addressCount} addresses, ${session.tokenCount} tokens)`}
		</p>
		<p class="resume-date">
			{i18n.t('tools.token_balance_scanner.step5.resume.last_activity') || 'Last activity'}: {formatDate(
				session.lastActivityAt
			)}
		</p>
	</div>

	<div class="resume-actions">
		<button class="resume-btn" onclick={onResume}>
			<Play size={16} />
			{i18n.t('tools.token_balance_scanner.step5.resume.continue') || 'Continue'}
		</button>
		<button class="delete-btn" onclick={onDiscard}>
			<Trash2 size={16} />
			{i18n.t('tools.token_balance_scanner.step5.resume.discard') || 'Discard'}
		</button>
	</div>
</div>

<style>
	.resume-dialog {
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		display: flex;
		align-items: center;
		gap: var(--space-4);
	}

	.resume-icon {
		color: var(--color-primary);
		flex-shrink: 0;
	}

	.resume-content {
		flex: 1;
	}

	.resume-content h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .resume-content h4 {
		color: var(--gray-100);
	}

	.resume-info,
	.resume-date {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .resume-info,
	:global([data-theme='dark']) .resume-date {
		color: var(--gray-400);
	}

	.resume-actions {
		display: flex;
		gap: var(--space-2);
		flex-shrink: 0;
	}

	.resume-btn,
	.delete-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.resume-btn {
		background: var(--color-primary);
		color: white;
		border: none;
	}

	.resume-btn:hover {
		opacity: 0.9;
	}

	.delete-btn {
		background: var(--color-panel-0);
		color: var(--gray-600);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .delete-btn {
		color: var(--gray-400);
	}

	.delete-btn:hover {
		color: hsl(0, 84%, 60%);
		border-color: hsl(0, 84%, 60%);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.resume-dialog {
			flex-direction: column;
			text-align: center;
		}

		.resume-actions {
			width: 100%;
			flex-direction: column;
		}

		.resume-btn,
		.delete-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>

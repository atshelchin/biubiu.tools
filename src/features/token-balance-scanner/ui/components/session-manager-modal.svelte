<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import {
		X,
		Play,
		Trash2,
		CheckCircle,
		Clock,
		Pause,
		XCircle,
		Plus,
		AlertCircle
	} from '@lucide/svelte';
	import type { ScanSession, SessionStatus } from '$lib/services/balance-scanner/storage';
	import { getStorage } from '$lib/services/balance-scanner/storage';

	interface Props {
		sessions: ScanSession[];
		onClose: () => void;
		onResumeSession: (session: ScanSession) => void;
		onStartNew: () => void;
	}

	let { sessions, onClose, onResumeSession, onStartNew }: Props = $props();

	const i18n = useI18n();
	const storage = getStorage();

	// Local state for managing sessions
	let localSessions = $state([...sessions]);
	let deleteError = $state<string | null>(null);

	function formatDate(timestamp: number): string {
		const date = new Date(timestamp);
		return (
			date.toLocaleDateString() +
			' ' +
			date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		);
	}

	function getStatusIcon(status: SessionStatus) {
		switch (status) {
			case 'scanning':
				return Clock;
			case 'paused':
				return Pause;
			case 'completed':
				return CheckCircle;
			case 'abandoned':
				return XCircle;
			default:
				return Clock;
		}
	}

	function getStatusText(status: SessionStatus): string {
		switch (status) {
			case 'scanning':
				return i18n.t('tools.token_balance_scanner.session.status.scanning') || 'Scanning';
			case 'paused':
				return i18n.t('tools.token_balance_scanner.session.status.paused') || 'Paused';
			case 'completed':
				return i18n.t('tools.token_balance_scanner.session.status.completed') || 'Completed';
			case 'abandoned':
				return i18n.t('tools.token_balance_scanner.session.status.abandoned') || 'Abandoned';
			default:
				return status;
		}
	}

	function getStatusClass(status: SessionStatus): string {
		switch (status) {
			case 'scanning':
				return 'status-scanning';
			case 'paused':
				return 'status-paused';
			case 'completed':
				return 'status-completed';
			case 'abandoned':
				return 'status-abandoned';
			default:
				return '';
		}
	}

	async function handleAbandon(session: ScanSession) {
		deleteError = null;
		try {
			await storage.abandonSession(session.sessionId);
			// Update local state
			localSessions = localSessions.map((s) =>
				s.sessionId === session.sessionId ? { ...s, status: 'abandoned' as SessionStatus } : s
			);
		} catch (err) {
			console.error('Failed to abandon session:', err);
			deleteError =
				i18n.t('tools.token_balance_scanner.session.error.abandon_failed') ||
				'Failed to abandon session';
		}
	}

	async function handleDelete(session: ScanSession) {
		deleteError = null;
		const check = storage.canDeleteSession(session);
		if (!check.canDelete) {
			deleteError = check.reason || 'Cannot delete this session';
			return;
		}

		try {
			await storage.deleteSession(session.sessionId);
			// Update local state
			localSessions = localSessions.filter((s) => s.sessionId !== session.sessionId);
		} catch (err) {
			console.error('Failed to delete session:', err);
			deleteError =
				i18n.t('tools.token_balance_scanner.session.error.delete_failed') ||
				'Failed to delete session';
		}
	}

	function canResume(session: ScanSession): boolean {
		return (
			session.status === 'scanning' || session.status === 'paused' || session.status === 'completed'
		);
	}

	function canAbandon(session: ScanSession): boolean {
		return session.status === 'scanning' || session.status === 'paused';
	}

	function canDelete(session: ScanSession): boolean {
		return storage.canDeleteSession(session).canDelete;
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div class="modal-overlay" onclick={onClose}>
	<div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
		<div class="modal-header">
			<h2>{i18n.t('tools.token_balance_scanner.session.title') || 'Scan Sessions'}</h2>
			<button class="close-btn" onclick={onClose} aria-label="Close">
				<X size={20} />
			</button>
		</div>

		<div class="modal-body">
			{#if deleteError}
				<div class="error-message">
					<AlertCircle size={16} />
					<span>{deleteError}</span>
				</div>
			{/if}

			{#if localSessions.length === 0}
				<div class="empty-state">
					<Clock size={48} />
					<p>{i18n.t('tools.token_balance_scanner.session.empty') || 'No active sessions'}</p>
				</div>
			{:else}
				<div class="session-list">
					{#each localSessions as session (session.sessionId)}
						<div class="session-card">
							<div class="session-header">
								<div class="session-status {getStatusClass(session.status)}">
									<svelte:component this={getStatusIcon(session.status)} size={14} />
									<span>{getStatusText(session.status)}</span>
								</div>
								<span class="session-chain"
									>{session.networkName || `Chain ${session.chainId}`}</span
								>
							</div>

							<div class="session-info">
								<div class="info-row">
									<span class="info-label"
										>{i18n.t('tools.token_balance_scanner.session.progress') || 'Progress'}:</span
									>
									<span class="info-value">{session.stats.progress}%</span>
								</div>
								<div class="info-row">
									<span class="info-label"
										>{i18n.t('tools.token_balance_scanner.session.addresses') || 'Addresses'}:</span
									>
									<span class="info-value">{session.addresses.length.toLocaleString()}</span>
								</div>
								<div class="info-row">
									<span class="info-label"
										>{i18n.t('tools.token_balance_scanner.session.tokens') || 'Tokens'}:</span
									>
									<span class="info-value">{session.tokens.length}</span>
								</div>
								<div class="info-row">
									<span class="info-label"
										>{i18n.t('tools.token_balance_scanner.session.last_activity') ||
											'Last Activity'}:</span
									>
									<span class="info-value">{formatDate(session.lastActivityAt)}</span>
								</div>
							</div>

							<div class="progress-bar">
								<div class="progress-fill" style="width: {session.stats.progress}%"></div>
							</div>

							<div class="session-actions">
								{#if canResume(session)}
									<button class="action-btn resume-btn" onclick={() => onResumeSession(session)}>
										<Play size={14} />
										{session.status === 'completed'
											? i18n.t('tools.token_balance_scanner.session.view') || 'View'
											: i18n.t('tools.token_balance_scanner.session.resume') || 'Resume'}
									</button>
								{/if}
								{#if canAbandon(session)}
									<button class="action-btn abandon-btn" onclick={() => handleAbandon(session)}>
										<XCircle size={14} />
										{i18n.t('tools.token_balance_scanner.session.abandon') || 'Abandon'}
									</button>
								{/if}
								{#if canDelete(session)}
									<button class="action-btn delete-btn" onclick={() => handleDelete(session)}>
										<Trash2 size={14} />
										{i18n.t('tools.token_balance_scanner.session.delete') || 'Delete'}
									</button>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="modal-footer">
			<button class="new-scan-btn" onclick={onStartNew}>
				<Plus size={16} />
				{i18n.t('tools.token_balance_scanner.session.start_new') || 'Start New Scan'}
			</button>
		</div>
	</div>
</div>

<style>
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: var(--space-4);
	}

	.modal-content {
		background: var(--color-card);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
		width: 100%;
		max-width: 600px;
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.modal-header h2 {
		margin: 0;
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .modal-header h2 {
		color: var(--gray-100);
	}

	.close-btn {
		background: none;
		border: none;
		padding: var(--space-1);
		cursor: pointer;
		color: var(--gray-500);
		border-radius: var(--radius-md);
		transition: all 0.2s;
	}

	.close-btn:hover {
		background: var(--color-panel-1);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .close-btn:hover {
		color: var(--gray-300);
	}

	.modal-body {
		flex: 1;
		overflow-y: auto;
		padding: var(--space-4);
	}

	.error-message {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3);
		background: hsl(0, 84%, 95%);
		border: 1px solid hsl(0, 84%, 80%);
		border-radius: var(--radius-md);
		color: hsl(0, 84%, 40%);
		font-size: var(--text-sm);
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) .error-message {
		background: hsl(0, 84%, 15%);
		border-color: hsl(0, 84%, 30%);
		color: hsl(0, 84%, 70%);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-8);
		color: var(--gray-400);
		text-align: center;
	}

	.empty-state p {
		margin: var(--space-4) 0 0;
		font-size: var(--text-base);
	}

	.session-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.session-card {
		padding: var(--space-4);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
	}

	.session-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: var(--space-3);
	}

	.session-status {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
	}

	.status-scanning {
		background: hsl(200, 80%, 90%);
		color: hsl(200, 80%, 35%);
	}

	:global([data-theme='dark']) .status-scanning {
		background: hsl(200, 80%, 20%);
		color: hsl(200, 80%, 70%);
	}

	.status-paused {
		background: hsl(40, 80%, 90%);
		color: hsl(40, 80%, 35%);
	}

	:global([data-theme='dark']) .status-paused {
		background: hsl(40, 80%, 20%);
		color: hsl(40, 80%, 70%);
	}

	.status-completed {
		background: hsl(140, 60%, 90%);
		color: hsl(140, 60%, 35%);
	}

	:global([data-theme='dark']) .status-completed {
		background: hsl(140, 60%, 20%);
		color: hsl(140, 60%, 70%);
	}

	.status-abandoned {
		background: hsl(0, 0%, 90%);
		color: hsl(0, 0%, 45%);
	}

	:global([data-theme='dark']) .status-abandoned {
		background: hsl(0, 0%, 25%);
		color: hsl(0, 0%, 60%);
	}

	.session-chain {
		font-size: var(--text-sm);
		color: var(--gray-500);
	}

	.session-info {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-sm);
	}

	.info-label {
		color: var(--gray-500);
	}

	.info-value {
		color: var(--gray-900);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .info-value {
		color: var(--gray-100);
	}

	.progress-bar {
		height: 4px;
		background: var(--color-panel-1);
		border-radius: 2px;
		overflow: hidden;
		margin-bottom: var(--space-3);
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 0.3s ease;
	}

	.session-actions {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.action-btn {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		border: 1px solid var(--color-border);
		background: var(--color-panel-0);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .action-btn {
		color: var(--gray-400);
	}

	.action-btn:hover {
		background: var(--color-panel-1);
	}

	.resume-btn {
		background: var(--color-primary);
		color: white;
		border: none;
	}

	.resume-btn:hover {
		opacity: 0.9;
	}

	.abandon-btn:hover {
		color: hsl(40, 80%, 45%);
		border-color: hsl(40, 80%, 45%);
	}

	.delete-btn:hover {
		color: hsl(0, 84%, 60%);
		border-color: hsl(0, 84%, 60%);
	}

	.modal-footer {
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
		display: flex;
		justify-content: center;
	}

	.new-scan-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .new-scan-btn {
		color: var(--gray-300);
	}

	.new-scan-btn:hover {
		background: var(--color-panel-2);
	}

	/* Responsive */
	@media (max-width: 640px) {
		.modal-content {
			max-height: 90vh;
		}

		.session-info {
			grid-template-columns: 1fr;
		}

		.session-actions {
			flex-direction: column;
		}

		.action-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>

<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { History, Trash2, Download, Upload, Play, X, Clock, ChevronRight } from '@lucide/svelte';
	import {
		getStoredSessionList,
		loadSession,
		deleteSession,
		exportSessionAsJson,
		importSessionFromJson,
		isSessionResumable,
		cleanupExpiredSessions,
		type StoredSessionMeta
	} from '../../utils/session-storage';
	import type { StoredSession } from '../../utils/session-storage';

	interface Props {
		onResume?: (session: StoredSession) => void;
		onClose?: () => void;
	}

	let { onResume, onClose }: Props = $props();

	const i18n = useI18n();

	let sessions = $state<StoredSessionMeta[]>([]);
	let selectedSession = $state<StoredSessionMeta | null>(null);
	let isImporting = $state(false);
	let importError = $state<string | null>(null);
	let fileInput: HTMLInputElement | undefined = $state();

	// Load sessions on mount
	$effect(() => {
		loadSessions();
	});

	function loadSessions() {
		// Clean up expired sessions first
		cleanupExpiredSessions();
		sessions = getStoredSessionList();
	}

	function handleSelect(session: StoredSessionMeta) {
		selectedSession = selectedSession?.sessionId === session.sessionId ? null : session;
	}

	function handleResume(meta: StoredSessionMeta) {
		const stored = loadSession(meta.sessionId);
		if (stored) {
			onResume?.(stored);
			onClose?.();
		}
	}

	function handleDelete(sessionId: string) {
		deleteSession(sessionId);
		loadSessions();
		if (selectedSession?.sessionId === sessionId) {
			selectedSession = null;
		}
	}

	function handleExport(sessionId: string) {
		const json = exportSessionAsJson(sessionId);
		if (json) {
			const blob = new Blob([json], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `distribution-session-${sessionId.slice(0, 8)}.json`;
			a.click();
			URL.revokeObjectURL(url);
		}
	}

	function handleImportClick() {
		fileInput?.click();
	}

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		isImporting = true;
		importError = null;

		try {
			const text = await file.text();
			const stored = importSessionFromJson(text);
			if (stored) {
				loadSessions();
			} else {
				importError = i18n.t('tools.one_to_many_transfer.step5.session.import_error');
			}
		} catch {
			importError = i18n.t('tools.one_to_many_transfer.step5.session.import_error');
		} finally {
			isImporting = false;
			if (fileInput) {
				fileInput.value = '';
			}
		}
	}

	function formatDate(timestamp: number): string {
		return new Date(timestamp).toLocaleString();
	}

	function formatTimeRemaining(expiresAt: number): string {
		const now = Date.now();
		const remaining = expiresAt - now;
		if (remaining <= 0) return i18n.t('tools.one_to_many_transfer.step5.session.expired');

		const hours = Math.floor(remaining / (1000 * 60 * 60));
		const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		return `${minutes}m`;
	}

	function getStatusColor(status: StoredSessionMeta['status']): string {
		switch (status) {
			case 'pending':
				return 'status-pending';
			case 'partial':
				return 'status-partial';
			case 'completed':
				return 'status-completed';
			case 'expired':
				return 'status-expired';
			default:
				return '';
		}
	}
</script>

<div class="session-manager">
	<div class="header">
		<div class="header-title">
			<History size={20} />
			<h3>{i18n.t('tools.one_to_many_transfer.step5.session.title')}</h3>
		</div>
		<div class="header-actions">
			<button
				class="btn-icon"
				onclick={handleImportClick}
				title={i18n.t('tools.one_to_many_transfer.step5.session.import')}
			>
				<Upload size={18} />
			</button>
			<input
				bind:this={fileInput}
				type="file"
				accept=".json"
				onchange={handleFileSelect}
				style="display: none;"
			/>
			{#if onClose}
				<button class="btn-icon" onclick={onClose}>
					<X size={18} />
				</button>
			{/if}
		</div>
	</div>

	{#if importError}
		<div class="error-banner">
			{importError}
		</div>
	{/if}

	<div class="session-list">
		{#if sessions.length === 0}
			<div class="empty-state">
				<History size={48} strokeWidth={1} />
				<p>{i18n.t('tools.one_to_many_transfer.step5.session.empty')}</p>
			</div>
		{:else}
			{#each sessions as session (session.sessionId)}
				{@const resumable = isSessionResumable(session)}
				<button
					class="session-item"
					class:selected={selectedSession?.sessionId === session.sessionId}
					class:resumable
					onclick={() => handleSelect(session)}
					type="button"
				>
					<div class="session-main">
						<div class="session-header">
							<span class="session-token">{session.tokenSymbol}</span>
							<span class="session-status {getStatusColor(session.status)}">
								{i18n.t(`tools.one_to_many_transfer.step5.session.status_${session.status}`)}
							</span>
						</div>
						<div class="session-info">
							<span class="session-recipients">
								{session.recipientCount}
								{i18n.t('tools.one_to_many_transfer.step5.content.recipients').toLowerCase()}
							</span>
							<span class="session-batches">
								{session.completedBatches}/{session.totalBatches}
								{i18n.t('tools.one_to_many_transfer.step5.session.batches')}
							</span>
						</div>
						<div class="session-meta">
							<Clock size={12} />
							<span class="session-time">
								{#if session.status === 'completed'}
									{formatDate(session.lastUpdatedAt)}
								{:else}
									{i18n.t('tools.one_to_many_transfer.step5.session.expires_in')}
									{formatTimeRemaining(session.expiresAt)}
								{/if}
							</span>
						</div>
					</div>
					<div class="session-chevron">
						<ChevronRight size={16} />
					</div>
				</button>

				{#if selectedSession?.sessionId === session.sessionId}
					<div class="session-actions">
						{#if resumable}
							<button class="btn-action btn-primary" onclick={() => handleResume(session)}>
								<Play size={16} />
								{i18n.t('tools.one_to_many_transfer.step5.session.resume')}
							</button>
						{/if}
						<button class="btn-action" onclick={() => handleExport(session.sessionId)}>
							<Download size={16} />
							{i18n.t('tools.one_to_many_transfer.step5.session.export')}
						</button>
						<button class="btn-action btn-danger" onclick={() => handleDelete(session.sessionId)}>
							<Trash2 size={16} />
							{i18n.t('tools.one_to_many_transfer.step5.session.delete')}
						</button>
					</div>
				{/if}
			{/each}
		{/if}
	</div>

	{#if isImporting}
		<div class="importing-overlay">
			<div class="spinner"></div>
			<span>{i18n.t('tools.one_to_many_transfer.step5.session.importing')}</span>
		</div>
	{/if}
</div>

<style>
	.session-manager {
		display: flex;
		flex-direction: column;
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		max-height: 500px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-3) var(--space-4);
		border-bottom: 1px solid var(--color-border);
		background: var(--color-panel-2);
	}

	.header-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .header-title {
		color: var(--gray-100);
	}

	.header-title h3 {
		margin: 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
	}

	.btn-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.btn-icon:hover {
		background: var(--color-panel-1);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .btn-icon:hover {
		color: var(--gray-100);
	}

	.error-banner {
		padding: var(--space-3);
		background: hsla(0, 80%, 50%, 0.1);
		border-bottom: 1px solid hsla(0, 80%, 50%, 0.3);
		color: hsl(0, 80%, 45%);
		font-size: var(--text-sm);
	}

	.session-list {
		flex: 1;
		overflow-y: auto;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: var(--space-8);
		color: var(--gray-500);
		gap: var(--space-3);
	}

	.empty-state p {
		margin: 0;
		font-size: var(--text-sm);
	}

	.session-item {
		display: flex;
		align-items: center;
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: transparent;
		border: none;
		border-bottom: 1px solid var(--color-border);
		cursor: pointer;
		transition: background 0.2s ease;
		text-align: left;
	}

	.session-item:hover {
		background: var(--color-panel-2);
	}

	.session-item.selected {
		background: hsla(210, 100%, 95%, 0.5);
	}

	:global([data-theme='dark']) .session-item.selected {
		background: hsla(210, 100%, 20%, 0.2);
	}

	.session-main {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.session-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.session-token {
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .session-token {
		color: var(--gray-100);
	}

	.session-status {
		font-size: var(--text-xs);
		padding: 2px 8px;
		border-radius: var(--radius-full);
		font-weight: var(--font-medium);
	}

	.session-status.status-pending {
		background: hsla(45, 80%, 50%, 0.15);
		color: hsl(45, 80%, 35%);
	}

	.session-status.status-partial {
		background: hsla(210, 80%, 50%, 0.15);
		color: hsl(210, 80%, 45%);
	}

	.session-status.status-completed {
		background: hsla(145, 80%, 40%, 0.15);
		color: hsl(145, 80%, 30%);
	}

	.session-status.status-expired {
		background: hsla(0, 80%, 50%, 0.15);
		color: hsl(0, 80%, 45%);
	}

	:global([data-theme='dark']) .session-status.status-pending {
		color: hsl(45, 80%, 65%);
	}

	:global([data-theme='dark']) .session-status.status-partial {
		color: hsl(210, 80%, 65%);
	}

	:global([data-theme='dark']) .session-status.status-completed {
		color: hsl(145, 80%, 55%);
	}

	:global([data-theme='dark']) .session-status.status-expired {
		color: hsl(0, 80%, 65%);
	}

	.session-info {
		display: flex;
		gap: var(--space-3);
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .session-info {
		color: var(--gray-400);
	}

	.session-meta {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--gray-500);
	}

	.session-chevron {
		color: var(--gray-400);
		transition: transform 0.2s ease;
	}

	.session-item.selected .session-chevron {
		transform: rotate(90deg);
	}

	.session-actions {
		display: flex;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-2);
		border-bottom: 1px solid var(--color-border);
	}

	.btn-action {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s ease;
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .btn-action {
		color: var(--gray-300);
	}

	.btn-action:hover {
		background: var(--color-panel-2);
	}

	.btn-action.btn-primary {
		background: hsl(210, 100%, 50%);
		border-color: hsl(210, 100%, 50%);
		color: white;
	}

	.btn-action.btn-primary:hover {
		background: hsl(210, 100%, 45%);
	}

	.btn-action.btn-danger {
		color: hsl(0, 80%, 50%);
	}

	.btn-action.btn-danger:hover {
		background: hsla(0, 80%, 50%, 0.1);
		border-color: hsl(0, 80%, 50%);
	}

	.importing-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		background: hsla(0, 0%, 100%, 0.9);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .importing-overlay {
		background: hsla(0, 0%, 10%, 0.9);
		color: var(--gray-300);
	}

	.spinner {
		width: 32px;
		height: 32px;
		border: 3px solid var(--color-border);
		border-top-color: hsl(210, 100%, 50%);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

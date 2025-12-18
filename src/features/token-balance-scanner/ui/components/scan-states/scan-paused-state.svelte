<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Pause, Play, RefreshCw } from '@lucide/svelte';
	import type { ScanProgress } from '../../../types/scanner';

	interface Props {
		progress: ScanProgress;
		error: string | null;
		onResume: () => void;
		onNewScan: () => void;
	}

	let { progress, error, onResume, onNewScan }: Props = $props();

	const i18n = useI18n();
</script>

<div class="paused-state">
	<div class="paused-icon">
		<Pause size={56} />
	</div>

	<h3>{i18n.t('tools.token_balance_scanner.step5.paused.title') || 'Scan Paused'}</h3>

	<p class="paused-message">
		{error ||
			i18n.t('tools.token_balance_scanner.step5.paused.message') ||
			'The scan has been paused.'}
	</p>

	<div class="progress-stats">
		<span class="stat success">
			{progress.success || 0}
			{i18n.t('tools.token_balance_scanner.step5.scanning.success') || 'completed'}
		</span>
		<span class="stat pending">
			{progress.pending || 0}
			{i18n.t('tools.token_balance_scanner.step5.scanning.pending') || 'remaining'}
		</span>
	</div>

	<div class="paused-actions">
		<button class="resume-btn" onclick={onResume}>
			<Play size={20} />
			<span>{i18n.t('tools.token_balance_scanner.step5.paused.resume') || 'Resume'}</span>
		</button>
		<button class="reset-btn" onclick={onNewScan}>
			<RefreshCw size={20} />
			<span>{i18n.t('tools.token_balance_scanner.step5.paused.new_scan') || 'New Scan'}</span>
		</button>
	</div>
</div>

<style>
	.paused-state {
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
	}

	.paused-icon {
		color: hsl(45, 100%, 40%);
	}

	h3 {
		margin: 0;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-100);
	}

	.paused-message {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .paused-message {
		color: var(--gray-400);
	}

	.progress-stats {
		display: flex;
		justify-content: center;
		gap: var(--space-4);
		font-size: var(--text-sm);
	}

	.stat {
		display: flex;
		align-items: center;
		gap: var(--space-1);
	}

	.stat.success {
		color: hsl(142, 71%, 45%);
	}

	.stat.pending {
		color: var(--gray-500);
	}

	.paused-actions {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-4);
	}

	.resume-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.resume-btn:hover {
		opacity: 0.9;
	}

	.reset-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--gray-700);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .reset-btn {
		color: var(--gray-300);
	}

	.reset-btn:hover {
		border-color: var(--color-primary);
	}
</style>

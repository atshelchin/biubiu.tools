<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { Loader2, Pause } from '@lucide/svelte';
	import type { ScanProgress } from '../../../types/scanner';

	interface Props {
		progress: ScanProgress;
		onPause: () => void;
	}

	let { progress, onPause }: Props = $props();

	const i18n = useI18n();
</script>

<div class="scanning-state">
	<div class="scanning-animation">
		<Loader2 size={56} class="spin" />
	</div>

	<h3>
		{i18n.t('routes/apps/token-balance-scanner.step5.scanning.title') || 'Scanning Balances...'}
	</h3>

	<div class="scan-progress">
		<div class="progress-bar">
			<div class="progress-fill" style="width: {progress.percentage}%"></div>
		</div>

		<div class="progress-stats">
			<span class="stat success">
				{progress.success || 0}
				{i18n.t('routes/apps/token-balance-scanner.step5.scanning.success') || 'completed'}
			</span>
			<span class="stat failed">
				{progress.failed || 0}
				{i18n.t('routes/apps/token-balance-scanner.step5.scanning.failed') || 'failed'}
			</span>
			<span class="stat pending">
				{progress.pending || 0}
				{i18n.t('routes/apps/token-balance-scanner.step5.scanning.pending') || 'pending'}
			</span>
		</div>

		<p class="progress-percentage">{progress.percentage}%</p>
	</div>

	<button class="pause-btn" onclick={onPause}>
		<Pause size={20} />
		<span>{i18n.t('routes/apps/token-balance-scanner.step5.scanning.pause') || 'Pause'}</span>
	</button>
</div>

<style>
	.scanning-state {
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}

	.scanning-animation :global(.spin) {
		color: var(--color-primary);
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
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

	.scan-progress {
		width: 100%;
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.progress-bar {
		height: 10px;
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 0.3s ease;
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

	.stat.failed {
		color: hsl(0, 84%, 60%);
	}

	.stat.pending {
		color: var(--gray-500);
	}

	.progress-percentage {
		margin: 0;
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--color-primary);
	}

	.pause-btn {
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

	:global([data-theme='dark']) .pause-btn {
		color: var(--gray-300);
	}

	.pause-btn:hover {
		border-color: var(--color-primary);
		color: var(--color-primary);
	}
</style>

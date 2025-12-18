<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { AlertCircle, RefreshCw } from '@lucide/svelte';

	interface Props {
		error: string | null;
		onRetry: () => void;
	}

	let { error, onRetry }: Props = $props();

	const i18n = useI18n();
</script>

<div class="error-state">
	<AlertCircle size={56} />

	<h3>{i18n.t('tools.token_balance_scanner.step5.error.title') || 'Scan Failed'}</h3>

	<p class="error-message">
		{error ||
			i18n.t('tools.token_balance_scanner.step5.error.unknown') ||
			'An unknown error occurred'}
	</p>

	<button class="retry-btn" onclick={onRetry}>
		<RefreshCw size={20} />
		<span>{i18n.t('tools.token_balance_scanner.step5.error.retry') || 'Retry Scan'}</span>
	</button>
</div>

<style>
	.error-state {
		padding: var(--space-8);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		background: hsla(0, 84%, 60%, 0.1);
		border: 1px solid hsla(0, 84%, 60%, 0.3);
		border-radius: var(--radius-lg);
		color: hsl(0, 84%, 60%);
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

	.error-message {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-700);
		font-family: monospace;
	}

	:global([data-theme='dark']) .error-message {
		color: var(--gray-300);
	}

	.retry-btn {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.retry-btn:hover {
		opacity: 0.9;
	}
</style>

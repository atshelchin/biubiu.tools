<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { Loader2 } from '@lucide/svelte';

	interface Props {
		isEstimating: boolean;
		showEstimate: boolean;
		isExecuting: boolean;
		canExecute: boolean;
		onEstimate: () => void;
		onExecute: () => void;
	}

	let { isEstimating, showEstimate, isExecuting, canExecute, onEstimate, onExecute }: Props =
		$props();
	const i18n = useI18n();
</script>

<div class="action-buttons">
	<button class="btn-secondary" onclick={onEstimate} disabled={isEstimating}>
		{#if isEstimating}
			<Loader2 size={18} class="spinning" />
			{i18n.t('wallet-sweep.step5.content.actions.estimating')}
		{:else}
			{i18n.t('wallet-sweep.step5.content.actions.estimate_cost')}
		{/if}
	</button>

	{#if showEstimate}
		<button class="btn-execute" onclick={onExecute} disabled={!canExecute || isExecuting}>
			{#if isExecuting}
				<Loader2 size={18} class="spinning" />
				{i18n.t('wallet-sweep.step5.content.actions.executing')}
			{:else}
				{i18n.t('wallet-sweep.step5.content.actions.execute_sweep')}
			{/if}
		</button>
	{/if}
</div>

<style>
	.action-buttons {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}

	.btn-secondary {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		border: 2px solid var(--color-primary);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--color-primary);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--color-primary);
		color: white;
		transform: translateY(-1px);
	}

	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-execute {
		flex: 1;
		padding: var(--space-3) var(--space-4);
		border: none;
		border-radius: var(--radius-sm);
		background: linear-gradient(135deg, var(--color-primary) 0%, #10b981 100%);
		color: white;
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.btn-execute:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
	}

	.btn-execute:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		box-shadow: none;
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

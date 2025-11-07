<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import { appState } from '../../stores/app-state.svelte';
</script>

<StepSidebar stepNumber={3} title="Trade Token" description="Buy or sell your token">
	<div class="token-summary">
		<h4 class="summary-title">Token Details</h4>
		{#if appState.tokenInfo}
			<div class="summary-content">
				<div class="summary-row">
					<span class="summary-label">Name</span>
					<span class="summary-value">{appState.tokenInfo.name}</span>
				</div>
				<div class="summary-row">
					<span class="summary-label">Symbol</span>
					<span class="summary-value">{appState.tokenInfo.symbol}</span>
				</div>
			</div>
		{/if}
	</div>

	<div class="trading-tips">
		<h4 class="tips-title">Trading Tips</h4>
		<ul class="tips-list">
			<li>Always check the token contract address before trading</li>
			<li>Start with small amounts to test</li>
			<li>Higher slippage may be needed for low-liquidity tokens</li>
			<li>Monitor gas fees during high network activity</li>
		</ul>
	</div>

	<div class="warning-note">
		<span class="warning-icon">⚠️</span>
		<p>
			This is a demo interface. Production implementation would integrate with DEX routers for
			actual trading.
		</p>
	</div>
</StepSidebar>

<style>
	/* Token Summary */
	.token-summary {
		margin: var(--space-4) 0;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.summary-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
		margin: 0 0 var(--space-2) 0;
	}

	:global([data-theme='dark']) .summary-title {
		color: var(--gray-200);
	}

	.summary-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.summary-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .summary-label {
		color: var(--gray-400);
	}

	.summary-value {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .summary-value {
		color: var(--gray-100);
	}

	/* Trading Tips */
	.trading-tips {
		margin: var(--space-4) 0;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.tips-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
		margin: 0 0 var(--space-2) 0;
	}

	:global([data-theme='dark']) .tips-title {
		color: var(--gray-200);
	}

	.tips-list {
		margin: 0;
		padding-left: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.tips-list li {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .tips-list li {
		color: var(--gray-300);
	}

	/* Warning Note */
	.warning-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(40, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(40, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .warning-note {
		background: hsla(40, 100%, 15%, 0.3);
		border-color: hsla(40, 100%, 25%, 1);
	}

	.warning-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.warning-note p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .warning-note p {
		color: var(--gray-300);
	}
</style>

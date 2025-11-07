<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={1}
	title="Connect Wallet"
	description="Connect your Web3 wallet to start trading tokens"
>
	<div class="feature-highlights">
		<ul class="feature-list">
			<li>
				<span class="feature-icon">💰</span>
				<span>Buy and sell tokens directly from your wallet</span>
			</li>
			<li>
				<span class="feature-icon">🌐</span>
				<span>Support for multiple EVM networks</span>
			</li>
			<li>
				<span class="feature-icon">🔒</span>
				<span>Non-custodial and secure</span>
			</li>
		</ul>
	</div>

	<div class="info-note">
		<span class="info-icon">💡</span>
		<p>
			This tool helps you trade tokens that were created on DEXScreener Moonshot but no longer have
			a direct trading interface.
		</p>
	</div>
</StepSidebar>

<style>
	/* Feature Highlights */
	.feature-highlights {
		margin: var(--space-4) 0;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.feature-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.feature-list li {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .feature-list li {
		color: var(--gray-300);
	}

	.feature-icon {
		font-size: var(--text-lg);
		flex-shrink: 0;
		line-height: 1;
	}

	/* Info Note */
	.info-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(210, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(210, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .info-note {
		background: hsla(210, 100%, 15%, 0.3);
		border-color: hsla(210, 100%, 25%, 1);
	}

	.info-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.info-note p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .info-note p {
		color: var(--gray-300);
	}
</style>

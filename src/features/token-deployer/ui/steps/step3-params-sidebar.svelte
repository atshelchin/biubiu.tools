<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={3}
	title="Advanced Parameters"
	description="Configure optional features for your token"
>
	<div class="features-section">
		<h4 class="section-title">Available Features</h4>
		<ul class="features-list">
			<li>
				<span class="feature-icon">🔥</span>
				<div class="feature-content">
					<strong>Burnable:</strong>
					<span>Allow token holders to destroy tokens</span>
				</div>
			</li>
			<li>
				<span class="feature-icon">⏸️</span>
				<div class="feature-content">
					<strong>Pausable:</strong>
					<span>Ability to pause all transfers</span>
				</div>
			</li>
			<li>
				<span class="feature-icon">💸</span>
				<div class="feature-content">
					<strong>Tax System:</strong>
					<span>Configure buy/sell taxes</span>
				</div>
			</li>
			<li>
				<span class="feature-icon">🤖</span>
				<div class="feature-content">
					<strong>Anti-Bot:</strong>
					<span>Limits per transaction/wallet</span>
				</div>
			</li>
		</ul>
	</div>

	<div class="warning-box">
		<span class="warning-icon">⚠️</span>
		<p>Advanced features increase deployment gas costs. Only enable what you need.</p>
	</div>
</StepSidebar>

<style>
	.features-section {
		margin: var(--space-4) 0;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.section-title {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .section-title {
		color: var(--gray-100);
	}

	.features-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.features-list li {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
	}

	.feature-icon {
		font-size: var(--text-lg);
		flex-shrink: 0;
		line-height: 1;
	}

	.feature-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		font-size: var(--text-sm);
	}

	.feature-content strong {
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .feature-content strong {
		color: var(--gray-100);
	}

	.feature-content span {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .feature-content span {
		color: var(--gray-400);
	}

	.warning-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(30, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(30, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .warning-box {
		background: hsla(30, 100%, 15%, 0.3);
		border-color: hsla(30, 100%, 25%, 1);
	}

	.warning-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.warning-box p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .warning-box p {
		color: var(--gray-300);
	}
</style>

<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={2}
	title="Basic Token Information"
	description="Configure the fundamental properties of your token"
>
	<div class="info-section">
		<h4 class="section-title">Token Properties</h4>
		<ul class="info-list">
			<li>
				<span class="info-icon">📝</span>
				<div class="info-content">
					<strong>Name & Symbol:</strong>
					<span>Identify your token uniquely</span>
				</div>
			</li>
			<li>
				<span class="info-icon">🔢</span>
				<div class="info-content">
					<strong>Decimals:</strong>
					<span>Usually 18 (like ETH)</span>
				</div>
			</li>
			<li>
				<span class="info-icon">💰</span>
				<div class="info-content">
					<strong>Initial Supply:</strong>
					<span>Tokens minted at deployment</span>
				</div>
			</li>
		</ul>
	</div>

	<div class="tip-box">
		<span class="tip-icon">💡</span>
		<p>Choose a memorable name and symbol. These cannot be changed after deployment.</p>
	</div>
</StepSidebar>

<style>
	.info-section {
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

	.info-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.info-list li {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
	}

	.info-icon {
		font-size: var(--text-lg);
		flex-shrink: 0;
		line-height: 1;
	}

	.info-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		font-size: var(--text-sm);
	}

	.info-content strong {
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .info-content strong {
		color: var(--gray-100);
	}

	.info-content span {
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .info-content span {
		color: var(--gray-400);
	}

	.tip-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(45, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .tip-box {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 25%, 1);
	}

	.tip-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.tip-box p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .tip-box p {
		color: var(--gray-300);
	}
</style>

<script lang="ts">
	/**
	 * Call Master Step 3: Execute Calls Sidebar
	 */
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar stepNumber={3} title="Execute Calls" description="Run your contract calls">
	<div class="feature-highlights">
		<ul class="feature-list">
			<li>
				<span class="feature-icon">📖</span>
				<span>Read calls are free (no gas)</span>
			</li>
			<li>
				<span class="feature-icon">✏️</span>
				<span>Write calls require gas</span>
			</li>
			<li>
				<span class="feature-icon">📦</span>
				<span>Batch calls for efficiency</span>
			</li>
		</ul>
	</div>

	<div class="warning-note">
		<span class="warning-icon">⚠️</span>
		<p>Always verify the contract address and function parameters before executing write calls.</p>
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

	/* Warning Note */
	.warning-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(45, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .warning-note {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 30%, 1);
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

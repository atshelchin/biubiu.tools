<script lang="ts">
	/**
	 * Call Master Step 2: Configure Contract Sidebar
	 */
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar stepNumber={2} title="Configure Contract" description="Load your contract ABI">
	<div class="feature-highlights">
		<ul class="feature-list">
			<li>
				<span class="feature-icon">📝</span>
				<span>Paste ABI JSON directly</span>
			</li>
			<li>
				<span class="feature-icon">🔗</span>
				<span>Fetch from verified contracts</span>
			</li>
			<li>
				<span class="feature-icon">📁</span>
				<span>Upload ABI file</span>
			</li>
		</ul>
	</div>

	<div class="tip-note">
		<span class="tip-icon">💡</span>
		<p>For verified contracts, we can automatically fetch the ABI from block explorers.</p>
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

	/* Tip Note */
	.tip-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(45, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(45, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .tip-note {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 30%, 1);
	}

	.tip-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.tip-note p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .tip-note p {
		color: var(--gray-300);
	}
</style>

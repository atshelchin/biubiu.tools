<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={4}
	title="Generation Results"
	description="View, export, and manage generated wallets"
>
	<div class="feature-highlights">
		<ul class="feature-list">
			<li>
				<span class="feature-icon">📋</span>
				<span>Table view with all details</span>
			</li>
			<li>
				<span class="feature-icon">📥</span>
				<span>Export to CSV or JSON</span>
			</li>
			<li>
				<span class="feature-icon">🔄</span>
				<span>Generate more wallets anytime</span>
			</li>
		</ul>
	</div>

	<div class="security-note">
		<span class="security-icon">🔒</span>
		<p>
			Remember to store your private keys securely. Export and save them in a safe location before
			closing this page.
		</p>
	</div>
</StepSidebar>

<style>
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

	.security-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(0, 70%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(0, 70%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .security-note {
		background: hsla(0, 70%, 15%, 0.3);
		border-color: hsla(0, 70%, 25%, 1);
	}

	.security-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.security-note p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .security-note p {
		color: var(--gray-300);
	}
</style>

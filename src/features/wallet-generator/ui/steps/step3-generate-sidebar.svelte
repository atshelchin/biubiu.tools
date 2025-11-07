<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={3}
	title="Generate Wallets"
	description="Configure generation parameters and start"
>
	<div class="feature-highlights">
		<ul class="feature-list">
			<li>
				<span class="feature-icon">🚀</span>
				<span>Fast batch generation</span>
			</li>
			<li>
				<span class="feature-icon">⚡</span>
				<span>Web Worker acceleration</span>
			</li>
			<li>
				<span class="feature-icon">🎯</span>
				<span>Up to 1000 wallets at once</span>
			</li>
		</ul>
	</div>

	<div class="tip-note">
		<span class="tip-icon">💡</span>
		<p>Larger batches may take longer to generate. Use Web Workers for better performance.</p>
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

	.tip-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(280, 60%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(280, 60%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .tip-note {
		background: hsla(280, 60%, 15%, 0.3);
		border-color: hsla(280, 60%, 25%, 1);
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

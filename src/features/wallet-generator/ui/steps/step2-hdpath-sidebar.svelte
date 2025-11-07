<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={2}
	title="HD Path Configuration"
	description="Configure blockchain and derivation path for wallet generation"
>
	<div class="feature-highlights">
		<ul class="feature-list">
			<li>
				<span class="feature-icon">⛓️</span>
				<span>Support Ethereum and Bitcoin</span>
			</li>
			<li>
				<span class="feature-icon">🛣️</span>
				<span>BIP44, BIP49, BIP84 standards</span>
			</li>
			<li>
				<span class="feature-icon">✏️</span>
				<span>Custom HD path support</span>
			</li>
		</ul>
	</div>

	<div class="info-note">
		<span class="info-icon">ℹ️</span>
		<p>
			HD (Hierarchical Deterministic) paths allow generating multiple addresses from a single seed.
			Different paths are used for different purposes and wallet types.
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

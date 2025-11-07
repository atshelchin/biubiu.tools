<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={1}
	title="Choose Input Source"
	description="Select your seed source to generate wallets"
>
	<div class="feature-highlights">
		<ul class="feature-list">
			<li>
				<span class="feature-icon">🔑</span>
				<span>Support mnemonic phrases (BIP39)</span>
			</li>
			<li>
				<span class="feature-icon">📊</span>
				<span>Generate from xpub keys</span>
			</li>
			<li>
				<span class="feature-icon">🔐</span>
				<span>Create from secret text (SHA256)</span>
			</li>
		</ul>
	</div>

	<div class="security-note">
		<span class="security-icon">⚠️</span>
		<p>
			Keep your mnemonic and private keys secure. Never share them with anyone or enter them on
			untrusted websites.
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
		background: hsla(45, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(45, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .security-note {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 30%, 1);
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

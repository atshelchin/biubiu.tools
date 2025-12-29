<script lang="ts">
	/**
	 * Call Master Step 1: Connect Wallet Sidebar
	 * Uses shared ConnectWalletSidebar component with custom help content
	 */
	import { ConnectWalletSidebar } from '$lib/components/step/connect-wallet';
</script>

<ConnectWalletSidebar i18nPrefix="call-master">
	<div class="feature-highlights">
		<ul class="feature-list">
			<li>
				<span class="feature-icon">📜</span>
				<span>Execute any smart contract function</span>
			</li>
			<li>
				<span class="feature-icon">📖</span>
				<span>Read contract state (free)</span>
			</li>
			<li>
				<span class="feature-icon">✏️</span>
				<span>Write transactions with gas estimation</span>
			</li>
			<li>
				<span class="feature-icon">📦</span>
				<span>Batch multiple calls together</span>
			</li>
		</ul>
	</div>

	<div class="info-note">
		<span class="info-icon">💡</span>
		<p>Load your contract ABI to interact with any verified or custom contract.</p>
	</div>
</ConnectWalletSidebar>

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
		border-color: hsla(210, 100%, 30%, 1);
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

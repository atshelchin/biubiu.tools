<script lang="ts">
	interface Props {
		section: 'sidebar' | 'footer' | 'content';
	}

	let { section }: Props = $props();
</script>

{#if section === 'sidebar'}
	<div class="step-sidebar">
		<h3>Step 2: Configure</h3>
		<p>Set up your sweep preferences</p>
		<div class="config-options">
			<div class="option-item">
				<span class="option-label">Addresses:</span>
				<span class="option-value">0</span>
			</div>
			<div class="option-item">
				<span class="option-label">Total Value:</span>
				<span class="option-value">$0.00</span>
			</div>
		</div>
	</div>
{:else if section === 'footer'}
	<div class="step-footer">
		<button class="action-btn">Import Addresses</button>
		<button class="action-btn secondary">Clear All</button>
	</div>
{:else if section === 'content'}
	<div class="step-content">
		<h2>Configure Token Sweep</h2>
		<p>Import addresses and configure your sweep settings.</p>

		<div class="config-section">
			<h3>Import Addresses</h3>
			<textarea placeholder="Paste addresses here, one per line" rows="10"></textarea>
		</div>

		<div class="config-section">
			<h3>Select Tokens</h3>
			<p>Choose which tokens to sweep from the addresses</p>
		</div>
	</div>
{/if}

<style>
	.step-sidebar,
	.step-footer,
	.step-content {
		padding: var(--space-4);
	}

	h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-3);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h2 {
		color: var(--gray-100);
	}

	h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-200);
	}

	p {
		color: var(--gray-600);
		line-height: 1.6;
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}

	.config-options {
		margin-top: var(--space-3);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.option-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2);
		background: var(--gray-50);
		border-radius: var(--radius-sm);
	}

	:global([data-theme='dark']) .option-item {
		background: var(--gray-800);
	}

	.option-label {
		font-size: var(--text-sm);
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .option-label {
		color: var(--gray-400);
	}

	.option-value {
		font-size: var(--text-sm);
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .option-value {
		color: var(--gray-100);
	}

	.step-footer {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.action-btn {
		flex: 1;
		min-width: 120px;
		padding: var(--space-2) var(--space-4);
		background: linear-gradient(135deg, #60a5fa, #3b82f6);
		border: none;
		border-radius: var(--radius-sm);
		color: white;
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-btn:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}

	.action-btn.secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .action-btn.secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.action-btn.secondary:hover {
		background: var(--gray-300);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .action-btn.secondary:hover {
		background: var(--gray-600);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
	}

	.config-section {
		margin-bottom: var(--space-6);
	}

	textarea {
		width: 100%;
		padding: var(--space-3);
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-md);
		font-family: monospace;
		font-size: var(--text-sm);
		color: var(--gray-900);
		background: var(--white);
		resize: vertical;
	}

	:global([data-theme='dark']) textarea {
		background: var(--gray-800);
		border-color: var(--gray-600);
		color: var(--gray-100);
	}

	textarea:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}
</style>

<script lang="ts">
	interface Props {
		section: 'sidebar' | 'footer' | 'content';
	}

	let { section }: Props = $props();
</script>

{#if section === 'sidebar'}
	<div class="step-sidebar">
		<h3>Step 3: Complete</h3>
		<p>Review and execute your sweep</p>

		<div class="summary">
			<h4>Transaction Summary</h4>
			<div class="summary-item">
				<span>Addresses:</span>
				<strong>0</strong>
			</div>
			<div class="summary-item">
				<span>Total Value:</span>
				<strong>$0.00</strong>
			</div>
			<div class="summary-item">
				<span>Estimated Gas:</span>
				<strong>~0.001 ETH</strong>
			</div>
		</div>
	</div>
{:else if section === 'footer'}
	<div class="step-footer">
		<button class="action-btn primary">Execute Sweep</button>
		<button class="action-btn secondary">Download Report</button>
	</div>
{:else if section === 'content'}
	<div class="step-content">
		<h2>Review & Execute</h2>
		<p>Review your sweep configuration and execute the transaction.</p>

		<div class="review-section">
			<h3>Transaction Details</h3>
			<div class="detail-grid">
				<div class="detail-item">
					<span class="detail-label">Source Addresses</span>
					<span class="detail-value">0 addresses</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">Destination</span>
					<span class="detail-value">Not set</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">Network</span>
					<span class="detail-value">Ethereum Mainnet</span>
				</div>
				<div class="detail-item">
					<span class="detail-label">Status</span>
					<span class="detail-value status-pending">Pending</span>
				</div>
			</div>
		</div>

		<div class="review-section">
			<h3>Transaction Preview</h3>
			<div class="preview-box">
				<p class="preview-message">No addresses configured</p>
			</div>
		</div>
	</div>
{/if}

<style>
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
		margin-bottom: var(--space-3);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-200);
	}

	h4 {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		margin-bottom: var(--space-2);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) h4 {
		color: var(--gray-300);
	}

	p {
		color: var(--gray-600);
		line-height: 1.6;
		margin-bottom: var(--space-4);
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}

	.summary {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--gray-50);
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
	}

	:global([data-theme='dark']) .summary {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.summary-item {
		display: flex;
		justify-content: space-between;
		padding: var(--space-2) 0;
		border-bottom: 1px solid var(--gray-200);
	}

	:global([data-theme='dark']) .summary-item {
		border-bottom-color: var(--gray-700);
	}

	.summary-item:last-child {
		border-bottom: none;
	}

	.summary-item span {
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .summary-item span {
		color: var(--gray-400);
	}

	.summary-item strong {
		font-size: var(--text-sm);
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .summary-item strong {
		color: var(--gray-100);
	}

	.step-footer {
		display: flex;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.action-btn {
		flex: 1;
		min-width: 140px;
		padding: var(--space-3) var(--space-4);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-semibold);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
	}

	.action-btn.primary {
		background: linear-gradient(135deg, #10b981, #059669);
		color: white;
		box-shadow: 0 2px 8px rgba(16, 185, 129, 0.2);
	}

	.action-btn.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
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

	.review-section {
		margin-bottom: var(--space-6);
	}

	.detail-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: var(--space-4);
	}

	.detail-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-3);
		background: var(--gray-50);
		border-radius: var(--radius-md);
		border: 1px solid var(--gray-200);
	}

	:global([data-theme='dark']) .detail-item {
		background: var(--gray-800);
		border-color: var(--gray-700);
	}

	.detail-label {
		font-size: var(--text-xs);
		color: var(--gray-500);
		font-weight: var(--font-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	:global([data-theme='dark']) .detail-label {
		color: var(--gray-500);
	}

	.detail-value {
		font-size: var(--text-sm);
		color: var(--gray-900);
		font-weight: var(--font-semibold);
	}

	:global([data-theme='dark']) .detail-value {
		color: var(--gray-100);
	}

	.status-pending {
		color: #f59e0b;
	}

	.preview-box {
		padding: var(--space-4);
		background: var(--gray-50);
		border: 2px dashed var(--gray-300);
		border-radius: var(--radius-md);
		min-height: 200px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global([data-theme='dark']) .preview-box {
		background: var(--gray-800);
		border-color: var(--gray-600);
	}

	.preview-message {
		color: var(--gray-400);
		font-style: italic;
		margin: 0;
	}

	:global([data-theme='dark']) .preview-message {
		color: var(--gray-500);
	}
</style>

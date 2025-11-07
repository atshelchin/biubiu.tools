<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={5}
	title="View Results"
	description="Explore and export your scanned events"
>
	<div class="features-section">
		<h4>Available Features:</h4>
		<ul>
			<li>View all scanned events in a table</li>
			<li>Filter events by content</li>
			<li>Sort by block number or timestamp</li>
			<li>Paginate through large result sets</li>
			<li>Export to CSV or JSON format</li>
		</ul>
	</div>

	<div class="export-section">
		<h4>Export Options:</h4>
		<ul>
			<li>
				<strong>CSV:</strong> Import into Excel or Google Sheets
			</li>
			<li>
				<strong>JSON:</strong> Use in your applications
			</li>
		</ul>
	</div>

	<div class="tip-box">
		<span class="tip-icon">💡</span>
		<p>Events are saved in your browser. You can return to this page anytime to view them again.</p>
	</div>
</StepSidebar>

<style>
	.features-section,
	.export-section {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.tip-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(210, 100%, 98%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(210, 100%, 85%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .tip-box {
		background: hsla(210, 100%, 15%, 0.3);
		border-color: hsla(210, 100%, 25%, 1);
	}

	.tip-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) h4 {
		color: var(--gray-200);
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	li {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
		padding-left: var(--space-4);
		position: relative;
	}

	:global([data-theme='dark']) li {
		color: var(--gray-300);
	}

	li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--color-primary);
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

<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar stepNumber={3} title="Set Time Range" description="Define the range of events to scan">
	<div class="options-section">
		<h4>Choose Your Range:</h4>
		<ul>
			<li>
				<strong>Date Range:</strong> Select start and end dates
			</li>
			<li>
				<strong>Block Range:</strong> Specify exact block numbers
			</li>
		</ul>
	</div>

	<div class="info-box">
		<h4>Performance Tips:</h4>
		<ul>
			<li>Smaller ranges scan faster</li>
			<li>Large ranges may take several minutes</li>
			<li>Block ranges are more precise</li>
			<li>Date ranges are approximate</li>
		</ul>
	</div>

	<div class="warning-box">
		<span class="warning-icon">⚠️</span>
		<p>
			Scanning very large ranges (years of data) may take a long time and consume significant
			resources.
		</p>
	</div>
</StepSidebar>

<style>
	.options-section {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.info-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(210, 100%, 98%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(210, 100%, 85%, 1);
	}

	:global([data-theme='dark']) .info-box {
		background: hsla(210, 100%, 15%, 0.3);
		border-color: hsla(210, 100%, 25%, 1);
	}

	.warning-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(30, 100%, 98%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(30, 100%, 85%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .warning-box {
		background: hsla(30, 100%, 15%, 0.3);
		border-color: hsla(30, 100%, 25%, 1);
	}

	.warning-icon {
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

	.warning-box p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .warning-box p {
		color: var(--gray-300);
	}
</style>

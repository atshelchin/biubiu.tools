<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={4}
	title="Scan Events"
	description="Execute the event scan and track progress"
>
	<div class="info-section">
		<h4>What Happens During Scan:</h4>
		<ul>
			<li>Events are fetched in batches of 1000 blocks</li>
			<li>Each event is decoded using the ABI</li>
			<li>Events are stored in IndexedDB</li>
			<li>Progress is tracked in real-time</li>
		</ul>
	</div>

	<div class="performance-section">
		<h4>Performance:</h4>
		<ul>
			<li>Typical scan: 100-1000 blocks/second</li>
			<li>Network speed affects performance</li>
			<li>You can cancel anytime</li>
		</ul>
	</div>

	<div class="tip-box">
		<span class="tip-icon">💾</span>
		<p>
			Events are saved to your browser's IndexedDB. You can close the page and return to view
			results later.
		</p>
	</div>
</StepSidebar>

<style>
	.info-section,
	.performance-section {
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

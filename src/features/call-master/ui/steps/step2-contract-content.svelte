<script lang="ts">
	/**
	 * Call Master Step 2: Configure Contract Content
	 * Placeholder for contract configuration UI
	 */
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { ConstructionIcon } from '@lucide/svelte';
</script>

<div class="step-content">
	<StepContentHeader
		title="Configure Contract"
		description="Enter the contract address and load the ABI"
	/>

	<div class="coming-soon-container">
		<div class="coming-soon-card">
			<ConstructionIcon size={48} strokeWidth={1.5} />
			<h3>Coming Soon</h3>
			<p>
				Contract configuration UI is under development. Soon you'll be able to load ABIs and
				configure function calls.
			</p>

			<div class="planned-features">
				<h4>Planned Features:</h4>
				<ul>
					<li>Auto-fetch ABI from verified contracts</li>
					<li>Paste or upload custom ABI JSON</li>
					<li>Function selector with parameter inputs</li>
					<li>Value input for payable functions</li>
					<li>Gas estimation and customization</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.step-content {
		max-width: 800px;
		margin: 0 auto;
	}

	.coming-soon-container {
		display: flex;
		justify-content: center;
		padding: var(--space-8) 0;
	}

	.coming-soon-card {
		text-align: center;
		padding: var(--space-8);
		background: var(--color-panel-1);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
		max-width: 500px;
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .coming-soon-card {
		color: var(--gray-400);
	}

	.coming-soon-card h3 {
		margin: var(--space-4) 0 var(--space-2);
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
	}

	:global([data-theme='dark']) .coming-soon-card h3 {
		color: var(--gray-200);
	}

	.coming-soon-card p {
		margin: 0;
		font-size: var(--text-sm);
		line-height: 1.6;
	}

	.planned-features {
		margin-top: var(--space-6);
		text-align: left;
		padding: var(--space-4);
		background: var(--color-panel-2);
		border-radius: var(--radius-md);
	}

	.planned-features h4 {
		margin: 0 0 var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .planned-features h4 {
		color: var(--gray-300);
	}

	.planned-features ul {
		margin: 0;
		padding-left: var(--space-5);
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .planned-features ul {
		color: var(--gray-400);
	}

	.planned-features li {
		margin-bottom: var(--space-1);
	}
</style>

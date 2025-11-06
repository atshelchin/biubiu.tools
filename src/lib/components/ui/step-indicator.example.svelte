<script lang="ts">
	import StepIndicator, { createStepManager } from './step-indicator.svelte';
	import StepControls from './step-controls.svelte';

	// 创建横向步骤管理器（3 步）
	const horizontalManager = createStepManager(
		[
			{ label: 'Connect Wallet', description: 'Link your Web3 wallet' },
			{ label: 'Configure', description: 'Set up your preferences' },
			{ label: 'Complete', description: 'Finish setup' }
		],
		2
	);

	// 创建纵向步骤管理器（6 步）
	const verticalManager = createStepManager(
		[
			{ label: 'Import Addresses', description: 'Upload CSV or paste addresses' },
			{ label: 'Select Tokens', description: 'Choose tokens to sweep' },
			{ label: 'Set Destination', description: 'Enter target wallet address' },
			{ label: 'Review', description: 'Confirm transaction details' },
			{ label: 'Execute', description: 'Sign and broadcast transaction' },
			{ label: 'Complete', description: 'Transaction completed' }
		],
		3
	);
</script>

<div class="demo-container">
	<div class="demo-section">
		<h2>Horizontal Layout (≤3 steps)</h2>
		<StepIndicator manager={horizontalManager} />
		<StepControls manager={horizontalManager} />
	</div>

	<div class="demo-section">
		<h2>Vertical Layout (>3 steps)</h2>
		<StepIndicator manager={verticalManager} />
		<StepControls manager={verticalManager} />
	</div>
</div>

<style>
	.demo-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-8);
		/* padding: var(--space-6); */
		max-width: 1200px;
		margin: 0 auto;
	}

	.demo-section {
		background: var(--color-card);
		padding: var(--space-6);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	h2 {
		font-size: var(--text-xl);
		font-weight: var(--font-bold);
		margin-bottom: var(--space-6);
		color: var(--color-foreground);
	}

	.demo-section :global(.step-controls) {
		margin-top: var(--space-6);
	}
</style>

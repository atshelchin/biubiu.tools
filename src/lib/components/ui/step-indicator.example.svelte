<script lang="ts">
	import StepIndicator from './step-indicator.svelte';

	let currentStep = $state(2);

	// 少于 3 步的示例（横向）
	const horizontalSteps = [
		{ label: 'Connect Wallet', description: 'Link your Web3 wallet' },
		{ label: 'Configure', description: 'Set up your preferences' },
		{ label: 'Complete', description: 'Finish setup' }
	];

	// 多于 3 步的示例（纵向）
	const verticalSteps = [
		{ label: 'Import Addresses', description: 'Upload CSV or paste addresses' },
		{ label: 'Select Tokens', description: 'Choose tokens to sweep' },
		{ label: 'Set Destination', description: 'Enter target wallet address' },
		{ label: 'Review', description: 'Confirm transaction details' },
		{ label: 'Execute', description: 'Sign and broadcast transaction' },
		{ label: 'Complete', description: 'Transaction completed' }
	];

	let demoStep = $state(3);
</script>

<div class="demo-container">
	<div class="demo-section">
		<h2>Horizontal Layout (≤3 steps)</h2>
		<StepIndicator steps={horizontalSteps} {currentStep} />

		<div class="controls">
			<button onclick={() => (currentStep = Math.max(1, currentStep - 1))}>Previous</button>
			<button onclick={() => (currentStep = Math.min(horizontalSteps.length, currentStep + 1))}
				>Next</button
			>
		</div>
	</div>

	<div class="demo-section">
		<h2>Vertical Layout (>3 steps)</h2>
		<StepIndicator steps={verticalSteps} currentStep={demoStep} />

		<div class="controls">
			<button onclick={() => (demoStep = Math.max(1, demoStep - 1))}>Previous</button>
			<button onclick={() => (demoStep = Math.min(verticalSteps.length, demoStep + 1))}>Next</button
			>
		</div>
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

	.controls {
		display: flex;
		gap: var(--space-3);
		margin-top: var(--space-6);
		justify-content: center;
	}

	button {
		padding: var(--space-2) var(--space-4);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		transition: all 0.2s;
	}

	button:hover {
		background: var(--color-secondary);
		transform: translateY(-1px);
	}
</style>

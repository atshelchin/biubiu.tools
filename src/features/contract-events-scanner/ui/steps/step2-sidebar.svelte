<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={2}
	title="Configure Contract"
	description="Specify the smart contract and event to scan"
>
	<div class="checklist">
		<h4>Configuration Steps:</h4>
		<ul>
			<li>Enter the contract address</li>
			<li>Paste the contract ABI (JSON format)</li>
			<li>Select the event you want to scan</li>
		</ul>
	</div>

	<div class="info-box">
		<h4>Where to find the ABI?</h4>
		<ul>
			<li>Etherscan: Contract > Code tab</li>
			<li>Your project's build artifacts</li>
			<li>Contract deployment records</li>
		</ul>
	</div>

	<div class="tip-box">
		<span class="tip-icon">💡</span>
		<p>The ABI must be in JSON array format and contain at least one event definition.</p>
	</div>
</StepSidebar>

<style>
	.checklist {
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

	.tip-box {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(45, 100%, 98%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(45, 100%, 85%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .tip-box {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsla(45, 100%, 25%, 1);
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

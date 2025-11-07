<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
</script>

<StepSidebar
	stepNumber={2}
	title="Enter Token Address"
	description="Input and validate token contract"
>
	<div class="instructions">
		<h4 class="instructions-title">How to find token address:</h4>
		<ol class="instructions-list">
			<li>
				Go to your token page on DEXScreener or your blockchain explorer (Etherscan, BSCScan, etc.)
			</li>
			<li>Copy the contract address (starts with 0x...)</li>
			<li>Paste it in the input field</li>
			<li>Click "Validate Token" to verify</li>
		</ol>
	</div>

	<div class="warning-note">
		<span class="warning-icon">⚠️</span>
		<p>
			Always verify the contract address carefully. Trading with the wrong address can result in
			loss of funds.
		</p>
	</div>
</StepSidebar>

<style>
	/* Instructions */
	.instructions {
		margin: var(--space-4) 0;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.instructions-title {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
		margin: 0 0 var(--space-2) 0;
	}

	:global([data-theme='dark']) .instructions-title {
		color: var(--gray-200);
	}

	.instructions-list {
		margin: 0;
		padding-left: var(--space-4);
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.instructions-list li {
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .instructions-list li {
		color: var(--gray-300);
	}

	/* Warning Note */
	.warning-note {
		margin-top: var(--space-4);
		padding: var(--space-3);
		background: hsla(40, 100%, 95%, 1);
		border-radius: var(--radius-md);
		border: 1px solid hsla(40, 100%, 80%, 1);
		display: flex;
		gap: var(--space-2);
		align-items: flex-start;
	}

	:global([data-theme='dark']) .warning-note {
		background: hsla(40, 100%, 15%, 0.3);
		border-color: hsla(40, 100%, 25%, 1);
	}

	.warning-icon {
		font-size: var(--text-xl);
		flex-shrink: 0;
		line-height: 1;
	}

	.warning-note p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-700);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .warning-note p {
		color: var(--gray-300);
	}
</style>

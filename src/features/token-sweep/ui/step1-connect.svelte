<script lang="ts">
	interface Props {
		section: 'sidebar' | 'footer' | 'content';
	}

	let { section }: Props = $props();
</script>

{#if section === 'sidebar'}
	<div class="step-sidebar">
		<h3>Step 1: Connect Wallet</h3>
		<p>Connect your Web3 wallet to continue</p>
	</div>
{:else if section === 'footer'}
	<div class="step-footer">
		<p>Footer for Step 1</p>
	</div>
{:else if section === 'content'}
	<div class="step-content">
		<h2>Connect Your Wallet</h2>
		<p>Please connect your wallet to get started with token sweeping.</p>
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
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}
</style>

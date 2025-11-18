<script lang="ts">
	import { XCircle, AlertCircle } from '@lucide/svelte';
	import DeploymentSteps from './deployment-steps.svelte';

	interface Props {
		/** Error message to display */
		errorMessage?: string;
		/** Whether to show MetaMask cache clearing guide */
		showClearCacheGuide?: boolean;
		/** Error title */
		title?: string;
		/** Retry button handler */
		onRetry?: () => void;
	}

	let {
		errorMessage,
		showClearCacheGuide = false,
		title = 'Deployment Failed',
		onRetry
	}: Props = $props();

	const clearCacheSteps = [
		{
			title: 'Open MetaMask Settings',
			description: 'Click the menu icon → Settings'
		},
		{
			title: 'Go to Advanced Settings',
			description: 'Navigate to: Advanced'
		},
		{
			title: 'Clear Activity Tab Data',
			description: 'Click "Clear activity tab data" and confirm'
		}
	];
</script>

<div class="error-section">
	<XCircle size={64} />
	<h3>{title}</h3>
	{#if errorMessage}
		<p class="error-message">{errorMessage}</p>
	{/if}

	{#if showClearCacheGuide}
		<div class="clear-cache-guide">
			<div class="guide-header">
				<AlertCircle size={20} />
				<h4>Clear MetaMask Cache</h4>
			</div>
			<p class="guide-description">Follow these steps to clear cached data:</p>
			<DeploymentSteps steps={clearCacheSteps} heading="" />
		</div>
	{/if}

	{#if onRetry}
		<button class="retry-button" onclick={onRetry}>Try Again</button>
	{/if}
</div>

<style>
	.error-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		align-items: center;
		text-align: center;
		animation: fadeInUp 0.4s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.error-section :global(svg:first-child) {
		color: hsl(0, 70%, 55%);
		filter: drop-shadow(0 0 12px hsla(0, 70%, 50%, 0.5));
	}

	h3 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0;
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-100);
	}

	.error-message {
		color: hsl(0, 80%, 50%);
		line-height: 1.8;
		white-space: pre-line;
		text-align: left;
		max-width: 100%;
		margin: 0;
	}

	:global([data-theme='dark']) .error-message {
		color: hsl(0, 80%, 70%);
	}

	.clear-cache-guide {
		width: 100%;
		padding: var(--space-4);
		background: hsla(45, 100%, 95%, 1);
		border: 2px solid hsl(45, 100%, 50%);
		border-radius: var(--radius-lg);
		text-align: left;
	}

	:global([data-theme='dark']) .clear-cache-guide {
		background: hsla(45, 100%, 15%, 0.5);
		border-color: hsl(45, 100%, 40%);
	}

	.guide-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		color: hsl(45, 100%, 30%);
	}

	:global([data-theme='dark']) .guide-header {
		color: hsl(45, 100%, 70%);
	}

	.guide-header h4 {
		margin: 0;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
	}

	.guide-description {
		margin: 0 0 var(--space-3) 0;
		color: hsl(45, 100%, 25%);
		font-size: var(--text-sm);
	}

	:global([data-theme='dark']) .guide-description {
		color: hsl(45, 100%, 75%);
	}

	.retry-button {
		width: 100%;
		padding: var(--space-4) var(--space-5);
		border-radius: var(--radius-lg);
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		border: 1px solid var(--color-border);
		background: var(--gray-200);
		color: var(--gray-700);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	:global([data-theme='dark']) .retry-button {
		background: var(--gray-800);
		color: var(--gray-200);
		border-color: var(--gray-700);
	}

	.retry-button:hover:not(:disabled) {
		background: var(--gray-300);
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .retry-button:hover:not(:disabled) {
		background: var(--gray-700);
	}

	.retry-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.error-section {
			gap: var(--space-4);
		}

		.error-section :global(svg:first-child) {
			width: 48px;
			height: 48px;
		}

		h3 {
			font-size: var(--text-xl);
		}

		.error-message {
			font-size: var(--text-sm);
		}

		.clear-cache-guide {
			padding: var(--space-3);
		}

		.guide-header h4 {
			font-size: var(--text-sm);
		}

		.guide-description {
			font-size: 12px;
		}

		.retry-button {
			padding: var(--space-3) var(--space-4);
			font-size: var(--text-base);
		}
	}
</style>

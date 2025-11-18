<script lang="ts">
	import { CheckCircle2, Loader2 } from '@lucide/svelte';

	interface Step {
		title: string;
		description: string;
		completed: boolean;
		inProgress: boolean;
	}

	interface Props {
		/** Array of deployment steps with progress state */
		steps: Step[];
		/** Current deployment status */
		isWaitingForSignature?: boolean;
		/** Main title */
		title?: string;
		/** Status messages */
		messages?: {
			waitingForSignature: string;
			transactionSent: string;
			finalizing: string;
			confirmInWallet: string;
		};
	}

	let {
		steps,
		isWaitingForSignature = false,
		title = 'Deploying Contract...',
		messages = {
			waitingForSignature: '⏳ Please confirm transaction in your wallet...',
			transactionSent: '⚡ Transaction sent! Waiting for blockchain confirmation...',
			finalizing: '✅ Finalizing deployment...',
			confirmInWallet: 'Please confirm transactions in your wallet'
		}
	}: Props = $props();

	const hasInProgress = $derived(steps.some((s) => s.inProgress));
	const allCompleted = $derived(steps.every((s) => s.completed));
</script>

<div class="deploying-section">
	<Loader2 size={48} class="spinning" />
	<h3>{title}</h3>
	{#if isWaitingForSignature}
		<p class="status-text waiting">{messages.waitingForSignature}</p>
	{:else if hasInProgress}
		<p class="status-text processing">{messages.transactionSent}</p>
	{:else if allCompleted}
		<p class="status-text success">{messages.finalizing}</p>
	{:else}
		<p class="status-text">{messages.confirmInWallet}</p>
	{/if}

	{#if steps.length > 0}
		<div class="step-progress">
			{#each steps as step, index (step.title)}
				<div class="step-item" class:completed={step.completed} class:in-progress={step.inProgress}>
					<div class="step-marker">
						{#if step.completed}
							<CheckCircle2 size={20} />
						{:else if step.inProgress}
							<Loader2 size={20} class="spinning" />
						{:else}
							{index + 1}
						{/if}
					</div>
					<div class="step-info">
						<strong>{step.title}</strong>
						<p>{step.description}</p>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.deploying-section {
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

	.deploying-section :global(.spinning) {
		color: hsl(220, 70%, 55%);
		filter: drop-shadow(0 0 8px hsla(220, 70%, 55%, 0.5));
	}

	h3 {
		background: linear-gradient(135deg, hsl(220, 70%, 55%) 0%, hsl(250, 70%, 60%) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0;
	}

	.status-text {
		margin: var(--space-2) 0;
		line-height: 1.6;
	}

	.status-text.waiting {
		color: hsl(45, 100%, 40%);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .status-text.waiting {
		color: hsl(45, 100%, 70%);
	}

	.status-text.processing {
		color: hsl(210, 100%, 45%);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .status-text.processing {
		color: hsl(210, 100%, 70%);
	}

	.status-text.success {
		color: hsl(120, 60%, 40%);
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .status-text.success {
		color: hsl(120, 60%, 65%);
	}

	.step-progress {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		background: var(--color-panel-2);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .step-progress {
		background: rgba(255, 255, 255, 0.02);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.step-item {
		display: flex;
		gap: var(--space-3);
		align-items: flex-start;
		padding: var(--space-3);
		border-radius: var(--radius-md);
		background: rgba(0, 0, 0, 0.02);
		transition: all 0.3s ease;
		opacity: 0.6;
	}

	:global([data-theme='dark']) .step-item {
		background: rgba(255, 255, 255, 0.02);
	}

	.step-item.in-progress {
		opacity: 1;
		background: hsla(220, 70%, 55%, 0.1);
		border: 2px solid hsla(220, 70%, 55%, 0.3);
	}

	.step-item.completed {
		opacity: 1;
		background: hsla(120, 60%, 50%, 0.1);
		animation: stepComplete 0.5s ease-out;
	}

	@keyframes stepComplete {
		0% {
			transform: scale(0.95);
		}
		50% {
			transform: scale(1.02);
		}
		100% {
			transform: scale(1);
		}
	}

	.step-marker {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--gray-300);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: var(--font-bold);
		flex-shrink: 0;
		font-size: var(--text-lg);
		transition: all 0.3s ease;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	:global([data-theme='dark']) .step-marker {
		background: var(--gray-700);
	}

	.step-item.in-progress .step-marker {
		background: white;
		color: hsl(220, 70%, 55%);
		border: 2px solid hsl(220, 70%, 55%);
		box-shadow: 0 4px 12px hsla(220, 70%, 55%, 0.3);
	}

	:global([data-theme='dark']) .step-item.in-progress .step-marker {
		background: var(--gray-900);
		color: hsl(220, 70%, 60%);
		border-color: hsl(220, 70%, 60%);
	}

	.step-item.completed .step-marker {
		background: linear-gradient(135deg, hsl(120, 60%, 50%) 0%, hsl(120, 60%, 40%) 100%);
		color: white;
		box-shadow: 0 4px 12px hsla(120, 60%, 50%, 0.4);
		animation: pulse 0.5s ease-out;
	}

	@keyframes pulse {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.1);
		}
		100% {
			transform: scale(1);
		}
	}

	.step-info {
		flex: 1;
		text-align: left;
	}

	.step-info strong {
		display: block;
		margin-bottom: var(--space-1);
	}

	.step-info p {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .step-info p {
		color: var(--gray-400);
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	/* Mobile responsive */
	@media (max-width: 640px) {
		.deploying-section {
			gap: var(--space-4);
		}

		.deploying-section :global(svg:first-child) {
			width: 40px;
			height: 40px;
		}

		h3 {
			font-size: var(--text-xl);
		}

		.status-text {
			font-size: var(--text-sm);
		}

		.step-progress {
			padding: var(--space-3);
			gap: var(--space-2);
		}

		.step-item {
			padding: var(--space-2);
		}

		.step-marker {
			width: 32px;
			height: 32px;
			font-size: var(--text-base);
		}

		.step-info strong {
			font-size: var(--text-sm);
		}

		.step-info p {
			font-size: 12px;
		}
	}
</style>

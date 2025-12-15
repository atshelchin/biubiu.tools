<script lang="ts">
	import { CheckCircle2, AlertCircle, RefreshCw } from '@lucide/svelte';

	interface Props {
		variant: 'success' | 'error';
		title: string;
		message: string;
		retryText?: string;
		onRetry?: () => void;
	}

	let { variant, title, message, retryText, onRetry }: Props = $props();
</script>

<div class="summary-container">
	<!-- <div class="banner" class:success={variant === 'success'} class:error={variant === 'error'}>
		{#if variant === 'success'}
			<CheckCircle2 size={32} />
		{:else}
			<AlertCircle size={32} />
		{/if}
		<div>
			<h3>{title}</h3>
			<p>{message}</p>
		</div>
	</div> -->

	{#if onRetry && retryText}
		<button class="retry-button" onclick={onRetry}>
			<RefreshCw size={18} />
			{retryText}
		</button>
	{/if}
</div>

<style>
	.summary-container {
		margin-top: var(--space-6);
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.banner {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		align-items: center;
	}

	.banner.success {
		background: hsla(120, 60%, 95%, 1);
		border: 2px solid hsl(120, 60%, 60%);
		color: hsl(120, 60%, 30%);
	}

	:global([data-theme='dark']) .banner.success {
		background: hsla(120, 60%, 15%, 0.5);
		border-color: hsl(120, 60%, 40%);
		color: hsl(120, 60%, 70%);
	}

	.banner.error {
		background: hsla(0, 80%, 95%, 1);
		border: 2px solid hsl(0, 80%, 60%);
		color: hsl(0, 80%, 30%);
	}

	:global([data-theme='dark']) .banner.error {
		background: hsla(0, 80%, 15%, 0.5);
		border-color: hsl(0, 80%, 40%);
		color: hsl(0, 80%, 70%);
	}

	.banner h3 {
		margin: 0 0 var(--space-1) 0;
		font-size: var(--text-lg);
	}

	.banner p {
		margin: 0;
		font-size: var(--text-sm);
		opacity: 0.9;
	}

	.retry-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--gray-200);
		color: var(--gray-700);
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
	}

	:global([data-theme='dark']) .retry-button {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.retry-button:hover {
		background: var(--gray-300);
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .retry-button:hover {
		background: var(--gray-600);
	}
</style>

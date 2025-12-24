<script lang="ts">
	import { slide } from 'svelte/transition';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		message: string;
		hint?: string;
		primaryButtonText?: string;
		secondaryButtonText?: string;
		onPrimaryClick?: () => void;
		onSecondaryClick?: () => void;
		recommend?: Snippet;
	}

	let {
		title,
		message,
		hint,
		primaryButtonText,
		secondaryButtonText,
		onPrimaryClick,
		onSecondaryClick,
		recommend
	}: Props = $props();
</script>

<div class="rate-limit-banner" transition:slide>
	<!-- <div class="banner-icon">⚠️</div> -->
	<div class="banner-content">
		<div class="banner-title">{title}</div>
		<div class="banner-message">{message}</div>
		{#if hint}
			<div class="banner-hint">{hint}</div>
		{/if}
		{#if recommend}
			<div class="banner-recommend">
				{@render recommend()}
			</div>
		{/if}
	</div>
	{#if onPrimaryClick || onSecondaryClick}
		<div class="banner-actions">
			{#if onPrimaryClick && primaryButtonText}
				<button class="btn-primary" onclick={onPrimaryClick}>
					{primaryButtonText}
				</button>
			{/if}
			{#if onSecondaryClick && secondaryButtonText}
				<button class="btn-secondary" onclick={onSecondaryClick}>
					{secondaryButtonText}
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.rate-limit-banner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background: linear-gradient(135deg, #fff7ed, #ffedd5);
		border: 2px solid #fb923c;
		border-radius: var(--radius-md);
		margin-bottom: var(--space-4);
		box-shadow: 0 2px 8px rgba(251, 146, 60, 0.1);
	}

	:global([data-theme='dark']) .rate-limit-banner {
		background: linear-gradient(135deg, #431407, #7c2d12);
		border-color: #ea580c;
	}

	.banner-content {
		flex: 1;
	}

	.banner-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: #c2410c;
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .banner-title {
		color: #fb923c;
	}

	.banner-message {
		font-size: var(--text-sm);
		color: #9a3412;
		margin-bottom: var(--space-2);
		line-height: 1.5;
	}

	:global([data-theme='dark']) .banner-message {
		color: #fdba74;
	}

	.banner-hint {
		font-size: var(--text-sm);
		color: #c2410c;
		padding: var(--space-2);
		background: rgba(255, 255, 255, 0.5);
		border-radius: var(--radius-sm);
		border-left: 3px solid #fb923c;
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .banner-hint {
		color: #fed7aa;
		background: rgba(0, 0, 0, 0.2);
	}

	.banner-recommend {
		font-size: var(--text-sm);
		color: #0369a1;
		padding: var(--space-2);
		background: rgba(240, 249, 255, 0.8);
		border-radius: var(--radius-sm);
		border-left: 3px solid #38bdf8;
		margin-bottom: var(--space-3);
		display: flex;
		align-items: center;
		gap: var(--space-1);
		flex-wrap: wrap;
	}

	:global([data-theme='dark']) .banner-recommend {
		color: #bae6fd;
		background: rgba(7, 89, 133, 0.2);
	}

	.banner-recommend :global(a) {
		color: #0284c7;
		font-weight: 600;
		text-decoration: none;
		border-bottom: 1px solid transparent;
		transition: all 0.2s ease;
		display: inline-flex;
		align-items: center;
		gap: 2px;
	}

	.banner-recommend :global(a:hover) {
		color: #0369a1;
		border-bottom-color: #0369a1;
	}

	:global([data-theme='dark']) .banner-recommend :global(a) {
		color: #38bdf8;
	}

	:global([data-theme='dark']) .banner-recommend :global(a:hover) {
		color: #7dd3fc;
		border-bottom-color: #7dd3fc;
	}

	.banner-actions {
		display: flex;
		gap: var(--space-2);
		flex-shrink: 0;
		width: 100%;
	}

	.btn-primary {
		padding: var(--space-2) var(--space-4);
		background: linear-gradient(135deg, #3b82f6, #2563eb);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
		flex: auto;
	}

	.btn-primary:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
	}

	.btn-secondary {
		padding: var(--space-2) var(--space-4);
		background: linear-gradient(135deg, #fb923c, #f97316);
		color: white;
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.btn-secondary:hover {
		transform: translateY(-1px);
		box-shadow: 0 2px 8px rgba(249, 115, 22, 0.3);
	}
</style>

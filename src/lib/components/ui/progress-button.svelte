<script lang="ts">
	import { Loader2 } from '@lucide/svelte';
	import { slide } from 'svelte/transition';

	interface Props {
		/** Button text when idle */
		label: string;
		/** Button text when loading (with progress) */
		loadingLabel: string;
		/** Whether the button is in loading state */
		isLoading: boolean;
		/** Whether the button is disabled */
		disabled?: boolean;
		/** Click handler */
		onclick: () => void;
	}

	let { label, loadingLabel, isLoading, disabled = false, onclick }: Props = $props();

	const isDisabled = $derived(disabled || isLoading);
</script>

<button
	class="btn-primary btn-with-progress"
	{onclick}
	disabled={isDisabled}
	transition:slide={{ duration: 200 }}
>
	{#if isLoading}
		<Loader2 size={18} class="spinning" />
		{loadingLabel}
		<!-- <div class="btn-progress-bar" style="width: {progress}%"></div> -->
	{:else}
		{label}
	{/if}
</button>

<style>
	.btn-primary {
		width: 100%;
		margin-top: var(--space-3);
		padding: var(--space-2) var(--space-4);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		background: var(--color-primary);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-with-progress {
		position: relative;
		overflow: hidden;
	}

	.btn-progress-bar {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: rgba(255, 255, 255, 0.2);
		transition: width 0.3s ease;
		z-index: 0;
	}

	.btn-with-progress > :global(*) {
		position: relative;
		z-index: 1;
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

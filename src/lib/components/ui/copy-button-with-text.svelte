<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';

	interface Props {
		value: string;
		text: string;
		size?: number;
		successDuration?: number;
		onCopy?: () => void;
		class?: string;
	}

	let {
		value,
		text,
		size = 16,
		successDuration = 2000,
		onCopy,
		class: className = ''
	}: Props = $props();

	let copied = $state(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(value);
			copied = true;

			if (timeout) clearTimeout(timeout);
			timeout = setTimeout(() => {
				copied = false;
			}, successDuration);

			onCopy?.();
		} catch (error) {
			console.error('Failed to copy to clipboard:', error);
		}
	}
</script>

<button
	class="copy-button-with-text {className}"
	onclick={handleCopy}
	type="button"
	title={copied ? '已复制' : text}
>
	{#if copied}
		<Check {size} class="copy-success-icon" />
		<span>已复制</span>
	{:else}
		<Copy {size} />
		<span>{text}</span>
	{/if}
</button>

<style>
	.copy-button-with-text {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-secondary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 0.2s;
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
	}

	.copy-button-with-text:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
	}

	.copy-button-with-text:active {
		transform: translateY(0);
	}

	.copy-button-with-text :global(.copy-success-icon) {
		color: var(--color-success);
		animation: successPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
	}

	@keyframes successPop {
		0% {
			transform: scale(0);
		}
		50% {
			transform: scale(1.2);
		}
		100% {
			transform: scale(1);
		}
	}
</style>

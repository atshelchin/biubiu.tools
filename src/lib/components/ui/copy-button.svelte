<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';

	interface Props {
		value: string;
		size?: number;
		successDuration?: number;
		onCopy?: () => void;
		class?: string;
	}

	let { value, size = 16, successDuration = 2000, onCopy, class: className = '' }: Props = $props();

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
	class="copy-button {className}"
	onclick={handleCopy}
	type="button"
	title={copied ? '已复制' : '复制'}
>
	{#if copied}
		<Check {size} class="copy-success-icon" />
	{:else}
		<Copy {size} />
	{/if}
</button>

<style>
	.copy-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--space-8);
		height: var(--space-8);
		padding: 0;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-secondary);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.copy-button:hover {
		background: var(--color-muted);
		transform: translateY(-1px);
		box-shadow: var(--shadow-sm);
		color: var(--brand-600);
	}

	.copy-button:active {
		transform: translateY(0);
	}

	.copy-button :global(.copy-success-icon) {
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

<script lang="ts">
	import { fade } from 'svelte/transition';
	import { AlertCircle } from '@lucide/svelte';

	interface Props {
		title: string;
		message: string;
		buttonText: string;
		onResume: () => void;
	}

	let { title, message, buttonText, onResume }: Props = $props();
</script>

<div class="gas-warning-banner" transition:fade>
	<AlertCircle size={24} />
	<div class="gas-warning-content">
		<strong>{title}</strong>
		<p>{message}</p>
		<button class="btn-resume-gas" onclick={onResume}>
			{buttonText}
		</button>
	</div>
</div>

<style>
	.gas-warning-banner {
		display: flex;
		align-items: flex-start;
		gap: var(--space-3);
		padding: var(--space-4);
		background: hsla(45, 100%, 95%, 1);
		border: 2px solid hsl(45, 100%, 50%);
		border-radius: var(--radius-md);
		color: hsl(45, 100%, 25%);
		margin: var(--space-4) 0;
	}

	:global([data-theme='dark']) .gas-warning-banner {
		background: hsla(45, 100%, 15%, 0.3);
		border-color: hsl(45, 100%, 40%);
		color: hsl(45, 100%, 70%);
	}

	.gas-warning-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.gas-warning-content strong {
		font-size: var(--text-lg);
		display: block;
		margin-bottom: var(--space-1);
	}

	.gas-warning-content p {
		margin: 0;
		font-size: var(--text-sm);
		line-height: 1.5;
	}

	.btn-resume-gas {
		align-self: flex-start;
		padding: var(--space-2) var(--space-4);
		background: var(--color-primary);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s;
		margin-top: var(--space-2);
	}

	.btn-resume-gas:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}
</style>

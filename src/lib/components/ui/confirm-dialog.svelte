<script lang="ts">
	import Modal from './modal.svelte';
	import { AlertTriangle } from '@lucide/svelte';

	interface Props {
		open: boolean;
		title: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		variant?: 'default' | 'danger';
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		open,
		title,
		message,
		confirmText = '确定',
		cancelText = '取消',
		variant = 'default',
		onConfirm,
		onCancel
	}: Props = $props();
</script>

<Modal {open} onClose={onCancel} {title} maxWidth="480px">
	<div class="confirm-dialog">
		{#if variant === 'danger'}
			<div class="icon-wrapper danger">
				<AlertTriangle size={24} />
			</div>
		{/if}
		<p class="message">{message}</p>
		<div class="actions">
			<button type="button" class="btn-secondary" onclick={onCancel}>
				{cancelText}
			</button>
			<button
				type="button"
				class="btn-primary"
				class:danger={variant === 'danger'}
				onclick={() => {
					onConfirm();
					onCancel();
				}}
			>
				{confirmText}
			</button>
		</div>
	</div>
</Modal>

<style>
	.confirm-dialog {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding: var(--space-4);
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 50%;
		margin: 0 auto;
	}

	.icon-wrapper.danger {
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		color: var(--color-danger);
	}

	.message {
		text-align: center;
		color: var(--color-foreground);
		font-size: var(--text-base);
		line-height: 1.5;
		margin: 0;
	}

	.actions {
		display: flex;
		gap: var(--space-3);
		justify-content: center;
		margin-top: var(--space-2);
	}

	button {
		flex: 1;
		max-width: 150px;
		padding: var(--space-2-5) var(--space-4);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-secondary {
		background: transparent;
		color: var(--color-foreground);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background: var(--color-muted);
	}

	.btn-primary {
		background: var(--brand-500);
		color: white;
		border: none;
	}

	.btn-primary:hover {
		background: var(--brand-600);
	}

	.btn-primary.danger {
		background: var(--color-danger);
	}

	.btn-primary.danger:hover {
		background: color-mix(in srgb, var(--color-danger) 90%, black);
	}
</style>

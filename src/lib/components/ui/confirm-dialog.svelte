<script lang="ts">
	import Modal from '$lib/components/ui/modal.svelte';
	import { AlertTriangle } from '@lucide/svelte';
	import { longPress } from '$lib/utils/long-press';

	interface Props {
		open: boolean;
		title?: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		variant?: 'danger' | 'warning' | 'info';
		requireLongPress?: boolean; // Whether to require 3s long press
		longPressDuration?: number; // Duration in ms (default 3000)
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		open = $bindable(false),
		title = 'Confirm Action',
		message,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		variant = 'danger',
		requireLongPress = true,
		longPressDuration = 3000,
		onConfirm,
		onCancel
	}: Props = $props();

	let holdProgress = $state(0);

	function handleConfirm() {
		onConfirm();
		open = false;
	}

	function handleCancel() {
		onCancel();
		open = false;
	}
</script>

<Modal {open} onClose={handleCancel} {title} maxWidth="450px">
	<div class="confirm-content">
		<div
			class="icon-wrapper"
			class:danger={variant === 'danger'}
			class:warning={variant === 'warning'}
			class:info={variant === 'info'}
		>
			<AlertTriangle size={48} />
		</div>

		<p class="message">{message}</p>

		{#if requireLongPress}
			<p class="instruction">
				Hold the button for {longPressDuration / 1000} seconds to confirm
			</p>
		{/if}
	</div>

	{#snippet footer()}
		<div class="footer-actions">
			<button class="btn-secondary" onclick={handleCancel} disabled={holdProgress > 0}>
				{cancelText}
			</button>

			<button
				class="btn-confirm"
				class:holding={holdProgress > 0}
				class:danger={variant === 'danger'}
				class:warning={variant === 'warning'}
				class:info={variant === 'info'}
				use:longPress={{
					duration: requireLongPress ? longPressDuration : 0,
					onProgress: (progress) => {
						holdProgress = progress;
					},
					onComplete: handleConfirm
				}}
			>
				<span class="btn-text">{confirmText}</span>
				{#if requireLongPress && holdProgress > 0}
					<div class="progress-bar" style="width: {holdProgress}%"></div>
				{/if}
			</button>
		</div>
	{/snippet}
</Modal>

<style>
	.confirm-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-2) 0;
	}

	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: hsla(0, 0%, 50%, 0.1);
	}

	.icon-wrapper.danger {
		background: hsla(0, 80%, 50%, 0.1);
		color: hsl(0, 80%, 50%);
	}

	.icon-wrapper.warning {
		background: hsla(45, 100%, 50%, 0.1);
		color: hsl(45, 100%, 45%);
	}

	.icon-wrapper.info {
		background: hsla(210, 100%, 50%, 0.1);
		color: hsl(210, 100%, 50%);
	}

	:global([data-theme='dark']) .icon-wrapper.danger {
		background: hsla(0, 80%, 50%, 0.15);
		color: hsl(0, 80%, 60%);
	}

	:global([data-theme='dark']) .icon-wrapper.warning {
		background: hsla(45, 100%, 50%, 0.15);
		color: hsl(45, 100%, 55%);
	}

	:global([data-theme='dark']) .icon-wrapper.info {
		background: hsla(210, 100%, 50%, 0.15);
		color: hsl(210, 100%, 60%);
	}

	.message {
		font-size: var(--text-base);
		color: var(--gray-700);
		text-align: center;
		line-height: 1.5;
		max-width: 360px;
		margin: 0;
	}

	:global([data-theme='dark']) .message {
		color: var(--gray-300);
	}

	.instruction {
		font-size: var(--text-sm);
		color: var(--gray-600);
		text-align: center;
		margin: 0;
		font-weight: var(--font-medium);
	}

	:global([data-theme='dark']) .instruction {
		color: var(--gray-400);
	}

	.footer-actions {
		display: flex;
		gap: var(--space-3);
		justify-content: flex-end;
		width: 100%;
	}

	.btn-secondary,
	.btn-confirm {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
		overflow: hidden;
		user-select: none;
		-webkit-user-select: none;
		touch-action: none;
	}

	.btn-secondary {
		background: var(--gray-200);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .btn-secondary {
		background: var(--gray-700);
		color: var(--gray-200);
	}

	.btn-secondary:hover:not(:disabled) {
		background: var(--gray-300);
	}

	:global([data-theme='dark']) .btn-secondary:hover:not(:disabled) {
		background: var(--gray-600);
	}

	.btn-secondary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-confirm {
		min-width: 120px;
	}

	.btn-confirm.danger {
		background: hsl(0, 80%, 50%);
		color: white;
	}

	.btn-confirm.warning {
		background: hsl(45, 100%, 45%);
		color: white;
	}

	.btn-confirm.info {
		background: hsl(210, 100%, 50%);
		color: white;
	}

	.btn-confirm:hover:not(.holding) {
		transform: scale(1.02);
	}

	.btn-confirm.holding {
		cursor: grabbing;
		transform: scale(0.98);
	}

	.btn-text {
		position: relative;
		z-index: 2;
	}

	.progress-bar {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: rgba(255, 255, 255, 0.3);
		transition: width 0.016s linear;
		z-index: 1;
	}

	.btn-confirm.danger .progress-bar {
		background: rgba(255, 255, 255, 0.3);
	}

	.btn-confirm.warning .progress-bar {
		background: rgba(255, 255, 255, 0.3);
	}

	.btn-confirm.info .progress-bar {
		background: rgba(255, 255, 255, 0.3);
	}
</style>

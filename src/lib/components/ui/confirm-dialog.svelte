<script lang="ts">
	import Modal from './modal.svelte';
	import { AlertTriangle } from '@lucide/svelte';
	import { longPress } from '$lib/utils/long-press';

	interface Props {
		open?: boolean;
		title: string;
		message: string;
		confirmText?: string;
		confirmHint?: string;
		cancelText?: string;
		variant?: 'default' | 'danger';
		requireLongPress?: boolean;
		longPressDuration?: number;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let {
		open = $bindable(false),
		title,
		message,
		confirmText = '确定',
		confirmHint,
		cancelText = '取消',
		variant = 'default',
		requireLongPress = false,
		longPressDuration = 2000,
		onConfirm,
		onCancel
	}: Props = $props();

	let longPressProgress = $state(0);
	let isPressing = $state(false);

	function handleProgress(progress: number) {
		if (progress > 0) {
			isPressing = true;
			longPressProgress = progress;
		} else {
			isPressing = false;
			longPressProgress = 0;
		}
	}

	function handleConfirm() {
		onConfirm();
		onCancel();
	}

	function handleLongPressComplete() {
		handleConfirm();
		isPressing = false;
		longPressProgress = 0;
	}
</script>

<Modal {open} onClose={onCancel} {title} maxWidth="480px">
	<div class="confirm-dialog">
		{#if variant === 'danger'}
			<div class="icon-wrapper danger">
				<AlertTriangle size={24} />
			</div>
		{/if}
		<p class="message">{message}</p>
		<div class="actions-wrapper">
			{#if requireLongPress && confirmHint}
				<p class="confirm-hint">{confirmHint}</p>
			{/if}
			<div class="actions">
				<button type="button" class="btn-secondary" onclick={onCancel}>
					{cancelText}
				</button>
				{#if requireLongPress}
					<div
						class="btn-wrapper"
						use:longPress={{
							duration: longPressDuration,
							onProgress: handleProgress,
							onComplete: handleLongPressComplete
						}}
					>
						<button
							type="button"
							style="width:100%"
							class="btn-primary"
							class:danger={variant === 'danger'}
						>
							{confirmText}
						</button>
						{#if isPressing && longPressProgress > 0}
							<div class="long-press-indicator">
								<div class="progress-bar" style:width="{longPressProgress}%"></div>
							</div>
						{/if}
					</div>
				{:else}
					<button
						type="button"
						class="btn-primary"
						class:danger={variant === 'danger'}
						onclick={handleConfirm}
					>
						{confirmText}
					</button>
				{/if}
			</div>
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

	.actions-wrapper {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		margin-top: var(--space-2);
	}

	.confirm-hint {
		text-align: center;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin: 0;
		padding: var(--space-2) var(--space-3);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		border-left: 3px solid hsl(45, 100%, 50%);
	}

	.actions {
		display: flex;
		gap: var(--space-3);
		justify-content: center;
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

	.btn-wrapper {
		position: relative;
		flex: 1;
		max-width: 150px;
	}

	.long-press-indicator {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: hsla(0, 0%, 100%, 0.2);
		border-radius: 0 0 var(--radius-md) var(--radius-md);
		overflow: hidden;
	}

	.progress-bar {
		height: 100%;
		background: linear-gradient(90deg, hsl(45, 100%, 50%), hsl(0, 80%, 50%));
		transition: width 0.05s linear;
	}
</style>

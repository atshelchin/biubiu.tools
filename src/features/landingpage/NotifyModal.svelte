<script lang="ts">
	import { t } from '@/i18n/create-i18n.svelte';
	import { X } from '@lucide/svelte';

	interface Props {
		isOpen: boolean;
		toolName: string;
		onClose: () => void;
	}

	let { isOpen = false, toolName = '', onClose }: Props = $props();

	let email = $state('');
	let loading = $state(false);
	let success = $state(false);
	let error = $state('');

	// Email validation
	function validateEmail(email: string): boolean {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	}

	// Handle subscription
	async function handleSubscribe() {
		error = '';

		if (!validateEmail(email)) {
			error = t('tools.notify_modal.error');
			return;
		}

		loading = true;

		try {
			// Store email in localStorage for demo
			// In production, send to backend API
			const subscriptions = JSON.parse(localStorage.getItem('notify_subscriptions') || '[]');
			subscriptions.push({
				email,
				tool: toolName,
				date: new Date().toISOString()
			});
			localStorage.setItem('notify_subscriptions', JSON.stringify(subscriptions));

			// Show success message
			success = true;
			setTimeout(() => {
				onClose();
				// Reset state
				email = '';
				success = false;
				error = '';
			}, 2000);
		} catch {
			error = 'Something went wrong. Please try again.';
		} finally {
			loading = false;
		}
	}

	// Handle modal close
	function handleClose() {
		if (!loading) {
			onClose();
			email = '';
			success = false;
			error = '';
		}
	}

	// Handle escape key
	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && isOpen) {
			handleClose();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<!-- Modal backdrop -->
	<div
		class="modal-backdrop"
		role="button"
		tabindex="0"
		onclick={handleClose}
		onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClose()}
	>
		<!-- Modal content -->
		<div
			class="modal-content"
			role="dialog"
			tabindex="-1"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<!-- Close button -->
			<button class="close-btn" onclick={handleClose} aria-label="Close">
				<X />
			</button>

			{#if success}
				<!-- Success message -->
				<div class="success-container">
					<div class="success-icon">✓</div>
					<h3 class="success-title">{t('tools.notify_modal.success')}</h3>
				</div>
			{:else}
				<!-- Modal header -->
				<div class="modal-header">
					<h2 class="modal-title">{t('tools.notify_modal.title')}</h2>
					<p class="modal-description">
						{t('tools.notify_modal.description')}
					</p>
				</div>

				<!-- Tool info -->
				<div class="tool-info">
					<span class="tool-label">Tool:</span>
					<span class="tool-name">{toolName}</span>
				</div>

				<!-- Email input -->
				<div class="input-group">
					<input
						type="email"
						bind:value={email}
						placeholder={t('tools.notify_modal.email_placeholder')}
						class="email-input {error ? 'error' : ''}"
						disabled={loading}
						onkeydown={(e) => e.key === 'Enter' && handleSubscribe()}
					/>
					{#if error}
						<p class="error-message">{error}</p>
					{/if}
				</div>

				<!-- Actions -->
				<div class="modal-actions">
					<button class="btn-cancel" onclick={handleClose} disabled={loading}>
						{t('tools.notify_modal.cancel')}
					</button>
					<button class="btn-subscribe" onclick={handleSubscribe} disabled={loading || !email}>
						{#if loading}
							<span class="loading-spinner"></span>
						{/if}
						{t('tools.notify_modal.subscribe')}
					</button>
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
	/* Modal backdrop */
	.modal-backdrop {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(4px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 200ms ease;
		padding: var(--space-4);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}

	/* Modal content */
	.modal-content {
		position: relative;
		width: 100%;
		max-width: 440px;
		background: var(--color-panel-elevated);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
		padding: var(--space-8);
		box-shadow: var(--shadow-2xl);
		animation: slideUp 300ms ease;
	}

	@keyframes slideUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Close button */
	.close-btn {
		position: absolute;
		top: var(--space-4);
		right: var(--space-4);
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: all 150ms ease;
		color: var(--color-description-3);
	}

	.close-btn:hover {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
		color: var(--color-heading-3);
	}

	:global(.close-btn svg) {
		width: 16px;
		height: 16px;
	}

	/* Modal header */
	.modal-header {
		margin-bottom: var(--space-6);
		text-align: center;
	}

	.modal-title {
		margin-bottom: var(--space-3);
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-heading-1);
	}

	.modal-description {
		font-size: var(--text-base);
		color: var(--color-description-3);
		line-height: 1.6;
	}

	/* Tool info */
	.tool-info {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-6);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
	}

	.tool-label {
		font-size: var(--text-sm);
		color: var(--color-description-3);
	}

	.tool-name {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--color-primary);
	}

	/* Input group */
	.input-group {
		margin-bottom: var(--space-6);
	}

	.email-input {
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: var(--color-background);
		border: 2px solid var(--color-panel-border-2);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		color: var(--color-heading-2);
		transition: all 150ms ease;
	}

	.email-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--color-ring);
	}

	.email-input.error {
		border-color: var(--color-danger);
	}

	.email-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error-message {
		margin-top: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-danger);
	}

	/* Modal actions */
	.modal-actions {
		display: flex;
		gap: var(--space-3);
	}

	.btn-cancel,
	.btn-subscribe {
		flex: 1;
		padding: var(--space-3) var(--space-5);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 150ms ease;
		border: none;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
	}

	.btn-cancel {
		background: var(--color-panel-3);
		color: var(--color-description-2);
		border: 1px solid var(--color-panel-border-3);
	}

	.btn-cancel:hover:not(:disabled) {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
	}

	.btn-subscribe {
		background: var(--color-button-primary);
		color: var(--color-button-primary-foreground);
	}

	.btn-subscribe:hover:not(:disabled) {
		background: var(--brand-700);
	}

	.btn-cancel:disabled,
	.btn-subscribe:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Loading spinner */
	.loading-spinner {
		width: 16px;
		height: 16px;
		border: 2px solid transparent;
		border-top-color: currentColor;
		border-radius: 50%;
		animation: spin 600ms linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	/* Success state */
	.success-container {
		text-align: center;
		padding: var(--space-8) 0;
	}

	.success-icon {
		width: 64px;
		height: 64px;
		margin: 0 auto var(--space-4);
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--color-success);
		color: white;
		border-radius: 50%;
		font-size: var(--text-3xl);
		animation: scaleIn 300ms ease;
	}

	@keyframes scaleIn {
		from {
			transform: scale(0);
		}
		to {
			transform: scale(1);
		}
	}

	.success-title {
		font-size: var(--text-lg);
		color: var(--color-heading-2);
		font-weight: var(--font-medium);
	}
</style>

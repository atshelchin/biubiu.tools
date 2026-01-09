<script lang="ts">
	import { Mail, Send, CheckCircle, AlertCircle, Loader2, Bell } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import type { SubmitState, SubscribeErrorCode } from './types';
	import { isValidEmail } from './utils';
	import { subscribe } from './api';

	const i18n = useI18n();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const t = (key: string) => i18n.t(key as any);

	// Form state
	let email = $state('');
	let submitState = $state<SubmitState>('idle');
	let errorCode = $state<SubscribeErrorCode | null>(null);

	// Derived states
	const isValidInput = $derived(isValidEmail(email));
	const canSubmit = $derived(isValidInput && submitState !== 'submitting');

	// Get error message based on error code
	function getErrorMessage(code: SubscribeErrorCode): string {
		const messages: Record<SubscribeErrorCode, string> = {
			INVALID_EMAIL: t('common.newsletter.errors.invalid_email') as string,
			ALREADY_SUBSCRIBED: t('common.newsletter.errors.already_subscribed') as string,
			RATE_LIMITED: t('common.newsletter.errors.rate_limited') as string,
			INVALID_REQUEST: t('common.newsletter.errors.invalid_request') as string,
			SERVER_ERROR: t('common.newsletter.errors.server_error') as string
		};
		return messages[code] || messages.SERVER_ERROR;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!canSubmit) return;

		// Client-side validation
		if (!isValidInput) {
			submitState = 'error';
			errorCode = 'INVALID_EMAIL';
			return;
		}

		submitState = 'submitting';
		errorCode = null;

		const response = await subscribe(email, i18n.locale);

		if (response.success) {
			submitState = 'success';
			email = '';
		} else {
			submitState = 'error';
			errorCode = response.code;
		}
	}

	function handleInput() {
		// Clear error when user starts typing
		if (submitState === 'error') {
			submitState = 'idle';
			errorCode = null;
		}
	}
</script>

<section id="newsletter" class="newsletter-section" aria-labelledby="newsletter-title">
	<!-- Background decoration -->
	<div class="bg-decoration"></div>

	<div class="container">
		<!-- Badge -->
		<div class="badge">
			<Bell class="badge-icon" />
			<span>{t('common.newsletter.badge')}</span>
		</div>

		<!-- Title -->
		<h2 id="newsletter-title" class="section-title">
			{t('common.newsletter.title')}
		</h2>

		<!-- Subtitle -->
		<p class="section-subtitle">
			{t('common.newsletter.subtitle')}
		</p>

		<!-- Form or Success State -->
		{#if submitState === 'success'}
			<div class="success-state">
				<div class="success-icon-wrapper">
					<CheckCircle class="success-icon" />
				</div>
				<h3 class="success-title">{t('common.newsletter.success_title')}</h3>
				<p class="success-message">{t('common.newsletter.success_message')}</p>
				<button type="button" class="btn-reset" onclick={() => (submitState = 'idle')}>
					{t('common.newsletter.subscribe_another')}
				</button>
			</div>
		{:else}
			<form class="subscribe-form" onsubmit={handleSubmit}>
				<div class="input-wrapper" class:has-error={submitState === 'error'}>
					<Mail class="input-icon" />
					<input
						type="email"
						placeholder={t('common.newsletter.placeholder') as string}
						bind:value={email}
						oninput={handleInput}
						disabled={submitState === 'submitting'}
						aria-label="Email address"
						aria-invalid={submitState === 'error'}
						aria-describedby={submitState === 'error' ? 'newsletter-error' : undefined}
					/>
					<button
						type="submit"
						class="btn-submit"
						disabled={!canSubmit}
						aria-label={t('common.newsletter.button') as string}
					>
						{#if submitState === 'submitting'}
							<Loader2 class="btn-icon spinning" />
							<span class="btn-text">{t('common.newsletter.submitting')}</span>
						{:else}
							<Send class="btn-icon" />
							<span class="btn-text">{t('common.newsletter.button')}</span>
						{/if}
					</button>
				</div>

				<!-- Error message -->
				{#if submitState === 'error' && errorCode}
					<div id="newsletter-error" class="error-message" role="alert">
						<AlertCircle class="error-icon" />
						<span>{getErrorMessage(errorCode)}</span>
					</div>
				{/if}
			</form>
		{/if}

		<!-- Trust indicators -->
		<div class="trust-row">
			<span class="trust-item">
				<CheckCircle class="trust-icon" />
				{t('common.newsletter.trust.no_spam')}
			</span>
			<span class="trust-separator">•</span>
			<span class="trust-item">
				<CheckCircle class="trust-icon" />
				{t('common.newsletter.trust.unsubscribe')}
			</span>
			<span class="trust-separator">•</span>
			<span class="trust-item">
				<CheckCircle class="trust-icon" />
				{t('common.newsletter.trust.privacy')}
			</span>
		</div>

		<!-- Unsubscribe link -->
		<p class="unsubscribe-note">
			{t('common.newsletter.unsubscribe_note')}
			<a href="/unsubscribe" class="unsubscribe-link">{t('common.newsletter.unsubscribe_link')}</a>
		</p>
	</div>
</section>

<style>
	/* Section layout */
	.newsletter-section {
		position: relative;
		padding: var(--space-20) var(--space-6);
		background: linear-gradient(
			180deg,
			var(--color-background) 0%,
			var(--color-panel-1) 50%,
			var(--color-background) 100%
		);
		overflow: hidden;
	}

	/* Background decoration */
	.bg-decoration {
		position: absolute;
		inset: 0;
		background-image: radial-gradient(
			circle at 1px 1px,
			var(--color-panel-border-1) 1px,
			transparent 0
		);
		background-size: 32px 32px;
		opacity: 0.4;
		mask-image: radial-gradient(ellipse 60% 40% at 50% 50%, black 20%, transparent 70%);
	}

	.container {
		position: relative;
		max-width: 36rem;
		margin: 0 auto;
		text-align: center;
		z-index: 1;
	}

	/* Badge */
	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		margin-bottom: var(--space-4);
		border-radius: var(--radius-full);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
	}

	:global(.badge-icon) {
		width: 1rem;
		height: 1rem;
		color: var(--color-primary);
	}

	/* Title */
	.section-title {
		margin-bottom: var(--space-4);
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		line-height: 1.2;
		background: linear-gradient(to right, var(--color-heading-1), var(--color-muted-foreground));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	@media (min-width: 768px) {
		.section-title {
			font-size: var(--text-4xl);
		}
	}

	.section-subtitle {
		max-width: 28rem;
		margin: 0 auto var(--space-8);
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-description-2);
	}

	/* Form */
	.subscribe-form {
		margin-bottom: var(--space-6);
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		transition: all 0.15s ease;
	}

	.input-wrapper:focus-within {
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px var(--brand-500-a10);
	}

	.input-wrapper.has-error {
		border-color: var(--color-destructive);
	}

	:global(.input-icon) {
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
		margin-left: var(--space-3);
		color: var(--color-muted-foreground);
	}

	input {
		flex: 1;
		min-width: 0;
		padding: var(--space-3) var(--space-2);
		background: transparent;
		border: none;
		font-size: var(--text-base);
		color: var(--color-foreground);
		outline: none;
	}

	input::placeholder {
		color: var(--color-muted-foreground);
	}

	input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.btn-submit {
		flex-shrink: 0;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-5);
		background: linear-gradient(135deg, var(--brand-600), var(--brand-700));
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: white;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-submit:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: var(--shadow-md);
	}

	.btn-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.btn-icon) {
		width: 1rem;
		height: 1rem;
	}

	:global(.btn-icon.spinning) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.btn-text {
		display: none;
	}

	@media (min-width: 480px) {
		.btn-text {
			display: inline;
		}
	}

	/* Error message */
	.error-message {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		margin-top: var(--space-3);
		padding: var(--space-2) var(--space-4);
		background: var(--color-destructive-a10);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-destructive);
	}

	:global(.error-icon) {
		width: 1rem;
		height: 1rem;
		flex-shrink: 0;
	}

	/* Success state */
	.success-state {
		padding: var(--space-8);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		margin-bottom: var(--space-6);
	}

	.success-icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 4rem;
		height: 4rem;
		margin: 0 auto var(--space-4);
		background: linear-gradient(135deg, var(--brand-600), var(--brand-700));
		border-radius: var(--radius-full);
	}

	:global(.success-icon) {
		width: 2rem;
		height: 2rem;
		color: white;
	}

	.success-title {
		margin-bottom: var(--space-2);
		font-size: var(--text-xl);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
	}

	.success-message {
		margin-bottom: var(--space-4);
		font-size: var(--text-base);
		color: var(--color-description-2);
		line-height: 1.6;
	}

	.btn-reset {
		padding: var(--space-2) var(--space-4);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-reset:hover {
		background: var(--color-panel-3);
		color: var(--color-foreground);
	}

	/* Trust row */
	.trust-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.trust-item {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
	}

	:global(.trust-icon) {
		width: 0.875rem;
		height: 0.875rem;
		color: var(--color-primary);
	}

	.trust-separator {
		color: var(--color-border);
	}

	/* Unsubscribe note */
	.unsubscribe-note {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	.unsubscribe-link {
		color: var(--color-muted-foreground);
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: color 0.15s ease;
	}

	.unsubscribe-link:hover {
		color: var(--color-primary);
	}

	/* Responsive */
	@media (min-width: 768px) {
		.newsletter-section {
			padding: var(--space-24) var(--space-8);
		}
	}
</style>

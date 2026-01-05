<script lang="ts">
	import { Mail, Send, CheckCircle, AlertCircle, Loader2, MailX } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import { unsubscribe } from '../../features/landingpage/newsletter';
	import { isValidEmail } from '../../features/landingpage/newsletter/utils';

	const i18n = useI18n();
	const t = i18n.t.bind(i18n);

	type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

	// Form state
	let email = $state('');
	let submitState = $state<SubmitState>('idle');
	let errorMessage = $state('');

	// Derived states
	const isValidInput = $derived(isValidEmail(email));
	const canSubmit = $derived(isValidInput && submitState !== 'submitting');

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!canSubmit) return;

		if (!isValidInput) {
			submitState = 'error';
			errorMessage = t('routes/unsubscribe.errors.invalid_email') as string;
			return;
		}

		submitState = 'submitting';
		errorMessage = '';

		const response = await unsubscribe(email);

		if (response.success) {
			submitState = 'success';
		} else {
			submitState = 'error';
			errorMessage = response.message;
		}
	}

	function handleInput() {
		if (submitState === 'error') {
			submitState = 'idle';
			errorMessage = '';
		}
	}
</script>

<svelte:head>
	<title>{t('routes/unsubscribe.page_title')} | BiuBiu Tools</title>
	<meta name="description" content={t('routes/unsubscribe.page_description')} />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="unsubscribe-page">
	<div class="container">
		<!-- Icon -->
		<div class="icon-wrapper">
			<MailX class="page-icon" />
		</div>

		<!-- Title -->
		<h1>{t('routes/unsubscribe.title')}</h1>

		<!-- Description -->
		<p class="description">{t('routes/unsubscribe.description')}</p>

		<!-- Form or Success State -->
		{#if submitState === 'success'}
			<div class="success-state">
				<div class="success-icon-wrapper">
					<CheckCircle class="success-icon" />
				</div>
				<h2 class="success-title">{t('routes/unsubscribe.success_title')}</h2>
				<p class="success-message">{t('routes/unsubscribe.success_message')}</p>
				<a href="/" class="btn-home">{t('common.back_to_home')}</a>
			</div>
		{:else}
			<form class="unsubscribe-form" onsubmit={handleSubmit}>
				<div class="input-wrapper" class:has-error={submitState === 'error'}>
					<Mail class="input-icon" />
					<input
						type="email"
						placeholder={t('routes/unsubscribe.placeholder') as string}
						bind:value={email}
						oninput={handleInput}
						disabled={submitState === 'submitting'}
						aria-label="Email address"
						aria-invalid={submitState === 'error'}
						aria-describedby={submitState === 'error' ? 'unsubscribe-error' : undefined}
					/>
				</div>

				<!-- Error message -->
				{#if submitState === 'error' && errorMessage}
					<div id="unsubscribe-error" class="error-message" role="alert">
						<AlertCircle class="error-icon" />
						<span>{errorMessage}</span>
					</div>
				{/if}

				<button type="submit" class="btn-submit" disabled={!canSubmit}>
					{#if submitState === 'submitting'}
						<Loader2 class="btn-icon spinning" />
						<span>{t('routes/unsubscribe.submitting')}</span>
					{:else}
						<Send class="btn-icon" />
						<span>{t('routes/unsubscribe.button')}</span>
					{/if}
				</button>
			</form>

			<p class="note">{t('routes/unsubscribe.note')}</p>
		{/if}
	</div>
</div>

<style>
	.unsubscribe-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-8) var(--space-4);
		background: var(--color-background);
	}

	.container {
		max-width: 28rem;
		width: 100%;
		text-align: center;
	}

	/* Icon */
	.icon-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 5rem;
		height: 5rem;
		margin: 0 auto var(--space-6);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-full);
	}

	:global(.page-icon) {
		width: 2.5rem;
		height: 2.5rem;
		color: var(--color-muted-foreground);
	}

	h1 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.description {
		font-size: var(--text-base);
		color: var(--color-muted-foreground);
		line-height: 1.6;
		margin-bottom: var(--space-8);
	}

	/* Form */
	.unsubscribe-form {
		margin-bottom: var(--space-4);
	}

	.input-wrapper {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		margin-bottom: var(--space-4);
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
		color: var(--color-muted-foreground);
	}

	input {
		flex: 1;
		min-width: 0;
		padding: var(--space-1) 0;
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

	/* Error message */
	.error-message {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
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

	.btn-submit {
		width: 100%;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-destructive);
		border: none;
		border-radius: var(--radius-lg);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: white;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.btn-submit:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.btn-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	:global(.btn-icon) {
		width: 1.125rem;
		height: 1.125rem;
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

	.note {
		font-size: var(--text-sm);
		color: var(--color-description-3);
		line-height: 1.5;
	}

	/* Success state */
	.success-state {
		padding: var(--space-8);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
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
		margin-bottom: var(--space-6);
		font-size: var(--text-base);
		color: var(--color-description-2);
		line-height: 1.6;
	}

	.btn-home {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		background: var(--color-panel-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		text-decoration: none;
		transition: all 0.15s ease;
	}

	.btn-home:hover {
		background: var(--color-panel-2);
		border-color: var(--color-primary);
	}
</style>

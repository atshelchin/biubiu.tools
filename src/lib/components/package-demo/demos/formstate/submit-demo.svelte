<script lang="ts">
	/**
	 * Form Submission Demo
	 * Demonstrates form submission with validation, loading states, and error handling.
	 */
	import { useFormState, Validators } from '@shelchin/formstate';
	import { Send, RotateCcw, CheckCircle, XCircle, Loader } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		InputGroup,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Store translated messages for validators
	const requiredMsg = t('messages.required');
	const invalidEmailMsg = t('messages.invalid_email');

	const form = useFormState({
		validateOnBlur: true,
		fields: {
			firstName: {
				defaultValue: '',
				validator: Validators.required(requiredMsg)
			},
			lastName: {
				defaultValue: '',
				validator: Validators.required(requiredMsg)
			},
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required(requiredMsg),
					Validators.email(invalidEmailMsg)
				)
			},
			phone: {
				defaultValue: ''
			}
		}
	});

	let submitState = $state<'idle' | 'success' | 'error'>('idle');
	let submitData = $state<Record<string, unknown> | null>(null);

	async function handleSubmit() {
		submitState = 'idle';

		const result = await form.submit(async (values) => {
			// Simulate API call with 1.5s delay
			await new Promise((r) => setTimeout(r, 1500));

			// Simulate random success/failure for demo
			if (Math.random() > 0.3) {
				submitData = values;
				submitState = 'success';
			} else {
				submitState = 'error';
				throw new Error('Network error');
			}
		});

		if (!result) {
			submitState = 'error';
		}
	}

	function handleReset() {
		form.reset();
		submitState = 'idle';
		submitData = null;
	}

	const codeExample = `import { useFormState, Validators } from '@shelchin/formstate';

const form = useFormState({
  validateOnBlur: true,
  fields: {
    firstName: {
      defaultValue: '',
      validator: Validators.required('Required')
    },
    lastName: {
      defaultValue: '',
      validator: Validators.required('Required')
    },
    email: {
      defaultValue: '',
      validator: Validators.compose(
        Validators.required('Required'),
        Validators.email('Invalid email')
      )
    },
    phone: { defaultValue: '' } // Optional
  }
});

// Handle submission
async function handleSubmit() {
  const result = await form.submit(async (values) => {
    // Validates all fields first
    // If validation fails, returns false
    // Otherwise calls your handler

    await api.saveUser(values);
  });

  if (result) {
    console.log('Submitted successfully!');
  } else {
    console.log('Validation failed or submission error');
  }
}

// Check states
form.isSubmitting  // true during submit
form.isValid       // false if any field has errors`;
</script>

<DemoSection title={t('demo.submit.title')} description={t('demo.submit.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="form-row">
				<InputGroup label={t('demo.submit.first_name')} id="submit-first">
					<input
						id="submit-first"
						type="text"
						value={form.values.firstName}
						oninput={(e) => form.setValue('firstName', e.currentTarget.value)}
						onblur={() => form.setFieldTouched('firstName', true)}
						placeholder={t('demo.submit.first_name')}
						class:has-error={form.errors.firstName}
						disabled={form.isSubmitting}
					/>
					{#if form.errors.firstName}
						<span class="field-error">{form.errors.firstName}</span>
					{/if}
				</InputGroup>

				<InputGroup label={t('demo.submit.last_name')} id="submit-last">
					<input
						id="submit-last"
						type="text"
						value={form.values.lastName}
						oninput={(e) => form.setValue('lastName', e.currentTarget.value)}
						onblur={() => form.setFieldTouched('lastName', true)}
						placeholder={t('demo.submit.last_name')}
						class:has-error={form.errors.lastName}
						disabled={form.isSubmitting}
					/>
					{#if form.errors.lastName}
						<span class="field-error">{form.errors.lastName}</span>
					{/if}
				</InputGroup>
			</div>

			<InputGroup label={t('demo.submit.email')} id="submit-email">
				<input
					id="submit-email"
					type="email"
					value={form.values.email}
					oninput={(e) => form.setValue('email', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('email', true)}
					placeholder={t('demo.submit.email')}
					class:has-error={form.errors.email}
					disabled={form.isSubmitting}
				/>
				{#if form.errors.email}
					<span class="field-error">{form.errors.email}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.submit.phone')} id="submit-phone">
				<input
					id="submit-phone"
					type="tel"
					value={form.values.phone}
					oninput={(e) => form.setValue('phone', e.currentTarget.value)}
					placeholder={t('demo.submit.phone')}
					disabled={form.isSubmitting}
				/>
			</InputGroup>

			<ActionButtons>
				<DemoButton
					variant="success"
					icon={Send}
					onclick={handleSubmit}
					loading={form.isSubmitting}
					disabled={form.isSubmitting}
				>
					{form.isSubmitting ? t('demo.submit.submitting') : t('demo.submit.submit')}
				</DemoButton>
				<DemoButton
					variant="outline"
					icon={RotateCcw}
					onclick={handleReset}
					disabled={form.isSubmitting}
				>
					{t('demo.basic.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="result-section">
					<h4>{t('demo.submit.submit_result')}</h4>

					{#if form.isSubmitting}
						<div class="submit-status loading">
							<Loader size={24} class="spinner" />
							<span>{t('messages.submitting')}</span>
						</div>
					{:else if submitState === 'success'}
						<div class="submit-status success">
							<CheckCircle size={24} />
							<span>{t('demo.submit.success')}</span>
						</div>
						{#if submitData}
							<pre class="json-display">{JSON.stringify(submitData, null, 2)}</pre>
						{/if}
					{:else if submitState === 'error'}
						<div class="submit-status error">
							<XCircle size={24} />
							<span>{t('demo.submit.failed')}</span>
						</div>
					{:else}
						<div class="submit-status idle">
							<span>{t('demo.submit.no_submission')}</span>
						</div>
					{/if}
				</div>

				<div class="result-section">
					<h4>Form State</h4>
					<div class="state-row">
						<span class="state-label">isValid:</span>
						<span class="state-value" class:active={form.isValid}>{form.isValid}</span>
					</div>
					<div class="state-row">
						<span class="state-label">isDirty:</span>
						<span class="state-value" class:active={form.isDirty}>{form.isDirty}</span>
					</div>
					<div class="state-row">
						<span class="state-label">isSubmitting:</span>
						<span class="state-value" class:active={form.isSubmitting}>{form.isSubmitting}</span>
					</div>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title="Form Submission" code={codeExample} />
</DemoSection>

<style>
	.result-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.result-section h4 {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
		margin-bottom: var(--space-3);
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
	}

	@media (max-width: 640px) {
		.form-row {
			grid-template-columns: 1fr;
		}
	}

	.submit-status {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		border-radius: var(--radius-lg);
		font-weight: 600;
		margin-bottom: var(--space-3);
	}

	.submit-status.idle {
		background: var(--color-panel-0);
		border: 1px dashed var(--color-border);
		color: var(--color-muted-foreground);
		font-weight: normal;
	}

	.submit-status.loading {
		background: color-mix(in srgb, var(--color-primary) 10%, transparent);
		border: 1px solid var(--color-primary);
		color: var(--color-primary);
	}

	.submit-status.success {
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
		border: 1px solid var(--color-success);
		color: var(--color-success);
	}

	.submit-status.error {
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		border: 1px solid var(--color-danger);
		color: var(--color-danger);
	}

	:global(.spinner) {
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

	.json-display {
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-3);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
		margin: 0;
	}

	.state-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin-bottom: var(--space-2);
	}

	.state-label {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.state-value {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.state-value.active {
		color: var(--color-success);
	}

	input {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		transition:
			border-color 0.2s,
			opacity 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	input.has-error {
		border-color: var(--color-danger);
	}

	input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.field-error {
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}
</style>

<script lang="ts">
	/**
	 * Validators Demo
	 * Demonstrates built-in validators with real-time validation feedback.
	 */
	import { useFormState, Validators, createValidator } from '@shelchin/formstate';
	import { CheckCircle, XCircle, Shield } from '@lucide/svelte';
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
	const minLengthMsg = t('messages.min_length').replace('{min}', '8');
	const passwordsMustMatchMsg = t('messages.passwords_must_match');
	const patternMismatchMsg = t('messages.pattern_mismatch');

	const form = useFormState({
		validateOnChange: true,
		fields: {
			required: {
				defaultValue: '',
				validator: Validators.required(requiredMsg)
			},
			email: {
				defaultValue: '',
				validator: Validators.email(invalidEmailMsg)
			},
			password: {
				defaultValue: '',
				validator: Validators.minLength(8, minLengthMsg)
			},
			confirmPassword: {
				defaultValue: '',
				validator: createValidator<string>((value, allValues) => {
					if (value !== allValues.password) {
						return passwordsMustMatchMsg;
					}
					return null;
				})
			},
			website: {
				defaultValue: '',
				validator: Validators.pattern(/^https?:\/\/.+\..+$/, patternMismatchMsg)
			}
		}
	});

	async function validateAll() {
		await form.validateForm();
	}

	const allFieldsValid = $derived(
		!form.errors.required &&
			!form.errors.email &&
			!form.errors.password &&
			!form.errors.confirmPassword &&
			!form.errors.website &&
			form.values.required !== '' &&
			form.values.email !== '' &&
			form.values.password !== ''
	);

	const codeExample = `import { useFormState, Validators, createValidator } from '@shelchin/formstate';

const form = useFormState({
  validateOnChange: true, // Real-time validation
  fields: {
    // Required field
    required: {
      defaultValue: '',
      validator: Validators.required('This field is required')
    },

    // Email validation
    email: {
      defaultValue: '',
      validator: Validators.email('Invalid email')
    },

    // Minimum length
    password: {
      defaultValue: '',
      validator: Validators.minLength(8, 'Min 8 characters')
    },

    // Custom validator (confirm password)
    confirmPassword: {
      defaultValue: '',
      validator: createValidator((value, allValues) => {
        if (value !== allValues.password) {
          return 'Passwords must match';
        }
        return null;
      })
    },

    // Pattern (URL)
    website: {
      defaultValue: '',
      validator: Validators.pattern(
        /^https?:\\/\\/.+\\..+$/,
        'Invalid URL format'
      )
    }
  }
});

// Validate all fields at once
await form.validateForm();`;
</script>

<DemoSection title={t('demo.validators.title')} description={t('demo.validators.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.validators.required_field')} id="val-required">
				<input
					id="val-required"
					type="text"
					value={form.values.required}
					oninput={(e) => form.setValue('required', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('required', true)}
					placeholder={t('demo.validators.required_placeholder')}
					class:has-error={form.errors.required}
				/>
				{#if form.errors.required}
					<span class="field-error">{form.errors.required}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.validators.email_field')} id="val-email">
				<input
					id="val-email"
					type="email"
					value={form.values.email}
					oninput={(e) => form.setValue('email', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('email', true)}
					placeholder={t('demo.validators.email_placeholder')}
					class:has-error={form.errors.email}
				/>
				{#if form.errors.email}
					<span class="field-error">{form.errors.email}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.validators.password')} id="val-password">
				<input
					id="val-password"
					type="password"
					value={form.values.password}
					oninput={(e) => form.setValue('password', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('password', true)}
					placeholder={t('demo.validators.password_placeholder')}
					class:has-error={form.errors.password}
				/>
				{#if form.errors.password}
					<span class="field-error">{form.errors.password}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.validators.confirm_password')} id="val-confirm">
				<input
					id="val-confirm"
					type="password"
					value={form.values.confirmPassword}
					oninput={(e) => form.setValue('confirmPassword', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('confirmPassword', true)}
					placeholder={t('demo.validators.confirm_placeholder')}
					class:has-error={form.errors.confirmPassword}
				/>
				{#if form.errors.confirmPassword}
					<span class="field-error">{form.errors.confirmPassword}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.validators.website')} id="val-website">
				<input
					id="val-website"
					type="url"
					value={form.values.website}
					oninput={(e) => form.setValue('website', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('website', true)}
					placeholder={t('demo.validators.website_placeholder')}
					class:has-error={form.errors.website}
				/>
				{#if form.errors.website}
					<span class="field-error">{form.errors.website}</span>
				{/if}
			</InputGroup>

			<ActionButtons>
				<DemoButton variant="primary" icon={Shield} onclick={validateAll}>
					{t('demo.validators.validate_all')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="validation-status" class:valid={allFieldsValid}>
					{#if allFieldsValid}
						<CheckCircle size={24} />
						<span>{t('demo.validators.all_valid')}</span>
					{:else}
						<XCircle size={24} />
						<span>{t('demo.validators.has_errors')}</span>
					{/if}
				</div>

				<div class="field-status-list">
					<div class="field-status" class:valid={!form.errors.required && form.values.required}>
						<span class="field-name">required</span>
						{#if form.errors.required}
							<span class="error-msg">{form.errors.required}</span>
						{:else if form.values.required}
							<CheckCircle size={16} class="icon-success" />
						{:else}
							<span class="empty-state">-</span>
						{/if}
					</div>

					<div class="field-status" class:valid={!form.errors.email && form.values.email}>
						<span class="field-name">email</span>
						{#if form.errors.email}
							<span class="error-msg">{form.errors.email}</span>
						{:else if form.values.email}
							<CheckCircle size={16} class="icon-success" />
						{:else}
							<span class="empty-state">-</span>
						{/if}
					</div>

					<div class="field-status" class:valid={!form.errors.password && form.values.password}>
						<span class="field-name">password</span>
						{#if form.errors.password}
							<span class="error-msg">{form.errors.password}</span>
						{:else if form.values.password}
							<CheckCircle size={16} class="icon-success" />
						{:else}
							<span class="empty-state">-</span>
						{/if}
					</div>

					<div
						class="field-status"
						class:valid={!form.errors.confirmPassword && form.values.confirmPassword}
					>
						<span class="field-name">confirmPassword</span>
						{#if form.errors.confirmPassword}
							<span class="error-msg">{form.errors.confirmPassword}</span>
						{:else if form.values.confirmPassword}
							<CheckCircle size={16} class="icon-success" />
						{:else}
							<span class="empty-state">-</span>
						{/if}
					</div>

					<div class="field-status" class:valid={!form.errors.website && form.values.website}>
						<span class="field-name">website</span>
						{#if form.errors.website}
							<span class="error-msg">{form.errors.website}</span>
						{:else if form.values.website}
							<CheckCircle size={16} class="icon-success" />
						{:else}
							<span class="empty-state">-</span>
						{/if}
					</div>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.validators')} code={codeExample} />
</DemoSection>

<style>
	.result-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.validation-status {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		border: 1px solid var(--color-danger);
		border-radius: var(--radius-lg);
		color: var(--color-danger);
		font-weight: 600;
	}

	.validation-status.valid {
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
		border-color: var(--color-success);
		color: var(--color-success);
	}

	.field-status-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.field-status {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		transition: border-color 0.2s;
	}

	.field-status.valid {
		border-color: var(--color-success);
	}

	.field-name {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.error-msg {
		font-size: var(--text-xs);
		color: var(--color-danger);
	}

	.empty-state {
		color: var(--color-muted-foreground);
	}

	:global(.icon-success) {
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
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	input.has-error {
		border-color: var(--color-danger);
	}

	.field-error {
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}
</style>

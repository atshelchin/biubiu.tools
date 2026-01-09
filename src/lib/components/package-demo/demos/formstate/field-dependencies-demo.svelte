<script lang="ts">
	/**
	 * Field Dependencies Demo
	 * Demonstrates cross-field validation with dependencies configuration.
	 */
	import { useFormState, createValidator, Validators } from '@shelchin/formstate';
	import { Link, CheckCircle, XCircle } from '@lucide/svelte';
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

	// Password confirmation validator - depends on password field
	const confirmPasswordValidator = createValidator<string>((value, allValues) => {
		if (!value) return null;
		if (value !== allValues.password) {
			return t('demo.dependencies.passwords_mismatch');
		}
		return null;
	});

	// Email confirmation validator - depends on email field
	const confirmEmailValidator = createValidator<string>((value, allValues) => {
		if (!value) return null;
		if (value !== allValues.email) {
			return t('demo.dependencies.emails_mismatch');
		}
		return null;
	});

	// Discount code validator - depends on orderTotal
	const discountCodeValidator = createValidator<string>((value, allValues) => {
		if (!value) return null;
		const total = Number(allValues.orderTotal) || 0;
		if (value === 'VIP50' && total < 100) {
			return t('demo.dependencies.vip_min_order');
		}
		if (value === 'SAVE20' && total < 50) {
			return t('demo.dependencies.save_min_order');
		}
		return null;
	});

	const form = useFormState({
		fields: {
			password: {
				defaultValue: '',
				validator: Validators.minLength(8, t('demo.dependencies.password_min')),
				validateOnChange: true
			},
			confirmPassword: {
				defaultValue: '',
				validator: confirmPasswordValidator,
				dependencies: ['password'], // Re-validate when password changes
				validateOnChange: true
			},
			email: {
				defaultValue: '',
				validator: Validators.email(t('demo.dependencies.email_invalid')),
				validateOnChange: true
			},
			confirmEmail: {
				defaultValue: '',
				validator: confirmEmailValidator,
				dependencies: ['email'], // Re-validate when email changes
				validateOnChange: true
			},
			orderTotal: {
				defaultValue: '',
				validateOnChange: true
			},
			discountCode: {
				defaultValue: '',
				validator: discountCodeValidator,
				dependencies: ['orderTotal'], // Re-validate when order total changes
				validateOnChange: true
			}
		}
	});

	function resetForm() {
		form.reset();
	}

	const codeExample = `import { useFormState, createValidator, Validators } from '@shelchin/formstate';

// Validator that accesses other field values
const confirmPasswordValidator = createValidator((value, allValues) => {
  if (value !== allValues.password) {
    return 'Passwords do not match';
  }
  return null;
});

// Discount code validator depends on order total
const discountCodeValidator = createValidator((value, allValues) => {
  const total = Number(allValues.orderTotal) || 0;
  if (value === 'VIP50' && total < 100) {
    return 'VIP50 requires minimum order of $100';
  }
  return null;
});

const form = useFormState({
  fields: {
    password: {
      defaultValue: '',
      validator: Validators.minLength(8),
      validateOnChange: true
    },
    confirmPassword: {
      defaultValue: '',
      validator: confirmPasswordValidator,
      dependencies: ['password'], // Re-validates when password changes
      validateOnChange: true
    },
    orderTotal: {
      defaultValue: '',
      validateOnChange: true
    },
    discountCode: {
      defaultValue: '',
      validator: discountCodeValidator,
      dependencies: ['orderTotal'], // Re-validates when orderTotal changes
      validateOnChange: true
    }
  }
});`;
</script>

<DemoSection title={t('demo.dependencies.title')} description={t('demo.dependencies.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="demo-section">
				<h4 class="section-title">
					<Link size={14} />
					{t('demo.dependencies.password_section')}
				</h4>
				<InputGroup label={t('demo.dependencies.password')} id="dep-password">
					<input
						id="dep-password"
						type="password"
						value={form.values.password}
						oninput={(e) => form.setValue('password', e.currentTarget.value)}
						onblur={() => form.setFieldTouched('password', true)}
						placeholder={t('demo.dependencies.password_placeholder')}
						class:has-error={form.errors.password}
					/>
					{#if form.errors.password}
						<span class="field-error">{form.errors.password}</span>
					{/if}
				</InputGroup>

				<InputGroup label={t('demo.dependencies.confirm_password')} id="dep-confirm-password">
					<div class="input-with-icon">
						<Link size={14} class="dep-icon" />
						<input
							id="dep-confirm-password"
							type="password"
							value={form.values.confirmPassword}
							oninput={(e) => form.setValue('confirmPassword', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('confirmPassword', true)}
							placeholder={t('demo.dependencies.confirm_placeholder')}
							class:has-error={form.errors.confirmPassword}
						/>
					</div>
					<span class="hint">{t('demo.dependencies.password_hint')}</span>
					{#if form.errors.confirmPassword}
						<span class="field-error">{form.errors.confirmPassword}</span>
					{/if}
				</InputGroup>
			</div>

			<div class="demo-section">
				<h4 class="section-title">
					<Link size={14} />
					{t('demo.dependencies.email_section')}
				</h4>
				<InputGroup label={t('demo.dependencies.email')} id="dep-email">
					<input
						id="dep-email"
						type="email"
						value={form.values.email}
						oninput={(e) => form.setValue('email', e.currentTarget.value)}
						onblur={() => form.setFieldTouched('email', true)}
						placeholder={t('demo.dependencies.email_placeholder')}
						class:has-error={form.errors.email}
					/>
					{#if form.errors.email}
						<span class="field-error">{form.errors.email}</span>
					{/if}
				</InputGroup>

				<InputGroup label={t('demo.dependencies.confirm_email')} id="dep-confirm-email">
					<div class="input-with-icon">
						<Link size={14} class="dep-icon" />
						<input
							id="dep-confirm-email"
							type="email"
							value={form.values.confirmEmail}
							oninput={(e) => form.setValue('confirmEmail', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('confirmEmail', true)}
							placeholder={t('demo.dependencies.confirm_email_placeholder')}
							class:has-error={form.errors.confirmEmail}
						/>
					</div>
					<span class="hint">{t('demo.dependencies.email_hint')}</span>
					{#if form.errors.confirmEmail}
						<span class="field-error">{form.errors.confirmEmail}</span>
					{/if}
				</InputGroup>
			</div>

			<div class="demo-section">
				<h4 class="section-title">
					<Link size={14} />
					{t('demo.dependencies.discount_section')}
				</h4>
				<InputGroup label={t('demo.dependencies.order_total')} id="dep-order-total">
					<input
						id="dep-order-total"
						type="number"
						value={form.values.orderTotal}
						oninput={(e) => form.setValue('orderTotal', e.currentTarget.value)}
						placeholder={t('demo.dependencies.order_placeholder')}
					/>
				</InputGroup>

				<InputGroup label={t('demo.dependencies.discount_code')} id="dep-discount">
					<div class="input-with-icon">
						<Link size={14} class="dep-icon" />
						<input
							id="dep-discount"
							type="text"
							value={form.values.discountCode}
							oninput={(e) => form.setValue('discountCode', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('discountCode', true)}
							placeholder={t('demo.dependencies.discount_placeholder')}
							class:has-error={form.errors.discountCode}
						/>
					</div>
					<span class="hint">{t('demo.dependencies.discount_hint')}</span>
					{#if form.errors.discountCode}
						<span class="field-error">{form.errors.discountCode}</span>
					{/if}
				</InputGroup>
			</div>

			<ActionButtons>
				<DemoButton variant="secondary" onclick={resetForm}>
					{t('demo.dependencies.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>{t('demo.dependencies.validation_status')}</h4>
				<div class="status-list">
					<div class="status-item">
						<span class="status-label">{t('demo.dependencies.password')}</span>
						{#if form.values.password && !form.errors.password}
							<CheckCircle size={16} class="status-valid" />
						{:else if form.errors.password}
							<XCircle size={16} class="status-error" />
						{:else}
							<span class="status-pending">-</span>
						{/if}
					</div>
					<div class="status-item">
						<span class="status-label">{t('demo.dependencies.confirm_password')}</span>
						{#if form.values.confirmPassword && !form.errors.confirmPassword}
							<CheckCircle size={16} class="status-valid" />
						{:else if form.errors.confirmPassword}
							<XCircle size={16} class="status-error" />
						{:else}
							<span class="status-pending">-</span>
						{/if}
					</div>
					<div class="status-item">
						<span class="status-label">{t('demo.dependencies.email')}</span>
						{#if form.values.email && !form.errors.email}
							<CheckCircle size={16} class="status-valid" />
						{:else if form.errors.email}
							<XCircle size={16} class="status-error" />
						{:else}
							<span class="status-pending">-</span>
						{/if}
					</div>
					<div class="status-item">
						<span class="status-label">{t('demo.dependencies.confirm_email')}</span>
						{#if form.values.confirmEmail && !form.errors.confirmEmail}
							<CheckCircle size={16} class="status-valid" />
						{:else if form.errors.confirmEmail}
							<XCircle size={16} class="status-error" />
						{:else}
							<span class="status-pending">-</span>
						{/if}
					</div>
					<div class="status-item">
						<span class="status-label">{t('demo.dependencies.discount_code')}</span>
						{#if form.values.discountCode && !form.errors.discountCode}
							<CheckCircle size={16} class="status-valid" />
						{:else if form.errors.discountCode}
							<XCircle size={16} class="status-error" />
						{:else}
							<span class="status-pending">-</span>
						{/if}
					</div>
				</div>

				<div class="info-box">
					<p>{t('demo.dependencies.info')}</p>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.dependencies')} code={codeExample} />
</DemoSection>

<style>
	.demo-section {
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-4);
		border-bottom: 1px solid var(--color-border);
	}

	.demo-section:last-of-type {
		border-bottom: none;
		margin-bottom: 0;
		padding-bottom: 0;
	}

	.section-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.input-with-icon {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-with-icon input {
		flex: 1;
		padding-left: var(--space-8);
	}

	:global(.dep-icon) {
		position: absolute;
		left: var(--space-3);
		color: var(--color-muted-foreground);
	}

	.hint {
		display: block;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin-top: var(--space-1);
	}

	.result-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.result-panel h4 {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.status-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.status-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.status-label {
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	:global(.status-valid) {
		color: var(--color-success);
	}

	:global(.status-error) {
		color: var(--color-danger);
	}

	.status-pending {
		color: var(--color-muted-foreground);
	}

	.info-box {
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.info-box p {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
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
		display: block;
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}
</style>

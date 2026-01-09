<script lang="ts">
	/**
	 * Transformers Demo
	 * Demonstrates input transformers for automatic value normalization.
	 * Includes both built-in and custom transformers.
	 */
	import { useFormState, Transformers, Validators } from '@shelchin/formstate';
	import type { ITransformer } from '@shelchin/formstate';
	import { Wand2 } from '@lucide/svelte';
	import { DemoSection, DemoContent, CodeBlock, InputGroup } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Custom transformer: Phone number formatter
	const phoneFormatter: ITransformer<string, string> = {
		transform: (value: string) => {
			const digits = value.replace(/\D/g, '');
			if (digits.length <= 3) return digits;
			if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
			return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
		}
	};

	// Custom transformer: Credit card formatter
	const creditCardFormatter: ITransformer<string, string> = {
		transform: (value: string) => {
			const digits = value.replace(/\D/g, '').slice(0, 16);
			const groups = digits.match(/.{1,4}/g);
			return groups ? groups.join(' ') : digits;
		}
	};

	// Custom transformer: Currency formatter
	const currencyFormatter: ITransformer<string, string> = {
		transform: (value: string) => {
			const num = parseFloat(value.replace(/[^\d.]/g, ''));
			if (isNaN(num)) return '';
			return num.toFixed(2);
		}
	};

	// Custom transformer: URL normalizer
	const urlNormalizer: ITransformer<string, string> = {
		transform: (value: string) => {
			if (!value) return '';
			const trimmed = value.trim().toLowerCase();
			if (!/^https?:\/\//.test(trimmed)) {
				return `https://${trimmed}`;
			}
			return trimmed;
		}
	};

	// Custom transformer: Username normalizer
	const usernameNormalizer: ITransformer<string, string> = {
		transform: (value: string) => {
			return value
				.toLowerCase()
				.replace(/[^a-z0-9_-]/g, '')
				.slice(0, 20);
		}
	};

	const form = useFormState({
		validateOnChange: true,
		fields: {
			// Built-in transformers
			trim: {
				defaultValue: '',
				transformer: Transformers.trim as (value: unknown) => unknown
			},
			uppercase: {
				defaultValue: '',
				transformer: Transformers.toUpperCase as (value: unknown) => unknown
			},
			lowercase: {
				defaultValue: '',
				transformer: Transformers.toLowerCase as (value: unknown) => unknown
			},
			number: {
				defaultValue: '' as string | number,
				transformer: Transformers.toNumber as (value: unknown) => unknown
			},
			composed: {
				defaultValue: '',
				transformer: Transformers.compose(
					Transformers.trim as (value: unknown) => unknown,
					Transformers.toUpperCase as (value: unknown) => unknown
				)
			},
			// Custom transformers
			username: {
				defaultValue: '',
				transformer: usernameNormalizer,
				validator: Validators.minLength(3, t('demo.transformers.username_min'))
			},
			phone: {
				defaultValue: '',
				transformer: phoneFormatter,
				validator: Validators.pattern(/^\d{3}-\d{4}-\d{4}$/, t('demo.transformers.phone_invalid'))
			},
			creditCard: {
				defaultValue: '',
				transformer: creditCardFormatter,
				validator: Validators.pattern(
					/^\d{4} \d{4} \d{4} \d{4}$/,
					t('demo.transformers.card_invalid')
				)
			},
			price: {
				defaultValue: '',
				transformer: currencyFormatter
			},
			website: {
				defaultValue: '',
				transformer: urlNormalizer
			}
		}
	});

	const codeExample = `import { useFormState, Transformers, Validators } from '@shelchin/formstate';
import type { ITransformer } from '@shelchin/formstate';

// Custom transformer: Phone number formatter
const phoneFormatter: ITransformer<string, string> = {
  transform: (value: string) => {
    const digits = value.replace(/\\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return \`\${digits.slice(0, 3)}-\${digits.slice(3)}\`;
    return \`\${digits.slice(0, 3)}-\${digits.slice(3, 7)}-\${digits.slice(7, 11)}\`;
  }
};

// Custom transformer: Credit card formatter
const creditCardFormatter: ITransformer<string, string> = {
  transform: (value: string) => {
    const digits = value.replace(/\\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    return groups ? groups.join(' ') : digits;
  }
};

const form = useFormState({
  fields: {
    // Built-in transformers
    trim: { transformer: Transformers.trim },
    uppercase: { transformer: Transformers.toUpperCase },

    // Composed transformers
    composed: {
      transformer: Transformers.compose(
        Transformers.trim,
        Transformers.toUpperCase
      )
    },

    // Custom transformers
    phone: {
      transformer: phoneFormatter,
      validator: Validators.pattern(/^\\d{3}-\\d{4}-\\d{4}$/, 'Invalid phone')
    },
    creditCard: {
      transformer: creditCardFormatter
    }
  }
});`;
</script>

<DemoSection title={t('demo.transformers.title')} description={t('demo.transformers.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="transformers-form">
				<!-- Built-in Transformers Section -->
				<div class="section">
					<h4 class="section-title">{t('demo.transformers.builtin_title')}</h4>

					<InputGroup label={t('demo.transformers.trim')} id="tf-trim">
						<input
							id="tf-trim"
							type="text"
							value={form.values.trim}
							oninput={(e) => form.setValue('trim', e.currentTarget.value)}
							placeholder={t('demo.transformers.trim_placeholder')}
						/>
						<span class="hint">{t('demo.transformers.trim_hint')}</span>
					</InputGroup>

					<InputGroup label={t('demo.transformers.uppercase')} id="tf-upper">
						<input
							id="tf-upper"
							type="text"
							value={form.values.uppercase}
							oninput={(e) => form.setValue('uppercase', e.currentTarget.value)}
							placeholder={t('demo.transformers.uppercase_placeholder')}
						/>
					</InputGroup>

					<InputGroup label={t('demo.transformers.lowercase')} id="tf-lower">
						<input
							id="tf-lower"
							type="text"
							value={form.values.lowercase}
							oninput={(e) => form.setValue('lowercase', e.currentTarget.value)}
							placeholder={t('demo.transformers.lowercase_placeholder')}
						/>
					</InputGroup>

					<InputGroup label={t('demo.transformers.number')} id="tf-number">
						<input
							id="tf-number"
							type="text"
							value={String(form.values.number)}
							oninput={(e) => form.setValue('number', e.currentTarget.value)}
							placeholder={t('demo.transformers.number_placeholder')}
						/>
						<span class="hint">{t('demo.transformers.number_hint')}</span>
					</InputGroup>

					<InputGroup label={t('demo.transformers.composed')} id="tf-composed">
						<input
							id="tf-composed"
							type="text"
							value={form.values.composed}
							oninput={(e) => form.setValue('composed', e.currentTarget.value)}
							placeholder={t('demo.transformers.composed_placeholder')}
						/>
						<span class="hint">{t('demo.transformers.composed_hint')}</span>
					</InputGroup>
				</div>

				<!-- Custom Transformers Section -->
				<div class="section">
					<h4 class="section-title">{t('demo.transformers.custom_title')}</h4>

					<InputGroup label={t('demo.transformers.username')} id="tf-username">
						<input
							id="tf-username"
							type="text"
							value={form.values.username}
							oninput={(e) => form.setValue('username', e.currentTarget.value)}
							placeholder={t('demo.transformers.username_placeholder')}
							class:has-error={form.errors.username}
						/>
						<span class="hint">{t('demo.transformers.username_hint')}</span>
						{#if form.errors.username}
							<span class="error">{form.errors.username}</span>
						{/if}
					</InputGroup>

					<InputGroup label={t('demo.transformers.phone')} id="tf-phone">
						<input
							id="tf-phone"
							type="tel"
							value={form.values.phone}
							oninput={(e) => form.setValue('phone', e.currentTarget.value)}
							placeholder={t('demo.transformers.phone_placeholder')}
							class:has-error={form.errors.phone}
						/>
						<span class="hint">{t('demo.transformers.phone_hint')}</span>
						{#if form.errors.phone}
							<span class="error">{form.errors.phone}</span>
						{/if}
					</InputGroup>

					<InputGroup label={t('demo.transformers.credit_card')} id="tf-card">
						<input
							id="tf-card"
							type="text"
							value={form.values.creditCard}
							oninput={(e) => form.setValue('creditCard', e.currentTarget.value)}
							placeholder={t('demo.transformers.card_placeholder')}
							class:has-error={form.errors.creditCard}
						/>
						<span class="hint">{t('demo.transformers.card_hint')}</span>
						{#if form.errors.creditCard}
							<span class="error">{form.errors.creditCard}</span>
						{/if}
					</InputGroup>

					<InputGroup label={t('demo.transformers.price')} id="tf-price">
						<div class="input-with-prefix">
							<span class="prefix">$</span>
							<input
								id="tf-price"
								type="text"
								value={form.values.price}
								oninput={(e) => form.setValue('price', e.currentTarget.value)}
								placeholder={t('demo.transformers.price_placeholder')}
							/>
						</div>
						<span class="hint">{t('demo.transformers.price_hint')}</span>
					</InputGroup>

					<InputGroup label={t('demo.transformers.website')} id="tf-website">
						<input
							id="tf-website"
							type="url"
							value={form.values.website}
							oninput={(e) => form.setValue('website', e.currentTarget.value)}
							placeholder={t('demo.transformers.website_placeholder')}
						/>
						<span class="hint">{t('demo.transformers.website_hint')}</span>
					</InputGroup>
				</div>
			</div>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>
					<Wand2 size={16} />
					{t('demo.transformers.transformed_values')}
				</h4>

				<!-- Built-in values -->
				<div class="value-section">
					<span class="section-label">{t('demo.transformers.builtin_title')}</span>
					<div class="value-list">
						<div class="value-item">
							<span class="label">trim:</span>
							<span class="value">"{form.values.trim}"</span>
							<span class="meta">({String(form.values.trim).length} chars)</span>
						</div>
						<div class="value-item">
							<span class="label">uppercase:</span>
							<span class="value">"{form.values.uppercase}"</span>
						</div>
						<div class="value-item">
							<span class="label">lowercase:</span>
							<span class="value">"{form.values.lowercase}"</span>
						</div>
						<div class="value-item">
							<span class="label">number:</span>
							<span class="value">{form.values.number}</span>
							<span class="meta">({typeof form.values.number})</span>
						</div>
						<div class="value-item">
							<span class="label">composed:</span>
							<span class="value">"{form.values.composed}"</span>
						</div>
					</div>
				</div>

				<!-- Custom values -->
				<div class="value-section">
					<span class="section-label">{t('demo.transformers.custom_title')}</span>
					<div class="value-list">
						<div class="value-item">
							<span class="label">username:</span>
							<span class="value">"{form.values.username}"</span>
						</div>
						<div class="value-item">
							<span class="label">phone:</span>
							<span class="value">"{form.values.phone}"</span>
						</div>
						<div class="value-item">
							<span class="label">creditCard:</span>
							<span class="value">"{form.values.creditCard}"</span>
						</div>
						<div class="value-item">
							<span class="label">price:</span>
							<span class="value">{form.values.price ? `$${form.values.price}` : '""'}</span>
						</div>
						<div class="value-item">
							<span class="label">website:</span>
							<span class="value url">"{form.values.website}"</span>
						</div>
					</div>
				</div>

				<!-- Transformer list -->
				<div class="transformer-list">
					<span class="section-label">{t('demo.transformers.available')}</span>
					<div class="transformer-items">
						<code>Transformers.trim</code>
						<code>Transformers.toUpperCase</code>
						<code>Transformers.toLowerCase</code>
						<code>Transformers.toNumber</code>
						<code>Transformers.compose(...)</code>
					</div>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.transformers')} code={codeExample} />
</DemoSection>

<style>
	.transformers-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.section {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.section-title {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.result-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.result-panel h4 {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: 0;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.value-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.section-label {
		font-size: var(--text-xs);
		font-weight: 600;
		color: var(--color-muted-foreground);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.value-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.value-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.label {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		min-width: 80px;
	}

	.value {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-sm);
		color: var(--color-primary);
		flex: 1;
		word-break: break-all;
	}

	.value.url {
		font-size: var(--text-xs);
	}

	.meta {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.transformer-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.transformer-items {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.transformer-items code {
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-primary);
	}

	.hint {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin-top: var(--space-1);
	}

	.error {
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}

	.input-with-prefix {
		position: relative;
		display: flex;
		align-items: center;
	}

	.prefix {
		position: absolute;
		left: 12px;
		color: var(--color-muted-foreground);
		font-weight: 500;
		font-size: var(--text-sm);
	}

	.input-with-prefix input {
		padding-left: 1.75rem;
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
</style>

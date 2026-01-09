<script lang="ts">
	/**
	 * Conditional Fields Demo
	 * Demonstrates conditional field visibility based on other field values.
	 */
	import { useFormState, Validators } from '@shelchin/formstate';
	import { Eye, EyeOff, Package, Truck, CreditCard } from '@lucide/svelte';
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

	const form = useFormState({
		fields: {
			orderType: {
				defaultValue: 'digital',
				validateOnChange: true
			},
			email: {
				defaultValue: '',
				validator: Validators.email(t('demo.conditional.email_invalid')),
				validateOnChange: true
			},
			// Physical order fields
			shippingAddress: {
				defaultValue: '',
				validator: Validators.required(t('demo.conditional.required')),
				validateOnChange: true
			},
			city: {
				defaultValue: '',
				validator: Validators.required(t('demo.conditional.required')),
				validateOnChange: true
			},
			zipCode: {
				defaultValue: '',
				validator: Validators.pattern(/^\d{5,6}$/, t('demo.conditional.zip_invalid')),
				validateOnChange: true
			},
			// Payment method
			paymentMethod: {
				defaultValue: 'card',
				validateOnChange: true
			},
			// Card fields
			cardNumber: {
				defaultValue: '',
				validator: Validators.pattern(/^\d{16}$/, t('demo.conditional.card_invalid')),
				validateOnChange: true
			},
			cardExpiry: {
				defaultValue: '',
				validator: Validators.pattern(/^\d{2}\/\d{2}$/, t('demo.conditional.expiry_invalid')),
				validateOnChange: true
			},
			// Bank transfer fields
			bankAccount: {
				defaultValue: '',
				validator: Validators.required(t('demo.conditional.required')),
				validateOnChange: true
			}
		}
	});

	// Conditional visibility logic
	const showShippingFields = $derived(form.values.orderType === 'physical');
	const showCardFields = $derived(form.values.paymentMethod === 'card');
	const showBankFields = $derived(form.values.paymentMethod === 'bank');

	function resetForm() {
		form.reset();
	}

	const codeExample = `import { useFormState, Validators } from '@shelchin/formstate';

const form = useFormState({
  fields: {
    orderType: { defaultValue: 'digital' },
    email: {
      defaultValue: '',
      validator: Validators.email('Invalid email')
    },
    // Physical order fields
    shippingAddress: {
      defaultValue: '',
      validator: Validators.required('Required')
    },
    city: { defaultValue: '' },
    zipCode: {
      defaultValue: '',
      validator: Validators.pattern(/^\\d{5,6}$/, 'Invalid zip code')
    },
    // Payment fields
    paymentMethod: { defaultValue: 'card' },
    cardNumber: {
      defaultValue: '',
      validator: Validators.pattern(/^\\d{16}$/, 'Invalid card number')
    },
    bankAccount: { defaultValue: '' }
  }
});

// Conditional visibility using derived state
const showShippingFields = $derived(form.values.orderType === 'physical');
const showCardFields = $derived(form.values.paymentMethod === 'card');
const showBankFields = $derived(form.values.paymentMethod === 'bank');

// In template:
// {#if showShippingFields}
//   <input bind:value={form.values.shippingAddress} />
// {/if}`;
</script>

<DemoSection title={t('demo.conditional.title')} description={t('demo.conditional.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="demo-section">
				<h4 class="section-title">
					<Package size={14} />
					{t('demo.conditional.order_type')}
				</h4>
				<div class="radio-group">
					<label class="radio-label">
						<input
							type="radio"
							name="orderType"
							value="digital"
							checked={form.values.orderType === 'digital'}
							onchange={() => form.setValue('orderType', 'digital')}
						/>
						<span>{t('demo.conditional.digital')}</span>
					</label>
					<label class="radio-label">
						<input
							type="radio"
							name="orderType"
							value="physical"
							checked={form.values.orderType === 'physical'}
							onchange={() => form.setValue('orderType', 'physical')}
						/>
						<span>{t('demo.conditional.physical')}</span>
					</label>
				</div>
			</div>

			<InputGroup label={t('demo.conditional.email')} id="cond-email">
				<input
					id="cond-email"
					type="email"
					value={form.values.email}
					oninput={(e) => form.setValue('email', e.currentTarget.value)}
					placeholder={t('demo.conditional.email_placeholder')}
					class:has-error={form.errors.email}
				/>
				{#if form.errors.email}
					<span class="field-error">{form.errors.email}</span>
				{/if}
			</InputGroup>

			{#if showShippingFields}
				<div class="conditional-section" transition:slide>
					<h4 class="section-title">
						<Truck size={14} />
						{t('demo.conditional.shipping_info')}
					</h4>
					<InputGroup label={t('demo.conditional.address')} id="cond-address">
						<input
							id="cond-address"
							type="text"
							value={form.values.shippingAddress}
							oninput={(e) => form.setValue('shippingAddress', e.currentTarget.value)}
							placeholder={t('demo.conditional.address_placeholder')}
							class:has-error={form.errors.shippingAddress}
						/>
						{#if form.errors.shippingAddress}
							<span class="field-error">{form.errors.shippingAddress}</span>
						{/if}
					</InputGroup>

					<div class="field-row">
						<InputGroup label={t('demo.conditional.city')} id="cond-city">
							<input
								id="cond-city"
								type="text"
								value={form.values.city}
								oninput={(e) => form.setValue('city', e.currentTarget.value)}
								placeholder={t('demo.conditional.city_placeholder')}
								class:has-error={form.errors.city}
							/>
							{#if form.errors.city}
								<span class="field-error">{form.errors.city}</span>
							{/if}
						</InputGroup>

						<InputGroup label={t('demo.conditional.zip')} id="cond-zip">
							<input
								id="cond-zip"
								type="text"
								value={form.values.zipCode}
								oninput={(e) => form.setValue('zipCode', e.currentTarget.value)}
								placeholder={t('demo.conditional.zip_placeholder')}
								class:has-error={form.errors.zipCode}
							/>
							{#if form.errors.zipCode}
								<span class="field-error">{form.errors.zipCode}</span>
							{/if}
						</InputGroup>
					</div>
				</div>
			{/if}

			<div class="demo-section">
				<h4 class="section-title">
					<CreditCard size={14} />
					{t('demo.conditional.payment_method')}
				</h4>
				<div class="radio-group">
					<label class="radio-label">
						<input
							type="radio"
							name="paymentMethod"
							value="card"
							checked={form.values.paymentMethod === 'card'}
							onchange={() => form.setValue('paymentMethod', 'card')}
						/>
						<span>{t('demo.conditional.credit_card')}</span>
					</label>
					<label class="radio-label">
						<input
							type="radio"
							name="paymentMethod"
							value="bank"
							checked={form.values.paymentMethod === 'bank'}
							onchange={() => form.setValue('paymentMethod', 'bank')}
						/>
						<span>{t('demo.conditional.bank_transfer')}</span>
					</label>
				</div>
			</div>

			{#if showCardFields}
				<div class="conditional-section">
					<div class="field-row">
						<InputGroup label={t('demo.conditional.card_number')} id="cond-card">
							<input
								id="cond-card"
								type="text"
								value={form.values.cardNumber}
								oninput={(e) => form.setValue('cardNumber', e.currentTarget.value)}
								placeholder={t('demo.conditional.card_placeholder')}
								class:has-error={form.errors.cardNumber}
							/>
							{#if form.errors.cardNumber}
								<span class="field-error">{form.errors.cardNumber}</span>
							{/if}
						</InputGroup>

						<InputGroup label={t('demo.conditional.expiry')} id="cond-expiry">
							<input
								id="cond-expiry"
								type="text"
								value={form.values.cardExpiry}
								oninput={(e) => form.setValue('cardExpiry', e.currentTarget.value)}
								placeholder={t('demo.conditional.expiry_placeholder')}
								class:has-error={form.errors.cardExpiry}
							/>
							{#if form.errors.cardExpiry}
								<span class="field-error">{form.errors.cardExpiry}</span>
							{/if}
						</InputGroup>
					</div>
				</div>
			{/if}

			{#if showBankFields}
				<div class="conditional-section">
					<InputGroup label={t('demo.conditional.bank_account')} id="cond-bank">
						<input
							id="cond-bank"
							type="text"
							value={form.values.bankAccount}
							oninput={(e) => form.setValue('bankAccount', e.currentTarget.value)}
							placeholder={t('demo.conditional.bank_placeholder')}
							class:has-error={form.errors.bankAccount}
						/>
						{#if form.errors.bankAccount}
							<span class="field-error">{form.errors.bankAccount}</span>
						{/if}
					</InputGroup>
				</div>
			{/if}

			<ActionButtons>
				<DemoButton variant="secondary" onclick={resetForm}>
					{t('demo.conditional.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>{t('demo.conditional.visible_fields')}</h4>
				<div class="visibility-status">
					<div class="status-item">
						<span class="status-label">{t('demo.conditional.shipping_fields')}</span>
						{#if showShippingFields}
							<Eye size={16} class="status-visible" />
						{:else}
							<EyeOff size={16} class="status-hidden" />
						{/if}
					</div>
					<div class="status-item">
						<span class="status-label">{t('demo.conditional.card_fields')}</span>
						{#if showCardFields}
							<Eye size={16} class="status-visible" />
						{:else}
							<EyeOff size={16} class="status-hidden" />
						{/if}
					</div>
					<div class="status-item">
						<span class="status-label">{t('demo.conditional.bank_fields')}</span>
						{#if showBankFields}
							<Eye size={16} class="status-visible" />
						{:else}
							<EyeOff size={16} class="status-hidden" />
						{/if}
					</div>
				</div>

				<div class="form-summary">
					<h4>{t('demo.conditional.form_values')}</h4>
					<pre>{JSON.stringify(form.values, null, 2)}</pre>
				</div>

				<div class="info-box">
					<p>{t('demo.conditional.info')}</p>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.conditional')} code={codeExample} />
</DemoSection>

<style>
	.demo-section {
		margin-bottom: var(--space-4);
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

	.radio-group {
		display: flex;
		gap: var(--space-4);
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		color: var(--color-foreground);
		cursor: pointer;
	}

	.radio-label input {
		width: auto;
	}

	.conditional-section {
		padding: var(--space-4);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin-bottom: var(--space-4);
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-4);
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

	.visibility-status {
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

	:global(.status-visible) {
		color: var(--color-success);
	}

	:global(.status-hidden) {
		color: var(--color-muted-foreground);
	}

	.form-summary {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-summary pre {
		margin: 0;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
		max-height: 150px;
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

	@media (max-width: 640px) {
		.field-row {
			grid-template-columns: 1fr;
		}
	}
</style>

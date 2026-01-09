<script lang="ts">
	/**
	 * Basic Usage Demo
	 * Demonstrates simple form field registration and value binding.
	 */
	import { useFormState, Validators } from '@shelchin/formstate';
	import { RotateCcw, Send } from '@lucide/svelte';
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
		fields: {
			name: {
				defaultValue: '',
				validator: Validators.required(requiredMsg)
			},
			email: {
				defaultValue: '',
				validator: Validators.email(invalidEmailMsg)
			}
		}
	});

	let submitResult = $state<{ success: boolean; data?: Record<string, unknown> } | null>(null);

	async function handleSubmit() {
		const result = await form.submit(async (values) => {
			// Simulate API call
			await new Promise((r) => setTimeout(r, 500));
			submitResult = { success: true, data: values };
		});
		if (!result) {
			submitResult = { success: false };
		}
	}

	function handleReset() {
		form.reset();
		submitResult = null;
	}

	const codeExample = `import { useFormState, Validators } from '@shelchin/formstate';

const form = useFormState({
  fields: {
    name: {
      defaultValue: '',
      validator: Validators.required('Name is required')
    },
    email: {
      defaultValue: '',
      validator: Validators.email('Invalid email')
    }
  }
});

// Use value + oninput for proper state tracking
<input
  value={form.values.name}
  oninput={(e) => form.setValue('name', e.currentTarget.value)}
/>

// Submit
await form.submit(async (values) => {
  await api.saveUser(values);
});`;
</script>

<DemoSection title={t('demo.basic.title')} description={t('demo.basic.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.basic.name')} id="basic-name">
				<input
					id="basic-name"
					type="text"
					value={form.values.name}
					oninput={(e) => form.setValue('name', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('name', true)}
					placeholder={t('demo.basic.name_placeholder')}
					class:has-error={form.errors.name}
				/>
				{#if form.errors.name}
					<span class="field-error">{form.errors.name}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.basic.email')} id="basic-email">
				<input
					id="basic-email"
					type="email"
					value={form.values.email}
					oninput={(e) => form.setValue('email', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('email', true)}
					placeholder={t('demo.basic.email_placeholder')}
					class:has-error={form.errors.email}
				/>
				{#if form.errors.email}
					<span class="field-error">{form.errors.email}</span>
				{/if}
			</InputGroup>

			<ActionButtons>
				<DemoButton
					variant="success"
					icon={Send}
					onclick={handleSubmit}
					loading={form.isSubmitting}
					disabled={form.isSubmitting}
				>
					{t('demo.basic.submit')}
				</DemoButton>
				<DemoButton variant="outline" icon={RotateCcw} onclick={handleReset}>
					{t('demo.basic.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="result-section">
					<h4>{t('demo.basic.form_values')}</h4>
					<pre class="json-display">{JSON.stringify(form.values, null, 2)}</pre>
				</div>

				<div class="result-section">
					<h4>{t('demo.basic.form_state')}</h4>
					<div class="state-grid">
						<div class="state-item">
							<span class="state-label">{t('demo.basic.is_dirty')}</span>
							<span class="state-value" class:active={form.isDirty}>
								{form.isDirty ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="state-item">
							<span class="state-label">{t('demo.basic.is_valid')}</span>
							<span class="state-value" class:active={form.isValid}>
								{form.isValid ? 'Yes' : 'No'}
							</span>
						</div>
						<div class="state-item">
							<span class="state-label">{t('demo.basic.is_submitting')}</span>
							<span class="state-value" class:active={form.isSubmitting}>
								{form.isSubmitting ? 'Yes' : 'No'}
							</span>
						</div>
					</div>
				</div>

				{#if submitResult}
					<div class="result-section">
						<h4>{t('demo.submit.submit_result')}</h4>
						<div class="submit-result" class:success={submitResult.success}>
							{#if submitResult.success}
								<span class="success-text">{t('demo.submit.success')}</span>
								<pre class="json-display">{JSON.stringify(submitResult.data, null, 2)}</pre>
							{:else}
								<span class="error-text">{t('demo.submit.failed')}</span>
							{/if}
						</div>
					</div>
				{/if}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.basic_usage')} code={codeExample} />
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
		margin-bottom: var(--space-2);
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

	.state-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-3);
	}

	.state-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.state-label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin-bottom: var(--space-1);
	}

	.state-value {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-muted-foreground);
	}

	.state-value.active {
		color: var(--color-success);
	}

	.submit-result {
		padding: var(--space-3);
		border-radius: var(--radius);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
	}

	.submit-result.success {
		border-color: var(--color-success);
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
	}

	.success-text {
		color: var(--color-success);
		font-weight: 600;
		display: block;
		margin-bottom: var(--space-2);
	}

	.error-text {
		color: var(--color-danger);
		font-weight: 600;
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

	@media (max-width: 640px) {
		.state-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

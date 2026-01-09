<script lang="ts">
	/**
	 * Headless Components Demo
	 * Demonstrates Form, FormField, and FieldArray headless components.
	 */
	import { useFormState, Validators, Form, FormField, FieldArray } from '@shelchin/formstate';
	import { Plus, Trash2, Layers } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const requiredMsg = t('messages.required');

	const form = useFormState({
		validateOnChange: true,
		fields: {
			fullName: {
				defaultValue: '',
				validator: Validators.required(requiredMsg)
			},
			email: {
				defaultValue: '',
				validator: Validators.email(t('messages.invalid_email'))
			},
			skills: {
				defaultValue: ['JavaScript']
			}
		}
	});

	const codeExample = `import { useFormState, Form, FormField, FieldArray, Validators } from '@shelchin/formstate';

const form = useFormState({
  fields: {
    fullName: {
      defaultValue: '',
      validator: Validators.required()
    },
    email: {
      defaultValue: '',
      validator: Validators.email()
    },
    skills: {
      defaultValue: ['JavaScript']
    }
  }
});

// In your template:
<Form formState={form}>
  <!-- FormField provides render props for full control -->
  <FormField name="fullName" label="Full Name">
    {#snippet children({ value, error, touched, onInput, onBlur })}
      <input
        type="text"
        value={value}
        oninput={(e) => onInput(e.currentTarget.value)}
        onblur={onBlur}
        class:error={touched && error}
      />
    {/snippet}
  </FormField>

  <!-- FieldArray for dynamic lists -->
  <FieldArray name="skills">
    {#snippet children({ fields, append, remove })}
      {#each fields as field (field.key)}
        <div>
          <input
            value={form.getValue(field.name)}
            oninput={(e) => form.setValue(field.name, e.currentTarget.value)}
          />
          <button onclick={() => remove(field.index)}>Remove</button>
        </div>
      {/each}
      <button onclick={() => append('')}>Add Skill</button>
    {/snippet}
  </FieldArray>
</Form>`;
</script>

<DemoSection title={t('demo.headless.title')} description={t('demo.headless.description')}>
	<DemoContent>
		{#snippet panel()}
			<Form formState={form} class="headless-form">
				<FormField name="fullName" label={t('demo.headless.full_name')}>
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="text"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder={t('demo.headless.full_name_placeholder')}
							class:has-error={touched && error}
						/>
						{#if touched && error}
							<span class="field-error">{error}</span>
						{/if}
					{/snippet}
				</FormField>

				<FormField name="email" label={t('demo.headless.email')}>
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="email"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="user@example.com"
							class:has-error={touched && error}
						/>
						{#if touched && error}
							<span class="field-error">{error}</span>
						{/if}
					{/snippet}
				</FormField>

				<div class="field-array-section">
					<label class="section-label">{t('demo.headless.skills')}</label>
					<FieldArray name="skills">
						{#snippet children({ fields, append, remove })}
							<div class="array-items">
								{#each fields as field (field.key)}
									<div class="array-item">
										<input
											type="text"
											value={form.getValue(field.name)}
											oninput={(e) => form.setValue(field.name, e.currentTarget.value)}
											placeholder={t('demo.headless.skill_placeholder')}
										/>
										<button
											type="button"
											class="remove-btn"
											onclick={() => remove(field.index)}
											aria-label={t('actions.remove')}
										>
											<Trash2 size={16} />
										</button>
									</div>
								{/each}
							</div>
							<ActionButtons>
								<DemoButton variant="secondary" icon={Plus} onclick={() => append('')}>
									{t('demo.headless.add_skill')}
								</DemoButton>
							</ActionButtons>
						{/snippet}
					</FieldArray>
				</div>
			</Form>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>
					<Layers size={16} />
					{t('demo.headless.form_values')}
				</h4>
				<pre><code>{JSON.stringify(form.values, null, 2)}</code></pre>

				<div class="component-list">
					<div class="component-item">
						<span class="component-name">&lt;Form&gt;</span>
						<span class="component-desc">{t('demo.headless.form_desc')}</span>
					</div>
					<div class="component-item">
						<span class="component-name">&lt;FormField&gt;</span>
						<span class="component-desc">{t('demo.headless.formfield_desc')}</span>
					</div>
					<div class="component-item">
						<span class="component-name">&lt;FieldArray&gt;</span>
						<span class="component-desc">{t('demo.headless.fieldarray_desc')}</span>
					</div>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.headless')} code={codeExample} />
</DemoSection>

<style>
	:global(.headless-form) {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.field-array-section {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.section-label {
		font-weight: 500;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.array-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.array-item {
		display: flex;
		gap: var(--space-2);
	}

	.array-item input {
		flex: 1;
	}

	.remove-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-2);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		color: var(--color-danger);
		cursor: pointer;
		transition: all 0.2s;
	}

	.remove-btn:hover {
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		border-color: var(--color-danger);
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

	.result-panel pre {
		margin: 0;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		overflow-x: auto;
	}

	.result-panel code {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.component-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.component-item {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.component-name {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-sm);
		color: var(--color-primary);
	}

	.component-desc {
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
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}
</style>

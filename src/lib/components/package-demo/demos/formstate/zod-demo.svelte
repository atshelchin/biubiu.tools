<script lang="ts">
	/**
	 * Zod Integration Demo
	 * Demonstrates using Zod schemas for form validation.
	 */
	import { useFormState } from '@shelchin/formstate';
	import { zodValidator } from '@shelchin/formstate/zod';
	import { z } from 'zod';
	import { CheckCircle, XCircle, FileCode } from '@lucide/svelte';
	import { DemoSection, DemoContent, CodeBlock, InputGroup } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Define Zod schemas
	const usernameSchema = z
		.string()
		.min(3, 'Username must be at least 3 characters')
		.max(20, 'Username must be at most 20 characters')
		.regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed');

	const emailSchema = z.string().email('Invalid email address');

	const ageSchema = z.coerce
		.number()
		.int('Age must be an integer')
		.min(18, 'Must be at least 18 years old')
		.max(120, 'Please enter a valid age');

	const urlSchema = z.string().url('Invalid URL format').optional().or(z.literal(''));

	const form = useFormState({
		validateOnChange: true,
		fields: {
			username: {
				defaultValue: '',
				validator: zodValidator(usernameSchema)
			},
			email: {
				defaultValue: '',
				validator: zodValidator(emailSchema)
			},
			age: {
				defaultValue: '',
				validator: zodValidator(ageSchema)
			},
			website: {
				defaultValue: '',
				validator: zodValidator(urlSchema)
			}
		}
	});

	const allFieldsValid = $derived(
		!form.errors.username &&
			!form.errors.email &&
			!form.errors.age &&
			form.values.username !== '' &&
			form.values.email !== '' &&
			form.values.age !== ''
	);

	const zodSchemaCode = `import { z } from 'zod';

// Username: 3-20 chars, alphanumeric + underscore
const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores');

// Email validation
const emailSchema = z.string().email('Invalid email');

// Age: integer between 18-120
const ageSchema = z.coerce.number()
  .int('Age must be an integer')
  .min(18, 'Must be at least 18')
  .max(120, 'Please enter a valid age');

// Optional URL
const urlSchema = z.string().url('Invalid URL').optional().or(z.literal(''));`;

	const codeExample = `import { useFormState } from '@shelchin/formstate';
import { zodValidator } from '@shelchin/formstate/zod';
import { z } from 'zod';

const form = useFormState({
  validateOnChange: true,
  fields: {
    username: {
      defaultValue: '',
      validator: zodValidator(usernameSchema)
    },
    email: {
      defaultValue: '',
      validator: zodValidator(emailSchema)
    },
    age: {
      defaultValue: '',
      validator: zodValidator(ageSchema)
    },
    website: {
      defaultValue: '',
      validator: zodValidator(urlSchema)
    }
  }
});`;
</script>

<DemoSection title={t('demo.zod.title')} description={t('demo.zod.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.zod.username')} id="zod-username">
				<input
					id="zod-username"
					type="text"
					value={form.values.username}
					oninput={(e) => form.setValue('username', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('username', true)}
					placeholder={t('demo.zod.username_placeholder')}
					class:has-error={form.errors.username}
				/>
				{#if form.errors.username}
					<span class="field-error">{form.errors.username}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.zod.email')} id="zod-email">
				<input
					id="zod-email"
					type="email"
					value={form.values.email}
					oninput={(e) => form.setValue('email', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('email', true)}
					placeholder="user@example.com"
					class:has-error={form.errors.email}
				/>
				{#if form.errors.email}
					<span class="field-error">{form.errors.email}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.zod.age')} id="zod-age">
				<input
					id="zod-age"
					type="number"
					value={form.values.age}
					oninput={(e) => form.setValue('age', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('age', true)}
					placeholder={t('demo.zod.age_placeholder')}
					class:has-error={form.errors.age}
				/>
				{#if form.errors.age}
					<span class="field-error">{form.errors.age}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.zod.website')} id="zod-website">
				<input
					id="zod-website"
					type="url"
					value={form.values.website}
					oninput={(e) => form.setValue('website', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('website', true)}
					placeholder="https://example.com (optional)"
					class:has-error={form.errors.website}
				/>
				{#if form.errors.website}
					<span class="field-error">{form.errors.website}</span>
				{/if}
			</InputGroup>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="validation-status" class:valid={allFieldsValid}>
					{#if allFieldsValid}
						<CheckCircle size={24} />
						<span>{t('demo.zod.all_valid')}</span>
					{:else}
						<XCircle size={24} />
						<span>{t('demo.zod.has_errors')}</span>
					{/if}
				</div>

				<div class="schema-preview">
					<h4>
						<FileCode size={16} />
						{t('demo.zod.zod_schema')}
					</h4>
					<pre><code>{zodSchemaCode}</code></pre>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.zod')} code={codeExample} />
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

	.schema-preview {
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
	}

	.schema-preview h4 {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin: 0;
		padding: var(--space-3);
		background: var(--color-panel-1);
		border-bottom: 1px solid var(--color-border);
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.schema-preview pre {
		margin: 0;
		padding: var(--space-3);
		overflow-x: auto;
	}

	.schema-preview code {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		white-space: pre;
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

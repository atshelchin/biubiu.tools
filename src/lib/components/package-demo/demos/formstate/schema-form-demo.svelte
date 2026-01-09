<script lang="ts">
	/**
	 * Schema Form Demo
	 * Demonstrates configuration-driven form generation with FormSchema.
	 * Includes custom components: ColorPicker and TagsInput.
	 */
	import { useFormState, Form, Validators, type FormSchema } from '@shelchin/formstate';
	import { Settings, Layout, CheckSquare, Copy, Check, Palette } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';
	import ColorPicker from './components/ColorPicker.svelte';
	import TagsInput from './components/TagsInput.svelte';
	import NotificationToggle from './components/NotificationToggle.svelte';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Define form schema - configuration driven with custom components
	// Use $derived to react to i18n changes
	const userProfileSchema: FormSchema = $derived({
		layout: 'vertical',
		fields: [
			{
				name: 'username',
				type: 'text',
				label: t('demo.schema.username'),
				required: true,
				validator: Validators.required(t('demo.schema.required')),
				placeholder: t('demo.schema.username_placeholder')
			},
			{
				name: 'email',
				type: 'email',
				label: t('demo.schema.email'),
				required: true,
				validator: Validators.compose(
					Validators.required(t('demo.schema.required')),
					Validators.email(t('demo.schema.email_invalid'))
				),
				placeholder: t('demo.schema.email_placeholder')
			},
			// Custom component: Color Picker
			{
				name: 'themeColor',
				type: 'custom',
				label: t('demo.schema.theme_color'),
				component: ColorPicker,
				componentProps: {
					presetColors: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b']
				},
				defaultValue: '#667eea'
			},
			// Custom component: Tags Input
			{
				name: 'skills',
				type: 'custom',
				label: t('demo.schema.skills'),
				component: TagsInput,
				componentProps: {
					placeholder: t('demo.schema.skills_placeholder'),
					suggestions: ['JavaScript', 'TypeScript', 'Svelte', 'React', 'Vue', 'Node.js']
				},
				defaultValue: []
			},
			{
				name: 'role',
				type: 'select',
				label: t('demo.schema.role'),
				options: [
					{ label: t('demo.schema.role_admin'), value: 'admin' },
					{ label: t('demo.schema.role_editor'), value: 'editor' },
					{ label: t('demo.schema.role_viewer'), value: 'viewer' }
				],
				defaultValue: 'viewer'
			},
			// Custom component: Notification Toggle
			{
				name: 'notifications',
				type: 'custom',
				label: t('demo.schema.notifications'),
				component: NotificationToggle,
				componentProps: {
					labels: {
						email: t('demo.schema.notify_email'),
						sms: t('demo.schema.notify_sms'),
						push: t('demo.schema.notify_push')
					}
				},
				defaultValue: { email: true, sms: false, push: false }
			},
			{
				name: 'bio',
				type: 'textarea',
				label: t('demo.schema.bio'),
				placeholder: t('demo.schema.bio_placeholder'),
				validator: Validators.maxLength(200, t('demo.schema.bio_max'))
			}
		]
	});

	const form = useFormState();

	let submitSuccess = $state(false);
	let submittedValues = $state<Record<string, unknown> | null>(null);
	let copySuccess = $state(false);

	async function copyToClipboard() {
		if (submittedValues) {
			try {
				await navigator.clipboard.writeText(JSON.stringify(submittedValues, null, 2));
				copySuccess = true;
				setTimeout(() => (copySuccess = false), 2000);
			} catch {
				// Fallback: do nothing
			}
		}
	}

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('Form submitted:', values);
		submittedValues = values;
		submitSuccess = true;
	}

	function resetForm() {
		form.reset();
		submitSuccess = false;
		submittedValues = null;
	}

	const codeExample = `import { useFormState, Form, Validators, type FormSchema } from '@shelchin/formstate';
import ColorPicker from './ColorPicker.svelte';
import TagsInput from './TagsInput.svelte';

// Define form schema with custom components
const userProfileSchema: FormSchema = {
  layout: 'vertical',
  fields: [
    {
      name: 'username',
      type: 'text',
      label: 'Username',
      required: true,
      validator: Validators.required('Required')
    },
    // Custom component: Color Picker
    {
      name: 'themeColor',
      type: 'custom',
      label: 'Theme Color',
      component: ColorPicker,
      componentProps: {
        presetColors: ['#667eea', '#764ba2', '#f093fb']
      },
      defaultValue: '#667eea'
    },
    // Custom component: Tags Input
    {
      name: 'skills',
      type: 'custom',
      label: 'Skills',
      component: TagsInput,
      componentProps: {
        placeholder: 'Type and press Enter',
        suggestions: ['JavaScript', 'TypeScript', 'Svelte']
      },
      defaultValue: []
    },
    {
      name: 'role',
      type: 'select',
      label: 'Role',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' }
      ],
      defaultValue: 'editor'
    }
  ]
};

const form = useFormState();

// Schema-driven form rendering
<Form formState={form} schema={userProfileSchema} onSubmit={handleSubmit}>
  <!-- Form is automatically generated from schema -->
</Form>`;
</script>

<DemoSection title={t('demo.schema.title')} description={t('demo.schema.description')}>
	<DemoContent>
		{#snippet panel()}
			<div class="schema-form-container">
				<Form formState={form} schema={userProfileSchema} onSubmit={handleSubmit}>
					<!-- Schema renders the form automatically -->
				</Form>

				<ActionButtons>
					<DemoButton variant="primary" onclick={() => form.submit(handleSubmit)}>
						{t('demo.schema.submit')}
					</DemoButton>
					<DemoButton variant="secondary" onclick={resetForm}>
						{t('demo.schema.reset')}
					</DemoButton>
				</ActionButtons>
			</div>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				{#if submitSuccess && submittedValues}
					<div class="submit-success">
						<div class="success-header">
							<Check size={16} />
							<span>{t('demo.schema.submit_success')}</span>
						</div>
						<div class="success-data">
							<div class="data-header">
								<h4>{t('demo.schema.submitted_data')}</h4>
								<button class="btn-copy" onclick={copyToClipboard} title={t('actions.copy')}>
									{#if copySuccess}
										<Check size={14} />
									{:else}
										<Copy size={14} />
									{/if}
								</button>
							</div>
							<pre>{JSON.stringify(submittedValues, null, 2)}</pre>
						</div>
					</div>
				{:else}
					<h4>{t('demo.schema.features')}</h4>
					<div class="feature-list">
						<div class="feature-item">
							<Settings size={16} />
							<div>
								<span class="feature-title">{t('demo.schema.feature_config')}</span>
								<span class="feature-desc">{t('demo.schema.feature_config_desc')}</span>
							</div>
						</div>
						<div class="feature-item">
							<Layout size={16} />
							<div>
								<span class="feature-title">{t('demo.schema.feature_layout')}</span>
								<span class="feature-desc">{t('demo.schema.feature_layout_desc')}</span>
							</div>
						</div>
						<div class="feature-item">
							<CheckSquare size={16} />
							<div>
								<span class="feature-title">{t('demo.schema.feature_types')}</span>
								<span class="feature-desc">{t('demo.schema.feature_types_desc')}</span>
							</div>
						</div>
						<div class="feature-item">
							<Palette size={16} />
							<div>
								<span class="feature-title">{t('demo.schema.feature_custom')}</span>
								<span class="feature-desc">{t('demo.schema.feature_custom_desc')}</span>
							</div>
						</div>
					</div>

					<div class="form-data">
						<h4>{t('demo.schema.current_values')}</h4>
						<pre>{JSON.stringify(form.values, null, 2)}</pre>
					</div>

					<div class="schema-preview">
						<h4>{t('demo.schema.schema_preview')}</h4>
						<details>
							<summary>{t('demo.schema.view_schema')}</summary>
							<pre>{JSON.stringify(userProfileSchema, null, 2)}</pre>
						</details>
					</div>
				{/if}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.schema')} code={codeExample} />
</DemoSection>

<style>
	.schema-form-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.schema-form-container :global(form) {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.schema-form-container :global(.form-field) {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.schema-form-container :global(label) {
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-foreground);
	}

	.schema-form-container :global(input),
	.schema-form-container :global(select),
	.schema-form-container :global(textarea) {
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
	}

	.schema-form-container :global(input:focus),
	.schema-form-container :global(select:focus),
	.schema-form-container :global(textarea:focus) {
		outline: none;
		border-color: var(--color-primary);
	}

	.schema-form-container :global(textarea) {
		min-height: 80px;
		resize: vertical;
		font-family: inherit;
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

	.feature-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.feature-item {
		display: flex;
		gap: var(--space-3);
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.feature-item > div {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.feature-title {
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.feature-desc {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.form-data,
	.schema-preview {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.form-data pre,
	.schema-preview pre {
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

	.schema-preview details {
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-2) var(--space-3);
	}

	.schema-preview summary {
		cursor: pointer;
		font-size: var(--text-sm);
		color: var(--color-primary);
		font-weight: 500;
	}

	.schema-preview details pre {
		margin-top: var(--space-2);
		max-height: 200px;
	}

	.submit-success {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
		border: 1px solid var(--color-success);
		border-radius: var(--radius);
	}

	.success-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-success);
		font-weight: 600;
	}

	.success-data {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.success-data pre {
		margin: 0;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
	}

	.data-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.data-header h4 {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.btn-copy {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-copy:hover {
		background: var(--color-panel-0);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}
</style>

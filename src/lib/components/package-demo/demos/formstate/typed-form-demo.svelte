<script lang="ts">
	/**
	 * Type-Safe Form Demo
	 * Demonstrates useTypedFormState with full TypeScript inference.
	 */
	import { useTypedFormState, Validators } from '@shelchin/formstate';
	import { Code, Sparkles } from '@lucide/svelte';
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

	// Define the form type
	interface UserForm {
		username: string;
		profile: {
			name: string;
			age: number;
			bio: string;
		};
	}

	const form = useTypedFormState<UserForm>({
		initialValues: {
			username: '',
			profile: {
				name: '',
				age: 0,
				bio: ''
			}
		},
		fields: {
			username: {
				validator: Validators.compose(
					Validators.required(),
					Validators.minLength(3),
					Validators.maxLength(20)
				)
			},
			'profile.name': {
				validator: Validators.required()
			}
		}
	});

	const codeExample = `import { useTypedFormState, Validators } from '@shelchin/formstate';

// Define your form type
interface UserForm {
  username: string;
  profile: {
    name: string;
    age: number;
    bio: string;
  };
}

// Create typed form - full autocomplete!
const form = useTypedFormState<UserForm>({
  initialValues: {
    username: '',
    profile: { name: '', age: 0, bio: '' }
  },
  fields: {
    username: { validator: Validators.required() },
    'profile.name': { validator: Validators.required() }
  }
});

// Type-safe access - autocomplete works!
form.getValue('username');         // string
form.getValue('profile.name');     // string
form.getValue('profile.age');      // number

// Type-safe setValue
form.setValue('profile.age', 25);  // OK
form.setValue('profile.age', '25'); // Type error!`;
</script>

<DemoSection title={t('demo.typed.title')} description={t('demo.typed.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.typed.username')} id="typed-username">
				<input
					id="typed-username"
					type="text"
					value={form.getValue('username')}
					oninput={(e) => form.setValue('username', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('username', true)}
					placeholder={t('demo.typed.username_placeholder')}
					class:has-error={form.errors.username}
				/>
				{#if form.errors.username}
					<span class="field-error">{form.errors.username}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.typed.profile_name')} id="typed-profile-name">
				<input
					id="typed-profile-name"
					type="text"
					value={form.getValue('profile.name')}
					oninput={(e) => form.setValue('profile.name', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('profile.name', true)}
					placeholder={t('demo.typed.profile_name_placeholder')}
					class:has-error={form.errors['profile.name']}
				/>
				{#if form.errors['profile.name']}
					<span class="field-error">{form.errors['profile.name']}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.typed.profile_age')} id="typed-profile-age">
				<input
					id="typed-profile-age"
					type="number"
					value={form.getValue('profile.age')}
					oninput={(e) => form.setValue('profile.age', parseInt(e.currentTarget.value) || 0)}
					min="0"
					max="150"
				/>
			</InputGroup>

			<InputGroup label={t('demo.typed.profile_bio')} id="typed-profile-bio">
				<textarea
					id="typed-profile-bio"
					value={form.getValue('profile.bio')}
					oninput={(e) => form.setValue('profile.bio', e.currentTarget.value)}
					placeholder={t('demo.typed.profile_bio_placeholder')}
					rows="3"
				></textarea>
			</InputGroup>

			<ActionButtons>
				<DemoButton variant="primary" icon={Sparkles} onclick={() => form.reset()}>
					{t('demo.basic.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="result-section">
					<div class="section-header">
						<Code size={16} />
						<h4>{t('demo.typed.type_inference')}</h4>
					</div>
					<p class="hint-text">{t('demo.typed.nested_access')}</p>
				</div>

				<div class="result-section">
					<h4>form.values</h4>
					<pre class="json-display">{JSON.stringify(form.values, null, 2)}</pre>
				</div>

				<div class="result-section">
					<h4>Path Examples</h4>
					<div class="path-examples">
						<div class="path-item">
							<code>getValue('username')</code>
							<span class="path-value">"{form.getValue('username')}"</span>
						</div>
						<div class="path-item">
							<code>getValue('profile.name')</code>
							<span class="path-value">"{form.getValue('profile.name')}"</span>
						</div>
						<div class="path-item">
							<code>getValue('profile.age')</code>
							<span class="path-value">{form.getValue('profile.age')}</span>
						</div>
						<div class="path-item">
							<code>getValue('profile.bio')</code>
							<span class="path-value">"{form.getValue('profile.bio')}"</span>
						</div>
					</div>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.typed_form')} code={codeExample} />
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
		margin: 0;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
		color: var(--color-primary);
	}

	.hint-text {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin: 0;
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

	.path-examples {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.path-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-2) var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.path-item code {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-primary);
	}

	.path-value {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-success);
	}

	input,
	textarea {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		font-family: inherit;
		transition: border-color 0.2s;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	input.has-error {
		border-color: var(--color-danger);
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	.field-error {
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}
</style>

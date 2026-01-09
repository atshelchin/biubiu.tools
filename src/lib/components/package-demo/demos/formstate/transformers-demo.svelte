<script lang="ts">
	/**
	 * Transformers Demo
	 * Demonstrates input transformers for automatic value normalization.
	 */
	import { useFormState, Transformers } from '@shelchin/formstate';
	import { Wand2 } from '@lucide/svelte';
	import { DemoSection, DemoContent, CodeBlock, InputGroup } from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const form = useFormState({
		validateOnChange: true,
		fields: {
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
			}
		}
	});

	const codeExample = `import { useFormState, Transformers } from '@shelchin/formstate';

const form = useFormState({
  fields: {
    // Auto-trim whitespace
    trim: {
      defaultValue: '',
      transformer: Transformers.trim
    },

    // Convert to uppercase
    uppercase: {
      defaultValue: '',
      transformer: Transformers.toUpperCase
    },

    // Convert to lowercase
    lowercase: {
      defaultValue: '',
      transformer: Transformers.toLowerCase
    },

    // Parse string to number
    number: {
      defaultValue: '',
      transformer: Transformers.toNumber
    },

    // Compose multiple transformers
    composed: {
      defaultValue: '',
      transformer: Transformers.compose(
        Transformers.trim,
        Transformers.toUpperCase
      )
    }
  }
});`;
</script>

<DemoSection title={t('demo.transformers.title')} description={t('demo.transformers.description')}>
	<DemoContent>
		{#snippet panel()}
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
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>
					<Wand2 size={16} />
					{t('demo.transformers.transformed_values')}
				</h4>
				<div class="value-list">
					<div class="value-item">
						<span class="label">trim:</span>
						<span class="value">"{form.values.trim}"</span>
						<span class="length">({String(form.values.trim).length} chars)</span>
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
						<span class="type">({typeof form.values.number})</span>
					</div>
					<div class="value-item">
						<span class="label">composed:</span>
						<span class="value">"{form.values.composed}"</span>
					</div>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.transformers')} code={codeExample} />
</DemoSection>

<style>
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
	}

	.value {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-sm);
		color: var(--color-primary);
	}

	.length,
	.type {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin-left: auto;
	}

	.hint {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin-top: var(--space-1);
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
</style>

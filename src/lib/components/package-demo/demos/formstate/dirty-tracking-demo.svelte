<script lang="ts">
	/**
	 * Dirty Tracking Demo
	 * Demonstrates tracking which fields have been modified.
	 */
	import { useFormState } from '@shelchin/formstate';
	import { RotateCcw, Edit3, CheckCircle } from '@lucide/svelte';
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
			fieldA: { defaultValue: 'Initial A' },
			fieldB: { defaultValue: 'Initial B' },
			fieldC: { defaultValue: 'Initial C' }
		}
	});

	function resetField(fieldName: string) {
		const initialValue =
			fieldName === 'fieldA' ? 'Initial A' : fieldName === 'fieldB' ? 'Initial B' : 'Initial C';
		form.setValue(fieldName, initialValue);
	}

	const codeExample = `import { useFormState } from '@shelchin/formstate';

const form = useFormState({
  fields: {
    fieldA: { defaultValue: 'Initial A' },
    fieldB: { defaultValue: 'Initial B' },
    fieldC: { defaultValue: 'Initial C' }
  }
});

// Check if form has any changes
form.isDirty  // true if any field is modified

// Get list of dirty field names
form.getDirtyFields()  // ['fieldA', 'fieldC']

// Get only modified values (for PATCH requests)
form.getDirtyValues()  // { fieldA: 'New A', fieldC: 'New C' }

// Reset form to initial values
form.reset();

// Reset a single field
form.setValue('fieldA', 'Initial A');`;
</script>

<DemoSection title={t('demo.dirty.title')} description={t('demo.dirty.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.dirty.field_a')} id="dirty-a">
				<div class="field-with-action">
					<input
						id="dirty-a"
						type="text"
						value={form.values.fieldA}
						oninput={(e) => form.setValue('fieldA', e.currentTarget.value)}
					/>
					{#if form.values.fieldA !== 'Initial A'}
						<button
							class="reset-btn"
							onclick={() => resetField('fieldA')}
							title={t('demo.dirty.reset_field')}
						>
							<RotateCcw size={14} />
						</button>
					{/if}
				</div>
			</InputGroup>

			<InputGroup label={t('demo.dirty.field_b')} id="dirty-b">
				<div class="field-with-action">
					<input
						id="dirty-b"
						type="text"
						value={form.values.fieldB}
						oninput={(e) => form.setValue('fieldB', e.currentTarget.value)}
					/>
					{#if form.values.fieldB !== 'Initial B'}
						<button
							class="reset-btn"
							onclick={() => resetField('fieldB')}
							title={t('demo.dirty.reset_field')}
						>
							<RotateCcw size={14} />
						</button>
					{/if}
				</div>
			</InputGroup>

			<InputGroup label={t('demo.dirty.field_c')} id="dirty-c">
				<div class="field-with-action">
					<input
						id="dirty-c"
						type="text"
						value={form.values.fieldC}
						oninput={(e) => form.setValue('fieldC', e.currentTarget.value)}
					/>
					{#if form.values.fieldC !== 'Initial C'}
						<button
							class="reset-btn"
							onclick={() => resetField('fieldC')}
							title={t('demo.dirty.reset_field')}
						>
							<RotateCcw size={14} />
						</button>
					{/if}
				</div>
			</InputGroup>

			<ActionButtons>
				<DemoButton variant="outline" icon={RotateCcw} onclick={() => form.reset()}>
					{t('demo.basic.reset')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="dirty-status" class:dirty={form.isDirty}>
					{#if form.isDirty}
						<Edit3 size={20} />
						<span>Form has unsaved changes</span>
					{:else}
						<CheckCircle size={20} />
						<span>{t('demo.dirty.no_changes')}</span>
					{/if}
				</div>

				<div class="result-section">
					<h4>{t('demo.dirty.dirty_fields')}</h4>
					<div class="dirty-fields-list">
						{#each form.getDirtyFields() as field (field)}
							<span class="dirty-field-tag">{field}</span>
						{:else}
							<span class="no-dirty">-</span>
						{/each}
					</div>
				</div>

				<div class="result-section">
					<h4>{t('demo.dirty.dirty_values')}</h4>
					<pre class="json-display">{JSON.stringify(form.getDirtyValues(), null, 2)}</pre>
				</div>

				<div class="result-section">
					<h4>All Values</h4>
					<pre class="json-display">{JSON.stringify(form.values, null, 2)}</pre>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title="Dirty Tracking" code={codeExample} />
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

	.dirty-status {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: var(--space-4);
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
		border: 1px solid var(--color-success);
		border-radius: var(--radius-lg);
		color: var(--color-success);
		font-weight: 600;
	}

	.dirty-status.dirty {
		background: color-mix(in srgb, var(--color-warning) 10%, transparent);
		border-color: var(--color-warning);
		color: var(--color-warning);
	}

	.dirty-fields-list {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2);
	}

	.dirty-field-tag {
		padding: var(--space-1) var(--space-2);
		background: color-mix(in srgb, var(--color-warning) 15%, transparent);
		border: 1px solid var(--color-warning);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-warning);
	}

	.no-dirty {
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
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

	.field-with-action {
		display: flex;
		gap: var(--space-2);
	}

	.field-with-action input {
		flex: 1;
	}

	.reset-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		/* width: 32px; */
		/* height: 32px; */
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.reset-btn:hover {
		background: var(--color-panel-1);
		color: var(--color-foreground);
		border-color: var(--color-primary);
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

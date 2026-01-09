<script lang="ts">
	/**
	 * Solidity ABI Form Demo
	 * Demonstrates dynamic arrays and nested structs for smart contract parameters.
	 */
	import { useFormState, Form, FormField, Validators, FieldArray } from '@shelchin/formstate';
	import { Code, Plus, Trash2, Layers, Copy, Check } from '@lucide/svelte';
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

	// Generated calldata result
	let generatedResult = $state<string | null>(null);
	let copySuccess = $state(false);

	// Ethereum address validator (available for field-level validation if needed)
	void Validators.pattern(/^0x[a-fA-F0-9]{40}$/, t('demo.abi.address_invalid'));

	const form = useFormState({
		fields: {
			recipients: {
				defaultValue: [''],
				validator: Validators.required(t('demo.abi.recipients_required'))
			},
			amounts: {
				defaultValue: [''],
				validator: Validators.required(t('demo.abi.amounts_required'))
			},
			'metadata.memo': {
				defaultValue: '',
				validator: Validators.maxLength(100, t('demo.abi.memo_max'))
			},
			'metadata.priority': {
				defaultValue: 1,
				validator: Validators.compose(
					Validators.min(1, t('demo.abi.priority_min')),
					Validators.max(5, t('demo.abi.priority_max'))
				)
			}
		}
	});

	async function handleGenerate() {
		const isValid = await form.validateForm();
		if (Object.values(isValid).every((e) => !e)) {
			const calldata = {
				function: 'transferBatch',
				params: form.values
			};
			generatedResult = JSON.stringify(calldata, null, 2);
		}
	}

	async function copyToClipboard() {
		if (generatedResult) {
			await navigator.clipboard.writeText(generatedResult);
			copySuccess = true;
			setTimeout(() => (copySuccess = false), 2000);
		}
	}

	function resetForm() {
		form.reset();
	}

	const codeExample = `import { useFormState, FormField, FieldArray, Validators } from '@shelchin/formstate';

// Address validator
const addressValidator = Validators.pattern(
  /^0x[a-fA-F0-9]{40}$/,
  'Invalid Ethereum address'
);

const form = useFormState({
  fields: {
    // Dynamic array fields
    recipients: {
      defaultValue: [''],
      validator: Validators.required('At least one recipient')
    },
    amounts: {
      defaultValue: [''],
      validator: Validators.required('At least one amount')
    },
    // Nested struct fields (dot notation)
    'metadata.memo': {
      defaultValue: '',
      validator: Validators.maxLength(100, 'Max 100 characters')
    },
    'metadata.priority': {
      defaultValue: 1,
      validator: Validators.compose(
        Validators.min(1, 'Min is 1'),
        Validators.max(5, 'Max is 5')
      )
    }
  }
});

// Dynamic array with FieldArray
<FieldArray name="recipients">
  {#snippet children({ fields, append, remove })}
    {#each fields as field, index (field.key)}
      <FormField name={\`recipients[\${index}]\`}>
        {#snippet children({ value, onInput, onBlur })}
          <input value={value} oninput={e => onInput(e.target.value)} />
        {/snippet}
      </FormField>
      <button onclick={() => remove(index)}>Remove</button>
    {/each}
    <button onclick={() => append('')}>Add Address</button>
  {/snippet}
</FieldArray>`;
</script>

<DemoSection title={t('demo.abi.title')} description={t('demo.abi.description')}>
	<DemoContent>
		{#snippet panel()}
			<Form formState={form}>
				<!-- Recipients Array -->
				<div class="param-group">
					<div class="param-header">
						<h4>recipients</h4>
						<span class="param-type">address[]</span>
					</div>
					<p class="param-desc">{t('demo.abi.recipients_desc')}</p>

					<FieldArray name="recipients">
						{#snippet children({ fields, append, remove })}
							<div class="array-items">
								{#each fields as field, index (field.key)}
									<div class="array-item">
										<span class="item-index">[{index}]</span>
										<FormField name={`recipients[${index}]`}>
											{#snippet children({ value, error, touched, onInput, onBlur })}
												<div class="field-input">
													<input
														type="text"
														value={value as string}
														placeholder="0x..."
														class:has-error={touched && error}
														oninput={(e) => onInput(e.currentTarget.value)}
														onblur={onBlur}
													/>
													{#if touched && error}
														<span class="field-error">{error}</span>
													{/if}
												</div>
											{/snippet}
										</FormField>
										<button
											type="button"
											class="btn-remove"
											onclick={() => remove(index)}
											disabled={fields.length === 1}
										>
											<Trash2 size={14} />
										</button>
									</div>
								{/each}
							</div>
							<button type="button" class="btn-add" onclick={() => append('')}>
								<Plus size={14} />
								{t('demo.abi.add_address')}
							</button>
						{/snippet}
					</FieldArray>
				</div>

				<!-- Amounts Array -->
				<div class="param-group">
					<div class="param-header">
						<h4>amounts</h4>
						<span class="param-type">uint256[]</span>
					</div>
					<p class="param-desc">{t('demo.abi.amounts_desc')}</p>

					<FieldArray name="amounts">
						{#snippet children({ fields, append, remove })}
							<div class="array-items">
								{#each fields as field, index (field.key)}
									<div class="array-item">
										<span class="item-index">[{index}]</span>
										<FormField name={`amounts[${index}]`}>
											{#snippet children({ value, error, touched, onInput, onBlur })}
												<div class="field-input">
													<div class="input-with-unit">
														<input
															type="text"
															value={value as string}
															placeholder="0.00"
															class:has-error={touched && error}
															oninput={(e) => onInput(e.currentTarget.value)}
															onblur={onBlur}
														/>
														<span class="unit">ETH</span>
													</div>
													{#if touched && error}
														<span class="field-error">{error}</span>
													{/if}
												</div>
											{/snippet}
										</FormField>
										<button
											type="button"
											class="btn-remove"
											onclick={() => remove(index)}
											disabled={fields.length === 1}
										>
											<Trash2 size={14} />
										</button>
									</div>
								{/each}
							</div>
							<button type="button" class="btn-add" onclick={() => append('')}>
								<Plus size={14} />
								{t('demo.abi.add_amount')}
							</button>
						{/snippet}
					</FieldArray>
				</div>

				<!-- Metadata Struct -->
				<div class="param-group">
					<div class="param-header">
						<h4>metadata</h4>
						<span class="param-type">tuple</span>
					</div>
					<p class="param-desc">{t('demo.abi.metadata_desc')}</p>

					<div class="struct-fields">
						<FormField name="metadata.memo">
							{#snippet children({ value, error, touched, onInput, onBlur })}
								<div class="struct-field">
									<div class="field-label-row">
										<span class="field-name">memo</span>
										<span class="field-type">string</span>
									</div>
									<textarea
										value={value as string}
										placeholder={t('demo.abi.memo_placeholder')}
										rows="2"
										class:has-error={touched && error}
										oninput={(e) => onInput(e.currentTarget.value)}
										onblur={onBlur}
									></textarea>
									{#if touched && error}
										<span class="field-error">{error}</span>
									{/if}
								</div>
							{/snippet}
						</FormField>

						<FormField name="metadata.priority">
							{#snippet children({ value, onInput })}
								<div class="struct-field">
									<div class="field-label-row">
										<span class="field-name">priority</span>
										<span class="field-type">uint8</span>
									</div>
									<div class="range-container">
										<input
											type="range"
											min="1"
											max="5"
											value={value as number}
											oninput={(e) => onInput(Number(e.currentTarget.value))}
										/>
										<div class="range-labels">
											<span>{t('demo.abi.priority_low')}</span>
											<span class="current-value">{value}</span>
											<span>{t('demo.abi.priority_high')}</span>
										</div>
									</div>
								</div>
							{/snippet}
						</FormField>
					</div>
				</div>

				<ActionButtons>
					<DemoButton variant="primary" icon={Code} onclick={handleGenerate}>
						{t('demo.abi.generate')}
					</DemoButton>
					<DemoButton variant="secondary" onclick={resetForm}>
						{t('demo.abi.reset')}
					</DemoButton>
				</ActionButtons>
			</Form>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>{t('demo.abi.function_signature')}</h4>
				<pre class="signature">function transferBatch(
  address[] memory recipients,
  uint256[] memory amounts,
  struct Metadata &#123;
    string memo,
    uint8 priority
  &#125; memory metadata
) external</pre>

				<h4>{t('demo.abi.current_params')}</h4>
				<pre class="params-preview">{JSON.stringify(form.values, null, 2)}</pre>

				{#if generatedResult}
					<div class="generated-result">
						<div class="result-header">
							<h4>{t('demo.abi.generate_success')}</h4>
							<button type="button" class="btn-copy" onclick={copyToClipboard}>
								{#if copySuccess}
									<Check size={14} />
									<span>{t('actions.copied')}</span>
								{:else}
									<Copy size={14} />
									<span>{t('actions.copy')}</span>
								{/if}
							</button>
						</div>
						<pre class="calldata-output">{generatedResult}</pre>
					</div>
				{/if}

				<div class="info-box">
					<Layers size={14} />
					<p>{t('demo.abi.info')}</p>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.abi')} code={codeExample} />
</DemoSection>

<style>
	.param-group {
		padding: var(--space-4);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin-bottom: var(--space-4);
	}

	.param-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-1);
	}

	.param-header h4 {
		margin: 0;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.param-type {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		padding: var(--space-1) var(--space-2);
		background: var(--color-primary);
		color: white;
		border-radius: var(--radius-sm);
	}

	.param-desc {
		margin: 0 0 var(--space-3) 0;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.array-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.array-item {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.item-index {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-weight: 600;
		color: var(--color-primary);
		padding-top: var(--space-2);
		flex-shrink: 0;
	}

	.field-input {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.btn-remove {
		padding: var(--space-2);
		background: var(--color-danger-light, #fee2e2);
		color: var(--color-danger);
		border: none;
		border-radius: var(--radius);
		cursor: pointer;
		transition: all 0.2s;
		margin-top: var(--space-1);
	}

	.btn-remove:hover:not(:disabled) {
		background: var(--color-danger);
		color: white;
	}

	.btn-remove:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-add {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-2);
		background: var(--color-background);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius);
		color: var(--color-primary);
		font-size: var(--text-sm);
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-add:hover {
		border-color: var(--color-primary);
		background: var(--color-primary-light, #f0f4ff);
	}

	.struct-fields {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.struct-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.field-label-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.field-name {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-weight: 500;
		color: var(--color-foreground);
	}

	.field-type {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		padding: var(--space-1) var(--space-2);
		background: var(--color-muted);
		color: var(--color-muted-foreground);
		border-radius: var(--radius-sm);
	}

	.input-with-unit {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-with-unit input {
		padding-right: var(--space-10);
	}

	.unit {
		position: absolute;
		right: var(--space-3);
		color: var(--color-muted-foreground);
		font-weight: 500;
		font-size: var(--text-sm);
	}

	.range-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	input[type='range'] {
		width: 100%;
		height: 8px;
		border-radius: 4px;
		background: var(--color-border);
		outline: none;
		padding: 0;
	}

	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: var(--color-primary);
		cursor: pointer;
	}

	.range-labels {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.current-value {
		font-weight: 600;
		color: var(--color-primary);
		font-size: var(--text-sm);
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

	.signature,
	.params-preview {
		margin: 0;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
		white-space: pre;
	}

	.params-preview {
		max-height: 200px;
	}

	.generated-result {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding: var(--space-3);
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
		border: 1px solid var(--color-success);
		border-radius: var(--radius);
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.result-header h4 {
		margin: 0;
		color: var(--color-success);
	}

	.btn-copy {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: var(--color-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-copy:hover {
		background: var(--color-panel-0);
		border-color: var(--color-primary);
		color: var(--color-primary);
	}

	.calldata-output {
		margin: 0;
		padding: var(--space-3);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
		white-space: pre;
		max-height: 300px;
	}

	.info-box {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
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

	input,
	textarea {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		transition: border-color 0.2s;
	}

	textarea {
		resize: vertical;
		font-family: inherit;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	input.has-error,
	textarea.has-error {
		border-color: var(--color-danger);
	}

	.field-error {
		font-size: var(--text-xs);
		color: var(--color-danger);
	}
</style>

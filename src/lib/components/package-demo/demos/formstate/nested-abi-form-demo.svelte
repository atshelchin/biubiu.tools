<script lang="ts">
	/**
	 * Nested ABI Form Demo
	 * Demonstrates complex recursive nested structures for smart contract parameters.
	 * Features: tuple[], tuple with arrays, tuple[] with nested tuple[], infinite depth support
	 */
	import { useFormState, Form, FormField, FieldArray } from '@shelchin/formstate';
	import {
		Code,
		Plus,
		Trash2,
		Layers,
		ChevronDown,
		ChevronRight,
		Copy,
		Check
	} from '@lucide/svelte';
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

	// Complex nested form state
	const form = useFormState({
		fields: {
			// transactions is a tuple[] - each transaction has nested signatures tuple[]
			transactions: {
				defaultValue: [
					{
						to: '',
						value: '',
						data: '',
						signatures: [{ signer: '', v: '', r: '', s: '' }]
					}
				]
			},
			// config is a tuple with nested arrays and tuples
			'config.enabled': {
				defaultValue: true
			},
			'config.allowedTokens': {
				defaultValue: ['']
			},
			'config.limits': {
				defaultValue: [{ token: '', maxAmount: '' }]
			},
			'config.metadata.version': {
				defaultValue: '1'
			},
			'config.metadata.tags': {
				defaultValue: ['']
			}
		}
	});

	// Collapsed state for sections
	let collapsedSections = $state<Record<string, boolean>>({});

	function toggleSection(section: string) {
		collapsedSections[section] = !collapsedSections[section];
	}

	// Add new transaction
	function addTransaction() {
		const transactions = form.getValue('transactions') as Array<Record<string, unknown>>;
		form.setValue('transactions', [
			...transactions,
			{
				to: '',
				value: '',
				data: '',
				signatures: [{ signer: '', v: '', r: '', s: '' }]
			}
		]);
	}

	// Remove transaction
	function removeTransaction(index: number) {
		const transactions = form.getValue('transactions') as Array<Record<string, unknown>>;
		if (transactions.length > 1) {
			form.setValue(
				'transactions',
				transactions.filter((_, i) => i !== index)
			);
		}
	}

	// Add signature to transaction
	function addSignature(txIndex: number) {
		const transactions = form.getValue('transactions') as Array<Record<string, unknown>>;
		const tx = transactions[txIndex];
		const signatures = tx.signatures as Array<Record<string, unknown>>;
		form.setValue(`transactions[${txIndex}].signatures`, [
			...signatures,
			{ signer: '', v: '', r: '', s: '' }
		]);
	}

	// Remove signature from transaction
	function removeSignature(txIndex: number, sigIndex: number) {
		const transactions = form.getValue('transactions') as Array<Record<string, unknown>>;
		const tx = transactions[txIndex];
		const signatures = tx.signatures as Array<Record<string, unknown>>;
		if (signatures.length > 1) {
			form.setValue(
				`transactions[${txIndex}].signatures`,
				signatures.filter((_, i) => i !== sigIndex)
			);
		}
	}

	async function handleGenerate() {
		const calldata = {
			function: 'executeBatchTransactions',
			params: form.values
		};
		generatedResult = JSON.stringify(calldata, null, 2);
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

	const codeExample = `// Complex nested ABI structure
const form = useFormState({
  fields: {
    // tuple[] - array of tuples with nested tuple[]
    transactions: {
      defaultValue: [{
        to: '',
        value: '',
        data: '',
        signatures: [{ signer: '', v: '', r: '', s: '' }]
      }]
    },
    // tuple with nested arrays and tuples
    'config.enabled': { defaultValue: true },
    'config.allowedTokens': { defaultValue: [''] },
    'config.limits': {
      defaultValue: [{ token: '', maxAmount: '' }]
    },
    'config.metadata.version': { defaultValue: '1' },
    'config.metadata.tags': { defaultValue: [''] }
  }
});

// Nested array operations
function addSignature(txIndex: number) {
  const transactions = form.getValue('transactions');
  const signatures = transactions[txIndex].signatures;
  form.setValue(\`transactions[\${txIndex}].signatures\`, [
    ...signatures,
    { signer: '', v: '', r: '', s: '' }
  ]);
}

// Function signature:
// executeBatchTransactions(
//   (address to, uint256 value, bytes data,
//    (address signer, uint8 v, bytes32 r, bytes32 s)[] signatures
//   )[] transactions,
//   (bool enabled, address[] allowedTokens,
//    (address token, uint256 maxAmount)[] limits,
//    (uint256 version, string[] tags) metadata
//   ) config
// )`;
</script>

<DemoSection title={t('demo.nested_abi.title')} description={t('demo.nested_abi.description')}>
	<DemoContent>
		{#snippet panel()}
			<Form formState={form}>
				<!-- Transactions Array (tuple[]) -->
				<div class="abi-section">
					<button
						type="button"
						class="section-header"
						onclick={() => toggleSection('transactions')}
					>
						<div class="header-left">
							{#if collapsedSections['transactions']}
								<ChevronRight size={16} />
							{:else}
								<ChevronDown size={16} />
							{/if}
							<h4>transactions</h4>
							<span class="type-badge tuple-array">tuple[]</span>
						</div>
						<span class="item-count">
							{(form.getValue('transactions') as Array<unknown>).length}
							{t('demo.nested_abi.items')}
						</span>
					</button>

					{#if !collapsedSections['transactions']}
						<div class="section-content">
							<p class="section-desc">{t('demo.nested_abi.transactions_desc')}</p>

							{#each form.getValue('transactions') as tx, txIndex (txIndex)}
								<div class="nested-item level-1">
									<div class="item-header">
										<span class="item-index">[{txIndex}]</span>
										<span class="type-label">Transaction</span>
										<button
											type="button"
											class="btn-remove-small"
											onclick={() => removeTransaction(txIndex)}
											disabled={(form.getValue('transactions') as Array<unknown>).length === 1}
										>
											<Trash2 size={12} />
										</button>
									</div>

									<div class="tuple-fields">
										<!-- to: address -->
										<div class="field-row">
											<label class="field-label">
												<span class="field-name">to</span>
												<span class="type-badge address">address</span>
											</label>
											<input
												type="text"
												value={(tx as Record<string, unknown>).to as string}
												placeholder="0x..."
												oninput={(e) =>
													form.setValue(`transactions[${txIndex}].to`, e.currentTarget.value)}
											/>
										</div>

										<!-- value: uint256 -->
										<div class="field-row">
											<label class="field-label">
												<span class="field-name">value</span>
												<span class="type-badge uint">uint256</span>
											</label>
											<input
												type="text"
												value={(tx as Record<string, unknown>).value as string}
												placeholder="0"
												oninput={(e) =>
													form.setValue(`transactions[${txIndex}].value`, e.currentTarget.value)}
											/>
										</div>

										<!-- data: bytes -->
										<div class="field-row">
											<label class="field-label">
												<span class="field-name">data</span>
												<span class="type-badge bytes">bytes</span>
											</label>
											<input
												type="text"
												value={(tx as Record<string, unknown>).data as string}
												placeholder="0x..."
												oninput={(e) =>
													form.setValue(`transactions[${txIndex}].data`, e.currentTarget.value)}
											/>
										</div>

										<!-- signatures: tuple[] (nested) -->
										<div class="nested-array">
											<div class="nested-header">
												<span class="field-name">signatures</span>
												<span class="type-badge tuple-array">tuple[]</span>
												<span class="nested-count">
													{((tx as Record<string, unknown>).signatures as Array<unknown>).length}
												</span>
											</div>

											<div class="nested-items">
												{#each (tx as Record<string, unknown>).signatures as sig, sigIndex (sigIndex)}
													<div class="nested-item level-2">
														<div class="sig-header">
															<span class="item-index">[{sigIndex}]</span>
															<button
																type="button"
																class="btn-remove-mini"
																onclick={() => removeSignature(txIndex, sigIndex)}
																disabled={(
																	(tx as Record<string, unknown>).signatures as Array<unknown>
																).length === 1}
															>
																<Trash2 size={10} />
															</button>
														</div>

														<div class="sig-fields">
															<div class="sig-field">
																<span class="mini-label">signer <code>address</code></span>
																<input
																	type="text"
																	value={(sig as Record<string, unknown>).signer as string}
																	placeholder="0x..."
																	oninput={(e) =>
																		form.setValue(
																			`transactions[${txIndex}].signatures[${sigIndex}].signer`,
																			e.currentTarget.value
																		)}
																/>
															</div>
															<div class="sig-field-group">
																<div class="sig-field small">
																	<span class="mini-label">v <code>uint8</code></span>
																	<input
																		type="text"
																		value={(sig as Record<string, unknown>).v as string}
																		placeholder="27"
																		oninput={(e) =>
																			form.setValue(
																				`transactions[${txIndex}].signatures[${sigIndex}].v`,
																				e.currentTarget.value
																			)}
																	/>
																</div>
																<div class="sig-field">
																	<span class="mini-label">r <code>bytes32</code></span>
																	<input
																		type="text"
																		value={(sig as Record<string, unknown>).r as string}
																		placeholder="0x..."
																		oninput={(e) =>
																			form.setValue(
																				`transactions[${txIndex}].signatures[${sigIndex}].r`,
																				e.currentTarget.value
																			)}
																	/>
																</div>
																<div class="sig-field">
																	<span class="mini-label">s <code>bytes32</code></span>
																	<input
																		type="text"
																		value={(sig as Record<string, unknown>).s as string}
																		placeholder="0x..."
																		oninput={(e) =>
																			form.setValue(
																				`transactions[${txIndex}].signatures[${sigIndex}].s`,
																				e.currentTarget.value
																			)}
																	/>
																</div>
															</div>
														</div>
													</div>
												{/each}

												<button
													type="button"
													class="btn-add-nested"
													onclick={() => addSignature(txIndex)}
												>
													<Plus size={12} />
													{t('demo.nested_abi.add_signature')}
												</button>
											</div>
										</div>
									</div>
								</div>
							{/each}

							<button type="button" class="btn-add" onclick={addTransaction}>
								<Plus size={14} />
								{t('demo.nested_abi.add_transaction')}
							</button>
						</div>
					{/if}
				</div>

				<!-- Config Tuple -->
				<div class="abi-section">
					<button type="button" class="section-header" onclick={() => toggleSection('config')}>
						<div class="header-left">
							{#if collapsedSections['config']}
								<ChevronRight size={16} />
							{:else}
								<ChevronDown size={16} />
							{/if}
							<h4>config</h4>
							<span class="type-badge tuple">tuple</span>
						</div>
					</button>

					{#if !collapsedSections['config']}
						<div class="section-content">
							<p class="section-desc">{t('demo.nested_abi.config_desc')}</p>

							<!-- enabled: bool -->
							<div class="field-row">
								<label class="field-label">
									<span class="field-name">enabled</span>
									<span class="type-badge bool">bool</span>
								</label>
								<label class="checkbox-wrapper">
									<input
										type="checkbox"
										checked={form.getValue('config.enabled') as boolean}
										onchange={(e) => form.setValue('config.enabled', e.currentTarget.checked)}
									/>
									<span>{t('demo.nested_abi.enabled')}</span>
								</label>
							</div>

							<!-- allowedTokens: address[] -->
							<div class="nested-array">
								<div class="nested-header">
									<span class="field-name">allowedTokens</span>
									<span class="type-badge address-array">address[]</span>
								</div>

								<FieldArray name="config.allowedTokens">
									{#snippet children({ fields, append, remove })}
										<div class="simple-array">
											{#each fields as field, index (field.key)}
												<div class="simple-array-item">
													<span class="item-index">[{index}]</span>
													<FormField name={`config.allowedTokens[${index}]`}>
														{#snippet children({ value, onInput })}
															<input
																type="text"
																value={value as string}
																placeholder="0x..."
																oninput={(e) => onInput(e.currentTarget.value)}
															/>
														{/snippet}
													</FormField>
													<button
														type="button"
														class="btn-remove-mini"
														onclick={() => remove(index)}
														disabled={fields.length === 1}
													>
														<Trash2 size={10} />
													</button>
												</div>
											{/each}
											<button type="button" class="btn-add-nested" onclick={() => append('')}>
												<Plus size={12} />
												{t('demo.nested_abi.add_token')}
											</button>
										</div>
									{/snippet}
								</FieldArray>
							</div>

							<!-- limits: tuple[] -->
							<div class="nested-array">
								<div class="nested-header">
									<span class="field-name">limits</span>
									<span class="type-badge tuple-array">tuple[]</span>
								</div>

								<FieldArray name="config.limits">
									{#snippet children({ fields, append, remove })}
										<div class="nested-items">
											{#each fields as field, index (field.key)}
												<div class="nested-item level-2">
													<div class="sig-header">
														<span class="item-index">[{index}]</span>
														<button
															type="button"
															class="btn-remove-mini"
															onclick={() => remove(index)}
															disabled={fields.length === 1}
														>
															<Trash2 size={10} />
														</button>
													</div>
													<div class="sig-fields">
														<div class="sig-field">
															<span class="mini-label">token <code>address</code></span>
															<FormField name={`config.limits[${index}].token`}>
																{#snippet children({ value, onInput })}
																	<input
																		type="text"
																		value={value as string}
																		placeholder="0x..."
																		oninput={(e) => onInput(e.currentTarget.value)}
																	/>
																{/snippet}
															</FormField>
														</div>
														<div class="sig-field">
															<span class="mini-label">maxAmount <code>uint256</code></span>
															<FormField name={`config.limits[${index}].maxAmount`}>
																{#snippet children({ value, onInput })}
																	<input
																		type="text"
																		value={value as string}
																		placeholder="0"
																		oninput={(e) => onInput(e.currentTarget.value)}
																	/>
																{/snippet}
															</FormField>
														</div>
													</div>
												</div>
											{/each}
											<button
												type="button"
												class="btn-add-nested"
												onclick={() => append({ token: '', maxAmount: '' })}
											>
												<Plus size={12} />
												{t('demo.nested_abi.add_limit')}
											</button>
										</div>
									{/snippet}
								</FieldArray>
							</div>

							<!-- metadata: tuple -->
							<div class="nested-tuple">
								<div class="nested-header">
									<span class="field-name">metadata</span>
									<span class="type-badge tuple">tuple</span>
								</div>

								<div class="tuple-content">
									<div class="field-row">
										<label class="field-label">
											<span class="field-name">version</span>
											<span class="type-badge uint">uint256</span>
										</label>
										<input
											type="text"
											value={form.getValue('config.metadata.version') as string}
											placeholder="1"
											oninput={(e) =>
												form.setValue('config.metadata.version', e.currentTarget.value)}
										/>
									</div>

									<!-- tags: string[] -->
									<div class="nested-array">
										<div class="nested-header">
											<span class="field-name">tags</span>
											<span class="type-badge string-array">string[]</span>
										</div>

										<FieldArray name="config.metadata.tags">
											{#snippet children({ fields, append, remove })}
												<div class="simple-array">
													{#each fields as field, index (field.key)}
														<div class="simple-array-item">
															<span class="item-index">[{index}]</span>
															<FormField name={`config.metadata.tags[${index}]`}>
																{#snippet children({ value, onInput })}
																	<input
																		type="text"
																		value={value as string}
																		placeholder={t('demo.nested_abi.tag_placeholder')}
																		oninput={(e) => onInput(e.currentTarget.value)}
																	/>
																{/snippet}
															</FormField>
															<button
																type="button"
																class="btn-remove-mini"
																onclick={() => remove(index)}
																disabled={fields.length === 1}
															>
																<Trash2 size={10} />
															</button>
														</div>
													{/each}
													<button type="button" class="btn-add-nested" onclick={() => append('')}>
														<Plus size={12} />
														{t('demo.nested_abi.add_tag')}
													</button>
												</div>
											{/snippet}
										</FieldArray>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<ActionButtons>
					<DemoButton variant="primary" icon={Code} onclick={handleGenerate}>
						{t('demo.nested_abi.generate')}
					</DemoButton>
					<DemoButton variant="secondary" onclick={resetForm}>
						{t('demo.nested_abi.reset')}
					</DemoButton>
				</ActionButtons>
			</Form>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>{t('demo.nested_abi.function_signature')}</h4>
				<pre class="signature">function executeBatchTransactions(
  (
    address to,
    uint256 value,
    bytes data,
    (address signer, uint8 v, bytes32 r, bytes32 s)[] signatures
  )[] transactions,
  (
    bool enabled,
    address[] allowedTokens,
    (address token, uint256 maxAmount)[] limits,
    (uint256 version, string[] tags) metadata
  ) config
) external</pre>

				<h4>{t('demo.nested_abi.structure_types')}</h4>
				<div class="structure-list">
					<div class="structure-item">
						<Layers size={14} />
						<span>tuple[] {t('demo.nested_abi.type_tuple_array')}</span>
					</div>
					<div class="structure-item">
						<Layers size={14} />
						<span>tuple[].tuple[] {t('demo.nested_abi.type_nested_tuple_array')}</span>
					</div>
					<div class="structure-item">
						<Layers size={14} />
						<span>tuple.array {t('demo.nested_abi.type_tuple_with_array')}</span>
					</div>
					<div class="structure-item">
						<Layers size={14} />
						<span>tuple.tuple {t('demo.nested_abi.type_nested_tuple')}</span>
					</div>
				</div>

				<h4>{t('demo.nested_abi.current_params')}</h4>
				<pre class="params-preview">{JSON.stringify(form.values, null, 2)}</pre>

				{#if generatedResult}
					<div class="generated-result">
						<div class="result-header">
							<h4>{t('demo.nested_abi.generate_success')}</h4>
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
					<p>{t('demo.nested_abi.info')}</p>
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.nested_abi')} code={codeExample} />
</DemoSection>

<style>
	.abi-section {
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin-bottom: var(--space-4);
		overflow: hidden;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: var(--color-background);
		border: none;
		cursor: pointer;
		transition: background 0.2s;
	}

	.section-header:hover {
		background: var(--color-panel-0);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.section-header h4 {
		margin: 0;
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.item-count {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.section-content {
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
	}

	.section-desc {
		margin: 0 0 var(--space-4) 0;
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.type-badge {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		padding: 2px var(--space-2);
		border-radius: var(--radius-sm);
		font-weight: 500;
	}

	.type-badge.tuple-array {
		background: #fef3c7;
		color: #92400e;
	}

	.type-badge.tuple {
		background: #dbeafe;
		color: #1e40af;
	}

	.type-badge.address,
	.type-badge.address-array {
		background: #d1fae5;
		color: #065f46;
	}

	.type-badge.uint {
		background: #ede9fe;
		color: #5b21b6;
	}

	.type-badge.bytes {
		background: #fce7f3;
		color: #9d174d;
	}

	.type-badge.bool {
		background: #fee2e2;
		color: #991b1b;
	}

	.type-badge.string-array {
		background: #e0e7ff;
		color: #3730a3;
	}

	.nested-item {
		padding: var(--space-3);
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin-bottom: var(--space-3);
	}

	.nested-item.level-1 {
		border-left: 3px solid var(--color-primary);
	}

	.nested-item.level-2 {
		border-left: 3px solid #f59e0b;
		background: var(--color-panel-0);
	}

	.item-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
		padding-bottom: var(--space-2);
		border-bottom: 1px dashed var(--color-border);
	}

	.item-index {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-weight: 600;
		color: var(--color-primary);
		font-size: var(--text-sm);
	}

	.type-label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		flex: 1;
	}

	.tuple-fields {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.field-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	.field-label {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.field-name {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-weight: 500;
		color: var(--color-foreground);
		font-size: var(--text-sm);
	}

	.nested-array,
	.nested-tuple {
		margin-top: var(--space-2);
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px dashed var(--color-border);
		border-radius: var(--radius);
	}

	.nested-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-3);
	}

	.nested-count {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin-left: auto;
	}

	.nested-items {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.sig-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-2);
	}

	.sig-fields {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.sig-field {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.sig-field.small {
		max-width: 80px;
	}

	.sig-field-group {
		display: grid;
		grid-template-columns: 80px 1fr 1fr;
		gap: var(--space-2);
	}

	.mini-label {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.mini-label code {
		font-size: 10px;
		background: var(--color-background);
		padding: 1px 4px;
		border-radius: 2px;
	}

	.simple-array {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.simple-array-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.simple-array-item input {
		flex: 1;
	}

	.tuple-content {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.checkbox-wrapper {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		cursor: pointer;
	}

	.checkbox-wrapper input {
		width: auto;
	}

	.btn-add {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-2) var(--space-3);
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
		background: color-mix(in srgb, var(--color-primary) 5%, transparent);
	}

	.btn-add-nested {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: transparent;
		border: 1px dashed var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-primary);
		font-size: var(--text-xs);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-add-nested:hover {
		border-color: var(--color-primary);
		background: color-mix(in srgb, var(--color-primary) 5%, transparent);
	}

	.btn-remove-small {
		padding: var(--space-1);
		background: color-mix(in srgb, var(--color-danger) 10%, transparent);
		color: var(--color-danger);
		border: none;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-remove-small:hover:not(:disabled) {
		background: var(--color-danger);
		color: white;
	}

	.btn-remove-small:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-remove-mini {
		padding: 2px 4px;
		background: transparent;
		color: var(--color-danger);
		border: 1px solid color-mix(in srgb, var(--color-danger) 30%, transparent);
		border-radius: 2px;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-remove-mini:hover:not(:disabled) {
		background: var(--color-danger);
		color: white;
	}

	.btn-remove-mini:disabled {
		opacity: 0.3;
		cursor: not-allowed;
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

	.structure-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.structure-item {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: var(--color-foreground);
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
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	input::placeholder {
		color: var(--color-muted-foreground);
		opacity: 0.6;
	}

	@media (max-width: 640px) {
		.sig-field-group {
			grid-template-columns: 1fr;
		}

		.sig-field.small {
			max-width: none;
		}
	}
</style>

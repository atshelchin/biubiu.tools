<script lang="ts">
	/**
	 * Solidity ABI 函数参数表单
	 * 展示：动态数组、嵌套结构、类型转换、条件渲染
	 */
	import {
		useFormState,
		Form,
		FormField,
		Validators,
		FieldArray,
		type FormState
	} from '@packages/formstate/src';

	// Solidity 函数 ABI 定义
	const exampleABI = {
		name: 'transferBatch',
		type: 'function',
		inputs: [
			{
				name: 'recipients',
				type: 'address[]',
				description: '接收者地址数组'
			},
			{
				name: 'amounts',
				type: 'uint256[]',
				description: '转账金额数组'
			},
			{
				name: 'metadata',
				type: 'tuple',
				components: [
					{ name: 'memo', type: 'string' },
					{ name: 'priority', type: 'uint8' },
					{ name: 'deadline', type: 'uint256' }
				],
				description: '交易元数据'
			}
		]
	};

	// 地址验证器
	const addressValidator = Validators.pattern(/^0x[a-fA-F0-9]{40}$/, '请输入有效的以太坊地址');

	// 创建表单状态
	const form: FormState = useFormState({
		fields: {
			recipients: {
				defaultValue: [''],
				validator: Validators.required('至少需要一个接收者')
			},
			amounts: {
				defaultValue: [''],
				validator: Validators.required('至少需要一个金额')
			},
			'metadata.memo': {
				defaultValue: '',
				validator: Validators.maxLength(100, '备注不能超过 100 个字符')
			},
			'metadata.priority': {
				defaultValue: 1,
				validator: Validators.compose(
					Validators.required('优先级不能为空'),
					Validators.min(1, '优先级最小为 1'),
					Validators.max(5, '优先级最大为 5')
				)
			},
			'metadata.deadline': {
				defaultValue: '',
				validator: Validators.required('截止时间不能为空')
			}
		}
	});

	// 提交处理
	async function handleSubmit(values: Record<string, unknown>) {
		console.log('函数调用参数:', values);

		// 模拟编码为 calldata
		const calldata = {
			function: 'transferBatch',
			params: values
		};

		alert(`函数调用准备完成\n\n${JSON.stringify(calldata, null, 2)}`);
	}
</script>

<svelte:head>
	<title>Solidity ABI 函数参数表单 | FormState</title>
</svelte:head>

<div class="example-page">
	<div class="documentation">
		<h1>Solidity ABI 参数表单</h1>
		<p class="lead">真实场景：为 Solidity 智能合约函数输入参数。</p>

		<section class="doc-section">
			<h2>场景说明</h2>
			<p>
				这个例子模拟了 Web3 应用中常见的场景：用户需要为智能合约函数提供参数。该场景完美展示了：
			</p>
			<ul>
				<li>✅ 动态数组（地址列表、金额列表）</li>
				<li>✅ 嵌套结构（tuple/struct 类型）</li>
				<li>✅ 类型验证（地址格式、数值范围）</li>
				<li>✅ 数组长度一致性校验</li>
			</ul>
		</section>

		<section class="doc-section">
			<h2>函数签名</h2>
			<pre><code
					>{`function transferBatch(
  address[] memory recipients,
  uint256[] memory amounts,
  struct Metadata {
    string memo,
    uint8 priority,
    uint256 deadline
  } memory metadata
) external`}</code
				></pre>
		</section>

		<section class="doc-section">
			<h2>代码示例</h2>
			<pre><code
					>{`const form = useFormState({
  fields: {
    'recipients': {
      defaultValue: [''],
      validator: Validators.required('至少需要一个接收者')
    },
    'metadata.memo': {
      defaultValue: '',
      validator: Validators.maxLength(100, '不能超过100字符')
    }
  }
});

// 动态数组字段
<FieldArray name="recipients" formState={form}>
  {#snippet children({ fields, append, remove })}
    {#each fields as field, index (field.key)}
      <FormField name={\`recipients[\${index}]\`} formState={form}>
        ...
      </FormField>
    {/each}
    <button onclick={() => append('')}>添加</button>
  {/snippet}
</FieldArray>`}</code
				></pre>
		</section>
	</div>

	<div class="demo-container">
		<h2>交互演示</h2>

		<div class="form-card">
			<Form formState={form} onSubmit={handleSubmit}>
				<!-- Recipients Array -->
				<div class="param-group">
					<div class="param-header">
						<h3>recipients</h3>
						<span class="param-type">address[]</span>
					</div>
					<p class="param-desc">接收者地址数组</p>

					<FieldArray name="recipients" formState={form}>
						{#snippet children({ fields, append, remove })}
							<div class="array-items">
								{#each fields as field, index (field.key)}
									<div class="array-item">
										<span class="item-index">[{index}]</span>
										<FormField name={`recipients[${index}]`} formState={form}>
											{#snippet children({ value, error, touched, onInput, onBlur })}
												<input
													type="text"
													{value}
													class:error={touched && error}
													placeholder="0x..."
													oninput={(e) => onInput(e.currentTarget.value)}
													onblur={onBlur}
												/>
												{#if touched && error}
													<span class="error-msg">{error}</span>
												{/if}
											{/snippet}
										</FormField>
										<button
											type="button"
											class="btn-remove"
											onclick={() => remove(index)}
											disabled={fields.length === 1}
										>
											×
										</button>
									</div>
								{/each}
							</div>
							<button type="button" class="btn-add" onclick={() => append('')}>+ 添加地址</button>
						{/snippet}
					</FieldArray>
				</div>

				<!-- Amounts Array -->
				<div class="param-group">
					<div class="param-header">
						<h3>amounts</h3>
						<span class="param-type">uint256[]</span>
					</div>
					<p class="param-desc">转账金额数组（需与地址数组长度一致）</p>

					<FieldArray name="amounts" formState={form}>
						{#snippet children({ fields, append, remove })}
							<div class="array-items">
								{#each fields as field, index (field.key)}
									<div class="array-item">
										<span class="item-index">[{index}]</span>
										<FormField name={`amounts[${index}]`} formState={form}>
											{#snippet children({ value, error, touched, onInput, onBlur })}
												<div class="input-with-unit">
													<input
														type="text"
														{value}
														class:error={touched && error}
														placeholder="0.00"
														oninput={(e) => onInput(e.currentTarget.value)}
														onblur={onBlur}
													/>
													<span class="unit">ETH</span>
												</div>
												{#if touched && error}
													<span class="error-msg">{error}</span>
												{/if}
											{/snippet}
										</FormField>
										<button
											type="button"
											class="btn-remove"
											onclick={() => remove(index)}
											disabled={fields.length === 1}
										>
											×
										</button>
									</div>
								{/each}
							</div>
							<button type="button" class="btn-add" onclick={() => append('')}>+ 添加金额</button>
						{/snippet}
					</FieldArray>
				</div>

				<!-- Metadata Struct -->
				<div class="param-group">
					<div class="param-header">
						<h3>metadata</h3>
						<span class="param-type">tuple</span>
					</div>
					<p class="param-desc">交易元数据结构</p>

					<div class="struct-fields">
						<!-- memo: string -->
						<div class="struct-field">
							<FormField name="metadata.memo" label="memo" formState={form}>
								{#snippet children({ value, error, touched, onInput, onBlur })}
									<div class="field-wrapper">
										<div class="field-label-row">
											<span class="field-name">memo</span>
											<span class="field-type">string</span>
										</div>
										<textarea
											{value}
											class:error={touched && error}
											placeholder="可选备注信息"
											rows="3"
											oninput={(e) => onInput(e.currentTarget.value)}
											onblur={onBlur}
										></textarea>
										{#if touched && error}
											<span class="error-msg">{error}</span>
										{/if}
									</div>
								{/snippet}
							</FormField>
						</div>

						<!-- priority: uint8 -->
						<div class="struct-field">
							<FormField name="metadata.priority" label="priority" formState={form}>
								{#snippet children({ value, error, touched, onInput, onBlur })}
									<div class="field-wrapper">
										<div class="field-label-row">
											<span class="field-name">priority</span>
											<span class="field-type">uint8</span>
										</div>
										<input
											type="range"
											min="1"
											max="5"
											{value}
											oninput={(e) => onInput(Number(e.currentTarget.value))}
											onblur={onBlur}
										/>
										<div class="range-labels">
											<span>低 (1)</span>
											<span class="current-value">{value}</span>
											<span>高 (5)</span>
										</div>
										{#if touched && error}
											<span class="error-msg">{error}</span>
										{/if}
									</div>
								{/snippet}
							</FormField>
						</div>

						<!-- deadline: uint256 -->
						<div class="struct-field">
							<FormField name="metadata.deadline" label="deadline" formState={form}>
								{#snippet children({ value, error, touched, onInput, onBlur })}
									<div class="field-wrapper">
										<div class="field-label-row">
											<span class="field-name">deadline</span>
											<span class="field-type">uint256</span>
										</div>
										<input
											type="datetime-local"
											{value}
											class:error={touched && error}
											oninput={(e) => onInput(e.currentTarget.value)}
											onblur={onBlur}
										/>
										{#if touched && error}
											<span class="error-msg">{error}</span>
										{/if}
									</div>
								{/snippet}
							</FormField>
						</div>
					</div>
				</div>

				<div class="form-actions">
					<button type="submit" class="btn-primary" disabled={!form.isValid || form.isValidating}>
						{form.isValidating ? '验证中...' : '生成 Calldata'}
					</button>

					<button
						type="button"
						class="btn-secondary"
						onclick={() => {
							form.reset();
						}}
					>
						重置
					</button>
				</div>
			</Form>
		</div>

		<div class="state-viewer">
			<h3>表单数据预览</h3>
			<details open>
				<summary>当前参数值</summary>
				<pre class="state-data">{JSON.stringify(form.values, null, 2)}</pre>
			</details>

			<details>
				<summary>验证错误</summary>
				<pre class="state-data">{JSON.stringify(form.errors, null, 2)}</pre>
			</details>
		</div>
	</div>
</div>

<style>
	.example-page {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		min-height: 100vh;
	}

	.documentation {
		position: sticky;
		top: 2rem;
		height: fit-content;
	}

	.documentation h1 {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.lead {
		font-size: 1.125rem;
		color: #6b7280;
		margin-bottom: 2rem;
	}

	.doc-section {
		margin-bottom: 2rem;
	}

	.doc-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.doc-section p {
		margin-bottom: 1rem;
		line-height: 1.6;
		color: #374151;
	}

	.doc-section ul {
		list-style: none;
		padding: 0;
	}

	.doc-section li {
		padding: 0.5rem 0;
		color: #374151;
	}

	.doc-section pre {
		background: #1e293b;
		color: #e2e8f0;
		padding: 1.5rem;
		border-radius: 0.5rem;
		overflow-x: auto;
		font-family: 'Fira Code', 'Monaco', monospace;
		font-size: 0.875rem;
		line-height: 1.7;
	}

	.demo-container {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.demo-container h2 {
		font-size: 1.5rem;
		font-weight: 600;
	}

	.form-card {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
	}

	/* Parameter Group Styles */
	.param-group {
		margin-bottom: 2rem;
		padding: 1.5rem;
		background: #f9fafb;
		border-radius: 0.75rem;
		border: 1px solid #e5e7eb;
	}

	.param-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.param-header h3 {
		font-size: 1.25rem;
		font-weight: 600;
		font-family: 'Fira Code', monospace;
		color: #374151;
	}

	.param-type {
		font-family: 'Fira Code', monospace;
		font-size: 0.875rem;
		padding: 0.25rem 0.75rem;
		background: #667eea;
		color: white;
		border-radius: 0.25rem;
		font-weight: 500;
	}

	.param-desc {
		color: #6b7280;
		margin-bottom: 1rem;
		font-size: 0.875rem;
	}

	/* Array Items */
	.array-items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.array-item {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		background: white;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
	}

	.item-index {
		font-family: 'Fira Code', monospace;
		font-weight: 600;
		color: #667eea;
		padding-top: 0.75rem;
		flex-shrink: 0;
	}

	.array-item :global(.form-field) {
		flex: 1;
		margin: 0;
	}

	.btn-remove {
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
		padding: 0;
		background: #fee2e2;
		color: #dc2626;
		border: none;
		border-radius: 0.375rem;
		font-size: 1.5rem;
		cursor: pointer;
		transition: all 0.2s;
		margin-top: 0.5rem;
	}

	.btn-remove:hover:not(:disabled) {
		background: #fecaca;
	}

	.btn-remove:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-add {
		width: 100%;
		padding: 0.75rem;
		background: white;
		border: 2px dashed #d1d5db;
		border-radius: 0.5rem;
		color: #667eea;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-add:hover {
		border-color: #667eea;
		background: #f0f4ff;
	}

	/* Struct Fields */
	.struct-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.struct-field {
		background: white;
		padding: 1rem;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
	}

	.field-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.field-label-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.field-name {
		font-family: 'Fira Code', monospace;
		font-weight: 500;
		color: #374151;
	}

	.field-type {
		font-family: 'Fira Code', monospace;
		font-size: 0.75rem;
		padding: 0.125rem 0.5rem;
		background: #f3f4f6;
		color: #6b7280;
		border-radius: 0.25rem;
	}

	/* Input Styles */
	input[type='text'],
	input[type='datetime-local'],
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: all 0.2s;
		font-family: inherit;
	}

	textarea {
		resize: vertical;
		min-height: 80px;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	input.error,
	textarea.error {
		border-color: #ef4444;
	}

	.input-with-unit {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-with-unit input {
		padding-right: 4rem;
	}

	.unit {
		position: absolute;
		right: 1rem;
		color: #6b7280;
		font-weight: 500;
	}

	/* Range Input */
	input[type='range'] {
		width: 100%;
		height: 0.5rem;
		border-radius: 0.25rem;
		background: #e5e7eb;
		outline: none;
		padding: 0;
	}

	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 1.25rem;
		height: 1.25rem;
		border-radius: 50%;
		background: #667eea;
		cursor: pointer;
		transition: all 0.2s;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.2);
	}

	.range-labels {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 0.875rem;
		color: #6b7280;
		margin-top: 0.5rem;
	}

	.current-value {
		font-weight: 600;
		color: #667eea;
		font-size: 1rem;
	}

	.error-msg {
		color: #ef4444;
		font-size: 0.875rem;
	}

	/* Form Actions */
	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 2rem;
	}

	button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		flex: 1;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-secondary {
		flex: 1;
		background: #f3f4f6;
		color: #374151;
	}

	.btn-secondary:hover {
		background: #e5e7eb;
	}

	/* State Viewer */
	.state-viewer {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
	}

	.state-viewer h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	details {
		margin-bottom: 1rem;
	}

	details summary {
		cursor: pointer;
		font-weight: 500;
		color: #667eea;
		padding: 0.5rem 0;
	}

	.state-data {
		margin-top: 0.5rem;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		overflow-x: auto;
		font-family: 'Fira Code', monospace;
	}

	@media (max-width: 1024px) {
		.example-page {
			grid-template-columns: 1fr;
		}

		.documentation {
			position: static;
		}
	}
</style>

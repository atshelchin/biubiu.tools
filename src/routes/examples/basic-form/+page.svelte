<script lang="ts">
	/**
	 * 基础表单示例 - 登录表单
	 * 演示：基础用法、字段验证、错误提示
	 */
	import {
		useFormState,
		Form,
		FormField,
		Validators,
		type FormState
	} from '@packages/formstate/src';

	// 创建表单状态
	const form: FormState = useFormState({
		fields: {
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('邮箱不能为空'),
					Validators.email('请输入有效的邮箱地址')
				)
			},
			password: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('密码不能为空'),
					Validators.minLength(8, '密码至少需要 8 个字符')
				)
			},
			rememberMe: {
				defaultValue: false
			}
		}
	});

	// 提交处理
	async function handleSubmit(values: Record<string, unknown>) {
		console.log('表单提交:', values);
		alert(`登录尝试\n邮箱: ${values.email}`);
	}

	// 派生状态
	const canSubmit = $derived(form.isValid && !form.isValidating);
</script>

<svelte:head>
	<title>基础表单示例 | FormState</title>
</svelte:head>

<div class="example-page">
	<div class="documentation">
		<h1>基础表单示例</h1>
		<p class="lead">简单的登录表单，演示 FormState 的基础用法。</p>

		<section class="doc-section">
			<h2>功能特性</h2>
			<ul>
				<li>✅ 字段验证（必填、邮箱格式、最小长度）</li>
				<li>✅ 实时错误提示</li>
				<li>✅ 表单状态管理（dirty、touched、valid）</li>
				<li>✅ 提交处理</li>
			</ul>
		</section>

		<section class="doc-section">
			<h2>代码示例</h2>
			<pre><code
					>{`const form = useFormState({
  fields: {
    email: {
      validator: Validators.compose(
        Validators.required('邮箱不能为空'),
        Validators.email('请输入有效的邮箱地址')
      )
    },
    password: {
      validator: Validators.compose(
        Validators.required('密码不能为空'),
        Validators.minLength(8, '密码至少需要 8 个字符')
      )
    }
  }
});

<Form {form} onSubmit={handleSubmit}>
  <FormField name="email" label="邮箱">
    {#snippet children({ value, error, touched, onInput, onBlur })}
      <input type="email" {value} oninput={e => onInput(e.target.value)} />
    {/snippet}
  </FormField>
</Form>`}</code
				></pre>
		</section>
	</div>

	<div class="demo-container">
		<h2>交互演示</h2>

		<div class="form-card">
			<Form formState={form} onSubmit={handleSubmit}>
				<FormField name="email" label="邮箱地址">
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="email"
							{value}
							class:error={touched && error}
							placeholder="your@email.com"
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
						/>
					{/snippet}
				</FormField>

				<FormField name="password" label="密码">
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="password"
							{value}
							class:error={touched && error}
							placeholder="至少 8 个字符"
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
						/>
					{/snippet}
				</FormField>

				<FormField name="rememberMe" showError={false}>
					{#snippet children({ value, onInput })}
						<label class="checkbox-label">
							<input
								type="checkbox"
								checked={value}
								onchange={(e) => onInput(e.currentTarget.checked)}
							/>
							<span>记住我</span>
						</label>
					{/snippet}
				</FormField>

				<div class="form-actions">
					<button type="submit" class="btn-primary" disabled={!canSubmit}>
						{form.isValidating ? '验证中...' : '登录'}
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
			<h3>表单状态</h3>
			<div class="state-grid">
				<div class="state-item">
					<span class="state-label">是否有效</span>
					<span class="state-value" class:active={form.isValid}>
						{form.isValid ? '✓ 是' : '✗ 否'}
					</span>
				</div>
				<div class="state-item">
					<span class="state-label">是否修改</span>
					<span class="state-value" class:active={form.isDirty}>
						{form.isDirty ? '✓ 是' : '✗ 否'}
					</span>
				</div>
				<div class="state-item">
					<span class="state-label">验证中</span>
					<span class="state-value" class:active={form.isValidating}>
						{form.isValidating ? '✓ 是' : '✗ 否'}
					</span>
				</div>
			</div>

			<details>
				<summary>查看原始数据</summary>
				<pre class="state-data">{JSON.stringify(
						{
							values: form.values,
							errors: form.errors
						},
						null,
						2
					)}</pre>
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

	:global(.form-field) {
		margin-bottom: 1.5rem;
	}

	:global(.form-field__label) {
		display: block;
		font-weight: 500;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	input[type='email'],
	input[type='password'] {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: all 0.2s;
	}

	input:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	input.error {
		border-color: #ef4444;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 2rem;
	}

	button {
		flex: 1;
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
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
		background: #f3f4f6;
		color: #374151;
	}

	.btn-secondary:hover {
		background: #e5e7eb;
	}

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

	.state-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.state-item {
		display: flex;
		flex-direction: column;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
	}

	.state-label {
		font-size: 0.75rem;
		color: #6b7280;
		margin-bottom: 0.25rem;
	}

	.state-value {
		font-weight: 600;
		color: #9ca3af;
	}

	.state-value.active {
		color: #10b981;
	}

	details {
		margin-top: 1rem;
	}

	details summary {
		cursor: pointer;
		font-weight: 500;
		color: #667eea;
	}

	.state-data {
		margin-top: 0.5rem;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		overflow-x: auto;
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

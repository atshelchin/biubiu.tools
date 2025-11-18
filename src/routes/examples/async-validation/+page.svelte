<script lang="ts">
	/**
	 * 自定义验证器示例 - 异步验证
	 * 演示：自定义同步/异步验证器、字段依赖验证
	 */
	import {
		useFormState,
		Form,
		FormField,
		Validators,
		createValidator,
		createCustomValidator
	} from '@packages/formstate/src';

	// 模拟 API 检查用户名是否可用
	async function checkUsernameAvailable(username: string): Promise<boolean> {
		await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟网络延迟
		const takenUsernames = ['admin', 'user', 'test', 'demo'];
		return !takenUsernames.includes(username.toLowerCase());
	}

	// 自定义验证器 1: 密码强度
	const strongPassword = createValidator((value: string) => {
		if (!value) return null;

		const hasUpperCase = /[A-Z]/.test(value);
		const hasLowerCase = /[a-z]/.test(value);
		const hasNumber = /[0-9]/.test(value);
		const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

		if (!hasUpperCase) return '密码必须包含大写字母';
		if (!hasLowerCase) return '密码必须包含小写字母';
		if (!hasNumber) return '密码必须包含数字';
		if (!hasSpecialChar) return '密码必须包含特殊字符';

		return null;
	});

	// 自定义验证器 2: 密码确认（依赖其他字段）
	const passwordMatch = createValidator((value: unknown, allValues: Record<string, unknown>) => {
		if (!value) return null;
		if (value !== allValues.password) {
			return '两次输入的密码不一致';
		}
		return null;
	});

	// 自定义验证器 3: 异步验证用户名
	const usernameAvailable = createCustomValidator(async (username: string) => {
		if (!username || username.length < 3) return true;
		return await checkUsernameAvailable(username);
	}, '该用户名已被占用');

	// 创建表单
	const form = useFormState({
		fields: {
			username: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('用户名不能为空'),
					Validators.minLength(3, '用户名至少需要 3 个字符'),
					Validators.maxLength(20, '用户名不能超过 20 个字符'),
					usernameAvailable
				)
			},
			password: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('密码不能为空'),
					Validators.minLength(8, '密码至少需要 8 个字符'),
					strongPassword
				)
			},
			confirmPassword: {
				defaultValue: '',
				validator: Validators.compose(Validators.required('请确认密码'), passwordMatch),
				dependencies: ['password'] // 当 password 改变时重新验证
			},
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('邮箱不能为空'),
					Validators.email('请输入有效的邮箱地址')
				)
			}
		}
	});

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('注册成功:', values);
		alert(`注册成功！\n用户名: ${values.username}\n邮箱: ${values.email}`);
	}

	const canSubmit = $derived(form.isValid && !form.isValidating);

	// 密码强度指示器
	const passwordStrength = $derived.by(() => {
		const pwd = form.getValue('password') as string;
		if (!pwd) return { level: 0, text: '未输入', color: 'gray' };

		let score = 0;
		if (/[A-Z]/.test(pwd)) score++;
		if (/[a-z]/.test(pwd)) score++;
		if (/[0-9]/.test(pwd)) score++;
		if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;
		if (pwd.length >= 12) score++;

		if (score <= 2) return { level: score, text: '弱', color: 'red' };
		if (score <= 3) return { level: score, text: '中', color: 'yellow' };
		return { level: score, text: '强', color: 'green' };
	});
</script>

<svelte:head>
	<title>自定义验证器示例 | FormState</title>
</svelte:head>

<div class="example-page">
	<div class="documentation">
		<h1>自定义验证器</h1>
		<p class="lead">创建同步/异步验证器，实现复杂的业务逻辑验证。</p>

		<section class="doc-section">
			<h2>功能特性</h2>
			<ul>
				<li>✅ 自定义同步验证器（密码强度）</li>
				<li>✅ 字段依赖验证（密码确认）</li>
				<li>✅ 异步验证器（检查用户名可用性）</li>
				<li>✅ 组合多个验证器</li>
				<li>✅ 实时验证反馈</li>
			</ul>
		</section>

		<section class="doc-section">
			<h2>创建自定义验证器</h2>
			<pre><code
					>{`// 1. 简单同步验证器
const strongPassword = createValidator((value: string) => {
  if (!value) return null;

  if (!/[A-Z]/.test(value)) return '必须包含大写字母';
  if (!/[0-9]/.test(value)) return '必须包含数字';

  return null;
});

// 2. 字段依赖验证器
const passwordMatch = createValidator(
  (value, allValues) => {
    if (value !== allValues.password) {
      return '两次密码不一致';
    }
    return null;
  }
);

// 3. 异步验证器
const usernameAvailable = createCustomValidator(
  async (username) => {
    const res = await fetch(\`/api/check?user=\${username}\`);
    return res.ok;
  },
  '该用户名已被占用'
);

// 使用
const form = useFormState({
  fields: {
    username: {
      validator: Validators.compose(
        Validators.required(),
        usernameAvailable
      )
    },
    confirmPassword: {
      validator: passwordMatch,
      dependencies: ['password'] // 关键！
    }
  }
});`}</code
				></pre>
		</section>
	</div>

	<div class="demo-container">
		<h2>交互演示</h2>

		<div class="form-card">
			<Form formState={form} onSubmit={handleSubmit}>
				<FormField name="username" label="用户名">
					{#snippet children({ value, error, touched, validating, onInput, onBlur })}
						<div class="input-wrapper">
							<input
								type="text"
								{value}
								class:error={touched && error}
								class:validating
								placeholder="请输入用户名（尝试: admin, user, test）"
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
							/>
							{#if validating}
								<span class="spinner"></span>
							{/if}
						</div>
						<p class="hint">试试输入 admin、user、test 等已占用的用户名</p>
					{/snippet}
				</FormField>

				<FormField name="email" label="邮箱">
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
						<div class="password-field">
							<input
								type="password"
								{value}
								class:error={touched && error}
								placeholder="至少 8 个字符，包含大小写字母、数字和特殊字符"
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
							/>
							{#if value}
								<div class="strength-indicator">
									<span class="strength-label">强度:</span>
									<div class="strength-bar">
										{#each Array(5) as _unused, i (i)}
											<div
												class="strength-segment"
												class:active={i < passwordStrength.level}
												class:red={passwordStrength.color === 'red'}
												class:yellow={passwordStrength.color === 'yellow'}
												class:green={passwordStrength.color === 'green'}
											></div>
										{/each}
									</div>
									<span class="strength-text" style="color: {passwordStrength.color}">
										{passwordStrength.text}
									</span>
								</div>
							{/if}
						</div>
					{/snippet}
				</FormField>

				<FormField name="confirmPassword" label="确认密码">
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="password"
							{value}
							class:error={touched && error}
							placeholder="再次输入密码"
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
						/>
					{/snippet}
				</FormField>

				<div class="form-actions">
					<button type="submit" class="btn-primary" disabled={!canSubmit}>
						{form.isValidating ? '验证中...' : '注册'}
					</button>
					<button type="button" class="btn-secondary" onclick={() => form.reset()}> 重置 </button>
				</div>
			</Form>
		</div>

		<div class="info-card">
			<h3>💡 提示</h3>
			<ul>
				<li>用户名会进行异步验证，模拟检查是否已被占用</li>
				<li>密码强度实时计算并显示</li>
				<li>确认密码依赖主密码字段，当主密码改变时自动重新验证</li>
				<li>尝试输入 "admin"、"user"、"test" 等用户名查看验证效果</li>
			</ul>
		</div>

		<div class="state-viewer">
			<h3>表单状态</h3>
			<details open>
				<summary>字段状态</summary>
				<pre class="state-data">{JSON.stringify(
						{
							username: form.getFieldState('username'),
							password: form.getFieldState('password'),
							confirmPassword: form.getFieldState('confirmPassword')
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

	.form-card,
	.info-card,
	.state-viewer {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
	}

	:global(.form-field) {
		margin-bottom: 1.5rem;
	}

	input {
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

	input.validating {
		border-color: #f59e0b;
	}

	.input-wrapper {
		position: relative;
	}

	.spinner {
		position: absolute;
		right: 0.75rem;
		top: 50%;
		transform: translateY(-50%);
		width: 1rem;
		height: 1rem;
		border: 2px solid #f59e0b;
		border-top-color: transparent;
		border-radius: 50%;
		animation: spin 0.6s linear infinite;
	}

	@keyframes spin {
		to {
			transform: translateY(-50%) rotate(360deg);
		}
	}

	.hint {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		color: #6b7280;
	}

	.password-field {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.strength-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.strength-label {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.strength-bar {
		display: flex;
		gap: 0.25rem;
		flex: 1;
	}

	.strength-segment {
		height: 0.5rem;
		flex: 1;
		background: #e5e7eb;
		border-radius: 9999px;
		transition: all 0.3s;
	}

	.strength-segment.active {
		background: currentColor;
	}

	.strength-segment.red {
		color: #ef4444;
	}

	.strength-segment.yellow {
		color: #f59e0b;
	}

	.strength-segment.green {
		color: #10b981;
	}

	.strength-text {
		font-size: 0.875rem;
		font-weight: 600;
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

	.info-card h3 {
		font-size: 1.25rem;
		margin-bottom: 1rem;
	}

	.info-card ul {
		list-style: none;
		padding: 0;
	}

	.info-card li {
		padding: 0.5rem 0;
		color: #374151;
		padding-left: 1.5rem;
		position: relative;
	}

	.info-card li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: #667eea;
	}

	.state-viewer h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	details summary {
		cursor: pointer;
		font-weight: 500;
		color: #667eea;
		margin-bottom: 0.5rem;
	}

	.state-data {
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

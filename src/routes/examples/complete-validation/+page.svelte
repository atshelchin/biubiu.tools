<script lang="ts">
	/**
	 * 输入完成验证示例 - Validate on Complete
	 * 展示 validateOnComplete 功能：智能检测输入完成，自动触发验证
	 */
	import {
		useFormState,
		Form,
		FormField,
		Validators,
		createCustomValidator
	} from '@shelchin/formstate';
	import type { FormState } from '@shelchin/formstate';

	// 模拟异步验证：检查用户名是否可用
	const usernameAvailableValidator = createCustomValidator(async (value: unknown) => {
		const username = value as string;

		// 模拟 API 调用延迟
		await new Promise((resolve) => setTimeout(resolve, 800));

		// 模拟已占用的用户名
		const takenUsernames = ['admin', 'user', 'test', 'demo'];
		return !takenUsernames.includes(username.toLowerCase());
	}, '用户名已被占用');

	// 模拟异步验证：检查邮箱是否已注册
	const emailAvailableValidator = createCustomValidator(async (value: unknown) => {
		const email = value as string;

		await new Promise((resolve) => setTimeout(resolve, 1000));

		const registeredEmails = ['test@example.com', 'admin@example.com'];
		return !registeredEmails.includes(email.toLowerCase());
	}, '该邮箱已注册');

	// 表单1: validateOnComplete (推荐)
	const form1: FormState = useFormState({
		fields: {
			username: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入用户名'),
					Validators.minLength(3, '用户名至少3位'),
					usernameAvailableValidator
				),
				validateOnComplete: true, // 启用输入完成验证
				completeCondition: (value: unknown) => {
					// 自定义完成条件：至少3个字符
					return (value as string).length >= 3;
				},
				debounceMs: 500 // 停止输入500ms后验证
			},
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入邮箱'),
					Validators.email('邮箱格式不正确'),
					emailAvailableValidator
				),
				validateOnComplete: true,
				completeCondition: (value: unknown) => {
					// 包含@和.才认为完成
					const str = value as string;
					return str.includes('@') && str.includes('.');
				},
				debounceMs: 600
			},
			phone: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入手机号'),
					Validators.pattern(/^\d{11}$/, '请输入11位手机号')
				),
				validateOnComplete: true,
				completeCondition: (value: unknown) => {
					// 输入满11位数字后验证
					return (value as string).length === 11;
				},
				debounceMs: 200
			}
		}
	});

	// 表单2: validateOnChange (对比)
	const form2: FormState = useFormState({
		fields: {
			username: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入用户名'),
					Validators.minLength(3, '用户名至少3位')
				),
				validateOnChange: true // 每次输入都验证
			},
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入邮箱'),
					Validators.email('邮箱格式不正确')
				),
				validateOnChange: true
			},
			phone: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入手机号'),
					Validators.pattern(/^\d{11}$/, '请输入11位手机号')
				),
				validateOnChange: true
			}
		}
	});

	// 表单3: validateOnBlur (对比)
	const form3: FormState = useFormState({
		fields: {
			username: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入用户名'),
					Validators.minLength(3, '用户名至少3位')
				),
				validateOnBlur: true, // 失去焦点时验证
				validateOnChange: false
			},
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入邮箱'),
					Validators.email('邮箱格式不正确')
				),
				validateOnBlur: true,
				validateOnChange: false
			},
			phone: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入手机号'),
					Validators.pattern(/^\d{11}$/, '请输入11位手机号')
				),
				validateOnBlur: true,
				validateOnChange: false
			}
		}
	});

	// 统计验证次数
	let validationCount1 = $state(0);
	let validationCount2 = $state(0);
	let validationCount3 = $state(0);

	// 监听验证事件
	form1._manager.subscribe({
		onFieldValidation: () => validationCount1++
	});

	form2._manager.subscribe({
		onFieldValidation: () => validationCount2++
	});

	form3._manager.subscribe({
		onFieldValidation: () => validationCount3++
	});

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('提交:', values);
		alert('提交成功！');
	}
</script>

<div class="example-page">
	<div class="header">
		<h1>输入完成验证示例</h1>
		<p class="description">
			对比三种验证模式：validateOnComplete (智能) vs validateOnChange (频繁) vs validateOnBlur
			(延迟)
		</p>
	</div>

	<div class="comparison-grid">
		<!-- 表单1: validateOnComplete -->
		<div class="form-card">
			<div class="card-header recommended">
				<h2>✨ validateOnComplete</h2>
				<span class="badge">推荐</span>
			</div>
			<p class="card-desc">智能检测输入完成，用户体验最佳</p>

			<div class="stats">
				<span class="stat-label">验证次数:</span>
				<span class="stat-value">{validationCount1}</span>
			</div>

			<Form formState={form1} onSubmit={handleSubmit} class="demo-form">
				<FormField name="username" label="用户名 (≥3字符后验证)">
					{#snippet children({ value, onInput, onBlur, validating })}
						<div class="input-wrapper">
							<input
								type="text"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="至少3位"
							/>
							{#if validating}
								<span class="spinner"></span>
							{/if}
						</div>
						<div class="hint">💡 输入3个字符后，停止500ms自动验证</div>
					{/snippet}
				</FormField>

				<FormField name="email" label="邮箱 (包含@和.后验证)">
					{#snippet children({ value, onInput, onBlur, validating })}
						<div class="input-wrapper">
							<input
								type="email"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="your@email.com"
							/>
							{#if validating}
								<span class="spinner"></span>
							{/if}
						</div>
						<div class="hint">💡 输入@和.后，停止600ms自动验证</div>
					{/snippet}
				</FormField>

				<FormField name="phone" label="手机号 (11位后验证)">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="tel"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="11位手机号"
							maxlength="11"
						/>
						<div class="hint">💡 输入满11位后，停止200ms自动验证</div>
					{/snippet}
				</FormField>

				<button type="submit" disabled={!form1.isValid}> 提交 </button>
			</Form>

			<div class="pros-cons">
				<div class="pros">
					<strong>✅ 优点:</strong>
					<ul>
						<li>验证时机恰当，不打扰用户</li>
						<li>减少不必要的验证</li>
						<li>支持异步验证防抖</li>
						<li>自定义完成条件</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 表单2: validateOnChange -->
		<div class="form-card">
			<div class="card-header">
				<h2>⚡ validateOnChange</h2>
			</div>
			<p class="card-desc">每次输入都验证，可能过于频繁</p>

			<div class="stats warning">
				<span class="stat-label">验证次数:</span>
				<span class="stat-value">{validationCount2}</span>
			</div>

			<Form formState={form2} onSubmit={handleSubmit} class="demo-form">
				<FormField name="username" label="用户名">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="text"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="至少3位"
						/>
						<div class="hint warning">⚠️ 每次按键都验证，可能干扰用户</div>
					{/snippet}
				</FormField>

				<FormField name="email" label="邮箱">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="email"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="your@email.com"
						/>
						<div class="hint warning">⚠️ 输入"t"就提示错误</div>
					{/snippet}
				</FormField>

				<FormField name="phone" label="手机号">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="tel"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="11位手机号"
							maxlength="11"
						/>
						<div class="hint warning">⚠️ 输入"1"就提示格式错误</div>
					{/snippet}
				</FormField>

				<button type="submit" disabled={!form2.isValid}> 提交 </button>
			</Form>

			<div class="pros-cons">
				<div class="cons">
					<strong>❌ 缺点:</strong>
					<ul>
						<li>验证次数过多</li>
						<li>输入时就显示错误，体验差</li>
						<li>异步验证会频繁触发</li>
					</ul>
				</div>
			</div>
		</div>

		<!-- 表单3: validateOnBlur -->
		<div class="form-card">
			<div class="card-header">
				<h2>👀 validateOnBlur</h2>
			</div>
			<p class="card-desc">失去焦点时验证，反馈较慢</p>

			<div class="stats">
				<span class="stat-label">验证次数:</span>
				<span class="stat-value">{validationCount3}</span>
			</div>

			<Form formState={form3} onSubmit={handleSubmit} class="demo-form">
				<FormField name="username" label="用户名">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="text"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="至少3位"
						/>
						<div class="hint info">ℹ️ 点击其他地方才验证</div>
					{/snippet}
				</FormField>

				<FormField name="email" label="邮箱">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="email"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="your@email.com"
						/>
						<div class="hint info">ℹ️ 失去焦点才验证</div>
					{/snippet}
				</FormField>

				<FormField name="phone" label="手机号">
					{#snippet children({ value, onInput, onBlur })}
						<input
							type="tel"
							{value}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
							placeholder="11位手机号"
							maxlength="11"
						/>
						<div class="hint info">ℹ️ Blur后才验证</div>
					{/snippet}
				</FormField>

				<button type="submit" disabled={!form3.isValid}> 提交 </button>
			</Form>

			<div class="pros-cons">
				<div class="cons">
					<strong>⚠️ 缺点:</strong>
					<ul>
						<li>反馈延迟，用户需等待</li>
						<li>可能填完整个表单才发现错误</li>
						<li>需要手动切换焦点</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<!-- 代码示例 -->
	<div class="code-section">
		<h2>📖 实现代码</h2>

		<div class="code-example">
			<h3>validateOnComplete 配置</h3>
			<pre><code
					>{`const form = useFormState({
  fields: {
    username: {
      validator: Validators.compose(
        Validators.required(),
        Validators.minLength(3),
        usernameAvailableValidator // 异步验证
      ),
      validateOnComplete: true,
      // 自定义完成条件
      completeCondition: (value) => {
        return value.length >= 3;
      },
      // 防抖延迟（毫秒）
      debounceMs: 500
    },
    email: {
      validator: Validators.compose(
        Validators.required(),
        Validators.email()
      ),
      validateOnComplete: true,
      completeCondition: (value) => {
        // 包含@和.才认为输入完成
        return value.includes('@') && value.includes('.');
      },
      debounceMs: 600
    },
    phone: {
      validator: Validators.pattern(/^\\d{11}$/),
      validateOnComplete: true,
      completeCondition: (value) => {
        // 输入满11位才验证
        return value.length === 11;
      },
      debounceMs: 200
    }
  }
});`}</code
				></pre>
		</div>

		<div class="default-conditions">
			<h3>默认完成条件</h3>
			<p>如果不提供 <code>completeCondition</code>，FormState 使用以下默认规则：</p>
			<ul>
				<li><strong>字符串</strong>: <code>value.trim().length > 0</code></li>
				<li><strong>数字</strong>: <code>!isNaN(value)</code></li>
				<li><strong>数组</strong>: <code>value.length > 0</code></li>
				<li><strong>对象</strong>: <code>value != null</code></li>
			</ul>
		</div>
	</div>
</div>

<style>
	.example-page {
		max-width: 1600px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #666;
		font-size: 1.1rem;
	}

	.comparison-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		margin-bottom: 3rem;
	}

	.form-card {
		background: white;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		overflow: hidden;
	}

	.card-header {
		padding: 1.5rem;
		background: #f5f5f5;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-header.recommended {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
	}

	.card-header h2 {
		margin: 0;
		font-size: 1.3rem;
	}

	.badge {
		background: #4caf50;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: bold;
	}

	.card-desc {
		padding: 1rem 1.5rem;
		color: #666;
		font-size: 0.9rem;
		border-bottom: 1px solid #eee;
		margin: 0;
	}

	.stats {
		padding: 1rem 1.5rem;
		background: #e8f5e9;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.stats.warning {
		background: #fff3e0;
	}

	.stat-label {
		font-weight: 500;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: bold;
		color: #4caf50;
	}

	.stats.warning .stat-value {
		color: #ff9800;
	}

	.input-wrapper {
		position: relative;
	}

	.spinner {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		width: 16px;
		height: 16px;
		border: 2px solid #f3f3f3;
		border-top: 2px solid #2196f3;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% {
			transform: translateY(-50%) rotate(0deg);
		}
		100% {
			transform: translateY(-50%) rotate(360deg);
		}
	}

	.hint {
		margin-top: 0.25rem;
		font-size: 0.8rem;
		color: #666;
		padding: 0.5rem;
		background: #f9f9f9;
		border-radius: 3px;
	}

	.hint.warning {
		background: #fff3e0;
		color: #f57c00;
	}

	.hint.info {
		background: #e3f2fd;
		color: #1976d2;
	}

	.pros-cons {
		padding: 1rem 1.5rem;
		border-top: 1px solid #eee;
	}

	.pros ul,
	.cons ul {
		margin: 0.5rem 0 0;
		padding-left: 1.5rem;
	}

	.pros li {
		color: #4caf50;
		margin-bottom: 0.25rem;
	}

	.cons li {
		color: #f44336;
		margin-bottom: 0.25rem;
	}

	button[type='submit'] {
		padding: 0.75rem 1.5rem;
		background: #2196f3;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	button[type='submit']:hover:not(:disabled) {
		background: #1976d2;
	}

	button[type='submit']:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.code-section {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.code-section h2 {
		margin-top: 0;
	}

	.code-example {
		margin-bottom: 2rem;
	}

	.code-example h3 {
		margin-bottom: 0.5rem;
	}

	.code-example pre {
		background: #282c34;
		color: #abb2bf;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 0;
	}

	.code-example code {
		font-family: 'Fira Code', monospace;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.default-conditions {
		padding: 1.5rem;
		background: #f5f5f5;
		border-radius: 4px;
	}

	.default-conditions h3 {
		margin-top: 0;
	}

	.default-conditions code {
		background: white;
		padding: 0.2rem 0.4rem;
		border-radius: 2px;
		font-family: 'Fira Code', monospace;
	}

	.default-conditions ul {
		margin-bottom: 0;
	}

	.default-conditions li {
		margin-bottom: 0.5rem;
	}

	@media (max-width: 80rem) {
		.comparison-grid {
			grid-template-columns: 1fr;
		}
	}
</style>

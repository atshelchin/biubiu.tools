<script lang="ts">
	/**
	 * 字段依赖示例 - Field Dependencies
	 * 展示如何在一个字段变化时自动重新验证依赖它的其他字段
	 */
	import {
		useFormState,
		Form,
		FormField,
		Validators,
		createValidator
	} from '@packages/formstate/src';
	import type { FormState } from '@packages/formstate/src';

	// 自定义验证器：密码确认
	const passwordMatchValidator = createValidator(
		(value: unknown, allValues: Record<string, unknown>) => {
			if (value !== allValues.password) {
				return '两次密码不一致';
			}
			return null;
		}
	);

	// 自定义验证器：折扣码（依赖订单金额）
	const discountCodeValidator = createValidator(
		async (value: unknown, allValues: Record<string, unknown>) => {
			const code = value as string;
			const total = allValues.orderTotal as number;

			// 订单金额小于100时不验证折扣码
			if (!total || total < 100) {
				return null;
			}

			// 模拟异步验证
			await new Promise((resolve) => setTimeout(resolve, 500));

			// 验证折扣码格式和有效性
			if (!code || code.trim() === '') {
				return '订单金额超过100元时，必须输入折扣码';
			}

			if (code.length < 6) {
				return '折扣码至少6位';
			}

			// 模拟检查折扣码是否有效
			const validCodes = ['SAVE10', 'SAVE20', 'WELCOME'];
			if (!validCodes.includes(code.toUpperCase())) {
				return `无效的折扣码。有效代码: ${validCodes.join(', ')}`;
			}

			return null;
		}
	);

	// 自定义验证器：确认电子邮件（依赖邮箱）
	const emailMatchValidator = createValidator(
		(value: unknown, allValues: Record<string, unknown>) => {
			if (value !== allValues.email) {
				return '两次邮箱地址不一致';
			}
			return null;
		}
	);

	// 创建表单
	const form: FormState = useFormState({
		fields: {
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入邮箱'),
					Validators.email('邮箱格式不正确')
				)
			},
			confirmEmail: {
				defaultValue: '',
				validator: Validators.compose(Validators.required('请确认邮箱'), emailMatchValidator),
				// 当 email 字段变化时，重新验证 confirmEmail
				dependencies: ['email']
			},
			password: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入密码'),
					Validators.minLength(8, '密码至少8位')
				)
			},
			confirmPassword: {
				defaultValue: '',
				validator: Validators.compose(Validators.required('请确认密码'), passwordMatchValidator),
				// 当 password 字段变化时，重新验证 confirmPassword
				dependencies: ['password']
			},
			orderTotal: {
				defaultValue: 0,
				validator: Validators.min(0, '订单金额不能为负')
			},
			discountCode: {
				defaultValue: '',
				validator: discountCodeValidator,
				// 当 orderTotal 变化时，重新验证 discountCode
				dependencies: ['orderTotal'],
				validateOnComplete: true,
				debounceMs: 500
			}
		}
	});

	// 派生计算
	const orderTotal = $derived((form.getValue('orderTotal') as number) || 0);
	const discountRequired = $derived(orderTotal >= 100);
	const discountCode = $derived((form.getValue('discountCode') as string) || '');

	// 计算折扣金额
	const discountAmount = $derived(() => {
		if (!discountRequired || !discountCode) return 0;
		const code = discountCode.toUpperCase();
		if (code === 'SAVE10') return orderTotal * 0.1;
		if (code === 'SAVE20') return orderTotal * 0.2;
		if (code === 'WELCOME') return orderTotal * 0.15;
		return 0;
	});

	const finalTotal = $derived(Math.max(0, orderTotal - discountAmount()));

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('表单提交:', values);
		alert(`注册成功！\n邮箱: ${values.email}\n订单总额: ¥${finalTotal.toFixed(2)}`);
	}
</script>

<div class="example-page">
	<div class="header">
		<h1>字段依赖示例</h1>
		<p class="description">
			演示字段间的依赖关系：当一个字段变化时，自动重新验证依赖它的其他字段。
		</p>
	</div>

	<div class="content">
		<div class="demo-section">
			<h2>用户注册表单</h2>
			<p class="hint">💡 修改"邮箱"或"密码"字段，观察确认字段的自动重新验证</p>

			<Form formState={form} onSubmit={handleSubmit} class="demo-form">
				<!-- 邮箱 -->
				<div class="form-section">
					<h3>📧 邮箱验证</h3>

					<FormField name="email" label="邮箱地址">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="email"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="your@email.com"
							/>
						{/snippet}
					</FormField>

					<FormField name="confirmEmail" label="确认邮箱">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="email"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="再次输入邮箱"
							/>
							<div class="field-hint">
								<strong>依赖关系:</strong> 当"邮箱地址"改变时，此字段会自动重新验证
							</div>
						{/snippet}
					</FormField>
				</div>

				<!-- 密码 -->
				<div class="form-section">
					<h3>🔒 密码验证</h3>

					<FormField name="password" label="密码">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="password"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="至少8位"
							/>
						{/snippet}
					</FormField>

					<FormField name="confirmPassword" label="确认密码">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="password"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="再次输入密码"
							/>
							<div class="field-hint">
								<strong>依赖关系:</strong> 当"密码"改变时，此字段会自动重新验证
							</div>
						{/snippet}
					</FormField>
				</div>

				<!-- 订单金额与折扣码 -->
				<div class="form-section">
					<h3>💰 订单金额与折扣</h3>

					<FormField name="orderTotal" label="订单金额">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="number"
								{value}
								oninput={(e) => onInput(parseFloat(e.currentTarget.value) || 0)}
								onblur={onBlur}
								min="0"
								step="0.01"
								placeholder="0.00"
							/>
							<div class="field-hint">💡 订单金额 ≥ ¥100 时，必须输入折扣码</div>
						{/snippet}
					</FormField>

					<FormField name="discountCode" label="折扣码 {discountRequired ? '(必填)' : '(可选)'}">
						{#snippet children({ value, onInput, onBlur, validating })}
							<div class="discount-input">
								<input
									type="text"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
									placeholder={discountRequired ? '请输入折扣码' : '可选'}
									class:required={discountRequired}
								/>
								{#if validating}
									<span class="validating">验证中...</span>
								{/if}
							</div>
							<div class="field-hint">
								<strong>依赖关系:</strong> 当"订单金额"改变时，此字段会自动重新验证<br />
								<strong>有效代码:</strong> SAVE10 (9折), SAVE20 (8折), WELCOME (85折)
							</div>
						{/snippet}
					</FormField>

					{#if discountAmount() > 0}
						<div class="discount-summary">
							<div class="summary-row">
								<span>原价:</span>
								<span>¥{orderTotal.toFixed(2)}</span>
							</div>
							<div class="summary-row discount">
								<span>折扣:</span>
								<span>-¥{discountAmount().toFixed(2)}</span>
							</div>
							<div class="summary-row total">
								<span>实付:</span>
								<span>¥{finalTotal.toFixed(2)}</span>
							</div>
						</div>
					{/if}
				</div>

				<button type="submit" class="submit-btn" disabled={!form.isValid}> 提交注册 </button>
			</Form>
		</div>

		<!-- 说明文档 -->
		<div class="docs-section">
			<h2>📖 实现说明</h2>

			<div class="code-example">
				<h3>1. 定义依赖关系</h3>
				<pre><code
						>{`const form = useFormState({
  fields: {
    password: {
      validator: Validators.minLength(8)
    },
    confirmPassword: {
      validator: passwordMatchValidator,
      // 当 password 变化时，自动重新验证此字段
      dependencies: ['password']
    },
    orderTotal: {
      validator: Validators.min(0)
    },
    discountCode: {
      validator: discountCodeValidator,
      // 当 orderTotal 变化时，自动重新验证此字段
      dependencies: ['orderTotal']
    }
  }
});`}</code
					></pre>
			</div>

			<div class="code-example">
				<h3>2. 编写依赖验证器</h3>
				<pre><code
						>{`// 密码确认验证器
const passwordMatchValidator = createValidator(
  (value, allValues) => {
    if (value !== allValues.password) {
      return '两次密码不一致';
    }
    return null;
  }
);

// 折扣码验证器（依赖订单金额）
const discountCodeValidator = createValidator(
  async (value, allValues) => {
    const total = allValues.orderTotal as number;

    // 金额 < 100 时不验证
    if (total < 100) return null;

    // 金额 >= 100 时必须填写
    if (!value) {
      return '订单金额超过100时，必须输入折扣码';
    }

    // 异步验证折扣码有效性
    const isValid = await checkDiscountCode(value);
    return isValid ? null : '无效的折扣码';
  }
);`}</code
					></pre>
			</div>

			<div class="feature-list">
				<h3>✨ 特性亮点</h3>
				<ul>
					<li><strong>自动级联验证</strong>：修改字段A时，依赖A的字段B自动重新验证</li>
					<li><strong>访问所有字段值</strong>：验证器可以访问 allValues 参数</li>
					<li><strong>异步验证支持</strong>：折扣码验证模拟了API调用</li>
					<li><strong>条件验证</strong>：根据其他字段值决定是否验证（如订单金额）</li>
					<li><strong>防抖优化</strong>：使用 validateOnComplete 减少不必要的验证</li>
				</ul>
			</div>

			<div class="use-cases">
				<h3>🎯 适用场景</h3>
				<ul>
					<li>密码确认、邮箱确认</li>
					<li>开始日期 → 结束日期（结束必须晚于开始）</li>
					<li>国家 → 省份 → 城市（级联选择）</li>
					<li>商品数量 → 库存检查</li>
					<li>优惠券 → 订单金额验证</li>
					<li>支付方式 → 对应字段验证</li>
				</ul>
			</div>
		</div>
	</div>
</div>

<style>
	.example-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.header {
		margin-bottom: 2rem;
	}

	.header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #666;
		font-size: 1.1rem;
	}

	.content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.demo-section {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.demo-section h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.hint {
		background: #e3f2fd;
		padding: 0.75rem;
		border-radius: 4px;
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
	}

	.demo-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-section {
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 6px;
	}

	.form-section h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.field-hint {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		color: #666;
		padding: 0.5rem;
		background: white;
		border-left: 3px solid #2196f3;
		border-radius: 2px;
	}

	.discount-input {
		position: relative;
	}

	.discount-input input.required {
		border-color: #ff9800;
	}

	.validating {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		color: #2196f3;
		font-size: 0.85rem;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.discount-summary {
		margin-top: 1rem;
		padding: 1rem;
		background: white;
		border-radius: 4px;
		border: 2px solid #4caf50;
	}

	.summary-row {
		display: flex;
		justify-content: space-between;
		padding: 0.5rem 0;
	}

	.summary-row.discount {
		color: #4caf50;
		font-weight: bold;
	}

	.summary-row.total {
		border-top: 2px solid #ddd;
		margin-top: 0.5rem;
		padding-top: 0.75rem;
		font-size: 1.2rem;
		font-weight: bold;
		color: #f44336;
	}

	.submit-btn {
		padding: 1rem 2rem;
		font-size: 1.1rem;
		background: #2196f3;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background 0.2s;
	}

	.submit-btn:hover:not(:disabled) {
		background: #1976d2;
	}

	.submit-btn:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.docs-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.docs-section h2 {
		margin-top: 0;
	}

	.code-example {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.code-example h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1rem;
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

	.feature-list,
	.use-cases {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.feature-list h3,
	.use-cases h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1rem;
	}

	.feature-list ul,
	.use-cases ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.feature-list li,
	.use-cases li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	@media (max-width: 1200px) {
		.content {
			grid-template-columns: 1fr;
		}
	}
</style>

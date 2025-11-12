<script lang="ts">
	/**
	 * 多步表单示例 - Multi-Step Form
	 * 展示如何使用 validateFields 实现分步验证和导航
	 */
	import { useFormState, Form, FormField, Validators } from '@packages/formstate/src';
	import type { FormState } from '@packages/formstate/src';

	// 步骤定义
	const STEPS = [
		{ id: 1, title: '账号信息', fields: ['username', 'email', 'password', 'confirmPassword'] },
		{ id: 2, title: '个人资料', fields: ['firstName', 'lastName', 'birthDate', 'gender'] },
		{ id: 3, title: '联系方式', fields: ['phone', 'address', 'city', 'zipCode'] },
		{ id: 4, title: '确认提交', fields: [] }
	] as const;

	let currentStep = $state(1);
	let stepErrors = $state<Record<number, string[]>>({});

	// 创建表单
	const form: FormState = useFormState({
		fields: {
			// 第1步：账号信息
			username: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入用户名'),
					Validators.minLength(3, '用户名至少3位')
				)
			},
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入邮箱'),
					Validators.email('邮箱格式不正确')
				)
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
				validator: Validators.required('请确认密码'),
				dependencies: ['password']
			},

			// 第2步：个人资料
			firstName: {
				defaultValue: '',
				validator: Validators.required('请输入名字')
			},
			lastName: {
				defaultValue: '',
				validator: Validators.required('请输入姓氏')
			},
			birthDate: {
				defaultValue: '',
				validator: Validators.required('请选择出生日期')
			},
			gender: {
				defaultValue: '',
				validator: Validators.required('请选择性别')
			},

			// 第3步：联系方式
			phone: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('请输入手机号'),
					Validators.pattern(/^1[3-9]\d{9}$/, '请输入有效的手机号')
				)
			},
			address: {
				defaultValue: '',
				validator: Validators.required('请输入地址')
			},
			city: {
				defaultValue: '',
				validator: Validators.required('请输入城市')
			},
			zipCode: {
				defaultValue: '',
				validator: Validators.pattern(/^\d{6}$/, '请输入6位邮编')
			}
		}
	});

	// 验证当前步骤
	async function validateCurrentStep(): Promise<boolean> {
		const step = STEPS[currentStep - 1];
		if (step.fields.length === 0) return true;

		// 验证当前步骤的所有字段
		const errors = await form._manager.validateFields(step.fields);
		const errorFields = Object.keys(errors);

		if (errorFields.length > 0) {
			// 记录错误
			stepErrors[currentStep] = errorFields;

			// 标记所有字段为已触摸，显示错误
			step.fields.forEach((field) => {
				form._manager.setFieldTouched(field, true);
			});

			return false;
		}

		// 清除该步骤的错误
		delete stepErrors[currentStep];
		return true;
	}

	// 下一步
	async function nextStep() {
		const isValid = await validateCurrentStep();
		if (isValid && currentStep < STEPS.length) {
			currentStep++;
		}
	}

	// 上一步
	function prevStep() {
		if (currentStep > 1) {
			currentStep--;
		}
	}

	// 跳转到指定步骤（只能跳转到已完成的步骤）
	async function goToStep(step: number) {
		if (step === currentStep) return;

		if (step < currentStep) {
			// 向前跳转，允许
			currentStep = step;
		} else {
			// 向后跳转，需要验证中间的所有步骤
			for (let i = currentStep; i < step; i++) {
				const stepData = STEPS[i - 1];
				if (stepData.fields.length > 0) {
					const errors = await form._manager.validateFields(stepData.fields);
					if (Object.keys(errors).length > 0) {
						// 验证失败，停在这一步
						currentStep = i;
						stepErrors[i] = Object.keys(errors);
						return;
					}
				}
			}
			currentStep = step;
		}
	}

	// 提交表单
	async function handleSubmit(values: Record<string, unknown>) {
		console.log('提交数据:', values);
		alert('注册成功！\n\n' + JSON.stringify(values, null, 2));
	}

	// 计算完成进度
	const progress = $derived((currentStep / STEPS.length) * 100);

	// 当前步骤是否可以继续
	const canProceed = $derived.by(() => {
		const step = STEPS[currentStep - 1];
		if (step.fields.length === 0) return true;

		// 检查当前步骤的字段是否都有值且没有错误
		return step.fields.every((field) => {
			const state = form._manager.getFieldState(field);
			return state.value && !state.error;
		});
	});
</script>

<div class="example-page">
	<div class="header">
		<h1>多步表单示例</h1>
		<p class="description">演示使用 validateFields() 实现分步验证、进度跟踪、步骤导航</p>
	</div>

	<!-- 进度条 -->
	<div class="progress-bar">
		<div class="progress-fill" style="width: {progress}%"></div>
	</div>

	<!-- 步骤指示器 -->
	<div class="stepper">
		{#each STEPS as step, index}
			{@const isActive = currentStep === step.id}
			{@const isCompleted = currentStep > step.id}
			{@const hasErrors = stepErrors[step.id]?.length > 0}
			<button
				class="step"
				class:active={isActive}
				class:completed={isCompleted}
				class:error={hasErrors}
				onclick={() => goToStep(step.id)}
			>
				<div class="step-number">
					{#if isCompleted}
						✓
					{:else if hasErrors}
						!
					{:else}
						{step.id}
					{/if}
				</div>
				<div class="step-title">{step.title}</div>
			</button>
			{#if index < STEPS.length - 1}
				<div class="step-connector" class:completed={isCompleted}></div>
			{/if}
		{/each}
	</div>

	<!-- 表单内容 -->
	<div class="form-container">
		<Form formState={form} onSubmit={handleSubmit}>
			<!-- 第1步：账号信息 -->
			{#if currentStep === 1}
				<div class="step-content">
					<h2>账号信息</h2>
					<p class="step-desc">创建您的账号并设置登录密码</p>

					<div class="fields">
						<FormField name="username" label="用户名 *">
							{#snippet children({ value, onInput, onBlur })}
								<input
									type="text"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
									placeholder="至少3位字符"
								/>
							{/snippet}
						</FormField>

						<FormField name="email" label="邮箱 *">
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

						<FormField name="password" label="密码 *">
							{#snippet children({ value, onInput, onBlur })}
								<input
									type="password"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
									placeholder="至少8位字符"
								/>
							{/snippet}
						</FormField>

						<FormField name="confirmPassword" label="确认密码 *">
							{#snippet children({ value, onInput, onBlur })}
								<input
									type="password"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
									placeholder="再次输入密码"
								/>
							{/snippet}
						</FormField>
					</div>
				</div>
			{/if}

			<!-- 第2步：个人资料 -->
			{#if currentStep === 2}
				<div class="step-content">
					<h2>个人资料</h2>
					<p class="step-desc">告诉我们更多关于您的信息</p>

					<div class="fields">
						<div class="field-row">
							<FormField name="firstName" label="名字 *">
								{#snippet children({ value, onInput, onBlur })}
									<input
										type="text"
										{value}
										oninput={(e) => onInput(e.currentTarget.value)}
										onblur={onBlur}
										placeholder="名"
									/>
								{/snippet}
							</FormField>

							<FormField name="lastName" label="姓氏 *">
								{#snippet children({ value, onInput, onBlur })}
									<input
										type="text"
										{value}
										oninput={(e) => onInput(e.currentTarget.value)}
										onblur={onBlur}
										placeholder="姓"
									/>
								{/snippet}
							</FormField>
						</div>

						<FormField name="birthDate" label="出生日期 *">
							{#snippet children({ value, onInput, onBlur })}
								<input
									type="date"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
								/>
							{/snippet}
						</FormField>

						<FormField name="gender" label="性别 *">
							{#snippet children({ value, onInput })}
								<div class="radio-group">
									<label>
										<input
											type="radio"
											name="gender"
											value="male"
											checked={value === 'male'}
											onchange={() => onInput('male')}
										/>
										<span>男</span>
									</label>
									<label>
										<input
											type="radio"
											name="gender"
											value="female"
											checked={value === 'female'}
											onchange={() => onInput('female')}
										/>
										<span>女</span>
									</label>
									<label>
										<input
											type="radio"
											name="gender"
											value="other"
											checked={value === 'other'}
											onchange={() => onInput('other')}
										/>
										<span>其他</span>
									</label>
								</div>
							{/snippet}
						</FormField>
					</div>
				</div>
			{/if}

			<!-- 第3步：联系方式 -->
			{#if currentStep === 3}
				<div class="step-content">
					<h2>联系方式</h2>
					<p class="step-desc">我们如何联系到您？</p>

					<div class="fields">
						<FormField name="phone" label="手机号 *">
							{#snippet children({ value, onInput, onBlur })}
								<input
									type="tel"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
									placeholder="13812345678"
								/>
							{/snippet}
						</FormField>

						<FormField name="address" label="地址 *">
							{#snippet children({ value, onInput, onBlur })}
								<input
									type="text"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
									placeholder="街道地址"
								/>
							{/snippet}
						</FormField>

						<div class="field-row">
							<FormField name="city" label="城市 *">
								{#snippet children({ value, onInput, onBlur })}
									<input
										type="text"
										{value}
										oninput={(e) => onInput(e.currentTarget.value)}
										onblur={onBlur}
										placeholder="城市"
									/>
								{/snippet}
							</FormField>

							<FormField name="zipCode" label="邮编">
								{#snippet children({ value, onInput, onBlur })}
									<input
										type="text"
										{value}
										oninput={(e) => onInput(e.currentTarget.value)}
										onblur={onBlur}
										placeholder="100000"
										maxlength="6"
									/>
								{/snippet}
							</FormField>
						</div>
					</div>
				</div>
			{/if}

			<!-- 第4步：确认 -->
			{#if currentStep === 4}
				<div class="step-content">
					<h2>确认提交</h2>
					<p class="step-desc">请确认您的信息无误后提交</p>

					<div class="summary">
						<div class="summary-section">
							<h3>账号信息</h3>
							<div class="summary-item">
								<span class="label">用户名:</span>
								<span class="value">{form.getValue('username')}</span>
							</div>
							<div class="summary-item">
								<span class="label">邮箱:</span>
								<span class="value">{form.getValue('email')}</span>
							</div>
						</div>

						<div class="summary-section">
							<h3>个人资料</h3>
							<div class="summary-item">
								<span class="label">姓名:</span>
								<span class="value">{form.getValue('lastName')} {form.getValue('firstName')}</span>
							</div>
							<div class="summary-item">
								<span class="label">出生日期:</span>
								<span class="value">{form.getValue('birthDate')}</span>
							</div>
							<div class="summary-item">
								<span class="label">性别:</span>
								<span class="value">
									{form.getValue('gender') === 'male'
										? '男'
										: form.getValue('gender') === 'female'
											? '女'
											: '其他'}
								</span>
							</div>
						</div>

						<div class="summary-section">
							<h3>联系方式</h3>
							<div class="summary-item">
								<span class="label">手机号:</span>
								<span class="value">{form.getValue('phone')}</span>
							</div>
							<div class="summary-item">
								<span class="label">地址:</span>
								<span class="value">{form.getValue('address')}</span>
							</div>
							<div class="summary-item">
								<span class="label">城市:</span>
								<span class="value">{form.getValue('city')}</span>
							</div>
							{#if form.getValue('zipCode')}
								<div class="summary-item">
									<span class="label">邮编:</span>
									<span class="value">{form.getValue('zipCode')}</span>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}

			<!-- 导航按钮 -->
			<div class="form-actions">
				{#if currentStep > 1}
					<button type="button" class="btn-secondary" onclick={prevStep}> ← 上一步 </button>
				{/if}

				<div class="spacer"></div>

				{#if currentStep < STEPS.length}
					<button type="button" class="btn-primary" onclick={nextStep} disabled={!canProceed}>
						下一步 →
					</button>
				{:else}
					<button type="submit" class="btn-submit" disabled={!form.isValid}> 提交注册 </button>
				{/if}
			</div>
		</Form>
	</div>

	<!-- 右侧文档 -->
	<div class="docs-section">
		<div class="code-section">
			<h3>📖 实现代码</h3>

			<div class="code-block">
				<h4>1. 定义步骤</h4>
				<pre><code
						>{`const STEPS = [
  { id: 1, title: '账号信息',
    fields: ['username', 'email', 'password'] },
  { id: 2, title: '个人资料',
    fields: ['firstName', 'lastName', 'birthDate'] },
  { id: 3, title: '联系方式',
    fields: ['phone', 'address', 'city'] }
];`}</code
					></pre>
			</div>

			<div class="code-block">
				<h4>2. 验证当前步骤</h4>
				<pre><code
						>{`async function validateCurrentStep() {
  const step = STEPS[currentStep - 1];

  // 验证当前步骤的所有字段
  const errors = await form.validateFields(step.fields);

  if (Object.keys(errors).length > 0) {
    // 标记字段为已触摸，显示错误
    step.fields.forEach(field => {
      form.setFieldTouched(field, true);
    });
    return false;
  }

  return true;
}`}</code
					></pre>
			</div>

			<div class="code-block">
				<h4>3. 导航控制</h4>
				<pre><code
						>{`async function nextStep() {
  const isValid = await validateCurrentStep();
  if (isValid && currentStep < STEPS.length) {
    currentStep++;
  }
}

function prevStep() {
  if (currentStep > 1) {
    currentStep--;
  }
}`}</code
					></pre>
			</div>
		</div>

		<div class="features">
			<h3>✨ 功能亮点</h3>
			<ul>
				<li><strong>分步验证</strong>：使用 validateFields() 只验证当前步骤</li>
				<li><strong>进度跟踪</strong>：实时显示完成进度</li>
				<li><strong>错误提示</strong>：步骤指示器显示错误状态</li>
				<li><strong>灵活导航</strong>：可跳转到已完成的步骤</li>
				<li><strong>最终确认</strong>：提交前预览所有数据</li>
			</ul>
		</div>

		<div class="use-cases">
			<h3>🎯 适用场景</h3>
			<ul>
				<li>用户注册（账号→资料→确认）</li>
				<li>订单结算（购物车→配送→支付）</li>
				<li>问卷调查（多页问题）</li>
				<li>向导式配置（步骤引导）</li>
				<li>复杂表单拆分</li>
			</ul>
		</div>

		<div class="tips">
			<h3>💡 使用提示</h3>
			<ul>
				<li>每一步只验证必需字段，提升用户体验</li>
				<li>允许回退修改，但前进需验证</li>
				<li>在最后一步展示汇总信息</li>
				<li>保存进度，防止意外退出</li>
				<li>步骤不宜过多（3-5步为宜）</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.example-page {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		display: grid;
		grid-template-columns: 800px 1fr;
		gap: 2rem;
	}

	.header {
		grid-column: 1 / -1;
		margin-bottom: 1rem;
	}

	.header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.description {
		color: #666;
		font-size: 1.1rem;
	}

	.progress-bar {
		grid-column: 1 / -1;
		height: 8px;
		background: #e0e0e0;
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #2196f3, #1976d2);
		transition: width 0.3s ease;
	}

	.stepper {
		grid-column: 1 / -1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0;
		padding: 2rem 0;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem 1rem;
		transition: all 0.2s;
	}

	.step:hover {
		transform: scale(1.05);
	}

	.step-number {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		background: #e0e0e0;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		transition: all 0.3s;
	}

	.step.active .step-number {
		background: #2196f3;
		color: white;
		box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.2);
	}

	.step.completed .step-number {
		background: #4caf50;
		color: white;
	}

	.step.error .step-number {
		background: #f44336;
		color: white;
	}

	.step-title {
		font-size: 0.85rem;
		color: #666;
		font-weight: 500;
	}

	.step.active .step-title {
		color: #2196f3;
		font-weight: 600;
	}

	.step-connector {
		flex: 1;
		height: 2px;
		background: #e0e0e0;
		min-width: 40px;
		transition: background 0.3s;
	}

	.step-connector.completed {
		background: #4caf50;
	}

	.form-container {
		background: white;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.step-content h2 {
		margin-top: 0;
		margin-bottom: 0.5rem;
	}

	.step-desc {
		color: #666;
		margin-bottom: 2rem;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.field-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.radio-group {
		display: flex;
		gap: 1.5rem;
		padding: 0.5rem 0;
	}

	.radio-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.summary {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.summary-section {
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 6px;
	}

	.summary-section h3 {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		color: #2196f3;
	}

	.summary-item {
		display: flex;
		padding: 0.5rem 0;
		border-bottom: 1px solid #e0e0e0;
	}

	.summary-item:last-child {
		border-bottom: none;
	}

	.summary-item .label {
		min-width: 100px;
		color: #666;
		font-size: 0.9rem;
	}

	.summary-item .value {
		font-weight: 500;
	}

	.form-actions {
		display: flex;
		gap: 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid #e0e0e0;
	}

	.spacer {
		flex: 1;
	}

	.btn-primary,
	.btn-secondary,
	.btn-submit {
		padding: 0.75rem 2rem;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		background: #2196f3;
		color: white;
	}

	.btn-primary:hover:not(:disabled) {
		background: #1976d2;
	}

	.btn-primary:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.btn-secondary {
		background: white;
		border: 1px solid #ddd;
		color: #666;
	}

	.btn-secondary:hover {
		background: #f5f5f5;
	}

	.btn-submit {
		background: #4caf50;
		color: white;
	}

	.btn-submit:hover:not(:disabled) {
		background: #45a049;
	}

	.btn-submit:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.docs-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.code-section,
	.features,
	.use-cases,
	.tips {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.code-section h3,
	.features h3,
	.use-cases h3,
	.tips h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.code-block {
		margin-bottom: 1.5rem;
	}

	.code-block:last-child {
		margin-bottom: 0;
	}

	.code-block h4 {
		margin: 0 0 0.5rem 0;
		font-size: 0.9rem;
		color: #666;
	}

	.code-block pre {
		background: #282c34;
		color: #abb2bf;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		margin: 0;
	}

	.code-block code {
		font-family: 'Fira Code', monospace;
		font-size: 0.85rem;
		line-height: 1.5;
	}

	.features ul,
	.use-cases ul,
	.tips ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.features li,
	.use-cases li,
	.tips li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	@media (max-width: 1200px) {
		.example-page {
			grid-template-columns: 1fr;
		}

		.stepper {
			flex-wrap: wrap;
		}

		.step-connector {
			display: none;
		}
	}
</style>

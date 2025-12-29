<script lang="ts">
	/**
	 * 值转换器示例 - Transformers
	 * 展示如何使用内置和自定义转换器处理用户输入
	 */
	import { useFormState, Form, FormField, Validators, Transformers } from '@shelchin/formstate';
	import type { FormState } from '@shelchin/formstate';
	import type { ITransformer } from '@shelchin/formstate';

	// 自定义转换器：格式化电话号码
	const phoneFormatter: ITransformer<string, string> = {
		transform: (value: string) => {
			// 移除所有非数字字符
			const digits = value.replace(/\D/g, '');

			// 格式化为 xxx-xxxx-xxxx
			if (digits.length <= 3) return digits;
			if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
			return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
		}
	};

	// 自定义转换器：格式化信用卡号
	const creditCardFormatter: ITransformer<string, string> = {
		transform: (value: string) => {
			const digits = value.replace(/\D/g, '');
			const groups = digits.match(/.{1,4}/g);
			return groups ? groups.join(' ') : digits;
		}
	};

	// 自定义转换器：货币格式化
	const currencyFormatter: ITransformer<string, string> = {
		transform: (value: string) => {
			const num = parseFloat(value.replace(/[^\d.]/g, ''));
			if (isNaN(num)) return '';
			return num.toFixed(2);
		}
	};

	// 自定义转换器：URL规范化
	const urlNormalizer: ITransformer<string, string> = {
		transform: (value: string) => {
			if (!value) return '';
			const trimmed = value.trim().toLowerCase();
			if (!/^https?:\/\//.test(trimmed)) {
				return `https://${trimmed}`;
			}
			return trimmed;
		}
	};

	// 自定义转换器：用户名规范化
	const usernameNormalizer: ITransformer<string, string> = {
		transform: (value: string) => {
			return value
				.toLowerCase()
				.replace(/[^a-z0-9_-]/g, '')
				.slice(0, 20);
		}
	};

	// 创建表单
	const form: FormState = useFormState({
		fields: {
			// 内置转换器示例
			fullName: {
				defaultValue: '',
				transformer: Transformers.trim as (value: unknown) => unknown,
				validator: Validators.required('请输入姓名')
			},
			username: {
				defaultValue: '',
				transformer: usernameNormalizer,
				validator: Validators.compose(
					Validators.required('请输入用户名'),
					Validators.minLength(3, '用户名至少3位')
				)
			},
			email: {
				defaultValue: '',
				transformer: Transformers.compose(
					Transformers.trim as (value: unknown) => unknown,
					Transformers.toLowerCase as (value: unknown) => unknown
				) as (value: unknown) => unknown,
				validator: Validators.compose(
					Validators.required('请输入邮箱'),
					Validators.email('邮箱格式不正确')
				)
			},

			// 自定义转换器示例
			phone: {
				defaultValue: '',
				transformer: phoneFormatter,
				validator: Validators.pattern(/^\d{3}-\d{4}-\d{4}$/, '请输入11位手机号')
			},
			creditCard: {
				defaultValue: '',
				transformer: creditCardFormatter,
				validator: Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/, '请输入16位卡号')
			},
			price: {
				defaultValue: '',
				transformer: currencyFormatter,
				validator: Validators.compose(
					Validators.required('请输入价格'),
					Validators.pattern(/^\d+\.\d{2}$/, '价格格式：0.00')
				)
			},
			website: {
				defaultValue: '',
				transformer: urlNormalizer
			},

			// 组合转换器示例
			bio: {
				defaultValue: '',
				transformer: Transformers.compose(
					Transformers.trim as (value: unknown) => unknown,
					// 自定义：限制长度
					((value: unknown) => (typeof value === 'string' ? value.slice(0, 200) : value)) as (
						value: unknown
					) => unknown
				),
				validator: Validators.maxLength(200, '简介不超过200字')
			},

			// 数字转换
			age: {
				defaultValue: '',
				transformer: Transformers.toNumber as (value: unknown) => unknown,
				validator: Validators.compose(
					Validators.min(1, '年龄必须大于0'),
					Validators.max(150, '年龄必须小于150')
				)
			}
		}
	});

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('提交数据:', values);
		alert('提交成功！\n\n' + JSON.stringify(values, null, 2));
	}

	// 实时显示转换前后对比
	const rawValues = $derived({
		phone: form.getValue('phone'),
		creditCard: form.getValue('creditCard'),
		price: form.getValue('price'),
		website: form.getValue('website'),
		username: form.getValue('username')
	});
</script>

<div class="example-page">
	<div class="header">
		<h1>值转换器示例</h1>
		<p class="description">演示使用内置和自定义 Transformers 自动处理、格式化、清理用户输入</p>
	</div>

	<div class="content">
		<!-- 左侧：表单 -->
		<div class="form-section">
			<h2>表单示例</h2>

			<Form formState={form} onSubmit={handleSubmit} class="demo-form">
				<!-- 内置转换器 -->
				<div class="section">
					<h3>📦 内置转换器</h3>

					<FormField name="fullName" label="姓名（自动去除首尾空格）">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="text"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="  试试输入前后带空格的文本  "
							/>
							<div class="hint">
								💡 使用 <code>Transformers.trim</code>
							</div>
						{/snippet}
					</FormField>

					<FormField name="email" label="邮箱（自动转小写 + 去空格）">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="email"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="YOUR@EMAIL.COM"
							/>
							<div class="hint">
								💡 组合使用 <code>trim</code> + <code>toLowerCase</code>
							</div>
						{/snippet}
					</FormField>

					<FormField name="age" label="年龄（字符串 → 数字）">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="text"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="25"
							/>
							<div class="hint">
								💡 使用 <code>Transformers.toNumber</code>，实际存储: {typeof form.getValue('age')}
							</div>
						{/snippet}
					</FormField>
				</div>

				<!-- 自定义转换器 -->
				<div class="section">
					<h3>✨ 自定义转换器</h3>

					<FormField name="username" label="用户名（仅小写字母、数字、-_）">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="text"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="试试输入大写或特殊字符"
							/>
							<div class="hint">💡 自动转小写、移除特殊字符、限制20字符</div>
						{/snippet}
					</FormField>

					<FormField name="phone" label="手机号（自动格式化）">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="tel"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="13812345678"
							/>
							<div class="hint">
								💡 自动格式化为 <code>138-1234-5678</code>
							</div>
						{/snippet}
					</FormField>

					<FormField name="creditCard" label="信用卡号（自动分组）">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="text"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="1234567890123456"
							/>
							<div class="hint">
								💡 自动格式化为 <code>1234 5678 9012 3456</code>
							</div>
						{/snippet}
					</FormField>

					<FormField name="price" label="价格（保留2位小数）">
						{#snippet children({ value, onInput, onBlur })}
							<div class="input-with-prefix">
								<span class="prefix">¥</span>
								<input
									type="text"
									{value}
									oninput={(e) => onInput(e.currentTarget.value)}
									onblur={onBlur}
									placeholder="99.99"
								/>
							</div>
							<div class="hint">💡 自动保留2位小数</div>
						{/snippet}
					</FormField>

					<FormField name="website" label="网站（自动添加协议）">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="url"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="example.com"
							/>
							<div class="hint">
								💡 自动添加 <code>https://</code> 并转小写
							</div>
						{/snippet}
					</FormField>
				</div>

				<!-- 组合转换器 -->
				<div class="section">
					<h3>🔗 组合转换器</h3>

					<FormField name="bio" label="个人简介（去空格 + 限制长度）">
						{#snippet children({ value, onInput, onBlur })}
							<textarea
								value={value as string}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
								placeholder="介绍一下你自己..."
								rows="3"
							></textarea>
							<div class="hint">
								💡 组合 <code>trim</code> + 自定义长度限制（200字符）
								<span class="char-count">{(value as string).length} / 200</span>
							</div>
						{/snippet}
					</FormField>
				</div>

				<button type="submit" class="btn-submit" disabled={!form.isValid}> 提交表单 </button>
			</Form>
		</div>

		<!-- 右侧：文档 -->
		<div class="docs-section">
			<!-- 实时预览 -->
			<div class="preview-panel">
				<h3>👁️ 实时转换预览</h3>
				<div class="preview-item">
					<span class="label">用户名:</span>
					<code>{rawValues.username || '(空)'}</code>
				</div>
				<div class="preview-item">
					<span class="label">手机号:</span>
					<code>{rawValues.phone || '(空)'}</code>
				</div>
				<div class="preview-item">
					<span class="label">信用卡:</span>
					<code>{rawValues.creditCard || '(空)'}</code>
				</div>
				<div class="preview-item">
					<span class="label">价格:</span>
					<code>{rawValues.price ? `¥${rawValues.price}` : '(空)'}</code>
				</div>
				<div class="preview-item">
					<span class="label">网站:</span>
					<code class="url">{rawValues.website || '(空)'}</code>
				</div>
			</div>

			<!-- 代码示例 -->
			<div class="code-section">
				<h3>📖 实现代码</h3>

				<div class="code-block">
					<h4>1. 使用内置转换器</h4>
					<pre><code
							>{`const form = useFormState({
  fields: {
    email: {
      // 组合多个转换器
      transformer: Transformers.compose(
        Transformers.trim,
        Transformers.toLowerCase
      ),
      validator: Validators.email()
    },
    age: {
      // 字符串转数字
      transformer: Transformers.toNumber,
      validator: Validators.min(1)
    }
  }
});`}</code
						></pre>
				</div>

				<div class="code-block">
					<h4>2. 创建自定义转换器</h4>
					<pre><code
							>{`const phoneFormatter: ITransformer<string, string> = {
  transform: (value: string) => {
    const digits = value.replace(/\\D/g, '');
    if (digits.length <= 3) return digits;
    if (digits.length <= 7)
      return \`\${digits.slice(0,3)}-\${digits.slice(3)}\`;
    return \`\${digits.slice(0,3)}-\${digits.slice(3,7)}-\${digits.slice(7,11)}\`;
  }
};

// 使用
const form = useFormState({
  fields: {
    phone: {
      transformer: phoneFormatter
    }
  }
});`}</code
						></pre>
				</div>

				<div class="code-block">
					<h4>3. 组合转换器</h4>
					<pre><code
							>{`const form = useFormState({
  fields: {
    bio: {
      transformer: Transformers.compose(
        Transformers.trim,
        // 内联自定义转换器
        {
          transform: (value: string) => value.slice(0, 200)
        }
      )
    }
  }
});`}</code
						></pre>
				</div>
			</div>

			<!-- 内置转换器列表 -->
			<div class="transformers-list">
				<h3>📦 内置转换器</h3>
				<ul>
					<li>
						<code>Transformers.trim</code>
						<span class="desc">去除首尾空格</span>
					</li>
					<li>
						<code>Transformers.toUpperCase</code>
						<span class="desc">转大写</span>
					</li>
					<li>
						<code>Transformers.toLowerCase</code>
						<span class="desc">转小写</span>
					</li>
					<li>
						<code>Transformers.toNumber</code>
						<span class="desc">字符串转数字</span>
					</li>
					<li>
						<code>Transformers.compose(...)</code>
						<span class="desc">组合多个转换器</span>
					</li>
				</ul>
			</div>

			<!-- 使用场景 -->
			<div class="use-cases">
				<h3>🎯 常见使用场景</h3>
				<ul>
					<li><strong>格式化</strong>：电话号码、信用卡、日期、货币</li>
					<li><strong>规范化</strong>：邮箱、URL、用户名</li>
					<li><strong>清理</strong>：去空格、移除特殊字符</li>
					<li><strong>限制</strong>：字符长度、数值范围</li>
					<li><strong>类型转换</strong>：字符串→数字、日期解析</li>
				</ul>
			</div>

			<!-- 最佳实践 -->
			<div class="best-practices">
				<h3>💡 最佳实践</h3>
				<ul>
					<li>转换器应该是<strong>纯函数</strong>（无副作用）</li>
					<li>转换在<strong>setValue时立即执行</strong>，用户看到的是转换后的值</li>
					<li>转换器只处理格式，<strong>验证器负责校验</strong></li>
					<li>使用<code>compose</code>组合多个简单转换器</li>
					<li>转换器应该<strong>幂等</strong>（重复执行结果相同）</li>
				</ul>
			</div>
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
		grid-template-columns: 650px 1fr;
		gap: 2rem;
	}

	.form-section h2,
	.docs-section h3 {
		margin-top: 0;
	}

	.section {
		padding: 1.5rem;
		background: #f8f9fa;
		border-radius: 6px;
	}

	.section h3 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.1rem;
	}

	.hint {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		color: #666;
		padding: 0.5rem;
		background: white;
		border-left: 3px solid #2196f3;
		border-radius: 2px;
	}

	.hint code {
		background: #e8f5e9;
		padding: 0.2rem 0.4rem;
		border-radius: 2px;
		font-family: 'Fira Code', monospace;
		font-size: 0.85rem;
	}

	.char-count {
		float: right;
		color: #999;
	}

	.input-with-prefix {
		position: relative;
		display: flex;
		align-items: center;
	}

	.prefix {
		position: absolute;
		left: 12px;
		color: #999;
		font-weight: 500;
	}

	.input-with-prefix input {
		padding-left: 2rem;
	}

	.btn-submit {
		padding: 0.75rem 2rem;
		background: #2196f3;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 1rem;
		cursor: pointer;
		transition: background 0.2s;
	}

	.btn-submit:hover:not(:disabled) {
		background: #1976d2;
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

	.preview-panel,
	.code-section,
	.transformers-list,
	.use-cases,
	.best-practices {
		background: white;
		padding: 1.5rem;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.preview-panel h3,
	.code-section h3,
	.transformers-list h3,
	.use-cases h3,
	.best-practices h3 {
		margin-top: 0;
		margin-bottom: 1rem;
	}

	.preview-item {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.75rem;
		background: #f8f9fa;
		border-radius: 4px;
		margin-bottom: 0.5rem;
	}

	.preview-item .label {
		min-width: 80px;
		color: #666;
		font-size: 0.9rem;
	}

	.preview-item code {
		flex: 1;
		padding: 0.5rem;
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 3px;
		font-family: 'Fira Code', monospace;
		font-size: 0.85rem;
		color: #2196f3;
	}

	.preview-item code.url {
		word-break: break-all;
	}

	.code-block {
		margin-bottom: 1.5rem;
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

	.transformers-list ul,
	.use-cases ul,
	.best-practices ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.transformers-list li {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.75rem;
		padding: 0.5rem;
		background: #f8f9fa;
		border-radius: 4px;
	}

	.transformers-list li code {
		min-width: 200px;
		background: white;
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
		font-family: 'Fira Code', monospace;
		font-size: 0.85rem;
		color: #2196f3;
	}

	.transformers-list li .desc {
		color: #666;
		font-size: 0.9rem;
	}

	.use-cases li,
	.best-practices li {
		margin-bottom: 0.5rem;
		line-height: 1.6;
	}

	@media (max-width: 80rem) {
		.content {
			grid-template-columns: 1fr;
		}
	}
</style>

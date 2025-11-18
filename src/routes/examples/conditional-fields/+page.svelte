<script lang="ts">
	/**
	 * 条件字段示例 - 配置驱动
	 * 演示：完全通过 Schema 配置实现条件显示，无需手动 if 判断
	 */
	import { useFormState, Form, Validators, type FormSchema } from '@packages/formstate/src';

	// 完全配置驱动的表单 Schema
	const orderFormSchema: FormSchema = {
		layout: 'vertical',
		fields: [
			// ========== 第1步：订单类型 ==========
			{
				name: 'orderType',
				type: 'radio',
				label: '订单类型',
				required: true,
				options: [
					{ label: '🛍️ 实体商品', value: 'physical' },
					{ label: '💎 虚拟商品', value: 'digital' },
					{ label: '🎁 礼品卡', value: 'gift' }
				],
				defaultValue: 'physical'
			},

			// ========== 实体商品专属字段 ==========
			{
				name: 'deliveryMethod',
				type: 'select',
				label: '配送方式',
				options: [
					{ label: '标准配送（3-5天）', value: 'standard' },
					{ label: '加急配送（1-2天）', value: 'express' },
					{ label: '到店自提', value: 'pickup' }
				],
				defaultValue: 'standard',
				// 配置式条件显示：只有订单类型为实体商品时才显示
				showWhen: {
					field: 'orderType',
					is: 'physical'
				}
			},

			{
				name: 'shippingAddress',
				type: 'textarea',
				label: '配送地址',
				placeholder: '请输入详细地址...',
				validator: Validators.compose(
					Validators.required('请输入配送地址'),
					Validators.minLength(10, '地址至少需要 10 个字符')
				),
				validateOnComplete: true,
				// 多条件：实体商品 且 不是自提
				condition: (values: Record<string, unknown>) => {
					return values.orderType === 'physical' && values.deliveryMethod !== 'pickup';
				}
			},

			{
				name: 'pickupStore',
				type: 'select',
				label: '自提门店',
				options: [
					{ label: '北京朝阳店', value: 'bj_cy' },
					{ label: '上海浦东店', value: 'sh_pd' },
					{ label: '深圳南山店', value: 'sz_ns' }
				],
				// 配置式：选择了自提方式时显示
				showWhen: {
					field: 'deliveryMethod',
					is: 'pickup'
				}
			},

			// ========== 虚拟商品专属字段 ==========
			{
				name: 'emailForDigital',
				type: 'email',
				label: '接收邮箱',
				placeholder: 'your@email.com',
				description: '虚拟商品将发送到此邮箱',
				validator: Validators.compose(
					Validators.required('请输入邮箱'),
					Validators.email('请输入有效的邮箱地址')
				),
				validateOnComplete: true,
				completeCondition: (v: string) => v.includes('@'),
				// 配置式：虚拟商品时显示
				showWhen: {
					field: 'orderType',
					is: 'digital'
				}
			},

			{
				name: 'phoneForVerification',
				type: 'text',
				label: '验证手机号',
				placeholder: '用于接收验证码',
				validator: Validators.pattern(/^\d{11}$/, '请输入11位手机号'),
				validateOnComplete: true,
				completeCondition: (v: string) => v.length === 11,
				// 配置式：虚拟商品且邮箱验证通过时显示
				showWhen: {
					field: 'emailForDigital',
					isValid: true
				}
			},

			// ========== 礼品卡专属字段 ==========
			{
				name: 'recipientName',
				type: 'text',
				label: '收礼人姓名',
				placeholder: '请输入收礼人姓名',
				validator: Validators.required('请输入收礼人姓名'),
				validateOnComplete: true,
				showWhen: {
					field: 'orderType',
					is: 'gift'
				}
			},

			{
				name: 'recipientEmail',
				type: 'email',
				label: '收礼人邮箱',
				placeholder: 'recipient@email.com',
				validator: Validators.compose(Validators.required(), Validators.email()),
				validateOnComplete: true,
				showWhen: {
					field: 'orderType',
					is: 'gift'
				}
			},

			{
				name: 'giftMessage',
				type: 'textarea',
				label: '赠言',
				placeholder: '写下您的祝福...',
				validator: Validators.maxLength(200, '赠言不能超过 200 个字符'),
				showWhen: {
					field: 'orderType',
					is: 'gift'
				}
			},

			// ========== 通用字段 ==========
			{
				name: 'hasPromoCode',
				type: 'checkbox',
				label: '我有优惠码',
				defaultValue: false
			},

			{
				name: 'promoCode',
				type: 'text',
				label: '优惠码',
				placeholder: '请输入优惠码',
				validator: Validators.compose(
					Validators.required('请输入优惠码'),
					Validators.pattern(/^[A-Z0-9]{6,10}$/, '优惠码格式不正确')
				),
				validateOnComplete: true,
				// 配置式：勾选了"我有优惠码"时显示
				showWhen: {
					field: 'hasPromoCode',
					is: true
				}
			},

			// ========== 发票信息 ==========
			{
				name: 'invoiceType',
				type: 'radio',
				label: '发票类型',
				options: [
					{ label: '不开发票', value: 'none' },
					{ label: '个人发票', value: 'personal' },
					{ label: '企业发票', value: 'company' }
				],
				defaultValue: 'none'
			},

			{
				name: 'invoiceTitle',
				type: 'text',
				label: '发票抬头',
				validator: Validators.required('请输入发票抬头'),
				validateOnComplete: true,
				// 配置式：开具发票时显示（个人或企业）
				showWhen: {
					field: 'invoiceType',
					isNot: 'none'
				}
			},

			{
				name: 'companyTaxId',
				type: 'text',
				label: '企业税号',
				placeholder: '统一社会信用代码',
				validator: Validators.compose(
					Validators.required('请输入企业税号'),
					Validators.pattern(/^[A-Z0-9]{15,20}$/, '税号格式不正确')
				),
				validateOnComplete: true,
				// 配置式：企业发票时显示
				showWhen: {
					field: 'invoiceType',
					is: 'company'
				}
			}
		]
	};

	const form = useFormState();

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('提交订单:', values);

		// 根据订单类型显示不同消息
		let message = '订单提交成功！\n\n';
		switch (values.orderType) {
			case 'physical':
				message += `配送方式: ${values.deliveryMethod === 'pickup' ? '到店自提' : '快递配送'}`;
				break;
			case 'digital':
				message += `虚拟商品将发送至: ${values.emailForDigital}`;
				break;
			case 'gift':
				message += `礼品卡将发送给: ${values.recipientName}`;
				break;
		}

		alert(message);
	}

	// 当前订单类型（用于显示提示）
	const currentOrderType = $derived(form.getValue('orderType'));
</script>

<svelte:head>
	<title>条件字段示例 | FormState</title>
</svelte:head>

<div class="example-page">
	<div class="documentation">
		<h1>条件字段</h1>
		<p class="lead">完全通过配置实现复杂的条件显示逻辑，无需手动编写 if 判断。</p>

		<section class="doc-section">
			<h2>功能特性</h2>
			<ul>
				<li>✅ 配置驱动的条件显示</li>
				<li>✅ 支持多种条件类型</li>
				<li>✅ 级联条件字段</li>
				<li>✅ 自动状态管理</li>
				<li>✅ 无需手动 if 判断</li>
			</ul>
		</section>

		<section class="doc-section">
			<h2>配置方式</h2>
			<pre><code
					>{`// 方式1：简单值匹配
{
  name: 'creditCard',
  showWhen: {
    field: 'paymentMethod',
    is: 'credit'
  }
}

// 方式2：值不等于
{
  name: 'otherReason',
  showWhen: {
    field: 'reason',
    isNot: 'none'
  }
}

// 方式3：验证状态
{
  name: 'nextStep',
  showWhen: {
    field: 'email',
    isValid: true,    // 邮箱验证通过
    isTouched: true   // 且已经触摸过
  }
}

// 方式4：自定义匹配
{
  name: 'discount',
  showWhen: {
    field: 'total',
    matches: (value) => value > 100
  }
}

// 方式5：复杂条件（使用 condition 函数）
{
  name: 'special',
  condition: (values) => {
    return values.type === 'A' &&
           values.level > 5 &&
           !values.disabled;
  }
}`}</code
				></pre>
		</section>

		<section class="doc-section">
			<h2>优势对比</h2>
			<div class="comparison">
				<div class="comparison-item bad">
					<h4>❌ 传统方式（大量 if 判断）</h4>
					<pre><code
							>{`{#if orderType === 'physical'}
  <Field name="address" />
  {#if deliveryMethod !== 'pickup'}
    <Field name="shippingAddress" />
  {/if}
{:else if orderType === 'digital'}
  <Field name="email" />
  {#if emailValid}
    <Field name="phone" />
  {/if}
{/if}`}</code
						></pre>
				</div>

				<div class="comparison-item good">
					<h4>✅ FormState 方式（纯配置）</h4>
					<pre><code
							>{`<Form schema={formSchema} />

// Schema 中配置
{
  name: 'shippingAddress',
  showWhen: {
    field: 'deliveryMethod',
    isNot: 'pickup'
  }
}`}</code
						></pre>
				</div>
			</div>
		</section>
	</div>

	<div class="demo-container">
		<h2>交互演示</h2>

		<div class="info-banner">
			<p>
				当前订单类型: <strong
					>{currentOrderType === 'physical'
						? '🛍️ 实体商品'
						: currentOrderType === 'digital'
							? '💎 虚拟商品'
							: '🎁 礼品卡'}</strong
				>
			</p>
			<p class="hint">尝试切换订单类型，观察字段如何根据配置自动显示/隐藏</p>
		</div>

		<div class="form-card">
			<Form formState={form} schema={orderFormSchema} onSubmit={handleSubmit} />

			<div class="form-actions">
				<button type="submit" class="btn-primary" disabled={!form.isValid}>
					{form.isValidating ? '验证中...' : '提交订单'}
				</button>
				<button type="button" class="btn-secondary" onclick={() => form.reset()}>重置</button>
			</div>
		</div>

		<div class="state-viewer">
			<h3>当前表单值</h3>
			<details open>
				<summary>查看数据</summary>
				<pre class="state-data">{JSON.stringify(form.values, null, 2)}</pre>
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
		background-clip: text;
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

	.comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.comparison-item {
		padding: 1rem;
		border-radius: 0.5rem;
	}

	.comparison-item.bad {
		background: #fef2f2;
		border: 2px solid #fecaca;
	}

	.comparison-item.good {
		background: #f0fdf4;
		border: 2px solid #bbf7d0;
	}

	.comparison-item h4 {
		margin-bottom: 0.5rem;
		font-size: 0.875rem;
	}

	.comparison-item pre {
		margin: 0;
		font-size: 0.75rem;
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

	.info-banner {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 1.5rem;
		border-radius: 1rem;
		text-align: center;
	}

	.info-banner strong {
		font-size: 1.25rem;
	}

	.hint {
		margin-top: 0.5rem;
		opacity: 0.9;
		font-size: 0.875rem;
	}

	.form-card,
	.state-viewer {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
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
		max-height: 400px;
		overflow-y: auto;
	}

	@media (max-width: 1024px) {
		.example-page {
			grid-template-columns: 1fr;
		}

		.documentation {
			position: static;
		}

		.comparison {
			grid-template-columns: 1fr;
		}
	}
</style>

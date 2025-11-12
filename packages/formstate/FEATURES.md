# FormState 核心特性详解

## 1. 局部验证（Partial Validation）

验证表单中的特定字段，而不是整个表单。

### API

```typescript
// 验证单个字段
await form.validateField('email');

// 验证多个字段（新增）
await form.validateFields(['email', 'password', 'confirmPassword']);

// 验证整个表单
await form.validateForm();
```

### 使用场景

```typescript
// 场景1：分步表单 - 只验证当前步骤的字段
const step1Fields = ['name', 'email'];
const step2Fields = ['password', 'confirmPassword'];

async function validateCurrentStep(step: number) {
	const fields = step === 1 ? step1Fields : step2Fields;
	const errors = await form.validateFields(fields);
	return Object.keys(errors).length === 0;
}

// 场景2：动态字段组 - 只验证某个区块
async function validateAddressSection() {
	const addressFields = ['address.street', 'address.city', 'address.zip'];
	return await form.validateFields(addressFields);
}
```

## 2. 输入完成自动验证（Validate on Complete）

智能检测用户输入完成，自动触发验证。

### 配置

```typescript
const form = useFormState({
	fields: {
		email: {
			validator: Validators.email(),
			// 启用输入完成验证
			validateOnComplete: true,
			// 自定义防抖延迟（默认 300ms）
			debounceMs: 500,
			// 自定义完成条件
			completeCondition: (value) => {
				// 邮箱格式基本正确时才验证
				return value.includes('@') && value.includes('.');
			}
		},
		phoneNumber: {
			validator: Validators.pattern(/^\d{11}$/, '请输入11位手机号'),
			validateOnComplete: true,
			completeCondition: (value: string) => {
				// 输入满11位数字后验证
				return value.length === 11;
			},
			debounceMs: 200
		}
	}
});
```

### 默认完成条件

FormState 提供智能的默认完成条件：

- **字符串**：长度 > 0 且已去除空格
- **数字**：不为 NaN
- **数组**：长度 > 0
- **对象**：不为 null

### 与其他验证模式的区别

```typescript
{
  // 1. 每次输入都验证（可能过于频繁）
  validateOnChange: true,

  // 2. 失去焦点时验证（用户已离开该字段）
  validateOnBlur: true,

  // 3. 输入完成时验证（推荐！）
  validateOnComplete: true,
  completeCondition: (value) => value.length >= 3
}
```

## 3. 条件字段（Conditional Fields）

根据其他字段的状态动态显示/隐藏字段。

### Schema 配置方式

```typescript
const schema: FormSchema = {
	fields: [
		{
			name: 'paymentMethod',
			type: 'select',
			label: '支付方式',
			options: [
				{ label: '信用卡', value: 'credit' },
				{ label: '支付宝', value: 'alipay' },
				{ label: '微信支付', value: 'wechat' }
			]
		},
		{
			name: 'creditCardNumber',
			type: 'text',
			label: '信用卡号',
			// 方式1：使用 showWhen 简洁配置
			showWhen: {
				field: 'paymentMethod',
				is: 'credit'
			}
		},
		{
			name: 'alipayAccount',
			type: 'text',
			label: '支付宝账号',
			showWhen: {
				field: 'paymentMethod',
				is: 'alipay',
				// 并且该字段验证通过
				isValid: true
			}
		},
		{
			name: 'hasPets',
			type: 'radio',
			label: '您是否养宠物？',
			options: [
				{ label: '是', value: true },
				{ label: '否', value: false }
			]
		},
		{
			name: 'petType',
			type: 'select',
			label: '宠物类型',
			options: [
				{ label: '狗', value: 'dog' },
				{ label: '猫', value: 'cat' },
				{ label: '其他', value: 'other' }
			],
			showWhen: {
				field: 'hasPets',
				is: true
			}
		},
		{
			name: 'petName',
			type: 'text',
			label: '宠物名字',
			// 方式2：使用 condition 函数（更灵活）
			condition: (values) => {
				return values.hasPets === true && values.petType !== undefined;
			}
		}
	]
};
```

### 手动组件方式

```svelte
<script>
	import { Form, Field } from '@packages/formstate/src';

	const form = useFormState();

	// 派生条件
	const showCreditCard = $derived(form.getValue('paymentMethod') === 'credit');
	const creditCardValid = $derived(!form.getFieldState('creditCardNumber').error);
	const showCVV = $derived(showCreditCard && creditCardValid);
</script>

<Form {form}>
	<Field name="paymentMethod">
		{#snippet children({ value, setValue })}
			<select {value} onchange={(e) => setValue(e.target.value)}>
				<option value="credit">信用卡</option>
				<option value="alipay">支付宝</option>
			</select>
		{/snippet}
	</Field>

	{#if showCreditCard}
		<Field name="creditCardNumber">
			{#snippet children({ value, error, setValue, setTouched })}
				<input
					type="text"
					{value}
					oninput={(e) => setValue(e.target.value)}
					onblur={() => setTouched()}
				/>
				{#if error}<span class="error">{error}</span>{/if}
			{/snippet}
		</Field>
	{/if}

	{#if showCVV}
		<Field name="cvv">
			<!-- CVV 字段 -->
		</Field>
	{/if}
</Form>
```

### 复杂条件示例

```typescript
// 级联选择：国家 → 省份 → 城市
const locationSchema: FormSchema = {
  fields: [
    {
      name: 'country',
      type: 'select',
      label: '国家',
      options: [...]
    },
    {
      name: 'province',
      type: 'select',
      label: '省份',
      showWhen: {
        field: 'country',
        matches: (value) => value !== null && value !== ''
      },
      // 动态选项（根据国家）
      options: $derived(getProvincesForCountry(form.getValue('country')))
    },
    {
      name: 'city',
      type: 'select',
      label: '城市',
      condition: (values) => {
        return values.country && values.province;
      }
    }
  ]
};
```

## 4. 字段依赖与级联验证

一个字段的验证依赖于另一个字段的值。

```typescript
const form = useFormState({
	fields: {
		password: {
			validator: Validators.minLength(8)
		},
		confirmPassword: {
			validator: createValidator((value, allValues) => {
				if (value !== allValues.password) {
					return '两次密码不一致';
				}
				return null;
			}),
			// 当 password 改变时，自动重新验证 confirmPassword
			dependencies: ['password']
		},
		// 高级用例：折扣码
		discountCode: {
			validator: createCustomValidator(async (code, allValues) => {
				// 只有当总金额超过100时才验证折扣码
				if (allValues.total < 100) return true;
				return await validateDiscountCode(code);
			}, '折扣码无效'),
			dependencies: ['total']
		}
	}
});
```

## 5. 完整使用示例

### 在线订单表单

```svelte
<script lang="ts">
	import { useFormState, Form, Field, Validators } from '@packages/formstate/src';

	const form = useFormState({
		fields: {
			// 基础信息
			email: {
				validator: Validators.compose(Validators.required(), Validators.email()),
				validateOnComplete: true,
				completeCondition: (v) => v.includes('@')
			},

			// 配送方式
			deliveryMethod: {
				defaultValue: 'standard'
			},

			// 快递地址（仅标准配送显示）
			shippingAddress: {
				validator: Validators.required('请输入配送地址'),
				validateOnComplete: true
			},

			// 发票类型
			invoiceType: {
				defaultValue: 'personal'
			},

			// 公司名称（仅企业发票显示且需验证）
			companyName: {
				validator: Validators.required('请输入公司名称'),
				validateOnComplete: true
			}
		}
	});

	// 条件显示
	const showShippingAddress = $derived(form.getValue('deliveryMethod') === 'standard');

	const showCompanyName = $derived(form.getValue('invoiceType') === 'company');

	// 局部验证
	async function validateBasicInfo() {
		const errors = await form.validateFields(['email', 'phone']);
		return Object.keys(errors).length === 0;
	}

	async function validateShipping() {
		if (!showShippingAddress) return true;
		const errors = await form.validateFields(['shippingAddress', 'city', 'zipCode']);
		return Object.keys(errors).length === 0;
	}

	async function handleSubmit() {
		// 分步验证
		if (!(await validateBasicInfo())) {
			alert('请检查基础信息');
			return;
		}

		if (!(await validateShipping())) {
			alert('请检查配送信息');
			return;
		}

		// 最终提交
		await form.submit((values) => {
			console.log('提交订单:', values);
		});
	}
</script>

<Form {form}>
	<Field name="email" config={{ validateOnComplete: true }}>
		<!-- 输入完成后自动验证 -->
	</Field>

	<Field name="deliveryMethod">
		<!-- 配送方式选择 -->
	</Field>

	{#if showShippingAddress}
		<Field name="shippingAddress">
			<!-- 条件显示的地址字段 -->
		</Field>
	{/if}

	{#if showCompanyName}
		<Field name="companyName">
			<!-- 条件显示的公司名称 -->
		</Field>
	{/if}

	<button onclick={handleSubmit}>提交订单</button>
</Form>
```

## 总结

FormState 提供了强大且灵活的表单管理能力：

- ✅ **局部验证** - 只验证需要的字段
- ✅ **智能验证** - 输入完成时自动触发
- ✅ **条件字段** - 根据其他字段动态显示
- ✅ **字段依赖** - 级联验证和更新
- ✅ **防抖优化** - 避免过度验证
- ✅ **完全类型安全** - TypeScript 全面支持

所有这些特性都可以组合使用，打造出色的用户体验！

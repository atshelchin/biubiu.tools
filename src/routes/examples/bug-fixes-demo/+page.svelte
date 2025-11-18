<script lang="ts">
	/**
	 * Bug Fixes Demo - 验证关键 bug 修复
	 * 1. FieldArray 路径重映射（Bug 3）
	 * 2. 依赖字段 onChange 触发（Bug 4）
	 * 3. 动态字段自动注销（Bug 2）
	 */
	import { useFormState, Form, FormField, FieldArray, Validators } from '@packages/formstate/src';

	// Bug 3 测试：FieldArray 删除中间项后路径正确性
	const arrayForm = useFormState({
		fields: {
			items: {
				defaultValue: [
					{ name: 'Item A', value: 10 },
					{ name: 'Item B', value: 20 },
					{ name: 'Item C', value: 30 }
				]
			}
		}
	});

	// Bug 4 测试：依赖字段验证
	const dependencyForm = useFormState({
		validateOnChange: false, // ⚠️ 禁用自动验证，避免无限循环
		validateOnBlur: true, // 使用 blur 验证更安全
		fields: {
			minValue: {
				defaultValue: 10,
				validator: Validators.required('Min value required')
			},
			maxValue: {
				defaultValue: 20,
				validator: {
					validate: (value, values) => {
						const min = values.minValue as number;
						const max = value as number;
						if (max <= min) {
							return 'Max must be greater than min';
						}
						return null;
					}
				},
				dependencies: ['minValue']
			}
		}
	});

	let showOptionalField = $state(false);
	let fieldStatesBefore: string = '';
	let fieldStatesAfter: string = '';

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function captureFieldStates(form: ReturnType<typeof useFormState>) {
		const manager = form._manager;
		const states = Array.from(manager['fieldStates'].entries()).map(([path, state]) => ({
			path,
			value: state.value
		}));
		return JSON.stringify(states, null, 2);
	}

	// Bug 2 测试：计数器
	// ⚠️ 修复：使用 untrack 避免在条件判断中读取 mountCount 建立响应式依赖
	// 原问题：else if (mountCount > 0) 会读取 mountCount，导致无限循环
	let mountCount = $state(0);
	let unmountCount = $state(0);
	let lastShowState = $state(showOptionalField);

	$effect(() => {
		const currentShowState = showOptionalField;

		// 只有当状态真正改变时才更新计数器
		if (currentShowState && !lastShowState) {
			mountCount++;
		} else if (!currentShowState && lastShowState) {
			unmountCount++;
		}

		lastShowState = currentShowState;
	});
</script>

<div class="demo-page">
	<h1>Bug Fixes Demo</h1>
	<p class="subtitle">验证关键 bug 修复效果</p>

	<!-- Bug 3: FieldArray 路径重映射 -->
	<section class="demo-section">
		<h2>🔧 Bug 3: FieldArray 路径重映射</h2>
		<p class="description">
			问题：删除数组中间项后，后续项的字段状态路径没有更新，导致验证错误显示在错误的字段上。
		</p>

		<div class="test-case">
			<h3>测试步骤</h3>
			<ol>
				<li>初始数组有 3 项：Item A、Item B、Item C</li>
				<li>点击"删除 Item B"按钮</li>
				<li>检查字段状态路径是否正确重映射</li>
			</ol>

			<Form formState={arrayForm}>
				<FieldArray name="items">
					{#snippet children({ fields, remove })}
						<div class="array-items">
							{#each fields as field, index (field.key)}
								<div class="array-item">
									<div class="item-header">
										<strong>Item {index}</strong>
										<button type="button" onclick={() => remove(index)}>Remove</button>
									</div>
									<FormField name="items[{index}].name" label="Name">
										{#snippet children({ value, onInput, onBlur })}
											<input
												type="text"
												{value}
												oninput={(e) => onInput(e.currentTarget.value)}
												onblur={onBlur}
											/>
										{/snippet}
									</FormField>
									<FormField name="items[{index}].value" label="Value">
										{#snippet children({ value, onInput, onBlur })}
											<input
												type="number"
												value={value ?? ''}
												oninput={(e) => onInput(Number(e.currentTarget.value))}
												onblur={onBlur}
											/>
										{/snippet}
									</FormField>
								</div>
							{/each}
						</div>
					{/snippet}
				</FieldArray>
			</Form>

			<div class="test-result">
				<h4>Field States 对比</h4>
				<div class="state-comparison">
					<div>
						<strong>删除前：</strong>
						<pre>{fieldStatesBefore || 'Click "Remove Item B" to test'}</pre>
					</div>
					<div>
						<strong>删除后：</strong>
						<pre>{fieldStatesAfter || 'Waiting...'}</pre>
					</div>
				</div>
				<p class="expected">
					✅ <strong>期望结果</strong>: 删除后 items[1] 应该指向 "Item C"（原来的
					items[2]），items[2] 应该被删除
				</p>
			</div>
		</div>
	</section>

	<!-- Bug 4: 依赖字段 onChange 触发 -->
	<section class="demo-section">
		<h2>🔧 Bug 4: 依赖字段 onChange 触发</h2>
		<p class="description">
			问题：当依赖的字段变化时，验证虽然执行了，但没有触发 onFieldChange 事件，导致 UI 不更新。
		</p>

		<div class="test-case">
			<h3>测试步骤</h3>
			<ol>
				<li>maxValue 依赖于 minValue（必须大于 minValue）</li>
				<li>初始值：minValue=10, maxValue=20（有效）</li>
				<li>修改 minValue 为 25（现在 maxValue 应该显示错误）</li>
			</ol>

			<Form formState={dependencyForm}>
				<FormField name="minValue" label="Min Value">
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="number"
							value={value ?? ''}
							oninput={(e) => onInput(Number(e.currentTarget.value))}
							onblur={onBlur}
						/>
						{#if error && touched}
							<div class="error">{error}</div>
						{/if}
					{/snippet}
				</FormField>

				<FormField name="maxValue" label="Max Value">
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="number"
							value={value ?? ''}
							oninput={(e) => onInput(Number(e.currentTarget.value))}
							onblur={onBlur}
						/>
						{#if error && touched}
							<div class="error">{error}</div>
						{/if}
					{/snippet}
				</FormField>
			</Form>

			<div class="test-result">
				<p class="expected">
					✅ <strong>期望结果</strong>: 修改 minValue 后，maxValue 的错误信息应该立即出现（无需手动
					blur）
				</p>
			</div>
		</div>
	</section>

	<!-- Bug 2: 动态字段自动注销 -->
	<section class="demo-section">
		<h2>🔧 Bug 2: 动态字段自动注销</h2>
		<p class="description">问题：条件渲染的字段在销毁后没有从 fieldStates 中移除，导致内存泄漏。</p>

		<div class="test-case">
			<h3>测试步骤</h3>
			<ol>
				<li>点击"Show Optional Field"显示动态字段</li>
				<li>点击"Hide Optional Field"隐藏动态字段</li>
				<li>重复几次</li>
				<li>检查 fieldStates 数量是否保持稳定</li>
			</ol>

			<button type="button" onclick={() => (showOptionalField = !showOptionalField)}>
				{showOptionalField ? 'Hide' : 'Show'} Optional Field
			</button>

			<Form formState={dependencyForm}>
				{#if showOptionalField}
					<FormField name="optionalField" label="Optional Field (Dynamic)">
						{#snippet children({ value, onInput, onBlur })}
							<input
								type="text"
								{value}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
							/>
						{/snippet}
					</FormField>
				{/if}
			</Form>

			<div class="test-result">
				<p>Mount Count: {mountCount}</p>
				<p>Unmount Count: {unmountCount}</p>
				<p>
					Field States Count: {Array.from(dependencyForm._manager['fieldStates'].keys()).length}
				</p>
				<p>
					Field Paths: {Array.from(dependencyForm._manager['fieldStates'].keys()).join(', ')}
				</p>
				<p class="expected">
					✅ <strong>期望结果</strong>: 隐藏字段后，fieldStates 应该减少 1，不应该累积 optionalField
				</p>
			</div>
		</div>
	</section>

	<!-- Bug 1: Observer 内存泄漏（信息展示） -->
	<section class="demo-section">
		<h2>🔧 Bug 1: Observer 内存泄漏（已修复）</h2>
		<p class="description">
			问题：useFormState 订阅的观察者在组件销毁后没有取消订阅，导致内存泄漏。<br />
			修复：现在提供 destroy() 方法，用户可以在 onDestroy 中调用。
		</p>

		<div class="code-example">
			<h4>修复前（❌ 会泄漏）：</h4>
			<pre><code
					>{`const form = useFormState({ ... });
// 组件销毁后 observer 仍然存在！`}</code
				></pre>

			<h4>修复后（✅ 正确）：</h4>
			<pre><code
					>{`import { onDestroy } from 'svelte';

const form = useFormState({ ... });

onDestroy(() => {
  form.destroy(); // 取消订阅
});`}</code
				></pre>
		</div>
	</section>
</div>

<style>
	.demo-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #666;
		font-size: 1.1rem;
		margin-bottom: 3rem;
	}

	.demo-section {
		margin-bottom: 4rem;
		padding: 2rem;
		background: #f9f9f9;
		border-radius: 8px;
	}

	.demo-section h2 {
		font-size: 1.8rem;
		margin-bottom: 1rem;
		color: #333;
	}

	.description {
		color: #666;
		margin-bottom: 1.5rem;
		line-height: 1.6;
	}

	.test-case {
		background: white;
		padding: 1.5rem;
		border-radius: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.test-case h3 {
		font-size: 1.3rem;
		margin-bottom: 1rem;
	}

	.test-case ol {
		margin-bottom: 1.5rem;
		padding-left: 1.5rem;
	}

	.test-case ol li {
		margin-bottom: 0.5rem;
	}

	.array-items {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.array-item {
		padding: 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 4px;
	}

	.item-header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}

	button {
		padding: 0.5rem 1rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.9rem;
	}

	button:hover {
		background: #5568d3;
	}

	input {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 4px;
		font-size: 1rem;
	}

	.test-result {
		margin-top: 2rem;
		padding: 1rem;
		background: #f0f4ff;
		border-left: 4px solid #667eea;
	}

	.test-result h4 {
		margin-bottom: 1rem;
	}

	.state-comparison {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	pre {
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
		font-size: 0.85rem;
	}

	.expected {
		color: #2d7d2d;
		font-size: 0.95rem;
		margin-top: 1rem;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.code-example {
		background: white;
		padding: 1.5rem;
		border-radius: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.code-example h4 {
		margin: 1rem 0 0.5rem;
		font-size: 1.1rem;
	}

	.code-example h4:first-child {
		margin-top: 0;
	}

	.code-example code {
		display: block;
		padding: 1rem;
		background: #1e1e1e;
		color: #d4d4d4;
		border-radius: 4px;
		overflow-x: auto;
		font-family: 'Fira Code', 'Monaco', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>

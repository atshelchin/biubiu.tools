<script lang="ts">
	/**
	 * 递归的 ABI 参数字段组件
	 * 支持任意深度的嵌套结构：
	 * - 基础类型 (address, uint256, string, bool 等)
	 * - 数组类型 (address[], uint256[] 等)
	 * - 结构体 (tuple)
	 * - 嵌套结构 (tuple[], tuple 中有 array, array 中有 tuple)
	 */
	import { FormField, FieldArray, type FormState } from '@packages/formstate/src';

	interface AbiParameter {
		name: string;
		type: string;
		components?: AbiParameter[];
		description?: string;
	}

	interface Props {
		param: AbiParameter;
		path: string;
		formState: FormState;
		depth?: number;
	}

	let { param, path, formState, depth = 0 }: Props = $props();

	// 解析类型
	function parseType(type: string) {
		const isArray = type.endsWith('[]');
		const baseType = isArray ? type.slice(0, -2) : type;
		const isTuple = baseType === 'tuple';

		return { isArray, baseType, isTuple };
	}

	const { isArray, baseType, isTuple } = parseType(param.type);

	// 获取类型的默认值
	function getDefaultValue(type: string): unknown {
		if (type.startsWith('uint') || type.startsWith('int')) return '';
		if (type === 'address') return '';
		if (type === 'string') return '';
		if (type === 'bool') return false;
		if (type === 'bytes' || type.startsWith('bytes')) return '';
		if (type === 'tuple') return {};
		return '';
	}

	// 获取输入框类型
	function getInputType(type: string): string {
		if (type.startsWith('uint') || type.startsWith('int')) return 'text';
		if (type === 'address') return 'text';
		if (type === 'bool') return 'checkbox';
		return 'text';
	}

	// 获取占位符
	function getPlaceholder(type: string): string {
		if (type === 'address') return '0x...';
		if (type.startsWith('uint')) return '0';
		if (type === 'string') return '输入文本';
		if (type.startsWith('bytes')) return '0x...';
		return '';
	}

	// 为tuple创建默认值（基于components定义）
	function createTupleDefault(): Record<string, unknown> {
		if (!param.components) return {};

		const obj: Record<string, unknown> = {};
		for (const component of param.components) {
			if (component.type.endsWith('[]')) {
				// 嵌套数组，需要包含一个默认元素
				const elementType = component.type.slice(0, -2); // 移除 []
				if (component.components) {
					// tuple[] - 包含一个默认tuple
					obj[component.name] = [createDefaultFromComponents(component.components)];
				} else {
					// 基础类型[] - 包含一个默认值
					obj[component.name] = [getDefaultValue(elementType)];
				}
			} else if (component.components) {
				// 嵌套tuple，递归创建
				obj[component.name] = createDefaultFromComponents(component.components);
			} else {
				// 基础类型，使用默认值
				obj[component.name] = getDefaultValue(component.type);
			}
		}
		return obj;
	}

	// 通用函数：从 components 创建默认对象
	function createDefaultFromComponents(components: any[]): Record<string, unknown> {
		const obj: Record<string, unknown> = {};
		for (const comp of components) {
			if (comp.type.endsWith('[]')) {
				// 数组类型 - 包含一个默认元素
				const elementType = comp.type.slice(0, -2);
				if (comp.components) {
					// tuple[] - 递归创建
					obj[comp.name] = [createDefaultFromComponents(comp.components)];
				} else {
					// 基础类型[] - 默认值
					obj[comp.name] = [getDefaultValue(elementType)];
				}
			} else if (comp.components) {
				// tuple - 递归创建
				obj[comp.name] = createDefaultFromComponents(comp.components);
			} else {
				// 基础类型
				obj[comp.name] = getDefaultValue(comp.type);
			}
		}
		return obj;
	}

	// 获取缩进样式
	const indentClass = depth > 0 ? 'nested-field' : '';
</script>

{#if isArray}
	<!-- 数组类型 -->
	<div class="param-group {indentClass}">
		<div class="param-header">
			<h3>{param.name}</h3>
			<span class="param-type">{param.type}</span>
		</div>
		{#if param.description}
			<p class="param-desc">{param.description}</p>
		{/if}

		<FieldArray name={path} {formState}>
			{#snippet children({ fields, append, remove })}
				<div class="array-items">
					{#each fields as field, index (field.key)}
						<div class="array-item">
							<span class="item-index">[{index}]</span>

							{#if isTuple && param.components}
								<!-- 数组中的结构体 -->
								<div class="tuple-container">
									{#each param.components as component}
										<svelte:self
											param={component}
											path={`${path}[${index}].${component.name}`}
											{formState}
											depth={depth + 1}
										/>
									{/each}
								</div>
							{:else}
								<!-- 数组中的基础类型 -->
								<FormField name={`${path}[${index}]`} {formState}>
									{#snippet children({ value, error, touched, onInput, onBlur })}
										<div class="input-wrapper">
											{#if baseType === 'bool'}
												<label class="checkbox-label">
													<input
														type="checkbox"
														checked={value}
														onchange={(e) => onInput(e.currentTarget.checked)}
														onblur={onBlur}
													/>
													<span>启用</span>
												</label>
											{:else}
												<input
													type={getInputType(baseType)}
													{value}
													class:error={touched && error}
													placeholder={getPlaceholder(baseType)}
													oninput={(e) => onInput(e.currentTarget.value)}
													onblur={onBlur}
												/>
											{/if}
											{#if touched && error}
												<span class="error-msg">{error}</span>
											{/if}
										</div>
									{/snippet}
								</FormField>
							{/if}

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
				<button
					type="button"
					class="btn-add"
					onclick={() => append(isTuple ? createTupleDefault() : getDefaultValue(baseType))}
				>
					+ 添加 {param.name}
				</button>
			{/snippet}
		</FieldArray>
	</div>
{:else if isTuple && param.components}
	<!-- 结构体类型 -->
	<div class="param-group {indentClass}">
		<div class="param-header">
			<h3>{param.name}</h3>
			<span class="param-type">tuple</span>
		</div>
		{#if param.description}
			<p class="param-desc">{param.description}</p>
		{/if}

		<div class="tuple-fields">
			{#each param.components as component}
				<svelte:self
					param={component}
					path={`${path}.${component.name}`}
					{formState}
					depth={depth + 1}
				/>
			{/each}
		</div>
	</div>
{:else}
	<!-- 基础类型 -->
	<div class="field-group {indentClass}">
		<label class="field-label">
			<span class="label-text">
				{param.name}
				<span class="type-badge">{param.type}</span>
			</span>
			{#if param.description}
				<span class="field-desc">{param.description}</span>
			{/if}
		</label>

		<FormField name={path} {formState}>
			{#snippet children({ value, error, touched, onInput, onBlur })}
				<div class="input-wrapper">
					{#if baseType === 'bool'}
						<label class="checkbox-label">
							<input
								type="checkbox"
								checked={value}
								onchange={(e) => onInput(e.currentTarget.checked)}
								onblur={onBlur}
							/>
							<span>启用</span>
						</label>
					{:else}
						<input
							type={getInputType(baseType)}
							{value}
							class:error={touched && error}
							placeholder={getPlaceholder(baseType)}
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
						/>
					{/if}
					{#if touched && error}
						<span class="error-msg">{error}</span>
					{/if}
				</div>
			{/snippet}
		</FormField>
	</div>
{/if}

<style>
	.param-group {
		background: #ffffff;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.nested-field {
		background: #f9fafb;
		border-left: 3px solid #667eea;
		margin-left: 1rem;
		margin-bottom: 1rem;
	}

	.param-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}

	.param-header h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #111827;
		margin: 0;
	}

	.param-type {
		font-family: 'Fira Code', monospace;
		font-size: 0.875rem;
		color: #667eea;
		background: #ede9fe;
		padding: 0.25rem 0.75rem;
		border-radius: 0.375rem;
	}

	.param-desc {
		color: #6b7280;
		font-size: 0.875rem;
		margin: 0.5rem 0 1rem 0;
	}

	.array-items {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.array-item {
		display: flex;
		gap: 0.75rem;
		align-items: flex-start;
		padding: 0.75rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		border: 1px solid #e5e7eb;
	}

	.item-index {
		font-family: 'Fira Code', monospace;
		font-size: 0.875rem;
		color: #667eea;
		font-weight: 600;
		min-width: 2rem;
		padding-top: 0.75rem;
	}

	.tuple-container {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.tuple-fields {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		border: 1px dashed #d1d5db;
	}

	.field-group {
		margin-bottom: 1rem;
	}

	.field-label {
		display: block;
		margin-bottom: 0.5rem;
	}

	.label-text {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 500;
		color: #374151;
	}

	.type-badge {
		font-family: 'Fira Code', monospace;
		font-size: 0.75rem;
		color: #6b7280;
		background: #f3f4f6;
		padding: 0.125rem 0.5rem;
		border-radius: 0.25rem;
	}

	.field-desc {
		display: block;
		font-size: 0.75rem;
		color: #9ca3af;
		font-weight: 400;
		margin-top: 0.25rem;
	}

	.input-wrapper {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	input[type='text'],
	input[type='number'] {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: all 0.2s;
	}

	input[type='text']:focus,
	input[type='number']:focus {
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
		user-select: none;
	}

	.checkbox-label input[type='checkbox'] {
		width: 1.25rem;
		height: 1.25rem;
		cursor: pointer;
	}

	.error-msg {
		color: #ef4444;
		font-size: 0.875rem;
	}

	.btn-add {
		padding: 0.75rem 1.5rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 0.5rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-add:hover {
		background: #5568d3;
		transform: translateY(-1px);
	}

	.btn-remove {
		width: 2.5rem;
		height: 2.5rem;
		background: #fee2e2;
		color: #dc2626;
		border: none;
		border-radius: 0.5rem;
		font-size: 1.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.btn-remove:hover:not(:disabled) {
		background: #fecaca;
	}

	.btn-remove:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}
</style>

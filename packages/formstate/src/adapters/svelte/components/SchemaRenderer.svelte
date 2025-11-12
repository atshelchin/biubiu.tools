<script lang="ts">
	/**
	 * SchemaRenderer - 递归渲染表单 Schema
	 * 用户可选：可以用 schema 驱动，也可以手动用 FormField
	 */
	import { getContext } from 'svelte';
	import type { FormState } from '../useFormState.svelte';
	import type { FormSchema, FieldSchema } from '../schema';
	import FormField from './FormField.svelte';
	import FieldArray from './FieldArray.svelte';

	interface Props {
		schema: FormSchema;
	}

	let { schema }: Props = $props();

	const formState = getContext<FormState>('formState');

	// 派生布局类名
	const layoutClass = $derived(`layout-${schema.layout || 'vertical'}`);

	// 检查条件渲染（增强版：支持 showWhen 配置）
	function shouldRenderField(field: FieldSchema): boolean {
		// 1. 检查是否明确隐藏
		if (field.hidden) return false;

		// 2. 检查 showWhen 配置（声明式条件）
		if (field.showWhen) {
			const { field: dependentField, is, isNot, isValid, isTouched, matches } = field.showWhen;
			const dependentValue = formState.getValue(dependentField);
			const dependentState = formState.getFieldState(dependentField);

			// 值匹配检查
			if (is !== undefined && dependentValue !== is) return false;
			if (isNot !== undefined && dependentValue === isNot) return false;

			// 状态检查
			if (isValid !== undefined) {
				const fieldIsValid = !dependentState.error;
				if (fieldIsValid !== isValid) return false;
			}
			if (isTouched !== undefined && dependentState.touched !== isTouched) return false;

			// 自定义匹配函数
			if (matches && !matches(dependentValue)) return false;
		}

		// 3. 检查自定义 condition 函数
		if (field.condition) {
			return field.condition(formState.values);
		}

		return true;
	}
</script>

<div class="schema-form {layoutClass}">
	{#each schema.fields as field (field.name)}
		{#if shouldRenderField(field)}
			{#if field.type === 'group' && field.fields}
				<!-- 递归渲染嵌套组 -->
				<div class="field-group">
					{#if field.label}
						<legend>{field.label}</legend>
					{/if}
					<svelte:self schema={{ fields: field.fields, layout: schema.layout }} />
				</div>
			{:else if field.type === 'array' && field.itemSchema}
				<!-- 动态数组字段 -->
				<FieldArray name={field.name}>
					{#snippet children({ fields, append, remove })}
						<div class="field-array">
							{#if field.label}
								<label>{field.label}</label>
							{/if}

							{#each fields as arrayField (arrayField.key)}
								<div class="array-item">
									<FormField name={arrayField.name} config={field.itemSchema}>
										{#snippet children({ value, onInput, onBlur })}
											<input
												type="text"
												{value}
												oninput={(e) => onInput(e.currentTarget.value)}
												onblur={onBlur}
											/>
										{/snippet}
									</FormField>
									<button type="button" onclick={() => remove(arrayField.index)}>Remove</button>
								</div>
							{/each}

							<button type="button" onclick={() => append(field.itemSchema?.defaultValue ?? '')}>
								Add Item
							</button>
						</div>
					{/snippet}
				</FieldArray>
			{:else if field.component}
				<!-- 自定义组件 -->
				<FormField name={field.name} label={field.label} config={field}>
					{#snippet children({ value, onInput, onBlur })}
						<svelte:component
							this={field.component}
							{value}
							{onInput}
							{onBlur}
							{...field.componentProps}
						/>
					{/snippet}
				</FormField>
			{:else}
				<!-- 标准输入字段 -->
				<FormField
					name={field.name}
					label={field.label}
					description={field.description}
					config={field}
				>
					{#snippet children({ value, onInput, onBlur })}
						{#if field.type === 'textarea'}
							<textarea
								value={String(value ?? '')}
								placeholder={field.placeholder}
								disabled={field.disabled}
								readonly={field.readOnly}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
							></textarea>
						{:else if field.type === 'select'}
							<select
								value={String(value ?? '')}
								disabled={field.disabled}
								onchange={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
							>
								{#if field.placeholder}
									<option value="">{field.placeholder}</option>
								{/if}
								{#each field.options || [] as option}
									<option value={option.value} disabled={option.disabled}>
										{option.label}
									</option>
								{/each}
							</select>
						{:else if field.type === 'checkbox'}
							<input
								type="checkbox"
								checked={Boolean(value)}
								disabled={field.disabled}
								onchange={(e) => onInput(e.currentTarget.checked)}
								onblur={onBlur}
							/>
						{:else if field.type === 'radio' && field.options}
							<div class="radio-group">
								{#each field.options as option}
									<label>
										<input
											type="radio"
											name={field.name}
											value={option.value}
											checked={value === option.value}
											disabled={field.disabled || option.disabled}
											onchange={() => onInput(option.value)}
											onblur={onBlur}
										/>
										{option.label}
									</label>
								{/each}
							</div>
						{:else}
							<!-- 默认文本输入 -->
							<input
								type={field.type === 'number'
									? 'number'
									: field.type === 'email'
										? 'email'
										: field.type === 'password'
											? 'password'
											: field.type === 'date'
												? 'date'
												: 'text'}
								{value}
								placeholder={field.placeholder}
								disabled={field.disabled}
								readonly={field.readOnly}
								oninput={(e) => onInput(e.currentTarget.value)}
								onblur={onBlur}
							/>
						{/if}
					{/snippet}
				</FormField>
			{/if}
		{/if}
	{/each}
</div>

<style>
	.schema-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.schema-form.layout-horizontal {
		flex-direction: row;
		flex-wrap: wrap;
	}

	.schema-form.layout-inline > :global(*) {
		display: inline-block;
		margin-right: 1rem;
	}

	.field-group {
		border: 1px solid var(--color-border, #e5e7eb);
		padding: 1rem;
		border-radius: 0.5rem;
	}

	.field-group legend {
		font-weight: 600;
		padding: 0 0.5rem;
	}

	.field-array {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.array-item {
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.array-item > :global(.form-field) {
		flex: 1;
	}

	.radio-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.radio-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	input,
	select,
	textarea {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--color-border, #d1d5db);
		border-radius: 0.375rem;
		font-size: 1rem;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--color-primary, #3b82f6);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	button {
		padding: 0.5rem 1rem;
		background: var(--color-primary, #3b82f6);
		color: white;
		border: none;
		border-radius: 0.375rem;
		cursor: pointer;
	}

	button:hover {
		background: var(--color-primary-hover, #2563eb);
	}

	button[type='button']:not(.primary) {
		background: var(--color-secondary, #6b7280);
	}
</style>

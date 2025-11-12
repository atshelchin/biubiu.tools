<script lang="ts">
	/**
	 * 动态数组示例
	 * 演示：FieldArray 组件、动态添加/删除、数组验证、拖拽排序
	 */
	import {
		useFormState,
		Form,
		FormField,
		FieldArray,
		Validators,
		type FormState
	} from '@packages/formstate/src';
	import { dragSortable } from '$lib/utils/drag-sortable';

	// 创建表单状态
	const form: FormState = useFormState({
		fields: {
			teamName: {
				defaultValue: '',
				validator: Validators.required('团队名称不能为空')
			},
			members: {
				defaultValue: [{ name: '', email: '', role: 'developer' }],
				validator: Validators.required('至少需要一个成员')
			}
		}
	});

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('表单提交:', values);
		alert(`团队创建成功！\n${JSON.stringify(values, null, 2)}`);
	}
</script>

<svelte:head>
	<title>动态数组示例 | FormState</title>
</svelte:head>

<div class="example-page">
	<div class="documentation">
		<h1>动态数组示例</h1>
		<p class="lead">使用 FieldArray 组件管理动态表单数组。</p>

		<section class="doc-section">
			<h2>功能特性</h2>
			<ul>
				<li>✅ 动态添加/删除数组项</li>
				<li>✅ 数组项验证</li>
				<li>✅ 数组排序（上移/下移）</li>
				<li>✅ 最小/最大数量限制</li>
			</ul>
		</section>

		<section class="doc-section">
			<h2>代码示例</h2>
			<pre><code
					>{`const form = useFormState({
  fields: {
    members: {
      defaultValue: [{ name: '', email: '', role: 'developer' }]
    }
  }
});

<FieldArray name="members" formState={form}>
  {#snippet children({ fields, append, remove, move })}
    {#each fields as field, index (field.key)}
      <button onclick={() => move(index, index - 1)}>上移</button>
      <button onclick={() => move(index, index + 1)}>下移</button>
      <button onclick={() => remove(index)}>删除</button>

      <FormField name={\`members[\${index}].name\`}>
        ...
      </FormField>
    {/each}
    <button onclick={() => append({ name: '', email: '', role: 'developer' })}>
      添加成员
    </button>
  {/snippet}
</FieldArray>`}</code
				></pre>
		</section>
	</div>

	<div class="demo-container">
		<h2>团队成员管理</h2>

		<div class="form-card">
			<Form formState={form} onSubmit={handleSubmit}>
				<FormField name="teamName" label="团队名称" formState={form}>
					{#snippet children({ value, error, touched, onInput, onBlur })}
						<input
							type="text"
							{value}
							class:error={touched && error}
							placeholder="输入团队名称"
							oninput={(e) => onInput(e.currentTarget.value)}
							onblur={onBlur}
						/>
						{#if touched && error}
							<span class="error-msg">{error}</span>
						{/if}
					{/snippet}
				</FormField>

				<div class="array-section">
					<h3>团队成员</h3>
					<FieldArray name="members" formState={form}>
						{#snippet children({ fields, append, remove, move })}
							<div class="member-list" use:dragSortable={{ onSort: move, handle: '.drag-handle' }}>
								{#each fields as field, index (field.key)}
									<div class="member-card">
										<div class="member-header">
											<div class="member-header-left">
												<span class="drag-handle" title="拖拽排序" role="button" tabindex="0">
													<svg
														width="20"
														height="20"
														viewBox="0 0 20 20"
														fill="none"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															d="M7 4.5C7 5.32843 6.32843 6 5.5 6C4.67157 6 4 5.32843 4 4.5C4 3.67157 4.67157 3 5.5 3C6.32843 3 7 3.67157 7 4.5Z"
															fill="currentColor"
														/>
														<path
															d="M7 10C7 10.8284 6.32843 11.5 5.5 11.5C4.67157 11.5 4 10.8284 4 10C4 9.17157 4.67157 8.5 5.5 8.5C6.32843 8.5 7 9.17157 7 10Z"
															fill="currentColor"
														/>
														<path
															d="M7 15.5C7 16.3284 6.32843 17 5.5 17C4.67157 17 4 16.3284 4 15.5C4 14.6716 4.67157 14 5.5 14C6.32843 14 7 14.6716 7 15.5Z"
															fill="currentColor"
														/>
														<path
															d="M12 4.5C12 5.32843 11.3284 6 10.5 6C9.67157 6 9 5.32843 9 4.5C9 3.67157 9.67157 3 10.5 3C11.3284 3 12 3.67157 12 4.5Z"
															fill="currentColor"
														/>
														<path
															d="M12 10C12 10.8284 11.3284 11.5 10.5 11.5C9.67157 11.5 9 10.8284 9 10C9 9.17157 9.67157 8.5 10.5 8.5C11.3284 8.5 12 9.17157 12 10Z"
															fill="currentColor"
														/>
														<path
															d="M12 15.5C12 16.3284 11.3284 17 10.5 17C9.67157 17 9 16.3284 9 15.5C9 14.6716 9.67157 14 10.5 14C11.3284 14 12 14.6716 12 15.5Z"
															fill="currentColor"
														/>
													</svg>
												</span>
												<span class="member-number">#{index + 1}</span>
											</div>
											<div class="member-actions">
												<button
													type="button"
													class="btn-move"
													onclick={() => move(index, index - 1)}
													disabled={index === 0}
													title="上移"
												>
													↑
												</button>
												<button
													type="button"
													class="btn-move"
													onclick={() => move(index, index + 1)}
													disabled={index === fields.length - 1}
													title="下移"
												>
													↓
												</button>
												<button
													type="button"
													class="btn-remove-member"
													onclick={() => remove(index)}
													disabled={fields.length === 1}
												>
													删除
												</button>
											</div>
										</div>

										<div class="member-fields">
											<FormField name={`members[${index}].name`} label="姓名" formState={form}>
												{#snippet children({ value, error, touched, onInput, onBlur })}
													<input
														type="text"
														{value}
														class:error={touched && error}
														placeholder="成员姓名"
														oninput={(e) => onInput(e.currentTarget.value)}
														onblur={onBlur}
													/>
													{#if touched && error}
														<span class="error-msg">{error}</span>
													{/if}
												{/snippet}
											</FormField>

											<FormField name={`members[${index}].email`} label="邮箱" formState={form}>
												{#snippet children({ value, error, touched, onInput, onBlur })}
													<input
														type="email"
														{value}
														class:error={touched && error}
														placeholder="email@example.com"
														oninput={(e) => onInput(e.currentTarget.value)}
														onblur={onBlur}
													/>
													{#if touched && error}
														<span class="error-msg">{error}</span>
													{/if}
												{/snippet}
											</FormField>

											<FormField name={`members[${index}].role`} label="角色" formState={form}>
												{#snippet children({ value, onInput })}
													<select {value} onchange={(e) => onInput(e.currentTarget.value)}>
														<option value="developer">开发</option>
														<option value="designer">设计</option>
														<option value="pm">产品</option>
														<option value="qa">测试</option>
													</select>
												{/snippet}
											</FormField>
										</div>
									</div>
								{/each}
							</div>

							<button
								type="button"
								class="btn-add-member"
								onclick={() => append({ name: '', email: '', role: 'developer' })}
							>
								+ 添加成员
							</button>
						{/snippet}
					</FieldArray>
				</div>

				<div class="form-actions">
					<button type="submit" class="btn-primary" disabled={!form.isValid}>提交</button>
					<button
						type="button"
						class="btn-secondary"
						onclick={() => {
							form.reset();
						}}
					>
						重置
					</button>
				</div>
			</Form>
		</div>

		<div class="state-viewer">
			<h3>表单数据</h3>
			<pre class="state-data">{JSON.stringify(form.values, null, 2)}</pre>
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
		background-clip: text;
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

	.form-card {
		background: white;
		padding: 2rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
	}

	:global(.form-field) {
		margin-bottom: 1rem;
	}

	:global(.form-field__label) {
		display: block;
		font-weight: 500;
		margin-bottom: 0.5rem;
		color: #374151;
	}

	input,
	select {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #d1d5db;
		border-radius: 0.5rem;
		font-size: 1rem;
		transition: all 0.2s;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}

	input.error {
		border-color: #ef4444;
	}

	.error-msg {
		display: block;
		color: #ef4444;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	.array-section {
		margin: 2rem 0;
	}

	.array-section h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.member-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
		max-height: 500px;
		overflow-y: auto;
		padding: 1rem;
		border: 2px dashed #e0e7ff;
		border-radius: 0.75rem;
		background: #fafbff;
	}

	/* Scrollbar styling */
	.member-list::-webkit-scrollbar {
		width: 8px;
	}

	.member-list::-webkit-scrollbar-track {
		background: #f1f5f9;
		border-radius: 4px;
	}

	.member-list::-webkit-scrollbar-thumb {
		background: #667eea;
		border-radius: 4px;
	}

	.member-list::-webkit-scrollbar-thumb:hover {
		background: #5568d3;
	}

	.member-card {
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		padding: 1.5rem;
	}

	.member-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.member-header-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.drag-handle {
		padding: 0.5rem;
		background: transparent;
		color: #9ca3af;
		cursor: grab;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.375rem;
		user-select: none;
		-webkit-user-select: none;
	}

	.drag-handle:hover {
		background: #e0e7ff;
		color: #667eea;
	}

	.drag-handle:active {
		cursor: grabbing;
	}

	.drag-handle svg {
		pointer-events: none;
	}

	.member-number {
		font-weight: 600;
		color: #667eea;
		font-size: 1.125rem;
	}

	.member-actions {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.btn-move {
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: #e0e7ff;
		color: #667eea;
		border: none;
		border-radius: 0.375rem;
		font-weight: 700;
		font-size: 1.125rem;
		cursor: pointer;
		transition: all 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.btn-move:hover:not(:disabled) {
		background: #c7d2fe;
		transform: scale(1.05);
	}

	.btn-move:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	.btn-remove-member {
		padding: 0.5rem 1rem;
		background: #fee2e2;
		color: #dc2626;
		border: none;
		border-radius: 0.375rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-remove-member:hover:not(:disabled) {
		background: #fecaca;
	}

	.btn-remove-member:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.member-fields {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.member-fields :global(.form-field:last-child) {
		grid-column: 1 / -1;
	}

	.btn-add-member {
		width: 100%;
		padding: 1rem;
		background: white;
		border: 2px dashed #d1d5db;
		border-radius: 0.5rem;
		color: #667eea;
		font-weight: 500;
		font-size: 1rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-add-member:hover {
		border-color: #667eea;
		background: #f0f4ff;
	}

	.form-actions {
		display: flex;
		gap: 0.75rem;
		margin-top: 2rem;
	}

	button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary {
		flex: 1;
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
		flex: 1;
		background: #f3f4f6;
		color: #374151;
	}

	.btn-secondary:hover {
		background: #e5e7eb;
	}

	.state-viewer {
		background: white;
		padding: 1.5rem;
		border-radius: 1rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
		border: 1px solid #e5e7eb;
	}

	.state-viewer h3 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 1rem;
	}

	.state-data {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		overflow-x: auto;
		font-family: 'Fira Code', monospace;
	}

	@media (max-width: 1024px) {
		.example-page {
			grid-template-columns: 1fr;
		}

		.documentation {
			position: static;
		}

		.member-fields {
			grid-template-columns: 1fr;
		}
	}
</style>

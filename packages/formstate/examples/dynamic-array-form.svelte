<script lang="ts">
	/**
	 * 动态数组表单示例
	 * 演示如何使用 FieldArray 管理动态列表（如团队成员）
	 */
	import { useFormState, Form, FieldArray, FormField, Validators } from '../src/index';

	const form = useFormState({
		fields: {
			teamName: {
				defaultValue: '',
				validator: Validators.required('Team name is required')
			},
			members: {
				defaultValue: [{ name: '', email: '', role: 'member' }]
			}
		}
	});

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('Team submitted:', values);
		alert(`Created team "${values.teamName}" with ${(values.members as unknown[]).length} members`);
	}
</script>

<div class="form-container">
	<h1>Create Team</h1>

	<Form formState={form} onSubmit={handleSubmit}>
		<FormField name="teamName" label="Team Name">
			{#snippet children({ value, onInput, onBlur })}
				<input
					type="text"
					{value}
					placeholder="Enter team name"
					oninput={(e) => onInput(e.currentTarget.value)}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>

		<div class="section">
			<h3>Team Members</h3>

			<FieldArray name="members">
				{#snippet children({ fields, append, remove, move })}
					<div class="members-list">
						{#each fields as field, index (field.key)}
							<div class="member-card">
								<div class="member-header">
									<span class="member-number">Member {index + 1}</span>
									<div class="member-actions">
										{#if index > 0}
											<button
												type="button"
												class="btn-icon"
												onclick={() => move(index, index - 1)}
												title="Move up"
											>
												↑
											</button>
										{/if}
										{#if index < fields.length - 1}
											<button
												type="button"
												class="btn-icon"
												onclick={() => move(index, index + 1)}
												title="Move down"
											>
												↓
											</button>
										{/if}
										{#if fields.length > 1}
											<button
												type="button"
												class="btn-remove"
												onclick={() => remove(index)}
												title="Remove member"
											>
												×
											</button>
										{/if}
									</div>
								</div>

								<div class="member-fields">
									<FormField name="{field.name}.name" label="Name">
										{#snippet children({ value, onInput, onBlur })}
											<input
												type="text"
												{value}
												placeholder="Full name"
												oninput={(e) => onInput(e.currentTarget.value)}
												onblur={onBlur}
											/>
										{/snippet}
									</FormField>

									<FormField name="{field.name}.email" label="Email">
										{#snippet children({ value, onInput, onBlur })}
											<input
												type="email"
												{value}
												placeholder="email@example.com"
												oninput={(e) => onInput(e.currentTarget.value)}
												onblur={onBlur}
											/>
										{/snippet}
									</FormField>

									<FormField name="{field.name}.role" label="Role">
										{#snippet children({ value, onInput, onBlur })}
											<select
												{value}
												onchange={(e) => onInput(e.currentTarget.value)}
												onblur={onBlur}
											>
												<option value="member">Member</option>
												<option value="lead">Team Lead</option>
												<option value="admin">Admin</option>
											</select>
										{/snippet}
									</FormField>
								</div>
							</div>
						{/each}

						<button
							type="button"
							class="btn-add"
							onclick={() => append({ name: '', email: '', role: 'member' })}
						>
							+ Add Member
						</button>
					</div>
				{/snippet}
			</FieldArray>
		</div>

		<div class="form-actions">
			<button type="submit" disabled={!form.isValid}>Create Team</button>
			<button type="button" onclick={() => form.reset()}>Reset</button>
		</div>

		<div class="form-debug">
			<details>
				<summary>Form State</summary>
				<pre>{JSON.stringify(
						{
							values: form.values,
							errors: form.errors,
							isDirty: form.isDirty
						},
						null,
						2
					)}</pre>
			</details>
		</div>
	</Form>
</div>

<style>
	.form-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
	}

	h1 {
		margin-bottom: 1.5rem;
	}

	.section {
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid #e5e7eb;
	}

	.section h3 {
		margin-bottom: 1rem;
	}

	.members-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.member-card {
		padding: 1rem;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
	}

	.member-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.member-number {
		font-weight: 600;
		color: #374151;
	}

	.member-actions {
		display: flex;
		gap: 0.25rem;
	}

	.btn-icon {
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: white;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 1rem;
	}

	.btn-icon:hover {
		background: #f3f4f6;
	}

	.btn-remove {
		width: 2rem;
		height: 2rem;
		padding: 0;
		background: #fee2e2;
		border: 1px solid #fecaca;
		border-radius: 0.375rem;
		cursor: pointer;
		font-size: 1.5rem;
		color: #dc2626;
		line-height: 1;
	}

	.btn-remove:hover {
		background: #fecaca;
	}

	.member-fields {
		display: grid;
		grid-template-columns: 2fr 2fr 1fr;
		gap: 1rem;
	}

	input,
	select {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
		background: white;
	}

	input:focus,
	select:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.btn-add {
		width: 100%;
		padding: 0.75rem;
		background: white;
		border: 2px dashed #d1d5db;
		border-radius: 0.5rem;
		color: #6b7280;
		font-weight: 500;
		cursor: pointer;
	}

	.btn-add:hover {
		border-color: #3b82f6;
		color: #3b82f6;
		background: #eff6ff;
	}

	.form-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 2rem;
	}

	button[type='submit'],
	button[type='button'] {
		flex: 1;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 0.375rem;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
	}

	button[type='submit'] {
		background: #3b82f6;
		color: white;
	}

	button[type='submit']:hover:not(:disabled) {
		background: #2563eb;
	}

	button[type='submit']:disabled {
		background: #9ca3af;
		cursor: not-allowed;
	}

	button[type='button'] {
		background: #e5e7eb;
		color: #374151;
	}

	button[type='button']:hover {
		background: #d1d5db;
	}

	.form-debug {
		margin-top: 2rem;
		padding-top: 1rem;
		border-top: 1px solid #e5e7eb;
	}

	.form-debug summary {
		cursor: pointer;
		font-weight: 500;
		color: #6b7280;
	}

	.form-debug pre {
		margin-top: 0.5rem;
		padding: 0.5rem;
		background: #f9fafb;
		border-radius: 0.375rem;
		font-size: 0.75rem;
		overflow-x: auto;
	}

	@media (max-width: 640px) {
		.member-fields {
			grid-template-columns: 1fr;
		}
	}
</style>

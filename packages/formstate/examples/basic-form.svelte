<script lang="ts">
	/**
	 * 基础表单示例
	 * 演示如何使用 FormState 创建登录表单
	 */
	import { useFormState, Form, FormField, Validators } from '../src/index';

	// 创建表单状态
	const form = useFormState({
		fields: {
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('Email is required'),
					Validators.email('Invalid email format')
				)
			},
			password: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required('Password is required'),
					Validators.minLength(8, 'Password must be at least 8 characters')
				)
			},
			rememberMe: {
				defaultValue: false
			}
		}
	});

	// 提交处理
	async function handleSubmit(values: Record<string, unknown>) {
		console.log('Form submitted:', values);
		alert(`Login attempt with email: ${values.email}`);
	}

	// 派生状态
	const canSubmit = $derived(form.isValid && !form.isValidating);
</script>

<div class="form-container">
	<h1>Login</h1>

	<Form formState={form} onSubmit={handleSubmit}>
		<FormField name="email" label="Email Address">
			{#snippet children({ value, error, touched, onInput, onBlur })}
				<input
					type="email"
					{value}
					class:error={touched && error}
					placeholder="Enter your email"
					oninput={(e) => onInput(e.currentTarget.value)}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>

		<FormField name="password" label="Password">
			{#snippet children({ value, error, touched, onInput, onBlur })}
				<input
					type="password"
					{value}
					class:error={touched && error}
					placeholder="Enter your password"
					oninput={(e) => onInput(e.currentTarget.value)}
					onblur={onBlur}
				/>
			{/snippet}
		</FormField>

		<FormField name="rememberMe" showError={false}>
			{#snippet children({ value, onInput })}
				<label class="checkbox-label">
					<input
						type="checkbox"
						checked={Boolean(value)}
						onchange={(e) => onInput(e.currentTarget.checked)}
					/>
					Remember me
				</label>
			{/snippet}
		</FormField>

		<div class="form-actions">
			<button type="submit" disabled={!canSubmit}>
				{form.isValidating ? 'Validating...' : 'Sign In'}
			</button>

			<button type="button" onclick={() => form.reset()}> Reset </button>
		</div>

		<div class="form-debug">
			<details>
				<summary>Debug Info</summary>
				<pre>{JSON.stringify(
						{
							values: form.values,
							errors: form.errors,
							isDirty: form.isDirty,
							isValid: form.isValid
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
		max-width: 400px;
		margin: 2rem auto;
		padding: 2rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.5rem;
	}

	h1 {
		margin-bottom: 1.5rem;
		text-align: center;
	}

	input[type='email'],
	input[type='password'] {
		width: 100%;
		padding: 0.5rem;
		border: 1px solid #d1d5db;
		border-radius: 0.375rem;
		font-size: 1rem;
	}

	input.error {
		border-color: #dc2626;
	}

	input:focus {
		outline: none;
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		cursor: pointer;
	}

	.form-actions {
		display: flex;
		gap: 0.5rem;
		margin-top: 1rem;
	}

	button {
		flex: 1;
		padding: 0.625rem 1rem;
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
</style>

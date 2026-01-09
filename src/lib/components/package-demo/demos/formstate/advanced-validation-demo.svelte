<script lang="ts">
	/**
	 * Advanced Validation Demo
	 * Demonstrates debounce, field dependencies, validateOnComplete, and batchUpdate.
	 */
	import { useFormState, Validators, createValidator } from '@shelchin/formstate';
	import { Timer, Link, Zap, CheckCircle, XCircle } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		InputGroup,
		ActionButtons,
		DemoButton
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	// Async validator with simulated API call
	const asyncUsernameValidator = createValidator<string>(async (value) => {
		if (!value) return null;
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		const taken = ['admin', 'root', 'user', 'test'];
		if (taken.includes(value.toLowerCase())) {
			return t('demo.advanced.username_taken');
		}
		return null;
	});

	// Password validator
	const passwordMsg = t('demo.advanced.password_min');
	const passwordValidator = Validators.minLength(8, passwordMsg);

	// Confirm password validator (depends on password field)
	const confirmPasswordValidator = createValidator<string>((value, allValues) => {
		if (value !== allValues.password) {
			return t('demo.advanced.passwords_must_match');
		}
		return null;
	});

	const form = useFormState({
		fields: {
			// Debounced async validation - validates after 500ms pause
			username: {
				defaultValue: '',
				validator: asyncUsernameValidator,
				validateOnComplete: true,
				debounceMs: 500
			},
			// Standard validation
			password: {
				defaultValue: '',
				validator: passwordValidator,
				validateOnChange: true
			},
			// Field with dependency - re-validates when password changes
			confirmPassword: {
				defaultValue: '',
				validator: confirmPasswordValidator,
				dependencies: ['password'],
				validateOnChange: true
			}
		}
	});

	// Track validation state
	let validationLog = $state<string[]>([]);

	function addLog(message: string) {
		validationLog = [...validationLog.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`];
	}

	// Subscribe to validation events
	form.subscribe({
		onFieldValidation: (path, error) => {
			addLog(`${path}: ${error || 'valid'}`);
		}
	});

	function batchUpdateExample() {
		form.batchUpdate(() => {
			form.setValue('username', 'newuser');
			form.setValue('password', 'password123');
			form.setValue('confirmPassword', 'password123');
		});
		addLog('Batch update completed');
	}

	const codeExample = `import { useFormState, createValidator } from '@shelchin/formstate';

// Async validator with debounce
const asyncUsernameValidator = createValidator(async (value) => {
  await new Promise(r => setTimeout(r, 500)); // Simulate API
  if (['admin', 'root'].includes(value.toLowerCase())) {
    return 'Username is taken';
  }
  return null;
});

const form = useFormState({
  fields: {
    // Debounced async validation
    username: {
      defaultValue: '',
      validator: asyncUsernameValidator,
      validateOnComplete: true,  // Validate when input "completes"
      debounceMs: 500            // Wait 500ms after last keystroke
    },

    password: {
      defaultValue: '',
      validator: Validators.minLength(8),
      validateOnChange: true
    },

    // Field with dependency
    confirmPassword: {
      defaultValue: '',
      validator: createValidator((value, allValues) => {
        if (value !== allValues.password) {
          return 'Passwords must match';
        }
        return null;
      }),
      dependencies: ['password'],  // Re-validate when password changes
      validateOnChange: true
    }
  }
});

// Batch update - single re-render for multiple changes
form.batchUpdate(() => {
  form.setValue('username', 'newuser');
  form.setValue('password', 'password123');
  form.setValue('confirmPassword', 'password123');
});`;
</script>

<DemoSection title={t('demo.advanced.title')} description={t('demo.advanced.description')}>
	<DemoContent>
		{#snippet panel()}
			<InputGroup label={t('demo.advanced.username')} id="adv-username">
				<div class="input-with-status">
					<input
						id="adv-username"
						type="text"
						value={form.values.username}
						oninput={(e) => form.setValue('username', e.currentTarget.value)}
						onblur={() => form.setFieldTouched('username', true)}
						placeholder={t('demo.advanced.username_placeholder')}
						class:has-error={form.errors.username}
					/>
					{#if form.isValidating}
						<span class="status validating">
							<Timer size={14} class="spin" />
						</span>
					{:else if form.values.username && !form.errors.username}
						<span class="status valid">
							<CheckCircle size={14} />
						</span>
					{:else if form.errors.username}
						<span class="status error">
							<XCircle size={14} />
						</span>
					{/if}
				</div>
				<span class="hint">
					<Timer size={12} />
					{t('demo.advanced.debounce_hint')}
				</span>
				{#if form.errors.username}
					<span class="field-error">{form.errors.username}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.advanced.password')} id="adv-password">
				<input
					id="adv-password"
					type="password"
					value={form.values.password}
					oninput={(e) => form.setValue('password', e.currentTarget.value)}
					onblur={() => form.setFieldTouched('password', true)}
					placeholder={t('demo.advanced.password_placeholder')}
					class:has-error={form.errors.password}
				/>
				{#if form.errors.password}
					<span class="field-error">{form.errors.password}</span>
				{/if}
			</InputGroup>

			<InputGroup label={t('demo.advanced.confirm_password')} id="adv-confirm">
				<div class="input-with-icon">
					<Link size={14} class="dep-icon" />
					<input
						id="adv-confirm"
						type="password"
						value={form.values.confirmPassword}
						oninput={(e) => form.setValue('confirmPassword', e.currentTarget.value)}
						onblur={() => form.setFieldTouched('confirmPassword', true)}
						placeholder={t('demo.advanced.confirm_placeholder')}
						class:has-error={form.errors.confirmPassword}
					/>
				</div>
				<span class="hint">
					<Link size={12} />
					{t('demo.advanced.dependency_hint')}
				</span>
				{#if form.errors.confirmPassword}
					<span class="field-error">{form.errors.confirmPassword}</span>
				{/if}
			</InputGroup>

			<ActionButtons>
				<DemoButton variant="secondary" icon={Zap} onclick={batchUpdateExample}>
					{t('demo.advanced.batch_update')}
				</DemoButton>
			</ActionButtons>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<div class="feature-cards">
					<div class="feature-card">
						<Timer size={16} />
						<span class="feature-title">{t('demo.advanced.feature_debounce')}</span>
						<span class="feature-desc">{t('demo.advanced.feature_debounce_desc')}</span>
					</div>
					<div class="feature-card">
						<Link size={16} />
						<span class="feature-title">{t('demo.advanced.feature_dependencies')}</span>
						<span class="feature-desc">{t('demo.advanced.feature_dependencies_desc')}</span>
					</div>
					<div class="feature-card">
						<Zap size={16} />
						<span class="feature-title">{t('demo.advanced.feature_batch')}</span>
						<span class="feature-desc">{t('demo.advanced.feature_batch_desc')}</span>
					</div>
				</div>

				<div class="validation-log">
					<h4>{t('demo.advanced.validation_log')}</h4>
					{#if validationLog.length === 0}
						<p class="empty-log">{t('demo.advanced.no_validations')}</p>
					{:else}
						<ul>
							{#each validationLog as log}
								<li>{log}</li>
							{/each}
						</ul>
					{/if}
				</div>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.advanced')} code={codeExample} />
</DemoSection>

<style>
	.input-with-status {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-with-status input {
		flex: 1;
		padding-right: var(--space-8);
	}

	.status {
		position: absolute;
		right: var(--space-3);
		display: flex;
		align-items: center;
	}

	.status.validating {
		color: var(--color-primary);
	}

	.status.valid {
		color: var(--color-success);
	}

	.status.error {
		color: var(--color-danger);
	}

	:global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.input-with-icon {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-with-icon input {
		flex: 1;
		padding-left: var(--space-8);
	}

	:global(.dep-icon) {
		position: absolute;
		left: var(--space-3);
		color: var(--color-muted-foreground);
	}

	.hint {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin-top: var(--space-1);
	}

	.result-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.feature-cards {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.feature-card {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
	}

	.feature-title {
		font-weight: 600;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.feature-desc {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		margin-left: auto;
	}

	.validation-log {
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		padding: var(--space-3);
	}

	.validation-log h4 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-sm);
		color: var(--color-foreground);
	}

	.validation-log ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.validation-log li {
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		padding: var(--space-1) 0;
		border-bottom: 1px solid var(--color-border);
	}

	.validation-log li:last-child {
		border-bottom: none;
	}

	.empty-log {
		margin: 0;
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		font-style: italic;
	}

	input {
		width: 100%;
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		background: var(--color-input);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		transition: border-color 0.2s;
	}

	input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	input.has-error {
		border-color: var(--color-danger);
	}

	.field-error {
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}
</style>

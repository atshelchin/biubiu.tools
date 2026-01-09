<script lang="ts">
	/**
	 * Multi-Step Form Demo
	 * Demonstrates step-by-step form with per-step validation.
	 */
	import { useFormState, Validators } from '@shelchin/formstate';
	import { ChevronLeft, ChevronRight, Check, User, Mail, Lock, Copy } from '@lucide/svelte';
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

	let currentStep = $state(0);
	const totalSteps = 3;
	let submitSuccess = $state(false);
	let copySuccess = $state(false);

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(JSON.stringify(form.values, null, 2));
			copySuccess = true;
			setTimeout(() => (copySuccess = false), 2000);
		} catch {
			// Fallback: do nothing
		}
	}

	// Define which fields belong to each step
	const stepFields: string[][] = [
		['firstName', 'lastName'], // Step 1: Personal Info
		['email', 'phone'], // Step 2: Contact Info
		['password', 'confirmPassword'] // Step 3: Security
	];

	const form = useFormState({
		fields: {
			// Step 1: Personal Info
			firstName: {
				defaultValue: '',
				validator: Validators.required(t('demo.multistep.required')),
				validateOnChange: true
			},
			lastName: {
				defaultValue: '',
				validator: Validators.required(t('demo.multistep.required')),
				validateOnChange: true
			},
			// Step 2: Contact Info
			email: {
				defaultValue: '',
				validator: Validators.compose(
					Validators.required(t('demo.multistep.required')),
					Validators.email(t('demo.multistep.email_invalid'))
				),
				validateOnChange: true
			},
			phone: {
				defaultValue: '',
				validator: Validators.pattern(/^\d{10,11}$/, t('demo.multistep.phone_invalid')),
				validateOnChange: true
			},
			// Step 3: Security
			password: {
				defaultValue: '',
				validator: Validators.minLength(8, t('demo.multistep.password_min')),
				validateOnChange: true
			},
			confirmPassword: {
				defaultValue: '',
				validateOnChange: true
			}
		}
	});

	// Validate current step fields
	async function validateCurrentStep(): Promise<boolean> {
		const fields = stepFields[currentStep];
		const errors = await form.validateFields(fields);
		return Object.values(errors).every((error) => !error);
	}

	async function nextStep() {
		const isValid = await validateCurrentStep();
		if (isValid && currentStep < totalSteps - 1) {
			currentStep++;
		}
	}

	function prevStep() {
		if (currentStep > 0) {
			currentStep--;
		}
	}

	async function handleSubmit() {
		const isValid = await validateCurrentStep();
		if (isValid) {
			submitSuccess = true;
		}
	}

	function resetForm() {
		form.reset();
		currentStep = 0;
		submitSuccess = false;
	}

	// Check if current step has errors (used by canProceed logic)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const _currentStepHasErrors = $derived(() => {
		const fields = stepFields[currentStep];
		return fields.some((field) => form.errors[field]);
	});

	const stepTitles = $derived([
		t('demo.multistep.step1_title'),
		t('demo.multistep.step2_title'),
		t('demo.multistep.step3_title')
	]);

	const codeExample = `import { useFormState, Validators } from '@shelchin/formstate';

let currentStep = $state(0);

// Define fields per step
const stepFields = [
  ['firstName', 'lastName'],     // Step 1
  ['email', 'phone'],            // Step 2
  ['password', 'confirmPassword'] // Step 3
];

const form = useFormState({
  fields: {
    firstName: {
      defaultValue: '',
      validator: Validators.required('Required')
    },
    lastName: { defaultValue: '', validator: Validators.required('Required') },
    email: {
      defaultValue: '',
      validator: Validators.compose(
        Validators.required('Required'),
        Validators.email('Invalid email')
      )
    },
    phone: { defaultValue: '' },
    password: {
      defaultValue: '',
      validator: Validators.minLength(8, 'Minimum 8 characters')
    },
    confirmPassword: { defaultValue: '' }
  }
});

// Validate only current step fields
async function validateCurrentStep(): Promise<boolean> {
  const fields = stepFields[currentStep];
  const errors = await form.validateFields(fields);
  return Object.values(errors).every(error => !error);
}

async function nextStep() {
  const isValid = await validateCurrentStep();
  if (isValid && currentStep < stepFields.length - 1) {
    currentStep++;
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
  }
}`;
</script>

<DemoSection title={t('demo.multistep.title')} description={t('demo.multistep.description')}>
	<DemoContent>
		{#snippet panel()}
			<!-- Step Indicator -->
			<div class="step-indicator">
				{#each stepTitles as title, index (index)}
					<div
						class="step"
						class:active={index === currentStep}
						class:completed={index < currentStep}
					>
						<div class="step-number">
							{#if index < currentStep}
								<Check size={14} />
							{:else}
								{index + 1}
							{/if}
						</div>
						<span class="step-title">{title}</span>
					</div>
					{#if index < totalSteps - 1}
						<div class="step-line" class:completed={index < currentStep}></div>
					{/if}
				{/each}
			</div>

			<!-- Step Content -->
			<div class="step-content">
				{#if currentStep === 0}
					<div class="step-header">
						<User size={16} />
						<h4>{t('demo.multistep.step1_title')}</h4>
					</div>
					<InputGroup label={t('demo.multistep.first_name')} id="ms-firstname">
						<input
							id="ms-firstname"
							type="text"
							value={form.values.firstName}
							oninput={(e) => form.setValue('firstName', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('firstName', true)}
							placeholder={t('demo.multistep.first_name_placeholder')}
							class:has-error={form.errors.firstName}
						/>
						{#if form.errors.firstName}
							<span class="field-error">{form.errors.firstName}</span>
						{/if}
					</InputGroup>

					<InputGroup label={t('demo.multistep.last_name')} id="ms-lastname">
						<input
							id="ms-lastname"
							type="text"
							value={form.values.lastName}
							oninput={(e) => form.setValue('lastName', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('lastName', true)}
							placeholder={t('demo.multistep.last_name_placeholder')}
							class:has-error={form.errors.lastName}
						/>
						{#if form.errors.lastName}
							<span class="field-error">{form.errors.lastName}</span>
						{/if}
					</InputGroup>
				{:else if currentStep === 1}
					<div class="step-header">
						<Mail size={16} />
						<h4>{t('demo.multistep.step2_title')}</h4>
					</div>
					<InputGroup label={t('demo.multistep.email')} id="ms-email">
						<input
							id="ms-email"
							type="email"
							value={form.values.email}
							oninput={(e) => form.setValue('email', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('email', true)}
							placeholder={t('demo.multistep.email_placeholder')}
							class:has-error={form.errors.email}
						/>
						{#if form.errors.email}
							<span class="field-error">{form.errors.email}</span>
						{/if}
					</InputGroup>

					<InputGroup label={t('demo.multistep.phone')} id="ms-phone">
						<input
							id="ms-phone"
							type="tel"
							value={form.values.phone}
							oninput={(e) => form.setValue('phone', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('phone', true)}
							placeholder={t('demo.multistep.phone_placeholder')}
							class:has-error={form.errors.phone}
						/>
						{#if form.errors.phone}
							<span class="field-error">{form.errors.phone}</span>
						{/if}
					</InputGroup>
				{:else if currentStep === 2}
					<div class="step-header">
						<Lock size={16} />
						<h4>{t('demo.multistep.step3_title')}</h4>
					</div>
					<InputGroup label={t('demo.multistep.password')} id="ms-password">
						<input
							id="ms-password"
							type="password"
							value={form.values.password}
							oninput={(e) => form.setValue('password', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('password', true)}
							placeholder={t('demo.multistep.password_placeholder')}
							class:has-error={form.errors.password}
						/>
						{#if form.errors.password}
							<span class="field-error">{form.errors.password}</span>
						{/if}
					</InputGroup>

					<InputGroup label={t('demo.multistep.confirm_password')} id="ms-confirm">
						<input
							id="ms-confirm"
							type="password"
							value={form.values.confirmPassword}
							oninput={(e) => form.setValue('confirmPassword', e.currentTarget.value)}
							onblur={() => form.setFieldTouched('confirmPassword', true)}
							placeholder={t('demo.multistep.confirm_placeholder')}
							class:has-error={form.errors.confirmPassword}
						/>
						{#if form.errors.confirmPassword}
							<span class="field-error">{form.errors.confirmPassword}</span>
						{/if}
					</InputGroup>
				{/if}
			</div>

			<!-- Navigation -->
			<div class="step-navigation">
				<DemoButton
					variant="secondary"
					icon={ChevronLeft}
					onclick={prevStep}
					disabled={currentStep === 0}
				>
					{t('demo.multistep.prev')}
				</DemoButton>

				{#if currentStep < totalSteps - 1}
					<DemoButton variant="primary" onclick={nextStep}>
						{t('demo.multistep.next')}
						<ChevronRight size={16} />
					</DemoButton>
				{:else}
					<DemoButton variant="primary" icon={Check} onclick={handleSubmit}>
						{t('demo.multistep.submit')}
					</DemoButton>
				{/if}
			</div>
		{/snippet}

		{#snippet result()}
			<div class="result-panel">
				<h4>{t('demo.multistep.progress')}</h4>
				<div class="progress-bar">
					<div class="progress-fill" style="width: {((currentStep + 1) / totalSteps) * 100}%"></div>
				</div>
				<span class="progress-text">{currentStep + 1} / {totalSteps}</span>

				{#if submitSuccess}
					<div class="submit-success">
						<div class="success-header">
							<Check size={16} class="success-icon" />
							<span>{t('demo.multistep.submit_success')}</span>
						</div>
						<div class="success-data">
							<div class="data-header">
								<h4>{t('demo.multistep.submitted_data')}</h4>
								<button class="btn-copy" onclick={copyToClipboard} title={t('actions.copy')}>
									{#if copySuccess}
										<Check size={14} />
									{:else}
										<Copy size={14} />
									{/if}
								</button>
							</div>
							<pre>{JSON.stringify(form.values, null, 2)}</pre>
						</div>
					</div>
				{:else}
					<div class="collected-data">
						<h4>{t('demo.multistep.collected_data')}</h4>
						<pre>{JSON.stringify(form.values, null, 2)}</pre>
					</div>
				{/if}

				<ActionButtons>
					<DemoButton variant="secondary" onclick={resetForm}>
						{t('demo.multistep.reset')}
					</DemoButton>
				</ActionButtons>
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.multistep')} code={codeExample} />
</DemoSection>

<style>
	.step-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: var(--space-6);
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-1);
	}

	.step-number {
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: var(--color-panel-0);
		border: 2px solid var(--color-border);
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-muted-foreground);
		transition: all 0.2s;
	}

	.step.active .step-number {
		border-color: var(--color-primary);
		background: var(--color-primary);
		color: white;
	}

	.step.completed .step-number {
		border-color: var(--color-success);
		background: var(--color-success);
		color: white;
	}

	.step-title {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		white-space: nowrap;
	}

	.step.active .step-title {
		color: var(--color-primary);
		font-weight: 600;
	}

	.step-line {
		flex: 1;
		height: 2px;
		background: var(--color-border);
		margin: 0 var(--space-2);
		margin-bottom: var(--space-4);
		min-width: 40px;
		transition: background 0.2s;
	}

	.step-line.completed {
		background: var(--color-success);
	}

	.step-content {
		padding: var(--space-4);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		margin-bottom: var(--space-4);
	}

	.step-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-bottom: var(--space-4);
		padding-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}

	.step-header h4 {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.step-navigation {
		display: flex;
		justify-content: space-between;
	}

	.result-panel {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	.result-panel h4 {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.progress-bar {
		height: 8px;
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: 4px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--color-primary);
		transition: width 0.3s ease;
	}

	.progress-text {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		text-align: center;
	}

	.collected-data {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.collected-data pre {
		margin: 0;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
	}

	.submit-success {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-4);
		background: color-mix(in srgb, var(--color-success) 10%, transparent);
		border: 1px solid var(--color-success);
		border-radius: var(--radius);
	}

	.success-header {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-success);
		font-weight: 600;
	}

	.success-data {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.success-data pre {
		margin: 0;
		padding: var(--space-3);
		background: var(--color-panel-0);
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
		font-size: var(--text-xs);
		color: var(--color-foreground);
		overflow-x: auto;
	}

	.data-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.data-header h4 {
		margin: 0;
		font-size: var(--text-sm);
		font-weight: 600;
		color: var(--color-foreground);
	}

	.btn-copy {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		background: transparent;
		border: 1px solid var(--color-border);
		border-radius: var(--radius);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-copy:hover {
		background: var(--color-panel-0);
		border-color: var(--color-primary);
		color: var(--color-primary);
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
		display: block;
		font-size: var(--text-xs);
		color: var(--color-danger);
		margin-top: var(--space-1);
	}

	@media (max-width: 640px) {
		.step-title {
			display: none;
		}

		.step-line {
			margin-bottom: 0;
		}
	}
</style>

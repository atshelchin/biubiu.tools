<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepContentHeader from '$lib/components/step/step-content-header.svelte';
	import { step3State } from '../../stores/step3-state.svelte';

	const i18n = useI18n();

	// Character limits
	const NAME_MAX = 50;
	const SYMBOL_MAX = 10;
	const DESCRIPTION_MAX = 500;

	const nameCharsLeft = $derived(NAME_MAX - step3State.name.length);
	const symbolCharsLeft = $derived(SYMBOL_MAX - step3State.symbol.length);
	const descriptionCharsLeft = $derived(DESCRIPTION_MAX - step3State.description.length);

	function handleSymbolInput(e: Event) {
		const target = e.target as HTMLInputElement;
		step3State.symbol = target.value.toUpperCase();
	}
</script>

<div class="step-content">
	<StepContentHeader
		title={i18n.t('tools.nft_deployer.step3.content.title')}
		description={i18n.t('tools.nft_deployer.step3.content.description')}
	/>

	<div class="form-container">
		<!-- Collection Name -->
		<div class="form-field">
			<label for="nft-name" class="field-label">
				{i18n.t('tools.nft_deployer.step3.content.name_label')}
				<span class="required">*</span>
			</label>
			<input
				id="nft-name"
				type="text"
				class="field-input"
				placeholder={i18n.t('tools.nft_deployer.step3.content.name_placeholder')}
				bind:value={step3State.name}
				maxlength={NAME_MAX}
			/>
			<div class="field-hint">
				<span>{i18n.t('tools.nft_deployer.step3.content.name_hint')}</span>
				<span class="char-count">{nameCharsLeft} {i18n.t('common.chars_left')}</span>
			</div>
		</div>

		<!-- Symbol -->
		<div class="form-field">
			<label for="nft-symbol" class="field-label">
				{i18n.t('tools.nft_deployer.step3.content.symbol_label')}
				<span class="required">*</span>
			</label>
			<input
				id="nft-symbol"
				type="text"
				class="field-input symbol-input"
				placeholder={i18n.t('tools.nft_deployer.step3.content.symbol_placeholder')}
				value={step3State.symbol}
				oninput={handleSymbolInput}
				maxlength={SYMBOL_MAX}
			/>
			<div class="field-hint">
				<span>{i18n.t('tools.nft_deployer.step3.content.symbol_hint')}</span>
				<span class="char-count">{symbolCharsLeft} {i18n.t('common.chars_left')}</span>
			</div>
		</div>

		<!-- Description -->
		<div class="form-field">
			<label for="nft-description" class="field-label">
				{i18n.t('tools.nft_deployer.step3.content.description_label')}
				<span class="required">*</span>
			</label>
			<textarea
				id="nft-description"
				class="field-textarea"
				placeholder={i18n.t('tools.nft_deployer.step3.content.description_placeholder')}
				bind:value={step3State.description}
				maxlength={DESCRIPTION_MAX}
				rows="4"
			></textarea>
			<div class="field-hint">
				<span>{i18n.t('tools.nft_deployer.step3.content.description_hint')}</span>
				<span class="char-count">{descriptionCharsLeft} {i18n.t('common.chars_left')}</span>
			</div>
		</div>

		<!-- Base URI (Optional) -->
		<div class="form-field">
			<label for="nft-base-uri" class="field-label">
				{i18n.t('tools.nft_deployer.step3.content.base_uri_label')}
				<span class="optional">{i18n.t('common.optional')}</span>
			</label>
			<input
				id="nft-base-uri"
				type="url"
				class="field-input"
				placeholder={i18n.t('tools.nft_deployer.step3.content.base_uri_placeholder')}
				bind:value={step3State.baseUri}
			/>
			<div class="field-hint">
				{i18n.t('tools.nft_deployer.step3.content.base_uri_hint')}
			</div>
		</div>

		<!-- Preview Card -->
		{#if step3State.isValid()}
			<div class="preview-card">
				<h4 class="preview-title">{i18n.t('tools.nft_deployer.step3.content.preview')}</h4>
				<div class="preview-content">
					<div class="preview-row">
						<span class="preview-label">{i18n.t('common.name')}:</span>
						<span class="preview-value">{step3State.name}</span>
					</div>
					<div class="preview-row">
						<span class="preview-label">{i18n.t('common.symbol')}:</span>
						<span class="preview-value">{step3State.symbol}</span>
					</div>
					<div class="preview-row">
						<span class="preview-label">{i18n.t('common.description')}:</span>
						<span class="preview-value">{step3State.description}</span>
					</div>
					{#if step3State.baseUri}
						<div class="preview-row">
							<span class="preview-label">Base URI:</span>
							<span class="preview-value truncate">{step3State.baseUri}</span>
						</div>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.step-content {
		padding: var(--space-6);
	}

	.form-container {
		max-width: 600px;
		margin: var(--space-6) auto 0;
	}

	.form-field {
		margin-bottom: var(--space-6);
	}

	.field-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}

	:global([data-theme='dark']) .field-label {
		color: var(--gray-300);
	}

	.required {
		color: var(--red-600);
	}

	.optional {
		font-size: var(--text-xs);
		color: var(--gray-500);
		font-weight: var(--font-normal);
		margin-left: var(--space-2);
	}

	.field-input,
	.field-textarea {
		width: 100%;
		padding: var(--space-3);
		font-size: var(--text-base);
		border: 2px solid var(--color-border);
		border-radius: var(--radius-md);
		background: var(--color-panel-1);
		color: var(--gray-900);
		transition: all 0.2s ease;
	}

	.field-input:focus,
	.field-textarea:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px hsla(210, 100%, 50%, 0.1);
	}

	.field-textarea {
		resize: vertical;
		min-height: 100px;
		font-family: inherit;
	}

	.symbol-input {
		text-transform: uppercase;
	}

	:global([data-theme='dark']) .field-input,
	:global([data-theme='dark']) .field-textarea {
		background: var(--gray-800);
		color: var(--gray-100);
	}

	.field-hint {
		display: flex;
		justify-content: space-between;
		margin-top: var(--space-2);
		font-size: var(--text-xs);
		color: var(--gray-500);
	}

	.char-count {
		font-weight: var(--font-medium);
	}

	/* Preview Card */
	.preview-card {
		margin-top: var(--space-8);
		padding: var(--space-6);
		background: hsla(210, 100%, 50%, 0.05);
		border: 2px solid var(--color-primary);
		border-radius: var(--radius-lg);
	}

	.preview-title {
		font-size: var(--text-lg);
		font-weight: var(--font-bold);
		color: var(--gray-900);
		margin: 0 0 var(--space-4) 0;
	}

	:global([data-theme='dark']) .preview-title {
		color: var(--gray-100);
	}

	.preview-content {
		display: grid;
		gap: var(--space-3);
	}

	.preview-row {
		display: grid;
		grid-template-columns: 120px 1fr;
		gap: var(--space-3);
		font-size: var(--text-sm);
	}

	.preview-label {
		color: var(--gray-600);
		font-weight: var(--font-medium);
	}

	.preview-value {
		color: var(--gray-900);
		word-break: break-word;
	}

	.preview-value.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global([data-theme='dark']) .preview-label {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .preview-value {
		color: var(--gray-100);
	}

	@media (max-width: 640px) {
		.step-content {
			padding: var(--space-3);
		}

		.form-container {
			max-width: 100%;
		}

		.preview-row {
			grid-template-columns: 1fr;
			gap: var(--space-1);
		}
	}
</style>

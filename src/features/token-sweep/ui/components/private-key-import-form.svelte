<script lang="ts">
	import SimpleCodeEditor from '$lib/components/widgets/SimpleCodeEditor.svelte';
	import FileUploadModal from '$lib/components/ui/file-upload-modal.svelte';
	import { Loader2, Upload } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	interface Props {
		privateKeysText: string;
		isGenerating: boolean;
		generationProgress: number;
		onImport: () => void;
	}

	let {
		privateKeysText = $bindable(),
		isGenerating,
		generationProgress,
		onImport
	}: Props = $props();

	let showUploadModal = $state(false);

	function handleUploadClick() {
		showUploadModal = true;
	}

	function handleUploadConfirm(content: string) {
		// Replace content with uploaded file
		privateKeysText = content;
	}
</script>

<div class="form-section" transition:slide>
	<div class="form-header">
		<div class="form-label">{i18n.t('tools.token_sweep.step4.content.private_key.label')}</div>
		<button class="btn-upload" onclick={handleUploadClick} disabled={isGenerating}>
			<Upload size={16} />
			{i18n.t('tools.token_sweep.step4.content.private_key.upload_file')}
		</button>
	</div>
	<SimpleCodeEditor
		bind:value={privateKeysText}
		placeholder={i18n.t('tools.token_sweep.step4.content.private_key.placeholder')}
		rows={20}
	/>
	<button
		class="btn-primary btn-with-progress"
		onclick={onImport}
		disabled={isGenerating}
		style="width: 100%; margin-top: var(--space-2);"
	>
		{#if isGenerating}
			<Loader2 size={18} class="spinning" />
			{i18n.t('tools.token_sweep.step4.content.private_key.importing', {
				progress: Math.round(generationProgress)
			})}
			<div class="btn-progress-bar" style="width: {generationProgress}%"></div>
		{:else}
			{i18n.t('tools.token_sweep.step4.content.private_key.import_button')}
		{/if}
	</button>
</div>

<FileUploadModal
	open={showUploadModal}
	columnCount={2}
	columnLabels={[
		i18n.t('tools.token_sweep.step4.content.private_key.column_label'),
		i18n.t('tools.token_sweep.step4.content.private_key.address_label')
	]}
	onClose={() => (showUploadModal = false)}
	onConfirm={handleUploadConfirm}
/>

<style>
	.form-section {
		margin-bottom: var(--space-6);
	}

	.form-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.form-label {
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}
	:global([data-theme='dark']) .form-label {
		color: var(--gray-300);
	}

	.btn-upload {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-3);
		background: var(--color-muted);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		color: var(--color-foreground);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-upload:hover:not(:disabled) {
		background: var(--color-accent);
		border-color: var(--color-primary);
	}

	.btn-upload:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-primary {
		padding: var(--space-2) var(--space-4);
		border: none;
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
		font-size: var(--text-sm);
		cursor: pointer;
		transition: all 0.2s;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		background: var(--color-primary);
		color: white;
	}
	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
		transform: translateY(-1px);
	}
	.btn-primary:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-with-progress {
		position: relative;
		overflow: hidden;
	}

	.btn-progress-bar {
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
		background: rgba(255, 255, 255, 0.2);
		transition: width 0.3s ease;
		z-index: 0;
	}

	.btn-with-progress > :global(*) {
		position: relative;
		z-index: 1;
	}

	:global(.spinning) {
		animation: spin 1s linear infinite;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>

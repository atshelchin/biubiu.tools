<script lang="ts">
	import PrivateKeyEditorWithErrors from './private-key-editor-with-errors.svelte';
	import FileUploadModal from '$lib/components/ui/file-upload-modal.svelte';
	import ProgressButton from '$lib/components/ui/progress-button.svelte';
	import { slide } from 'svelte/transition';
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();

	interface InvalidKey {
		key: string;
		reason?: string;
	}

	interface Props {
		privateKeysText: string;
		isGenerating: boolean;
		generationProgress: number;
		invalidPrivateKeys?: InvalidKey[];
		onImport: () => void;
	}

	let {
		privateKeysText = $bindable(),
		isGenerating,
		generationProgress,
		invalidPrivateKeys = [],
		onImport
	}: Props = $props();

	let showUploadModal = $state(false);

	// Check if content is not empty
	const hasContent = $derived(privateKeysText.trim().length > 0);

	function handleUploadClick() {
		showUploadModal = true;
	}

	function handleUploadConfirm(content: string) {
		// Replace content with uploaded file
		privateKeysText = content;
	}
</script>

<div transition:slide>
	<PrivateKeyEditorWithErrors
		bind:value={privateKeysText}
		placeholder={i18n.t('routes/apps/wallet-sweep.step4.content.private_key.placeholder')}
		rows={20}
		invalidKeys={invalidPrivateKeys}
		onUploadClick={handleUploadClick}
	/>
	<p class="form-hint">
		{i18n.t('routes/apps/wallet-sweep.step4.content.private_key.security_hint')}
	</p>
	{#if hasContent}
		<ProgressButton
			label={i18n.t('routes/apps/wallet-sweep.step4.content.import_wallets_button')}
			loadingLabel={i18n.t('routes/apps/wallet-sweep.step4.content.private_key.importing', {
				progress: Math.round(generationProgress)
			})}
			isLoading={isGenerating}
			onclick={onImport}
		/>
	{/if}
</div>

<FileUploadModal
	open={showUploadModal}
	columnCount={1}
	columnLabels={[
		i18n.t('routes/apps/wallet-sweep.step4.content.private_key.column_label')
		// i18n.t('routes/apps/wallet-sweep.step4.content.private_key.address_label')
	]}
	onClose={() => (showUploadModal = false)}
	onConfirm={handleUploadConfirm}
/>

<style>
	.form-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: var(--space-2) 0 0 0;
	}
	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}
</style>

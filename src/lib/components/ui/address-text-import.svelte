<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import SimpleCodeEditor from '$lib/components/widgets/SimpleCodeEditor.svelte';
	import FileUploadModal from '$lib/components/ui/file-upload-modal.svelte';
	import ProgressButton from '$lib/components/ui/progress-button.svelte';
	import { isAddress, type Address } from 'viem';
	import { Upload } from '@lucide/svelte';

	const i18n = useI18n();

	interface Props {
		/** Current addresses text */
		value: string;
		/** Whether import is in progress */
		isImporting?: boolean;
		/** Import progress percentage */
		importProgress?: number;
		/** Placeholder text */
		placeholder?: string;
		/** Number of rows for editor */
		rows?: number;
		/** Called when import button is clicked */
		onImport: (addresses: Address[]) => void;
	}

	let {
		value = $bindable(''),
		isImporting = false,
		importProgress = 0,
		placeholder,
		rows = 10,
		onImport
	}: Props = $props();

	let showUploadModal = $state(false);

	// Parse addresses from text
	function parseAddresses(text: string): Address[] {
		return text
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && isAddress(line)) as Address[];
	}

	// Get valid address count
	const validAddressCount = $derived(parseAddresses(value).length);
	const hasContent = $derived(value.trim().length > 0);

	// Handle import
	function handleImport() {
		const addresses = parseAddresses(value);
		if (addresses.length > 0) {
			onImport(addresses);
			// Don't clear input - keep it for user reference
		}
	}

	// Handle file upload
	function handleUploadClick() {
		showUploadModal = true;
	}

	function handleUploadConfirm(content: string) {
		value = content;
	}

	const defaultPlaceholder = $derived(
		i18n.t('components.address_text_import.placeholder') ||
			'Paste wallet addresses here (one per line)\n0x1234...\n0x5678...\n0xabcd...'
	);
</script>

<div class="address-text-import">
	<div class="editor-wrapper">
		<SimpleCodeEditor bind:value placeholder={placeholder || defaultPlaceholder} {rows} />
		<button class="upload-btn" onclick={handleUploadClick} type="button" title="Upload file">
			<Upload size={16} />
		</button>
	</div>

	<p class="form-hint">
		{i18n.t('components.address_text_import.hint') || 'Enter one address per line'}
	</p>

	{#if hasContent}
		<ProgressButton
			label={i18n.t('components.address_text_import.import_button', {
				count: validAddressCount
			}) || `Import Addresses (${validAddressCount})`}
			loadingLabel={i18n.t('components.address_text_import.importing', {
				progress: Math.round(importProgress)
			}) || `Importing... ${Math.round(importProgress)}%`}
			isLoading={isImporting}
			onclick={handleImport}
			disabled={validAddressCount === 0}
		/>
	{/if}
</div>

<FileUploadModal
	open={showUploadModal}
	columnCount={1}
	columnLabels={[i18n.t('components.address_text_import.column_label') || 'Address']}
	onClose={() => (showUploadModal = false)}
	onConfirm={handleUploadConfirm}
/>

<style>
	.address-text-import {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.editor-wrapper {
		position: relative;
	}

	.upload-btn {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		padding: 0;
		background: var(--gray-100);
		border: 1px solid var(--gray-300);
		border-radius: var(--radius-sm);
		color: var(--gray-600);
		cursor: pointer;
		transition: all 0.2s;
		z-index: 1;
	}

	.upload-btn:hover {
		background: var(--gray-200);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .upload-btn {
		background: var(--gray-600);
		border-color: var(--gray-500);
		color: var(--gray-300);
	}

	:global([data-theme='dark']) .upload-btn:hover {
		background: var(--gray-500);
		color: var(--gray-200);
	}

	.form-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: 0;
	}

	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}
</style>

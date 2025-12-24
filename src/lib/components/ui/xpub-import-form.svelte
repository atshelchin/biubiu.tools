<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import SimpleCodeEditor from '$lib/components/widgets/SimpleCodeEditor.svelte';
	import AddressPathSelector from '$lib/components/ui/address-path-selector.svelte';
	import ProgressButton from '$lib/components/ui/progress-button.svelte';
	import { slide } from 'svelte/transition';
	import type { DerivationPathType } from '@/features/wallet-sweep/types/wallet';

	const i18n = useI18n();

	interface Props {
		/** xpub text value */
		xpubText: string;
		/** Path derivation type */
		pathType: DerivationPathType;
		/** Sequential mode: start index */
		startIndex: number;
		/** Sequential mode: end index */
		endIndex: number;
		/** Date mode: start year */
		startYear: number;
		/** Date mode: end year */
		endYear: number;
		/** Date mode options (not used but kept for interface compatibility) */
		includeMonth?: boolean;
		includeDay?: boolean;
		useLeadingZeros?: boolean;
		/** Whether derivation is in progress */
		isGenerating: boolean;
		/** Generation progress percentage */
		generationProgress: number;
		/** Called when generate button is clicked */
		onGenerate: () => void;
	}

	let {
		xpubText = $bindable(),
		pathType = $bindable(),
		startIndex = $bindable(),
		endIndex = $bindable(),
		startYear = $bindable(),
		endYear = $bindable(),
		includeMonth = $bindable(),
		includeDay = $bindable(),
		useLeadingZeros = $bindable(),
		isGenerating,
		generationProgress,
		onGenerate
	}: Props = $props();

	// Validate xpub format
	function validateXpub(xpub: string): boolean {
		const trimmed = xpub.trim();
		// xpub, ypub, zpub for Bitcoin/Ethereum extended public keys
		return /^(xpub|ypub|zpub)[a-zA-Z0-9]{107,111}$/.test(trimmed);
	}

	const isXpubValid = $derived(xpubText.trim().length > 0 && validateXpub(xpubText.trim()));
</script>

<div transition:slide>
	<SimpleCodeEditor
		bind:value={xpubText}
		placeholder={i18n.t('components.xpub_import_form.placeholder') ||
			'Enter your extended public key (xpub, ypub, or zpub)...'}
		rows={3}
	/>
	<p class="form-hint">
		{i18n.t('components.xpub_import_form.hint') ||
			'xpub allows address derivation without exposing private keys'}
	</p>

	{#if isXpubValid}
		<div style="margin-top: var(--space-4);" transition:slide={{ duration: 200 }}>
			<div class="form-label">
				{i18n.t('components.xpub_import_form.derivation_path') || 'Derivation Range'}
			</div>
			<AddressPathSelector
				bind:pathType
				bind:startIndex
				bind:endIndex
				bind:startYear
				bind:endYear
				bind:includeMonth
				bind:includeDay
				bind:useLeadingZeros
				maxAddresses={100_000}
			/>
		</div>

		<ProgressButton
			label={i18n.t('components.xpub_import_form.derive_button') || 'Derive Addresses'}
			loadingLabel={i18n.t('components.xpub_import_form.deriving', {
				progress: Math.round(generationProgress)
			}) || `Deriving... ${Math.round(generationProgress)}%`}
			isLoading={isGenerating}
			onclick={onGenerate}
		/>
	{/if}
</div>

<style>
	.form-label {
		display: block;
		font-size: var(--text-sm);
		font-weight: var(--font-semibold);
		color: var(--gray-700);
		margin-bottom: var(--space-2);
	}
	:global([data-theme='dark']) .form-label {
		color: var(--gray-300);
	}

	.form-hint {
		font-size: var(--text-sm);
		color: var(--gray-600);
		margin: var(--space-2) 0 0 0;
	}
	:global([data-theme='dark']) .form-hint {
		color: var(--gray-400);
	}
</style>

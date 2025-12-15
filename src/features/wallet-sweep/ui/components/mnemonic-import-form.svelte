<script lang="ts">
	import type { DerivationPathType } from '@/features/wallet-sweep/types/wallet';
	import { validateMnemonicPhrase } from '@/features/wallet-sweep/utils/wallet-import';
	import SimpleCodeEditor from '$lib/components/widgets/SimpleCodeEditor.svelte';
	import AddressPathSelector from '$lib/components/ui/address-path-selector.svelte';
	import ProgressButton from '$lib/components/ui/progress-button.svelte';
	import { slide } from 'svelte/transition';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	interface Props {
		mnemonicText: string;
		pathType: DerivationPathType;
		startIndex: number;
		endIndex: number;
		startYear: number;
		endYear: number;
		includeMonth: boolean;
		includeDay: boolean;
		useLeadingZeros: boolean;
		isGenerating: boolean;
		generationProgress: number;
		onGenerate: () => void;
	}

	let {
		mnemonicText = $bindable(),
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

	// Check if mnemonic is valid for showing derivation path options
	const isMnemonicValid = $derived(
		mnemonicText.trim().length > 0 && validateMnemonicPhrase(mnemonicText.trim())
	);
</script>

<div transition:slide>
	<!-- <div class="form-label">{i18n.t('tools.wallet_sweep.step4.content.mnemonic.label')}</div> -->
	<SimpleCodeEditor
		bind:value={mnemonicText}
		placeholder={i18n.t('tools.wallet_sweep.step4.content.mnemonic.placeholder')}
		rows={6}
	/>
	<p class="form-hint">{i18n.t('tools.wallet_sweep.step4.content.mnemonic.security_hint')}</p>

	{#if isMnemonicValid}
		<div style="margin-top: var(--space-4);" transition:slide={{ duration: 200 }}>
			<div class="form-label">
				{i18n.t('tools.wallet_sweep.step4.content.mnemonic.derivation_path')}
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
			label={i18n.t('tools.wallet_sweep.step4.content.import_wallets_button')}
			loadingLabel={i18n.t('tools.wallet_sweep.step4.content.mnemonic.generating', {
				progress: Math.round(generationProgress)
			})}
			isLoading={isGenerating}
			progress={generationProgress}
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

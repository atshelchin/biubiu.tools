<script lang="ts">
	import type { DerivationPathType } from '@/features/token-sweep/types/wallet';
	import SimpleCodeEditor from '$lib/components/widgets/SimpleCodeEditor.svelte';
	import AddressPathSelector from '$lib/components/ui/address-path-selector.svelte';
	import { Loader2 } from '@lucide/svelte';
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
</script>

<div class="form-section" transition:slide>
	<div class="form-label">{i18n.t('tools.token_sweep.step4.content.mnemonic.label')}</div>
	<SimpleCodeEditor
		bind:value={mnemonicText}
		placeholder={i18n.t('tools.token_sweep.step4.content.mnemonic.placeholder')}
		rows={6}
	/>
	<p class="form-hint">{i18n.t('tools.token_sweep.step4.content.mnemonic.security_hint')}</p>

	<div style="margin-top: var(--space-4);">
		<div class="form-label">
			{i18n.t('tools.token_sweep.step4.content.mnemonic.derivation_path')}
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
			maxAddresses={10000}
		/>
	</div>

	<button
		class="btn-primary btn-with-progress"
		onclick={onGenerate}
		disabled={isGenerating}
		style="width: 100%; margin-top: var(--space-3);"
	>
		{#if isGenerating}
			<Loader2 size={18} class="spinning" />
			{i18n.t('tools.token_sweep.step4.content.mnemonic.generating', {
				progress: Math.round(generationProgress)
			})}
			<div class="btn-progress-bar" style="width: {generationProgress}%"></div>
		{:else}
			{i18n.t('tools.token_sweep.step4.content.mnemonic.generate_button')}
		{/if}
	</button>
</div>

<style>
	.form-section {
		margin-bottom: var(--space-6);
	}

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

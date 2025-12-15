<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import SegmentedControl from '$lib/components/ui/segmented-control.svelte';
	import type { ImportMethod } from '../../types/wallet';

	interface Props {
		selected: ImportMethod;
		onSelect: (method: ImportMethod) => void;
	}

	let { selected = $bindable(), onSelect }: Props = $props();

	const i18n = useI18n();

	const options = $derived([
		{
			value: 'privateKey' as const,
			label: i18n.t('tools.wallet_sweep.step4.import_method.private_key.label')
		},
		{
			value: 'mnemonic' as const,
			label: i18n.t('tools.wallet_sweep.step4.import_method.mnemonic.label')
		}
	]);

	function handleValueChange(value: ImportMethod) {
		selected = value;
		onSelect(value);
	}
</script>

<SegmentedControl {options} bind:value={selected} onValueChange={handleValueChange} />

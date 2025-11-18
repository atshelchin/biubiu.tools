<script lang="ts">
	import StepSidebar from '$lib/components/step/step-sidebar.svelte';
	import CheckSummary from '$lib/components/ui/check-summary.svelte';
	import { step2State } from '@/features/token-sweep/stores/step2-state.svelte';
	import { useStepManager } from '@/lib/components/ui/step-context.svelte';

	import { useConnectStore } from '@/lib/stores/connect.svelte';
	import WalletConnectButton from '@/lib/components/ui/wallet-connect-button.svelte';

	// Use $derived for easier access in template
	let summary = $derived(step2State.summary);

	const connectStore = useConnectStore();

	// Get current network
	const currentNetwork = $derived(
		connectStore.currentChainId
			? connectStore.networks.find((n) => n.chainId === connectStore.currentChainId)
			: undefined
	);
</script>

<StepSidebar stepNumber={2} title="" description="">
	<WalletConnectButton
		selectedChainId={connectStore.currentChainId ?? 1}
		selectedNetwork={currentNetwork}
		class="wallet-section"
	/>

	{#if summary}
		<CheckSummary {summary} />
	{/if}
</StepSidebar>

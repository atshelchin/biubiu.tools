<script lang="ts">
	import { useConnectStore } from '$lib/stores/connect.svelte.js';
	import type { StepManager } from '@/lib/components/ui/step-indicator.svelte';
	import StepFooter from '@/features/token-sweep/ui/components/step-footer.svelte';

	interface Props {
		stepManager?: StepManager;
	}

	let { stepManager }: Props = $props();

	const connectStore = useConnectStore();

	// This needs to track the same selectedChainId as content
	// We'll use connectStore.currentChainId which is set after connection
	const isReadyToContinue = $derived(
		connectStore.isConnected && connectStore.currentChainId !== null
	);

	// Handle continue to next step
	function handleContinue() {
		if (stepManager && isReadyToContinue) {
			stepManager.next();
		}
	}
</script>

<StepFooter
	canContinue={isReadyToContinue}
	continueText="Continue to Configuration"
	onContinue={handleContinue}
	hint="Connect your wallet to continue"
	continueButtonClass="footer-continue-btn"
/>

<style>
	/* Footer Continue Button */
	:global(.footer-continue-btn) {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--space-2);
		width: 100%;
		padding: var(--space-3) var(--space-4);
		background: hsl(120, 60%, 50%);
		color: white;
		border: none;
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global(.footer-continue-btn:hover) {
		background: hsl(120, 60%, 45%);
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(120, 60%, 50%, 0.3);
	}
</style>

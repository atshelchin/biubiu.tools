<script lang="ts">
	interface Props {
		chainId: number;
		size?: number;
		class?: string;
	}

	let { chainId, size = 32, class: className = '' }: Props = $props();

	// Use derived state so it always recalculates when chainId changes
	const iconUrl = $derived(`/images/chain-logo/evm_${chainId}.png`);
	const fallbackUrl = $derived('/images/chain-logo/unknown.png');

	let hasError = $state(false);
	let currentChainId = $state(chainId);

	// Reset error state when chainId changes
	$effect(() => {
		if (currentChainId !== chainId) {
			hasError = false;
			currentChainId = chainId;
		}
	});

	function handleError() {
		if (!hasError) {
			hasError = true;
		}
	}
</script>

<img
	src={hasError ? fallbackUrl : iconUrl}
	alt={`Chain ${chainId}`}
	width={size}
	height={size}
	class={`network-icon ${className}`}
	onerror={handleError}
/>

<style>
	.network-icon {
		border-radius: 50%;
		object-fit: cover;
		background: var(--color-muted);
	}
</style>

<script lang="ts">
	interface Props {
		chainId: number;
		size?: number;
		class?: string;
	}

	let { chainId, size = 32, class: className = '' }: Props = $props();

	let iconUrl = $state(`/images/chain-logo/evm_${chainId}.png`);
	let hasError = $state(false);

	function handleError() {
		if (!hasError) {
			hasError = true;
			iconUrl = '/images/chain-logo/unknown.png';
		}
	}
</script>

<img
	src={iconUrl}
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

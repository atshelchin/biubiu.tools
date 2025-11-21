<script lang="ts">
	import type { Token } from '$lib/types/token';

	interface Props {
		token: Token;
		size?: number;
	}

	let { token, size = 36 }: Props = $props();

	let logoError = $state(false);

	function getTokenLogo(token: Token): string | null {
		if (logoError) return null;
		if (token.logoUrl) return token.logoUrl;
		return `/token-logo/${token.symbol}.svg`;
	}

	function handleLogoError() {
		logoError = true;
	}

	// Generate deterministic color from symbol
	function getSymbolColor(symbol: string): string {
		let hash = 0;
		for (let i = 0; i < symbol.length; i++) {
			hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = Math.abs(hash % 360);
		return `hsl(${hue}, 65%, 55%)`;
	}

	function getSymbolInitials(symbol: string): string {
		return symbol.slice(0, 2).toUpperCase();
	}

	const logo = $derived(getTokenLogo(token));
</script>

{#if logo}
	<img
		src={logo}
		alt={token.symbol}
		class="token-avatar"
		style="width: {size}px; height: {size}px;"
		onerror={handleLogoError}
	/>
{:else}
	<div
		class="token-avatar token-avatar-fallback"
		style="width: {size}px; height: {size}px; background-color: {getSymbolColor(token.symbol)};"
	>
		<span>{getSymbolInitials(token.symbol)}</span>
	</div>
{/if}

<style>
	.token-avatar {
		border-radius: 50%;
		object-fit: cover;
		background: var(--gray-100);
	}

	:global([data-theme='dark']) .token-avatar {
		background: var(--gray-700);
	}

	.token-avatar-fallback {
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}
</style>

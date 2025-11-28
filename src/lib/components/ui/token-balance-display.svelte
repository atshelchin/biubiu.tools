<script lang="ts">
	/**
	 * TokenBalanceDisplay Component
	 * Displays token balance with smart number formatting:
	 * - Large numbers are abbreviated with K/M/B/T suffixes
	 * - Supports different display modes (compact, full)
	 * - Customizable styling via props
	 */

	interface Props {
		/** Balance in smallest unit (wei, satoshi, etc.) */
		balance: bigint;
		/** Token decimals (e.g., 18 for ETH, 6 for USDC) */
		decimals: number;
		/** Display mode: 'compact' shows K/M/B, 'full' shows all digits */
		mode?: 'compact' | 'full';
		/** Optional symbol to display after number */
		symbol?: string;
		/** Custom CSS class for styling */
		class?: string;
	}

	let { balance, decimals, mode = 'compact', symbol, class: className }: Props = $props();

	/**
	 * Format number with K/M/B/T suffixes for large values
	 */
	function formatLargeNumber(num: number): string {
		const absNum = Math.abs(num);

		if (absNum >= 1e12) {
			return (num / 1e12).toFixed(2) + 'T'; // Trillion
		} else if (absNum >= 1e9) {
			return (num / 1e9).toFixed(2) + 'B'; // Billion
		} else if (absNum >= 1e6) {
			return (num / 1e6).toFixed(2) + 'M'; // Million
		} else if (absNum >= 1e3) {
			return (num / 1e3).toFixed(2) + 'K'; // Thousand
		}

		// For numbers less than 1000, show with appropriate decimal places
		if (absNum >= 100) {
			return num.toFixed(2);
		} else if (absNum >= 1) {
			return num.toFixed(4);
		} else if (absNum > 0) {
			return num.toFixed(8);
		}

		return '0';
	}

	/**
	 * Format number with full precision and thousand separators
	 */
	function formatFullNumber(num: number): string {
		return num.toLocaleString(undefined, {
			minimumFractionDigits: 2,
			maximumFractionDigits: 8
		});
	}

	// Convert balance from smallest unit to human-readable number
	let numericBalance = $derived(Number(balance) / Math.pow(10, decimals));

	// Format based on mode
	let formattedBalance = $derived(
		mode === 'compact' ? formatLargeNumber(numericBalance) : formatFullNumber(numericBalance)
	);

	// Combine formatted number with optional symbol
	let displayText = $derived(symbol ? `${formattedBalance} ${symbol}` : formattedBalance);
</script>

<span class="token-balance-display {className}" title={formatFullNumber(numericBalance)}>
	{displayText}
</span>

<style>
	.token-balance-display {
		font-family: var(--font-mono, 'Monaco', 'Courier New', monospace);
		font-variant-numeric: tabular-nums;
	}
</style>

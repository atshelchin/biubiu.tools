<script lang="ts">
	/**
	 * ENS Scanner Step 1: Connect Wallet Footer
	 * Uses shared ConnectWalletFooter component
	 * Note: ENS only works on Ethereum mainnet (chainId === 1)
	 */
	import { ConnectWalletFooter } from '$lib/components/step/connect-wallet';
</script>

<ConnectWalletFooter i18nPrefix="ens-scanner" requiredChainId={1} />

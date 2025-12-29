<script lang="ts">
	/**
	 * ENS Scanner Step 1: Connect Wallet Content
	 * Uses shared ConnectWalletContent component
	 * Note: ENS only works on Ethereum mainnet (chainId === 1)
	 */
	import { ConnectWalletContent } from '$lib/components/step/connect-wallet';
</script>

<ConnectWalletContent i18nPrefix="ens-scanner" />

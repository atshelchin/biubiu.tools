<script lang="ts">
	/**
	 * Assets Monitor Step 1: Connect Wallet Sidebar
	 * Uses shared ConnectWalletSidebar component with custom help content
	 */
	import { ConnectWalletSidebar } from '$lib/components/step/connect-wallet';
</script>

<ConnectWalletSidebar i18nPrefix="assets-monitor">
	<div class="features">
		<ul>
			<li>📊 Track all asset movements</li>
			<li>🔍 Deep transaction analysis</li>
			<li>💾 Store results locally</li>
		</ul>
	</div>
</ConnectWalletSidebar>

<style>
	.features {
		padding: var(--space-4);
	}
	.features ul {
		list-style: none;
		padding: 0;
	}
	.features li {
		padding: var(--space-2) 0;
	}
</style>

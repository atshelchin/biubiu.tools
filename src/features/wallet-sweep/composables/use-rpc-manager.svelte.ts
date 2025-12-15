import { useConnectStore } from '$lib/stores/connect.svelte.js';

export function useRpcManager() {
	const connectStore = useConnectStore();

	// State
	let showRpcManager = $state(false);

	// Get current network
	function getCurrentNetwork() {
		return connectStore.networks.find((n) => n.chainId === connectStore.currentChainId);
	}

	function openRpcManager() {
		showRpcManager = true;
	}

	function closeRpcManager() {
		showRpcManager = false;
	}

	function saveRpcEndpoints(rpcEndpoints: { url: string; isPrimary: boolean }[]) {
		const currentNetwork = getCurrentNetwork();
		if (currentNetwork) {
			currentNetwork.rpcEndpoints = rpcEndpoints;
			connectStore.updateNetworkRpc(currentNetwork.chainId, rpcEndpoints);
		}
	}

	return {
		// State getters
		get showRpcManager() {
			return showRpcManager;
		},
		set showRpcManager(value: boolean) {
			showRpcManager = value;
		},
		get currentChainId() {
			return connectStore.currentChainId;
		},
		get currentNetwork() {
			return getCurrentNetwork();
		},

		// Actions
		openRpcManager,
		closeRpcManager,
		saveRpcEndpoints
	};
}

export type RpcManagerInstance = ReturnType<typeof useRpcManager>;

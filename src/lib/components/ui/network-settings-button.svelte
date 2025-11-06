<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Settings } from 'lucide-svelte';
	import IconButton from './icon-button.svelte';
	import NetworkSettingsModal from './network-settings-modal.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	interface Props {
		variant?: 'default' | 'primary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
	}

	let { variant = 'ghost', size = 'sm' }: Props = $props();

	let showNetworkSettings = $state(false);

	function handleOpenSettings() {
		showNetworkSettings = true;
	}

	function handleCloseSettings() {
		showNetworkSettings = false;
	}
</script>

<IconButton
	icon={Settings}
	label={i18n.t('tools.actions.settings')}
	tooltip={i18n.t('tools.actions.settings_tooltip')}
	{variant}
	{size}
	onclick={handleOpenSettings}
/>

<NetworkSettingsModal
	open={showNetworkSettings}
	networks={connectStore.networks}
	currentChainId={connectStore.currentChainId}
	onClose={handleCloseSettings}
	onToggleNetwork={connectStore.toggleNetwork}
	isNetworkEnabled={connectStore.isNetworkEnabled}
	onSaveNetwork={connectStore.updateNetworkRpc}
	onAddOrUpdateNetwork={connectStore.addOrUpdateNetwork}
/>

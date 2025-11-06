<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';
	import { Share2 } from 'lucide-svelte';
	import IconButton from './icon-button.svelte';
	import ReferralModal from './referral-modal.svelte';
	import { useConnectStore } from '$lib/stores/connect.svelte';

	const i18n = useI18n();
	const connectStore = useConnectStore();

	interface Props {
		variant?: 'default' | 'primary' | 'ghost' | 'danger';
		size?: 'sm' | 'md' | 'lg';
	}

	let { variant = 'ghost', size = 'sm' }: Props = $props();

	let showReferralModal = $state(false);

	function handleOpenReferral() {
		showReferralModal = true;
	}

	function handleCloseReferral() {
		showReferralModal = false;
	}
</script>

<IconButton
	icon={Share2}
	label={i18n.t('referral.title')}
	tooltip={i18n.t('referral.title')}
	{variant}
	{size}
	onclick={handleOpenReferral}
/>

<ReferralModal
	open={showReferralModal}
	onClose={handleCloseReferral}
	walletAddress={connectStore.address ?? null}
	isConnected={connectStore.isConnected}
	onConnectWallet={connectStore.openConnectorModal}
/>

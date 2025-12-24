<script lang="ts">
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n';
	import { ListIcon } from '@lucide/svelte';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import { stepComponents } from '@/features/token-deployer/ui/steps';
	import NetworkSettingsButton from '$lib/components/ui/network-settings-button.svelte';
	import ReferralButton from '$lib/components/ui/referral-button.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const i18n = useI18n();
</script>

<StepBasedApp
	config={{
		meta: data.meta,
		structuredData: data.structuredData,
		steps: data.steps,
		appTitle: i18n.t('token-deployer.title'),
		appDescription: i18n.t('token-deployer.description'),
		walletConnect: {
			chains: [mainnet, base, bsc, polygon, arbitrum, optimism],
			storageKey: 'biubiu-tools-token-deployer'
		},
		stepComponents
	}}
>
	{#snippet toolbarActions()}
		<a href="/apps/token-deployer/deployed" class="deployed-tokens-link">
			<ListIcon size={16} />
			<span>View Deployed</span>
		</a>
		<NetworkSettingsButton variant="ghost" size="sm" />
		<ReferralButton variant="ghost" size="sm" />
	{/snippet}
</StepBasedApp>

<style>
	.deployed-tokens-link {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		background: linear-gradient(135deg, hsl(210, 100%, 50%), hsl(210, 100%, 40%));
		color: white;
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		text-decoration: none;
		transition: all 0.2s ease;
		box-shadow: 0 2px 8px hsla(210, 100%, 50%, 0.2);
	}

	.deployed-tokens-link:hover {
		transform: translateY(-1px);
		box-shadow: 0 4px 12px hsla(210, 100%, 50%, 0.3);
	}
</style>

<script lang="ts">
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import PageLayout from '$lib/components/page-layout.svelte';
	import AppTitle from '$lib/components/ui/app-title.svelte';
	import NetworkSettingsButton from '$lib/components/ui/network-settings-button.svelte';
	import ReferralButton from '$lib/components/ui/referral-button.svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import StepIndicator, { createStepManager } from '$lib/components/ui/step-indicator.svelte';
	import StepControls from '$lib/components/ui/step-controls.svelte';
	import { Step1Connect, Step2Configure, Step3Complete } from '@/features/token-sweep/ui';
	import { initializeReferral } from '$lib/utils/referral';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Structured data for Google rich snippets - WebApplication
	const webAppData = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Token Sweep',
		applicationCategory: 'FinanceApplication',
		operatingSystem: 'Web Browser',
		description:
			'Efficiently sweep and consolidate multiple ERC20 tokens across wallets. Support for Ethereum, Polygon, BSC, Arbitrum, Optimism, and Base networks.',
		url: data.meta.canonical,
		author: {
			'@type': 'Organization',
			name: 'BiuBiu Tools',
			url: 'https://biubiu.tools'
		},
		offers: {
			'@type': 'Offer',
			price: '0',
			priceCurrency: 'USD'
		},
		aggregateRating: {
			'@type': 'AggregateRating',
			ratingValue: '4.8',
			ratingCount: '127'
		},
		featureList: [
			'Batch transfer ERC20 tokens',
			'Multi-network support (Ethereum, Polygon, BSC, Arbitrum, Optimism, Base)',
			'Gas optimization',
			'Secure wallet integration',
			'Real-time transaction tracking'
		]
	};

	// HowTo Schema - Shows step-by-step guide in Google search results
	const howToData = {
		'@context': 'https://schema.org',
		'@type': 'HowTo',
		name: 'How to Batch Transfer ERC20 Tokens with Token Sweep',
		description:
			'Step-by-step guide to sweep and consolidate multiple ERC20 tokens across wallets using BiuBiu Token Sweep tool.',
		image: data.meta.image,
		totalTime: 'PT5M', // ISO 8601 duration (5 minutes)
		estimatedCost: {
			'@type': 'MonetaryAmount',
			currency: 'USD',
			value: '0'
		},
		tool: [
			{
				'@type': 'HowToTool',
				name: 'Web3 Wallet (MetaMask, WalletConnect, etc.)'
			},
			{
				'@type': 'HowToTool',
				name: 'ERC20 Tokens to transfer'
			}
		],
		step: [
			{
				'@type': 'HowToStep',
				position: 1,
				name: 'Connect Your Wallet',
				text: 'Click the "Connect Wallet" button and select your preferred Web3 wallet provider (MetaMask, WalletConnect, Coinbase Wallet, etc.). Approve the connection request in your wallet.',
				url: data.meta.canonical + '#step-1',
				image: data.meta.image
			},
			{
				'@type': 'HowToStep',
				position: 2,
				name: 'Configure Token Transfer',
				text: 'Select the blockchain network (Ethereum, Polygon, BSC, Arbitrum, Optimism, or Base). Choose which ERC20 tokens to transfer and enter the destination wallet address. Review gas estimates and approve the transaction settings.',
				url: data.meta.canonical + '#step-2',
				image: data.meta.image
			},
			{
				'@type': 'HowToStep',
				position: 3,
				name: 'Complete Transfer',
				text: 'Review the transaction summary including total tokens, gas fees, and destination address. Click "Execute Transfer" and confirm the transaction in your wallet. Wait for blockchain confirmation and view the transaction receipt.',
				url: data.meta.canonical + '#step-3',
				image: data.meta.image
			}
		]
	};

	// Combine both schemas
	const structuredData = [webAppData, howToData];

	// 创建步骤管理器
	const stepManager = createStepManager([
		{ label: 'Connect Wallet', description: 'Link your Web3 wallet' },
		{ label: 'Check Dependencies', description: 'Verify network and contracts' },
		{ label: 'Complete', description: 'Finish setup' }
	]);

	// 初始化 wallet connect store，配置此 app 需要的 chains
	createConnectStore({
		projectId: 'e68249e217c8793807b7bb961a2f4297',
		appName: 'BiuBiu Tools',
		appUrl: 'https://biubiu.tools',
		appLogoUrl: 'https://biubiu.tools/logo.svg',
		chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
		storageKey: 'biubiu-tools-token-sweep'
	});

	// 初始化推荐系统
	onMount(() => {
		initializeReferral();
	});
</script>

<!-- SEO Optimization -->
<SeoHead
	title={data.meta.title}
	description={data.meta.description}
	keywords={data.meta.keywords}
	canonical={data.meta.canonical}
	type={data.meta.type}
	image={data.meta.image}
	locale={data.meta.locale}
	{structuredData}
/>

<PageLayout>
	{#snippet toolbar()}
		<div class="toolbar-content">
			<AppTitle
				title={i18n.t('tools.token_sweep.title')}
				description={i18n.t('tools.token_sweep.description')}
			/>
			<div class="toolbar-actions">
				<NetworkSettingsButton variant="ghost" size="sm" />
				<ReferralButton variant="ghost" size="sm" />
			</div>
		</div>
	{/snippet}

	{#snippet sidebar()}
		{#if stepManager.currentStep === 1}
			<Step1Connect section="sidebar" {stepManager} />
		{:else if stepManager.currentStep === 2}
			<Step2Configure section="sidebar" {stepManager} />
		{:else if stepManager.currentStep === 3}
			<Step3Complete section="sidebar" />
		{/if}
	{/snippet}

	{#snippet footer()}
		{#if stepManager.currentStep === 1}
			<Step1Connect section="footer" />
		{:else if stepManager.currentStep === 2}
			<Step2Configure section="footer" />
		{:else if stepManager.currentStep === 3}
			<Step3Complete section="footer" />
		{/if}
	{/snippet}

	<!-- 主要内容 -->
	<div class="page-content">
		<StepIndicator manager={stepManager} />
		{#if typeof window !== 'undefined' && window.location.hostname === 'localhost'}
			<StepControls manager={stepManager} />
		{/if}

		{#if stepManager.currentStep === 1}
			<Step1Connect section="content" {stepManager} />
		{:else if stepManager.currentStep === 2}
			<Step2Configure section="content" {stepManager} />
		{:else if stepManager.currentStep === 3}
			<Step3Complete section="content" />
		{/if}
	</div>
</PageLayout>

<style>
	.page-content :global(.step-controls) {
		margin: var(--space-6) 0;
	}

	/* Toolbar styles */
	.toolbar-content {
		position: relative;
		min-height: 60px;
		padding-right: var(--space-20);
	}

	.toolbar-actions {
		position: absolute;
		top: var(--space-2);
		right: var(--space-2);
		display: flex;
		gap: var(--space-2);
	}

	@media (max-width: 768px) {
		.toolbar-content {
			padding-right: 0;
			min-height: auto;
		}

		.toolbar-actions {
			position: static;
			width: 100%;
			flex-wrap: wrap;
			margin-top: var(--space-3);
		}
	}
</style>

<script lang="ts" module>
	import type { Snippet, Component } from 'svelte';
	import type { Chain } from 'viem';
	import type { HowToStepData } from '@/features/token-sweep/utils/structured-data';

	// Generic component type for step components
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type StepComponent = Component<any, any>;

	export interface StepBasedAppConfig {
		// SEO and meta data
		meta: {
			title: string;
			description: string;
			keywords: string;
			canonical: string;
			type: 'website';
			image: string;
			locale: string;
		};
		structuredData: Record<string, unknown>[];

		// Step configuration
		steps: HowToStepData[];

		// App-specific configuration
		appTitle: string;
		appDescription: string;

		// Wallet connect configuration (optional)
		walletConnect?: {
			chains: Chain[];
			storageKey: string;
		};

		// Step components mapping
		stepComponents: {
			readonly sidebar: readonly StepComponent[];
			readonly content: readonly StepComponent[];
			readonly footer: readonly StepComponent[];
		};
	}
</script>

<script lang="ts">
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { createConnectConfig } from '$lib/utils/connect-config';
	import PageLayout from '$lib/components/page-layout.svelte';
	import AppTitle from '$lib/components/ui/app-title.svelte';
	import NetworkSettingsButton from '$lib/components/ui/network-settings-button.svelte';
	import ReferralButton from '$lib/components/ui/referral-button.svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import StepIndicator, { createStepManager } from '$lib/components/ui/step-indicator.svelte';
	import StepControls from '$lib/components/ui/step-controls.svelte';

	interface Props {
		config: StepBasedAppConfig;
		toolbarActions?: Snippet;
	}

	let { config, toolbarActions }: Props = $props();

	// Initialize wallet connect if configured
	if (config.walletConnect) {
		createConnectStore(
			createConnectConfig({
				chains: config.walletConnect.chains,
				storageKey: config.walletConnect.storageKey
			})
		);
	}

	// Create step manager from steps config (auto-sets context internally)
	const stepManager = createStepManager(
		config.steps.map((step) => ({
			label: step.name,
			description: step.description
		}))
	);

	// Get current step components
	const SidebarComponent = $derived(config.stepComponents.sidebar[stepManager.currentStep - 1]);
	const ContentComponent = $derived(config.stepComponents.content[stepManager.currentStep - 1]);
	const FooterComponent = $derived(config.stepComponents.footer[stepManager.currentStep - 1]);
</script>

<!-- SEO Optimization -->
<SeoHead
	title={config.meta.title}
	description={config.meta.description}
	keywords={config.meta.keywords}
	canonical={config.meta.canonical}
	type={config.meta.type}
	image={config.meta.image}
	locale={config.meta.locale}
	structuredData={config.structuredData}
/>

<PageLayout>
	{#snippet toolbar()}
		<div class="toolbar-content">
			<AppTitle title={config.appTitle} description={config.appDescription} />
			<div class="toolbar-actions">
				{#if toolbarActions}
					{@render toolbarActions()}
				{:else}
					<!-- Default toolbar actions -->
					<NetworkSettingsButton variant="ghost" size="sm" />
					<ReferralButton variant="ghost" size="sm" />
				{/if}
			</div>
		</div>
	{/snippet}

	{#snippet sidebar()}
		<SidebarComponent />
	{/snippet}

	{#snippet footer()}
		<FooterComponent />
	{/snippet}

	<!-- Main content -->
	<div class="page-content">
		<StepIndicator manager={stepManager} />
		{#if typeof window !== 'undefined' && window.location.hostname === 'localhost'}
			<StepControls manager={stepManager} />
		{/if}
		<ContentComponent />
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

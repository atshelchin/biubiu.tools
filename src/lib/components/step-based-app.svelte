<script lang="ts" module>
	import type { Snippet, Component } from 'svelte';
	import type { Chain } from 'viem';
	import type { Step } from '$lib/components/ui/step-indicator.svelte';
	import type { FAQ } from '$lib/components/ui/faqs.svelte';
	import type { ToolStatus } from '$lib/components/ui/status-badge.svelte';

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

		// Step configuration with i18n keys or direct values
		steps: Step[];
		// Whether to treat step label/description as i18n keys (default: true)
		useI18nKeys?: boolean;

		// App-specific configuration
		appTitle: string;
		appDescription: string;

		// Tool status configuration (optional, defaults to 'beta')
		status?: ToolStatus;
		// Unique key for the tool (used for localStorage to remember notice dismissal)
		toolKey?: string;

		// FAQs configuration (optional)
		faqs?: {
			title?: string;
			items: FAQ[];
		};

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
	import StepIndicator, {
		createStepManager,
		type StepManager
	} from '$lib/components/ui/step-indicator.svelte';
	import StepControls from '$lib/components/ui/step-controls.svelte';
	import Faqs from '$lib/components/ui/faqs.svelte';
	import StatusBadge from '$lib/components/ui/status-badge.svelte';
	import DevelopmentNotice from '$lib/components/ui/development-notice.svelte';
	import { useI18n } from '@shelchin/i18n';

	interface Props {
		config: StepBasedAppConfig;
		toolbarActions?: Snippet;
		/** Initial step to start on (1-based, defaults to 1) */
		initialStep?: number;
		/** Callback when step manager is created, allows parent to access goTo() etc. */
		onStepManagerReady?: (manager: StepManager) => void;
	}

	let { config, toolbarActions, initialStep = 1, onStepManagerReady }: Props = $props();

	const i18n = useI18n();

	// Always create connect store for WalletConnectorModal in PageLayout
	// Uses custom config if provided, otherwise uses default config
	const store = createConnectStore(
		createConnectConfig({
			chains: config.walletConnect?.chains ?? [],
			storageKey: config.walletConnect?.storageKey ?? 'biubiu-tools-wallet',
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			i18n: i18n as any
		})
	);
	// Initialize the store to load networks and set up wallet detection
	store.initialize();

	// Create step manager from steps config with i18n keys (auto-sets context internally)
	const stepManager = createStepManager(config.steps, initialStep, config.useI18nKeys ?? false);

	// Notify parent when step manager is ready
	if (onStepManagerReady) {
		onStepManagerReady(stepManager);
	}

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
			<div class="title-with-status">
				<AppTitle title={config.appTitle} description={config.appDescription} />
				{#if config.status}
					<StatusBadge status={config.status} />
				{/if}
			</div>
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
		{#if config.faqs && config.faqs.items.length > 0}
			<Faqs faqs={config.faqs.items} title={config.faqs.title} />
		{/if}
	{/snippet}

	<!-- Main content -->
	<div class="page-content">
		{#if config.status}
			<DevelopmentNotice status={config.status} storageKey={config.toolKey} />
		{/if}

		<div style="padding-bottom:16px">
			<StepIndicator manager={stepManager} />
		</div>

		{#if typeof window !== 'undefined' && window.location.hostname === 'localhost'}
			<StepControls manager={stepManager} />
		{/if}

		<ContentComponent />
	</div>
	<FooterComponent />
</PageLayout>

<style>
	.page-content {
		padding-bottom: 80px; /* Reserve space for footer */
		min-height: 600px; /* Ensure enough height for absolute positioning */
	}

	.page-content :global(.step-controls) {
		margin: var(--space-6) 0;
	}

	/* Toolbar styles */
	.toolbar-content {
		position: relative;
		min-height: 60px;
		padding-right: var(--space-20);
	}

	.title-with-status {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
	}

	.title-with-status :global(.status-badge) {
		margin-top: var(--space-1);
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

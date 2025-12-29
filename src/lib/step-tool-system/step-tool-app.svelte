<script lang="ts">
	/**
	 * Feature App Component
	 *
	 * A wrapper component that renders a feature based on its definition.
	 * This simplifies route pages by handling all the common setup.
	 *
	 * Usage in route pages:
	 * - Import FeatureApp and your feature definition
	 * - Pass feature, meta, and structuredData from page data
	 */
	import { useI18n } from '@shelchin/i18n';
	import StepBasedApp from '$lib/components/step-based-app.svelte';
	import type { StepToolDefinition, FAQItem } from './types';
	import type { StepManager } from '$lib/components/ui/step-indicator.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Step tool definition */
		feature: StepToolDefinition;
		/** SEO meta data from page load */
		meta: {
			title: string;
			description: string;
			keywords: string;
			canonical: string;
			type: 'website';
			image: string;
			locale: string;
		};
		/** Structured data for SEO */
		structuredData: Record<string, unknown>[];
		/** Initial step (1-based, defaults to 1) */
		initialStep?: number;
		/** Callback when step manager is ready */
		onStepManagerReady?: (manager: StepManager) => void;
		/** Custom toolbar actions (optional) */
		toolbarActions?: Snippet;
	}

	let {
		feature,
		meta,
		structuredData,
		initialStep = 1,
		onStepManagerReady,
		toolbarActions
	}: Props = $props();

	const i18n = useI18n();

	// Build FAQs from i18n if faqsPrefix is provided
	const faqs = $derived.by(() => {
		if (!feature.faqsPrefix) return [];

		const faqItems: FAQItem[] = [];
		// Try to get FAQs from common patterns
		const faqKeys = getFaqKeysForFeature();

		for (const key of faqKeys) {
			const questionKey = `${feature.faqsPrefix}.${key}`;
			const answerKey = `${feature.faqsPrefix}.${key}_explanation`;

			// Check if the translation exists (not returning the key itself)
			const question = i18n.t(questionKey as never);
			const answer = i18n.t(answerKey as never);

			if (question !== questionKey && answer !== answerKey) {
				faqItems.push({ question, answer });
			}
		}

		return faqItems;
	});

	// Common FAQ key patterns (can be extended per feature)
	function getFaqKeysForFeature(): string[] {
		// These are common FAQ key patterns across features
		const commonKeys = [
			'what_is_create2',
			'what_is_deterministic',
			'what_is_bytecode',
			'what_is_abi',
			'what_is_salt',
			'what_is_network',
			'what_is_wallet',
			'what_is_native_token',
			'can_select_multiple_tokens',
			'what_happens_zero_balance',
			'what_tokens_supported',
			'how_add_custom_token',
			'what_is_eip7702',
			'why_need_eip7702',
			'what_is_create2_proxy',
			'what_is_multicall3',
			'what_is_biubiu_premium',
			'what_is_wallet_sweep',
			'what_is_balance_checker',
			'how_many_addresses',
			'is_it_free',
			'what_is_multicall',
			'can_export_results',
			'what_networks_supported'
		];

		return commonKeys;
	}
</script>

<StepBasedApp
	{initialStep}
	{onStepManagerReady}
	{toolbarActions}
	config={{
		meta,
		structuredData,
		steps: feature.steps,
		useI18nKeys: true,
		appTitle: i18n.t(`${feature.i18nPrefix}.title` as never),
		appDescription: i18n.t(`${feature.i18nPrefix}.description` as never),
		faqs:
			faqs.length > 0
				? {
						title: i18n.t('common.faqs' as never),
						items: faqs
					}
				: undefined,
		walletConnect: feature.walletConnect,
		stepComponents: feature.stepComponents
	}}
/>

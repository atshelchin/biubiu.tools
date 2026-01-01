<script lang="ts">
	import { useI18n } from '@shelchin/i18n';
	import { ArrowLeft } from '@lucide/svelte';
	import SeoHead from '$lib/components/seo-head.svelte';
	import Faqs from '$lib/components/ui/faqs.svelte';
	import ToolDetailHero from '@/features/chain-tools/components/tool-detail-hero.svelte';
	import ToolDetailOverview from '@/features/chain-tools/components/tool-detail-overview.svelte';
	import ToolDetailFeatures from '@/features/chain-tools/components/tool-detail-features.svelte';
	import ToolDetailUseCases from '@/features/chain-tools/components/tool-detail-use-cases.svelte';
	import ToolDetailInfo from '@/features/chain-tools/components/tool-detail-info.svelte';
	import ToolDetailRelated from '@/features/chain-tools/components/tool-detail-related.svelte';
	import ToolDetailCta from '@/features/chain-tools/components/tool-detail-cta.svelte';
	import { localizeHref } from '$lib/utils/localized-url';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Load tool-specific translations dynamically
	// The translation file is loaded as: routes/apps/chain-tools/tool/{toolId}.json
	// With namespacePrefix: 'routes', the namespace becomes: routes/apps/chain-tools/tool/{toolId}
	const toolI18nPrefix = `routes/apps/chain-tools/tool/${data.tool.id}`;

	// Get SEO data from tool translations
	const seoTitle = $derived(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		i18n.t(`${toolI18nPrefix}.seo.title` as any, {
			defaultValue: `${data.tool.name} | BiuBiu Tools`
		})
	);
	const seoDescription = $derived(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		i18n.t(`${toolI18nPrefix}.seo.description` as any, { defaultValue: '' })
	);
	const seoKeywords = $derived(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		i18n.t(`${toolI18nPrefix}.seo.keywords` as any, { defaultValue: '' })
	);

	// Build FAQ data from translations
	const faqs = $derived.by(() => {
		const faqList: Array<{ question: string; answer: string }> = [];
		for (let i = 1; i <= data.detail.faqCount; i++) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const question = i18n.t(`${toolI18nPrefix}.faqs.${i}.question` as any, { defaultValue: '' });
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const answer = i18n.t(`${toolI18nPrefix}.faqs.${i}.answer` as any, { defaultValue: '' });
			if (question && answer) {
				faqList.push({ question, answer });
			}
		}
		return faqList;
	});

	// Generate FAQPage structured data
	const faqStructuredData = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map((faq) => ({
			'@type': 'Question',
			name: faq.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: faq.answer
			}
		}))
	});

	// Combined structured data
	const structuredData = $derived([...data.structuredData, faqStructuredData]);

	// UI text with eslint-disable for dynamic i18n keys
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const categoryName = $derived(
		i18n.t(`routes/apps/chain-tools.categories.${data.tool.category}` as any, {
			defaultValue: 'Back'
		})
	);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const faqsTitle = $derived(
		i18n.t('routes/apps/chain-tools.faqs_title' as any, { defaultValue: 'FAQ' })
	);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const lastUpdatedLabel = $derived(
		i18n.t('routes/apps/chain-tools.last_updated' as any, {
			defaultValue: 'Last updated'
		})
	);
</script>

<SeoHead
	title={seoTitle}
	description={seoDescription}
	keywords={seoKeywords}
	canonical={data.meta.canonical}
	type={data.meta.type as 'website' | 'article'}
	image={data.meta.image}
	locale={data.meta.locale}
	{structuredData}
/>

<div class="tool-detail-page">
	<!-- Breadcrumb -->
	<nav class="breadcrumb">
		<a href={localizeHref(`/apps/chain-tools/${data.tool.category}`)} class="back-link">
			<ArrowLeft class="icon" />
			<span>{categoryName}</span>
		</a>
	</nav>

	<!-- Hero Section -->
	<ToolDetailHero tool={data.tool} category={data.category} />

	<!-- Overview Section -->
	<ToolDetailOverview toolId={data.tool.id} i18nPrefix={toolI18nPrefix} />

	<!-- Features Section -->
	<ToolDetailFeatures i18nPrefix={toolI18nPrefix} featureCount={data.detail.featureCount} />

	<!-- Use Cases Section -->
	<ToolDetailUseCases i18nPrefix={toolI18nPrefix} useCaseCount={data.detail.useCaseCount} />

	<!-- Project Info Section -->
	<ToolDetailInfo detail={data.detail} />

	<!-- Related Tools Section -->
	{#if data.relatedToolsData.length > 0}
		<ToolDetailRelated tools={data.relatedToolsData} />
	{/if}

	<!-- FAQs Section -->
	{#if faqs.length > 0}
		<section class="faqs-section">
			<Faqs {faqs} title={faqsTitle} />
		</section>
	{/if}

	<!-- CTA Section -->
	<ToolDetailCta tool={data.tool} i18nPrefix={toolI18nPrefix} />

	<!-- Last Updated -->
	<footer class="page-footer">
		<p class="last-updated">
			{lastUpdatedLabel}:
			{data.detail.lastUpdated}
		</p>
	</footer>
</div>

<style>
	.tool-detail-page {
		max-width: 900px;
		margin: 0 auto;
		padding: var(--space-6);
	}

	/* Breadcrumb */
	.breadcrumb {
		margin-bottom: var(--space-6);
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-description-2);
		text-decoration: none;
		transition: color 0.2s ease;
	}

	.back-link:hover {
		color: var(--color-heading-1);
	}

	.back-link :global(.icon) {
		width: 16px;
		height: 16px;
	}

	/* FAQs Section */
	.faqs-section {
		margin-top: var(--space-10);
		padding-top: var(--space-8);
		border-top: 1px solid var(--color-panel-border-1);
	}

	/* Footer */
	.page-footer {
		margin-top: var(--space-10);
		padding-top: var(--space-5);
		border-top: 1px solid var(--color-panel-border-1);
		text-align: center;
	}

	.last-updated {
		font-size: var(--text-xs);
		color: var(--color-description-3);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.tool-detail-page {
			padding: var(--space-4);
		}

		.breadcrumb {
			margin-bottom: var(--space-4);
		}

		.faqs-section {
			margin-top: var(--space-8);
			padding-top: var(--space-6);
		}

		.page-footer {
			margin-top: var(--space-8);
			padding-top: var(--space-4);
		}
	}
</style>

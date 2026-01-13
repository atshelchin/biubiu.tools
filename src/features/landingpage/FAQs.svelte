<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		ChevronDown,
		HelpCircle,
		MessageCircle,
		Shield,
		Code,
		Zap,
		Rocket
	} from '@lucide/svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { useI18n } from '@shelchin/i18n';

	const i18n = useI18n();
	const t = i18n.t.bind(i18n);

	// FAQ item structure
	interface FAQItem {
		question: string;
		answer: string;
	}

	// FAQ state management
	let openItems = new SvelteSet<number>();

	// Get FAQs dynamically - reactive to language changes
	const faqs = $derived.by(() => {
		const items = t('common.faqs.items') as unknown as FAQItem[];
		return Array.isArray(items) ? items : [];
	});

	// SEO: Inject JSON-LD structured data for FAQ schema
	let jsonLdScript: HTMLScriptElement | null = null;

	onMount(() => {
		updateJsonLd();
	});

	onDestroy(() => {
		if (jsonLdScript) {
			jsonLdScript.remove();
		}
	});

	function updateJsonLd() {
		if (typeof document === 'undefined' || faqs.length === 0) return;

		// Remove existing script if any
		if (jsonLdScript) {
			jsonLdScript.remove();
		}

		// Create and inject JSON-LD script
		const schema = {
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
		};

		jsonLdScript = document.createElement('script');
		jsonLdScript.type = 'application/ld+json';
		jsonLdScript.id = 'faq-json-ld';
		jsonLdScript.textContent = JSON.stringify(schema);
		document.head.appendChild(jsonLdScript);
	}

	// Update JSON-LD when FAQs change (language switch)
	$effect(() => {
		if (faqs.length > 0) {
			updateJsonLd();
		}
	});

	// Toggle FAQ item
	function toggleItem(index: number) {
		if (openItems.has(index)) {
			openItems.delete(index);
		} else {
			openItems.add(index);
		}
	}

	// Category icons for visual interest - map to trust/security/features themes
	// 6 questions: What is, Security, Networks, Testnet, Self-deploy, Help
	const categoryIcons = [Rocket, Shield, Zap, Code, Code, MessageCircle];
</script>

<!-- FAQs section with clean design -->
<section id="faqs" class="faqs-section" aria-labelledby="faqs-title">
	<div class="container">
		<!-- Section header -->
		<header class="section-header">
			<div class="badge">
				<HelpCircle class="badge-icon" />
				<span>{t('common.faqs.badge')}</span>
			</div>

			<h2 id="faqs-title" class="section-title">
				{t('common.faqs.title')}
			</h2>

			<p class="section-subtitle">
				{t('common.faqs.subtitle')}
			</p>
		</header>

		<!-- FAQ items with two columns -->
		<div class="faqs-grid" role="list">
			{#each faqs as faq, index (index)}
				{@const IconComponent = categoryIcons[index % categoryIcons.length]}
				<article
					class="faq-item {openItems.has(index) ? 'expanded' : ''}"
					style="--index: {index};"
					role="listitem"
				>
					<button
						class="faq-trigger"
						onclick={() => toggleItem(index)}
						type="button"
						aria-expanded={openItems.has(index)}
						aria-controls="faq-content-{index}"
					>
						<div class="faq-icon-wrapper">
							<IconComponent class="faq-category-icon" />
						</div>
						<h3 class="faq-question">
							{faq.question}
						</h3>
						<ChevronDown class="arrow-icon {openItems.has(index) ? 'rotated' : ''}" />
					</button>

					<!-- Always render content for SEO, use CSS to show/hide -->
					<div
						id="faq-content-{index}"
						class="faq-content"
						class:hidden={!openItems.has(index)}
						role="region"
					>
						<p class="faq-answer">
							{faq.answer}
						</p>
					</div>
				</article>
			{/each}
		</div>

		<!-- Contact CTA -->
		<aside class="contact-cta" aria-label="Need more help">
			<div class="cta-content">
				<h3 class="cta-title">
					{t('common.faqs.still_questions')}
				</h3>
				<p class="cta-text">
					{t('common.faqs.contact_text')}
				</p>

				<div class="contact-buttons">
					<a
						href="https://t.me/+ABMpMG1islA4NTVl"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary"
					>
						<MessageCircle class="btn-icon" />
						<span>{t('common.faqs.join_telegram')}</span>
					</a>
				</div>
			</div>
		</aside>
	</div>
</section>

<style>
	/* Section layout */
	.faqs-section {
		position: relative;
		padding: var(--space-20) var(--space-6);
		background: var(--color-background);
	}

	.container {
		max-width: 72rem;
		margin: 0 auto;
	}

	/* Section header */
	.section-header {
		text-align: center;
		margin-bottom: var(--space-16);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-4);
		margin-bottom: var(--space-4);
		border-radius: var(--radius-full);
		background: var(--color-panel-2);
		border: 1px solid var(--color-panel-border-1);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
	}

	:global(.badge-icon) {
		width: 1rem;
		height: 1rem;
		color: var(--color-primary);
	}

	/* Title with gradient */
	.section-title {
		font-size: var(--text-4xl);
		font-weight: var(--font-bold);
		line-height: 1.2;
		margin-bottom: var(--space-4);
		background: linear-gradient(to right, var(--color-heading-1), var(--color-muted-foreground));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.section-subtitle {
		max-width: 36rem;
		margin: 0 auto;
		font-size: var(--text-lg);
		line-height: 1.7;
		color: var(--color-description-2);
	}

	/* FAQ grid */
	.faqs-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-4);
		max-width: 48rem;
		margin: 0 auto var(--space-16);
	}

	@media (min-width: 768px) {
		.faqs-grid {
			max-width: none;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--space-6);
		}
	}

	/* FAQ item */
	.faq-item {
		position: relative;
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-1);
		border-radius: var(--radius-lg);
		transition: all 0.2s ease;
		animation: fadeIn 0.5s calc(var(--index) * 0.05s) both;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.faq-item:hover {
		background: var(--color-panel-2);
		border-color: var(--color-border);
		box-shadow: var(--shadow-sm);
	}

	.faq-item.expanded {
		background: var(--color-panel-2);
		border-color: var(--color-primary);
		box-shadow: var(--shadow-md);
	}

	/* FAQ trigger button */
	.faq-trigger {
		width: 100%;
		padding: var(--space-6);
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: flex-start;
		justify-content: flex-start;
		gap: var(--space-4);
		text-align: left;
		transition: all 0.15s ease;
	}

	/* FAQ category icon wrapper */
	.faq-icon-wrapper {
		flex-shrink: 0;
		width: 2.25rem;
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-panel-2), var(--color-panel-3));
		border-radius: var(--radius-md);
		transition: all 0.15s ease;
	}

	.expanded .faq-icon-wrapper {
		background: linear-gradient(135deg, var(--brand-600), var(--brand-700));
	}

	:global(.faq-category-icon) {
		width: 1.125rem;
		height: 1.125rem;
		color: var(--color-muted-foreground);
		transition: color 0.15s ease;
	}

	.expanded :global(.faq-category-icon) {
		color: white;
	}

	.faq-question {
		flex: 1;
		margin: 0;
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		color: var(--color-foreground);
		line-height: 1.5;
	}

	.expanded .faq-question {
		color: var(--color-primary);
	}

	:global(.arrow-icon) {
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--color-description-3);
		transition: transform 0.15s ease;
	}

	:global(.arrow-icon.rotated) {
		transform: rotate(180deg);
		color: var(--color-primary);
	}

	/* FAQ content */
	.faq-content {
		padding: 0 var(--space-6) var(--space-6);
		animation: slideDown 0.15s ease-out;
	}

	.faq-content.hidden {
		display: none;
	}

	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.faq-answer {
		margin: 0;
		padding-top: var(--space-4);
		border-top: 1px solid var(--color-panel-border-1);
		font-size: var(--text-sm);
		line-height: 1.7;
		color: var(--color-muted-foreground);
	}

	/* Contact CTA */
	.contact-cta {
		max-width: 48rem;
		margin: 0 auto;
		padding: var(--space-10);
		background: linear-gradient(135deg, var(--color-panel-1), var(--color-panel-2));
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		text-align: center;
		position: relative;
		overflow: hidden;
	}

	.contact-cta::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		background: linear-gradient(90deg, var(--brand-500), var(--brand-400));
	}

	.cta-content {
		position: relative;
	}

	.cta-title {
		margin-bottom: var(--space-3);
		font-size: var(--text-2xl);
		font-weight: var(--font-semibold);
		background: linear-gradient(135deg, var(--brand-500), var(--brand-400));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.cta-text {
		margin-bottom: var(--space-8);
		font-size: var(--text-base);
		color: var(--color-description-2);
		line-height: 1.6;
	}

	/* Contact buttons */
	.contact-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-4);
	}

	@media (min-width: 640px) {
		.contact-buttons {
			flex-direction: row;
			justify-content: center;
		}
	}

	.btn-primary {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-6);
		border-radius: var(--radius-md);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		text-decoration: none;
		transition: all 0.15s ease;
		background: var(--brand-600);
		color: white;
		border: 1px solid var(--brand-600);
	}

	.btn-primary:hover {
		background: var(--brand-700);
		border-color: var(--brand-700);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	:global(.btn-icon) {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.faqs-section {
			padding: var(--space-24) var(--space-8);
		}

		.section-title {
			font-size: var(--text-5xl);
		}

		.faq-question {
			font-size: var(--text-lg);
		}
	}
</style>

<script lang="ts">
	import { ChevronDown, HelpCircle, MessageCircle, Mail } from '@lucide/svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();
	const t = i18n.t;
	// FAQ item structure
	interface FAQItem {
		question: string;
		answer: string;
	}

	// FAQ state management
	let openItems = new SvelteSet<number>();

	// Get FAQs dynamically
	function getFAQs(): FAQItem[] {
		const items = t('faqs.items') as unknown as FAQItem[];
		return items;
	}

	// Toggle FAQ item
	function toggleItem(index: number) {
		if (openItems.has(index)) {
			openItems.delete(index);
		} else {
			openItems.add(index);
		}
	}
</script>

<!-- FAQs section with clean design -->
<section id="faqs" class="faqs-section">
	<div class="container">
		<!-- Section header -->
		<div class="section-header">
			<div class="badge">
				<HelpCircle class="badge-icon" />
				<span>Common Questions</span>
			</div>

			<h2 class="section-title">
				{t('faqs.title')}
			</h2>

			<p class="section-subtitle">
				{t('faqs.subtitle')}
			</p>
		</div>

		<!-- FAQ items with two columns -->
		<div class="faqs-grid">
			{#each getFAQs() as faq, index (index)}
				<article
					class="faq-item {openItems.has(index) ? 'expanded' : ''}"
					style="--index: {index};"
				>
					<button
						class="faq-trigger"
						onclick={() => toggleItem(index)}
						type="button"
						aria-expanded={openItems.has(index)}
					>
						<h3 class="faq-question">
							{faq.question}
						</h3>
						<ChevronDown class="arrow-icon {openItems.has(index) ? 'rotated' : ''}" />
					</button>

					{#if openItems.has(index)}
						<div class="faq-content">
							<p class="faq-answer">
								{faq.answer}
							</p>
						</div>
					{/if}
				</article>
			{/each}
		</div>

		<!-- Contact CTA -->
		<div class="contact-cta">
			<div class="cta-content">
				<h3 class="cta-title">
					{t('faqs.still_questions')}
				</h3>
				<p class="cta-text">
					{t('faqs.contact_text')}
				</p>

				<div class="contact-buttons">
					<a
						href="https://discord.gg/DpsJcEAbbh"
						target="_blank"
						rel="noopener noreferrer"
						class="btn-primary"
					>
						<MessageCircle class="btn-icon" />
						<span>{t('faqs.join_discord')}</span>
					</a>
					<a href="mailto:hi@shelchin.com" class="btn-secondary">
						<Mail class="btn-icon" />
						<span>{t('faqs.email_support')}</span>
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	/* Section layout */
	.faqs-section {
		position: relative;
		padding: var(--spacing-20) var(--spacing-6);
		background: var(--color-background);
	}

	.container {
		max-width: 72rem;
		margin: 0 auto;
	}

	/* Section header */
	.section-header {
		text-align: center;
		margin-bottom: var(--spacing-16);
	}

	.badge {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-2) var(--spacing-4);
		margin-bottom: var(--spacing-4);
		border-radius: var(--radius-full);
		background: var(--color-panel-2);
		border: 1px solid var(--color-border-subtle);
		font-size: var(--font-size-sm);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-secondary);
	}

	:global(.badge-icon) {
		width: 1rem;
		height: 1rem;
		color: var(--color-brand-primary);
	}

	/* Title with gradient */
	.section-title {
		font-size: var(--font-size-4xl);
		font-weight: var(--font-weight-bold);
		line-height: 1.2;
		margin-bottom: var(--spacing-4);
		background: linear-gradient(to right, var(--color-text-primary), var(--color-text-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.section-subtitle {
		max-width: 36rem;
		margin: 0 auto;
		font-size: var(--font-size-lg);
		line-height: 1.7;
		color: var(--color-text-muted);
	}

	/* FAQ grid */
	.faqs-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--spacing-4);
		max-width: 48rem;
		margin: 0 auto var(--spacing-16);
	}

	@media (min-width: 768px) {
		.faqs-grid {
			max-width: none;
			grid-template-columns: repeat(2, 1fr);
			gap: var(--spacing-6);
		}
	}

	/* FAQ item */
	.faq-item {
		position: relative;
		background: var(--color-panel-1);
		border: 1px solid var(--color-border-subtle);
		border-radius: var(--radius-lg);
		transition: all var(--duration-normal) var(--ease-smooth);
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
		border-color: var(--color-brand-primary);
		box-shadow: var(--shadow-md);
	}

	/* FAQ trigger button */
	.faq-trigger {
		width: 100%;
		padding: var(--spacing-6);
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: var(--spacing-4);
		text-align: left;
		transition: all var(--duration-fast);
	}

	.faq-question {
		flex: 1;
		margin: 0;
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		color: var(--color-text-primary);
		line-height: 1.5;
	}

	.expanded .faq-question {
		color: var(--color-brand-primary);
	}

	:global(.arrow-icon) {
		flex-shrink: 0;
		width: 1.25rem;
		height: 1.25rem;
		color: var(--color-text-muted);
		transition: transform var(--duration-fast);
	}

	:global(.arrow-icon.rotated) {
		transform: rotate(180deg);
		color: var(--color-brand-primary);
	}

	/* FAQ content */
	.faq-content {
		padding: 0 var(--spacing-6) var(--spacing-6);
		animation: slideDown var(--duration-fast) ease-out;
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
		padding-top: var(--spacing-4);
		border-top: 1px solid var(--color-border-subtle);
		font-size: var(--font-size-sm);
		line-height: 1.7;
		color: var(--color-text-secondary);
	}

	/* Contact CTA */
	.contact-cta {
		max-width: 48rem;
		margin: 0 auto;
		padding: var(--spacing-10);
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
		background: linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-secondary));
	}

	.cta-content {
		position: relative;
	}

	.cta-title {
		margin-bottom: var(--spacing-3);
		font-size: var(--font-size-2xl);
		font-weight: var(--font-weight-semibold);
		background: linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.cta-text {
		margin-bottom: var(--spacing-8);
		font-size: var(--font-size-base);
		color: var(--color-text-muted);
		line-height: 1.6;
	}

	/* Contact buttons */
	.contact-buttons {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--spacing-4);
	}

	@media (min-width: 640px) {
		.contact-buttons {
			flex-direction: row;
			justify-content: center;
		}
	}

	.btn-primary,
	.btn-secondary {
		display: inline-flex;
		align-items: center;
		gap: var(--spacing-2);
		padding: var(--spacing-3) var(--spacing-6);
		border-radius: var(--radius-md);
		font-size: var(--font-size-base);
		font-weight: var(--font-weight-medium);
		text-decoration: none;
		transition: all var(--duration-fast);
	}

	.btn-primary {
		background: var(--color-brand-primary);
		color: white;
		border: 1px solid var(--color-brand-primary);
	}

	.btn-primary:hover {
		background: var(--color-brand-primary-dark);
		border-color: var(--color-brand-primary-dark);
		transform: translateY(-2px);
		box-shadow: var(--shadow-md);
	}

	.btn-secondary {
		background: var(--color-panel-3);
		color: var(--color-text-secondary);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background: var(--color-panel-2);
		color: var(--color-text-primary);
		border-color: var(--color-brand-primary);
		transform: translateY(-1px);
	}

	:global(.btn-icon) {
		width: 1.25rem;
		height: 1.25rem;
	}

	/* Responsive adjustments */
	@media (min-width: 768px) {
		.faqs-section {
			padding: var(--spacing-32) var(--spacing-8);
		}

		.section-title {
			font-size: var(--font-size-5xl);
		}

		.faq-question {
			font-size: var(--font-size-lg);
		}
	}
</style>

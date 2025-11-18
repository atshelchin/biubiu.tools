<script lang="ts">
	import { ChevronDown } from '@lucide/svelte';

	export interface FAQ {
		question: string;
		answer: string;
	}

	interface Props {
		faqs: FAQ[];
		title?: string;
	}

	let { faqs, title = 'FAQs' }: Props = $props();

	let openIndex = $state<number | null>(null);

	function toggle(index: number) {
		openIndex = openIndex === index ? null : index;
	}
</script>

{#if faqs && faqs.length > 0}
	<div class="faqs-container">
		{#if title}
			<h2 class="faqs-title">{title}</h2>
		{/if}
		<div class="faqs-list">
			{#each faqs as faq, index (index)}
				<div class="faq-item" class:open={openIndex === index}>
					<button class="faq-question" onclick={() => toggle(index)}>
						<span class="question-text">{faq.question}</span>
						<ChevronDown size={20} class="chevron-icon" />
					</button>
					<div class="faq-answer">
						<p>{faq.answer}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.faqs-container {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: var(--space-8) var(--space-4);
	}

	.faqs-title {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
		margin-bottom: var(--space-6);
		text-align: center;
	}

	.faqs-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.faq-item {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all 0.2s ease;
	}

	.faq-item:hover {
		/* border-color: var(--color-muted-foreground); */
	}

	.faq-item.open {
		/* border-color: var(--color-primary); */
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	}

	.faq-question {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-3);
		padding: var(--space-4);
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		transition: all 0.2s ease;
	}

	.faq-question:hover {
		background: var(--color-muted);
	}

	.question-text {
		flex: 1;
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
	}

	.faq-question :global(.chevron-icon) {
		color: var(--color-muted-foreground);
		transition: transform 0.2s ease;
		flex-shrink: 0;
	}

	.faq-item.open .faq-question :global(.chevron-icon) {
		transform: rotate(180deg);
		color: var(--color-primary);
	}

	.faq-answer {
		max-height: 0;
		overflow: hidden;
		opacity: 0;
		padding: 0 var(--space-4);
		transition:
			max-height 0.3s ease,
			opacity 0.3s ease,
			padding 0.3s ease;
	}

	.faq-item.open .faq-answer {
		max-height: 500px;
		opacity: 1;
		padding: 0 var(--space-4) var(--space-4);
	}

	.faq-answer p {
		margin: 0;
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-muted-foreground);
	}

	@media (max-width: 640px) {
		.faqs-container {
			padding: var(--space-6) var(--space-3);
		}

		.faqs-title {
			font-size: var(--text-xl);
			margin-bottom: var(--space-4);
		}

		.faq-question {
			padding: var(--space-3);
		}

		.question-text {
			font-size: var(--text-sm);
		}

		.faq-answer {
			padding: 0 var(--space-3) var(--space-3);
		}
	}
</style>

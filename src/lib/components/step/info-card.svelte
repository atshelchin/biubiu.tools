<script lang="ts">
	type InfoCardVariant = 'primary' | 'knowledge' | 'tips';

	interface Props {
		/** Card variant: primary (核心解释), knowledge (补充知识), tips (新手提示) */
		variant?: InfoCardVariant;
		/** Icon emoji to display */
		icon: string;
		/** Card title */
		title: string;
		/** Card description (optional if using children slot) */
		description?: string;
		/** Children content (for lists, etc.) */
		children?: import('svelte').Snippet;
	}

	let { variant = 'primary', icon, title, description, children }: Props = $props();
</script>

<div class="info-card" class:knowledge={variant === 'knowledge'} class:tips={variant === 'tips'}>
	<h4 class="card-title">
		<span class="card-icon">{icon}</span>
		{title}
	</h4>
	{#if description}
		<p class="card-description">{description}</p>
	{/if}
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	/* Base Card Styles */
	.info-card {
		margin-bottom: var(--space-5);
		padding: var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.card-title {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--gray-800);
		margin: 0 0 var(--space-3) 0;
	}

	:global([data-theme='dark']) .card-title {
		color: var(--gray-200);
	}

	.card-icon {
		font-size: var(--text-lg);
		flex-shrink: 0;
	}

	.card-description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0;
		-webkit-hyphens: auto;
		-moz-hyphens: auto;
		-ms-hyphens: auto;
		hyphens: auto;
		word-wrap: break-word;
		overflow-wrap: break-word;
		word-break: break-word;
	}

	:global([data-theme='dark']) .card-description {
		color: var(--gray-400);
	}

	/* Knowledge Variant */
	.info-card.knowledge {
		background: hsla(120, 50%, 97%, 1);
		border-color: hsla(120, 50%, 85%, 1);
	}

	:global([data-theme='dark']) .info-card.knowledge {
		background: hsla(120, 50%, 10%, 0.3);
		border-color: hsla(120, 50%, 25%, 1);
	}

	/* Tips Variant */
	.info-card.tips {
		background: hsla(210, 100%, 97%, 1);
		border-color: hsla(210, 100%, 85%, 1);
	}

	:global([data-theme='dark']) .info-card.tips {
		background: hsla(210, 100%, 10%, 0.3);
		border-color: hsla(210, 100%, 25%, 1);
	}

	/* List inside card */
	.info-card :global(ul) {
		list-style: none;
		padding: 0;
		margin: var(--space-3) 0 0 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.info-card :global(ul li) {
		padding-left: var(--space-4);
		position: relative;
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.5;
		-webkit-hyphens: auto;
		-moz-hyphens: auto;
		-ms-hyphens: auto;
		hyphens: auto;
		word-wrap: break-word;
		overflow-wrap: break-word;
		word-break: break-word;
	}

	.info-card.tips :global(ul li) {
		padding-left: 0;
		color: var(--gray-700);
		line-height: 1.6;
	}

	.info-card :global(ul li::before) {
		content: '•';
		position: absolute;
		left: var(--space-2);
		color: var(--color-primary);
		font-weight: var(--font-bold);
	}

	.info-card.tips :global(ul li::before) {
		display: none;
	}

	:global([data-theme='dark']) .info-card :global(ul li) {
		color: var(--gray-400);
	}

	:global([data-theme='dark']) .info-card.tips :global(ul li) {
		color: var(--gray-300);
	}
</style>

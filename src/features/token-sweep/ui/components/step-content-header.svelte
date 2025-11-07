<script lang="ts">
	interface Props {
		title: string;
		description: string;
		actions?: import('svelte').Snippet;
	}

	let { title, description, actions }: Props = $props();
</script>

<div class="content-header">
	<div class="content-header-text">
		<h2>{title}</h2>
		<p class="description">{description}</p>
	</div>
</div>
{#if actions}
	<div class="header-actions">
		{@render actions()}
	</div>
{/if}

<style>
	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.content-header-text {
		flex: 1;
	}

	h2 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		margin: 0 0 var(--space-2) 0;
		color: var(--gray-900);
	}

	:global([data-theme='dark']) h2 {
		color: var(--gray-100);
	}

	.description {
		font-size: var(--text-sm);
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0;
	}

	:global([data-theme='dark']) .description {
		color: var(--gray-400);
	}

	.header-actions {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	@media (max-width: 768px) {
		.content-header {
			flex-direction: column;
		}

		.header-actions {
			width: 100%;
			justify-content: flex-start;
		}
	}
</style>

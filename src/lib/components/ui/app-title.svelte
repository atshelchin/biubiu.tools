<script lang="ts">
	interface Props {
		title: string;
		description?: string;
	}

	let { title, description }: Props = $props();
</script>

<div class="app-title">
	<h1>{title}</h1>
	{#if description}
		<p class="description">{description}</p>
	{/if}
</div>

<style>
	.app-title {
		display: flex;
		flex-direction: column;
		gap: var(--space-1);
	}

	h1 {
		font-size: var(--text-2xl);
		font-weight: var(--font-bold);
		color: var(--color-foreground);
		margin: 0;
	}

	.description {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		margin: 0;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: var(--text-xl);
		}

		.description {
			font-size: var(--text-xs);
		}
	}
</style>

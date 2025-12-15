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
	<!-- {#if features && features.length > 0}
		<ul class="features">
			{#each features as feature (feature)}
				<li class="feature-item">
					<svg class="check-icon" viewBox="0 0 16 16" fill="none">
						<path
							d="M13.5 4L6 11.5L2.5 8"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span>{feature}</span>
				</li>
			{/each}
		</ul>
	{/if} -->
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
</style>

<script lang="ts">
	interface Props {
		title: string;
		description?: string;
		features?: string[];
	}

	let { title, description, features }: Props = $props();
</script>

<div class="app-title">
	<h1>{title}</h1>
	{#if description}
		<p class="description">{description}</p>
	{/if}
	{#if features && features.length > 0}
		<ul class="features">
			{#each features as feature}
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

	.features {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		list-style: none;
		padding: 0;
		margin: var(--space-2) 0 0 0;
	}

	.feature-item {
		display: flex;
		align-items: center;
		gap: var(--space-1);
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
		padding: var(--space-1) var(--space-2);
		background: var(--color-muted);
		border-radius: var(--radius-md);
		transition: all 0.2s ease;
	}

	.feature-item:hover {
		background: var(--color-accent);
		color: var(--color-accent-foreground);
	}

	.check-icon {
		width: 14px;
		height: 14px;
		color: var(--color-success);
		flex-shrink: 0;
	}

	.feature-item:hover .check-icon {
		color: currentColor;
	}

	@media (max-width: 768px) {
		h1 {
			font-size: var(--text-xl);
		}

		.description {
			font-size: var(--text-xs);
		}

		.features {
			gap: var(--space-2);
		}

		.feature-item {
			font-size: 10px;
			padding: 2px var(--space-1);
		}

		.check-icon {
			width: 12px;
			height: 12px;
		}
	}
</style>

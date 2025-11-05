<script lang="ts">
	interface Props {
		title?: string;
		items: string[];
		ordered?: boolean;
		class?: string;
	}

	let { title, items, ordered = true, class: className = '' }: Props = $props();
</script>

<div class="instructions {className}">
	{#if title}
		<p class="instruction-title">{title}</p>
	{/if}
	{#if ordered}
		<ol class="instruction-list">
			{#each items as item (item)}
				<li>{item}</li>
			{/each}
		</ol>
	{:else}
		<ul class="instruction-list">
			{#each items as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.instructions {
		width: 100%;
		text-align: left;
	}

	.instruction-title {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		margin: 0 0 var(--space-3) 0;
	}

	.instruction-list {
		margin: 0;
		padding-left: var(--space-5);
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
		line-height: 1.6;
	}

	.instruction-list li {
		margin-bottom: var(--space-2);
	}
</style>

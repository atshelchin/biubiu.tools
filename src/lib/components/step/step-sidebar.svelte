<script lang="ts">
	interface Props {
		stepNumber: number;
		title: string;
		description: string;
		children?: import('svelte').Snippet;
	}

	let { stepNumber, title, description, children }: Props = $props();
</script>

<div class="step-sidebar">
	{#if title}
		<h3>Step {stepNumber}: {title}</h3>
	{/if}

	{#if description}
		<p>{description}</p>
	{/if}

	{@render children?.()}
</div>

<style>
	.step-sidebar {
		height: 100%;
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
	}

	h3 {
		font-size: var(--text-lg);
		font-weight: var(--font-semibold);
		margin: 0 0 var(--space-2) 0;
		color: var(--gray-800);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-200);
	}

	p {
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0 0 var(--space-4) 0;
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}
</style>

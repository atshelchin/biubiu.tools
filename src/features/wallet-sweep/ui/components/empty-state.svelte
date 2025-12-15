<script lang="ts">
	interface Props {
		icon: string;
		title: string;
		message: string;
		action?: import('svelte').Snippet;
	}

	let { icon, title, message, action }: Props = $props();
</script>

<div class="empty-state">
	<div class="empty-icon">{icon}</div>
	<h3>{title}</h3>
	<p>{message}</p>
	{#if action}
		<div class="empty-action">
			{@render action()}
		</div>
	{/if}
</div>

<style>
	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: var(--space-3);
		padding: var(--space-8);
		text-align: center;
	}

	.empty-icon {
		font-size: 4rem;
	}

	h3 {
		font-size: var(--text-xl);
		margin: 0;
		color: var(--gray-800);
	}

	:global([data-theme='dark']) h3 {
		color: var(--gray-200);
	}

	p {
		max-width: 400px;
		color: var(--gray-600);
		line-height: 1.6;
		margin: 0;
	}

	:global([data-theme='dark']) p {
		color: var(--gray-400);
	}

	.empty-action {
		margin-top: var(--space-2);
	}
</style>

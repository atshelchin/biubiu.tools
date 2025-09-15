<script lang="ts">
	let { class: className = '' } = $props<{ class?: string }>();
</script>

<div class="card-title {className}">
	<slot />
</div>

<style>
	.card-title {
		font-size: var(--font-size-lg);
		font-weight: var(--font-weight-semibold);
		line-height: var(--line-height-tight);
		color: var(--color-text-primary);
		margin-bottom: var(--spacing-2);
	}
</style>

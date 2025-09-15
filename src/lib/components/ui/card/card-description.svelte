<script lang="ts">
	let { class: className = '' } = $props<{ class?: string }>();
</script>

<div class="card-description {className}">
	<slot />
</div>

<style>
	.card-description {
		font-size: var(--font-size-sm);
		line-height: var(--line-height-relaxed);
		color: var(--color-text-secondary);
	}
</style>

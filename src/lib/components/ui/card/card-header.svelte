<script lang="ts">
	let { class: className = '' } = $props<{ class?: string }>();
</script>

<div class="card-header {className}">
	<slot />
</div>

<style>
	.card-header {
		padding-bottom: var(--spacing-4);
	}
</style>

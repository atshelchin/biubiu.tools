<script lang="ts">
	let { class: className = '' } = $props<{ class?: string }>();
</script>

<div class="card-content {className}">
	<slot />
</div>

<style>
	.card-content {
		padding-top: var(--spacing-2);
	}
</style>

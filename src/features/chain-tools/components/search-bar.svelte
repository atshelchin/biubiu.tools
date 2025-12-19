<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n/svelte';

	interface Props {
		value: string;
		onchange: (value: string) => void;
	}

	let { value, onchange }: Props = $props();

	const i18n = useI18n();

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		onchange(target.value);
	}

	function handleClear() {
		onchange('');
	}
</script>

<div class="search-bar">
	<Search class="search-icon" />
	<input
		type="text"
		class="search-input"
		placeholder={i18n.t('chain_tools.search_placeholder')}
		{value}
		oninput={handleInput}
	/>
	{#if value}
		<button class="clear-btn" onclick={handleClear} aria-label="Clear search">
			<X class="clear-icon" />
		</button>
	{/if}
</div>

<style>
	.search-bar {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		max-width: 600px;
		margin: 0 auto;
	}

	:global(.search-icon) {
		position: absolute;
		left: var(--space-4);
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
		pointer-events: none;
	}

	.search-input {
		width: 100%;
		padding: var(--space-4) var(--space-12);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-xl);
		font-size: var(--text-base);
		color: var(--color-text-primary);
		transition: all 0.2s ease;
	}

	.search-input::placeholder {
		color: var(--color-description-3);
	}

	.search-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
	}

	:global(.light) .search-input {
		background: var(--color-panel-2);
	}

	:global(.light) .search-input:focus {
		background: var(--color-panel-3);
	}

	.clear-btn {
		position: absolute;
		right: var(--space-3);
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		padding: 0;
		background: var(--color-panel-2);
		border: none;
		border-radius: var(--radius-full);
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.clear-btn:hover {
		background: var(--color-panel-3);
	}

	:global(.clear-icon) {
		width: 16px;
		height: 16px;
		color: var(--color-description-2);
	}
</style>

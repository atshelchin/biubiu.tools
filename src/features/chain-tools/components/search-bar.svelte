<script lang="ts">
	import { Search, X } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';

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
		placeholder={i18n.t('routes/apps/chain-tools/chain-tools.search_placeholder')}
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
		max-width: 720px;
		margin: 0 auto;
	}

	:global(.search-icon) {
		position: absolute;
		left: var(--space-5);
		width: 20px;
		height: 20px;
		color: var(--color-description-3);
		pointer-events: none;
		transition: color 0.2s ease;
	}

	.search-bar:focus-within :global(.search-icon) {
		color: var(--color-primary);
	}

	.search-input {
		width: 100%;
		padding: var(--space-4) var(--space-14) var(--space-4) var(--space-12);
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
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent);
	}

	:global(.light) .search-input {
		background: var(--color-panel-2);
	}

	:global(.light) .search-input:focus {
		background: var(--color-panel-0);
	}

	.clear-btn {
		position: absolute;
		right: var(--space-4);
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
		transition: all 0.2s ease;
	}

	.clear-btn:hover {
		background: var(--color-panel-3);
		transform: scale(1.05);
	}

	:global(.clear-icon) {
		width: 14px;
		height: 14px;
		color: var(--color-description-2);
	}

	@media (max-width: 768px) {
		.search-input {
			padding: var(--space-3) var(--space-12) var(--space-3) var(--space-10);
			font-size: var(--text-sm);
		}

		:global(.search-icon) {
			left: var(--space-4);
			width: 18px;
			height: 18px;
		}

		.clear-btn {
			right: var(--space-3);
			width: 24px;
			height: 24px;
		}

		:global(.clear-icon) {
			width: 12px;
			height: 12px;
		}
	}
</style>

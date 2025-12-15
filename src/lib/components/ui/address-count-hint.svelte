<script lang="ts">
	import { useI18n } from '@shelchin/i18n/svelte';

	const i18n = useI18n();

	interface Props {
		/** Number of addresses to generate */
		count: number;
		/** Maximum allowed addresses (shows warning if exceeded) */
		maxLimit?: number;
	}

	let { count, maxLimit }: Props = $props();

	const isOverLimit = $derived(maxLimit !== undefined && count > maxLimit);
</script>

<p class="count-hint" class:warning={isOverLimit}>
	<span class="count-text">
		{i18n.t('components.address_path_selector.will_generate')}
		<strong class="count-value">{count.toLocaleString()}</strong>
		{i18n.t('components.address_path_selector.addresses')}
	</span>
	{#if isOverLimit && maxLimit !== undefined}
		<span class="count-warning">
			({i18n.t('components.address_path_selector.limited_to', {
				max: maxLimit.toLocaleString()
			})})
		</span>
	{/if}
</p>

<style>
	.count-hint {
		margin: 0;
		font-size: var(--text-sm);
		color: var(--gray-500);
	}

	:global([data-theme='dark']) .count-hint {
		color: var(--gray-400);
	}

	.count-text {
		display: inline;
	}

	.count-value {
		font-weight: var(--font-semibold);
		color: var(--gray-700);
	}

	:global([data-theme='dark']) .count-value {
		color: var(--gray-200);
	}

	.count-hint.warning .count-value {
		color: hsl(38, 80%, 45%);
	}

	:global([data-theme='dark']) .count-hint.warning .count-value {
		color: hsl(38, 80%, 55%);
	}

	.count-warning {
		color: hsl(38, 80%, 45%);
		font-size: var(--text-xs);
	}

	:global([data-theme='dark']) .count-warning {
		color: hsl(38, 80%, 55%);
	}
</style>

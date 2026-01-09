<script lang="ts">
	/**
	 * Basic Demo
	 * Demonstrates the simplest usage of drag-sortable
	 */
	import { dragSortable } from '@shelchin/drag-sortable';
	import { RotateCcw } from '@lucide/svelte';
	import {
		DemoSection,
		DemoContent,
		CodeBlock,
		DemoButton,
		ActionButtons
	} from '$lib/components/package-demo';

	interface Props {
		t: (key: string) => string;
	}

	let { t }: Props = $props();

	const initialItems = [
		{ id: 1, name: 'fruit_apple', color: '#ef4444' },
		{ id: 2, name: 'fruit_banana', color: '#eab308' },
		{ id: 3, name: 'fruit_cherry', color: '#ec4899' },
		{ id: 4, name: 'fruit_date', color: '#a16207' },
		{ id: 5, name: 'fruit_elderberry', color: '#7c3aed' }
	];

	let items = $state([...initialItems]);

	function handleSort(from: number, to: number) {
		// Create a new array to trigger reactivity properly
		const newItems = [...items];
		const [item] = newItems.splice(from, 1);
		newItems.splice(to, 0, item);
		items = newItems;
	}

	function reset() {
		// Reset to original order (initialItems is never mutated)
		items = initialItems.map((item) => ({ ...item }));
	}

	const codeExample = `import { dragSortable } from '@shelchin/drag-sortable';

let items = $state(['Apple', 'Banana', 'Cherry']);

function handleSort(from: number, to: number) {
  const item = items.splice(from, 1)[0];
  items.splice(to, 0, item);
}

// In template:
// <div use:dragSortable={{ onSort: handleSort }}>
//   {#each items as item (item)}
//     <div class="item">{item}</div>
//   {/each}
// </div>`;
</script>

<DemoSection title={t('demo.basic.title')} description={t('demo.basic.description')}>
	<DemoContent>
		{#snippet panel()}
			<ActionButtons>
				<DemoButton variant="outline" icon={RotateCcw} onclick={reset}>
					{t('demo.basic.reset')}
				</DemoButton>
			</ActionButtons>

			<div class="hint">
				<span class="hint-icon">💡</span>
				<span>{t('messages.drag_hint')}</span>
			</div>
		{/snippet}

		{#snippet result()}
			<div class="fruit-list" use:dragSortable={{ onSort: handleSort }}>
				{#each items as item (item.id)}
					<div class="fruit-item">
						<span class="fruit-dot" style="background-color: {item.color}"></span>
						<span class="fruit-name">{t(`demo.basic.${item.name}`)}</span>
						<span class="fruit-index">#{items.indexOf(item) + 1}</span>
					</div>
				{/each}
			</div>
		{/snippet}
	</DemoContent>

	<CodeBlock title={t('code.basic_usage')} code={codeExample} />
</DemoSection>

<style>
	.hint {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-3) var(--space-4);
		background: var(--color-panel-1);
		border-radius: var(--radius);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
	}

	.hint-icon {
		font-size: var(--text-lg);
	}

	.fruit-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
	}

	.fruit-item {
		display: flex;
		align-items: center;
		gap: var(--space-4);
		padding: var(--space-4) var(--space-5);
		background: var(--color-card);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		cursor: grab;
		transition: all 200ms ease;
	}

	.fruit-item:hover {
		border-color: var(--color-primary);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.fruit-item:active {
		cursor: grabbing;
	}

	.fruit-dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.fruit-name {
		flex: 1;
		font-weight: 500;
		color: var(--color-foreground);
	}

	.fruit-index {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		font-family: var(--font-mono);
	}
</style>

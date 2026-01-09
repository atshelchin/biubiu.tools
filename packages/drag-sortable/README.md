# @shelchin/drag-sortable

A Svelte 5 action for drag-and-drop sorting with ghost element and real-time reordering.

## Features

- **Ghost Element**: Dragged item shows as a floating ghost that follows cursor/finger
- **Real-time Reordering**: Items move aside in real-time as you drag
- **Smooth Animations**: Configurable CSS transitions for fluid UX
- **Desktop & Mobile**: Full support for mouse drag and touch events
- **Auto-scroll**: Automatically scrolls container/window when dragging near edges
- **Drag Handle**: Optional handle selector for precise drag control
- **Haptic Feedback**: Vibration feedback on mobile devices

## Installation

```bash
npm install @shelchin/drag-sortable
# or
bun add @shelchin/drag-sortable
# or
pnpm add @shelchin/drag-sortable
```

## Quick Start

```svelte
<script lang="ts">
	import { dragSortable } from '@shelchin/drag-sortable';

	let items = $state(['Apple', 'Banana', 'Cherry', 'Date']);

	function handleSort(fromIndex: number, toIndex: number) {
		const item = items.splice(fromIndex, 1)[0];
		items.splice(toIndex, 0, item);
	}
</script>

<ul use:dragSortable={{ onSort: handleSort }}>
	{#each items as item (item)}
		<li>{item}</li>
	{/each}
</ul>
```

## API

### `dragSortable(node, options)`

A Svelte action that makes a container's children draggable and sortable.

#### Options

| Option              | Type                                           | Default      | Description                                                         |
| ------------------- | ---------------------------------------------- | ------------ | ------------------------------------------------------------------- |
| `onSort`            | `(fromIndex: number, toIndex: number) => void` | **required** | Callback when an item is dropped at a new position                  |
| `handle`            | `string`                                       | `undefined`  | CSS selector for drag handle (e.g., `'.handle'`, `'[data-handle]'`) |
| `animationDuration` | `number`                                       | `200`        | Duration of animations in milliseconds                              |

### TypeScript

```typescript
import { dragSortable, type DragSortableOptions } from '@shelchin/drag-sortable';

const options: DragSortableOptions = {
	onSort: (from, to) => console.log(`Moved from ${from} to ${to}`),
	handle: '.drag-handle',
	animationDuration: 300
};
```

## Examples

### Basic List Sorting

```svelte
<script lang="ts">
	import { dragSortable } from '@shelchin/drag-sortable';

	let items = $state([
		{ id: 1, name: 'Task 1' },
		{ id: 2, name: 'Task 2' },
		{ id: 3, name: 'Task 3' }
	]);

	function handleSort(from: number, to: number) {
		const item = items.splice(from, 1)[0];
		items.splice(to, 0, item);
	}
</script>

<div use:dragSortable={{ onSort: handleSort }}>
	{#each items as item (item.id)}
		<div class="item">{item.name}</div>
	{/each}
</div>

<style>
	.item {
		padding: 1rem;
		margin: 0.5rem 0;
		background: #f0f0f0;
		border-radius: 8px;
		cursor: grab;
	}
</style>
```

### With Drag Handle

Only the handle element triggers dragging, allowing other interactions within the item.

```svelte
<script lang="ts">
	import { dragSortable } from '@shelchin/drag-sortable';

	let items = $state(['Item 1', 'Item 2', 'Item 3']);

	function handleSort(from: number, to: number) {
		const item = items.splice(from, 1)[0];
		items.splice(to, 0, item);
	}
</script>

<div use:dragSortable={{ onSort: handleSort, handle: '.handle' }}>
	{#each items as item (item)}
		<div class="card">
			<span class="handle">⋮⋮</span>
			<span>{item}</span>
			<button onclick={() => alert('Clicked!')}>Action</button>
		</div>
	{/each}
</div>

<style>
	.card {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background: white;
		border: 1px solid #ddd;
		border-radius: 8px;
	}

	.handle {
		cursor: grab;
		color: #999;
		user-select: none;
	}
</style>
```

### Custom Animation Duration

```svelte
<div
	use:dragSortable={{
		onSort: handleSort,
		animationDuration: 400 // Slower, more dramatic animations
	}}
>
	{#each items as item (item.id)}
		<div>{item.name}</div>
	{/each}
</div>
```

### Grid Layout

Works with any CSS layout, including grid:

```svelte
<div class="grid" use:dragSortable={{ onSort: handleSort }}>
	{#each items as item (item.id)}
		<div class="grid-item">{item.name}</div>
	{/each}
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1rem;
	}
</style>
```

## Styling

### Ghost Element

The ghost element (the floating clone during drag) has the class `drag-ghost` and these default styles:

```css
.drag-ghost {
	position: fixed;
	pointer-events: none;
	z-index: 10000;
	opacity: 0.9;
	transform: rotate(-2deg) scale(1.05);
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	border-radius: 0.75rem;
}
```

### Dragged Item

The original item being dragged has `opacity: 0.4` during the drag.

### Custom Styling

You can customize the ghost appearance with CSS:

```css
/* Custom ghost styling */
:global(.drag-ghost) {
	opacity: 0.8 !important;
	transform: rotate(-1deg) scale(1.02) !important;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile Safari (iOS 12+)
- Chrome for Android

## Notes

- The container element must have `position: relative` (set automatically by the action)
- All direct children of the container become draggable
- Uses HTML5 Drag and Drop API for desktop
- Uses Touch Events for mobile
- Items must have unique keys in `{#each}` blocks for proper tracking

## License

MIT

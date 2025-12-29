# @shelchin/svelte-clipboard

A lightweight Svelte 5 clipboard composable with copy success feedback.

## Features

- Svelte 5 runes-based reactive state
- Auto-reset success feedback after configurable duration
- TypeScript support
- Zero dependencies (only peer dependency on Svelte 5)

## Installation

```bash
npm install @shelchin/svelte-clipboard
# or
bun add @shelchin/svelte-clipboard
# or
pnpm add @shelchin/svelte-clipboard
```

## Usage

### Basic Usage

```svelte
<script>
	import { useClipboard } from '@shelchin/svelte-clipboard';

	const clipboard = useClipboard();
</script>

<button onclick={() => clipboard.copy('Hello World!')}>
	{clipboard.copySuccess ? 'Copied!' : 'Copy'}
</button>
```

### Custom Duration

```svelte
<script>
	import { useClipboard } from '@shelchin/svelte-clipboard';

	const clipboard = useClipboard();
</script>

<!-- Show success for 5 seconds -->
<button onclick={() => clipboard.copy('Hello!', 5000)}>
	{clipboard.copySuccess ? 'Copied!' : 'Copy'}
</button>
```

### With Icons

```svelte
<script>
	import { useClipboard } from '@shelchin/svelte-clipboard';
	import { Copy, Check } from '@lucide/svelte';

	const clipboard = useClipboard();
	let text = 'Some text to copy';
</script>

<button onclick={() => clipboard.copy(text)}>
	{#if clipboard.copySuccess}
		<Check class="text-green-500" />
	{:else}
		<Copy />
	{/if}
</button>
```

### Manual Reset

```svelte
<script>
	import { useClipboard } from '@shelchin/svelte-clipboard';

	const clipboard = useClipboard();
</script>

<button onclick={() => clipboard.copy('Hello!')}>Copy</button>
<button onclick={() => clipboard.reset()}>Reset</button>

{#if clipboard.copySuccess}
	<span>Text copied!</span>
{/if}
```

## API

### `useClipboard()`

Returns a clipboard controller object.

#### Returns

| Property                | Type                                                 | Description                                                       |
| ----------------------- | ---------------------------------------------------- | ----------------------------------------------------------------- |
| `copySuccess`           | `boolean`                                            | Whether the last copy was successful. Auto-resets after duration. |
| `copy(text, duration?)` | `(text: string, duration?: number) => Promise<void>` | Copy text to clipboard. Default duration is 2000ms.               |
| `reset()`               | `() => void`                                         | Manually reset the success state.                                 |

## Requirements

- Svelte 5.0.0 or higher

## License

MIT

# @shelchin/svelte-theme

A Svelte 5 theme store with dark/light mode, SSR support, and optional cookie consent integration.

## Features

- Svelte 5 runes-based reactive state
- SSR-safe with proper hydration
- Cookie and localStorage persistence
- Optional integration with `@shelchin/cookie-consent`
- System preference detection (prefers-color-scheme)
- TypeScript support
- Zero required dependencies (only peer dependency on Svelte 5)

## Installation

```bash
npm install @shelchin/svelte-theme
# or
bun add @shelchin/svelte-theme
# or
pnpm add @shelchin/svelte-theme
```

## Usage

### Setup in Root Layout

```svelte
<!-- +layout.svelte -->
<script>
	import { createThemeStore } from '@shelchin/svelte-theme';

	interface Props {
		data: { theme: 'light' | 'dark' };
		children: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	// Create the store with initial theme from server
	const theme = createThemeStore({ initialTheme: data.theme });
</script>

{@render children()}
```

### Server-Side Theme Detection

```ts
// +layout.server.ts
import { getThemeFromCookies } from '@shelchin/svelte-theme';

export const load = ({ cookies }) => {
	return {
		theme: getThemeFromCookies(cookies.get('theme'))
	};
};
```

### Theme Toggle Component

```svelte
<script>
	import { useTheme } from '@shelchin/svelte-theme';

	const theme = useTheme();
</script>

<button onclick={theme.toggleTheme}>
	{theme.theme === 'dark' ? 'Light' : 'Dark'} Mode
</button>
```

### With Cookie Consent Integration

If you have `@shelchin/cookie-consent` installed, the theme store will automatically check for cookie consent before persisting the theme preference.

```svelte
<script>
	import { createThemeStore } from '@shelchin/svelte-theme';
	import { createCookieConsentStore } from '@shelchin/cookie-consent';

	// Cookie consent store (handles GDPR compliance)
	const consent = createCookieConsentStore();

	// Theme store will automatically use cookie consent
	const theme = createThemeStore();
</script>
```

### Custom Persistence Control

```svelte
<script>
	import { createThemeStore } from '@shelchin/svelte-theme';

	const theme = createThemeStore({
		initialTheme: 'light',
		cookieName: 'my-app-theme',
		storageKey: 'my-app-theme',
		cookieMaxAge: 60 * 60 * 24 * 30, // 30 days
		canPersist: () => {
			// Custom logic to check if persistence is allowed
			return myCustomConsentCheck();
		}
	});
</script>
```

## API

### `createThemeStore(options?)`

Creates the theme store. Should be called once in the root layout.

#### Options

| Option         | Type                | Default             | Description                          |
| -------------- | ------------------- | ------------------- | ------------------------------------ |
| `initialTheme` | `'light' \| 'dark'` | `'light'`           | Initial theme value                  |
| `contextKey`   | `string`            | `'theme-context'`   | Svelte context key                   |
| `cookieName`   | `string`            | `'theme'`           | Cookie name for persistence          |
| `storageKey`   | `string`            | `'theme'`           | LocalStorage key for persistence     |
| `cookieMaxAge` | `number`            | `31536000` (1 year) | Cookie max age in seconds            |
| `canPersist`   | `() => boolean`     | auto-detect         | Custom function to check persistence |

#### Returns `ThemeContext`

| Property/Method | Type                | Description              |
| --------------- | ------------------- | ------------------------ |
| `theme`         | `'light' \| 'dark'` | Current theme (reactive) |
| `setTheme()`    | `(theme) => void`   | Set specific theme       |
| `toggleTheme()` | `() => void`        | Toggle between themes    |

### `useTheme(options?)`

Gets the theme store from Svelte context. Use in child components.

#### Options

| Option       | Type     | Default           | Description        |
| ------------ | -------- | ----------------- | ------------------ |
| `contextKey` | `string` | `'theme-context'` | Svelte context key |

#### Returns `ThemeContext`

Same as `createThemeStore()` return value.

### `getThemeFromCookies(cookieValue, defaultTheme?)`

Utility to read theme from request cookies (for SSR).

| Parameter      | Type                  | Default   | Description              |
| -------------- | --------------------- | --------- | ------------------------ |
| `cookieValue`  | `string \| undefined` | -         | Cookie value from server |
| `defaultTheme` | `'light' \| 'dark'`   | `'light'` | Fallback theme           |

## CSS Setup

Add data-theme attribute styling to your CSS:

```css
:root {
	--bg-color: white;
	--text-color: black;
}

[data-theme='dark'] {
	--bg-color: #1a1a1a;
	--text-color: white;
}

body {
	background-color: var(--bg-color);
	color: var(--text-color);
}
```

## Requirements

- Svelte 5.0.0 or higher

## License

MIT

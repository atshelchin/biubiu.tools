# @shelchin/cookie-consent

A Svelte 5 cookie consent management library with GDPR/CCPA compliance.

## Features

- Svelte 5 runes-based reactive state
- GDPR, CCPA, and other privacy regulation compliance
- Configurable consent categories (necessary, analytics)
- Periodic reminder for users who declined analytics
- SSR-safe with localStorage persistence
- TypeScript support
- Zero dependencies (only peer dependency on Svelte 5)

## Installation

```bash
npm install @shelchin/cookie-consent
# or
bun add @shelchin/cookie-consent
# or
pnpm add @shelchin/cookie-consent
```

## Usage

### Setup in Root Layout

```svelte
<!-- +layout.svelte -->
<script>
	import { createCookieConsentStore } from '@shelchin/cookie-consent';
	import CookieBanner from './CookieBanner.svelte';

	// Create the store in the root layout
	const consent = createCookieConsentStore();
</script>

{#if consent.shouldShowBanner}
	<CookieBanner {consent} />
{/if}

<slot />
```

### Cookie Banner Component

```svelte
<!-- CookieBanner.svelte -->
<script>
	import type { CookieConsentContext } from '@shelchin/cookie-consent';

	interface Props {
		consent: CookieConsentContext;
	}

	let { consent }: Props = $props();
</script>

<div class="cookie-banner">
	<p>We use cookies to improve your experience.</p>

	<div class="actions">
		<button onclick={consent.acceptNecessaryOnly}> Necessary Only </button>
		<button onclick={consent.acceptAll}> Accept All </button>
	</div>
</div>
```

### Use in Child Components

```svelte
<script>
	import { useCookieConsent } from '@shelchin/cookie-consent';

	const consent = useCookieConsent();
</script>

{#if consent.hasConsent('analytics')}
	<AnalyticsTracker />
{/if}
```

### Check Consent in Utility Functions

```ts
import { checkConsent } from '@shelchin/cookie-consent';

function trackPageView() {
	if (checkConsent('analytics')) {
		// Safe to track
		analytics.track('page_view');
	}
}
```

### Custom Configuration

```svelte
<script>
	import { createCookieConsentStore } from '@shelchin/cookie-consent';

	const consent = createCookieConsentStore({
		storageKey: 'my-app-consent', // Custom localStorage key
		version: 2, // Bump to reset old consents
		reminderInterval: 14 * 24 * 60 * 60 * 1000 // 14 days
	});
</script>
```

### Settings Button (GDPR Right to Withdraw)

```svelte
<script>
	import { useCookieConsent } from '@shelchin/cookie-consent';

	const consent = useCookieConsent();
</script>

<button onclick={consent.openSettings}> Cookie Settings </button>
```

## API

### `createCookieConsentStore(options?)`

Creates the consent store. Should be called once in the root layout.

#### Options

| Option             | Type     | Default              | Description                     |
| ------------------ | -------- | -------------------- | ------------------------------- |
| `storageKey`       | `string` | `'cookie-consent'`   | localStorage key                |
| `version`          | `number` | `1`                  | Consent version (bump to reset) |
| `reminderInterval` | `number` | `604800000` (7 days) | Reminder interval in ms         |

#### Returns `CookieConsentContext`

| Property/Method         | Type                 | Description                 |
| ----------------------- | -------------------- | --------------------------- |
| `preferences`           | `ConsentPreferences` | Current consent state       |
| `hasInteracted`         | `boolean`            | User has made a choice      |
| `shouldShowBanner`      | `boolean`            | Banner should be visible    |
| `isReminder`            | `boolean`            | This is a periodic reminder |
| `acceptAll()`           | `() => void`         | Accept all cookies          |
| `acceptNecessaryOnly()` | `() => void`         | Accept only necessary       |
| `acceptCustom(prefs)`   | `(prefs) => void`    | Custom selection            |
| `hasConsent(category)`  | `(cat) => boolean`   | Check specific category     |
| `resetConsent()`        | `() => void`         | Reset all consent           |
| `dismissReminder()`     | `() => void`         | Dismiss reminder            |
| `openSettings()`        | `() => void`         | Open settings banner        |

### `useCookieConsent()`

Gets the consent store from Svelte context. Use in child components.

### `checkConsent(category, options?)`

Check consent directly without context. Useful in utility functions.

```ts
checkConsent('analytics'); // boolean
checkConsent('necessary'); // always true
```

### `hasConsentInteraction(options?)`

Check if user has interacted with the consent banner.

## Consent Categories

| Category     | Description                        | Default |
| ------------ | ---------------------------------- | ------- |
| `necessary`  | Essential for app (always enabled) | `true`  |
| `functional` | Deprecated, same as necessary      | `true`  |
| `analytics`  | User tracking, UTM, etc.           | `false` |

## Requirements

- Svelte 5.0.0 or higher

## License

MIT

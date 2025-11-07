# ConfirmDialog Component

A reusable confirmation dialog with optional long-press (3 seconds) requirement for critical actions.

## Features

- **Long-press confirmation**: Requires user to hold button for 3 seconds to confirm (prevents accidental actions)
- **Visual progress bar**: Shows hold progress with animated bar
- **Variant styles**: Support for `danger`, `warning`, and `info` variants
- **Responsive**: Works with mouse, touch, and pointer events
- **Customizable**: Configure duration, text, and behavior

## Usage

### Basic Example

```svelte
<script>
	import ConfirmDialog from '$lib/components/ui/confirm-dialog.svelte';

	let showDialog = $state(false);

	function handleDelete() {
		showDialog = true;
	}

	function confirmDelete() {
		// Perform the dangerous action
		console.log('Item deleted');
	}

	function cancelDelete() {
		console.log('Cancelled');
	}
</script>

<button onclick={handleDelete}>Delete Item</button>

<ConfirmDialog
	bind:open={showDialog}
	title="Delete Item"
	message="Are you sure you want to delete this item? This action cannot be undone."
	confirmText="Delete"
	variant="danger"
	requireLongPress={true}
	longPressDuration={3000}
	onConfirm={confirmDelete}
	onCancel={cancelDelete}
/>
```

### Quick Confirm (No Long-press)

```svelte
<ConfirmDialog
	bind:open={showDialog}
	title="Save Changes"
	message="Do you want to save your changes?"
	confirmText="Save"
	variant="info"
	requireLongPress={false}
	onConfirm={handleSave}
	onCancel={handleCancel}
/>
```

### Warning Variant

```svelte
<ConfirmDialog
	bind:open={showDialog}
	title="Clear All Data"
	message="This will clear all cached data. You may need to re-fetch information."
	confirmText="Clear Data"
	variant="warning"
	requireLongPress={true}
	longPressDuration={2000}
	onConfirm={handleClear}
	onCancel={handleCancel}
/>
```

## Props

| Prop                | Type                              | Default            | Description                           |
| ------------------- | --------------------------------- | ------------------ | ------------------------------------- |
| `open`              | `boolean`                         | `false`            | Controls dialog visibility (bindable) |
| `title`             | `string`                          | `'Confirm Action'` | Dialog title                          |
| `message`           | `string`                          | **required**       | Main message to display               |
| `confirmText`       | `string`                          | `'Confirm'`        | Text for confirm button               |
| `cancelText`        | `string`                          | `'Cancel'`         | Text for cancel button                |
| `variant`           | `'danger' \| 'warning' \| 'info'` | `'danger'`         | Visual style variant                  |
| `requireLongPress`  | `boolean`                         | `true`             | Whether to require long-press         |
| `longPressDuration` | `number`                          | `3000`             | Duration in milliseconds              |
| `onConfirm`         | `() => void`                      | **required**       | Callback when confirmed               |
| `onCancel`          | `() => void`                      | **required**       | Callback when cancelled               |

## Design Rationale

### Why Long-press?

1. **Prevents Accidental Actions**: Users must deliberately hold the button, reducing mistakes
2. **Visual Feedback**: Progress bar shows exactly how long to hold
3. **Touch-friendly**: Works naturally on mobile devices
4. **Muscle Memory**: Users learn the interaction pattern for destructive actions

### When to Use Long-press

- ✅ Deleting items (tokens, networks, accounts)
- ✅ Clearing all data
- ✅ Irreversible actions
- ✅ Financial transactions
- ❌ Saving changes
- ❌ Cancelling operations
- ❌ Low-risk confirmations

## Accessibility

- Keyboard accessible
- Screen reader friendly (uses semantic HTML)
- Touch and pointer event support
- Visual feedback for all states

## Styling

The component uses CSS variables from the design system and supports dark mode automatically.

## Examples in Codebase

- [token-card.svelte](./token-card.svelte) - Remove custom token confirmation

# @shelchin/formstate

A powerful, type-safe form state management library with support for recursive nesting, dynamic fields, and async validation.

## Features

- **Interface-first design** - Program against interfaces for easy extension and testing
- **Framework adapters** - Core logic is framework-agnostic, with Svelte 5 adapter included
- **Svelte 5 Runes** - Uses the latest Svelte 5 reactive API
- **Recursive nesting** - Deep object and array paths (`user.addresses[0].street`)
- **Dynamic fields** - Add/remove fields at runtime
- **Async validation** - Support for async validators with auto-debounce and cancellation
- **Composable UI** - Headless components + optional UI components
- **Schema-driven** - Support for configuration-driven form rendering
- **TypeScript** - Full type support
- **Batch updates** - Efficient batch updates to prevent multiple re-renders
- **Serialization** - Safe serialization supporting BigInt, Date, Map, Set

## Installation

```bash
npm install @shelchin/formstate
# or
bun add @shelchin/formstate
```

## Quick Start

### Basic Usage with FormField

```svelte
<script lang="ts">
	import { useFormState, Form, FormField, Validators } from '@shelchin/formstate';

	const form = useFormState({
		fields: {
			email: {
				defaultValue: '',
				validator: Validators.compose(Validators.required(), Validators.email())
			},
			password: {
				defaultValue: '',
				validator: Validators.compose(Validators.required(), Validators.minLength(8))
			}
		}
	});

	async function handleSubmit(values: Record<string, unknown>) {
		console.log('Submitted:', values);
	}
</script>

<Form {form} onSubmit={handleSubmit}>
	<FormField name="email" label="Email">
		{#snippet children({ value, onInput, onBlur })}
			<input type="email" {value} oninput={(e) => onInput(e.currentTarget.value)} onblur={onBlur} />
		{/snippet}
	</FormField>

	<FormField name="password" label="Password">
		{#snippet children({ value, onInput, onBlur })}
			<input
				type="password"
				{value}
				oninput={(e) => onInput(e.currentTarget.value)}
				onblur={onBlur}
			/>
		{/snippet}
	</FormField>

	<button type="submit" disabled={!form.isValid}>Submit</button>
</Form>
```

### Headless Components (Full UI Control)

```svelte
<script lang="ts">
	import {
		useFormState,
		Form,
		Field,
		FieldLabel,
		FieldErrorDisplay,
		FieldValidating
	} from '@shelchin/formstate';

	const form = useFormState();
</script>

<Form {form}>
	<Field name="username">
		{#snippet children({ value, error, touched, validating, setValue, setTouched })}
			<div class="my-custom-field">
				<FieldLabel required>Username</FieldLabel>

				<input
					type="text"
					{value}
					class:error={touched && error}
					oninput={(e) => setValue(e.currentTarget.value)}
					onblur={() => setTouched()}
				/>

				<FieldErrorDisplay {error} show={touched} />
				<FieldValidating show={validating} />
			</div>
		{/snippet}
	</Field>
</Form>
```

### Dynamic Array Fields

```svelte
<Form {form}>
	<FieldArray name="addresses">
		{#snippet children({ fields, append, remove })}
			{#each fields as field (field.key)}
				<div class="address-item">
					<FormField name="{field.name}.street" label="Street">
						{#snippet children({ value, onInput, onBlur })}
							<input value={value} oninput={(e) => onInput(e.currentTarget.value)} onblur={onBlur} />
						{/snippet}
					</FormField>
					<button type="button" onclick={() => remove(field.index)}>Remove</button>
				</div>
			{/each}
			<button type="button" onclick={() => append({ street: '', city: '' })}>Add Address</button>
		{/snippet}
	</FieldArray>
</Form>
```

## Core API

### FormStateManager

The core state manager handles all form logic.

```typescript
import { FormStateManager, Validators } from '@shelchin/formstate';

const manager = new FormStateManager({
	validateOnChange: true,
	validateOnBlur: true,
	fields: {
		email: {
			defaultValue: '',
			validator: Validators.email()
		}
	}
});

// Set values
manager.setValue('email', 'test@example.com');

// Get values
manager.getValue('email'); // 'test@example.com'
manager.getValues(); // { email: 'test@example.com' }

// Validation
await manager.validateField('email');
await manager.validateForm();

// State queries
manager.isDirty(); // true if any field changed
manager.isValid(); // true if no errors
manager.isValidating(); // true if validation in progress
manager.getErrors(); // { field: 'error message', ... }
manager.getDirtyFields(); // ['email', ...]
manager.getDirtyValues(); // { email: '...' }

// Submit
const success = await manager.submit(async (values) => {
	await saveToServer(values);
});

// Reset
manager.reset();
manager.reset({ email: 'new@example.com' }); // Reset with new initial values
```

### Batch Updates

Batch multiple updates to prevent multiple re-renders:

```typescript
manager.batchUpdate(() => {
	manager.setValue('firstName', 'John', false);
	manager.setValue('lastName', 'Doe', false);
	manager.setValue('email', 'john@example.com', false);
}); // Only triggers one UI update
```

### Validators

Built-in validators and composition:

```typescript
import { Validators, createValidator, createCustomValidator } from '@shelchin/formstate';

// Built-in validators
Validators.required('Custom message');
Validators.email();
Validators.minLength(3);
Validators.maxLength(100);
Validators.min(0);
Validators.max(100);
Validators.pattern(/^[A-Z]+$/);

// Compose validators
const emailValidator = Validators.compose(
	Validators.required(),
	Validators.email(),
	Validators.maxLength(255)
);

// Custom validator
const passwordMatch = createValidator((value, allValues) => {
	return value === allValues.password ? null : 'Passwords must match';
});

// Async custom validator
const usernameAvailable = createCustomValidator(async (value) => {
	const res = await fetch(`/api/check-username?name=${value}`);
	return (await res.json()).available;
}, 'Username is already taken');

// Use with dependencies
const form = useFormState({
	fields: {
		confirmPassword: {
			validator: passwordMatch,
			dependencies: ['password'] // Re-validate when password changes
		}
	}
});
```

### Transformers

Transform values on input:

```typescript
import { Transformers } from '@shelchin/formstate';

const form = useFormState({
	fields: {
		username: {
			transformer: Transformers.trim
		},
		code: {
			transformer: Transformers.toUpperCase
		},
		amount: {
			transformer: Transformers.toNumber
		},
		email: {
			transformer: Transformers.compose(Transformers.trim, Transformers.toLowerCase)
		}
	}
});
```

### PathUtils

Utility for working with nested paths:

```typescript
import { PathUtils } from '@shelchin/formstate';

const obj = { user: { addresses: [{ city: 'NYC' }] } };

PathUtils.get(obj, 'user.addresses[0].city'); // 'NYC'
PathUtils.set(obj, 'user.addresses[0].city', 'LA'); // Immutable update
PathUtils.delete(obj, 'user.addresses[0]'); // Remove array element
PathUtils.push(obj, 'user.addresses', { city: 'Boston' }); // Add to array
PathUtils.move(obj, 'user.addresses', 0, 1); // Reorder array
```

### Serialization

Safe serialization with BigInt, Date, Map, Set support:

```typescript
import { safeStringify, safeParse, cloneViaSerialization } from '@shelchin/formstate';

const data = {
	amount: 123456789012345678901234567890n,
	createdAt: new Date(),
	tags: new Set(['a', 'b']),
	metadata: new Map([['key', 'value']])
};

const json = safeStringify(data);
const restored = safeParse(json);

// Deep clone
const clone = cloneViaSerialization(data);
```

### Debounced Validation

Validate after input completion:

```typescript
const form = useFormState({
	fields: {
		search: {
			validateOnComplete: true,
			debounceMs: 300,
			completeCondition: (value) => value.length >= 3,
			validator: async (value) => {
				// Only runs after user stops typing for 300ms
				// and input is at least 3 characters
			}
		}
	}
});
```

## Components

| Component           | Description                        |
| ------------------- | ---------------------------------- |
| `Form`              | Form root, provides context        |
| `Field`             | Headless field component           |
| `FormField`         | Styled field component             |
| `FieldArray`        | Dynamic array field management     |
| `SchemaRenderer`    | Schema-driven form renderer        |
| `FieldLabel`        | Label component                    |
| `FieldErrorDisplay` | Error message display              |
| `FieldDescription`  | Help text/description              |
| `FieldValidating`   | Loading indicator during async     |

## Testing

```bash
# Run tests
bun run test

# Watch mode
bun run test:watch
```

The package includes comprehensive tests for:
- FormStateManager (69 tests)
- Validators (34 tests)
- Transformers (18 tests)
- PathUtils (27 tests)
- Serialization (25 tests)

## Architecture

```
packages/formstate/
├── src/
│   ├── core/                    # Framework-agnostic core
│   │   ├── interfaces.ts        # Type definitions
│   │   ├── FormStateManager.ts  # State management
│   │   ├── Validators.ts        # Validation system
│   │   └── Transformers.ts      # Value transformers
│   ├── utils/
│   │   ├── PathUtils.ts         # Path utilities
│   │   └── serialize.ts         # Safe serialization
│   └── adapters/
│       └── svelte/              # Svelte 5 adapter
│           ├── useFormState.svelte.ts
│           ├── schema.ts
│           └── components/
└── examples/                    # Example implementations
```

## License

MIT

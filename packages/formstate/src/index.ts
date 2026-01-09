/**
 * @shelchin/formstate
 * Interface-first form state management with headless components for Svelte 5
 *
 * @example Basic usage
 * ```typescript
 * import { useFormState, Validators } from '@shelchin/formstate';
 *
 * const form = useFormState({
 *   fields: {
 *     email: {
 *       defaultValue: '',
 *       validator: Validators.email()
 *     }
 *   }
 * });
 * ```
 *
 * @example Type-safe usage
 * ```typescript
 * import { useTypedFormState, Validators } from '@shelchin/formstate';
 *
 * interface LoginForm {
 *   email: string;
 *   password: string;
 * }
 *
 * const form = useTypedFormState<LoginForm>({
 *   initialValues: { email: '', password: '' },
 *   fields: {
 *     email: { validator: Validators.email() },
 *     password: { validator: Validators.minLength(8) }
 *   }
 * });
 *
 * // Full type inference and autocomplete
 * form.setValue('email', 'user@example.com');
 * ```
 *
 * @example With Zod validation
 * ```typescript
 * import { useFormState } from '@shelchin/formstate';
 * import { zodValidator } from '@shelchin/formstate/zod';
 * import { z } from 'zod';
 *
 * const form = useFormState({
 *   fields: {
 *     email: {
 *       defaultValue: '',
 *       validator: zodValidator(z.string().email())
 *     }
 *   }
 * });
 * ```
 */

// ============================================================
// Core Types and Interfaces
// ============================================================

export type {
	// Base types
	FieldValue,
	FieldPath,
	FieldError,
	// State interfaces
	IFieldState,
	IFieldConfig,
	IFormConfig,
	IFormObserver,
	// Core interfaces
	IFormStateManager,
	IValidator,
	IValidatorFactory,
	ITransformer,
	IPathUtils
} from './core/interfaces';

// ============================================================
// Type-Safe Path Utilities
// ============================================================

export type {
	/** Generate all valid paths from a type */
	Path,
	/** Get the value type at a given path */
	PathValue,
	/** Get only array paths */
	ArrayPath,
	/** Get the element type of an array at a path */
	ArrayPathValue,
	/** Recursively make all properties optional */
	DeepPartial,
	/** Get only leaf (primitive) paths */
	LeafPath,
	/** Create a record with path keys */
	PathRecord,
	/** Type-safe error record */
	TypedFieldErrors
} from './core/path-types';

// ============================================================
// Core Classes
// ============================================================

/** Low-level form state manager - use hooks for most cases */
export { FormStateManager } from './core/FormStateManager';

/** Path utilities for nested object access */
export { PathUtils } from './utils/PathUtils';

// ============================================================
// Validators
// ============================================================

/** Built-in validators factory */
export { Validators } from './core/Validators';

/** Create a custom validator */
export { createValidator, createCustomValidator } from './core/Validators';

// ============================================================
// Transformers
// ============================================================

/** Built-in transformers for input normalization */
export { Transformers } from './core/Transformers';

// ============================================================
// Svelte 5 Hooks
// ============================================================

/**
 * Create a reactive form state
 * @example
 * ```typescript
 * const form = useFormState({
 *   fields: {
 *     name: { defaultValue: '' }
 *   }
 * });
 * ```
 */
export { useFormState } from './adapters/svelte/useFormState.svelte';
export type { FormState } from './adapters/svelte/useFormState.svelte';

/**
 * Create a type-safe reactive form state with full TypeScript inference
 * @example
 * ```typescript
 * interface MyForm { name: string; age: number }
 * const form = useTypedFormState<MyForm>({
 *   initialValues: { name: '', age: 0 }
 * });
 * ```
 */
export { useTypedFormState } from './adapters/svelte/useTypedFormState.svelte';
export type {
	TypedFormConfig,
	TypedFormStateOptions,
	TypedFormState
} from './adapters/svelte/useTypedFormState.svelte';

// ============================================================
// Svelte Components (Headless)
// ============================================================

/** Form wrapper component */
export { default as Form } from './adapters/svelte/components/Form.svelte';

/** Generic field component with render props */
export { default as Field } from './adapters/svelte/components/Field.svelte';

/** Form field with built-in state binding */
export { default as FormField } from './adapters/svelte/components/FormField.svelte';

/** Dynamic array field management */
export { default as FieldArray } from './adapters/svelte/components/FieldArray.svelte';

/** Schema-driven form renderer */
export { default as SchemaRenderer } from './adapters/svelte/components/SchemaRenderer.svelte';

// Schema types
export type { FieldSchema, FormSchema, FieldType } from './adapters/svelte/schema';

// ============================================================
// UI Components (Optional)
// ============================================================

/** Field label component */
export { default as FieldLabel } from './adapters/svelte/components/ui/FieldLabel.svelte';

/** Field error display component */
export { default as FieldErrorDisplay } from './adapters/svelte/components/ui/FieldError.svelte';

/** Field description/help text component */
export { default as FieldDescription } from './adapters/svelte/components/ui/FieldDescription.svelte';

/** Field validating indicator component */
export { default as FieldValidating } from './adapters/svelte/components/ui/FieldValidating.svelte';

// ============================================================
// Utilities
// ============================================================

// Serialization utilities (for persistence)
export { safeStringify, safeParse, canSerialize, cloneViaSerialization } from './utils/serialize';

// ============================================================
// Development Tools
// ============================================================

/** Debug utilities - enable with localStorage.setItem('FORMSTATE_DEBUG', 'true') */
export { debug, enableDebug, disableDebug } from './utils/debug';

/** Development warnings and assertions */
export {
	DevWarnings,
	FormWarnings,
	WarningCodes,
	devAssert,
	checkPerformance
} from './utils/warnings';

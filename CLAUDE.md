# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit 2.0 application configured for deployment to Cloudflare. The project uses Svelte 5 with the new runes syntax and TypeScript.

## Development Commands

### Core Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Code Quality

```bash
# Run linting and formatting checks
npm run lint

# Auto-format code
npm run format

# Type checking
npm run check

# Continuous type checking
npm run check:watch
```

### Testing

```bash
# Run all tests (unit and e2e)
npm run test

# Run unit tests only
npm run test:unit

# Run unit tests in watch mode
npm run test:unit -- --watch

# Run specific test file
npm run test:unit -- src/routes/page.svelte.spec.ts

# Run e2e tests
npm run test:e2e
```

## Architecture

### Tech Stack

- **Framework**: SvelteKit 2.22 with Svelte 5
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Deployment**: Cloudflare adapter
- **Testing**: Vitest for unit tests, Playwright for e2e tests
- **Markdown Processing**: MDsveX for `.svx` files

### Project Structure

- `src/routes/` - SvelteKit file-based routing
  - `+page.svelte` - Route pages
  - `+layout.svelte` - Layout components
  - `*.svelte.spec.ts` - Component tests
- `src/lib/` - Shared components and utilities
- `e2e/` - End-to-end Playwright tests
- `static/` - Static assets served directly

### Key Configurations

- **Svelte 5 Runes**: Using new syntax with `$props()` and `$state()`
- **Testing Split**: Vitest configured with separate browser and server environments
- **MDsveX**: Enabled for mixing Markdown with Svelte components
- **Cloudflare Deployment**: Configured via `@sveltejs/adapter-cloudflare`

### Testing Strategy

- Component tests run in real browser environment via Playwright
- Server-side tests run in Node environment
- E2e tests build and preview the app before running

## TypeScript & Code Quality Guidelines

### IMPORTANT: Type Safety Requirements

**ALWAYS run `bun run lint` and `bun run check` before committing code.** All code must pass both checks without errors.

### Common Type Issues to Avoid

1. **Never use `any` type**
   - ❌ `let foo: any`
   - ✅ `let foo: SomeType` or use proper type inference
   - ✅ For errors: `error instanceof Error ? error.message : String(error)`

2. **Use Svelte 5 reactive collections**
   - ❌ `new Map()` or `new Set()`
   - ✅ `import { SvelteMap, SvelteSet } from 'svelte/reactivity'`
   - ✅ Use `SvelteMap` and `SvelteSet` for reactive collections in Svelte components

3. **Properly type component references**
   - ❌ `let editor: any`
   - ✅ `let editor: ComponentType | undefined`
   - ✅ Import the component type: `import type ComponentType from './Component.svelte'`

4. **Always add keys to #each blocks**
   - ❌ `{#each items as item}`
   - ✅ `{#each items as item (item.id)}`
   - Use unique identifiers for keys

5. **Define all interfaces in types.ts files**
   - Keep type definitions centralized
   - Export all interfaces that are used across files
   - Import types where needed, don't duplicate definitions
   - **IMPORTANT**: Ensure interface properties match actual usage in code
   - Add all properties that are being accessed, including optional ones

6. **Handle null/undefined checks properly**
   - ❌ `if (result.isValid) { editingNetwork.name = ... }` (editingNetwork possibly null)
   - ✅ `if (result.isValid && editingNetwork) { const network = editingNetwork; network.name = ... }`
   - Use optional chaining: `obj?.property`
   - Use nullish coalescing: `value ?? defaultValue`
   - Create local constants to preserve non-null references in scope

7. **Type external library imports correctly**
   - ❌ `targetAddress` (string) where `Address` type expected
   - ✅ `import type { Address } from 'viem'` then `targetAddress as Address`
   - Import types from libraries: `import type { Address } from 'viem'`
   - Cast strings to library types when needed: `value as LibraryType`

8. **Use proper TypeScript utility types**
   - `Record<K, V>` for object maps with known key/value types
   - `Partial<T>` for optional properties
   - `Pick<T, K>` and `Omit<T, K>` for type transformations

9. **Handle bigint conversions**
   - ❌ `gasUsed: '0.001'` (string where bigint expected)
   - ✅ `gasUsed: BigInt(1000000000000000)` or `BigInt(Math.floor(...))`
   - Convert bigint to number for display: `Number(bigintValue)`
   - Use BigInt() constructor for string/number to bigint conversion

10. **Remove unused imports and variables**
    - ESLint will catch these - don't ignore them
    - Remove unused variables immediately
    - Remove unused imports to keep code clean
    - This includes functions, components, and types that aren't referenced

11. **Fix array type mismatches**
    - ❌ `invalidKeys: items.map(k => k.key)` when expecting `{ key: string }[]`
    - ✅ `invalidKeys: items` (keep original array structure if it matches type)
    - Ensure mapped arrays match the expected interface structure

### Pre-Commit Checklist

Before committing any code changes:

- [ ] Run `bun run lint` - must pass with 0 errors
- [ ] Run `bun run check` - must pass with 0 errors (warnings are acceptable)
- [ ] No `any` types in the code
- [ ] All `#each` blocks have unique keys
- [ ] All reactive collections use `SvelteMap`/`SvelteSet`
- [ ] All interfaces are properly defined and exported

### When Adding New Features

1. Define types first in the appropriate `types.ts` file
2. Import necessary types from libraries (`viem`, `svelte`, etc.)
3. Use strict TypeScript - avoid type assertions unless absolutely necessary
4. Test type safety with `bun run check` during development

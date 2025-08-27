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
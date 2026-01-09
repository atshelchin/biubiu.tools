/**
 * Package Demo Components
 * Reusable components for creating consistent package demo pages.
 */

// Layout components
export { default as PackageDemoLayout } from './package-demo-layout.svelte';
export { default as DemoSection } from './demo-section.svelte';
export { default as DemoContent } from './demo-content.svelte';

// UI components
export { default as CodeBlock } from './code-block.svelte';
export { default as TaskStatusBadge } from './task-status-badge.svelte';
export { default as TaskStatusIcon } from './task-status-icon.svelte';
export { default as ProgressBar } from './progress-bar.svelte';
export { default as DemoEmptyState } from './demo-empty-state.svelte';
export { default as StatCard } from './stat-card.svelte';

// Form components
export { default as InputGroup } from './input-group.svelte';
export { default as ActionButtons } from './action-buttons.svelte';
export { default as DemoButton } from './demo-button.svelte';
export { default as IconButton } from './icon-button.svelte';

// Re-export types
export type { TaskStatus } from './task-status-badge.svelte';
export type { StatVariant } from './stat-card.svelte';

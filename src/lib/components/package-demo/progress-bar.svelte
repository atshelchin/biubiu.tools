<script lang="ts">
	/**
	 * Progress Bar
	 * A reusable progress bar component with customizable appearance.
	 */

	interface Props {
		progress: number;
		color?: string;
		size?: 'sm' | 'md' | 'lg';
		showLabel?: boolean;
		class?: string;
	}

	let {
		progress,
		color = 'var(--color-primary)',
		size = 'md',
		showLabel = false,
		class: className = ''
	}: Props = $props();

	const clampedProgress = $derived(Math.min(100, Math.max(0, progress)));
</script>

<div class="progress-container {className}">
	<div class="progress-bar size-{size}">
		<div class="progress-fill" style="width: {clampedProgress}%; background: {color}"></div>
	</div>
	{#if showLabel}
		<span class="progress-label">{clampedProgress}%</span>
	{/if}
</div>

<style>
	.progress-container {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.progress-bar {
		flex: 1;
		background: var(--color-panel-2);
		border-radius: var(--radius-full);
		overflow: hidden;
	}

	.progress-bar.size-sm {
		height: 4px;
	}

	.progress-bar.size-md {
		height: 8px;
	}

	.progress-bar.size-lg {
		height: 12px;
	}

	.progress-fill {
		height: 100%;
		border-radius: var(--radius-full);
		transition: width 0.3s ease;
	}

	.progress-label {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		min-width: 3ch;
		text-align: right;
	}
</style>

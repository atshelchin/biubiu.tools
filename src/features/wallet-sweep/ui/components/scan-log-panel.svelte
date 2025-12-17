<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import type { ScanEvent, ScanEventType } from '$lib/services/balance-scanner/types';
	import { ChevronDown, ChevronUp, Terminal, Trash2 } from '@lucide/svelte';

	interface Props {
		/** Array of scan events to display */
		events: ScanEvent[];
		/** Maximum number of events to show (default: 100) */
		maxEvents?: number;
		/** Title for the log panel */
		title?: string;
		/** Whether the panel is initially collapsed */
		collapsed?: boolean;
		/** Callback to clear logs */
		onClear?: () => void;
	}

	let { events, maxEvents = 100, title = 'Scan Log', collapsed = false, onClear }: Props = $props();

	let isCollapsed = $state(collapsed);
	let logContainer: HTMLDivElement | undefined = $state();

	// Get icon and color for each event type
	function getEventStyle(type: ScanEventType): { icon: string; color: string; bgColor: string } {
		switch (type) {
			case 'scan_started':
				return { icon: '🚀', color: 'var(--color-primary)', bgColor: 'var(--color-primary-muted)' };
			case 'scan_completed':
				return { icon: '✅', color: 'var(--color-success)', bgColor: 'var(--color-success-muted)' };
			case 'batch_started':
				return { icon: '📦', color: 'var(--color-info)', bgColor: 'var(--color-info-muted)' };
			case 'batch_completed':
				return { icon: '✓', color: 'var(--color-success)', bgColor: 'var(--color-success-muted)' };
			case 'batch_failed':
				return { icon: '❌', color: 'var(--color-error)', bgColor: 'var(--color-error-muted)' };
			case 'task_success':
				return { icon: '·', color: 'var(--color-muted-foreground)', bgColor: 'transparent' };
			case 'task_failed':
				return { icon: '!', color: 'var(--color-warning)', bgColor: 'var(--color-warning-muted)' };
			case 'rpc_switched':
				return { icon: '🔀', color: 'var(--color-info)', bgColor: 'var(--color-info-muted)' };
			case 'rate_limited':
				return { icon: '⚠️', color: 'var(--color-warning)', bgColor: 'var(--color-warning-muted)' };
			case 'retrying':
				return { icon: '🔄', color: 'var(--color-info)', bgColor: 'var(--color-info-muted)' };
			case 'scan_paused':
				return { icon: '⏸️', color: 'var(--color-warning)', bgColor: 'var(--color-warning-muted)' };
			case 'scan_resumed':
				return { icon: '▶️', color: 'var(--color-success)', bgColor: 'var(--color-success-muted)' };
			case 'progress_update':
				return { icon: '📊', color: 'var(--color-muted-foreground)', bgColor: 'transparent' };
			case 'recovery_started':
				return { icon: '🔧', color: 'var(--color-warning)', bgColor: 'var(--color-warning-muted)' };
			case 'recovery_waiting':
				return { icon: '⏳', color: 'var(--color-warning)', bgColor: 'var(--color-warning-muted)' };
			case 'recovery_attempt':
				return { icon: '🔄', color: 'var(--color-info)', bgColor: 'var(--color-info-muted)' };
			case 'recovery_success':
				return { icon: '✅', color: 'var(--color-success)', bgColor: 'var(--color-success-muted)' };
			case 'recovery_failed':
				return { icon: '❌', color: 'var(--color-error)', bgColor: 'var(--color-error-muted)' };
			default:
				return {
					icon: '·',
					color: 'var(--color-muted-foreground)',
					bgColor: 'transparent'
				};
		}
	}

	// Format timestamp
	function formatTime(timestamp: number): string {
		const date = new Date(timestamp);
		return date.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
	}

	// Get visible events (limited and reversed for newest first)
	let visibleEvents = $derived(events.slice(-maxEvents).reverse());

	// Auto-scroll to bottom when new events arrive
	$effect(() => {
		if (logContainer && events.length > 0 && !isCollapsed) {
			// Scroll to top since we're showing newest first
			logContainer.scrollTop = 0;
		}
	});

	function toggleCollapse() {
		isCollapsed = !isCollapsed;
	}

	function handleClear() {
		onClear?.();
	}
</script>

<div class="scan-log-panel">
	<button class="panel-header" onclick={toggleCollapse} type="button">
		<div class="header-left">
			<Terminal size={16} />
			<span class="panel-title">{title}</span>
			{#if events.length > 0}
				<span class="event-count">({events.length})</span>
			{/if}
		</div>
		<div class="header-right">
			{#if events.length > 0 && onClear}
				<button
					class="clear-btn"
					onclick={(e) => {
						e.stopPropagation();
						handleClear();
					}}
					title="Clear logs"
					type="button"
				>
					<Trash2 size={14} />
				</button>
			{/if}
			{#if isCollapsed}
				<ChevronDown size={16} />
			{:else}
				<ChevronUp size={16} />
			{/if}
		</div>
	</button>

	{#if !isCollapsed}
		<div class="log-container" bind:this={logContainer} transition:slide={{ duration: 200 }}>
			{#if visibleEvents.length === 0}
				<div class="empty-state">
					<span>No events yet</span>
				</div>
			{:else}
				{#each visibleEvents as event (event.timestamp + event.type + event.message)}
					{@const style = getEventStyle(event.type)}
					<div
						class="log-entry"
						style="--entry-color: {style.color}; --entry-bg: {style.bgColor}"
						transition:fade={{ duration: 150 }}
					>
						<span class="log-time">{formatTime(event.timestamp)}</span>
						<span class="log-icon">{style.icon}</span>
						<span class="log-message">{event.message}</span>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.scan-log-panel {
		display: flex;
		flex-direction: column;
		background: var(--color-background);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		overflow: hidden;
	}

	.panel-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-2) var(--space-3);
		background: var(--color-muted);
		border: none;
		cursor: pointer;
		transition: background 0.2s ease;
		width: 100%;
		text-align: left;
	}

	.panel-header:hover {
		background: color-mix(in srgb, var(--color-muted) 80%, var(--color-foreground) 5%);
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-foreground);
	}

	.panel-title {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
	}

	.event-count {
		font-size: var(--text-xs);
		color: var(--color-muted-foreground);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-muted-foreground);
	}

	.clear-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-1);
		border: none;
		background: transparent;
		color: var(--color-muted-foreground);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all 0.2s ease;
	}

	.clear-btn:hover {
		background: var(--color-background);
		color: var(--color-error);
	}

	.log-container {
		max-height: 300px;
		overflow-y: auto;
		font-family: var(--font-mono, monospace);
		font-size: var(--text-xs);
		line-height: 1.5;
	}

	.empty-state {
		padding: var(--space-4);
		text-align: center;
		color: var(--color-muted-foreground);
		font-size: var(--text-sm);
	}

	.log-entry {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		padding: var(--space-1-5) var(--space-3);
		border-bottom: 1px solid var(--color-border);
		background: var(--entry-bg, transparent);
	}

	.log-entry:last-child {
		border-bottom: none;
	}

	.log-time {
		flex-shrink: 0;
		color: var(--color-muted-foreground);
		opacity: 0.7;
	}

	.log-icon {
		flex-shrink: 0;
		width: 1.25em;
		text-align: center;
	}

	.log-message {
		flex: 1;
		color: var(--entry-color, var(--color-foreground));
		word-break: break-word;
	}

	/* Scrollbar styling */
	.log-container::-webkit-scrollbar {
		width: 6px;
	}

	.log-container::-webkit-scrollbar-track {
		background: var(--color-muted);
	}

	.log-container::-webkit-scrollbar-thumb {
		background: var(--color-border);
		border-radius: 3px;
	}

	.log-container::-webkit-scrollbar-thumb:hover {
		background: var(--color-muted-foreground);
	}
</style>

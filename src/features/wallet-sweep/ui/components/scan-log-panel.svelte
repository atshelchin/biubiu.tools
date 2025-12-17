<script lang="ts">
	import { fade, slide } from 'svelte/transition';
	import type { ScanEvent, ScanEventType } from '$lib/services/balance-scanner/types';
	import { ChevronDown, ChevronUp, Terminal, Trash2, Copy, Check } from '@lucide/svelte';

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
		/** Scan rate in addresses per second (optional) */
		scanRate?: number;
	}

	let {
		events,
		maxEvents = 1000,
		title = 'Scan Log',
		collapsed = false,
		onClear,
		scanRate = 0
	}: Props = $props();

	let isCollapsed = $state(collapsed);
	let logContainer: HTMLDivElement | undefined = $state();
	let isHovered = $state(false);
	let isCopied = $state(false);

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

	// Auto-scroll to top when new events arrive (only if not hovered)
	$effect(() => {
		if (logContainer && events.length > 0 && !isCollapsed && !isHovered) {
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

	// Format event for text export
	function formatEventForExport(event: ScanEvent): string {
		const time = formatTime(event.timestamp);
		let line = `[${time}] ${event.message}`;

		if (event.details) {
			const details = event.details;
			const parts: string[] = [];

			if (details.rpcUrl) parts.push(`RPC: ${details.rpcUrl}`);
			if (details.addressRange) parts.push(`Addresses: ${details.addressRange}`);
			if (details.error) parts.push(`Error: ${details.error}`);

			if (parts.length > 0) {
				line += ` | ${parts.join(' | ')}`;
			}
		}

		return line;
	}

	// Copy all logs to clipboard
	async function handleCopyLogs() {
		const logText = events.map(formatEventForExport).join('\n');

		try {
			await navigator.clipboard.writeText(logText);
			isCopied = true;
			setTimeout(() => {
				isCopied = false;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy logs:', err);
		}
	}

	// Get RPC name from event details
	function getRpcName(event: ScanEvent): string | undefined {
		if (!event.details) return undefined;
		return (event.details.rpcName as string) || undefined;
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
			{#if scanRate > 0}
				<span class="scan-rate">{scanRate} addr/s</span>
			{/if}
		</div>
		<div class="header-right">
			{#if events.length > 0}
				<button
					class="action-btn copy-btn"
					onclick={(e) => {
						e.stopPropagation();
						handleCopyLogs();
					}}
					title={isCopied ? 'Copied!' : 'Copy logs'}
					type="button"
				>
					{#if isCopied}
						<Check size={14} />
					{:else}
						<Copy size={14} />
					{/if}
				</button>
			{/if}
			{#if events.length > 0 && onClear}
				<button
					class="action-btn clear-btn"
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
		<div
			class="log-container"
			bind:this={logContainer}
			transition:slide={{ duration: 200 }}
			onmouseenter={() => (isHovered = true)}
			onmouseleave={() => (isHovered = false)}
		>
			{#if visibleEvents.length === 0}
				<div class="empty-state">
					<span>No events yet</span>
				</div>
			{:else}
				{#each visibleEvents as event (event.timestamp + event.type + event.message)}
					{@const style = getEventStyle(event.type)}
					{@const rpcName = getRpcName(event)}
					<div
						class="log-entry"
						style="--entry-color: {style.color}; --entry-bg: {style.bgColor}"
						transition:fade={{ duration: 150 }}
					>
						<div class="log-main-row">
							<span class="log-time">{formatTime(event.timestamp)}</span>
							<span class="log-icon">{style.icon}</span>
							<span class="log-message">{event.message}</span>
						</div>
						{#if rpcName}
							<div class="log-details-row">
								<span class="log-icon">🌐</span>
								<span class="rpc-badge" title={event.details?.rpcUrl as string}>{rpcName}</span>
							</div>
						{/if}
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

	.scan-rate {
		font-size: var(--text-xs);
		color: var(--color-success);
		font-weight: var(--font-medium);
		padding: 0 var(--space-1-5);
		background: var(--color-success-muted);
		border-radius: var(--radius-sm);
	}

	.header-right {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--color-muted-foreground);
	}

	.action-btn {
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

	.action-btn:hover {
		background: var(--color-background);
	}

	.copy-btn:hover {
		color: var(--color-primary);
	}

	.clear-btn:hover {
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
		flex-direction: column;
		gap: var(--space-1);
		padding: var(--space-1-5) var(--space-3);
		border-bottom: 1px solid var(--color-border);
		background: var(--entry-bg, transparent);
	}

	.log-entry:last-child {
		border-bottom: none;
	}

	.log-main-row {
		display: flex;
		align-items: flex-start;
		gap: var(--space-2);
		min-width: 0;
	}

	.log-time {
		flex-shrink: 0;
		color: var(--color-muted-foreground);
		opacity: 0.7;
		white-space: nowrap;
	}

	.log-icon {
		flex-shrink: 0;
		width: 1.25em;
		text-align: center;
	}

	.log-message {
		flex: 1;
		min-width: 0;
		color: var(--entry-color, var(--color-foreground));
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.log-entry:hover .log-message {
		white-space: normal;
		word-break: break-word;
		overflow: visible;
	}

	.log-details-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		padding-left: calc(8ch + var(--space-2));
	}

	.rpc-badge {
		font-size: 0.65rem;
		padding: 0 var(--space-1-5);
		background: var(--color-muted);
		color: var(--color-muted-foreground);
		border-radius: var(--radius-sm);
		cursor: help;
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

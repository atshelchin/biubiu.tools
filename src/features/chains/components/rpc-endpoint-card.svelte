<script lang="ts">
	import { WifiOff, Shield, ShieldAlert, ShieldQuestion, Github, Zap } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import CopyButton from '$lib/components/ui/copy-button.svelte';
	import type { ParsedRpcEndpoint, RpcLatencyResult } from '../types';

	interface Props {
		endpoint: ParsedRpcEndpoint;
		latencyResult?: RpcLatencyResult;
		index: number;
	}

	let { endpoint, latencyResult, index }: Props = $props();

	const i18n = useI18n();

	// Tracking badge color
	const trackingColors: Record<string, string> = {
		none: '#22c55e',
		limited: '#eab308',
		yes: '#ef4444',
		unspecified: '#6b7280'
	};

	const trackingColor = $derived(trackingColors[endpoint.tracking] || trackingColors.unspecified);

	// Latency status
	const latencyStatus = $derived(() => {
		if (!latencyResult) return 'unknown';
		if (latencyResult.latency === null) return 'error';
		if (latencyResult.latency < 100) return 'fast';
		if (latencyResult.latency < 300) return 'medium';
		return 'slow';
	});

	const latencyColor = $derived(() => {
		const status = latencyStatus();
		switch (status) {
			case 'fast':
				return '#22c55e';
			case 'medium':
				return '#eab308';
			case 'slow':
				return '#ef4444';
			case 'error':
				return '#ef4444';
			default:
				return '#6b7280';
		}
	});
</script>

<div class="rpc-card" style="--index: {index}; --tracking-color: {trackingColor}">
	<!-- URL and Copy -->
	<div class="url-row">
		<div class="url-container">
			{#if endpoint.isWebSocket}
				<span class="protocol-badge ws">WSS</span>
			{:else}
				<span class="protocol-badge http">HTTPS</span>
			{/if}
			<code class="url">{endpoint.url}</code>
		</div>
		<CopyButton value={endpoint.url} class="copy-btn" />
	</div>

	<!-- Status Row -->
	<div class="status-row">
		<!-- Tracking Status -->
		<div class="status-item" title={i18n.t('routes/chains.tracking_info')}>
			{#if endpoint.tracking === 'none'}
				<Shield class="status-icon" style="color: {trackingColor}" />
				<span class="status-text" style="color: {trackingColor}"
					>{i18n.t('routes/chains.no_tracking')}</span
				>
			{:else if endpoint.tracking === 'limited'}
				<ShieldAlert class="status-icon" style="color: {trackingColor}" />
				<span class="status-text" style="color: {trackingColor}"
					>{i18n.t('routes/chains.limited_tracking')}</span
				>
			{:else if endpoint.tracking === 'yes'}
				<ShieldAlert class="status-icon" style="color: {trackingColor}" />
				<span class="status-text" style="color: {trackingColor}"
					>{i18n.t('routes/chains.has_tracking')}</span
				>
			{:else}
				<ShieldQuestion class="status-icon" style="color: {trackingColor}" />
				<span class="status-text" style="color: {trackingColor}"
					>{i18n.t('routes/chains.unknown_tracking')}</span
				>
			{/if}
		</div>

		<!-- Open Source -->
		{#if endpoint.isOpenSource}
			<div class="status-item">
				<Github class="status-icon" style="color: #a855f7" />
				<span class="status-text" style="color: #a855f7">{i18n.t('routes/chains.open_source')}</span>
			</div>
		{/if}

		<!-- Latency (if available) -->
		{#if latencyResult}
			<div class="status-item latency" title={i18n.t('routes/chains.latency_info')}>
				{#if latencyResult.latency !== null}
					<Zap class="status-icon" style="color: {latencyColor()}" />
					<span class="status-text" style="color: {latencyColor()}">{latencyResult.latency}ms</span>
				{:else}
					<WifiOff class="status-icon" style="color: {latencyColor()}" />
					<span class="status-text" style="color: {latencyColor()}">{i18n.t('routes/chains.offline')}</span
					>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	.rpc-card {
		position: relative;
		padding: var(--space-4);
		background: var(--color-panel-1);
		border: 1px solid var(--color-panel-border-2);
		border-radius: var(--radius-lg);
		animation: fadeIn 0.3s calc(var(--index) * 0.02s) both;
		transition: all 0.2s ease;
	}

	:global(.light) .rpc-card {
		background: var(--color-panel-2);
	}

	.rpc-card:hover {
		border-color: var(--tracking-color);
		box-shadow: 0 4px 12px rgb(0 0 0 / 0.08);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.url-row {
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.url-container {
		flex: 1;
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
	}

	.protocol-badge {
		flex-shrink: 0;
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		font-weight: var(--font-semibold);
		text-transform: uppercase;
		letter-spacing: 0.02em;
	}

	.protocol-badge.http {
		background: color-mix(in srgb, #3b82f6 15%, transparent);
		color: #3b82f6;
	}

	.protocol-badge.ws {
		background: color-mix(in srgb, #8b5cf6 15%, transparent);
		color: #8b5cf6;
	}

	.url {
		flex: 1;
		min-width: 0;
		font-family: var(--font-mono);
		font-size: var(--text-sm);
		color: var(--color-heading-2);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Override CopyButton styles for this card */
	:global(.copy-btn) {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
	}

	:global(.light .copy-btn) {
		background: var(--color-panel-1);
	}

	:global(.copy-btn:hover) {
		background: var(--color-panel-3);
		border-color: var(--color-panel-border-3);
	}

	.status-row {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-3);
		padding-top: var(--space-3);
		border-top: 1px solid var(--color-panel-border-1);
	}

	.status-item {
		display: flex;
		align-items: center;
		gap: var(--space-1-5);
	}

	.status-item :global(.status-icon) {
		width: 14px;
		height: 14px;
	}

	.status-text {
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
	}

	@media (max-width: 640px) {
		.rpc-card {
			padding: var(--space-3);
		}

		.url-container {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-1-5);
		}

		.url {
			font-size: var(--text-xs);
			max-width: 100%;
		}

		:global(.copy-btn) {
			width: 32px;
			height: 32px;
		}

		.status-row {
			gap: var(--space-2);
			margin-top: var(--space-2);
			padding-top: var(--space-2);
		}

		.status-item :global(.status-icon) {
			width: 12px;
			height: 12px;
		}

		.status-text {
			font-size: 10px;
		}
	}
</style>

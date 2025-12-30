<script lang="ts">
	import { ExternalLink, Shield, ShieldAlert, ShieldQuestion } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import { onMount } from 'svelte';
	import type { RpcEndpoint, RpcTestResult, Explorer } from '../types/chain';
	import { formatLatency, formatBlockHeight, getLatencyQuality } from '../utils/rpc-tester';
	import CopyButton from '$lib/components/ui/copy-button.svelte';

	type RpcProtocol = 'https' | 'wss';

	// Detect mobile screen
	let isMobile = $state(false);

	onMount(() => {
		const checkMobile = () => {
			isMobile = window.innerWidth <= 640;
		};
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});

	// Truncate URL for mobile display (max 40 chars)
	function truncateUrl(url: string, maxLength = 40): string {
		if (url.length <= maxLength) return url;
		return url.slice(0, maxLength) + '...';
	}

	interface Props {
		rpcEndpoints: RpcEndpoint[];
		explorers?: Explorer[];
		testResults: Map<string, RpcTestResult>;
		testResultsVersion: number; // Used to trigger re-sorting when results change
		isTesting: boolean;
	}

	let { rpcEndpoints, explorers, testResults, testResultsVersion, isTesting }: Props = $props();

	const i18n = useI18n();

	let rpcProtocol = $state<RpcProtocol>('https');

	// Filter endpoints by protocol
	function isHttpEndpoint(url: string): boolean {
		return url.startsWith('http://') || url.startsWith('https://');
	}

	function isWssEndpoint(url: string): boolean {
		return url.startsWith('wss://') || url.startsWith('ws://');
	}

	// Count endpoints by protocol
	const httpsCount = $derived(rpcEndpoints.filter((r) => isHttpEndpoint(r.url)).length);
	const wssCount = $derived(rpcEndpoints.filter((r) => isWssEndpoint(r.url)).length);

	function getPrivacyIcon(tracking: RpcEndpoint['tracking']) {
		switch (tracking) {
			case 'none':
				return Shield;
			case 'limited':
			case 'yes':
				return ShieldAlert;
			default:
				return ShieldQuestion;
		}
	}

	function getPrivacyLabel(tracking: RpcEndpoint['tracking']): string {
		switch (tracking) {
			case 'none':
				return i18n.t('routes/apps/chainlist.rpc.privacy_none');
			case 'limited':
				return i18n.t('routes/apps/chainlist.rpc.privacy_limited');
			case 'yes':
				return i18n.t('routes/apps/chainlist.rpc.privacy_yes');
			default:
				return i18n.t('routes/apps/chainlist.rpc.privacy_unknown');
		}
	}

	// Sort RPC endpoints: successful first (by latency), then failed
	// Use testResultsVersion to trigger re-sorting when results change
	const sortedEndpoints = $derived.by(() => {
		// Access version to create dependency
		void testResultsVersion;

		// Filter by protocol first
		const filtered = rpcEndpoints.filter((endpoint) => {
			if (rpcProtocol === 'https') {
				return isHttpEndpoint(endpoint.url);
			} else {
				return isWssEndpoint(endpoint.url);
			}
		});

		return [...filtered].sort((a, b) => {
			const resultA = testResults.get(a.url);
			const resultB = testResults.get(b.url);

			// If both have results
			if (resultA && resultB) {
				// Success comes before failed
				if (resultA.status === 'success' && resultB.status !== 'success') return -1;
				if (resultA.status !== 'success' && resultB.status === 'success') return 1;

				// Both success: sort by latency
				if (resultA.status === 'success' && resultB.status === 'success') {
					return (resultA.latency ?? Infinity) - (resultB.latency ?? Infinity);
				}
			}

			// If only one has result, prioritize it
			if (resultA && !resultB) return -1;
			if (!resultA && resultB) return 1;

			return 0;
		});
	});
</script>

<div class="rpc-list-container">
	{#if explorers && explorers.length > 0}
		<div class="explorers-section">
			<span class="explorers-label">{i18n.t('routes/apps/chainlist.explorers')}:</span>
			<div class="explorers-list">
				{#each explorers as explorer (explorer.url)}
					<a href={explorer.url} target="_blank" rel="noopener noreferrer" class="explorer-link">
						{explorer.name}
						<ExternalLink size={12} />
					</a>
				{/each}
			</div>
		</div>
	{/if}

	<div class="rpc-table-wrapper">
		<table class="rpc-table">
			<thead>
				<tr>
					<th class="col-url">
						<div class="url-header">
							<span>{i18n.t('routes/apps/chainlist.rpc.url')}</span>
							<div class="protocol-toggle">
								<button
									class="protocol-btn"
									class:active={rpcProtocol === 'https'}
									onclick={() => (rpcProtocol = 'https')}
									title="HTTPS ({httpsCount})"
								>
									HTTPS
									<span class="protocol-count">{httpsCount}</span>
								</button>
								{#if wssCount > 0}
									<button
										class="protocol-btn"
										class:active={rpcProtocol === 'wss'}
										onclick={() => (rpcProtocol = 'wss')}
										title="WSS ({wssCount})"
									>
										WSS
										<span class="protocol-count">{wssCount}</span>
									</button>
								{/if}
							</div>
						</div>
					</th>
					<th class="col-height">{i18n.t('routes/apps/chainlist.rpc.height')}</th>
					<th class="col-latency">{i18n.t('routes/apps/chainlist.rpc.latency')}</th>
					<th class="col-privacy">{i18n.t('routes/apps/chainlist.rpc.privacy')}</th>
				</tr>
			</thead>
			<tbody>
				{#each sortedEndpoints as endpoint (endpoint.url)}
					{@const result = testResults.get(endpoint.url)}
					{@const PrivacyIcon = getPrivacyIcon(endpoint.tracking)}
					<tr class:failed={result?.status === 'failed'}>
						<td class="col-url">
							<div class="url-cell">
								<span class="url-text" title={endpoint.url}>
									{isMobile ? truncateUrl(endpoint.url) : endpoint.url}
								</span>
								<CopyButton value={endpoint.url} size={14} class="rpc-copy-btn" />
							</div>
						</td>
						<td class="col-height" data-label={i18n.t('routes/apps/chainlist.rpc.height')}>
							{#if isTesting && !result}
								<span class="testing-indicator"></span>
							{:else if result?.status === 'success'}
								{formatBlockHeight(result.blockHeight)}
							{:else if result?.status === 'failed'}
								<span class="failed-text">-</span>
							{:else}
								-
							{/if}
						</td>
						<td class="col-latency" data-label={i18n.t('routes/apps/chainlist.rpc.latency')}>
							{#if isTesting && !result}
								<span class="testing-indicator"></span>
							{:else if result?.status === 'success'}
								<span class="latency latency-{getLatencyQuality(result.latency)}">
									{formatLatency(result.latency)}
								</span>
							{:else if result?.status === 'failed'}
								<span class="failed-text" title={result.error}
									>{i18n.t('routes/apps/chainlist.rpc.failed')}</span
								>
							{:else}
								-
							{/if}
						</td>
						<td class="col-privacy" data-label={i18n.t('routes/apps/chainlist.rpc.privacy')}>
							<span
								class="privacy-badge privacy-{endpoint.tracking}"
								title={getPrivacyLabel(endpoint.tracking)}
							>
								<PrivacyIcon size={14} />
								<span class="privacy-label">{getPrivacyLabel(endpoint.tracking)}</span>
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.rpc-list-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		max-width: 100%;
		overflow: hidden;
	}

	.rpc-table-wrapper {
		overflow-x: auto;
		border-radius: var(--radius-md);
		border: 1px solid var(--color-border);
	}

	.rpc-table {
		width: 100%;
		border-collapse: collapse;
		font-size: var(--text-sm);
		table-layout: fixed;
	}

	.rpc-table th,
	.rpc-table td {
		padding: var(--space-3) var(--space-4);
		text-align: left;
		border-bottom: 1px solid var(--color-border);
	}

	.rpc-table th {
		background: var(--color-panel-1);
		font-weight: var(--font-semibold);
		color: var(--color-muted-foreground);
		font-size: var(--text-xs);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.rpc-table tbody tr {
		background: var(--color-panel-0);
		transition: background 0.2s ease;
	}

	.rpc-table tbody tr:hover {
		background: var(--color-panel-1);
	}

	.rpc-table tbody tr:last-child td {
		border-bottom: none;
	}

	.rpc-table tbody tr.failed {
		opacity: 0.6;
	}

	.col-url {
		width: 50%;
		overflow: hidden;
	}

	.col-height {
		width: 100px;
	}

	.col-latency {
		width: 100px;
	}

	.col-privacy {
		width: 120px;
	}

	.url-header {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
	}

	.protocol-toggle {
		display: flex;
		gap: var(--space-1);
		background: var(--color-panel-2);
		padding: 2px;
		border-radius: var(--radius-sm);
	}

	.protocol-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border: none;
		background: transparent;
		border-radius: var(--radius-xs);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.15s ease;
		text-transform: uppercase;
	}

	.protocol-btn:hover {
		color: var(--color-foreground);
	}

	.protocol-btn.active {
		background: var(--color-background);
		color: var(--color-foreground);
		box-shadow: var(--shadow-sm);
	}

	.protocol-count {
		font-size: 10px;
		opacity: 0.7;
	}

	.url-text {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: var(--font-mono);
		font-size: var(--text-xs);
	}

	.col-height,
	.col-latency {
		white-space: nowrap;
		font-family: var(--font-mono);
	}

	.col-privacy {
		white-space: nowrap;
	}

	.url-cell {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		min-width: 0;
		overflow: hidden;
	}

	:global(.rpc-copy-btn) {
		width: 28px !important;
		height: 28px !important;
		flex-shrink: 0;
	}

	@media (max-width: 640px) {
		:global(.rpc-copy-btn) {
			width: 24px !important;
			height: 24px !important;
		}
	}

	.testing-indicator {
		display: inline-block;
		width: 16px;
		height: 16px;
		border: 2px solid var(--color-border);
		border-top-color: var(--color-brand);
		border-radius: 50%;
		animation: spin 0.8s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.latency {
		display: inline-block;
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		font-weight: var(--font-medium);
	}

	.latency-good {
		background: var(--color-success-alpha-20);
		color: var(--color-success);
	}

	.latency-medium {
		background: var(--color-warning-alpha-20);
		color: var(--color-warning);
	}

	.latency-slow {
		background: var(--color-danger-alpha-20);
		color: var(--color-danger);
	}

	.failed-text {
		color: var(--color-danger);
	}

	.privacy-badge {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
	}

	.privacy-none {
		background: var(--color-success-alpha-20);
		color: var(--color-success);
	}

	.privacy-limited {
		background: var(--color-warning-alpha-20);
		color: var(--color-warning);
	}

	.privacy-yes {
		background: var(--color-danger-alpha-20);
		color: var(--color-danger);
	}

	.privacy-unspecified {
		background: var(--color-panel-2);
		color: var(--color-muted-foreground);
	}

	.privacy-label {
		display: none;
	}

	@media (min-width: 768px) {
		.privacy-label {
			display: inline;
		}
	}

	/* Mobile responsive - card layout */
	@media (max-width: 640px) {
		.rpc-table-wrapper {
			border: none;
			border-radius: 0;
		}

		.rpc-table {
			display: block;
		}

		.rpc-table thead {
			display: none;
		}

		.rpc-table tbody {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);
		}

		.rpc-table tbody tr {
			display: flex;
			flex-direction: column;
			gap: var(--space-2);
			padding: var(--space-3);
			border: 1px solid var(--color-border);
			border-radius: var(--radius-md);
			background: var(--color-panel-0);
		}

		.rpc-table tbody tr:hover {
			background: var(--color-panel-1);
		}

		.rpc-table td {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0;
			border: none;
		}

		.rpc-table td::before {
			content: attr(data-label);
			font-size: var(--text-xs);
			font-weight: var(--font-medium);
			color: var(--color-muted-foreground);
			text-transform: uppercase;
		}

		.col-url {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-2);
			max-width: none;
			width: 100%;
		}

		.col-url::before {
			display: none;
		}

		.col-height,
		.col-latency,
		.col-privacy {
			width: 100%;
		}

		.url-cell {
			width: 100%;
			justify-content: space-between;
		}

		.url-text {
			flex: 1;
			min-width: 0;
			max-width: calc(100vw - 120px);
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		.url-header {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}

		.protocol-toggle {
			width: 100%;
			justify-content: center;
		}

		.protocol-btn {
			flex: 1;
			justify-content: center;
		}
	}

	.explorers-section {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-wrap: wrap;
		padding-bottom: var(--space-3);
		margin-bottom: var(--space-3);
		border-bottom: 1px solid var(--color-border);
	}

	.explorers-label {
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		color: var(--color-muted-foreground);
	}

	.explorers-list {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.explorer-link {
		display: inline-flex;
		align-items: center;
		gap: var(--space-1);
		padding: var(--space-1) var(--space-2);
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		font-size: var(--text-xs);
		color: var(--color-foreground);
		text-decoration: none;
		transition: all 0.2s ease;
	}

	.explorer-link:hover {
		background: var(--color-panel-2);
		border-color: var(--color-brand);
		color: var(--color-brand);
	}

	@media (max-width: 640px) {
		.explorers-section {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-2);
		}

		.explorers-list {
			width: 100%;
		}

		.explorer-link {
			flex: 1;
			justify-content: center;
			min-width: calc(50% - var(--space-1));
		}
	}
</style>

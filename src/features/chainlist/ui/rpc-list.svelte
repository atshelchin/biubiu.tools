<script lang="ts">
	import { Copy, Check, ExternalLink, Shield, ShieldAlert, ShieldQuestion } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n/svelte';
	import type { RpcEndpoint, RpcTestResult, Explorer } from '../types/chain';
	import { formatLatency, formatBlockHeight, getLatencyQuality } from '../utils/rpc-tester';

	interface Props {
		rpcEndpoints: RpcEndpoint[];
		explorers?: Explorer[];
		testResults: Map<string, RpcTestResult>;
		testResultsVersion: number; // Used to trigger re-sorting when results change
		isTesting: boolean;
	}

	let { rpcEndpoints, explorers, testResults, testResultsVersion, isTesting }: Props = $props();

	const i18n = useI18n();

	let copiedUrl = $state<string | null>(null);

	async function copyToClipboard(text: string) {
		await navigator.clipboard.writeText(text);
		copiedUrl = text;
		setTimeout(() => {
			copiedUrl = null;
		}, 2000);
	}

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
				return i18n.t('chainlist.rpc.privacy_none');
			case 'limited':
				return i18n.t('chainlist.rpc.privacy_limited');
			case 'yes':
				return i18n.t('chainlist.rpc.privacy_yes');
			default:
				return i18n.t('chainlist.rpc.privacy_unknown');
		}
	}

	// Sort RPC endpoints: successful first (by latency), then failed
	// Use testResultsVersion to trigger re-sorting when results change
	const sortedEndpoints = $derived.by(() => {
		// Access version to create dependency
		void testResultsVersion;
		return [...rpcEndpoints].sort((a, b) => {
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
			<span class="explorers-label">{i18n.t('chainlist.explorers')}:</span>
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
					<th class="col-url">{i18n.t('chainlist.rpc.url')}</th>
					<th class="col-height">{i18n.t('chainlist.rpc.height')}</th>
					<th class="col-latency">{i18n.t('chainlist.rpc.latency')}</th>
					<th class="col-privacy">{i18n.t('chainlist.rpc.privacy')}</th>
					<th class="col-actions"></th>
				</tr>
			</thead>
			<tbody>
				{#each sortedEndpoints as endpoint (endpoint.url)}
					{@const result = testResults.get(endpoint.url)}
					{@const PrivacyIcon = getPrivacyIcon(endpoint.tracking)}
					<tr class:failed={result?.status === 'failed'}>
						<td class="col-url">
							<span class="url-text" title={endpoint.url}>
								{endpoint.url}
							</span>
						</td>
						<td class="col-height">
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
						<td class="col-latency">
							{#if isTesting && !result}
								<span class="testing-indicator"></span>
							{:else if result?.status === 'success'}
								<span class="latency latency-{getLatencyQuality(result.latency)}">
									{formatLatency(result.latency)}
								</span>
							{:else if result?.status === 'failed'}
								<span class="failed-text" title={result.error}
									>{i18n.t('chainlist.rpc.failed')}</span
								>
							{:else}
								-
							{/if}
						</td>
						<td class="col-privacy">
							<span
								class="privacy-badge privacy-{endpoint.tracking}"
								title={getPrivacyLabel(endpoint.tracking)}
							>
								<PrivacyIcon size={14} />
								<span class="privacy-label">{getPrivacyLabel(endpoint.tracking)}</span>
							</span>
						</td>
						<td class="col-actions">
							<button
								class="action-btn"
								onclick={() => copyToClipboard(endpoint.url)}
								title={i18n.t('chainlist.actions.copy_rpc')}
							>
								{#if copiedUrl === endpoint.url}
									<Check size={16} />
								{:else}
									<Copy size={16} />
								{/if}
							</button>
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
		min-width: 200px;
		max-width: 300px;
	}

	.url-text {
		display: block;
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

	.col-actions {
		width: 50px;
		text-align: center;
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

	.action-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border: none;
		background: transparent;
		border-radius: var(--radius-sm);
		color: var(--color-muted-foreground);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.action-btn:hover {
		background: var(--color-panel-2);
		color: var(--color-foreground);
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
</style>

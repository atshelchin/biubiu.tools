<script lang="ts">
	import { ChevronDown, ChevronUp, Wallet, Copy, Check, ExternalLink } from '@lucide/svelte';
	import { useI18n } from '@shelchin/i18n';
	import { SvelteMap } from 'svelte/reactivity';
	import { useConnectStore } from '$lib/stores/connect.svelte';
	import type { Chain, RpcTestResult } from '../types/chain';
	import { testRpcEndpoints } from '../utils/rpc-tester';
	import { addChainToWallet } from '../utils/wallet-integration';
	import RpcList from './rpc-list.svelte';

	interface Props {
		chain: Chain;
		isExpanded: boolean;
		onToggle: () => void;
	}

	let { chain, isExpanded, onToggle }: Props = $props();

	const i18n = useI18n();
	const connectStore = useConnectStore();

	let isTesting = $state(false);
	let testResults = new SvelteMap<string, RpcTestResult>();
	let testResultsVersion = $state(0); // Used to trigger reactivity when testResults changes
	let copiedChainId = $state(false);
	let addingToWallet = $state(false);
	let walletError = $state<string | null>(null);

	// Check if wallet is connected
	const isWalletConnected = $derived(connectStore.isConnected);

	// Test RPCs when expanded
	$effect(() => {
		if (isExpanded && testResults.size === 0 && !isTesting) {
			testRpcs();
		}
	});

	async function testRpcs() {
		isTesting = true;
		testResults.clear();
		testResultsVersion++;

		const urls = chain.rpc.map((r) => r.url);
		await testRpcEndpoints(urls, (result) => {
			testResults.set(result.url, result);
			// Trigger reactivity by incrementing version
			testResultsVersion++;
		});

		isTesting = false;
	}

	async function copyChainId() {
		await navigator.clipboard.writeText(chain.chainId.toString());
		copiedChainId = true;
		setTimeout(() => {
			copiedChainId = false;
		}, 2000);
	}

	async function handleAddToWallet() {
		addingToWallet = true;
		walletError = null;

		const result = await addChainToWallet(chain);

		if (!result.success) {
			walletError = result.error ?? 'Failed to add chain';
		}

		addingToWallet = false;
	}

	function formatTvl(tvl: number | undefined): string {
		if (!tvl) return '';
		if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(1)}B`;
		if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(1)}M`;
		if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(1)}K`;
		return `$${tvl.toFixed(0)}`;
	}

	const httpRpcCount = $derived(
		chain.rpc.filter((r) => r.url.startsWith('http://') || r.url.startsWith('https://')).length
	);
</script>

<article class="chain-card" class:expanded={isExpanded}>
	<button class="card-header" onclick={onToggle}>
		<div class="chain-info">
			<div class="chain-icon">
				{#if chain.icon}
					<img
						src="https://icons.llamao.fi/icons/chains/rsz_{chain.icon}.jpg"
						alt={chain.name}
						onerror={(e) => {
							const target = e.currentTarget as HTMLImageElement;
							target.style.display = 'none';
							const fallback = target.nextElementSibling;
							if (fallback) (fallback as HTMLElement).style.display = 'flex';
						}}
					/>
				{/if}
				<span class="icon-fallback" style:display={chain.icon ? 'none' : 'flex'}>
					{chain.nativeCurrency.symbol.slice(0, 2)}
				</span>
			</div>

			<div class="chain-details">
				<div class="chain-name-row">
					<h3 class="chain-name">{chain.name}</h3>
					{#if chain.isTestnet}
						<span class="testnet-badge">{i18n.t('chainlist.testnet')}</span>
					{/if}
				</div>
				<div class="chain-meta">
					<span class="chain-id">Chain ID: {chain.chainId}</span>
					<span class="separator">·</span>
					<span class="currency">{chain.nativeCurrency.symbol}</span>
					{#if chain.tvl}
						<span class="separator">·</span>
						<span class="tvl">TVL: {formatTvl(chain.tvl)}</span>
					{/if}
				</div>
			</div>
		</div>

		<div class="card-actions">
			<span class="rpc-count">{httpRpcCount} RPCs</span>
			<span class="expand-icon">
				{#if isExpanded}
					<ChevronUp size={20} />
				{:else}
					<ChevronDown size={20} />
				{/if}
			</span>
		</div>
	</button>

	{#if isExpanded}
		<div class="card-content">
			<div class="action-buttons">
				{#if isWalletConnected}
					<button class="action-btn primary" onclick={handleAddToWallet} disabled={addingToWallet}>
						<Wallet size={16} />
						{#if addingToWallet}
							{i18n.t('chainlist.actions.adding')}
						{:else}
							{i18n.t('chainlist.actions.add_to_wallet')}
						{/if}
					</button>
				{:else}
					<button class="action-btn primary" onclick={() => connectStore.openConnectorModal()}>
						<Wallet size={16} />
						{i18n.t('chainlist.actions.connect_wallet')}
					</button>
				{/if}

				<button class="action-btn secondary" onclick={copyChainId}>
					{#if copiedChainId}
						<Check size={16} />
						{i18n.t('chainlist.actions.copied')}
					{:else}
						<Copy size={16} />
						{i18n.t('chainlist.actions.copy_chain_id')}
					{/if}
				</button>

				{#if chain.infoURL}
					<a
						href={chain.infoURL}
						target="_blank"
						rel="noopener noreferrer"
						class="action-btn secondary"
					>
						<ExternalLink size={16} />
						{i18n.t('chainlist.actions.website')}
					</a>
				{/if}
			</div>

			{#if walletError}
				<div class="error-message">
					{walletError}
				</div>
			{/if}

			<RpcList
				rpcEndpoints={chain.rpc}
				explorers={chain.explorers}
				{testResults}
				{testResultsVersion}
				{isTesting}
			/>
		</div>
	{/if}
</article>

<style>
	.chain-card {
		background: var(--color-panel-1);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-lg);
		overflow: hidden;
		transition: all 0.2s ease;
		max-width: 100%;
	}

	.chain-card:hover {
		border-color: var(--color-muted-foreground);
		box-shadow: var(--shadow-sm);
	}

	.chain-card.expanded {
		border-color: var(--color-foreground);
		box-shadow: var(--shadow-md);
	}

	.card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		width: 100%;
		max-width: 100%;
		min-width: 0;
		padding: var(--space-4);
		border: none;
		background: transparent;
		cursor: pointer;
		text-align: left;
		overflow: hidden;
	}

	.chain-info {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		min-width: 0;
		overflow: hidden;
		flex: 1;
	}

	.chain-icon {
		width: 40px;
		height: 40px;
		flex-shrink: 0;
		border-radius: var(--radius-full);
		overflow: hidden;
		background: var(--color-panel-2);
	}

	.chain-icon img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.icon-fallback {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: var(--text-sm);
		font-weight: var(--font-bold);
		color: var(--color-muted-foreground);
		text-transform: uppercase;
	}

	.chain-details {
		min-width: 0;
		overflow: hidden;
		flex: 1;
	}

	.chain-name-row {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		flex-wrap: wrap;
	}

	.chain-name {
		font-size: var(--text-base);
		font-weight: var(--font-semibold);
		color: var(--color-foreground);
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.testnet-badge {
		display: inline-block;
		padding: var(--space-1) var(--space-2);
		background: var(--color-warning-alpha-20);
		color: var(--color-warning);
		font-size: var(--text-xs);
		font-weight: var(--font-medium);
		border-radius: var(--radius-sm);
	}

	.chain-meta {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		margin-top: var(--space-1);
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		flex-wrap: wrap;
	}

	.separator {
		color: var(--color-border);
	}

	.chain-id {
		font-family: var(--font-mono);
	}

	.tvl {
		color: var(--color-success);
		font-weight: var(--font-medium);
	}

	.card-actions {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		flex-shrink: 0;
	}

	.rpc-count {
		font-size: var(--text-sm);
		color: var(--color-muted-foreground);
		white-space: nowrap;
	}

	.expand-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: var(--radius-md);
		background: var(--color-panel-2);
		color: var(--color-muted-foreground);
		transition: all 0.2s ease;
	}

	.card-header:hover .expand-icon {
		background: var(--color-brand-alpha-20);
		color: var(--color-brand);
	}

	.card-content {
		padding: var(--space-4);
		border-top: 1px solid var(--color-border);
		max-width: 100%;
		overflow: hidden;
	}

	.action-buttons {
		display: flex;
		gap: var(--space-2);
		flex-wrap: wrap;
		margin-bottom: var(--space-4);
	}

	.action-btn {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		padding: var(--space-2) var(--space-3);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		font-size: var(--text-sm);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
		text-decoration: none;
	}

	.action-btn.primary {
		background: var(--color-foreground);
		border-color: var(--color-foreground);
		color: var(--color-background);
	}

	.action-btn.primary:hover:not(:disabled) {
		background: var(--color-brand);
		border-color: var(--color-brand);
		color: white;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px var(--color-brand-alpha-40);
	}

	.action-btn.primary:active:not(:disabled) {
		transform: translateY(0);
		box-shadow: 0 2px 6px var(--color-brand-alpha-30);
	}

	.action-btn.primary:disabled {
		background: var(--color-muted-foreground);
		border-color: var(--color-muted-foreground);
		color: var(--color-background);
		opacity: 0.5;
		cursor: not-allowed;
	}

	.action-btn.secondary {
		background: var(--color-panel-1);
		color: var(--color-foreground);
	}

	.action-btn.secondary:hover {
		background: var(--color-panel-2);
		border-color: var(--color-brand);
	}

	.error-message {
		padding: var(--space-3);
		margin-bottom: var(--space-4);
		background: var(--color-danger-alpha-20);
		border: 1px solid var(--color-danger-alpha-50);
		border-radius: var(--radius-md);
		color: var(--color-danger);
		font-size: var(--text-sm);
	}

	@media (max-width: 640px) {
		.card-header {
			flex-direction: column;
			align-items: stretch;
			gap: var(--space-3);
			padding: var(--space-3);
		}

		.chain-info {
			width: 100%;
		}

		.chain-icon {
			width: 36px;
			height: 36px;
		}

		.chain-name {
			font-size: var(--text-sm);
		}

		.card-actions {
			width: 100%;
			justify-content: space-between;
		}

		.rpc-count {
			font-size: var(--text-xs);
		}

		.chain-meta {
			flex-direction: column;
			align-items: flex-start;
			gap: var(--space-1);
			font-size: var(--text-xs);
		}

		.separator {
			display: none;
		}

		.card-content {
			padding: var(--space-3);
		}

		.action-buttons {
			flex-direction: column;
			gap: var(--space-2);
		}

		.action-btn {
			width: 100%;
			justify-content: center;
			padding: var(--space-2) var(--space-3);
			font-size: var(--text-sm);
		}
	}
</style>

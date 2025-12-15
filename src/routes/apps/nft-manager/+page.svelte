<script lang="ts">
	import { onMount } from 'svelte';
	import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'viem/chains';
	import { useI18n } from '@shelchin/i18n/svelte';
	import type { Address } from 'viem';
	import { createConnectStore } from '$lib/stores/connect.svelte';
	import { createConnectConfig } from '$lib/utils/connect-config';
	import { nftListState } from '@/features/nft-deployer/stores/nft-list-state.svelte';
	import {
		getUserNFTsPaginated,
		getAllNFTsPaginated
	} from '@/features/nft-deployer/utils/nft-query';
	import NFTList from '@/features/nft-deployer/ui/components/nft-list.svelte';
	import MintNFTModal from '@/features/nft-deployer/ui/components/mint-nft-modal.svelte';
	import WalletConnectionStatus from '$lib/components/ui/wallet-connection-status.svelte';
	import type { NFTInfo, NFTListMode } from '@/features/nft-deployer/types/nft';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/seo-head.svelte';
	import PageLayout from '$lib/components/page-layout.svelte';

	let { data }: { data: PageData } = $props();

	const i18n = useI18n();

	// Initialize wallet connect
	const store = createConnectStore(
		createConnectConfig({
			chains: [mainnet, polygon, base, bsc, arbitrum, optimism],
			storageKey: 'biubiu-tools-nft-manager',
			i18n: i18n as unknown as Parameters<typeof createConnectConfig>[0]['i18n']
		})
	);
	store.initialize();

	// NFTFactory address - you should configure this per chain
	const NFT_FACTORY_ADDRESS = '0xB003AdCD063aAAe88A634aC65257820c1322751D' as Address;

	let selectedNFT = $state<NFTInfo | null>(null);
	let showMintModal = $state(false);

	const mode = $derived(nftListState.mode);
	const nfts = $derived(nftListState.nfts);
	const loading = $derived(nftListState.loading);
	const error = $derived(nftListState.error);
	const currentPage = $derived(nftListState.currentPage);
	const totalPages = $derived(nftListState.totalPages);

	const account = $derived(store.address ? { address: store.address } : null);
	const publicClient = $derived(store.publicClient);
	const blockExplorer = $derived(
		(publicClient?.chain as { blockExplorers?: { default?: { url?: string } } } | undefined)
			?.blockExplorers?.default?.url
	);

	async function loadNFTs() {
		if (!publicClient) return;

		try {
			nftListState.setLoading(true);
			nftListState.setError(null);

			const offset = (nftListState.currentPage - 1) * nftListState.pageSize;
			const limit = nftListState.pageSize;

			if (mode === 'my-nfts') {
				if (!account?.address) {
					nftListState.setNFTs([], 0);
					return;
				}

				const result = await getUserNFTsPaginated(
					publicClient,
					NFT_FACTORY_ADDRESS,
					account.address as Address,
					offset,
					limit
				);

				nftListState.setNFTs(result.nftInfos, Number(result.total));
			} else {
				const result = await getAllNFTsPaginated(publicClient, NFT_FACTORY_ADDRESS, offset, limit);

				nftListState.setNFTs(result.nftInfos, Number(result.total));
			}
		} catch (err) {
			console.error('Failed to load NFTs:', err);
			nftListState.setError(err instanceof Error ? err.message : 'Failed to load NFTs');
		} finally {
			nftListState.setLoading(false);
		}
	}

	function handlePageChange(page: number) {
		nftListState.setPage(page);
		loadNFTs();
	}

	function handleModeChange(newMode: NFTListMode) {
		nftListState.setMode(newMode);
		loadNFTs();
	}

	function handleMint(nftAddress: string) {
		const nft = nfts.find((n) => n.nftAddress === nftAddress);
		if (nft) {
			selectedNFT = nft;
			showMintModal = true;
		}
	}

	function handleCloseMintModal() {
		showMintModal = false;
		selectedNFT = null;
		// Optionally reload NFTs after minting
		loadNFTs();
	}

	// Load NFTs when component mounts or dependencies change
	$effect(() => {
		if (account?.address) {
			nftListState.setUserAddress(account.address as Address);
		}
		loadNFTs();
	});

	onMount(() => {
		return () => {
			nftListState.reset();
		};
	});
</script>

<SeoHead {...data.meta} structuredData={[]} />

<PageLayout>
	<div class="nft-manager-page">
		<div class="page-header">
			<div class="header-content">
				<h1>NFT Manager</h1>
				<p>View and manage your deployed NFT collections</p>
			</div>
			<div class="header-actions">
				<WalletConnectionStatus />
			</div>
		</div>

		{#if account}
			<div class="mode-selector">
				<button
					class="mode-btn"
					class:active={mode === 'my-nfts'}
					onclick={() => handleModeChange('my-nfts')}
				>
					My NFTs
				</button>
				<button
					class="mode-btn"
					class:active={mode === 'all-nfts'}
					onclick={() => handleModeChange('all-nfts')}
				>
					All NFTs
				</button>
			</div>

			<NFTList
				{nfts}
				{loading}
				{error}
				{currentPage}
				{totalPages}
				{blockExplorer}
				userAddress={account.address as Address}
				onPageChange={handlePageChange}
				onMint={handleMint}
			/>
		{:else}
			<div class="connect-prompt">
				<p>Please connect your wallet to view NFTs</p>
			</div>
		{/if}
	</div>
</PageLayout>

{#if showMintModal && selectedNFT}
	<MintNFTModal
		nft={selectedNFT}
		isOwner={account?.address
			? selectedNFT.creator.toLowerCase() === account.address.toLowerCase()
			: false}
		onClose={handleCloseMintModal}
	/>
{/if}

<style>
	.nft-manager-page {
		max-width: 1200px;
		margin: 0 auto;
		padding: var(--space-6) var(--space-4);
	}

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
		flex-wrap: wrap;
	}

	.header-content h1 {
		margin: 0 0 var(--space-2) 0;
		font-size: var(--text-3xl);
		font-weight: var(--font-bold);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .header-content h1 {
		color: var(--gray-100);
	}

	.header-content p {
		margin: 0;
		font-size: var(--text-base);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .header-content p {
		color: var(--gray-400);
	}

	.mode-selector {
		display: flex;
		gap: var(--space-2);
		margin-bottom: var(--space-6);
		padding: var(--space-2);
		background: var(--color-panel-1);
		border-radius: var(--radius-lg);
		border: 1px solid var(--color-border);
	}

	:global([data-theme='dark']) .mode-selector {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
	}

	.mode-btn {
		flex: 1;
		padding: var(--space-3);
		background: transparent;
		border: none;
		border-radius: var(--radius-md);
		color: var(--gray-600);
		font-size: var(--text-base);
		font-weight: var(--font-medium);
		cursor: pointer;
		transition: all 0.2s ease;
	}

	:global([data-theme='dark']) .mode-btn {
		color: var(--gray-400);
	}

	.mode-btn:hover {
		background: var(--color-panel-2);
		color: var(--gray-900);
	}

	:global([data-theme='dark']) .mode-btn:hover {
		background: var(--color-panel-3);
		color: var(--gray-100);
	}

	.mode-btn.active {
		background: var(--color-primary);
		color: white;
	}

	.connect-prompt {
		text-align: center;
		padding: var(--space-8);
		background: var(--color-panel-1);
		border: 2px dashed var(--color-border);
		border-radius: var(--radius-lg);
	}

	:global([data-theme='dark']) .connect-prompt {
		background: var(--color-panel-2);
		border-color: var(--color-panel-border-2);
	}

	.connect-prompt p {
		margin: 0;
		font-size: var(--text-lg);
		color: var(--gray-600);
	}

	:global([data-theme='dark']) .connect-prompt p {
		color: var(--gray-400);
	}
</style>

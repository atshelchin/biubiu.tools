/**
 * NFT List State Management
 * Manages the state for viewing and interacting with deployed NFTs
 */

import type { Address } from 'viem';
import type { NFTInfo, NFTListMode } from '../types/nft';

interface NFTListState {
	// List data
	nfts: NFTInfo[];
	total: number;
	currentPage: number;
	pageSize: number;

	// View mode
	mode: NFTListMode;

	// Loading state
	loading: boolean;
	error: string | null;

	// Filters
	userAddress: Address | null;
}

const createNFTListState = () => {
	let state = $state<NFTListState>({
		nfts: [],
		total: 0,
		currentPage: 1,
		pageSize: 10,
		mode: 'my-nfts',
		loading: false,
		error: null,
		userAddress: null
	});

	return {
		// Getters
		get nfts() {
			return state.nfts;
		},
		get total() {
			return state.total;
		},
		get currentPage() {
			return state.currentPage;
		},
		get pageSize() {
			return state.pageSize;
		},
		get mode() {
			return state.mode;
		},
		get loading() {
			return state.loading;
		},
		get error() {
			return state.error;
		},
		get userAddress() {
			return state.userAddress;
		},
		get totalPages() {
			return Math.ceil(state.total / state.pageSize);
		},
		get hasMore() {
			return state.currentPage < Math.ceil(state.total / state.pageSize);
		},

		// Actions
		setNFTs(nfts: NFTInfo[], total: number) {
			state.nfts = nfts;
			state.total = total;
		},

		setPage(page: number) {
			state.currentPage = page;
		},

		setPageSize(size: number) {
			state.pageSize = size;
			state.currentPage = 1; // Reset to first page when changing page size
		},

		setMode(mode: NFTListMode) {
			state.mode = mode;
			state.currentPage = 1; // Reset to first page when changing mode
		},

		setUserAddress(address: Address | null) {
			state.userAddress = address;
		},

		setLoading(loading: boolean) {
			state.loading = loading;
		},

		setError(error: string | null) {
			state.error = error;
		},

		nextPage() {
			if (state.currentPage < Math.ceil(state.total / state.pageSize)) {
				state.currentPage += 1;
			}
		},

		prevPage() {
			if (state.currentPage > 1) {
				state.currentPage -= 1;
			}
		},

		reset() {
			state.nfts = [];
			state.total = 0;
			state.currentPage = 1;
			state.error = null;
		}
	};
};

export const nftListState = createNFTListState();

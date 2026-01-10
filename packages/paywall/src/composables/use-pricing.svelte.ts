/**
 * usePricing Composable
 *
 * Provides reactive pricing information from the on-chain contract.
 * Prices are fetched per-chain and cached for the session.
 */

import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';
import type { PublicClient } from 'viem';
import type { FormattedPricing, PricingInfo } from '../types';
import { readPricingInfo, formatPricing } from '../utils/contract';

const PRICING_STORE_KEY = Symbol('pricing-store');

/** Default pricing (fallback when not loaded) */
const DEFAULT_PRICING: FormattedPricing = {
	daily: '0',
	monthly: '0',
	yearly: '0',
	perUse: '0'
};

export interface PricingStoreState {
	/** Formatted pricing in ETH strings */
	readonly pricing: FormattedPricing;
	/** Raw pricing in wei */
	readonly rawPricing: PricingInfo | null;
	/** Is pricing being loaded */
	readonly isLoading: boolean;
	/** Has pricing been loaded successfully */
	readonly isLoaded: boolean;
	/** Current chain ID */
	readonly chainId: number | null;
	/** Error message if loading failed */
	readonly error: string | null;

	/** Refresh pricing from chain */
	refresh(publicClient: PublicClient, chainId: number): Promise<void>;
	/** Clear pricing state */
	clear(): void;
}

/**
 * Create pricing store
 */
export function createPricingStore(): PricingStoreState {
	// Reactive state
	let pricing = $state<FormattedPricing>(DEFAULT_PRICING);
	let rawPricing = $state<PricingInfo | null>(null);
	let isLoading = $state(false);
	let isLoaded = $state(false);
	let chainId = $state<number | null>(null);
	let error = $state<string | null>(null);

	// Cache: chainId -> pricing
	const cache = new SvelteMap<number, { formatted: FormattedPricing; raw: PricingInfo }>();

	/**
	 * Refresh pricing from chain
	 */
	async function refresh(publicClient: PublicClient, newChainId: number): Promise<void> {
		// Check cache first
		const cached = cache.get(newChainId);
		if (cached) {
			pricing = cached.formatted;
			rawPricing = cached.raw;
			chainId = newChainId;
			isLoaded = true;
			error = null;
			return;
		}

		// Fetch from chain
		isLoading = true;
		error = null;

		try {
			const raw = await readPricingInfo(publicClient);
			const formatted = formatPricing(raw);

			// Update state
			rawPricing = raw;
			pricing = formatted;
			chainId = newChainId;
			isLoaded = true;

			// Cache the result
			cache.set(newChainId, { formatted, raw });
		} catch (err) {
			console.error('Failed to load pricing:', err);
			error = err instanceof Error ? err.message : 'Failed to load pricing';
			// Keep previous pricing if available
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Clear pricing state
	 */
	function clear(): void {
		pricing = DEFAULT_PRICING;
		rawPricing = null;
		isLoading = false;
		isLoaded = false;
		chainId = null;
		error = null;
	}

	return {
		get pricing() {
			return pricing;
		},
		get rawPricing() {
			return rawPricing;
		},
		get isLoading() {
			return isLoading;
		},
		get isLoaded() {
			return isLoaded;
		},
		get chainId() {
			return chainId;
		},
		get error() {
			return error;
		},
		refresh,
		clear
	};
}

/**
 * Get or create pricing store from context
 */
export function usePricingStore(): PricingStoreState {
	let store = getContext<PricingStoreState>(PRICING_STORE_KEY);

	if (!store) {
		store = createPricingStore();
		setContext(PRICING_STORE_KEY, store);
	}

	return store;
}

/**
 * Set pricing store in context (for testing or custom setup)
 */
export function setPricingStore(store: PricingStoreState): void {
	setContext(PRICING_STORE_KEY, store);
}

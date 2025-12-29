/**
 * Tests for token-selection module.
 */

import { describe, it, expect } from 'vitest';
import { createTokenSelectionModule, type Token } from './token-selection.svelte';

// Test data
const mockTokens: Token[] = [
	{ id: 'eth', type: 'native', name: 'Ethereum', symbol: 'ETH', decimals: 18, chainId: 1 },
	{
		id: 'usdc',
		type: 'erc20',
		name: 'USD Coin',
		symbol: 'USDC',
		decimals: 6,
		chainId: 1,
		address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
	},
	{
		id: 'usdt',
		type: 'erc20',
		name: 'Tether',
		symbol: 'USDT',
		decimals: 6,
		chainId: 1,
		address: '0xdAC17F958D2ee523a2206206994597C13D831ec7'
	}
];

describe('createTokenSelectionModule', () => {
	describe('initial state', () => {
		it('should have correct initial values', () => {
			const module = createTokenSelectionModule();

			expect(module.tokens).toEqual([]);
			expect(module.selectedCount).toBe(0);
			expect(module.hasSelection).toBe(false);
			expect(module.allSelected).toBe(false);
		});
	});

	describe('setTokens', () => {
		it('should set available tokens', () => {
			const module = createTokenSelectionModule();

			module.setTokens(mockTokens);

			expect(module.tokens).toEqual(mockTokens);
			expect(module.tokens.length).toBe(3);
		});

		it('should clear invalid selections when tokens change', () => {
			const module = createTokenSelectionModule();

			module.setTokens(mockTokens);
			module.selectAll();
			expect(module.selectedCount).toBe(3);

			// Set new tokens that don't include 'usdt'
			module.setTokens(mockTokens.slice(0, 2));

			expect(module.selectedCount).toBe(2);
			expect(module.selectedIds.has('usdt')).toBe(false);
		});
	});

	describe('toggle', () => {
		it('should add token to selection if not selected', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);

			module.toggle('eth');

			expect(module.selectedIds.has('eth')).toBe(true);
			expect(module.selectedCount).toBe(1);
		});

		it('should remove token from selection if already selected', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);

			module.toggle('eth');
			expect(module.selectedIds.has('eth')).toBe(true);

			module.toggle('eth');
			expect(module.selectedIds.has('eth')).toBe(false);
		});
	});

	describe('select/deselect', () => {
		it('select should add token to selection', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);

			module.select('eth');
			module.select('usdc');

			expect(module.selectedCount).toBe(2);
			expect(module.selectedIds.has('eth')).toBe(true);
			expect(module.selectedIds.has('usdc')).toBe(true);
		});

		it('deselect should remove token from selection', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);

			module.select('eth');
			module.select('usdc');
			module.deselect('eth');

			expect(module.selectedCount).toBe(1);
			expect(module.selectedIds.has('eth')).toBe(false);
			expect(module.selectedIds.has('usdc')).toBe(true);
		});
	});

	describe('selectAll', () => {
		it('should select all tokens', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);

			module.selectAll();

			expect(module.selectedCount).toBe(3);
			expect(module.allSelected).toBe(true);
		});
	});

	describe('selectByIds', () => {
		it('should select specific tokens by ID', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);

			module.selectByIds(['eth', 'usdt']);

			expect(module.selectedCount).toBe(2);
			expect(module.selectedIds.has('eth')).toBe(true);
			expect(module.selectedIds.has('usdt')).toBe(true);
			expect(module.selectedIds.has('usdc')).toBe(false);
		});
	});

	describe('clear', () => {
		it('should clear all selections', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);
			module.selectAll();

			module.clear();

			expect(module.selectedCount).toBe(0);
			expect(module.hasSelection).toBe(false);
		});
	});

	describe('derived state', () => {
		it('selectedTokens should return the actual token objects', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);

			module.select('eth');
			module.select('usdc');

			const selected = module.selectedTokens;

			expect(selected.length).toBe(2);
			expect(selected).toContainEqual(mockTokens[0]);
			expect(selected).toContainEqual(mockTokens[1]);
		});

		it('allSelected should be false when partially selected', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);

			module.select('eth');

			expect(module.allSelected).toBe(false);
		});

		it('allSelected should be false when no tokens available', () => {
			const module = createTokenSelectionModule();

			expect(module.allSelected).toBe(false);
		});
	});

	describe('reset', () => {
		it('should reset all state', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);
			module.selectAll();

			module.reset();

			expect(module.tokens).toEqual([]);
			expect(module.selectedCount).toBe(0);
		});
	});

	describe('serialization', () => {
		it('should serialize state correctly', () => {
			const module = createTokenSelectionModule();
			module.setTokens(mockTokens);
			module.select('eth');
			module.select('usdc');

			const serialized = module.serialize();

			expect(serialized.tokens).toEqual(mockTokens);
			expect(serialized.selectedIds).toContain('eth');
			expect(serialized.selectedIds).toContain('usdc');
			expect(serialized.selectedIds.length).toBe(2);
		});

		it('should deserialize state correctly', () => {
			const module = createTokenSelectionModule();

			module.deserialize({
				tokens: mockTokens,
				selectedIds: ['eth', 'usdt']
			});

			expect(module.tokens).toEqual(mockTokens);
			expect(module.selectedCount).toBe(2);
			expect(module.selectedIds.has('eth')).toBe(true);
			expect(module.selectedIds.has('usdt')).toBe(true);
		});

		it('should handle null/undefined data gracefully', () => {
			const module = createTokenSelectionModule();

			module.deserialize(null as unknown as ReturnType<typeof module.serialize>);
			module.deserialize(undefined as unknown as ReturnType<typeof module.serialize>);

			expect(module.tokens).toEqual([]);
		});
	});
});

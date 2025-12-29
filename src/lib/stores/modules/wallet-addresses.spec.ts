/**
 * Tests for wallet-addresses module.
 */

import { describe, it, expect } from 'vitest';
import { createWalletAddressesModule } from './wallet-addresses.svelte';
import type { Address } from 'viem';

// Test data
const mockAddresses: Address[] = [
	'0x1111111111111111111111111111111111111111',
	'0x2222222222222222222222222222222222222222',
	'0x3333333333333333333333333333333333333333'
];

describe('createWalletAddressesModule', () => {
	describe('initial state', () => {
		it('should have correct initial values', () => {
			const module = createWalletAddressesModule();

			expect(module.addresses).toEqual([]);
			expect(module.count).toBe(0);
			expect(module.hasWallets).toBe(false);
		});
	});

	describe('addWallet', () => {
		it('should add a wallet address', () => {
			const module = createWalletAddressesModule();

			module.addWallet(mockAddresses[0]);

			expect(module.count).toBe(1);
			expect(module.addresses).toContain(mockAddresses[0]);
		});

		it('should add a wallet with label', () => {
			const module = createWalletAddressesModule();

			module.addWallet(mockAddresses[0], 'My Wallet');

			expect(module.getLabel(mockAddresses[0])).toBe('My Wallet');
		});

		it('should not add duplicate addresses', () => {
			const module = createWalletAddressesModule();

			module.addWallet(mockAddresses[0]);
			module.addWallet(mockAddresses[0]); // Duplicate

			expect(module.count).toBe(1);
		});
	});

	describe('addWallets (batch)', () => {
		it('should add multiple wallets at once', () => {
			const module = createWalletAddressesModule();

			module.addWallets([
				{ address: mockAddresses[0], label: 'Wallet 1' },
				{ address: mockAddresses[1], label: 'Wallet 2' },
				{ address: mockAddresses[2] }
			]);

			expect(module.count).toBe(3);
			expect(module.getLabel(mockAddresses[0])).toBe('Wallet 1');
			expect(module.getLabel(mockAddresses[1])).toBe('Wallet 2');
			expect(module.getLabel(mockAddresses[2])).toBeUndefined();
		});

		it('should filter out duplicates in batch', () => {
			const module = createWalletAddressesModule();

			module.addWallet(mockAddresses[0]);
			module.addWallets([
				{ address: mockAddresses[0] }, // Duplicate
				{ address: mockAddresses[1] }
			]);

			expect(module.count).toBe(2);
		});

		it('should do nothing when all are duplicates', () => {
			const module = createWalletAddressesModule();

			module.addWallet(mockAddresses[0]);
			const initialCount = module.count;

			module.addWallets([{ address: mockAddresses[0] }]);

			expect(module.count).toBe(initialCount);
		});
	});

	describe('removeWallet', () => {
		it('should remove a wallet address', () => {
			const module = createWalletAddressesModule();

			module.addWallet(mockAddresses[0], 'Wallet');
			module.removeWallet(mockAddresses[0]);

			expect(module.count).toBe(0);
			expect(module.getLabel(mockAddresses[0])).toBeUndefined();
		});
	});

	describe('updateLabel', () => {
		it('should update label for existing address', () => {
			const module = createWalletAddressesModule();

			module.addWallet(mockAddresses[0], 'Old Label');
			module.updateLabel(mockAddresses[0], 'New Label');

			expect(module.getLabel(mockAddresses[0])).toBe('New Label');
		});

		it('should not add label for non-existent address', () => {
			const module = createWalletAddressesModule();

			module.updateLabel(mockAddresses[0], 'Label');

			expect(module.labels.size).toBe(0);
		});
	});

	describe('clearWallets', () => {
		it('should clear all wallets and labels', () => {
			const module = createWalletAddressesModule();

			module.addWallets([
				{ address: mockAddresses[0], label: 'Wallet 1' },
				{ address: mockAddresses[1], label: 'Wallet 2' }
			]);

			module.clearWallets();

			expect(module.count).toBe(0);
			expect(module.labels.size).toBe(0);
		});
	});

	describe('hasAddress', () => {
		it('should return true for existing address', () => {
			const module = createWalletAddressesModule();

			module.addWallet(mockAddresses[0]);

			expect(module.hasAddress(mockAddresses[0])).toBe(true);
		});

		it('should return false for non-existent address', () => {
			const module = createWalletAddressesModule();

			expect(module.hasAddress(mockAddresses[0])).toBe(false);
		});
	});

	describe('entries', () => {
		it('should return wallet entries with labels', () => {
			const module = createWalletAddressesModule();

			module.addWallets([
				{ address: mockAddresses[0], label: 'Wallet 1' },
				{ address: mockAddresses[1] }
			]);

			const entries = module.entries;

			expect(entries.length).toBe(2);
			expect(entries[0]).toEqual({ address: mockAddresses[0], label: 'Wallet 1' });
			expect(entries[1]).toEqual({ address: mockAddresses[1], label: undefined });
		});
	});

	describe('reset', () => {
		it('should reset all state', () => {
			const module = createWalletAddressesModule();

			module.addWallets([
				{ address: mockAddresses[0], label: 'Wallet 1' },
				{ address: mockAddresses[1], label: 'Wallet 2' }
			]);

			module.reset();

			expect(module.count).toBe(0);
			expect(module.hasWallets).toBe(false);
		});
	});

	describe('serialization', () => {
		it('should serialize state correctly', () => {
			const module = createWalletAddressesModule();

			module.addWallets([
				{ address: mockAddresses[0], label: 'Wallet 1' },
				{ address: mockAddresses[1] }
			]);

			const serialized = module.serialize();

			expect(serialized.wallets).toEqual([
				{ address: mockAddresses[0], label: 'Wallet 1' },
				{ address: mockAddresses[1], label: undefined }
			]);
		});

		it('should deserialize state correctly', () => {
			const module = createWalletAddressesModule();

			module.deserialize({
				wallets: [
					{ address: mockAddresses[0], label: 'Wallet 1' },
					{ address: mockAddresses[1], label: 'Wallet 2' }
				]
			});

			expect(module.count).toBe(2);
			expect(module.getLabel(mockAddresses[0])).toBe('Wallet 1');
			expect(module.getLabel(mockAddresses[1])).toBe('Wallet 2');
		});

		it('should handle null/undefined data gracefully', () => {
			const module = createWalletAddressesModule();

			module.deserialize(null as unknown as ReturnType<typeof module.serialize>);
			module.deserialize(undefined as unknown as ReturnType<typeof module.serialize>);

			expect(module.count).toBe(0);
		});
	});
});

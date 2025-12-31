/**
 * Promotion Placements Configuration
 *
 * Defines where promotions can appear and which tools are relevant for each location.
 */

import type { Placement } from '../types';

/**
 * All available promotion placements
 *
 * Naming convention: {page}-{position}
 * - page: route identifier (chains, address, name-detail, etc.)
 * - position: where on the page (bottom, sidebar, completion)
 */
export const placements: Record<string, Placement> = {
	// ============================================================================
	// /chains - Chain directory page
	// ============================================================================
	'chains-bottom': {
		id: 'chains-bottom',
		maxCount: 3,
		toolPool: [
			'chainlist',
			'contract-deployer',
			'token-deployer',
			'token-balance-scanner',
			'wallet-generator'
		]
	},

	// ============================================================================
	// /chains/[slug] - Chain detail page
	// ============================================================================
	'chain-detail-bottom': {
		id: 'chain-detail-bottom',
		maxCount: 2,
		toolPool: [
			'token-deployer',
			'nft-deployer',
			'contract-deployer',
			'contract-events-scanner',
			'token-balance-scanner'
		]
	},

	// ============================================================================
	// /address - Address lookup page
	// ============================================================================
	'address-bottom': {
		id: 'address-bottom',
		maxCount: 3,
		toolPool: [
			'wallet-sweep',
			'ens-scanner',
			'assets-monitor',
			'token-balance-scanner',
			'one-to-many-transfer'
		]
	},

	// ============================================================================
	// /name/[name] - ENS/domain detail page
	// ============================================================================
	'name-detail-bottom': {
		id: 'name-detail-bottom',
		maxCount: 2,
		toolPool: ['ens-scanner', 'token-balance-scanner', 'wallet-sweep', 'assets-monitor']
	},

	// ============================================================================
	// /apps/chainlist - Chainlist page
	// ============================================================================
	'chainlist-bottom': {
		id: 'chainlist-bottom',
		maxCount: 2,
		toolPool: ['contract-deployer', 'token-deployer', 'wallet-generator', 'token-balance-scanner']
	},

	// ============================================================================
	// /apps/chain-tools - Chain tools directory
	// ============================================================================
	'chain-tools-category-bottom': {
		id: 'chain-tools-category-bottom',
		maxCount: 2,
		toolPool: [
			'token-deployer',
			'nft-deployer',
			'wallet-sweep',
			'token-balance-scanner',
			'dex-moonshot-trader'
		]
	},

	// ============================================================================
	// Tool completion promotions (shown after workflow completes)
	// ============================================================================
	'token-deployer-completion': {
		id: 'token-deployer-completion',
		maxCount: 2,
		toolPool: ['dex-moonshot-trader', 'token-balance-scanner', 'one-to-many-transfer']
	},

	'nft-deployer-completion': {
		id: 'nft-deployer-completion',
		maxCount: 2,
		toolPool: ['nft-manager', 'assets-monitor']
	},

	'wallet-sweep-completion': {
		id: 'wallet-sweep-completion',
		maxCount: 2,
		toolPool: ['assets-monitor', 'token-balance-scanner', 'one-to-many-transfer']
	},

	'wallet-generator-completion': {
		id: 'wallet-generator-completion',
		maxCount: 2,
		toolPool: ['token-deployer', 'wallet-sweep', 'token-balance-scanner']
	},

	'contract-deployer-completion': {
		id: 'contract-deployer-completion',
		maxCount: 2,
		toolPool: ['contract-events-scanner', 'call-master']
	},

	'one-to-many-transfer-completion': {
		id: 'one-to-many-transfer-completion',
		maxCount: 2,
		toolPool: ['token-balance-scanner', 'assets-monitor']
	},

	'ens-scanner-completion': {
		id: 'ens-scanner-completion',
		maxCount: 2,
		toolPool: ['wallet-sweep', 'token-balance-scanner']
	},

	'token-balance-scanner-completion': {
		id: 'token-balance-scanner-completion',
		maxCount: 2,
		toolPool: ['wallet-sweep', 'one-to-many-transfer', 'assets-monitor']
	}
};

/**
 * Get placement configuration by ID
 */
export function getPlacement(id: string): Placement | undefined {
	return placements[id];
}

/**
 * Check if a placement exists
 */
export function hasPlacement(id: string): boolean {
	return id in placements;
}

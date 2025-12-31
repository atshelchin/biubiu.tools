/**
 * Category Guides Index
 * Export all category guide data
 */
import type { CategoryGuide, CategoryId } from '../../types';
import { analyticsGuide } from './analytics';
import { bridgeGuide } from './bridge';
import { defiGuide } from './defi';
import { devGuide } from './dev';
import { explorerGuide } from './explorer';
import { l2Guide } from './l2';
import { nftGuide } from './nft';
import { securityGuide } from './security';
import { walletGuide } from './wallet';

// Map of all available guides
export const categoryGuides: Partial<Record<CategoryId, CategoryGuide>> = {
	analytics: analyticsGuide,
	bridge: bridgeGuide,
	defi: defiGuide,
	dev: devGuide,
	explorer: explorerGuide,
	l2: l2Guide,
	nft: nftGuide,
	security: securityGuide,
	wallet: walletGuide
	// Add more guides as they are created
};

/**
 * Get guide by category ID
 */
export function getCategoryGuide(categoryId: CategoryId): CategoryGuide | undefined {
	return categoryGuides[categoryId];
}

/**
 * Check if a category has a guide
 */
export function hasGuide(categoryId: CategoryId): boolean {
	return categoryId in categoryGuides;
}

/**
 * Get all category IDs that have guides
 */
export function getGuideCategoryIds(): CategoryId[] {
	return Object.keys(categoryGuides) as CategoryId[];
}

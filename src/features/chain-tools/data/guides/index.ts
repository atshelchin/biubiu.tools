/**
 * Category Guides Index
 * Export all category guide data
 */
import type { CategoryGuide, CategoryId } from '../../types';
import { bridgeGuide } from './bridge';
import { defiGuide } from './defi';
import { nftGuide } from './nft';
import { securityGuide } from './security';

// Map of all available guides
export const categoryGuides: Partial<Record<CategoryId, CategoryGuide>> = {
	bridge: bridgeGuide,
	defi: defiGuide,
	nft: nftGuide,
	security: securityGuide
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

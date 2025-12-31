/**
 * Category Guides Index
 * Export all category guide data
 */
import type { CategoryGuide, CategoryId } from '../../types';
import { defiGuide } from './defi';

// Map of all available guides
export const categoryGuides: Partial<Record<CategoryId, CategoryGuide>> = {
	defi: defiGuide
	// Add more guides as they are created
	// nft: nftGuide,
	// security: securityGuide,
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

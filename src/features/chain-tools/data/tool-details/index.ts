/**
 * Tool Details Index
 *
 * This file exports all tool detail data and tracks which tools have detail pages.
 * Tools with detail pages will show an internal link instead of external link.
 */

import type { ToolDetail } from '../../types';

// Import individual tool details
import { uniswapDetail } from './uniswap';

/**
 * All tool details mapped by tool ID
 */
export const toolDetails: Record<string, ToolDetail> = {
	uniswap: uniswapDetail
};

/**
 * Set of tool IDs that have detail pages
 * Used for quick lookup when rendering tool cards
 */
export const toolsWithDetailPages = new Set<string>(Object.keys(toolDetails));

/**
 * Check if a tool has a detail page
 */
export function hasDetailPage(toolId: string): boolean {
	return toolsWithDetailPages.has(toolId);
}

/**
 * Get tool detail by ID
 */
export function getToolDetail(toolId: string): ToolDetail | undefined {
	return toolDetails[toolId];
}

/**
 * Get all tool IDs that have detail pages
 */
export function getToolIdsWithDetailPages(): string[] {
	return Object.keys(toolDetails);
}

/**
 * Stats for tracking progress
 */
export const detailPageStats = {
	completed: Object.keys(toolDetails).length,
	target: 50 // First batch target
};

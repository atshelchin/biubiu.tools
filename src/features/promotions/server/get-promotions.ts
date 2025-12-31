/**
 * Server-side Promotion Selection
 *
 * Used in +page.server.ts to get promotions for SSR.
 * Returns clean URLs without tracking params (for SEO).
 */

import type { Promotion, GetPromotionsOptions } from '../types';
import { getPlacement } from '../data/placements';
import { getPromotableToolsByIds } from '../data/tools';
import { getRotatedTools } from '../utils/rotation';

/**
 * Get promotions for a placement
 *
 * This function is designed for server-side use:
 * - Returns clean URLs (no UTM params) for SEO
 * - Tracking params are added client-side after hydration
 *
 * @param options - Options for getting promotions
 * @returns Array of promotions ready for rendering
 *
 * @example
 * ```ts
 * // In +page.server.ts
 * export const load: PageServerLoad = async ({ locals }) => {
 *   const promotions = getPromotions({
 *     placement: 'chains-bottom',
 *     locale: locals.locale
 *   });
 *   return { promotions };
 * };
 * ```
 */
export function getPromotions(options: GetPromotionsOptions): Promotion[] {
	const { placement, count, exclude = [] } = options;

	// Get placement configuration
	const config = getPlacement(placement);
	if (!config) {
		console.warn(`[Promotions] Unknown placement: ${placement}`);
		return [];
	}

	// Filter out excluded tools and get promotable tools
	const availableToolIds = config.toolPool.filter((id) => !exclude.includes(id));
	const availableTools = getPromotableToolsByIds(availableToolIds);

	if (availableTools.length === 0) {
		return [];
	}

	// Determine count
	const maxCount = count ?? config.maxCount;

	// Get rotated selection
	const selectedTools = getRotatedTools(availableTools, maxCount, placement);

	// Build promotions with clean URLs (tracking added client-side)
	return selectedTools.map((tool) => ({
		tool,
		href: tool.path,
		placement
	}));
}

/**
 * Promotions Feature
 *
 * Internal link promotion system for cross-linking BiuBiu tools.
 *
 * @example
 * ```ts
 * // In +page.server.ts
 * import { getPromotions } from '$features/promotions';
 *
 * export const load: PageServerLoad = async ({ locals }) => {
 *   const promotions = getPromotions({
 *     placement: 'chains-bottom',
 *     locale: locals.locale
 *   });
 *   return { promotions };
 * };
 * ```
 *
 * @example
 * ```svelte
 * <!-- In +page.svelte -->
 * <script>
 *   import { PromotionFooter } from '$features/promotions';
 *   let { data } = $props();
 * </script>
 *
 * <PromotionFooter promotions={data.promotions} />
 * ```
 */

// Types
export type {
	Promotion,
	PromotableTool,
	Placement,
	GetPromotionsOptions,
	TrackingContext
} from './types';

// Server-side function
export { getPromotions } from './server/get-promotions';

// Components
export { default as PromotionCard } from './components/promotion-card.svelte';
export { default as PromotionFooter } from './components/promotion-footer.svelte';
export { default as PromotionSidebar } from './components/promotion-sidebar.svelte';
export { default as PromotionCompletion } from './components/promotion-completion.svelte';

// Data (for advanced use cases)
export { promotableTools, getPromotableToolById } from './data/tools';
export { placements, getPlacement, hasPlacement } from './data/placements';

/**
 * Chain Tools - Combined exports
 *
 * This file re-exports all tool categories and provides a merged allTools array.
 */

// Export individual category arrays
export { defiTools } from './defi';
export { nftTools } from './nft';
export { analyticsTools } from './analytics';
export { securityTools } from './security';
export { bridgeTools } from './bridge';
export { walletTools } from './wallet';
export { explorerTools } from './explorer';
export { devTools } from './dev';
export { daoTools } from './dao';
export { infraTools } from './infra';
export { launchpadTools } from './launchpad';
export { identityTools } from './identity';
export { socialTools } from './social';
export { l2Tools } from './l2';
export { gamefiTools } from './gamefi';
export { paymentsTools } from './payments';
export { fundingTools } from './funding';
export { newsTools } from './news';

// Import all for merged array
import { defiTools } from './defi';
import { nftTools } from './nft';
import { analyticsTools } from './analytics';
import { securityTools } from './security';
import { bridgeTools } from './bridge';
import { walletTools } from './wallet';
import { explorerTools } from './explorer';
import { devTools } from './dev';
import { daoTools } from './dao';
import { infraTools } from './infra';
import { launchpadTools } from './launchpad';
import { identityTools } from './identity';
import { socialTools } from './social';
import { l2Tools } from './l2';
import { gamefiTools } from './gamefi';
import { paymentsTools } from './payments';
import { fundingTools } from './funding';
import { newsTools } from './news';

import type { ExternalTool } from '../../types';

/**
 * All tools combined into a single array
 */
export const allTools: ExternalTool[] = [
	...defiTools,
	...nftTools,
	...analyticsTools,
	...securityTools,
	...bridgeTools,
	...walletTools,
	...explorerTools,
	...devTools,
	...daoTools,
	...infraTools,
	...launchpadTools,
	...identityTools,
	...socialTools,
	...l2Tools,
	...gamefiTools,
	...paymentsTools,
	...fundingTools,
	...newsTools
];

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): ExternalTool[] {
	return allTools.filter((tool) => tool.category === category);
}

/**
 * Get featured tools
 */
export function getFeaturedTools(): ExternalTool[] {
	return allTools.filter((tool) => tool.isFeatured);
}

/**
 * Get tool by ID
 */
export function getToolById(id: string): ExternalTool | undefined {
	return allTools.find((tool) => tool.id === id);
}

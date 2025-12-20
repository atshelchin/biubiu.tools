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
export { twitterTools } from './twitter';
export { discordTools } from './discord';
export { telegramTools } from './telegram';
export { jobsTools } from './jobs';
export { stablecoinTools } from './stablecoin';
export { oracleTools } from './oracle';
export { daoTokenTools } from './dao-token';
export { whaleAddressTools } from './whale-address';
export { airdropTokenTools } from './airdrop-token';
export { nonEvmTools } from './non-evm';
export { legendaryTokenTools } from './legendary-token';
export { mevTools } from './mev';
export { privacyTools } from './privacy';
export { rwaTools } from './rwa';
export { aiCryptoTools } from './ai-crypto';
export { restakingTools } from './restaking';
export { cexTools } from './cex';
export { gasBurnerTools } from './gas-burner';
export { trendsTools } from './trends';
export { web3TeamsTools } from './web3-teams';
export { regulationTools } from './regulation';
export { influencerTools } from './influencer';

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
import { twitterTools } from './twitter';
import { discordTools } from './discord';
import { telegramTools } from './telegram';
import { jobsTools } from './jobs';
import { stablecoinTools } from './stablecoin';
import { oracleTools } from './oracle';
import { daoTokenTools } from './dao-token';
import { whaleAddressTools } from './whale-address';
import { airdropTokenTools } from './airdrop-token';
import { nonEvmTools } from './non-evm';
import { legendaryTokenTools } from './legendary-token';
import { mevTools } from './mev';
import { privacyTools } from './privacy';
import { rwaTools } from './rwa';
import { aiCryptoTools } from './ai-crypto';
import { restakingTools } from './restaking';
import { cexTools } from './cex';
import { gasBurnerTools } from './gas-burner';
import { trendsTools } from './trends';
import { web3TeamsTools } from './web3-teams';
import { regulationTools } from './regulation';
import { influencerTools } from './influencer';

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
	...newsTools,
	...twitterTools,
	...discordTools,
	...telegramTools,
	...jobsTools,
	...stablecoinTools,
	...oracleTools,
	...daoTokenTools,
	...whaleAddressTools,
	...airdropTokenTools,
	...nonEvmTools,
	...legendaryTokenTools,
	...mevTools,
	...privacyTools,
	...rwaTools,
	...aiCryptoTools,
	...restakingTools,
	...cexTools,
	...gasBurnerTools,
	...trendsTools,
	...web3TeamsTools,
	...regulationTools,
	...influencerTools
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

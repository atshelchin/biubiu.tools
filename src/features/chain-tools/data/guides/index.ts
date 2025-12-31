/**
 * Category Guides Index
 * Export all category guide data
 */
import type { CategoryGuide, CategoryId } from '../../types';
import { aiCryptoGuide } from './ai-crypto';
import { analyticsGuide } from './analytics';
import { bridgeGuide } from './bridge';
import { cexGuide } from './cex';
import { communityGuide } from './community';
import { daoGuide } from './dao';
import { defiGuide } from './defi';
import { devGuide } from './dev';
import { explorerGuide } from './explorer';
import { fundingGuide } from './funding';
import { gamefiGuide } from './gamefi';
import { identityGuide } from './identity';
import { influencerGuide } from './influencer';
import { infraGuide } from './infra';
import { jobsGuide } from './jobs';
import { l2Guide } from './l2';
import { launchpadGuide } from './launchpad';
import { mevGuide } from './mev';
import { newsGuide } from './news';
import { nftGuide } from './nft';
import { nonEvmGuide } from './non-evm';
import { oracleGuide } from './oracle';
import { paymentsGuide } from './payments';
import { privacyGuide } from './privacy';
import { productHuntGuide } from './product-hunt';
import { regulationGuide } from './regulation';
import { restakingGuide } from './restaking';
import { rwaGuide } from './rwa';
import { securityGuide } from './security';
import { socialGuide } from './social';
import { stablecoinGuide } from './stablecoin';
import { trendsGuide } from './trends';
import { walletGuide } from './wallet';
import { web3TeamsGuide } from './web3-teams';
import { airdropTokenGuide } from './airdrop-token';
import { daoTokenGuide } from './dao-token';
import { legendaryTokenGuide } from './legendary-token';
import { whaleAddressGuide } from './whale-address';

// Map of all available guides
export const categoryGuides: Partial<Record<CategoryId, CategoryGuide>> = {
	'ai-crypto': aiCryptoGuide,
	analytics: analyticsGuide,
	bridge: bridgeGuide,
	cex: cexGuide,
	community: communityGuide,
	dao: daoGuide,
	defi: defiGuide,
	dev: devGuide,
	explorer: explorerGuide,
	funding: fundingGuide,
	gamefi: gamefiGuide,
	identity: identityGuide,
	influencer: influencerGuide,
	infra: infraGuide,
	jobs: jobsGuide,
	l2: l2Guide,
	launchpad: launchpadGuide,
	mev: mevGuide,
	news: newsGuide,
	nft: nftGuide,
	'non-evm': nonEvmGuide,
	oracle: oracleGuide,
	payments: paymentsGuide,
	privacy: privacyGuide,
	'product-hunt': productHuntGuide,
	regulation: regulationGuide,
	restaking: restakingGuide,
	rwa: rwaGuide,
	security: securityGuide,
	social: socialGuide,
	stablecoin: stablecoinGuide,
	trends: trendsGuide,
	wallet: walletGuide,
	'web3-teams': web3TeamsGuide,
	'airdrop-token': airdropTokenGuide,
	'dao-token': daoTokenGuide,
	'legendary-token': legendaryTokenGuide,
	'whale-address': whaleAddressGuide
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

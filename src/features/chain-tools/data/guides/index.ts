/**
 * Category Guides Index
 * Export all category guide data
 */
import type { CategoryGuide, CategoryId } from '../../types';
import { aiCryptoGuide } from './ai-crypto';
import { analyticsGuide } from './analytics';
import { bridgeGuide } from './bridge';
import { daoGuide } from './dao';
import { defiGuide } from './defi';
import { devGuide } from './dev';
import { explorerGuide } from './explorer';
import { gamefiGuide } from './gamefi';
import { identityGuide } from './identity';
import { infraGuide } from './infra';
import { l2Guide } from './l2';
import { launchpadGuide } from './launchpad';
import { mevGuide } from './mev';
import { nftGuide } from './nft';
import { oracleGuide } from './oracle';
import { privacyGuide } from './privacy';
import { restakingGuide } from './restaking';
import { rwaGuide } from './rwa';
import { securityGuide } from './security';
import { stablecoinGuide } from './stablecoin';
import { walletGuide } from './wallet';

// Map of all available guides
export const categoryGuides: Partial<Record<CategoryId, CategoryGuide>> = {
	'ai-crypto': aiCryptoGuide,
	analytics: analyticsGuide,
	bridge: bridgeGuide,
	dao: daoGuide,
	defi: defiGuide,
	dev: devGuide,
	explorer: explorerGuide,
	gamefi: gamefiGuide,
	identity: identityGuide,
	infra: infraGuide,
	l2: l2Guide,
	launchpad: launchpadGuide,
	mev: mevGuide,
	nft: nftGuide,
	oracle: oracleGuide,
	privacy: privacyGuide,
	restaking: restakingGuide,
	rwa: rwaGuide,
	security: securityGuide,
	stablecoin: stablecoinGuide,
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

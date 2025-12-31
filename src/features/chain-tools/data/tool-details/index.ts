/**
 * Tool Details Index
 *
 * This file exports all tool detail data and tracks which tools have detail pages.
 * Tools with detail pages will show an internal link instead of external link.
 */

import type { ToolDetail } from '../../types';

// Import individual tool details
import { uniswapDetail } from './uniswap';
import { aaveDetail } from './aave';
import { oneInchDetail } from './1inch';
import { curveDetail } from './curve';
import { lidoDetail } from './lido';
import { gmxDetail } from './gmx';
import { compoundDetail } from './compound';
import { makerDetail } from './maker';
import { eigenlayerDetail } from './eigenlayer';
import { pendleDetail } from './pendle';
import { dydxDetail } from './dydx';
import { pancakeswapDetail } from './pancakeswap';
import { sushiswapDetail } from './sushiswap';
import { balancerDetail } from './balancer';
import { yearnDetail } from './yearn';
import { convexDetail } from './convex';
import { synthetixDetail } from './synthetix';
import { rocketpoolDetail } from './rocketpool';
import { fraxDetail } from './frax';
import { liquityDetail } from './liquity';
import { eulerDetail } from './euler';
import { chainlinkDetail } from './chainlink';
import { openseaDetail } from './opensea';
import { layerzeroDetail } from './layerzero';
import { duneDetail } from './dune';
import { nansenDetail } from './nansen';
import { metamaskDetail } from './metamask';
import { alchemyDetail } from './alchemy';
import { etherscanDetail } from './etherscan';
import { thegraphDetail } from './thegraph';
import { safeDetail } from './safe';

/**
 * All tool details mapped by tool ID
 */
export const toolDetails: Record<string, ToolDetail> = {
	uniswap: uniswapDetail,
	aave: aaveDetail,
	'1inch': oneInchDetail,
	curve: curveDetail,
	lido: lidoDetail,
	gmx: gmxDetail,
	compound: compoundDetail,
	maker: makerDetail,
	eigenlayer: eigenlayerDetail,
	pendle: pendleDetail,
	dydx: dydxDetail,
	pancakeswap: pancakeswapDetail,
	sushiswap: sushiswapDetail,
	balancer: balancerDetail,
	yearn: yearnDetail,
	convex: convexDetail,
	synthetix: synthetixDetail,
	rocketpool: rocketpoolDetail,
	frax: fraxDetail,
	liquity: liquityDetail,
	euler: eulerDetail,
	chainlink: chainlinkDetail,
	opensea: openseaDetail,
	layerzero: layerzeroDetail,
	dune: duneDetail,
	nansen: nansenDetail,
	metamask: metamaskDetail,
	alchemy: alchemyDetail,
	etherscan: etherscanDetail,
	thegraph: thegraphDetail,
	safe: safeDetail
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

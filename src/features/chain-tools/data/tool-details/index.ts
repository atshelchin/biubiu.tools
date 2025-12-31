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
import { acrossDetail } from './across';
import { arbitrumDetail } from './arbitrum';
import { baseDetail } from './base';
import { blurDetail } from './blur';
import { certikDetail } from './certik';
import { foundryDetail } from './foundry';
import { hardhatDetail } from './hardhat';
import { hopDetail } from './hop';
import { immunefiDetail } from './immunefi';
import { infuraDetail } from './infura';
import { openzeppelinDetail } from './openzeppelin';
import { optimismDetail } from './optimism';
import { rainbowDetail } from './rainbow';
import { revokeDetail } from './revoke';
import { scrollDetail } from './scroll';
import { stargateDetail } from './stargate';
import { tenderlyDetail } from './tenderly';
import { wormholeDetail } from './wormhole';
import { zksyncDetail } from './zksync';
import { coingeckoDetail } from './coingecko';
import { defillamaDetail } from './defillama';
import { zapperDetail } from './zapper';
import { zerionDetail } from './zerion';
import { rabbyDetail } from './rabby';
import { debankDetail } from './debank';
import { coinmarketcapDetail } from './coinmarketcap';
import { messariDetail } from './messari';
import { dexscreenerDetail } from './dexscreener';
import { glassnodeDetail } from './glassnode';
import { arkhamDetail } from './arkham';
import { phantomDetail } from './phantom';
import { dextoolsDetail } from './dextools';
import { birdeyeDetail } from './birdeye';
import { tokenterminalDetail } from './tokenterminal';
import { cryptoquantDetail } from './cryptoquant';
import { santimentDetail } from './santiment';
import { intotheblockDetail } from './intotheblock';
import { jupiterDetail } from './jupiter';
import { raydiumDetail } from './raydium';
import { magicEdenDetail } from './magic-eden';
import { tensorDetail } from './tensor';
import { jitoDetail } from './jito';
import { marinadeDetail } from './marinade';
import { polygonDetail } from './polygon';
import { lineaDetail } from './linea';
import { mantaDetail } from './manta';
import { mantleDetail } from './mantle';
import { modeDetail } from './mode';
import { seiDetail } from './sei';
import { blastDetail } from './blast';
import { taikoDetail } from './taiko';
import { starknetDetail } from './starknet';
import { suiDetail } from './sui';
import { aptosDetail } from './aptos';
import { nearDetail } from './near';
import { avalancheDetail } from './avalanche';
import { fantomDetail } from './fantom';
import { bnbchainDetail } from './bnbchain';
import { solanaDetail } from './solana';
import { morphoDetail } from './morpho';
import { sparkDetail } from './spark';

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
	safe: safeDetail,
	across: acrossDetail,
	arbitrum: arbitrumDetail,
	base: baseDetail,
	blur: blurDetail,
	certik: certikDetail,
	foundry: foundryDetail,
	hardhat: hardhatDetail,
	hop: hopDetail,
	immunefi: immunefiDetail,
	infura: infuraDetail,
	openzeppelin: openzeppelinDetail,
	optimism: optimismDetail,
	rainbow: rainbowDetail,
	revoke: revokeDetail,
	scroll: scrollDetail,
	stargate: stargateDetail,
	tenderly: tenderlyDetail,
	wormhole: wormholeDetail,
	zksync: zksyncDetail,
	coingecko: coingeckoDetail,
	defillama: defillamaDetail,
	zapper: zapperDetail,
	zerion: zerionDetail,
	rabby: rabbyDetail,
	debank: debankDetail,
	coinmarketcap: coinmarketcapDetail,
	messari: messariDetail,
	dexscreener: dexscreenerDetail,
	glassnode: glassnodeDetail,
	arkham: arkhamDetail,
	phantom: phantomDetail,
	dextools: dextoolsDetail,
	birdeye: birdeyeDetail,
	tokenterminal: tokenterminalDetail,
	cryptoquant: cryptoquantDetail,
	santiment: santimentDetail,
	intotheblock: intotheblockDetail,
	jupiter: jupiterDetail,
	raydium: raydiumDetail,
	'magic-eden': magicEdenDetail,
	tensor: tensorDetail,
	jito: jitoDetail,
	marinade: marinadeDetail,
	polygon: polygonDetail,
	linea: lineaDetail,
	manta: mantaDetail,
	mantle: mantleDetail,
	mode: modeDetail,
	sei: seiDetail,
	blast: blastDetail,
	taiko: taikoDetail,
	starknet: starknetDetail,
	sui: suiDetail,
	aptos: aptosDetail,
	near: nearDetail,
	avalanche: avalancheDetail,
	fantom: fantomDetail,
	bnbchain: bnbchainDetail,
	solana: solanaDetail,
	morpho: morphoDetail,
	spark: sparkDetail
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

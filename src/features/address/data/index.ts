/**
 * Address data index - 聚合所有地址和域名数据
 */

import type { LabeledAddress, NameRecord, SearchIndexEntry } from '../types';
import { entities, getEntity } from './entities';
import { exchangeAddresses } from './addresses/exchanges';
import { defiAddresses } from './addresses/defi';
import { tokenAddresses } from './addresses/tokens';
import { nftAddresses } from './addresses/nft';
import { notableAddresses } from './addresses/notable';
import { layer2Addresses } from './addresses/layer2';
import { infrastructureAddresses } from './addresses/infrastructure';
import { mevAddresses } from './addresses/mev';
import { gamefiAddresses } from './addresses/gamefi';
import { moreTokenAddresses } from './addresses/more-tokens';
import { moreDefiAddresses } from './addresses/more-defi';
import { biubiuAddresses } from './addresses/biubiu';
import { moreExchangeAddresses } from './addresses/more-exchanges';
import { whaleAddresses } from './addresses/whales';
import { bridgeAddresses } from './addresses/bridges';
import { daoAddresses } from './addresses/daos';
import { stablecoinAddresses } from './addresses/stablecoins';
import { lendingAddresses } from './addresses/lending';
import { dexAddresses } from './addresses/dex';
import { stakingAddresses } from './addresses/staking';
import { oracleAddresses } from './addresses/oracles';
import { derivativesAddresses } from './addresses/derivatives';
import { yieldAddresses } from './addresses/yield';
import { privacyAddresses } from './addresses/privacy';
import { rwaAddresses } from './addresses/rwa';
import { nftMarketplaceAddresses } from './addresses/nft-marketplaces';
import { crossChainAddresses } from './addresses/cross-chain';
import { securityAddresses } from './addresses/security';
import { l2InfraAddresses } from './addresses/l2-infrastructure';
import { moreNotableAddresses } from './addresses/more-notable';
import { ensNames, spaceIdNames, baseNames } from './names/ens';

export function deduplicateByAddressAndChainId(list: LabeledAddress[]): LabeledAddress[] {
	const seen = new Set<string>();

	return list.filter((item) => {
		const key = `${item.address.toLowerCase()}_${item.chainId}`;

		if (seen.has(key)) {
			return false; // 已见过，过滤掉
		} else {
			seen.add(key);
			return true; // 第一次见，保留
		}
	});
}

// 聚合所有地址
export const allAddresses: LabeledAddress[] = deduplicateByAddressAndChainId([
	...exchangeAddresses,
	...defiAddresses,
	...tokenAddresses,
	...nftAddresses,
	...notableAddresses,
	...layer2Addresses,
	...infrastructureAddresses,
	...mevAddresses,
	...gamefiAddresses,
	...moreTokenAddresses,
	...moreDefiAddresses,
	...biubiuAddresses,
	...moreExchangeAddresses,
	...whaleAddresses,
	...bridgeAddresses,
	...daoAddresses,
	...stablecoinAddresses,
	...lendingAddresses,
	...dexAddresses,
	...stakingAddresses,
	...oracleAddresses,
	...derivativesAddresses,
	...yieldAddresses,
	...privacyAddresses,
	...rwaAddresses,
	...nftMarketplaceAddresses,
	...crossChainAddresses,
	...securityAddresses,
	...l2InfraAddresses,
	...moreNotableAddresses
]);

// 聚合所有域名
export const allNames: NameRecord[] = [...ensNames, ...spaceIdNames, ...baseNames];

// 按地址建立索引 (小写地址 -> LabeledAddress)
export const addressIndex: Map<string, LabeledAddress> = new Map(
	allAddresses.map((addr) => [addr.address.toLowerCase() + '_' + addr.chainId, addr])
);

// 按域名建立索引 (小写域名 -> NameRecord)
export const nameIndex: Map<string, NameRecord> = new Map(
	allNames.map((name) => [name.name.toLowerCase(), name])
);

// 按链分组地址
export function getAddressesByChain(chainId: number): LabeledAddress[] {
	return allAddresses.filter((addr) => addr.chainId === chainId);
}

// 按标签分组地址
export function getAddressesByLabel(label: string): LabeledAddress[] {
	return allAddresses.filter((addr) => addr.labels.includes(label as LabeledAddress['labels'][0]));
}

// 按实体分组地址
export function getAddressesByEntity(entityId: string): LabeledAddress[] {
	return allAddresses.filter((addr) => addr.entityId === entityId);
}

// 查询地址
export function getAddress(address: string, chainId: number): LabeledAddress | undefined {
	return addressIndex.get(address.toLowerCase() + '_' + chainId);
}

// 查询域名
export function getName(name: string): NameRecord | undefined {
	return nameIndex.get(name.toLowerCase());
}

// 生成搜索索引
export function generateSearchIndex(): SearchIndexEntry[] {
	const entries: SearchIndexEntry[] = [];

	// 地址索引
	for (const addr of allAddresses) {
		const entity = addr.entityId ? getEntity(addr.entityId) : undefined;
		const searchText = [
			addr.name,
			entity?.name || '',
			addr.address.toLowerCase(),
			addr.address.slice(0, 10).toLowerCase(), // 前缀
			...addr.labels,
			addr.description || ''
		]
			.join(' ')
			.toLowerCase();

		entries.push({
			id: addr.address,
			type: 'address',
			text: searchText,
			chain: addr.chainId,
			risk: addr.riskLevel
		});
	}

	// 域名索引
	for (const name of allNames) {
		const entity = name.entityId ? getEntity(name.entityId) : undefined;
		const searchText = [
			name.name,
			entity?.name || '',
			name.address || '',
			name.description || '',
			...(name.labels || [])
		]
			.join(' ')
			.toLowerCase();

		entries.push({
			id: name.name,
			type: 'name',
			text: searchText
		});
	}

	return entries;
}

// 简单搜索函数
export function search(query: string, limit = 20): SearchIndexEntry[] {
	const q = query.toLowerCase().trim();
	if (!q) return [];

	const index = generateSearchIndex();

	// 精确匹配优先
	const exactMatches: SearchIndexEntry[] = [];
	const partialMatches: SearchIndexEntry[] = [];

	for (const entry of index) {
		if (entry.id.toLowerCase() === q || entry.text.includes(q)) {
			if (entry.id.toLowerCase().startsWith(q) || entry.text.startsWith(q)) {
				exactMatches.push(entry);
			} else {
				partialMatches.push(entry);
			}
		}
	}

	return [...exactMatches, ...partialMatches].slice(0, limit);
}

// 导出实体相关
export { entities, getEntity };

// 统计信息
export const stats = {
	totalAddresses: allAddresses.length,
	totalNames: allNames.length,
	byCategory: {
		exchanges: exchangeAddresses.length,
		defi: defiAddresses.length,
		tokens: tokenAddresses.length,
		nft: nftAddresses.length,
		notable: notableAddresses.length,
		layer2: layer2Addresses.length,
		infrastructure: infrastructureAddresses.length,
		mev: mevAddresses.length,
		gamefi: gamefiAddresses.length,
		moreTokens: moreTokenAddresses.length,
		moreDefi: moreDefiAddresses.length,
		stablecoins: stablecoinAddresses.length,
		lending: lendingAddresses.length,
		dex: dexAddresses.length,
		staking: stakingAddresses.length,
		oracles: oracleAddresses.length,
		derivatives: derivativesAddresses.length,
		yield: yieldAddresses.length,
		privacy: privacyAddresses.length,
		rwa: rwaAddresses.length,
		nftMarketplaces: nftMarketplaceAddresses.length,
		crossChain: crossChainAddresses.length,
		security: securityAddresses.length,
		l2Infrastructure: l2InfraAddresses.length,
		moreNotable: moreNotableAddresses.length
	}
};

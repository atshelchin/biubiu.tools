/**
 * Promotable BiuBiu Tools
 *
 * Tools that can be recommended across the site.
 * All text uses i18n keys for multi-language support.
 */

import type { PromotableTool } from '../types';

/**
 * All BiuBiu tools available for promotion
 */
export const promotableTools: PromotableTool[] = [
	{
		id: 'token-deployer',
		path: '/apps/token-deployer',
		icon: 'Coins',
		nameKey: 'promotions.tools.token_deployer.name',
		descriptionKey: 'promotions.tools.token_deployer.description',
		tags: ['defi', 'token', 'deploy', 'erc20', 'create']
	},
	{
		id: 'nft-deployer',
		path: '/apps/nft-deployer',
		icon: 'Image',
		nameKey: 'promotions.tools.nft_deployer.name',
		descriptionKey: 'promotions.tools.nft_deployer.description',
		tags: ['nft', 'deploy', 'erc721', 'create', 'collection']
	},
	{
		id: 'wallet-sweep',
		path: '/apps/wallet-sweep',
		icon: 'Wallet',
		nameKey: 'promotions.tools.wallet_sweep.name',
		descriptionKey: 'promotions.tools.wallet_sweep.description',
		tags: ['wallet', 'sweep', 'consolidate', 'transfer', 'batch']
	},
	{
		id: 'wallet-generator',
		path: '/apps/wallet-generator',
		icon: 'KeyRound',
		nameKey: 'promotions.tools.wallet_generator.name',
		descriptionKey: 'promotions.tools.wallet_generator.description',
		tags: ['wallet', 'generate', 'create', 'address', 'key']
	},
	{
		id: 'token-balance-scanner',
		path: '/apps/token-balance-scanner',
		icon: 'Search',
		nameKey: 'promotions.tools.token_balance_scanner.name',
		descriptionKey: 'promotions.tools.token_balance_scanner.description',
		tags: ['token', 'balance', 'scan', 'check', 'portfolio']
	},
	{
		id: 'ens-scanner',
		path: '/apps/ens-scanner',
		icon: 'AtSign',
		nameKey: 'promotions.tools.ens_scanner.name',
		descriptionKey: 'promotions.tools.ens_scanner.description',
		tags: ['ens', 'domain', 'name', 'lookup', 'batch']
	},
	{
		id: 'contract-deployer',
		path: '/apps/contract-deployer',
		icon: 'FileCode',
		nameKey: 'promotions.tools.contract_deployer.name',
		descriptionKey: 'promotions.tools.contract_deployer.description',
		tags: ['contract', 'deploy', 'solidity', 'smart-contract', 'dev']
	},
	{
		id: 'contract-events-scanner',
		path: '/apps/contract-events-scanner',
		icon: 'Bell',
		nameKey: 'promotions.tools.contract_events_scanner.name',
		descriptionKey: 'promotions.tools.contract_events_scanner.description',
		tags: ['contract', 'events', 'logs', 'monitor', 'dev']
	},
	{
		id: 'one-to-many-transfer',
		path: '/apps/one-to-many-transfer',
		icon: 'Send',
		nameKey: 'promotions.tools.one_to_many_transfer.name',
		descriptionKey: 'promotions.tools.one_to_many_transfer.description',
		tags: ['transfer', 'batch', 'airdrop', 'send', 'multisend']
	},
	{
		id: 'assets-monitor',
		path: '/apps/assets-monitor',
		icon: 'LineChart',
		nameKey: 'promotions.tools.assets_monitor.name',
		descriptionKey: 'promotions.tools.assets_monitor.description',
		tags: ['assets', 'monitor', 'portfolio', 'track', 'watch']
	},
	{
		id: 'nft-manager',
		path: '/apps/nft-manager',
		icon: 'LayoutGrid',
		nameKey: 'promotions.tools.nft_manager.name',
		descriptionKey: 'promotions.tools.nft_manager.description',
		tags: ['nft', 'manage', 'collection', 'mint', 'view']
	},
	{
		id: 'call-master',
		path: '/apps/call-master',
		icon: 'Terminal',
		nameKey: 'promotions.tools.call_master.name',
		descriptionKey: 'promotions.tools.call_master.description',
		tags: ['contract', 'call', 'interact', 'dev', 'abi']
	},
	{
		id: 'dex-moonshot-trader',
		path: '/apps/dex-moonshot-trader',
		icon: 'TrendingUp',
		nameKey: 'promotions.tools.dex_moonshot_trader.name',
		descriptionKey: 'promotions.tools.dex_moonshot_trader.description',
		tags: ['dex', 'trade', 'swap', 'defi', 'trading']
	},
	{
		id: 'chainlist',
		path: '/apps/chainlist',
		icon: 'Link',
		nameKey: 'promotions.tools.chainlist.name',
		descriptionKey: 'promotions.tools.chainlist.description',
		tags: ['chain', 'rpc', 'network', 'add', 'config']
	}
];

/**
 * Get a promotable tool by ID
 */
export function getPromotableToolById(id: string): PromotableTool | undefined {
	return promotableTools.find((tool) => tool.id === id);
}

/**
 * Get multiple promotable tools by IDs
 */
export function getPromotableToolsByIds(ids: string[]): PromotableTool[] {
	return ids.map((id) => getPromotableToolById(id)).filter(Boolean) as PromotableTool[];
}

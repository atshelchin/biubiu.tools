/**
 * RWA Tools - Real World Assets tokenization platforms
 *
 * Categories:
 * - Tokenization Platforms
 * - Real Estate
 * - Treasuries & Bonds
 * - Commodities
 * - Private Credit
 */
import {
	Building2,
	Landmark,
	Coins,
	FileText,
	Globe,
	TrendingUp,
	Home,
	Gem,
	BarChart3,
	Shield
} from '@lucide/svelte';
import type { ExternalTool } from '../../types';

export const rwaTools: ExternalTool[] = [
	// ========== Major RWA Platforms ==========
	{
		id: 'ondo-finance',
		name: 'Ondo Finance',
		descriptionKey: 'chain-tools.tools.ondo_finance.description',
		url: 'https://ondo.finance',
		icon: Landmark,
		category: 'rwa',
		tags: ['rwa', 'treasuries', 'usdy', 'ousg'],
		chains: ['Ethereum', 'Solana'],
		color: '#000000'
	},
	{
		id: 'centrifuge',
		name: 'Centrifuge',
		descriptionKey: 'chain-tools.tools.centrifuge.description',
		url: 'https://centrifuge.io',
		icon: Building2,
		category: 'rwa',
		tags: ['rwa', 'credit', 'tokenization', 'makerdao'],
		chains: ['Ethereum', 'Centrifuge'],
		color: '#F9B44C'
	},
	{
		id: 'maple-finance',
		name: 'Maple Finance',
		descriptionKey: 'chain-tools.tools.maple_finance.description',
		url: 'https://maple.finance',
		icon: TrendingUp,
		category: 'rwa',
		tags: ['rwa', 'lending', 'institutional', 'credit'],
		chains: ['Ethereum', 'Solana'],
		color: '#1E40AF'
	},
	{
		id: 'goldfinch',
		name: 'Goldfinch',
		descriptionKey: 'chain-tools.tools.goldfinch.description',
		url: 'https://goldfinch.finance',
		icon: Coins,
		category: 'rwa',
		tags: ['rwa', 'credit', 'emerging-markets', 'lending'],
		chains: ['Ethereum'],
		color: '#F2C94C'
	},
	{
		id: 'clearpool',
		name: 'Clearpool',
		descriptionKey: 'chain-tools.tools.clearpool.description',
		url: 'https://clearpool.finance',
		icon: Building2,
		category: 'rwa',
		tags: ['rwa', 'lending', 'institutional', 'uncollateralized'],
		chains: ['Ethereum', 'Polygon', 'Optimism'],
		color: '#00D4AA'
	},
	{
		id: 'truefi',
		name: 'TrueFi',
		descriptionKey: 'chain-tools.tools.truefi.description',
		url: 'https://truefi.io',
		icon: Shield,
		category: 'rwa',
		tags: ['rwa', 'credit', 'uncollateralized', 'lending'],
		chains: ['Ethereum', 'Optimism'],
		color: '#1A5CFF'
	},
	// ========== Tokenized Treasuries ==========
	{
		id: 'blackrock-buidl',
		name: 'BlackRock BUIDL',
		descriptionKey: 'chain-tools.tools.blackrock_buidl.description',
		url: 'https://securitize.io/invest/blackrock-buidl',
		icon: Landmark,
		category: 'rwa',
		tags: ['rwa', 'treasuries', 'blackrock', 'institutional'],
		chains: ['Ethereum'],
		color: '#000000'
	},
	{
		id: 'franklin-benji',
		name: 'Franklin OnChain US Gov Money Fund',
		descriptionKey: 'chain-tools.tools.franklin_benji.description',
		url: 'https://www.franklintempleton.com/investments/options/money-market-funds/products/702/SINGLCLASS/franklin-on-chain-u-s-government-money-fund',
		icon: Landmark,
		category: 'rwa',
		tags: ['rwa', 'treasuries', 'franklin', 'money-market'],
		chains: ['Stellar', 'Polygon'],
		color: '#0033A0'
	},
	{
		id: 'backed-finance',
		name: 'Backed Finance',
		descriptionKey: 'chain-tools.tools.backed_finance.description',
		url: 'https://backed.fi',
		icon: TrendingUp,
		category: 'rwa',
		tags: ['rwa', 'etf', 'tokenized', 'securities'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#FF6B35'
	},
	{
		id: 'matrixdock',
		name: 'Matrixdock',
		descriptionKey: 'chain-tools.tools.matrixdock.description',
		url: 'https://matrixdock.com',
		icon: Landmark,
		category: 'rwa',
		tags: ['rwa', 'treasuries', 'stbt', 'yield'],
		chains: ['Ethereum'],
		color: '#1E1E1E'
	},
	{
		id: 'openeden',
		name: 'OpenEden',
		descriptionKey: 'chain-tools.tools.openeden.description',
		url: 'https://openeden.com',
		icon: Landmark,
		category: 'rwa',
		tags: ['rwa', 'treasuries', 'tbill', 'yield'],
		chains: ['Ethereum', 'Arbitrum'],
		color: '#00C853'
	},
	// ========== Real Estate ==========
	{
		id: 'realt',
		name: 'RealT',
		descriptionKey: 'chain-tools.tools.realt.description',
		url: 'https://realt.co',
		icon: Home,
		category: 'rwa',
		tags: ['rwa', 'real-estate', 'fractional', 'rental'],
		chains: ['Ethereum', 'Gnosis'],
		color: '#FF6B35'
	},
	{
		id: 'lofty',
		name: 'Lofty',
		descriptionKey: 'chain-tools.tools.lofty.description',
		url: 'https://lofty.ai',
		icon: Home,
		category: 'rwa',
		tags: ['rwa', 'real-estate', 'fractional', 'algorand'],
		chains: ['Algorand'],
		color: '#6366F1'
	},
	{
		id: 'propy',
		name: 'Propy',
		descriptionKey: 'chain-tools.tools.propy.description',
		url: 'https://propy.com',
		icon: Home,
		category: 'rwa',
		tags: ['rwa', 'real-estate', 'nft', 'title'],
		chains: ['Ethereum'],
		color: '#00D4AA'
	},
	{
		id: 'parcl-rwa',
		name: 'Parcl',
		descriptionKey: 'chain-tools.tools.parcl_rwa.description',
		url: 'https://parcl.co',
		icon: Home,
		category: 'rwa',
		tags: ['rwa', 'real-estate', 'index', 'perps'],
		chains: ['Solana'],
		color: '#00D395'
	},
	// ========== Commodities ==========
	{
		id: 'pax-gold',
		name: 'Paxos Gold (PAXG)',
		descriptionKey: 'chain-tools.tools.pax_gold.description',
		url: 'https://paxos.com/paxgold',
		icon: Gem,
		category: 'rwa',
		tags: ['rwa', 'gold', 'commodity', 'tokenized'],
		chains: ['Ethereum'],
		color: '#FFD700'
	},
	{
		id: 'tether-gold',
		name: 'Tether Gold (XAUT)',
		descriptionKey: 'chain-tools.tools.tether_gold.description',
		url: 'https://gold.tether.to',
		icon: Gem,
		category: 'rwa',
		tags: ['rwa', 'gold', 'tether', 'commodity'],
		chains: ['Ethereum'],
		color: '#FFD700'
	},
	{
		id: 'cache-gold',
		name: 'Cache Gold',
		descriptionKey: 'chain-tools.tools.cache_gold.description',
		url: 'https://cache.gold',
		icon: Gem,
		category: 'rwa',
		tags: ['rwa', 'gold', 'redeemable', 'commodity'],
		chains: ['Ethereum'],
		color: '#D4AF37'
	},
	// ========== RWA Analytics ==========
	{
		id: 'rwa-xyz',
		name: 'RWA.xyz',
		descriptionKey: 'chain-tools.tools.rwa_xyz.description',
		url: 'https://rwa.xyz',
		icon: BarChart3,
		category: 'rwa',
		tags: ['rwa', 'analytics', 'data', 'tracking'],
		color: '#6366F1'
	},
	{
		id: 'defillama-rwa',
		name: 'DeFiLlama RWA',
		descriptionKey: 'chain-tools.tools.defillama_rwa.description',
		url: 'https://defillama.com/protocols/RWA',
		icon: BarChart3,
		category: 'rwa',
		tags: ['rwa', 'analytics', 'tvl', 'data'],
		color: '#2172E5'
	},
	// ========== Tokenization Infrastructure ==========
	{
		id: 'securitize',
		name: 'Securitize',
		descriptionKey: 'chain-tools.tools.securitize.description',
		url: 'https://securitize.io',
		icon: FileText,
		category: 'rwa',
		tags: ['rwa', 'issuance', 'compliance', 'securities'],
		chains: ['Ethereum', 'Polygon', 'Avalanche'],
		color: '#00A3FF'
	},
	{
		id: 'tokeny',
		name: 'Tokeny',
		descriptionKey: 'chain-tools.tools.tokeny.description',
		url: 'https://tokeny.com',
		icon: FileText,
		category: 'rwa',
		tags: ['rwa', 'issuance', 'compliance', 'erc3643'],
		chains: ['Ethereum', 'Polygon'],
		color: '#6366F1'
	},
	{
		id: 'polymesh',
		name: 'Polymesh',
		descriptionKey: 'chain-tools.tools.polymesh.description',
		url: 'https://polymesh.network',
		icon: Globe,
		category: 'rwa',
		tags: ['rwa', 'chain', 'securities', 'regulated'],
		chains: ['Polymesh'],
		color: '#FF2D6A'
	}
];

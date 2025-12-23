/**
 * Address Explorer Types
 * 用于标记地址和域名的类型定义
 */

// 支持的链 ID
export type ChainId =
	| 'ethereum'
	| 'base'
	| 'arbitrum'
	| 'optimism'
	| 'polygon'
	| 'bnb'
	| 'avalanche'
	| 'fantom'
	| 'gnosis'
	| 'zksync'
	| 'linea'
	| 'scroll'
	| 'mantle'
	| 'blast';

// 地址标签类型
export type AddressLabel =
	// 交易所
	| 'exchange'
	| 'cex'
	| 'dex'
	// DeFi
	| 'defi'
	| 'lending'
	| 'bridge'
	| 'yield'
	| 'derivatives'
	| 'liquid-staking'
	// Token
	| 'token'
	| 'stablecoin'
	| 'memecoin'
	| 'wrapped'
	// NFT
	| 'nft'
	| 'nft-marketplace'
	// 实体类型
	| 'whale'
	| 'smart-money'
	| 'foundation'
	| 'dao'
	| 'multisig'
	| 'deployer'
	// 风险标记
	| 'hacker'
	| 'scam'
	| 'sanctioned'
	| 'phishing'
	// 特殊
	| 'burn'
	| 'null'
	| 'genesis'
	| 'mev'
	| 'contract'
	| 'eoa';

// 风险等级
export type RiskLevel = 'safe' | 'neutral' | 'warning' | 'danger';

// 数据来源
export type DataSource = 'manual' | 'verified' | 'etherscan' | 'community';

// 域名类型
export type NameType = 'ens' | 'spaceid-bnb' | 'spaceid-arb' | 'basename' | 'unstoppable';

// 实体信息 (交易所、协议等)
export interface Entity {
	id: string; // 唯一标识: "binance", "uniswap"
	name: string; // 显示名称 (英文)
	logo?: string; // Logo URL 或本地路径
	website?: string;
	twitter?: string;
	description?: string; // 英文描述，i18n 用 key 覆盖
}

// 标记地址
export interface LabeledAddress {
	address: string; // 0x... 格式
	chainId: number; // Chain ID (1=Ethereum, 42161=Arbitrum, etc)
	entityId?: string; // 关联的实体 ID (可选)
	name: string; // 地址名称: "Binance Hot Wallet 1"
	labels: AddressLabel[];
	riskLevel: RiskLevel;
	description?: string; // 额外描述
	relatedAddresses?: string[]; // 关联地址
	source: DataSource;
	updatedAt: string; // ISO date: "2024-01-15"
}

// ENS 注册状态
export type ENSRegistrationStatus =
	| 'registered'
	| 'available'
	| 'grace-period'
	| 'premium'
	| 'unknown';

// 域名记录
export interface NameRecord {
	name: string; // "vitalik.eth"
	type: NameType;
	address?: string; // 解析到的地址
	owner?: string; // 持有者地址 (可能与解析地址不同)
	labels?: AddressLabel[];
	entityId?: string; // 如果是知名实体的域名
	notable: boolean; // 是否知名
	description?: string;
	avatar?: string;
	socials?: {
		twitter?: string;
		github?: string;
		website?: string;
	};
	// ENS 注册信息
	registrationStatus?: ENSRegistrationStatus; // 注册状态
	expiresAt?: string; // ISO date: "2025-12-31" 过期时间
	registeredAt?: string; // ISO date: "2020-01-01" 注册时间
	source: DataSource;
	updatedAt: string;
}

// 搜索索引条目 (轻量级，用于客户端搜索)
export interface SearchIndexEntry {
	id: string; // address 或 name
	type: 'address' | 'name';
	text: string; // 搜索文本: "binance exchange 0xabc..."
	chain?: number; // Chain ID
	risk?: RiskLevel;
}

// 地址详情页数据 (SSR 用)
export interface AddressPageData {
	address: LabeledAddress;
	entity: Entity;
	relatedAddresses?: LabeledAddress[];
	names?: NameRecord[]; // 关联的域名
}

// 域名详情页数据 (SSR 用)
export interface NamePageData {
	name: NameRecord;
	entity?: Entity;
	address?: LabeledAddress; // 解析到的地址详情
}

// 标签元数据
export interface LabelMeta {
	id: AddressLabel;
	category: 'exchange' | 'defi' | 'token' | 'nft' | 'entity' | 'risk' | 'special';
	color: string; // Tailwind color class
	icon?: string; // Lucide icon name
}

// 标签元数据定义
export const LABEL_META: Record<AddressLabel, LabelMeta> = {
	// 交易所
	exchange: { id: 'exchange', category: 'exchange', color: 'blue' },
	cex: { id: 'cex', category: 'exchange', color: 'blue' },
	dex: { id: 'dex', category: 'exchange', color: 'indigo' },
	// DeFi
	defi: { id: 'defi', category: 'defi', color: 'purple' },
	lending: { id: 'lending', category: 'defi', color: 'purple' },
	bridge: { id: 'bridge', category: 'defi', color: 'cyan' },
	yield: { id: 'yield', category: 'defi', color: 'green' },
	derivatives: { id: 'derivatives', category: 'defi', color: 'orange' },
	'liquid-staking': { id: 'liquid-staking', category: 'defi', color: 'teal' },
	// Token
	token: { id: 'token', category: 'token', color: 'yellow' },
	stablecoin: { id: 'stablecoin', category: 'token', color: 'emerald' },
	memecoin: { id: 'memecoin', category: 'token', color: 'pink' },
	wrapped: { id: 'wrapped', category: 'token', color: 'slate' },
	// NFT
	nft: { id: 'nft', category: 'nft', color: 'rose' },
	'nft-marketplace': { id: 'nft-marketplace', category: 'nft', color: 'fuchsia' },
	// 实体类型
	whale: { id: 'whale', category: 'entity', color: 'sky' },
	'smart-money': { id: 'smart-money', category: 'entity', color: 'lime' },
	foundation: { id: 'foundation', category: 'entity', color: 'violet' },
	dao: { id: 'dao', category: 'entity', color: 'amber' },
	multisig: { id: 'multisig', category: 'entity', color: 'stone' },
	deployer: { id: 'deployer', category: 'entity', color: 'neutral' },
	// 风险标记
	hacker: { id: 'hacker', category: 'risk', color: 'red' },
	scam: { id: 'scam', category: 'risk', color: 'red' },
	sanctioned: { id: 'sanctioned', category: 'risk', color: 'red' },
	phishing: { id: 'phishing', category: 'risk', color: 'orange' },
	// 特殊
	burn: { id: 'burn', category: 'special', color: 'gray' },
	null: { id: 'null', category: 'special', color: 'gray' },
	genesis: { id: 'genesis', category: 'special', color: 'gold' },
	mev: { id: 'mev', category: 'special', color: 'zinc' },
	contract: { id: 'contract', category: 'special', color: 'slate' },
	eoa: { id: 'eoa', category: 'special', color: 'slate' }
};

// 链元数据 (使用 chain ID 数字作为 key)
export const CHAIN_META: Record<number, { name: string; color: string; explorerUrl: string }> = {
	1: {
		name: 'Ethereum',
		color: 'blue',
		explorerUrl: 'https://etherscan.io'
	},
	8453: {
		name: 'Base',
		color: 'blue',
		explorerUrl: 'https://basescan.org'
	},
	42161: {
		name: 'Arbitrum',
		color: 'blue',
		explorerUrl: 'https://arbiscan.io'
	},
	10: {
		name: 'Optimism',
		color: 'red',
		explorerUrl: 'https://optimistic.etherscan.io'
	},
	137: {
		name: 'Polygon',
		color: 'purple',
		explorerUrl: 'https://polygonscan.com'
	},
	56: {
		name: 'BNB Chain',
		color: 'yellow',
		explorerUrl: 'https://bscscan.com'
	},
	43114: {
		name: 'Avalanche',
		color: 'red',
		explorerUrl: 'https://snowtrace.io'
	},
	250: {
		name: 'Fantom',
		color: 'blue',
		explorerUrl: 'https://ftmscan.com'
	},
	100: {
		name: 'Gnosis',
		color: 'green',
		explorerUrl: 'https://gnosisscan.io'
	},
	324: {
		name: 'zkSync Era',
		color: 'purple',
		explorerUrl: 'https://explorer.zksync.io'
	},
	59144: {
		name: 'Linea',
		color: 'black',
		explorerUrl: 'https://lineascan.build'
	},
	534352: {
		name: 'Scroll',
		color: 'orange',
		explorerUrl: 'https://scrollscan.com'
	},
	5000: {
		name: 'Mantle',
		color: 'black',
		explorerUrl: 'https://explorer.mantle.xyz'
	},
	81457: {
		name: 'Blast',
		color: 'yellow',
		explorerUrl: 'https://blastscan.io'
	},
	// Mode
	34443: {
		name: 'Mode',
		color: 'yellow',
		explorerUrl: 'https://explorer.mode.network'
	},
	// Taiko
	167000: {
		name: 'Taiko',
		color: 'pink',
		explorerUrl: 'https://taikoscan.network'
	}
};

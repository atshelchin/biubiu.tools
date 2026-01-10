/**
 * Paywall Type Definitions
 */

import type { Address } from 'viem';

// ============================================
// 会员相关类型
// ============================================

/** 会员状态（从合约读取） */
export interface MembershipStatus {
	isMember: boolean;
	expiresAt: number; // Unix timestamp (秒)
	remainingDays: number;
}

/** 价格信息（从合约读取） */
export interface PricingInfo {
	dailyPrice: bigint; // wei
	monthlyPrice: bigint; // wei
	yearlyPrice: bigint; // wei
	nonMemberFee: bigint; // wei (按次付费费用)
}

/** 格式化后的价格信息（ETH 字符串） */
export interface FormattedPricing {
	daily: string; // e.g. "0.05"
	monthly: string; // e.g. "0.25"
	yearly: string; // e.g. "1.25"
	perUse: string; // e.g. "0.01"
}

/** 缓存的会员数据（存入 IndexedDB） */
export interface MembershipCache {
	address: Address;
	chainId: number;
	isMember: boolean;
	expiresAt: number; // Unix timestamp (秒)
	cachedAt: number; // 缓存时间 (毫秒)
	checksum: string; // 防篡改
}

// ============================================
// 使用配额相关类型
// ============================================

/** 使用记录（存入 IndexedDB） */
export interface UsageRecord {
	address: Address;
	featureId: string;
	date: string; // YYYY-MM-DD
	count: number;
	checksum: string;
}

/** 配额配置 */
export interface QuotaConfig {
	daily: number; // 每日免费额度
	countBy: 'request' | 'items'; // 计数方式
}

// ============================================
// 付费墙规则相关类型
// ============================================

/** 付费墙类型 */
export type PaywallType =
	| 'free' // 完全免费
	| 'membership_only' // 仅会员
	| 'pay_per_use' // 按次付费
	| 'hybrid'; // 混合模式

/** 检查上下文（由功能传入） */
export interface PaywallContext {
	// 必需字段
	isMember: boolean;
	chainId: number;
	address: Address;

	// 可选字段
	itemCount?: number; // 条目数量
	dailyUsage?: number; // 今日已用量
}

/** 拒绝原因 */
export type PaywallDenyReason =
	| 'not_connected' // 未连接钱包
	| 'membership_required' // 需要会员
	| 'quota_exceeded' // 配额超限
	| 'payment_required'; // 需要付费

/** 检查结果 */
export interface PaywallResult {
	allowed: boolean;

	// 允许时
	freeUse?: boolean;
	perUseFee?: number; // 单次费用 (ETH)
	totalFee?: number; // 总费用 (ETH)
	feeInContract?: boolean; // 合约收费

	// 拒绝时
	reason?: PaywallDenyReason;

	// UI 提示 (i18n)
	messageKey?: string; // i18n key, e.g. 'paywall.rules.quota_remaining'
	messageParams?: Record<string, string | number>; // i18n interpolation params
	upgradeHintKey?: string; // i18n key for upgrade hint
	showUpgrade?: boolean;
	showPayPerUse?: boolean;

	// Legacy (deprecated, use messageKey instead)
	message?: string;
	upgradeHint?: string;
}

/** 规则定义接口 */
export interface PaywallRule {
	featureId: string;
	type: PaywallType;

	// 可选配置
	freeQuota?: QuotaConfig;
	perUseFee?: number;
	feeInContract?: boolean;

	// 核心检查方法
	check(ctx: PaywallContext): PaywallResult;
}

// ============================================
// Store 类型
// ============================================

export interface MembershipStoreState {
	// 状态
	readonly isMember: boolean;
	readonly expiresAt: number | null;
	readonly remainingDays: number;
	readonly isLoading: boolean;
	readonly chainId: number | null;
	readonly address: Address | null;

	// 方法
	refresh(): Promise<void>;
	clear(): void;
}

export interface UsageQuotaStoreState {
	// 方法
	getDailyUsage(featureId: string): Promise<number>;
	recordUsage(featureId: string, count: number): Promise<void>;
	getRemainingQuota(featureId: string, dailyLimit: number): Promise<number>;
	clearUsage(featureId: string): Promise<void>;
}

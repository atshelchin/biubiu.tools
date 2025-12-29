/**
 * Paywall System Constants
 *
 * Centralized configuration for all paywall-related constants.
 * This makes it easier to adjust settings and document magic numbers.
 */

// ============================================
// Self-Hosted Mode (For Developers)
// ============================================

/**
 * When true, bypasses all paywall checks - everyone is treated as a premium member.
 *
 * For developers who fork this project:
 * Set environment variable VITE_SELF_HOSTED=true when building.
 *
 * 对于 fork 本项目的开发者：
 * 构建时设置环境变量 VITE_SELF_HOSTED=true 即可免费无限使用所有功能。
 *
 * Note: This is a compile-time constant. Vite replaces import.meta.env.VITE_*
 * with static values at build time, so this cannot be changed at runtime.
 *
 * @example
 * VITE_SELF_HOSTED=true bun run build
 */
export const SELF_HOSTED_MODE = import.meta.env.VITE_SELF_HOSTED === 'true';

// ============================================
// Time Constants (in milliseconds)
// ============================================

/** Background verification interval: 3 minutes */
export const VERIFY_INTERVAL_MS = 3 * 60 * 1000; // 3 minutes

/** Initial verification delay after cache load */
export const INITIAL_VERIFY_DELAY_MS = 5 * 1000; // 5 seconds

/** Seconds per day (for remaining days calculation) */
export const SECONDS_PER_DAY = 86400;

// ============================================
// Retry Configuration
// ============================================

/** Maximum retry attempts for RPC calls */
export const MAX_RETRY_ATTEMPTS = 3;

/** Base delay for exponential backoff (ms) */
export const RETRY_BASE_DELAY_MS = 1000;

/** Maximum delay between retries (ms) */
export const RETRY_MAX_DELAY_MS = 10000;

// ============================================
// Cache Configuration
// ============================================

/** Cache key prefix for IndexedDB storage */
export const CACHE_KEY_PREFIX = 'biubiu-membership';

/** Usage record key prefix */
export const USAGE_KEY_PREFIX = 'biubiu-usage';

/** Checksum salt for integrity verification */
export const CHECKSUM_SALT = 'biubiu-paywall-v1';

// ============================================
// Contract Configuration
// ============================================

/** BiuBiuPremium contract address (same on all supported chains) */
export const BIUBIU_PREMIUM_CONTRACT = '0xc5c4bb399938625523250B708dc5c1e7dE4b1626' as const;

/**
 * Rotation Algorithm
 *
 * Deterministic rotation based on UTC hour.
 * Same placement + same hour = same tools in same order.
 */

import type { PromotableTool } from '../types';

/**
 * Simple string hash function
 */
function hashCode(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32-bit integer
	}
	return Math.abs(hash);
}

/**
 * Seeded shuffle using Linear Congruential Generator
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
	const result = [...array];
	let currentSeed = seed;

	for (let i = result.length - 1; i > 0; i--) {
		// LCG parameters (same as glibc)
		currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
		const j = currentSeed % (i + 1);
		[result[i], result[j]] = [result[j], result[i]];
	}

	return result;
}

/**
 * Get rotated tools for a placement
 *
 * Uses UTC hour + placement ID as seed for deterministic rotation.
 * This ensures:
 * - Same placement shows same tools within the same hour
 * - Different hours show different tool combinations
 * - Different placements show different tools even in same hour
 *
 * @param tools - Available tools to rotate
 * @param count - Number of tools to return
 * @param placement - Placement ID for seed generation
 * @returns Rotated subset of tools
 */
export function getRotatedTools(
	tools: PromotableTool[],
	count: number,
	placement: string
): PromotableTool[] {
	if (tools.length === 0) return [];
	if (tools.length <= count) return tools;

	const hour = new Date().getUTCHours();
	const dayOfWeek = new Date().getUTCDay();

	// Combine placement hash with time for seed
	// Include day of week to add more variation
	const seed = hashCode(placement) + hour * 100 + dayOfWeek;

	const shuffled = seededShuffle(tools, seed);

	return shuffled.slice(0, count);
}

/**
 * Get current UTC time info for tracking
 */
export function getUTCTimeInfo(): { hour: number; dayOfWeek: number } {
	const now = new Date();
	return {
		hour: now.getUTCHours(),
		dayOfWeek: now.getUTCDay()
	};
}

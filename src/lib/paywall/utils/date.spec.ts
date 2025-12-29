/**
 * Tests for date utilities
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getTodayDate, getCutoffDate } from './date';

describe('getTodayDate', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should return date in YYYY-MM-DD format', () => {
		vi.setSystemTime(new Date('2024-12-29T12:00:00Z'));
		const today = getTodayDate();
		expect(today).toBe('2024-12-29');
	});

	it('should return correct date for different dates', () => {
		vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
		expect(getTodayDate()).toBe('2025-01-01');

		vi.setSystemTime(new Date('2024-06-15T23:59:59Z'));
		expect(getTodayDate()).toBe('2024-06-15');
	});

	it('should handle edge of day correctly', () => {
		// Just before midnight UTC
		vi.setSystemTime(new Date('2024-12-31T23:59:59.999Z'));
		expect(getTodayDate()).toBe('2024-12-31');

		// Just after midnight UTC
		vi.setSystemTime(new Date('2025-01-01T00:00:00.001Z'));
		expect(getTodayDate()).toBe('2025-01-01');
	});
});

describe('getCutoffDate', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('should return date 7 days ago by default', () => {
		vi.setSystemTime(new Date('2024-12-29T12:00:00Z'));
		const cutoff = getCutoffDate();
		expect(cutoff).toBe('2024-12-22');
	});

	it('should return date N days ago when specified', () => {
		vi.setSystemTime(new Date('2024-12-29T12:00:00Z'));

		expect(getCutoffDate(1)).toBe('2024-12-28');
		expect(getCutoffDate(3)).toBe('2024-12-26');
		expect(getCutoffDate(30)).toBe('2024-11-29');
	});

	it('should handle month boundaries', () => {
		vi.setSystemTime(new Date('2024-01-05T12:00:00Z'));
		const cutoff = getCutoffDate(7);
		expect(cutoff).toBe('2023-12-29');
	});

	it('should handle year boundaries', () => {
		vi.setSystemTime(new Date('2025-01-02T12:00:00Z'));
		const cutoff = getCutoffDate(7);
		expect(cutoff).toBe('2024-12-26');
	});

	it('should handle zero days ago', () => {
		vi.setSystemTime(new Date('2024-12-29T12:00:00Z'));
		const cutoff = getCutoffDate(0);
		expect(cutoff).toBe('2024-12-29');
	});
});

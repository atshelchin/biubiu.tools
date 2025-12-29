/**
 * Tests for checksum utilities
 */

import { describe, it, expect } from 'vitest';
import {
	generateChecksum,
	verifyChecksum,
	createMembershipChecksumData,
	createUsageChecksumData
} from './checksum';

describe('generateChecksum', () => {
	it('should generate consistent checksum for same data', async () => {
		const data = 'test-data';
		const checksum1 = await generateChecksum(data);
		const checksum2 = await generateChecksum(data);
		expect(checksum1).toBe(checksum2);
	});

	it('should generate different checksums for different data', async () => {
		const checksum1 = await generateChecksum('data1');
		const checksum2 = await generateChecksum('data2');
		expect(checksum1).not.toBe(checksum2);
	});

	it('should generate 64-character hex string (SHA-256)', async () => {
		const checksum = await generateChecksum('test');
		expect(checksum).toMatch(/^[a-f0-9]{64}$/);
	});
});

describe('verifyChecksum', () => {
	it('should return true for matching checksum', async () => {
		const data = 'test-data';
		const checksum = await generateChecksum(data);
		const isValid = await verifyChecksum(data, checksum);
		expect(isValid).toBe(true);
	});

	it('should return false for tampered data', async () => {
		const data = 'test-data';
		const checksum = await generateChecksum(data);
		const isValid = await verifyChecksum('tampered-data', checksum);
		expect(isValid).toBe(false);
	});

	it('should return false for invalid checksum', async () => {
		const data = 'test-data';
		const isValid = await verifyChecksum(data, 'invalid-checksum');
		expect(isValid).toBe(false);
	});
});

describe('createMembershipChecksumData', () => {
	it('should create consistent data string', () => {
		const data = createMembershipChecksumData(
			'0x1234567890abcdef1234567890abcdef12345678',
			1,
			true,
			1735689600,
			1735603200000
		);
		expect(data).toBe(
			'membership:0x1234567890abcdef1234567890abcdef12345678:1:true:1735689600:1735603200000'
		);
	});

	it('should lowercase address', () => {
		const data = createMembershipChecksumData(
			'0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
			1,
			true,
			1735689600,
			1735603200000
		);
		expect(data).toContain('0xabcdef1234567890abcdef1234567890abcdef12');
	});

	it('should handle false membership', () => {
		const data = createMembershipChecksumData('0x123', 1, false, 0, 1735603200000);
		expect(data).toContain(':false:');
	});
});

describe('createUsageChecksumData', () => {
	it('should create consistent data string', () => {
		const data = createUsageChecksumData(
			'0x1234567890abcdef1234567890abcdef12345678',
			'balance-scanner',
			'2024-12-29',
			500
		);
		expect(data).toBe(
			'usage:0x1234567890abcdef1234567890abcdef12345678:balance-scanner:2024-12-29:500'
		);
	});

	it('should lowercase address', () => {
		const data = createUsageChecksumData(
			'0xABCDEF1234567890ABCDEF1234567890ABCDEF12',
			'feature',
			'2024-12-29',
			100
		);
		expect(data).toContain('0xabcdef1234567890abcdef1234567890abcdef12');
	});

	it('should handle zero count', () => {
		const data = createUsageChecksumData('0x123', 'feature', '2024-12-29', 0);
		expect(data).toContain(':0');
	});
});

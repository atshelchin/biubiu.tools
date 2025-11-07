import type { Address } from 'viem';

/**
 * ENS name generation patterns
 */
export type NameGenerationPattern =
	| 'birthday' // YYYYMMDD, MMDDYYYY, etc.
	| 'triple' // AAA, BBB, CCC
	| 'abab' // ABAB, CDCD
	| 'abcabc' // ABCABC
	| 'sequential' // ABC, BCD, CDE
	| 'numeric' // 001, 002, 003
	| 'custom'; // Custom pattern

/**
 * Name generation configuration
 */
export interface NameGenerationConfig {
	pattern: NameGenerationPattern;
	// Birthday pattern options
	startYear?: number;
	endYear?: number;
	format?: 'YYYYMMDD' | 'MMDDYYYY' | 'DDMMYYYY';
	// Triple/ABAB pattern options
	characters?: string; // e.g., 'abcdefghijklmnopqrstuvwxyz'
	// Sequential pattern options
	startSequence?: string;
	count?: number;
	// Numeric pattern options
	startNumber?: number;
	endNumber?: number;
	digits?: number; // Padding, e.g., 3 for 001, 002
	// Custom pattern
	prefix?: string;
	suffix?: string;
	customList?: string[];
}

/**
 * ENS name status
 */
export type ENSStatus = 'available' | 'registered' | 'expired' | 'grace-period' | 'error';

/**
 * ENS name information
 */
export interface ENSNameInfo {
	name: string; // Without .eth
	fullName: string; // With .eth
	status: ENSStatus;
	owner?: Address;
	registrationDate?: number; // Timestamp
	expiryDate?: number; // Timestamp
	resolver?: Address;
	daysUntilExpiry?: number;
	error?: string;
}

/**
 * Scan status
 */
export type ScanStatus = 'idle' | 'scanning' | 'completed' | 'error';

/**
 * Scan progress
 */
export interface ScanProgress {
	current: number;
	total: number;
	percentage: number;
	currentName?: string;
}

/**
 * Filter options
 */
export interface FilterOptions {
	status?: ENSStatus[];
	expiryDays?: {
		min?: number;
		max?: number;
	};
	sortBy?: 'name' | 'expiryDate' | 'status';
	sortOrder?: 'asc' | 'desc';
}

/**
 * Scan summary
 */
export interface ScanSummary {
	total: number;
	available: number;
	registered: number;
	expired: number;
	gracePeriod: number;
	errors: number;
}

/**
 * Export format
 */
export type ExportFormat = 'csv' | 'json';

import type { Address } from 'viem';

/**
 * Recipient wallet information
 */
export interface Recipient {
	id: string; // Unique identifier
	address: Address;
	amount?: string; // Amount to receive (optional, can be set globally)
	label?: string; // Optional label/name for the recipient
}

/**
 * Recipient import method
 */
export type RecipientImportMethod = 'manual' | 'csv' | 'paste';

/**
 * CSV import configuration
 */
export interface CSVImportConfig {
	hasHeader: boolean;
	addressColumn: number; // 0-indexed column for address
	amountColumn?: number; // Optional column for custom amounts
	labelColumn?: number; // Optional column for labels
}

/**
 * Recipient import result
 */
export interface RecipientImportResult {
	success: boolean;
	recipients: Recipient[];
	errors?: string[];
	warnings?: string[];
}

/**
 * Recipient validation error
 */
export interface RecipientValidationError {
	recipientId: string;
	field: 'address' | 'amount';
	error: string;
}

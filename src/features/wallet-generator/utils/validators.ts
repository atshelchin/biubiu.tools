/**
 * Input validation utilities for wallet generator
 */

import type { InputSourceType } from '../types/wallet';

/**
 * Validate mnemonic phrase (12 or 24 words)
 */
export function validateMnemonic(mnemonic: string): boolean {
	const words = mnemonic.trim().split(/\s+/);
	// BIP39 supports 12, 15, 18, 21, or 24 words
	const validLengths = [12, 15, 18, 21, 24];
	if (!validLengths.includes(words.length)) {
		return false;
	}
	// Basic validation - all words should be lowercase alphabetic
	return words.every((word) => /^[a-z]+$/.test(word));
}

/**
 * Validate xpub key (Bitcoin extended public key)
 */
export function validateXpub(xpub: string): boolean {
	const trimmed = xpub.trim();
	// xpub, ypub, zpub for Bitcoin
	// xpub for Ethereum (though less common)
	return /^(xpub|ypub|zpub)[a-zA-Z0-9]{107,111}$/.test(trimmed);
}

/**
 * Validate secret text (can be any non-empty string)
 */
export function validateSecretText(text: string): boolean {
	return text.trim().length >= 8;
}

/**
 * Validate input based on type
 */
export function validateInput(type: InputSourceType, value: string): boolean {
	switch (type) {
		case 'mnemonic':
			return validateMnemonic(value);
		case 'xpub':
			return validateXpub(value);
		case 'secret':
			return validateSecretText(value);
		default:
			return false;
	}
}

/**
 * Validate HD path format
 */
export function validateHDPath(path: string): boolean {
	// BIP44 format: m/purpose'/coin_type'/account'/change/address_index
	// We allow partial paths for generation
	return /^m(\/\d+'?)*$/i.test(path);
}

/**
 * Get validation error message
 */
export function getValidationError(type: InputSourceType, value: string): string {
	if (!value) {
		return 'Input is required';
	}

	switch (type) {
		case 'mnemonic': {
			const words = value.trim().split(/\s+/);
			if (![12, 15, 18, 21, 24].includes(words.length)) {
				return `Mnemonic must be 12, 15, 18, 21, or 24 words (got ${words.length})`;
			}
			if (!words.every((word) => /^[a-z]+$/.test(word))) {
				return 'All words must be lowercase alphabetic characters';
			}
			return '';
		}
		case 'xpub':
			if (!/^(xpub|ypub|zpub)/.test(value)) {
				return 'xpub must start with xpub, ypub, or zpub';
			}
			if (!/^(xpub|ypub|zpub)[a-zA-Z0-9]{107,111}$/.test(value)) {
				return 'Invalid xpub format';
			}
			return '';
		case 'secret':
			if (value.trim().length < 8) {
				return 'Secret text must be at least 8 characters';
			}
			return '';
		default:
			return 'Unknown input type';
	}
}

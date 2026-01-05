/**
 * Documentation System Configuration
 */

import type { DocsConfig } from './types';
import { localeMetas } from '@/i18n/i18n.svelte';

export const docsConfig: DocsConfig = {
	defaultLanguage: 'en',
	basePath: '/docs'
};

/**
 * Get all supported documentation languages from i18n config
 */
export function getSupportedLanguages(): string[] {
	return localeMetas.map((l) => l.code);
}

/**
 * Check if a language is supported for docs
 */
export function isValidLanguage(language: string): boolean {
	return getSupportedLanguages().includes(language);
}

/**
 * Get the default/fallback language
 */
export function getDefaultLanguage(): string {
	return docsConfig.defaultLanguage;
}

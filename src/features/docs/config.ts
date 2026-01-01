/**
 * Documentation System Configuration
 */

import type { DocsConfig } from './types';

export const docsConfig: DocsConfig = {
	versions: [
		{
			id: 'v1',
			label: 'v1.0',
			isDefault: true,
			isLatest: true
		}
		// Future versions can be added here
		// { id: 'v2', label: 'v2.0', isLatest: true }
	],
	defaultVersion: 'v1',
	basePath: '/docs'
};

/**
 * Get version by ID
 */
export function getVersion(versionId: string) {
	return docsConfig.versions.find((v) => v.id === versionId);
}

/**
 * Get default version
 */
export function getDefaultVersion() {
	return docsConfig.versions.find((v) => v.isDefault) ?? docsConfig.versions[0];
}

/**
 * Get latest version
 */
export function getLatestVersion() {
	return docsConfig.versions.find((v) => v.isLatest) ?? docsConfig.versions[0];
}

/**
 * Check if version exists
 */
export function isValidVersion(versionId: string): boolean {
	return docsConfig.versions.some((v) => v.id === versionId);
}

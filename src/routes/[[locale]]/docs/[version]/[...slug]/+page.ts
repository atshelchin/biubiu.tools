/**
 * /docs/[version]/[...slug] - Load document content
 */

import { error } from '@sveltejs/kit';
import { loadDocument, getAllDocSlugs } from '@/features/docs/utils';
import { docsConfig } from '@/features/docs/config';
import { localeMetas } from '@/i18n/i18n.svelte';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

/**
 * Generate entries for all doc pages including localized versions
 */
export const entries: EntryGenerator = async () => {
	const allEntries: { locale: string; version: string; slug: string }[] = [];

	// All locales (empty string = no locale prefix)
	const locales = ['', ...localeMetas.map((l) => l.code)];

	// Get all doc slugs for each version and locale combination
	for (const version of docsConfig.versions) {
		const slugs = await getAllDocSlugs(version.id);

		for (const locale of locales) {
			for (const slug of slugs) {
				allEntries.push({ locale, version: version.id, slug });
			}
		}
	}

	return allEntries;
};

export const load: PageLoad = async ({ params, parent }) => {
	const { version } = await parent();
	const slugParts = params.slug.split('/');

	// Expect format: category/document
	if (slugParts.length < 2) {
		error(404, 'Document not found');
	}

	const category = slugParts[0];
	const docSlug = slugParts.slice(1).join('/');

	const doc = await loadDocument(version, category, docSlug);

	if (!doc) {
		error(404, `Document "${docSlug}" not found in category "${category}"`);
	}

	return {
		doc
	};
};

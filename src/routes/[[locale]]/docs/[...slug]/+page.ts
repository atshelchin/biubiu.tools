/**
 * /docs/[...slug] - Load document content
 */

import { error } from '@sveltejs/kit';
import { loadDocument, getAllDocSlugs } from '@/features/docs/utils';
import { localeMetas } from '@/i18n/i18n.svelte';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

/**
 * Generate entries for all doc pages including localized versions
 */
export const entries: EntryGenerator = async () => {
	const allEntries: { locale: string; slug: string }[] = [];

	// All locales (empty string = no locale prefix)
	const locales = ['', ...localeMetas.map((l) => l.code)];

	// Get all doc slugs (uses default language for structure)
	const slugs = await getAllDocSlugs();

	for (const locale of locales) {
		for (const slug of slugs) {
			allEntries.push({ locale, slug });
		}
	}

	return allEntries;
};

export const load: PageLoad = async ({ params, parent }) => {
	const { language } = await parent();
	const slugParts = params.slug.split('/');

	// Expect format: category/document
	if (slugParts.length < 2) {
		error(404, 'Document not found');
	}

	const category = slugParts[0];
	const docSlug = slugParts.slice(1).join('/');

	const doc = await loadDocument(language, category, docSlug);

	if (!doc) {
		error(404, `Document "${docSlug}" not found in category "${category}"`);
	}

	return {
		doc
	};
};

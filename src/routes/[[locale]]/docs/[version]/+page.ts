/**
 * /docs/[version] - Redirect to first document
 */

import { redirect } from '@sveltejs/kit';
import { getFirstDocument } from '@/features/docs/utils';
import { docsConfig } from '@/features/docs/config';
import { localeMetas } from '@/i18n/i18n.svelte';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

// Generate entries for all locale + version combinations
export const entries: EntryGenerator = () => {
	const allEntries: { locale: string; version: string }[] = [];

	// All locales (empty string = no locale prefix)
	const locales = ['', ...localeMetas.map((l) => l.code)];

	for (const locale of locales) {
		for (const version of docsConfig.versions) {
			allEntries.push({ locale, version: version.id });
		}
	}

	return allEntries;
};

export const load: PageLoad = async ({ params }) => {
	const firstDoc = await getFirstDocument(params.version);

	if (firstDoc) {
		redirect(302, firstDoc);
	}

	// Return empty if no documents (will show empty state)
	return {};
};

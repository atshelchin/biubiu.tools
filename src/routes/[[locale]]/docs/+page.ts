/**
 * /docs - Redirect to first document
 */

import { redirect } from '@sveltejs/kit';
import { getDefaultLanguage } from '@/features/docs/config';
import { getFirstDocument } from '@/features/docs/utils';
import { localeMetas } from '@/i18n/i18n.svelte';
import type { PageLoad, EntryGenerator } from './$types';

export const prerender = true;

// Generate entries for all locales (empty string = no locale prefix)
export const entries: EntryGenerator = () => {
	return [{ locale: '' }, ...localeMetas.map((l) => ({ locale: l.code }))];
};

export const load: PageLoad = async () => {
	const firstDoc = await getFirstDocument(getDefaultLanguage());

	if (firstDoc) {
		redirect(302, firstDoc);
	}

	// Fallback - should not happen if docs exist
	redirect(302, '/');
};

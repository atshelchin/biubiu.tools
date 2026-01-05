/**
 * Docs Layout - Load navigation for sidebar
 */

import { error } from '@sveltejs/kit';
import { getDefaultLanguage } from '@/features/docs/config';
import { loadNavigation } from '@/features/docs/utils';
import { extractLocaleFromPathname } from '@/utils/common';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ url }) => {
	// Get language from URL pathname (e.g., /zh/docs/... -> 'zh')
	const language = extractLocaleFromPathname(url.pathname) || getDefaultLanguage();

	const navigation = await loadNavigation(language);

	if (!navigation) {
		error(404, `Navigation for language "${language}" not found`);
	}

	return {
		language,
		navigation
	};
};

/**
 * /docs - Redirect to default version
 */

import { redirect } from '@sveltejs/kit';
import { getDefaultVersion } from '@/features/docs/config';
import { getFirstDocument } from '@/features/docs/utils';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async () => {
	const defaultVersion = getDefaultVersion();
	const firstDoc = await getFirstDocument(defaultVersion.id);

	if (firstDoc) {
		redirect(302, firstDoc);
	}

	// Fallback to version index
	redirect(302, `/docs/${defaultVersion.id}`);
};

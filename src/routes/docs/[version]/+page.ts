/**
 * /docs/[version] - Redirect to first document
 */

import { redirect } from '@sveltejs/kit';
import { getFirstDocument } from '@/features/docs/utils';
import type { PageLoad } from './$types';

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
	const firstDoc = await getFirstDocument(params.version);

	if (firstDoc) {
		redirect(302, firstDoc);
	}

	// Return empty if no documents (will show empty state)
	return {};
};

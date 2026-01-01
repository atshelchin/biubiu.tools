/**
 * /docs/[version]/[...slug] - Load document content
 */

import { error } from '@sveltejs/kit';
import { loadDocument } from '@/features/docs/utils';
import type { PageLoad } from './$types';

export const prerender = true;

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

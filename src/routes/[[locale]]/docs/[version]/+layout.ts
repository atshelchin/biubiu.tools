/**
 * Version Layout - Load navigation for sidebar
 */

import { error } from '@sveltejs/kit';
import { isValidVersion } from '@/features/docs/config';
import { loadNavigation } from '@/features/docs/utils';
import type { LayoutLoad } from './$types';

export const prerender = true;

export const load: LayoutLoad = async ({ params }) => {
	const { version } = params;

	if (!isValidVersion(version)) {
		error(404, `Version "${version}" not found`);
	}

	const navigation = await loadNavigation(version);

	if (!navigation) {
		error(404, `Navigation for version "${version}" not found`);
	}

	return {
		version,
		navigation
	};
};

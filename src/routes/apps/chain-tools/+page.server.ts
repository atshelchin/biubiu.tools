import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	// Redirect /apps/chain-tools to /apps/chain-tools/defi
	const locale = url.pathname.startsWith('/zh/') ? '/zh' : '';
	redirect(302, `${locale}/apps/chain-tools/defi`);
};

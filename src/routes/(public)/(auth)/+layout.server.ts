import { redirect } from '@sveltejs/kit';

export const prerender = false;

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (url.pathname.includes('oauth')) return;

	if (locals.session) redirect(302, '/dashboard');
};

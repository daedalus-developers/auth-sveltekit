import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { queryCategoriesForCombobox } from '@server/queries';

export const GET: RequestHandler = async () => {
	return json({
		categories: await queryCategoriesForCombobox()
	});
};

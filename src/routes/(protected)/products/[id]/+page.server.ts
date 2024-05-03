import { queryProduct } from '@server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	return {
		product: queryProduct.execute({ id: params.id })
	};
};

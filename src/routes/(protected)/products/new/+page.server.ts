import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { productFormSchema, categoryFormSchema } from '@types';
import { queryCategoriesForCombobox } from '@server/queries';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		productForm: await superValidate(zod(productFormSchema)),
		categoryForm: await superValidate(zod(categoryFormSchema)),
		categories: await queryCategoriesForCombobox()
	};
};

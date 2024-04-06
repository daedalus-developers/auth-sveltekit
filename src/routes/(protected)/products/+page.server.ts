import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { categoryFormSchema, productFormSchema } from '@types';
import { createCategory, createProduct } from '@server/mutations/product.mutation';
import { slugifyString } from '@utils';
import { PostgresError } from 'postgres';
import { queryCategoriesForCombobox } from '@server/queries';

export const load: PageServerLoad = async () => {};

export const actions: Actions = {
	newCategory: async ({ request, locals }) => {
		if (!locals.session)
			return fail(401, {
				message: 'Unauthorized'
			});

		const form = await superValidate(request, zod(categoryFormSchema));

		if (!form.valid) return fail(400, { form });

		try {
			const [newCategory] = await createCategory({
				...form.data,
				name: slugifyString(form.data.name)
			});

			if (newCategory) {
				const categories = await queryCategoriesForCombobox();

				return message(form, {
					type: 'success',
					text: 'Category created successfully.',
					data: { categories }
				});
			}
		} catch (err) {
			const error = err as PostgresError;
			if (error.detail?.includes('exists')) {
				return setError(form, 'name', `Category with name ${form.data.name} already exists`);
			}
		}

		return message(form, {
			type: 'error',
			text: 'Something went wrong.'
		});
	},
	updateCategory: async ({ request, locals }) => {},
	newProduct: async ({ request, locals }) => {
		if (!locals.session)
			return fail(401, {
				message: 'Unauthorized'
			});

		const form = await superValidate(request, zod(productFormSchema));

		console.log(form.data);

		if (!form.valid) return fail(400, { form });

		try {
			const newProduct = await createProduct(form.data);

			if (newProduct) {
				return message(form, {
					type: 'success',
					text: 'Product created successfully.'
				});
			}
		} catch (err) {
			console.log(err);
		}
	},
	updateProduct: async ({ request, locals }) => {}
};

import { fail, message, setError, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import {
	ERROR_MESSAGE,
	categoryFormSchema,
	productFormSchema,
	type ProductStatusFilter
} from '@types';
import { createCategory, createProduct } from '@server/mutations/product.mutation';
import { slugifyString } from '@utils';
import type { PostgresError } from "postgres"

import { queryCategoriesForCombobox, queryProducts } from '@server/queries';
import { redirect } from '@sveltejs/kit';
import { PRODUCT_STATUS } from '$lib/constants';

export const load: PageServerLoad = async ({ url }) => {
	// const statusFilter = (url.searchParams.get('status') ?? 'all') as ProductStatusFilter;

	const statusQueryParam = url.searchParams.get('status');
	const statusFilter: ProductStatusFilter | 'all' =
		statusQueryParam &&
		(PRODUCT_STATUS.includes(statusQueryParam as (typeof PRODUCT_STATUS)[number]) ||
			statusQueryParam === 'all')
			? (statusQueryParam as ProductStatusFilter | 'all')
			: 'all';

	return {
		products: queryProducts(statusFilter).execute()
	};
};

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

		let productId;

		try {
			const newProductId = await createProduct(form.data);

			if (!newProductId) {
				return message(form, {
					type: 'error',
					text: 'Failed to create product.'
				});
			} else {
				productId = newProductId;
			}
		} catch (err) {
			return message(form, {
				...ERROR_MESSAGE
			});
		}

		redirect(302, `/products/${productId}`);
	},
	updateProduct: async ({ request, locals }) => {}
};

import { PRODUCT_STATUS } from '$lib/constants';
import {
	number,
	object,
	string,
	enum as zEnum,
	instanceof as zInstanceOf,
	type infer as zInfer,
	type input as zInput,
	type output as zOutput
} from 'zod';

export type ProductStatusFilter = 'all' | (typeof PRODUCT_STATUS)[number];

export const categoryFormSchema = object({
	name: string()
		.min(1, 'Category name is required')
		.refine(
			(value) => {
				const words = value.split(/[ &]/);
				return words.length <= 3;
			},
			{
				message: 'Category name must contain at most three words separated by spaces or ampersands.'
			}
		),
	parent: string().optional()
});

export type CreateCategory = zInput<typeof categoryFormSchema>;

export type CategoryFormSchema = typeof categoryFormSchema;

export const productAssetsSchema = object({
	id: number(),
	productId: string(),
	url: string(),
	type: string().optional()
});

export const productVariantsSchema = object({
	id: number(),
	productId: string(),
	sku: string().default(''),
	name: string().optional(),
	value: string().optional(),
	price: number().default(0),
	quantity: number().default(0),
	createdAt: string().datetime(),
	updatedAt: string().datetime()
});

export const productStatus = zEnum([...PRODUCT_STATUS]).default('draft');

export const productSchema = object({
	id: string(),
	name: string()
		.min(1, 'Product Name is required')
		.max(100, 'Product Name must be at most 100 characters long.')
		.regex(/^[A-Za-z0-9\s-]+$/, {
			message: 'Product Name must only contain letters, numbers, spaces, hyphens'
		}),
	description: string(),
	status: productStatus,
	category: string().min(1, 'Please Select a category'),
	createdAt: string().datetime(),
	updatedAt: string().datetime(),
	assets: productAssetsSchema.array(),
	variants: productVariantsSchema.array()
});

export type Product = zInfer<typeof productSchema>;

export const productVariantFormSchema = productVariantsSchema.extend({
	id: productVariantsSchema.shape.id.optional(),
	sku: productVariantsSchema.shape.sku.optional(),
	productId: productVariantsSchema.shape.productId.optional(),
	createdAt: productVariantsSchema.shape.createdAt.optional(),
	updatedAt: productVariantsSchema.shape.updatedAt.optional()
});

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const productFormSchema = productSchema.extend({
	id: productSchema.shape.id.optional(),
	createdAt: productSchema.shape.createdAt.optional(),
	updatedAt: productSchema.shape.updatedAt.optional(),
	assets: productAssetsSchema
		.extend({
			id: productAssetsSchema.shape.id.optional(),
			productId: productAssetsSchema.shape.productId.optional(),
			url: zInstanceOf(File)
				.refine((f) => f.size < MAX_FILE_SIZE, 'Max 10MB upload size.')
				.refine(
					(f) => f.type.startsWith('image/') || f.type.startsWith('video/'),
					'Only images and videos are allowed.'
				)
				.optional()
		})
		.array(),
	variants: productVariantFormSchema
		.extend({
			price: string().regex(/^\d+(\.\d{1,2})?$/, {
				message: 'Invalid input, Must be a number with up to two decimal points.'
			}),
			quantity: string().regex(/^\d+$/, {
				message: 'Invalid input, Must be a real number without decimal point and negative values.'
			})
		})
		.array()
});

export type CreateProdcut = zInput<typeof productFormSchema>;

export type ProductFormSchema = typeof productFormSchema;

export type ProductVariant = zInfer<typeof productVariantFormSchema>;

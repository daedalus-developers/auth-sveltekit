import { eq, sql } from 'drizzle-orm';
import { db } from '@server/db';
import { categories, products, productVariants } from '@server/schemas/product.schema';
import { generateId } from 'lucia';
import type { CreateProdcut, CreateCategory } from '@types';
import { generateSKU } from '@utils';

export const createProduct = async (data: CreateProdcut) => {
	const newProduct = await db.transaction(async (tx) => {
		const [newProduct] = await tx
			.insert(products)
			.values({
				id: generateId(15),
				name: data.name,
				category: data.category
			})
			.returning();

		const newProductVariants = data.variants.map((variant, index) => ({
			productId: newProduct.id,
			sku: generateSKU(newProduct.name, variant.name, variant.value, index),
			name: index === 0 && data.variants.length === 1 ? 'Default' : variant.name,
			value: variant.value,
			quantity: Number(variant.quantity),
			price: Number(variant.price)
		}));

		await tx.insert(productVariants).values(newProductVariants);

		return await tx.query.products.findFirst({
			where: eq(products.id, newProduct.id),
			with: {
				assets: true,
				variants: true
			}
		});
	});
	return newProduct;
};

export const createCategory = async (data: CreateCategory) =>
	db.insert(categories).values(data).returning();

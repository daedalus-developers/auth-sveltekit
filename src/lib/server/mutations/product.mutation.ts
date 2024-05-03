import { eq, sql } from 'drizzle-orm';
import { db } from '@server/db';
import { categories, products, productVariants } from '@server/schemas/product.schema';
import { generateId } from 'lucia';
import type { CreateProdcut, CreateCategory } from '@types';
import { generateSKU } from '@utils';

export const createProduct = async (data: CreateProdcut): Promise<string> => {
	const productId = await db.transaction(async (tx) => {
		// Insert product and get returning id
		const [newProduct] = await tx
			.insert(products)
			.values({
				id: generateId(15),
				name: data.name,
				status: data.status,
				category: data.category,
				description: data.description
			})
			.returning({
				id: products.id,
				name: products.name
			});

		const newProductVariants = data.variants.map((variant, index) => ({
			productId: newProduct.id,
			sku: generateSKU(newProduct.name, variant.name, variant.value, index),
			name: index === 0 && data.variants.length === 1 ? 'Default' : variant.name,
			value: variant.value,
			quantity: Number(variant.quantity),
			price: Number(variant.price)
		}));

		await tx.insert(productVariants).values(newProductVariants).returning();

		return newProduct.id;
	});
	return productId;
};

export const createCategory = async (data: CreateCategory) =>
	db.insert(categories).values(data).returning();

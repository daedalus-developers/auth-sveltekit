// NOTE:Do not touch this import statement , it will break migrations;
import { PRODUCT_STATUS } from '../../constants/shared.constant';
import { timestamp, pgTable, text, doublePrecision, integer, serial } from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
	name: text('name').notNull().primaryKey(),
	parent: text('parent_category')
});

export const products = pgTable('products', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	status: text('status', { enum: [...PRODUCT_STATUS] })
		.notNull()
		.default('draft'),
	category: text('category')
		.notNull()
		.references(() => categories.name, { onDelete: 'restrict' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const productAssets = pgTable('product_assets', {
	id: serial('id').primaryKey(),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, { onDelete: 'cascade' }),
	url: text('asset_url').notNull(),
	type: text('asset_key')
});

export const productVariants = pgTable('product_variants', {
	id: serial('id').primaryKey(),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, {
			onDelete: 'cascade'
		}),
	sku: text('sku').notNull().unique(),
	name: text('name'),
	value: text('value'),
	price: doublePrecision('price').default(0),
	quantity: integer('quantity').default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

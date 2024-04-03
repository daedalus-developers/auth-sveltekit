import { timestamp, pgTable, text, doublePrecision, integer } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	status: text('status', { enum: ['active', 'draft', 'archived'] })
		.notNull()
		.default('draft'),
	price: doublePrecision('price').default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const variants = pgTable('variants', {
	id: text('id').notNull().primaryKey(),
	productId: text('product_id')
		.notNull()
		.references(() => products.id, {
			onDelete: 'cascade'
		}),
	sku: text('name').notNull().unique(),
	name: text('name').notNull(),
	price: doublePrecision('price').default(0),
	quantity: integer('quantity').default(0),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const variantsAssets = pgTable('product_assets', {
	id: text('id').notNull().primaryKey(),
	variantId: text('product_id')
		.notNull()
		.references(() => variants.id, { onDelete: 'cascade' }),
	url: text('asset_url').notNull(),
	name: text('asset_key').notNull()
});

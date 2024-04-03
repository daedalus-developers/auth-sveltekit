import { timestamp, pgTable, text, doublePrecision, integer } from 'drizzle-orm/pg-core';
import { products, variants } from './product.schema';

export const customers = pgTable('customer', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const customerAddresses = pgTable('customer_addresses', {
	id: text('id').notNull().primaryKey(),
	label: text('label', { enum: ['home', 'work', 'other'] })
		.notNull()
		.default('home'),
	customerId: text('customer_id')
		.notNull()
		.references(() => customers.id, { onDelete: 'cascade' }),
	addressLine1: text('address_line_1').notNull(),
	addressLine2: text('address_line_2'),
	city: text('city').notNull(),
	stateProvince: text('state').notNull(),
	postalCode: text('postal_code').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const orders = pgTable('orders', {
	id: text('id').notNull().primaryKey(),
	customerId: text('customer_id').references(() => customers.id, { onDelete: 'restrict' }),
	orderDate: timestamp('order_date').notNull().defaultNow(),
	status: text('status', { enum: ['draft', 'quotation', 'canceled', 'confirmed', 'invoiced'] })
		.notNull()
		.default('draft'),
	note: text('note').notNull().default(''),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const orderItems = pgTable('order_items', {
	id: text('id').notNull().primaryKey(),
	orderId: text('order_id').references(() => orders.id, { onDelete: 'restrict' }),
	productId: text('product_id').references(() => products.id, { onDelete: 'restrict' }),
	variantId: text('variant_id').references(() => variants.id, { onDelete: 'restrict' }),
	quantity: integer('quantity').notNull(),
	unitPrice: doublePrecision('unit_price').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const invoices = pgTable('invoices', {
	id: text('id').notNull().primaryKey(),
	orderId: text('order_id')
		.notNull()
		.references(() => orders.id, { onDelete: 'restrict' }),
	deliveryAddressId: text('delivery_address_id').references(() => customerAddresses.id, {
		onDelete: 'set null'
	}),
	issued: timestamp('issued').notNull().defaultNow(),
	status: text('status', { enum: ['paid', 'unpaid'] })
});

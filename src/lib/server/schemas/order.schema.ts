// NOTE:Do not touch this import statement , it will break migrations;
import {
	CUSTOMER_ADDRESS_LABELS,
	INVOICE_STATUS,
	ORDER_STATUS
} from '../../constants/shared.constant';
import { timestamp, pgTable, text, doublePrecision, integer, serial } from 'drizzle-orm/pg-core';
import { productVariants, products } from './product.schema';

export const customers = pgTable('customer', {
	id: text('id').notNull().primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const customerAddresses = pgTable('customer_addresses', {
	id: serial('id').primaryKey(),
	label: text('label', { enum: [...CUSTOMER_ADDRESS_LABELS] })
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
	status: text('status', { enum: [...ORDER_STATUS] })
		.notNull()
		.default('draft'),
	note: text('note').notNull().default(''),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const orderItems = pgTable('order_items', {
	id: serial('id').primaryKey(),
	orderId: text('order_id').references(() => orders.id, { onDelete: 'restrict' }),
	productId: text('product_id').references(() => products.id, { onDelete: 'restrict' }),
	variantId: integer('variant_id').references(() => productVariants.id, { onDelete: 'restrict' }),
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
	deliveryAddressId: integer('delivery_address_id').references(() => customerAddresses.id, {
		onDelete: 'set null'
	}),
	issued: timestamp('issued').notNull().defaultNow(),
	status: text('status', { enum: [...INVOICE_STATUS] })
});

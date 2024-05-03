import { relations } from 'drizzle-orm';
import { sessionDetails, sessions, userDetails, users } from './user.schema';
import { categories, productAssets, products, productVariants } from './product.schema';
import { customerAddresses, customers, orderItems, orders } from './order.schema';

export const usersRelations = relations(users, ({ one, many }) => ({
	details: one(userDetails),
	sessions: many(sessions)
}));

export const userDetailsRelations = relations(userDetails, ({ one }) => ({
	user: one(users, {
		fields: [userDetails.userId],
		references: [users.id]
	})
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
	details: one(sessionDetails)
}));

export const sessionDetailsRelations = relations(sessionDetails, ({ one }) => ({
	session: one(sessions, {
		fields: [sessionDetails.sessionId],
		references: [sessions.id]
	})
}));

export const categoriesRelations = relations(categories, ({ one }) => ({
	parent: one(categories, {
		fields: [categories.parent],
		references: [categories.name]
	})
}));

export const productsRelations = relations(products, ({ many }) => ({
	variants: many(productVariants),
	assets: many(productAssets)
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
	product: one(products, {
		fields: [productVariants.productId],
		references: [products.id]
	})
}));

export const productAssetsRelations = relations(productAssets, ({ one }) => ({
	product: one(products, {
		fields: [productAssets.productId],
		references: [products.id]
	})
}));

export const customersRelations = relations(customers, ({ many }) => ({
	orders: many(orders),
	addresses: many(customerAddresses)
}));

export const customerAddressesRelations = relations(customerAddresses, ({ one }) => ({
	customer: one(customers, {
		fields: [customerAddresses.customerId],
		references: [customers.id]
	})
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
	customer: one(customers, {
		fields: [orders.customerId],
		references: [customers.id]
	}),
	items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
	order: one(orders, {
		fields: [orderItems.orderId],
		references: [orders.id]
	}),
	product: one(products, {
		fields: [orderItems.productId],
		references: [products.id]
	}),
	variant: one(productVariants, {
		fields: [orderItems.variantId],
		references: [productVariants.id]
	})
}));

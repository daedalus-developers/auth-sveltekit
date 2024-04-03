import { relations } from 'drizzle-orm';
import { sessionDetails, sessions, userDetails, users } from './user.schema';
import { products, variants, variantsAssets } from './product.schema';
import { customerAddresses, customers, orderItems, orders } from './order.schema';

export const usersRelations = relations(users, ({ one, many }) => ({
	details: one(userDetails),
	sessions: many(sessions)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
	details: one(sessionDetails)
}));

export const productsRelations = relations(products, ({ many }) => ({
	variants: many(variants)
}));

export const variantsRelations = relations(variants, ({ one, many }) => ({
	product: one(products, {
		fields: [variants.productId],
		references: [products.id]
	}),
	assets: many(variantsAssets)
}));

export const variantAssets = relations(variantsAssets, ({ one }) => ({
	variant: one(variants, {
		fields: [variantsAssets.variantId],
		references: [variants.id]
	})
}));

export const customersRelations = relations(customers, ({ many }) => ({
	orders: many(orders),
	addresses: many(customerAddresses)
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
	variant: one(variants, {
		fields: [orderItems.variantId],
		references: [variants.id]
	})
}));

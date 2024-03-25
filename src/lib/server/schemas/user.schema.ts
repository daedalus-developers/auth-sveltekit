import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { timestamp, boolean, primaryKey, pgTable, text } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').unique(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false),
	password: text('password').notNull(),
	twoFactorSecret: text('two_factor_secret'),
	role: text('role', { enum: ['super', 'admin', 'tenant', 'user'] })
		.notNull()
		.default('user'),
	createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true }).notNull().defaultNow()
});

export const userDetails = pgTable(
	'users_details',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		name: text('name'),
		bio: text('bio'),
		updatedAt: timestamp('updated_at', { precision: 6, withTimezone: true }).notNull().defaultNow()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId] })
		};
	}
);

export const usersOtp = pgTable(
	'users_otp',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		providerKey: text('provider_key').notNull(),
		otp: text('otp').notNull(),
		expiresAt: timestamp('expires_at', { precision: 6, withTimezone: true }).notNull().defaultNow()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.providerKey] })
		};
	}
);

export const passwordResetToken = pgTable(
	'password_reset_token',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		tokenHash: text('token_hash').notNull().unique(),
		expiresAt: timestamp('expires_at', { precision: 6, withTimezone: true }).notNull()
	},

	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.tokenHash] })
		};
	}
);

export const sessions = pgTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade'
		}),
	expiresAt: timestamp('expires_at', { precision: 6, withTimezone: true }).notNull(),
	fresh: boolean('fresh').notNull().default(true)
});

export const oAuthAccounts = pgTable(
	'oauth_account',
	{
		provider: text('provider').notNull(),
		providerAccountId: text('provider_account_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		createdAt: timestamp('created_at', { precision: 6, withTimezone: true }).notNull().defaultNow()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.provider, table.providerAccountId, table.userId] })
		};
	}
);

export type UserSchema = InferSelectModel<typeof users>;
export type UserInsertSchema = InferInsertModel<typeof users>;

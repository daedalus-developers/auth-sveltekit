import { sql, type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').unique(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),
	password: text('password').notNull(),
	twoFactorSecret: text('two_factor_secret'),
	role: text('role', { enum: ['super', 'admin', 'tenant', 'user'] })
		.notNull()
		.default('user'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(strftime('%s', 'now'))`)
});

export const userDetails = sqliteTable(
	'users_details',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		name: text('name'),
		bio: text('bio'),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(strftime('%s', 'now'))`)
	},
	(table) => {
		return {
			pk: primaryKey({ name: 'id', columns: [table.userId] })
		};
	}
);

export const usersOtp = sqliteTable(
	'users_otp',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		providerKey: text('provider_key').notNull(),
		otp: text('otp').notNull(),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
	},
	(table) => {
		return {
			pk: primaryKey({ name: 'id', columns: [table.userId, table.providerKey] })
		};
	}
);

export const passwordResetToken = sqliteTable(
	'password_reset_token',
	{
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		tokenHash: text('token_hash').notNull().unique(),
		expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull()
	},

	(table) => {
		return {
			pk: primaryKey({ name: 'id', columns: [table.userId, table.tokenHash] })
		};
	}
);

export const sessions = sqliteTable('session', {
	id: text('id').notNull().primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, {
			onDelete: 'cascade'
		}),
	expiresAt: integer('expires_at').notNull(),
	fresh: integer('fresh', { mode: 'boolean' }).notNull().default(true)
});

export const oAuthAccounts = sqliteTable(
	'oauth_account',
	{
		provider: text('provider').notNull(),
		providerAccountId: text('provider_account_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => users.id, {
				onDelete: 'cascade'
			}),
		createdAt: integer('created_at', { mode: 'timestamp' })
			.notNull()
			.default(sql`(strftime('%s', 'now'))`)
	},
	(table) => {
		return {
			pk: primaryKey({ name: 'id', columns: [table.provider, table.providerAccountId] })
		};
	}
);

export type UserSchema = InferSelectModel<typeof users>;
export type UserInsertSchema = InferInsertModel<typeof users>;

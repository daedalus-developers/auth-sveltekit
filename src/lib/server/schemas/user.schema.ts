import { type InferInsertModel, type InferSelectModel } from 'drizzle-orm';
import { timestamp, boolean, primaryKey, pgTable, text } from 'drizzle-orm/pg-core';

export const users = pgTable('user', {
	id: text('id').notNull().primaryKey(),
	username: text('username').unique(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false),
	password: text('password').notNull(),
	avatar: text('avatar'),
	twoFactorSecret: text('two_factor_secret'),
	role: text('role', { enum: ['super', 'admin', 'tenant', 'user'] })
		.notNull()
		.default('user'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
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
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId] })
		};
	}
);

export const userDetailsUrls = pgTable(
	'users_details_urls',
	{
		userId: text('user_id')
			.notNull()
			.references(() => userDetails.userId, {
				onDelete: 'cascade'
			}),
		url: text('url').notNull(),
		updatedAt: timestamp('updated_at').notNull().defaultNow()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.url] })
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
	expiresAt: timestamp('expires_at').notNull(),
	fresh: boolean('fresh').notNull().default(true)
});

export const sessionDetails = pgTable('session_details', {
	id: text('id').notNull().primaryKey(),
	sessionId: text('session_id')
		.notNull()
		.references(() => sessions.id, {
			onDelete: 'cascade'
		}),
	userAgent: text('user_agent').notNull(),
	country: text('country'),
	stateProvince: text('state_province'),
	city: text('city'),
	latitude: text('latitude'),
	longitude: text('longitude'),
	ipAddress: text('ip_address'),
	isp: text('isp'),
	timeZone: text('time_zone')
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
		createdAt: timestamp('created_at').notNull().defaultNow()
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.provider, table.providerAccountId, table.userId] })
		};
	}
);

export type UserSchema = InferSelectModel<typeof users>;
export type UserInsertSchema = InferInsertModel<typeof users>;
export type UserDetailsSchema = InferSelectModel<typeof userDetails>;
export type UserDetailsInsertSchema = InferInsertModel<typeof userDetails>;

export type SessionSchema = InferSelectModel<typeof sessions>;
export type SessionInsertSchema = InferInsertModel<typeof sessions>;

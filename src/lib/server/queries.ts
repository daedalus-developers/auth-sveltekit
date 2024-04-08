import { or, eq, sql, and } from 'drizzle-orm';
import { db } from './db';
import { categories, oAuthAccounts, products, sessionDetails, sessions, users } from './schemas';
import type { SelectType } from '@types';
import { unslugifyString } from '@utils';

export const queryUsers = db.select().from(users).prepare('query_users');

export const queryUserForAuth = db
	.select({
		id: users.id,
		email: users.email,
		password: users.password,
		twoFactorSecret: users.twoFactorSecret
	})
	.from(users)
	.where(eq(users.id, sql.placeholder('id')))
	.prepare('query_user_for_auth');

export const queryUserForOtpByEmail = db
	.select({ id: users.id, email: users.email })
	.from(users)
	.where(eq(users.email, sql.placeholder('email')))
	.prepare('query_user_for_otp_by_email');

export const queryUserForOtpById = db
	.select({ id: users.id, email: users.email })
	.from(users)
	.where(eq(users.id, sql.placeholder('id')))
	.prepare('query_user_for_otp_by_id');

export const queryUserUsernames = db
	.select({ username: users.username })
	.from(users)
	.prepare('query_user_usernames');

export const queryUserEmails = db
	.select({ email: users.email })
	.from(users)
	.prepare('query_user_emails');

export const queryUserIdAndPassword = db
	.select({ id: users.id, password: users.password, twoFactorSecret: users.twoFactorSecret })
	.from(users)
	.where(
		or(eq(users.email, sql.placeholder('email')), eq(users.username, sql.placeholder('username')))
	)
	.prepare('query_user_id_and_password');

export const queryUserByEmail = db
	.select({ id: users.id, email: users.email, username: users.username })
	.from(users)
	.where(eq(users.email, sql.placeholder('email')))
	.prepare('query_user_by_email');

export const queryUseroAuthAccounts = db
	.select()
	.from(oAuthAccounts)
	.where(eq(oAuthAccounts.userId, sql.placeholder('userId')))
	.prepare('query_user_oauth_accounts');

export const queryUserOAuthAccountByProvider = db
	.select()
	.from(oAuthAccounts)
	.where(
		and(
			eq(oAuthAccounts.providerAccountId, sql.placeholder('providerAccountId')),
			eq(oAuthAccounts.provider, sql.placeholder('provider'))
		)
	)
	.prepare('query_user_oauth_account_by_provider');

export const queryUserOAuthAccountByProviderAccountId = db
	.select()
	.from(oAuthAccounts)
	.where(eq(oAuthAccounts.providerAccountId, sql.placeholder('providerAccountId')))
	.prepare('query_user_oauth_account_by_provider_account_id');

export const queryUserSessions = db
	.select()
	.from(sessions)
	.leftJoin(sessionDetails, eq(sessions.id, sessionDetails.sessionId))
	.where(eq(sessions.userId, sql.placeholder('id')))
	.prepare('query_user_sessions');

export const queryCheckUsername = db
	.select({ username: users.username })
	.from(users)
	.where(eq(users.username, sql.placeholder('username')))
	.prepare('query_user_usernames');

export const queryProduct = db.query.products
	.findFirst({
		where: eq(products.id, sql.placeholder('id')),
		with: {
			variants: true,
			assets: true
		}
	})
	.prepare('query_product');

export const queryProducts = db.query.products
	.findMany({
		with: {
			variants: true,
			assets: true
		}
	})
	.prepare('query_products');

export const queryCategories = db.select().from(categories).prepare('query_categories');

export const queryCategoriesForCombobox = (): Promise<{ value: string; label: string }[]> =>
	db
		.select()
		.from(categories)
		.then((categories) =>
			categories.map((category) => {
				return {
					value: category.name,
					label: unslugifyString(category.name)
				};
			})
		);

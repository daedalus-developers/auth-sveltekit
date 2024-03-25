import { or, eq, sql } from 'drizzle-orm';
import { db } from './db';
import { oAuthAccounts, users } from './schemas';

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
	.select({ id: users.id, email: users.email })
	.from(users)
	.where(eq(users.email, sql.placeholder('email')))
	.prepare('query_user_by_email');

export const queryUseroAuthAccounts = db
	.select()
	.from(oAuthAccounts)
	.where(eq(oAuthAccounts.userId, sql.placeholder('userId')))
	.prepare('query_user_oauth_accounts');

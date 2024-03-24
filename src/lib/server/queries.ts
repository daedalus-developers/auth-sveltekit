import { or, eq, sql } from 'drizzle-orm';
import { db } from './db';
import { oAuthAccounts, users } from './schema';

export const queryUsers = db.select().from(users).prepare();

export const queryUserForAuth = db
	.select({
		id: users.id,
		email: users.email,
		password: users.password,
		twoFactorSecret: users.twoFactorSecret
	})
	.from(users)
	.where(eq(users.id, sql.placeholder('id')))
	.prepare();

export const queryUserForOtpByEmail = db
	.select({ id: users.id, email: users.email })
	.from(users)
	.where(eq(users.email, sql.placeholder('email')))
	.prepare();

export const queryUserForOtpById = db
	.select({ id: users.id, email: users.email })
	.from(users)
	.where(eq(users.id, sql.placeholder('id')))
	.prepare();

export const queryUserUsernames = db.select({ username: users.username }).from(users).prepare();

export const queryUserEmails = db.select({ email: users.email }).from(users).prepare();

export const queryUserIdAndPassword = db
	.select({ id: users.id, password: users.password, twoFactorSecret: users.twoFactorSecret })
	.from(users)
	.where(
		or(eq(users.email, sql.placeholder('email')), eq(users.username, sql.placeholder('username')))
	)
	.prepare();

export const queryUserByEmail = db
	.select({ id: users.id, email: users.email })
	.from(users)
	.where(eq(users.email, sql.placeholder('email')))
	.prepare();

export const queryUseroAuthAccounts = db
	.select()
	.from(oAuthAccounts)
	.where(eq(oAuthAccounts.userId, sql.placeholder('userId')))
	.prepare();

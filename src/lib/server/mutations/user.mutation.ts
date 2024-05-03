import { eq } from 'drizzle-orm';
import { db } from '@server/db';
import { oAuthAccounts, sessionDetails, users } from '@server/schemas';
import { logger } from '@server/utils';
import type { SessionDetails } from '@types';
import { generateId } from 'lucia';

export const verifyUserEmail = async (id: string) =>
	await db.update(users).set({ emailVerified: true }).where(eq(users.id, id));

export const updateUserUsername = async (id: string, username: string): Promise<boolean> => {
	try {
		await db.update(users).set({ username }).where(eq(users.id, id));
		return true;
	} catch (error) {
		logger.error(error);
		return false;
	}
};

type CreateUserParams = {
	userId: string;
	email: string;
	username: string;
	hashedPassword: string;
	emailVerified: boolean;
	avatar?: string;
};

export const createUser = async (user: CreateUserParams) =>
	await db
		.insert(users)
		.values({
			id: user.userId,
			username: user.username,
			email: user.email,
			password: user.hashedPassword,
			emailVerified: user.emailVerified,
			avatar: user.avatar
		})
		.returning({
			id: users.id,
			email: users.email
		});

type LinkUserOAuthParams = {
	userId: string;
	provider: string;
	providerAccountId: string;
};

export const linkUserOAuth = async (user: LinkUserOAuthParams) =>
	await db
		.insert(oAuthAccounts)
		.values({
			userId: user.userId,
			provider: user.provider,
			providerAccountId: user.providerAccountId
		})
		.returning({ id: oAuthAccounts.userId });

export const createSessionDetails = async (sessionId: string, details: SessionDetails) =>
	await db.insert(sessionDetails).values({
		...details,
		id: generateId(15),
		sessionId
	});

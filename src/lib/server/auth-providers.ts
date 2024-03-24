import { env } from '$env/dynamic/private';
import { GitHub, Google } from 'arctic';
import { generateId } from 'lucia';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { Argon2id } from 'oslo/password';
import { oAuthAccounts, users } from '@server/schema';
import { db } from '@server/db';
import { queryUserByEmail } from './queries';

export type GitHubUserResponse = {
	email: string;
	primary: boolean;
	verified: boolean;
};

export type GoogleUserResponse = {
	name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
};

export const getProvider = (provider: string) => {
	switch (provider) {
		case 'github':
			return new GitHub(env.GITHUB_CLIENT_ID, env.GITHUB_CLIENT_SECRET, {
				redirectURI: env.GITHUB_CALLBACK_URL
			});
		case 'google':
			return new Google(env.GOOGLE_CLIENTID, env.GOOGLE_CLIENTSECRET, env.GOOGLE_CALLBACK_URL);
	}
};

const linkUserAccount = async (
	userId: string,
	provider: string,
	providerAccountId: string
): Promise<string | undefined> => {
	try {
		await db
			.insert(oAuthAccounts)
			.values({
				userId,
				provider,
				providerAccountId
			})
			.onConflictDoNothing();
		return userId;
	} catch (error) {
		return undefined;
	}
};

const registerUser = async (email: string, provider: string): Promise<string | undefined> => {
	const userId = generateId(15);
	const generatedPassword = generateRandomString(16, alphabet('a-z', 'A-Z', '0-9', '-'));
	const hashedPassword = await new Argon2id().hash(generatedPassword);

	try {
		const [user] = await db
			.insert(users)
			.values({ id: userId, username: email, email, password: hashedPassword, emailVerified: true })
			.returning({
				id: users.id,
				email: users.email
			});

		return await linkUserAccount(user.id, provider, email);
	} catch (error) {
		return undefined;
	}
};

export const createOrLinkUser = async (
	email: string,
	provider: string
): Promise<string | undefined> => {
	try {
		const [user] = await queryUserByEmail.execute({ email: email });

		if (!user) {
			const register = await registerUser(email, provider);

			return register;
		} else {
			const linked = await linkUserAccount(user.id, provider, email);

			return linked;
		}
	} catch (error) {
		return undefined;
	}
};

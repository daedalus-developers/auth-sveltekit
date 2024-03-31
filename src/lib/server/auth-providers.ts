import { env } from '$env/dynamic/private';
import { GitHub, Google } from 'arctic';
import { generateId } from 'lucia';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { Argon2id } from 'oslo/password';
import { oAuthAccounts, users } from '@server/schemas';
import { db } from '@server/db';
import { queryUserByEmail } from './queries';
import { createUser, linkUserOAuth } from './mutations';
import { logger } from './utils';
import { generateNewUserCredentials } from './auth';

export type GithubUserResponse = {
	login: string;
	avatar_url: string;
	name: string;
	email: string;
};

export type GithubUserEmail = {
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

export type TransformedOauthResponse = {
	username?: string;
	name: string;
	avatar: string;
	email: string;
	verified: boolean;
};

export const getTransformedResponse = (
	user: { details: GithubUserResponse; emails: Array<GithubUserEmail> } | GoogleUserResponse
): Array<TransformedOauthResponse> => {
	const data: Array<TransformedOauthResponse> = [];
	if ('email_verified' in user) {
		data.push({
			username: user.email.split('@')[0],
			name: user.name,
			avatar: user.picture,
			email: user.email,
			verified: user.email_verified
		});
	} else {
		user.emails.forEach((email) => {
			data.push({
				username: user.details.login,
				name: user.details.name,
				avatar: user.details.avatar_url,
				email: email.email,
				verified: email.verified
			});
		});
	}

	return data;
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

export const linkUserAccount = async (user: {
	userId: string;
	provider: string;
	providerAccountId: string;
}) =>
	await db
		.insert(oAuthAccounts)
		.values({
			userId: user.userId,
			provider: user.provider,
			providerAccountId: user.providerAccountId
		})
		.returning({ id: oAuthAccounts.userId });

export const signUpUserWithOAuth = async (
	email: string,
	provider: string
): Promise<string | undefined> => {
	try {
		const [user] = await queryUserByEmail.execute({ email: email });

		if (!user) {
			const { userId, hashedPassword } = await generateNewUserCredentials();

			const [newUser] = await createUser({
				userId,
				username: email,
				email,
				hashedPassword,
				emailVerified: true
			});

			if (!newUser) return undefined;

			// const [link] = await linkUserOAuth(newUser.id, provider, email);

			// if (!link) return undefined;

			return newUser.id;
		}

		return user.id;
	} catch (error) {
		logger.error(error);
		return undefined;
	}
};
